import { CMigrate, Migrate } from "./arc-hv/db/migrate"
import { MainMigrate } from "./app/main/main.migrate";

@Migrate({
    groups: [
        MainMigrate,
    ]
})
export class AppMigrate extends CMigrate {}