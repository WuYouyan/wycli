import { Command } from 'commander';
import componentCommand from './component.command';
import directiveCommand from './directive.command';
import serviceCommand from './service.command';

const command = new Command("generate");

command
    .alias("g")
    .action(function(options: {[key: string]: string}, command: Command){
        if (!Object.keys(options).length) {
            command.outputHelp();
        }
    })
    .addCommand(serviceCommand)
    .addCommand(componentCommand)
    .addCommand(directiveCommand);


export default command;