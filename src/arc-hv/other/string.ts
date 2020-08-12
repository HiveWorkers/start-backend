declare global {
    interface String
    {
        UcFirst(): string;
        ReplaceAt(index: number, replacement: string): string;
        ReplaceAll(search: string, replacement: string): string;
        ReplaceAllRegExp(search: string, replacement: string): string;
        Format(...arg: any[]): any;
        NamedFormat(argsVal: object): any;
    }
}
export class StringSup
{
    constructor()
    {
        String.prototype.UcFirst = function() {
            let data = this;
            return data.charAt(0).toUpperCase() + data.slice(1);
        }
        String.prototype.ReplaceAt = function(index: number, replacement: string) {
            return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
        }
        String.prototype.ReplaceAll = function(search: string, replacement: string) {
            let a = this;
            //let b = a.replace(new RegExp(search, 'g'), replacement);
            let b = ReplaceAllWithoutRegex(a as string, search, replacement);
            return b;
        }
        String.prototype.ReplaceAllRegExp = function(search: string, replacement: string) {
            let a = this;
            let b = a.replace(new RegExp(search, 'g'), replacement);
            return b;
        }
        String.prototype.Format = function() {
            let a: any = this;
            for (let k in arguments) {
                let arg = "{" + k + "}";
                a = ReplaceAllWithoutRegex(a, arg, arguments[k]);
            }
            return a;
        }
        String.prototype.NamedFormat = function(argsVal: any) {
            let stringVal: any = this;
            Object.keys(argsVal as object).forEach(function(key){
                let arg = "{" + key + "}";
                stringVal = ReplaceAllWithoutRegex(stringVal, arg, argsVal[key]);
            });
            return stringVal;
        }
    }
};
function ReplaceAllWithoutRegex(data: string, search: string, replace: string): string{
    data = data.replace(search, replace);
    if(data.indexOf(search)>0){
        data = ReplaceAllWithoutRegex(data, search, replace);
    }
    return data;
}