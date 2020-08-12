import { StringSup } from '../other/string';

let stringSup = new StringSup();


export interface IMigrationFiles {
    files? : ( typeof MigrationFile )[];
    groups? : ( typeof MigrationFile )[][]
}

interface SQLDataProperty{
    unique: string[];
    pk: string;
    fk: string[];
    check: string[];
    principal: string[];
    model: any[];
    drop: string[];
    rename: string[]
}
interface SQLDataTable{
    drop: string;
    rename: string;
    properties: SQLDataProperty;
    table: string,
    tableName: string,
    otherQuery: string[]
};
interface ViewType {
    Character: (name: string, size?: number, nullable?: boolean, fillable?: boolean, hash?: boolean, secure?: boolean, defaultVal?: any) => void,
    CharacterVarying : (name: string, maxSize: number, nullable?: boolean, fillable?: boolean, hash?: boolean, secure?: boolean, defaultVal?: any) => void,
    Text: (name: string, nullable?: boolean, fillable?: boolean, hash?: boolean, secure?: boolean, defaultVal?: any) => void,
    Integer: (name: string, nullable?: boolean, fillable?: boolean, hash?: boolean, secure?: boolean, defaultVal?: any) => void,
    Serial: (name: string, fillable?: boolean, hash?: boolean, secure?: boolean, defaultVal?: any) => void,
    Float: (name: string, nullable?: boolean, fillable?: boolean, hash?: boolean, secure?: boolean, defaultVal?: any) => void,
    Decimal : (name: string, integerSize: number, decimalSize: number, nullable?: boolean, fillable?: boolean, hash?: boolean, secure?: boolean, defaultVal?: any) => void,
    Boolean: (name: string, nullable?: boolean, fillable?: boolean, hash?: boolean, secure?: boolean, defaultVal?: any) => void,
    Json: (name: string, nullable?: boolean, fillable?: boolean, hash?: boolean, secure?: boolean, defaultVal?: any) => void,
    Date: (name: string, nullable?: boolean, fillable?: boolean, hash?: boolean, secure?: boolean, defaultVal?: any) => void,
    DateTime: (name: string, nullable?: boolean, fillable?: boolean, hash?: boolean, secure?: boolean, defaultVal?: any) => void,
    Time: (name: string, nullable?: boolean, fillable?: boolean, hash?: boolean, secure?: boolean, defaultVal?: any) => void
};
interface TableColumnType extends ViewType{
    Pk: (name: string) => void,
    Fk: (name: string, tableReference: string, columnReference: string, deleteMethod?: 'null' | 'cascade') => void,
    Unique: (name: string) =>  void,
    Check: (checkVal: string) => void,
    Drop: (name: string) => void,
    Rename: (oldName: string, newName: string) => void
};
interface TableType {
    Name: (name: string) => void;
    Rename: (newName: string) => void;
    Drop: (dropState?: 'cascade') => void;
    CreateIfNotExist: (createIfNotExistState?: boolean) => void;
}

export default class MigrationFile
{
    private dataProperty: SQLDataProperty = {
        unique: [],
        pk: '',
        fk: [],
        check: [],
        principal: [],
        model: [],
        drop: [],
        rename: []
    };
    private dataFinal: SQLDataTable = {
        properties: {
            unique: [],
            pk: '',
            fk: [],
            check: [],
            principal: [],
            model: [],
            drop: [],
            rename: []
        },
        drop: '',
        rename: '',
        table: '',
        tableName: '',
        otherQuery: []
    };
    private pkData: string[] = [];
    private uniqueData: string[] = [];
    private tableName: string = '';
    private tableNewName: string = '';
    private createIfNotExistState: boolean = true;
    private dropState: string = "cascade";
    private queryLangage: string = 'mysql' || 'pgsql' || 'oracle' || 'all';
    private otherQuery: string[] = [];
    constructor()
    {
    }
    GetPropertyInfo(): SQLDataProperty
    {
        let result = this.dataProperty;
        return result;
    }
    GetInfo(): SQLDataTable
    {
        //constraint
            //pk
        let resultPK = (this.pkData.length>0) ?
        `ALTER TABLE ${this.tableName} ADD CONSTRAINT ${this.MoveSeparatorUpdateCapitalLetter(this.tableName)}_PK PRIMARY KEY (${this.pkData.join(', ')});` :
        '';
        this.dataProperty.pk = resultPK;


        let propertiesVal: SQLDataProperty;
        let tableVal = '';
        let dropVal = '';
        let renameVal = '';
        let otherQueryVal = this.otherQuery;
        if(this.tableName.length > 0) {
            propertiesVal = this.dataProperty;
            dropVal = (this.dropState.length>0) ? `DROP TABLE IF EXISTS ${this.tableName} ${this.dropState};` : '';
            renameVal = (this.tableNewName.length>0) ? `ALTER TABLE IF EXISTS ${this.tableName} RENAME TO ${this.tableNewName};` : '';
            tableVal = `CREATE TABLE${(this.createIfNotExistState) ? ' IF NOT EXISTS' : ''} ${this.tableName}( {0} );`.Format(propertiesVal.principal.join(', '));
            const tableName: string = this.tableName;
            this.dataFinal = {
                table: tableVal,
                tableName: tableName,
                drop: dropVal,
                rename: renameVal,
                properties: propertiesVal,
                otherQuery: []
            };
        }
        this.dataFinal.otherQuery = otherQueryVal;

        return this.dataFinal;
    }
    
    protected QueryLangage(queryLangage: string = 'pgsql'): void
    {
        this.queryLangage = queryLangage;
    }
    protected OtherQuery(query: string): void
    {
        this.otherQuery.push(query);
    }
    protected Column(): TableColumnType
    {
        const TestDefaultVal = (type: string, value: any) => {
            let result : string = '';
            if(
                (typeof(value) == type && type!='string') ||
                (typeof(value) == type && type=='string' && value.length>0)
            ) {
                result = ' DEFAULT ' + this.JSONStringify(value, false);
            }
            return result;
        };

        var columnFunctions: TableColumnType = {
            Character : (name, size = 60, nullable = true, fillable = true, hash = false, secure = false, defaultVal = '') => {
                let result = (name.length>0 && size>=0) ?
                    `${name} CHAR(${size})${(nullable) ? ' NULL' : ' NOT NULL'}${TestDefaultVal('string', defaultVal)}` :
                    '';
                this.dataProperty.principal.push(result);
                this.dataProperty.model.push({name: name, type: 'string', fillable: fillable, hash: hash, secure: secure, nullable: nullable});
            },
            CharacterVarying : (name, maxSize = 60, nullable = true, fillable = true, hash = false, secure = false, defaultVal = '') => {
                let result = (name.length>0 && maxSize>=0) ?
                    `${name} VARCHAR(${maxSize})${(nullable) ? ' NULL' : ' NOT NULL'}${TestDefaultVal('string', defaultVal)}` :
                    '';
                this.dataProperty.principal.push(result);
                this.dataProperty.model.push({name: name, type: 'string', fillable: fillable, hash: hash, secure: secure, nullable: nullable});
            },
            Text: (name, nullable = true, fillable = true, hash = false, secure = false, defaultVal = '') => {
                let result = (name.length>0) ?
                    `${name} TEXT${(nullable) ? ' NULL' : ' NOT NULL'}${TestDefaultVal('string', defaultVal)}` :
                    '';
                this.dataProperty.principal.push(result);
                this.dataProperty.model.push({name: name, type: 'string', fillable: fillable, hash: hash, secure: secure, nullable: nullable});
            },
            Integer: (name, nullable = true, fillable = true, hash = false, secure = false, defaultVal = '') => {
                let result = (name.length>0) ?
                    `${name} INTEGER${(nullable) ? ' NULL' : ' NOT NULL'}${TestDefaultVal('number', defaultVal)}` :
                    '';
                this.dataProperty.principal.push(result);
                this.dataProperty.model.push({name: name, type: 'number', fillable: fillable, hash: hash, secure: secure, nullable: nullable});
            },
            Serial: (name, fillable = true, hash = false, secure = false, defaultVal = '') => {
                let result = (name.length>0) ?
                    `${name}${(this.queryLangage=='pgsql') ? ' SERIAL' : ' INTEGER NOT NULL AUTO_INCREMENT'}${TestDefaultVal('number', defaultVal)}` :
                    '';
                this.dataProperty.principal.push(result);
                this.dataProperty.model.push({name: name, type: 'number', fillable: fillable, hash: hash, secure: secure, nullable: false});
            },
            Float: (name, nullable = true, fillable = true, hash = false, secure = false, defaultVal = '') => {
                let result = (name.length>0) ?
                    `${name} FLOAT${(nullable) ? ' NULL' : ' NOT NULL'}${TestDefaultVal('number', defaultVal)}` :
                    '';
                this.dataProperty.principal.push(result);
                this.dataProperty.model.push({name: name, type: 'number', fillable: fillable, hash: hash, secure: secure, nullable: nullable});
            },
            Decimal : (name, integerSize = 10, decimalSize = 2, nullable = true, fillable = true, hash = false, secure = false, defaultVal = '') => {
                let result = (name.length>0 && integerSize>=0) ?
                    `${name} DECIMAL(${integerSize}, ${decimalSize})${(nullable) ? ' NULL' : ' NOT NULL'}${TestDefaultVal('number', defaultVal)}` :
                    '';
                this.dataProperty.principal.push(result);
                this.dataProperty.model.push({name: name, type: 'number', fillable: fillable, hash: hash, secure: secure, nullable: nullable});
            },
            Boolean: (name, nullable = true, fillable = true, hash = false, secure = false, defaultVal = '') => {
                let result = (name.length>0) ?
                    `${name} BOOLEAN${(nullable) ? ' NULL' : ' NOT NULL'}${TestDefaultVal('boolean', defaultVal)}` :
                    '';
                this.dataProperty.principal.push(result);
                this.dataProperty.model.push({name: name, type: 'boolean', fillable: fillable, hash: hash, secure: secure, nullable: nullable});
            },
            Json: (name, nullable = true, fillable = true, hash = false, secure = false, defaultVal = '') => {
                let result = (name.length>0) ?
                    `${name} JSON${(nullable) ? ' NULL' : ' NOT NULL'}${TestDefaultVal('object', defaultVal)}` :
                    '';
                this.dataProperty.principal.push(result);
                this.dataProperty.model.push({name: name, type: 'object', fillable: fillable, hash: hash, secure: secure, nullable: nullable});
            },
            Date: (name, nullable = true, fillable = true, hash = false, secure = false, defaultVal = '') => {
                let result = (name.length>0) ?
                    `${name} DATE${(nullable) ? ' NULL' : ' NOT NULL'}${TestDefaultVal('string', defaultVal)}` :
                    '';
                this.dataProperty.principal.push(result);
                this.dataProperty.model.push({name: name, type: 'string', fillable: fillable, hash: hash, secure: secure, nullable: nullable});
            },
            DateTime: (name, nullable = true, fillable = true, hash = false, secure = false, defaultVal = '') => {
                let result = (name.length>0) ?
                    `${name} TIMESTAMP${(nullable) ? ' NULL' : ' NOT NULL'}${TestDefaultVal('string', defaultVal)}` :
                    '';
                this.dataProperty.principal.push(result);
                this.dataProperty.model.push({name: name, type: 'string', fillable: fillable, hash: hash, secure: secure, nullable: nullable});
            },
            Time: (name, nullable = true, fillable = true, hash = false, secure = false, defaultVal = '') => {
                let result = (name.length>0) ?
                    `${name} TIME${(nullable) ? ' NULL' : ' NOT NULL'}${TestDefaultVal('string', defaultVal)}` :
                    '';
                this.dataProperty.principal.push(result);
                this.dataProperty.model.push({name: name, type: 'string', fillable: fillable, hash: hash, secure: secure, nullable: nullable});
            },
            Pk: (name) => {
                if(name.length>0) {
                    this.pkData.push(name);
                }
            },
            Fk: (name, tableReference, columnReference, deleteMethod = 'null') => {
                const deleteMethod2 = String(deleteMethod);
                let result = (name.length>0 && tableReference.length>0 && columnReference.length>0) ?
                    `ALTER TABLE ${this.tableName} ADD CONSTRAINT child_${this.MoveSeparatorUpdateCapitalLetter(this.tableName)}_${name}_parent_${this.MoveSeparatorUpdateCapitalLetter(tableReference)}_${columnReference}_FK_${(this.dataProperty.fk.length)+1} FOREIGN KEY (${name}) REFERENCES ${tableReference}(${columnReference}) ${(deleteMethod2.length>0) ? ` ON DELETE ${(deleteMethod2 == 'null' || deleteMethod2 == 'default') ? `SET ${deleteMethod2.toUpperCase()}` : deleteMethod2.toUpperCase()};` : ''}` : 
                    '';
                this.dataProperty.fk.push(result);
            },
            Unique: (name) => {
                let result = (name.length>0) ?
                `ALTER TABLE ${this.tableName} ADD CONSTRAINT ${this.MoveSeparatorUpdateCapitalLetter(this.tableName)}_unique_${name}_${(this.dataProperty.unique.length)+1} UNIQUE (${name});` :
                '';
                this.dataProperty.unique.push(result);
            },
            Check: (checkVal) => {
                let result = (checkVal.length>0) ?
                    `ALTER TABLE ${this.tableName} ADD CONSTRAINT ${this.MoveSeparatorUpdateCapitalLetter(this.tableName)}_check_${(this.dataProperty.check.length)+1} CHECK (${checkVal});` :
                    '';
                this.dataProperty.check.push(result);
            },
            Drop: (name) => {
                let result = (name.length>0) ?
                    `ALTER TABLE ${this.tableName} DROP COLUMN IF EXISTS ${name};` :
                    '';
                this.dataProperty.drop.push(result);
            },
            Rename: (oldName, newName) => {
                let result = (oldName.length>0 && newName.length>0) ?
                    `ALTER TABLE ${this.tableName} RENAME COLUMN ${oldName} TO ${newName};` :
                    '';
                this.dataProperty.rename.push(result);
            }
        }
        
        return columnFunctions;
    }
    protected Table(): TableType
    {
        return {
            Name: (name: string = '') =>
            {
                this.tableName = name;
            },
            Rename: (newName: string = '') =>
            {
                this.tableNewName = newName;
            },
            Drop: (dropState: 'cascade' = 'cascade') =>
            {
                this.dropState = dropState;
            },
            CreateIfNotExist: (createIfNotExistState: boolean = true) =>
            {
                this.createIfNotExistState = createIfNotExistState;
            }
        }
    }
    private JSONStringify(value: any, simpleQuotePresence: boolean = false, quoteStart: string = '$$$', quoteEnd: string = '\''): any{
        let result: string = '';
        let quote: string = '\'';
        if (simpleQuotePresence) {
            quote = quoteStart;
        } else {
            quote = quoteEnd;
        }
        return JSON.stringify(value, this.Replacer).ReplaceAll('"#9210#', quote).ReplaceAll('#9210#"', quote).ReplaceAll('\\"', '"');
    }
    private Replacer(name: string, value: any): any{
        if(typeof(value)=='string'){
            value = '#9210#' + value + '#9210#';
        }
        //console.log(`name:: ${name}, value:: ${value}, type:: ${typeof(value)}`);
        return value;
    }
    private MoveSeparatorUpdateCapitalLetter(element: string, separator: string = '.') : string {
        let arrayElement = element.split(separator);
        arrayElement = arrayElement.map((value: string, index: number) => {
            if(index>0){
                value = value.UcFirst();
            }
            return value;
        });
        let result: string = arrayElement.join('');

        return result;
    }
}