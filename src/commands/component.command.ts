import { Command } from 'commander';
import { generateComponent } from '../code-snippets/component-angularjs';
import { VirtualFile } from '../models/VirtualFile.model';
import { createFile } from '../utilities/file-operations';

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
            let virtualFile = new VirtualFile(name, {
                extname: "js",
                content: generateComponent(name, "test"),
                path: process.cwd()
            });
            createFile(virtualFile);
        }
    });

export default command;