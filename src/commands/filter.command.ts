import { Command } from 'commander';
import { generatePipe } from '../code-snippets/filter.angularjs';
import { VirtualFile } from '../models/virtual-file.model';
import { createFile } from '../utilities/file-operations';

const command = new Command("filter");

command
    .alias("f")
    .argument('<name>', 'filter name') // [name] optional, <name> required
    .option("-m, --module <moduleName>", "module name")
    .action(function(name: string, options: {[key: string]: string}, command: Command){
        console.log("options: ", options);
        if (!name) {
            command.outputHelp();
        } else {
            const virtualFile = VirtualFile.fromPath(name, {
                extname: "filter.js",
                path: process.cwd()
            });
            virtualFile.content = generatePipe({
                name: virtualFile.name,
                moduleName: options.module || "test"
            })
            createFile(virtualFile);
        }
    });


export default command;