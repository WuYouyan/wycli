import { Command } from 'commander';

const createCommand = new Command("create");

createCommand
    .option("-c, --component [name]", "create component")
    .action(function(options, command){
        if (options.component) {
            // TODO: create component file
            console.log("create component: ", options.component);
        }
    })
    .option("-s, --service [name]", "create service")
    .action(function(options, command){
        console.log("options: ", options);
        if (options.service) {
            // TODO: create service file
            console.log("create service: ", options.service);
        }
    });


export default createCommand;