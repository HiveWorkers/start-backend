import * as CryptoJS from 'crypto-js';
import * as appConfigFile from '../../../AppConfig.json';
import { HexaString } from '../other/hexa.string';
import { ByteString } from '../other/byte.string';

export class Aes {
    private keys: string = appConfigFile["encryption_key"];
    private hexaString: HexaString = new HexaString();
    private byteString: ByteString = new ByteString();

    constructor() {} 

  Encrypt(value: string) : string
  {
     var key = CryptoJS.enc.Utf8.parse(this.keys);
     var iv = CryptoJS.enc.Utf8.parse(this.keys);
     var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
    {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
  }
  EncryptHexa(value: string) : string
  {
    return this.hexaString.StringToHexa(
      this.Encrypt(value)
    );
  }
  EncryptByte(value: string) : number[]
  {
    return this.byteString.StringToByte(
      this.Encrypt(value)
    );
  }

  Decrypt(value: string) : string
  {
    var key = CryptoJS.enc.Utf8.parse(this.keys);
    var iv = CryptoJS.enc.Utf8.parse(this.keys);
    var decrypted = CryptoJS.AES.decrypt(value, key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
  DecryptHexa(value: string) : string
  {
    return this.Decrypt(
      this.hexaString.HexaToString(value)
    );
  }
  DecryptByte(value: number[]) : string
  {
    return this.Decrypt(
      this.byteString.ByteToString(value)
    );
  }
}
