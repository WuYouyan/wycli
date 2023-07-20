import { Command } from 'commander';
import { generateComponent } from '../code-snippets/component.angularjs';
import { VirtualFile } from '../models/virtual-file.model';
import { createFile } from '../utilities/file-operations';

const command = new Command("component");

command
    .alias("c")
    .argument('<name>', 'component name')
    .option("-m, --module <moduleName>", "module name")
    .action(function(name: string, options: {[key: string]: string}, command: Command){
        console.log("name:", name);
        console.log("options: ", options);
        if (!name) {
            command.outputHelp();
        } else {
            //console.log("mkdir: ", command.parent?.parent?.opts().mkdir); // get parent options
            let virtualFile = new VirtualFile(name, {
                extname: "js",
                content: generateComponent({
                    name: name,
                    moduleName: options.module || "test"
                }),
                path: process.cwd()
            });
            createFile(virtualFile);
        }
    });

export default command;