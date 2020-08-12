import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'
import { DateNow, FormatDate } from '../other/date.util';

export class LogManip {
    logPath: string = '';
    private db: JsonDB | undefined = undefined;

    constructor(logPath: string) {
        this.SetLogPath(logPath)
    }

    SetLogPath(logPath: string) {
        this.logPath = logPath;
    }

    private InitDB() {
        return new JsonDB(
            new Config(this.logPath, true, false, '/')
        );
    }
    Add(data: {
        date?: string;
        title?: string;
        end?: 'success' | 'error' | 'in-progress' | 'maintenance',
        author?: string,
        body?: any,
        result?: any
    }) {
        data.date = FormatDate(DateNow);

        this.db = this.InitDB();
        this.db.push("/data[]", data, true);

        this.db.save();
        //this.db.reload();
    }
}