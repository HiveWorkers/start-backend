import { Aes } from "./aes";
import { HexaString } from "../other/hexa.string";

export class ProtectUrl {
    private aes: Aes = new Aes();
    private hexaString: HexaString = new HexaString();
    private separator: string = ' ';
    constructor() {
    }

    Encrypt(value: string): string
    {
        //console.log('******** encrypt phase *******');
        //console.log(value);
        const result_string = JSON.stringify(value);
        //console.log(result_string);
        //console.log(typeof result_string);
        const dt = this.aes.Encrypt(result_string);
        //console.log(dt);
        //console.log(typeof dt);
        const dt_byte = this.hexaString.StringToHexa(dt);
        //console.log(dt_byte);
        //console.log(typeof dt_byte);
        return dt_byte;
    }

    Decrypt(value: string): string
    {
        //console.log('******** decrypt phase *******');
        //console.log(value);
        const data2 = this.hexaString.HexaToString(value);
        //console.log(data2);
        //console.log(typeof data2);
        const data3 = this.aes.Decrypt(data2);
        //console.log(data3);
        //console.log(typeof data3);
        const data4 = JSON.parse(data3);
        //console.log(data4);
        //console.log(typeof data4);
        //console.log('******** decrypt phase fin *******');
        return data4;
    }
}