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
        if (!name) {
            command.outputHelp();
        } else {
            //console.log("mkdir: ", command.parent?.parent?.opts().mkdir); // get parent options
            let virtualFile = VirtualFile.fromPath(name, {
                extname: "js",
                path: process.cwd()
            });
            virtualFile.content = generateComponent({
                name: virtualFile.name,
                moduleName: options.module || "test"
            });
            createFile(virtualFile);
        }
    });

export default command;