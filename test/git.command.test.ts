import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import mainCommand from '../src/commands/main.command';

describe('git pull command', () => {
  let tempRoot = '';

  afterEach(() => {
  vi.restoreAllMocks();

    if (tempRoot) {
      fs.rmSync(tempRoot, { recursive: true, force: true });
      tempRoot = '';
    }
  });

  it('should detect a repo and report a dry run update', async () => {
    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'wycli-git-'));

    const repoDir = path.join(tempRoot, 'demo-repo');
    fs.mkdirSync(repoDir, { recursive: true });
    fs.mkdirSync(path.join(repoDir, '.git'), { recursive: true });

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    await mainCommand.parseAsync(
      [
        'node',
        'wycli',
        'git',
        'pull',
        repoDir,
        '--depth',
        '0',
        '--dry-run',
        '--match',
        'demo-repo'
      ],
      { from: 'node' }
    );

    const output = logSpy.mock.calls.flat().map(String).join('\n');

    expect(output).toContain('Scanning:');
    expect(output).toContain('demo-repo');
    expect(output).toContain('DRY RUN');
    expect(output).toContain('Matched Repositories');
  });
});
