import chalk from "chalk";
import { createReadStream, createWriteStream, existsSync, mkdirSync, openSync, readFile, rename, renameSync, writeFile } from "fs";
import { Transform } from "stream";
import { VirtualFile } from "../models/virtual-file.model";

/**
 * create directory
 * @param {any} filepath:string
 */
export function createDir(filepath: string): void {
    if (!existsSync(filepath)) {
        mkdirSync(filepath);
        console.log("The directory has been created successfully");
    }
}


export function createEmptyFile(filepath: string) {
    openSync(filepath, "w");
    console.log("An empty file has been created");
}

export function createFile(virtualFile: VirtualFile) {
    let filePath = virtualFile.fullPath();

    if(!existsSync(filePath)) {
        writeFile(filePath, virtualFile.content, (err) => {
            if (err) {
                console.error(chalk.red("Error occurred while writing the file!"));
                console.error(chalk.red(err.message));
            } else {
                console.log(chalk.green(`"${virtualFile.fullName()}" has been created successfully!`), `at ${virtualFile.path}`);
            }
        });
    } else {
        createFile(virtualFile.renameWhenExists());
    }
}

export function replaceString(filePath: string, target: string, replace: string) {
    readFile(filePath, function (err, data) {
        if (err) throw err;

        const content = data.toString();
        const newContent = content.replace(target, replace);

        writeFile(filePath, newContent, function (err) {
            if (err) throw err;
            console.log('Replaced!');
        });
    });
}
export function replaceStringBigFile(filePath: string, target: string, replace: string) {
    const readStream = createReadStream(filePath);
    const writeStream = createWriteStream(filePath + '.tmp');

    let remaining: string = '';

    readStream.on('data', function (chunk) {
        const lines = (remaining + chunk).split(/\r?\n/g);
        remaining = lines.pop() || "";

        for (let i = 0; i < lines.length; ++i) {
            if (lines[i].includes(target)) {
                lines[i] = lines[i].replace(/\/\/INSERT HERE/g, replace);
            }
        }

        writeStream.write(lines.join('\n') + '\n');
    });

    readStream.on('end', function () {
        if (remaining.length > 0) {
            writeStream.write(remaining);
        }

        writeStream.end();
    });
    readStream.on('error', function (err) {
        console.error(chalk.red(err));
        writeStream.end();
    });

    writeStream.on('finish', function () {
        renameSync(filePath + '.tmp', filePath);
        console.log('Replaced!');
    });
    writeStream.on('error', function (err) {
        console.error(chalk.red(err));
        readStream.destroy();
    });

}
/**
 * Replaces a string matched in a file.
 *
 * @param {string} filePath - The path of the file.
 * @param {string} target - The string to be replaced.
 * @param {string} replace - The string to replace the target.
 * @param {boolean} [replaceFirst=false] - Indicates whether to replace only the first occurrence or all occurrences of the target.
 */
export function replaceStringInFile(filePath: string, target: string, replace: string, replaceFirst: boolean = false) {
    if (!existsSync(filePath)) {
        console.error(chalk.red(`"${filePath}" does not exist!`));
        return;
    }
    let replaced = false;
    let remaining = '';
    let regexTag = replaceFirst?'':'g';
    const targetRegex = new RegExp(target, regexTag);
    /**
     * @see {@link https://nodejs.org/api/stream.html#implementing-a-transform-stream | Implementing a transform stream}
     */
    const transformStream = new Transform({
        transform(chunk, encoding, callback) {
            let data = remaining + chunk.toString();
            if (!replaced) {
                const index = data.indexOf(target);
                if (index !== -1) {
                    data = data.replace(targetRegex, replace);
                    replaced = replaceFirst ? true : false;
                }
            }
            /*
             * target string may span two chunks
             * so we need to keep track of the remaining data
             */
            remaining = data.slice(-target.length);
            callback(null, data.slice(0, -target.length));
        },
        // Define the 'flush' function that is called when there are no more chunks to process
        flush(callback) {
            callback(null, remaining);
        }
    });
    // Create a read stream to read data from the input file in smaller chunks
    const readStream = createReadStream(filePath, { encoding: 'utf8' });
    // Create a write stream to write data to a temporary output file
    const writeStream = createWriteStream(filePath + '.tmp', { encoding: 'utf8' });

    // Handle errors when reading from the input file
    readStream.on('error', (err) => {
        console.error(chalk.red(`Error reading file: ${err.message}`));
        // Destroy the read stream to prevent a file descriptor leak
        readStream.destroy();
        writeStream.end();
    });

    // Handle errors when writing to the output file
    writeStream.on('error', (err) => {
        console.error(chalk.red(`Error writing file: ${err.message}`));
        // Destroy the read stream to prevent a file descriptor leak
        readStream.destroy();
        writeStream.end();
    });

    readStream
        .pipe(transformStream)
        .pipe(writeStream)
        .on('finish', () => {
            // When all data has been processed and written, rename the temporary output file to overwrite the original input file
            rename(filePath + '.tmp', filePath, (err) => {
                if (err) {
                    console.error(chalk.red(`Error renaming file: ${err.message}`));
                } else {
                    console.log(chalk.green('Replaced!'));
                }
            });
        });
}