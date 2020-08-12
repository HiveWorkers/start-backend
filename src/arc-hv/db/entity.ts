import * as appConfigFile from '../../../AppConfig.json';
import { StringSup } from '../other/string';
import { SQLFormat } from '../other/sql.format';
import { Sha } from '../security/sha';
import { Aes } from '../security/aes';

const sha:Sha = new Sha();
const aes:Aes = new Aes();
const sQLFormat: SQLFormat = new SQLFormat();
const stringSup = new StringSup();

export class Entity<IE>{
    constructor (argsEntity?: IE) {
        if(argsEntity){

        }
    }
    Init (argsEntity?: IE) {
        if(argsEntity){

        }
    }
    Extract(nullable: any[] = [], fillable: any[] = [], hash_member: any[] = [], secure_member: any[] = []): any{
        let datas = JSON.parse(JSON.stringify(this));

        //console.log(`datas:: ${JSON.stringify(datas)}`);
        //fillable
        Object.keys(datas).forEach((key)=>{
            if(
                (
                    datas[key]==undefined &&
                    datas[key]!=null
                ) ||
                datas[key]==NaN
            ){
                delete datas[key];
            }
            if(!fillable.includes(key) && fillable.length>0){
                delete datas[key];
            }
        });
        //console.log(`fillable - datas:: ${JSON.stringify(datas)}`);
        //nullable
        Object.keys(datas).forEach((key)=>{
            if(
                (
                    (
                        typeof(datas[key]) == 'string' &&
                        datas[key].length <= 0
                    )
                ) &&
                !nullable.includes(datas[key])
            ) {
                delete datas[key];
            }
        });
        //hash and secure
        Object.keys(datas).forEach((key)=>{
            if(hash_member.includes(key)){
                datas[key] = sha.Hash(datas[key]);
            }
            if(secure_member.includes(key)){
                datas[key] = aes.EncryptHexa(datas[key]);
            }
        });
        //encode url
        Object.keys(datas).forEach((key)=>{
            if(typeof datas[key] == "string") {
                datas[key] = String(datas[key])
                    .ReplaceAll(`'`, '&#39;')
                    .ReplaceAll(`"`, '&#34;')
                    .ReplaceAll(`$`, '&#36;');
            }
        });

        let result: any = {
            json: JSON.stringify(datas),
            keys: Object.keys(datas).join(', '),
            values: Object.keys(datas).map((key)=>{
                return sQLFormat.Json(datas[key]);
            }).join(', '),
            set: Object.keys(datas).map((key)=>{
                return `${key} = ${sQLFormat.Json(datas[key])}`;
            }).join(', ')
        };
        return result;
    }
}