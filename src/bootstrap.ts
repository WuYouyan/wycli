import figlet  from "figlet";
import { mainCommand } from "./commands";

export function bootstrap() {
    console.log(figlet.textSync("WY CLI Manager"));
    mainCommand.parse(process.argv);  // process argv
}
