import * as fs from "fs";
import * as path from "path";
import treeify from "tree-node-cli";


export async function listDirContents(filepath: string) {
    try {
        const files = await fs.promises.readdir(filepath);
        const detailedFilesPromises = files.map(async (file: string) => {
            const fileDetails = await fs.promises.lstat(path.resolve(filepath, file));
            const { size, birthtime } = fileDetails;
            return { filename: file, "size(KB)": size, created_at: birthtime };
        });
        const detailedFiles = await Promise.all(detailedFilesPromises);
        console.table(detailedFiles);
    } catch (error) {
        console.error("Error occurred while reading the directory!", error);
    }
}

export function listDirContentsInTree(dirPath: string): void {
    console.log(treeify(dirPath));
}