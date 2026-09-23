import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const gitCommand = new Command('git');

const pull = new Command('pull')
    .description('Scan a directory (and optionally its immediate children) and run git pull on any git repositories found')
    .argument('[rootPath]', 'Path to scan (defaults to current working directory)')
    .option('-d, --depth <number>', 'scan depth: 0 = only root, 1 = root + immediate children (default: 1)')
    .option('-m, --match <pattern...>', 'only update repositories that match these patterns (variadic; supports * wildcards)')
    .option('-x, --exclude <pattern...>', 'exclude repositories that match these patterns (variadic; supports * wildcards)')
    .option('-n, --dry-run', 'list matched repositories without executing git pull')
    .option('-i, --ignore-case', 'make name matching case-insensitive')
    .option('-R, --match-regex', 'treat match patterns as raw regular expressions')
    .addHelpText('after', 
`Examples:
  wycli git pull
    Scan the current directory for git repositories and update them.
  wycli git pull C:/repos --depth 1
    Scan the root folder and its immediate child folders of C:/repos.
  wycli git pull C:/repos --depth 0 --dry-run
    Preview which repos would be updated without running git pull.
  wycli git pull C:/repos -m "my-app*" -n
    Only match repository names starting with my-app and list them without updating.
  wycli git pull C:/repos -m "*frontend*" -x "*legacy*" --dry-run
    Include frontend repos but exclude legacy ones in preview mode.
  wycli git pull C:/repos -m "app-*" -i --match-regex
    Match repository names using a regex pattern and ignore case.`)
    .action((rootPath: string | undefined, options: any) => {
        const resolvedRoot = rootPath
            ? path.resolve(rootPath)
            : process.cwd();

        // depth:
        // 0 = root only
        // 1 = root + immediate children
        // 2 = root + children + grandchildren
        const depth = (() => {
            const d = options.depth;

            if (d === undefined || d === null) {
                return 1;
            }

            const n = Number(String(d).replace(/^=+/, '').trim());

            return Number.isFinite(n) && n >= 0
                ? Math.floor(n)
                : 1;
        })();

        const matchPatterns: string[] = Array.isArray(options.match)
            ? options.match
            : options.match
                ? [options.match]
                : [];

        const excludePatterns: string[] = Array.isArray(options.exclude)
            ? options.exclude
            : options.exclude
                ? [options.exclude]
                : [];

        const dryRun = !!options.dryRun;
        const ignoreCase = !!options.ignoreCase;
        const matchRegexMode = !!options.matchRegex;

        /**
         * Convert a wildcard pattern to RegExp.
         *
         * Supported:
         *
         * foo       -> exactly "foo"
         * foo*      -> starts with "foo"
         * *foo      -> ends with "foo"
         * *foo*     -> contains "foo"
         * foo*bar   -> starts with foo and ends with bar
         *
         * Only "*" has special wildcard meaning.
         * Everything else is treated literally.
         */
        function wildcardToRegex(pattern: string): RegExp {
            const escaped = pattern
                .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
                .replace(/\*/g, '.*');

            return new RegExp(`^${escaped}$`, ignoreCase ? 'i' : undefined);
        }

        /**
         * Compile either a raw regex or a wildcard pattern.
         */
        function patternToRegex(
            pattern: string,
            treatAsRegex = false
        ): RegExp {
            if (treatAsRegex) {
                try {
                    return new RegExp(
                        pattern,
                        ignoreCase ? 'i' : undefined
                    );
                } catch {
                    // Invalid regex:
                    // fallback to literal string matching
                    const escaped = pattern.replace(
                        /[.+?^${}()|[\]\\]/g,
                        '\\$&'
                    );

                    return new RegExp(
                        `^${escaped}$`,
                        ignoreCase ? 'i' : undefined
                    );
                }
            }

            return wildcardToRegex(pattern);
        }

        /**
         * Normalize CLI input.
         *
         * Examples:
         *
         * =foo*       -> foo*
         * "'foo*'"    -> foo*
         * '"foo*"'    -> foo*
         */
        function normalizePatternInput(p: string): string {
            if (p === undefined || p === null) {
                return '';
            }

            let s = String(p)
                .trim()
                .replace(/^=+/, '')
                .trim();

            if (
                (s.startsWith("'") && s.endsWith("'")) ||
                (s.startsWith('"') && s.endsWith('"'))
            ) {
                s = s.slice(1, -1).trim();
            }

            return s;
        }

        const normalizedMatchPatterns = matchPatterns
            .map(normalizePatternInput)
            .filter(Boolean);

        const normalizedExcludePatterns = excludePatterns
            .map(normalizePatternInput)
            .filter(Boolean);

        const matchRegexes = normalizedMatchPatterns.map(pattern =>
            patternToRegex(pattern, matchRegexMode)
        );

        const excludeRegexes = normalizedExcludePatterns.map(pattern =>
            patternToRegex(pattern, matchRegexMode)
        );

        function matchesAny(
            name: string,
            regexes: RegExp[]
        ): boolean {
            return regexes.some(regex => regex.test(name));
        }

        if (
            !fs.existsSync(resolvedRoot) ||
            !fs.statSync(resolvedRoot).isDirectory()
        ) {
            console.error(`Directory not found: ${resolvedRoot}`);
            process.exitCode = 1;
            return;
        }

        console.log();
        console.log(`Scanning: ${resolvedRoot}`);
        console.log(`Depth: ${depth}`);
        console.log();

        let count = 0;
        let success = 0;
        let failed = 0;

        function tryPull(dir: string) {
            const gitDir = path.join(dir, '.git');

            if (!fs.existsSync(gitDir)) {
                return;
            }

            try {
                const stat = fs.statSync(gitDir);

                // .git can be either:
                // 1. directory - normal repository
                // 2. file      - git worktree
                if (!stat.isDirectory() && !stat.isFile()) {
                    return;
                }
            } catch {
                return;
            }

            const repoName = path.basename(dir);

            // Match filter
            const isMatch =
                matchRegexes.length === 0 ||
                matchesAny(repoName, matchRegexes);

            // Exclude filter
            const isExcluded =
                excludeRegexes.length > 0 &&
                matchesAny(repoName, excludeRegexes);

            if (!isMatch) {
                return;
            }

            if (isExcluded) {
                return;
            }

            count += 1;

            console.log('========================================');
            console.log(`[${count}] Updating: ${repoName}`);
            console.log(`Path: ${dir}`);
            console.log('========================================');

            try {
                if (dryRun) {
                    console.log(
                        '🔎 DRY RUN - would run:',
                        'git -C',
                        dir,
                        'pull --ff-only'
                    );
                } else {
                    const result = spawnSync(
                        'git',
                        ['-C', dir, 'pull', '--ff-only'],
                        {
                            stdio: 'inherit'
                        }
                    );

                    if (result.status === 0) {
                        console.log('✅ SUCCESS');
                        success += 1;
                    } else {
                        console.log('❌ FAILED');
                        failed += 1;
                    }
                }
            } catch {
                console.log('❌ FAILED');
                failed += 1;
            }

            console.log();
        }

        /**
         * Recursively scan up to requested depth.
         *
         * depth=0:
         *   root
         *
         * depth=1:
         *   root
         *   root/*
         *
         * depth=2:
         *   root
         *   root/*
         *   root/*
         */
        function scanDir(
            dir: string,
            currentDepth: number
        ) {
            tryPull(dir);

            if (currentDepth >= depth) {
                return;
            }

            let entries: fs.Dirent[];

            try {
                entries = fs.readdirSync(dir, {
                    withFileTypes: true
                });
            } catch {
                return;
            }

            for (const entry of entries) {
                if (!entry.isDirectory()) {
                    continue;
                }

                const child = path.join(dir, entry.name);

                scanDir(
                    child,
                    currentDepth + 1
                );
            }
        }

        scanDir(resolvedRoot, 0);

        console.log('========================================');
        console.log('Finished');
        console.log(`Matched Repositories : ${count}`);
        console.log(`Successful Updates   : ${success}`);
        console.log(`Failed Updates       : ${failed}`);
        console.log('========================================');
    });


gitCommand.addCommand(pull);

export default gitCommand;
