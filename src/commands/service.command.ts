import { Command } from 'commander';
import { VirtualFile } from '../models/VirtualFile.model';
import { generateService } from '../code-snippets/service-angularjs';
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
            let virtualFile = new VirtualFile(name, {
                extname: "js",
                content: generateService(name, options.module || "test"),
                path: process.cwd()
            });
            createFile(virtualFile);
        }
    });


export default command;