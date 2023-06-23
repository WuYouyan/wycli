import { Command } from 'commander';

const command = new Command("component");

command
    .alias("c")
    .argument('<name>', 'component name')
    .action(function(name: string, options: {[key: string]: string}){
        console.log("name:", name);
        console.log("options: ", options);
        if (!name) {
            command.outputHelp();
        }
    });


export default command;