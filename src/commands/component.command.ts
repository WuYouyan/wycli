import { Command } from 'commander';
import { generateComponent } from '../code-snippets/component.angularjs';
import { VirtualFile } from '../models/virtual-file.model';
import { createFile } from '../utilities/file-operations';
import { capitalizeFirstLetter } from '../utilities/string-operation';

const command = new Command("component");

command
    .alias("c")
    .argument('<name>', 'component name')
    .option("-m, --module <moduleName>", "module name")
    .option("-tu, --template-url", "template url for directive definition", true)
    .option("-tuf, --template-url-function", "template url function for directive definition", false)
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
                controllerName: capitalizeFirstLetter(virtualFile.name + 'Controller'),
                moduleName: options.module as string || "test",
                templateUrl: !!options.templateUrl,
                templateUrlFn: !!options.templateUrlFunction
            });
            createFile(virtualFile);
        }
    });

export default command;