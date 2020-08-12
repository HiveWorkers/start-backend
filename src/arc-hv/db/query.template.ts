import { StringSup } from "../other/string";
import { SQLDb } from "./sql.database";


const stringSup = new StringSup();

export class QueryTemplate
{
    private sQLDb: SQLDb = new SQLDb();
    constructor(){

    }

    async Query(requete: string, params: object = {})
    {
        requete = requete.NamedFormat(params);
        return await this.sQLDb.Result(requete);
    }
    Execute(requete: string, params: object = {})
    {
        requete = requete.NamedFormat(params);
        return this.sQLDb.Execute(requete);
    }
}