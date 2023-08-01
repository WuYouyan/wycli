import { Command } from 'commander';
import { generateDirective } from '../code-snippets/directive.angularjs';
import { VirtualFile } from '../models/virtual-file.model';
import { createFile } from '../utilities/file-operations';
import { capitalizeFirstLetter } from '../utilities/string-operation';

const command = new Command("directive");

command
    .alias("d")
    .argument('<name>', 'directive name')
    .option("-m, --module <moduleName>", "module name")
    .option("-tu, --template-url", "template url for directive definition", true)
    .option("-tuf, --template-url-function", "template url function for directive definition", false)
    .action(function(name: string, options: Record<string, string | boolean>, command: Command){
        if (!name) {
            command.outputHelp();
        } else {
            //console.log("mkdir: ", command.parent?.parent?.opts().mkdir); // get parent options
            const virtualFile = VirtualFile.fromPath(name, {
                extname: "directive.js",
                path: process.cwd()
            });
            virtualFile.content = generateDirective({
                name: virtualFile.name,
                controllerName: capitalizeFirstLetter(virtualFile.name + 'Controller'),
                moduleName: options.module as string || "test",
                templateUrl: !!options.templateUrl,
                templateUrlFn: !!options.templateUrlFunction
            });
            createFile(virtualFile);
        }
    });

export default command;