import { Command } from 'commander';
import { VirtualFile } from '../models/virtual-file.model';
import { generateService } from '../code-snippets/service.angularjs';
import { createFile } from '../utilities/file-operations';

const command = new Command("service");

command
    .alias("s")
    .argument('<name>', 'service name') // [name] optional, <name> required
    .option("-m, --module <moduleName>", "module name")
    .action(function(name: string, options: {[key: string]: string}, command: Command){
        console.log("options: ", options);
        if (!name) {
            command.outputHelp();
        } else {
            let virtualFile = VirtualFile.fromPath(name, {
                extname: "service.js",
                path: process.cwd()
            });
            virtualFile.content = generateService({
                name: virtualFile.name,
                moduleName: options.module || "test",
                es6Style: true
            })
            createFile(virtualFile);
        }
    });


export default command;