import { Command } from 'commander';
import { generateModalComponent, generateModalComponentHTML } from '../code-snippets/bootstrap-modal.angularjs';
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
    .option("-bm, --bootstrap-modal", "bootstrap modal component", false)
    .action(function(name: string, options: {[key: string]: string}, command: Command){
        if (!name) {
            command.outputHelp();
        } else {
            if (options.bootstrapModal) {
                let virtualJsFile = VirtualFile.fromPath(name, {
                    extname: "modal.js",
                    path: process.cwd()
                });
                virtualJsFile.content = generateModalComponent({
                    name: virtualJsFile.name,
                    controllerName: capitalizeFirstLetter(virtualJsFile.name + 'Controller'),
                    moduleName: options.module as string || "test",
                    templateUrl: !!options.templateUrl,
                    templateUrlFn: !!options.templateUrlFunction
                })
                let virtualHTMLFile = VirtualFile.fromPath(name, {
                    extname: "modal.html",
                    path: process.cwd(),
                    content: generateModalComponentHTML()
                });
                createFile(virtualJsFile);
                createFile(virtualHTMLFile);
                return;
            }
            //console.log("mkdir: ", command.parent?.parent?.opts().mkdir); // get parent options
            let virtualFile = VirtualFile.fromPath(name, {
                extname: "component.js",
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