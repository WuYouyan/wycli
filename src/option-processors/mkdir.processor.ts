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