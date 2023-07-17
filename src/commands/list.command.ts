import { Command } from 'commander';
import { listDirContents } from '../utilities/list';
import { asTree } from 'treeify';

const command = new Command("list");

command
    .alias("ls")
    .argument('[path]', 'path')
    .option("-tree, --tree-view", "List directory contents in tree view")
    .action(function(path: string | undefined, options: {[key: string]: string}, command: Command){
        console.log("🚀 ~ file: list.command.ts:12 ~ .action ~ path:", path)
        const filepath = typeof path === "string" ? path : process.cwd();
        if (options.treeView) {
            // TODO: print directory in tree view
            let treeViewString = asTree({
                all: {

                    fruits: {
                        apples: 'gala',      //  ├─ apples: gala
                        oranges: 'mandarin'  //  └─ oranges: mandarin
                    },
                    vegetables: {
                        tomatoes: 'pepper',
                    }
                }
            }, false, false);
            console.log(treeViewString);
        } else {
            listDirContents(filepath);
        }
    });


export default command;