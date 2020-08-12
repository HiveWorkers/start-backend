import { FileManip } from './file';

export class JsonManip extends FileManip
{
    protected contentVarTarget: string = '';
    protected contentVar: string[] = [];
    constructor(name: string = "", mode: string = 'a')
    {
        super(name, mode);
    } 
    
    Name(name: string)
    {
        if(name.indexOf(".json")<0 && name.length>0)
        {
            throw("Veuillez choisir un fichier json");
        }
        this.fileNameVar = name;
        try{
            this.contentVar = JSON.parse(this.Read());
        }catch(error){
            this.contentVar = [];
        }
        this.contentVarTarget = "";
        return this;
    }
    Serialize(JSONdata = null)
    {
        var result = "";
        if(JSONdata != null)
        {
            result = JSON.stringify(JSONdata);
        } else
        {
            result = JSON.stringify(this.contentVar);
        }
        return result;
    }
    Deserialize(STRINGdata = "")
    {
        var result = {};
        if(STRINGdata.length > 0)
        {
            result = JSON.parse(STRINGdata);
        } else
        {
            result = this.contentVar;
        }
        return result;
    }
}