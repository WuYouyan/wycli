import { mainCommand } from "./commands";

export function bootstrap() {
    mainCommand.parse(process.argv);  // process argv
}
