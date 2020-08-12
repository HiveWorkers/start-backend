import { BaseError } from "./error/base.error";
import { StringSup } from './string';
import { Sha } from "../security/sha";
import { Aes } from "../security/aes";

let sha1:Sha = new Sha();
let aes1:Aes = new Aes();
let stringSup: StringSup = new StringSup();

export interface JSONOptions {
    nullable?: boolean;
    hash?: boolean;
    encrypt?: boolean;
    decrypt?: boolean;
};

export class SQLFormat
{
    Json(
        value: any,
        begin: string = '',
        end: string = '',
        options: JSONOptions = {
            nullable: false,
            hash: false,
            encrypt: false,
            decrypt: false,
        },
        simpleQuotePresence: boolean = false,
        quote: string = '\''
    ): any {
        //console.log(`SQLFormat - Json:: <${typeof(value)}>`);
        //console.log(`SQLFormat - Json - options:: <${JSON.stringify(options)}>`);
        let result: string = '';
        if (simpleQuotePresence) {
            quote = '$$$';
        } else {
            quote = '\'';
        }

        if(options.nullable && typeof(value)=='string' && value.length < 0) {
            throw new BaseError({code: 23502});
        }
        if(typeof(value)=='string') {
            if(options.hash) {
                value = sha1.Hash(value);
            }
            if(options.encrypt) {
                value = aes1.EncryptHexa(value);
            } else {
                if(options.decrypt) {
                    value = aes1.DecryptHexa(value);
                }
            }
        }

        if(value == null) {
            result = `${JSON.stringify(value)}`;
        } else if(typeof(value)=='string') {
            if(
                value.toLocaleLowerCase() == 'not null' ||
                value.toLocaleLowerCase() == 'null'
            ) {
                result = `${value}`;
            } else {
                result = `${quote}${begin}${value}${end}${quote}`;
            }
        } else if(typeof(value)=='number' || typeof(value)=='boolean') {
            result = value.toString();
        } else if(typeof(value)=='object') {
            result = `${quote}${JSON.stringify(value)}${quote}`;
        } else {
            result = `${quote}${JSON.stringify(value)}${quote}`;
        }

        //result = JSON.stringify(value);
        //if(typeof(value)=='object'){
        //    result = JSON.stringify(result);
        //}
        //if (result.charAt(0)=='"' && result.charAt(result.length-1)=='"') {
        //    result = result.ReplaceAt(0, '¤').ReplaceAt(result.length-1, '¤');
        //}

        //result = result.ReplaceAll('"', '<>').ReplaceAll('\\<>', '\'');
        //result = result.ReplaceAllRegExp('\'', '\\\'');
        //result = result.ReplaceAll('¤', quote).ReplaceAll('¤', quote);

        return result;
    }
}