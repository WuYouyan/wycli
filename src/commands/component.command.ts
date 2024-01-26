import { Command } from 'commander';
import { addModalComponentUsageInFile, generateModalComponent, generateModalComponentHTML } from '../code-snippets/bootstrap-modal.angularjs';
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
    .option("-bmp, --bootstrap-modal-path <filePath>", "file path where We add open bootstrap modal component codes in place of \"//INSERT HERE\"")
    .action(function(name: string, options: {[key: string]: string}, command: Command){
        if (!name) {
            command.outputHelp();
        } else {
            if (options.bootstrapModal) {
                const virtualJsFile = VirtualFile.fromPath(name, {
                    extname: "modal.js",
                    path: process.cwd()
                });
                const componentConfig = {
                    name: virtualJsFile.name,
                    controllerName: capitalizeFirstLetter(virtualJsFile.name + 'Controller'),
                    moduleName: options.module as string || "test",
                    templateUrl: !!options.templateUrl,
                    templateUrlFn: !!options.templateUrlFunction
                };
                virtualJsFile.content = generateModalComponent(componentConfig);
                const virtualHTMLFile = VirtualFile.fromPath(name, {
                    extname: "modal.html",
                    path: process.cwd(),
                    content: generateModalComponentHTML()
                });
                createFile(virtualJsFile); // create js file
                createFile(virtualHTMLFile); // create html file
                if (typeof options.bootstrapModalPath === "string") {
                    addModalComponentUsageInFile(componentConfig, options.bootstrapModalPath);
                }
                return;
            }
            //console.log("mkdir: ", command.parent?.parent?.opts().mkdir); // get parent options
            const virtualJsFile = VirtualFile.fromPath(name, {
                extname: "component.js",
                path: process.cwd()
            });
            virtualJsFile.content = generateComponent({
                name: virtualJsFile.name,
                controllerName: capitalizeFirstLetter(virtualJsFile.name + 'Controller'),
                moduleName: options.module as string || "test",
                templateUrl: !!options.templateUrl,
                templateUrlFn: !!options.templateUrlFunction
            });
            createFile(virtualJsFile); // create js file
            const virtualHTMLFile = VirtualFile.fromPath(name, {
                extname: "component.html",
                path: process.cwd(),
                content: `<div>${name} html content</div>`
            });
            createFile(virtualHTMLFile); // create html file

        }
    });

export default command;