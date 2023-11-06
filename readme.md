# Installation
1. install nodejs 
2. clone repository
3. run command `npm install` to install dependencies
4. run command `npm run build` to build project
5. run command `npm link` to enable globally use of `wycli` 
6. feel free to use command `wycli [command]`


# Structure of cli

## Main Command
Main command contains basic options and also other commands

## Generate Command
Generate command is like a namespace, which means the subcommands of generate command are used to generate things(service, component, templates etc...)


wycli is powered by [commander](https://github.com/tj/commander.js)