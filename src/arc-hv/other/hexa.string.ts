export class HexaString {
    private bit: number = 16;
    constructor(bit: number = 16) {
        this.bit = bit;
    }
  
    HexaToString(hexa: any): string {
        var j;
        var hexes = hexa.match(/.{1,4}/g) || [];
        var back = "";
        for(j = 0; j<hexes.length; j++) {
            back += String.fromCharCode(parseInt(hexes[j], this.bit));
        }
    
        return back;
    }
  
    StringToHexa(str: string): any {
        var hex, i;
    
        var result = "";
        for (i=0; i<str.length; i++) {
            hex = str.charCodeAt(i).toString(this.bit);
            result += ("000"+hex).slice(-4);
        }
    
        return result
    }
}