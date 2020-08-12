import * as fs from 'fs';

export class FileManip
{
    protected fileNameVar: string = '';
    protected mode: string = '';
    constructor(name: string = "", mode: string = 'a')
    {
        this.Name(name);
        this.mode = mode;
    } 

    Exist(): boolean
    {
        let result = false;
        if (fs.existsSync(this.fileNameVar)){
            result = true;
        } else
        {
            result = false;
        }
        //fs.access(this.fileNameVar, fs.F_OK, (err) => {
        //    if (err) {
        //        result = false;
        //    } else
        //    {
        //        result = true;
        //    }
        //})
        return result;
    }
    Name(name: string): FileManip
    {
        this.fileNameVar = name;
        return this;
    }
    Delete(path: string = this.fileNameVar): void
    { 
        if (!this.Exist())
        {
            console.log("File not exists");
        } else
        {
            fs.unlinkSync(path);
        }
    }
    Rename(name: string): void
    {
        if (!this.Exist())
        {
            console.log("Directory not exists");
        } else
        {
            fs.renameSync(this.fileNameVar, name);
        }
    }
    Write(content: string, mode: string = 'w', line: boolean = false): void
    {
        let lineSeparator = "";
        if(line==true)
        {
            lineSeparator = "\r\n";
        }
        this.mode = mode;
        let buffer = new Buffer(content + lineSeparator);
        fs.open(this.fileNameVar, this.mode, function( err, fd ) {
            if (err) {
                throw "impossible d'ouvrir le fichier: " + err;
            }
            fs.write( fd, buffer, 0, buffer.length, null, function(er){
                if (er) throw "erreur lors de l'ecriture du fichier: " + er;
                fs.close(fd, function(){
                    console.log('fichier modifié');
                });
            });
        });
    }
    WriteLine(content: string, mode: string = 'w'): void
    {
        this.Write(content, mode, true);
    }
    Read(): string
    {
        let result = fs.readFileSync(this.fileNameVar).toString();
        return result;
    }
    ReadLine(): string[]
    {
        let resultText = this.Read();
        let result = resultText.split("\r\n");
        return result;
    }
}