import { createReadStream, createWriteStream, existsSync, mkdirSync, openSync, readFile, renameSync, writeFile } from "fs";
import { VirtualFile } from "../models/virtual-file.model";
import chalk from "chalk";

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

    writeStream.on('finish', function () {
        renameSync(filePath + '.tmp', filePath);
        console.log('Replaced!');
    });

}