import * as fs from "fs";

export function createFile(filepath: string) {
    fs.openSync(filepath, "w");
    console.log("An empty file has been created");
}