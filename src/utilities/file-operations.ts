import { existsSync, mkdirSync, openSync, writeFile } from "fs";
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
                console.log(chalk.green(`"${virtualFile.fullName()}" has been created successfully!`));
            }
        });
    } else {
        createFile(virtualFile.renameWhenExists());
    }
}