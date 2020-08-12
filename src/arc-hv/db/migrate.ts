import { StringSup } from '../other/string';
import * as packageJson from '../../../package.json';
import * as appConfigFile from '../../../AppConfig.json';
import MigrationFile from './migration.file';
import * as path from 'path';
import { FileManip } from '../file/file';

let stringSup = new StringSup();

export function Migrate(prefix: IMigrationFiles) {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
          prefix = prefix;
        }
    }
}

export interface IMigrationFiles {
    files? : ( typeof MigrationFile )[];
    groups? : ( typeof MigrationFile )[][]
}

export class CMigrate{
    private prefix: IMigrationFiles = {};
    private migrationFiles: typeof MigrationFile[] = [];
    private migrationFilesGroup: typeof MigrationFile[][] = [];
    private migrationFiles2: MigrationFile[] = [];
    private dirname: string = '';
    private dirname_brut: string = '';

    constructor(dirname: string) {
        this.dirname_brut = dirname || '';
        this.dirname = path.join(
            this.dirname_brut
        );

        console.log(`this.dirname:: <${this.dirname}>`);
    }

    private GetPrefix() {
        this.migrationFiles = this.prefix.files || [];
        this.migrationFilesGroup = this.prefix.groups || [];

        //console.log('> migrationFiles');
        //console.log(this.migrationFiles);
        //console.log('> migrationFilesGroup');
        //console.log(this.migrationFilesGroup);
    }

    private InitMigrationFile2(): void{
        this.Extract();
        this.migrationFiles2 = this.migrationFiles.map((data: any)=>{
            return new data();
        });
    }

    GetMigrationFiles(): typeof MigrationFile[] {
        this.Extract();
        return this.migrationFiles;
    }
    SetMigrationFiles(migrationFiles: typeof MigrationFile[]): void {
        this.migrationFiles = migrationFiles;
    }
    private Extract(): void {
        this.GetPrefix();

        this.migrationFilesGroup.forEach((mfa)=> {
            //console.log(mfa);
            this.migrationFiles = this.migrationFiles.concat(mfa);
        });
        this.migrationFiles = this.RemoveDuplicates(this.migrationFiles);
    }
    private RemoveDuplicates(names: any[]) {
        return names.filter((value, index)=>names.indexOf(value)===index);
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
    GenerateModelAndEntity(exampleDir: string = ''): void{
        this.InitMigrationFile2();

        let fileManipulation = new FileManip();
        let exampleDest = path.join(
            this.dirname,
            'src/arc-hv/db/examplesForMigration'
        );

        console.log(`exampleDest:: <${exampleDest}>`);

        let allImport = fileManipulation.Name(`${exampleDest}/allImport.txt`).Read();
        let interfaceExample = fileManipulation.Name(`${exampleDest}/interfaceExample.txt`).Read();
        let entityExample = fileManipulation.Name(`${exampleDest}/entityExample.txt`).Read();
        let modelExample = fileManipulation.Name(`${exampleDest}/modelExample.txt`).Read();
        let declarationModelExample = fileManipulation.Name(`${exampleDest}/declarationModelExample.txt`).Read();
        this.migrationFiles2.forEach((migrationFile)=>{
            let table: string = migrationFile.GetInfo().tableName;

            //all imports
            let resultDataAllImports: string = allImport.Format('../arc-hv');
            //console.log('> resultDataAllImports');
            //console.log(resultDataAllImports);

            //interface
            let resultDataInterface: string = interfaceExample.Format(
                this.MoveSeparatorUpdateCapitalLetter(table).UcFirst(),
                migrationFile.GetInfo().properties.model.map((data: any)=>{
                    return `${data.name}?: ${data.type}${(data.nullable) ? ' | null' : ''}`;
                }).join(';\r\n    ')
            );
            //console.log('> resultDataInterface');
            //console.log(resultDataInterface);

            //entity
            let resultDataEntity: string = entityExample.Format(
                this.MoveSeparatorUpdateCapitalLetter(table).UcFirst(),
                `args${this.MoveSeparatorUpdateCapitalLetter(table).UcFirst()}`,
                migrationFile.GetInfo().properties.model.map((data: any)=>{
                    return `this.${data.name} = args${this.MoveSeparatorUpdateCapitalLetter(table).UcFirst()}.${data.name};`;
                }).join('\r\n            '),
                migrationFile.GetInfo().properties.model.map((data: any)=>{
                    return `protected ${data.name}?: ${data.type}${(data.nullable) ? ' | null' : ''};`;
                }).join('\r\n    '),
                migrationFile.GetInfo().properties.model.map((data: any)=>{
                    return `
    Get${data.name.toString().UcFirst()} (): ${data.type}${(data.nullable) ? ' | null' : ''} | undefined {
        return this.${data.name};
    }
    Set${data.name.toString().UcFirst()} (${data.name}: ${data.type}${(data.nullable) ? ' | null' : ''} | undefined = undefined): void {
        this.${data.name} = ${data.name};
    }`;
                }).join('\r\n')
            );
            //console.log('> resultDataEntity');
            //console.log(resultDataEntity);
            //console.log('migrationFile.GetInfo().properties.model');
            //console.log(migrationFile.GetInfo().properties.model);
            
            //model
            let fillables: any[] = [];
            migrationFile.GetInfo().properties.model.forEach((data: any)=>{
                if(data.fillable){
                    fillables.push(JSON.stringify(data.name));
                }
            });
            let hashMembers: any[] = [];
            migrationFile.GetInfo().properties.model.forEach((data: any)=>{
                if(data.hash){
                    hashMembers.push(JSON.stringify(data.name));
                }
            });
            let secureMembers: any[] = [];
            migrationFile.GetInfo().properties.model.forEach((data: any)=>{
                if(data.secure){
                    secureMembers.push(JSON.stringify(data.name));
                }
            });
            let nullables: any[] = [];
            migrationFile.GetInfo().properties.model.forEach((data)=>{
                if(data.nullable){
                    nullables.push(JSON.stringify(data.name));
                }
            });

            let resultDataModel: string = modelExample.Format(
                table,
                this.MoveSeparatorUpdateCapitalLetter(table).UcFirst(),
                fillables,
                hashMembers,
                secureMembers,
                nullables,
            );
            //console.log('> resultDataModel');
            //console.log(resultDataModel);

            //decalration model
            let resultDataDeclarationModel: string = declarationModelExample.Format(
                this.MoveSeparatorUpdateCapitalLetter(table),
                this.MoveSeparatorUpdateCapitalLetter(table).UcFirst()
            );

            //final
            let resultData: string[] = [
                resultDataAllImports,
                resultDataInterface,
                resultDataEntity,
                resultDataModel,
                resultDataDeclarationModel
            ];
            //console.log('> resultData');
            //console.log(resultData.join('\r\n\r\n'));

            //destFinal
            let destFinal = path.join(
                this.dirname_brut,
                appConfigFile.migration["object-dest"],
                this.MoveSeparatorUpdateCapitalLetter(table)+'.db.ts'
            );
            //console.log(`> destFinal:: <${destFinal}>`);

            try{
                fileManipulation.Name(destFinal).Write(resultData.join('\r\n\r\n'));
            } catch(err){
                console.log(`-- Erreur lor de la creation de l'objet '${table}' dans le repertoire '${destFinal}' --`);
                console.log(err);
            }
        });
    }
    Migration(): void{
        this.InitMigrationFile2();

        let dropTableReq = this.migrationFiles2.map((data: any)=>{
            return data.GetInfo().drop;
        }).join('\r\n');
        let renameTableReq = this.migrationFiles2.map((data: any)=>{
            return data.GetInfo().rename;
        }).join('\r\n');
        let tableReq = this.migrationFiles2.map((data: any)=>{
            return data.GetInfo().table;
        }).join('\r\n');
        let otherQueryTableReq = this.migrationFiles2.map((data: any)=>{
            return data.GetInfo().otherQuery.join('\r\n');
        }).join('\r\n');
        let uniquePropertiesTableReq = this.migrationFiles2.map((data: any)=>{
            return data.GetInfo().properties.unique.join('\r\n');
        }).join('\r\n');
        let pkPropertiesTableReq = this.migrationFiles2.map((data: any)=>{
            return data.GetInfo().properties.pk + '\r\n';
        }).join('\r\n');
        let fkPropertiesTableReq = this.migrationFiles2.map((data: any)=>{
            return data.GetInfo().properties.fk.join('\r\n');
        }).join('\r\n');
        let checkPropertiesTableReq = this.migrationFiles2.map((data: any)=>{
            return data.GetInfo().properties.check.join('\r\n');
        }).join('\r\n');
        let dropPropertiesTableReq = this.migrationFiles2.map((data: any)=>{
            return data.GetInfo().properties.drop.join('\r\n');
        }).join('\r\n');
        let renamePropertiesTableReq = this.migrationFiles2.map((data: any)=>{
            return data.GetInfo().properties.rename.join('\r\n');
        }).join('\r\n');
        
        let allReq = `${dropTableReq}\r\n${tableReq}\r\n${pkPropertiesTableReq}\r\n${fkPropertiesTableReq}\r\n${uniquePropertiesTableReq}\r\n${checkPropertiesTableReq}\r\n${(renamePropertiesTableReq.length>0) ? dropPropertiesTableReq : ''}\r\n${renamePropertiesTableReq}\r\n${renameTableReq}\r\n${otherQueryTableReq}`;
        //console.log(allReq);
        let nameFile = "{0}_bd_{1}.sql".Format(
            appConfigFile["name"].ReplaceAll(" ", "_"),
            Date.now()
        )
        let destFinal = path.join(
            this.dirname_brut,
            appConfigFile.migration["SQL-dest"],
            nameFile
        );
        let resultFinal: string = allReq.split('\r\n').filter(
            (value: string, index: number, array: string[]) => {
                return value.length>0;
            }
        ).join('\r\n');

        //console.log('> allReq');
        //console.log(
        //    resultFinal
        //);
        //console.log(`> destFinal:: < ${destFinal} >`);
        
        let fileManipulation = new FileManip();
        try{
            fileManipulation.Name(destFinal).Write(resultFinal);
            console.log('-- Migration réussi avec succès --');
        } catch(err){
            console.log(`-- Erreur lor de la migration des données dans le repertoire '${destFinal}' --`);
            console.log(err);
        }
    }
    Init(exampleDir: string = ''): void {
        console.log('----- DEBUT DE LA MIGRATION -----');
        try {
            //console.log(this.GetMigrationFiles());
            this.Migration();
            this.GenerateModelAndEntity(exampleDir);
            console.log('migration reussi avec succès');
        } catch (err) {
            console.log('> err:: echec de la migration');
            console.log(err);
        }
        console.log('----- FIN - DEBUT DE LA MIGRATION -----');
    }
}