import "reflect-metadata";
import * as path from 'path';
import * as AppConfig from '../AppConfig.json';
import { AppMigrate } from "./app.migrate";

const GetDirname = function(): string {
    let dirName = __dirname.replace(`\\${AppConfig.mode["rep-dev"]}`, '').replace(`/${AppConfig.mode["rep-dev"]}`, '');
    dirName = dirName.replace(`\\${AppConfig.mode["rep-prod"]}`, '').replace(`/${AppConfig.mode["rep-prod"]}`, '');
    return dirName;
}
let dirName = GetDirname();

console.log(dirName);

let appMigrate = new AppMigrate(dirName);
appMigrate.Init();