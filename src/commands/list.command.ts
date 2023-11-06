import { Command } from 'commander';
import { listDirContentsInTree, listDirContents } from '../utilities/list';
import * as nodePath from 'path';

const command = new Command("list");

command
    .alias("ls")
    .argument('[path]', 'path')
    .option("-tree, --tree-view", "List directory contents in tree view")
    .action(function(path: string | undefined, options: {[key: string]: string}, command: Command){
        const currentDir = process.cwd();
        const filepath = typeof path === "string" ? nodePath.join(currentDir, path) : currentDir;
        if (options.treeView) {
            listDirContentsInTree(filepath);
        } else {
            listDirContents(filepath);
        }
    });


export default command;