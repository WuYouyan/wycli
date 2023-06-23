import { Command } from 'commander';
import * as path from "path";
import { createDir, createFile, listDirContents } from "../options";
import generateCommand from './generate.command';

const command = new Command("wycli");

command
    .version("1.0.0", "-v, --version", "output the current version")
    .usage("[options] arguments...")
    .description("An example CLI for managing a directory")
    .option("-l, --ls  [value]", "List directory contents")
    .option("-m, --mkdir <value>", "Create a directory")
    .option("-t, --touch <value>", "Create a file")
    .action((options: {[key: string]: string}, command: Command) => {
        console.log("wycli options: ", options)
        if (options.ls) {
            const filepath = typeof options.ls === "string" ? options.ls : __dirname;
            listDirContents(filepath);
        }
        if (options.mkdir) {
            createDir(path.resolve(__dirname, options.mkdir));
        }
        if (options.touch) {
            createFile(path.resolve(__dirname, options.touch));
        }
        if (!process.argv.slice(2).length) {
            command.outputHelp();
        }
    })
    .addCommand(generateCommand);

export default command;