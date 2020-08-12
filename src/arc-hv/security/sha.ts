import * as CryptoJS from 'crypto-js';
import { HexaString } from '../other/hexa.string';
import { ByteString } from '../other/byte.string';
import * as AppConfigJson from '../../../AppConfig.json';

export class Sha {
  private hexaString: HexaString = new HexaString();
  private byteString: ByteString = new ByteString();
  Hash(str: string): string{
    return CryptoJS.SHA512(str, AppConfigJson.encryption_key).toString(CryptoJS.enc.Hex);
  }
  HashHexa(str: string): string{
    return this.hexaString.StringToHexa(
      this.Hash(str)
    );
  }
  HashByte(str: string): number[]{
    return this.byteString.StringToByte(
      this.Hash(str)
    );
  }
  
}