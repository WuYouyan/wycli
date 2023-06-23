import { Command } from 'commander';

const command = new Command("service");

command
    .alias("s")
    .argument('<name>', 'service name')
    .action(function(name: string, options: {[key: string]: string}, command: Command){
        console.log("options: ", options);
        if (!Object.keys(options).length) {
            command.outputHelp();
        }
    });


export default command;