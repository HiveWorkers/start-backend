import MigrationFile from "../../../arc-hv/db/migration.file";

export class Table1MigrationFile extends MigrationFile {
    constructor() {
        super();

        this.Table().Name('public.table1');
        this.Table().Drop();
        this.Table().CreateIfNotExist();

        this.Column().CharacterVarying('id', 60, false, true);
        this.Column().CharacterVarying('code', 50, false, true);
        this.Column().DateTime('date_added', false, true, false, false, 'now()');
        this.Column().DateTime('date_updated', false, true, false, false, 'now()');

        this.Column().Unique('id');
        this.Column().Unique('code');
        this.Column().Pk('id');

        
        this.Column().CharacterVarying('intitule', 100, false, true);
        this.Column().CharacterVarying('description', 300, true, true);
        this.Column().Integer('priorite', false, true, false, false, 10);
        this.Column().Boolean('activated', false, true, false, false, true);

        this.OtherQuery(``);
    }
}