import MigrationFile from "../../arc-hv/db/migration.file";
import { Table1MigrationFile } from "./migration-file/table1.migration-file";

export const MainMigrate: typeof MigrationFile[] = [
    Table1MigrationFile
];