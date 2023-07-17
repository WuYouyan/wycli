import { Command } from 'commander';
import path from "path";
import generateCommand from './generate.command';
import listCommand from './list.command';
import { createDir, createEmptyFile } from '../utilities/file-operations';

const command = new Command("wycli");

command
    .enablePositionalOptions()
    .version("1.0.0", "-v, --version", "output the current version")
    .usage("[options] arguments...")
    .description("An example CLI for managing a directory")
    .option("-m, --mkdir <value>", "Create a directory")
    .option("-t, --touch <value>", "Create a file")
    .action((options: {[key: string]: string}, command: Command) => {
        if (options.mkdir) {
            createDir(path.resolve(__dirname, options.mkdir));
        }
        if (options.touch) {
            createEmptyFile(path.resolve(__dirname, options.touch));
        }
        if (!process.argv.slice(2).length) {
            command.outputHelp();
        }
    })
    .addCommand(listCommand)
    .addCommand(generateCommand);

export default command;