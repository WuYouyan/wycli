import { Command } from 'commander';
import { existsSync, writeFile } from 'fs';
import path from 'path';
import { generateComponent } from '../code-snippets/component-angularjs';
import { VirtualFile } from '../models/VirtualFile.model';

const command = new Command("component");

command
    .alias("c")
    .argument('<name>', 'component name')
    .action(function(name: string, options: {[key: string]: string}){
        console.log("name:", name);
        console.log("options: ", options);
        if (!name) {
            command.outputHelp();
        } else {
            let virtualFile = new VirtualFile(name, "js", {
                content: generateComponent(name, "test"),
                path: process.cwd()
            });
            createComponent(virtualFile);
        }
    });
function createComponent(virtualFile: VirtualFile) {
    let filePath = virtualFile.fullPath();
    if(!existsSync(filePath)) {
        writeFile(filePath, virtualFile.content, (err) => {
            if (err) {
                console.error(err);
            }
        });
    } else {
        createComponent(virtualFile.renameWhenExists());
    }
}


export default command;