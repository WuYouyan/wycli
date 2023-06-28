import * as fs from "fs";

/**
 * create directory
 * @param {any} filepath:string
 */
export function createDir(filepath: string): void {
    if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath);
        console.log("The directory has been created successfully");
    }
}


export function createFile(filepath: string) {
    fs.openSync(filepath, "w");
    console.log("An empty file has been created");
}