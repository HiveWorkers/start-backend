import * as appConfigFile from '../../../AppConfig.json';
import { Pool, QueryResult } from 'pg';
import * as mysql from 'mysql';

export class SQLDb
{
    private typeConnexion: string = appConfigFile["database"]["connexion"] || '';
    private host: string = appConfigFile["database"]["host"] || '';
    private port: number = appConfigFile["database"]["port"] || 0;
    private user: string = appConfigFile["database"]["user"] || '';
    private password: string = appConfigFile["database"]["password"] || '';
    private database: string = appConfigFile["database"]["database"] || '';
    constructor(){}

    async Result(requete: string)
    {
        let params: any[] = [];
        let fin: any = [];
        if (this.typeConnexion == "pgsql")
        {
            fin = await this.ResultPGSQL(requete, params);
        } else if (this.typeConnexion == "mysql")
        {
            fin = await this.ResultMYSQL(requete, params);
        }
        return fin;
    }
    async Execute(requete: string)
    {
        let fin: any = [];
        let params: any[] = [];
        if (this.typeConnexion == "pgsql")
        {
            fin = await this.ExecutePGSQL(requete, params);
        } else if (this.typeConnexion == "mysql")
        {
            fin = await this.ExecuteMYSQL(requete, params);
        }
        return fin;
    }

    ConPGSQL(): Pool
    {
        const pool: Pool = new Pool({
            user: this.user,
            host: this.host,
            database: this.database,
            password: this.password,
            port: this.port
        });
        return pool;
    }
    async ResultPGSQL(requete: string, params: any[] = []): Promise<any[] | Error>
    {
        const pool: Pool = this.ConPGSQL();
        let res = await pool.query(requete, params)
            .then((data)=> {
                return data.rows;
            })
            .catch((err) => {
                throw new Error(err);
                //const ce = new Error(JSON.stringify(err.message), 'SQLDatabaseManipulation - Result - PGSQL');
                //throw ce;
                //return ce;
            });
        return res;
    }
    async ExecutePGSQL(requete: string, params: any[] = [])
    {
        const client: Pool = this.ConPGSQL();
        //console.log(requete);
        let fin: any = '';
        let res = await client.query(requete, params)
        .catch((err) => {
            throw new Error(err);
            //throw new Error(JSON.stringify(err.message), 'SQLDatabaseManipulation - Execute - PGSQL');
        });
    }

    ConMYSQL(): mysql.Pool
    {
        let pool: mysql.Pool  = mysql.createPool({
            user: this.user,
            host: this.host,
            database: this.database,
            password: this.password
        });
        return pool;
    }
    async ResultMYSQL(requete: string, params: any[] = [])
    {
        const pool: mysql.Pool = this.ConMYSQL();
        requete = mysql.format(requete, params);
        return await new Promise((resolve, reject) => {
            pool.query(requete, (err: mysql.MysqlError, rows, fields: mysql.FieldInfo) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        }).catch((err) => {
            throw new Error(err);
            //throw new Error(JSON.stringify(err.message), 'SQLDatabaseManipulation - Result - MYSQL');
        });
    }
    async ExecuteMYSQL(requete: string, params: any[] = [])
    {
        const pool: mysql.Pool = this.ConMYSQL();
        requete = mysql.format(requete, params);
        let fin: any = '';
        let res = new Promise((resolve, reject) => {
            pool.query(requete, (err: mysql.MysqlError, rows, fields: mysql.FieldInfo) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        }).catch((err) => {
            throw new Error(err);
            //throw new Error(JSON.stringify(err.message), 'SQLDatabaseManipulation - Execute - MYSQL');
        });
    }
}