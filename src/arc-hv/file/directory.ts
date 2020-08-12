import * as fs from 'fs';
import * as Path from 'path';

export class DirectoryManip
{
    private directoryNameVar: string = '';
    constructor(name: string = "")
    {
        this.Name(name);
    } 

    Name(name: string): DirectoryManip
    {
        this.directoryNameVar = name;
        return this;
    }
    Rename(name: string): void
    {
        if (!this.Exist())
        {
            console.log("Directory not exists");
        } else
        {
            fs.renameSync(this.directoryNameVar, name);
        }
    }
    Exist(): boolean
    {
        var result = false;
        if (fs.existsSync(this.directoryNameVar)){
            result = true;
        } else
        {
            result = false;
        }
        return result;
    }
    Create(): void
    {   
        if (this.Exist())
        {
            console.log("Directory exists");
        } else
        {
            fs.mkdirSync(this.directoryNameVar);
        }
    }
    Delete(path: string = this.directoryNameVar): void
    { 
        if (!this.Exist())
        {
            console.log("Directory not exists");
        } else
        {
            fs.readdirSync(path).forEach(function(file,index){
                var curPath = Path.join(path, file);
                if(fs.lstatSync(curPath).isDirectory()) {
                    fs.rmdirSync(curPath);   
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    }
    FileChild(rep: string = this.directoryNameVar): string[]
    {
        var datas = fs.readdirSync(rep);
        return datas;
    }
}