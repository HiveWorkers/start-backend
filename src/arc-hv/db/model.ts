import * as appConfigFile from '../../../AppConfig.json';
import { StringSup } from '../other/string';
import { Entity } from './entity';
import { SQLFormat, JSONOptions } from '../other/sql.format';
import { SQLDb } from './sql.database';
import { Sha } from '../security/sha';
import { Aes } from '../security/aes';
import { InstantiateGenericTypeEntity } from '../other/object.sup';
//import { InstantiateGenericType, InstantiateGenericTypeEntity } from '@ntouba98/quicktools/object-manipulation/objectSup';

let sha:Sha = new Sha();
let aes:Aes = new Aes();
let stringSup: StringSup = new StringSup();

interface MessageModel{
    good : string | null;
    unique_violation : string | null;
    not_null_violation : string | null;
    check_violation : string | null;
    exclusion_violation : string | null;
    fk_violation : string | null;
    restrict_violation : string | null;
    integrity_constraint_violation : string | null;
    string_data_right_truncation : string | null;
    no_data_found : string | null;
    unknown : string | null;
}

const sQLFormat: SQLFormat = new SQLFormat();

export function Model(prefix: IModel) {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
          prefix = prefix;
        }
    }
}

export interface IModel{
    table?: string;
    nullable?: string[];
    fillable?: string[];
    hash_member?: string[];
    secure_member?: string[];
};

export class CViewModel<IE>
{
    protected prefix: IModel = {};
    protected sQLDatabaseManipulation: SQLDb = new SQLDb();
    protected wherecondreq: any[] = [];
    protected orwherecondreq: any[] = [];
    protected limit_val: string = '';
    protected skip_val: string = '';
    protected limitcondreq: string = '';
    protected ordercondreq: any[] = [];
    protected table: string = '';
    protected nullable: string[] = [];
    protected fillable: string[] = [];
    protected hash_member: string[] = [];
    protected secure_member: string[] = [];
    protected resultFinal: string = "";

    protected GetPrefix() {
        this.table = this.prefix.table || '';
        this.nullable = this.prefix.nullable || [];
        this.fillable = this.prefix.fillable || [];
        this.hash_member = this.prefix.hash_member || [];
        this.secure_member = this.prefix.secure_member || [];

        //console.log('> table');
        //console.log(this.table);
        //console.log('> fillable');
        //console.log(this.fillable);
        //console.log('> hash_member');
        //console.log(this.hash_member);
        //console.log('> secure_member');
        //console.log(this.secure_member);
    }

    async FindOne(
        otherFillable: string[] = [],
        hash_member: string[] = [],
        secure_member: string[] = []
    ): Promise<IE | undefined> {
        const results = await this.Find(otherFillable, hash_member, secure_member);
        if(results.length>0)
        {
            return results[0];
        } else {
            return undefined;
        }
    }
    async Find(
        otherFillable: string[] = [],
        hash_member: string[] = [],
        secure_member: string[] = []
    ): Promise<IE[]> {
        this.GetPrefix();
        
        let results: IE[] = [];
        if(
            this.GetWherePart().length > 0
        ){
            const existTest = ((await this.Exist())) ? (await this.Exist()) : false;
            if( existTest ) {
                const req: string = `SELECT ${this.GetFillable(otherFillable).join(" , ")} FROM ${this.table}${this.CondFinal()}`;
                //console.log(`Get - req:: <${req}>`);
                let dataResult: IE[] = await this.sQLDatabaseManipulation.Result(req).catch((err)=>{
                    throw new Error(err);
                });
                results = this.GetSecureResult(dataResult, hash_member, secure_member);
            } else {
                results = [];
            }
        } else {
            results = [];
        }
        
        return results;
    }
    async First(otherFillable: string[] = []): Promise<IE | undefined> {
        const results = await this.Get(otherFillable);
        if(results.length>0)
        {
            return results[0];
        } else {
            return undefined;
        }
    }
    async Get(
        otherFillable: string[] = [],
        hash_member: string[] = [],
        secure_member: string[] = []
    ): Promise<IE[]> {
        this.GetPrefix();
        
        const req: string = `SELECT ${this.GetFillable(otherFillable).join(" , ")} FROM ${this.table}${this.CondFinal()}`;
        console.log(`Get - req:: <${req}>`);
        let dataResult: IE[] = await this.sQLDatabaseManipulation.Result(req).catch((err)=>{
            throw new Error(err);
        });
        let results: IE[] = this.GetSecureResult(dataResult, hash_member, secure_member);
        
        return results;
    }
    async All(
        otherFillable: string[] = [],
        hash_member: string[] = [],
        secure_member: string[] = []
    ): Promise<IE[]> {
        this.GetPrefix();
        
        const req: string = `SELECT ${this.GetFillable(otherFillable).join(" , ")} FROM ${this.table}`;
        console.log(`req:: <${req}>`);
        const dataResult = await this.sQLDatabaseManipulation.Result(req).catch((err)=>{
            throw new Error(err);
        });
        const results = this.GetSecureResult(dataResult, hash_member, secure_member);
        
        return results;
    }
    async Exist(): Promise<boolean>{
        this.GetPrefix();
        
        let result = false;
        const req: string = `SELECT COUNT(*) as length FROM ${this.table}${this.CondFinal()}`;
        console.log(`Exist - req:: <${req}>`);
        const dataResult = await this.sQLDatabaseManipulation.Result(req).catch((err)=>{
            throw new Error(err);
        });
        result = ((dataResult[0]['length'] as number) || 0) >0;

        return result;
    }
    
    CleanCondition (): void {
        this.CleanLimit();
        this.CleanOrder();
        this.CleanWhere();
    }
    CleanWhere (): void {
        this.wherecondreq = [];
        this.orwherecondreq = [];
    }
    CleanLimit (): void {
        this.limitcondreq = '';
    }
    CleanOrder (): void {
        this.ordercondreq = [];
    }
    Where(
        params: {
            column: string;
            operator: string;
            value: any;
            begin?: string;
            end?: string;
            indepth?: boolean;
            options?: JSONOptions;
        }
    ){
        this.GetPrefix();

        params.begin = (params.begin) ? params.begin : '';
        params.end = (params.end) ? params.end : '';
        params.indepth = (params.indepth) ? params.indepth : false;
        params.options = (params.options) ? params.options : {
            nullable: this.nullable.includes(params.column),
            hash: this.hash_member.includes(params.column),
            encrypt: this.secure_member.includes(params.column),
            decrypt: false,
        };

        const sv: string[] | undefined = this.separateValue(params.value);
        if(params.indepth && sv && sv.length > 0) {
            sv.forEach((data) => {
                this.wherecondreq.push(`${params.column} ${params.operator} ${sQLFormat.Json(data, params.begin, params.end, params.options)}`);
            });
        } else {
            this.wherecondreq.push(`${params.column} ${params.operator} ${sQLFormat.Json(params.value, params.begin, params.end, params.options)}`);
        }/* else {
            throw new Error('column(s) BD not exists');
        }*/
        return this;
    }
    OrWhere(
        params: {
            column: string;
            operator: string;
            value: any;
            begin?: string;
            end?: string;
            indepth?: boolean;
            options?: JSONOptions;
        }
    ){
        this.GetPrefix();

        params.begin = (params.begin) ? params.begin : '';
        params.end = (params.end) ? params.end : '';
        params.indepth = (params.indepth) ? params.indepth : false;
        params.options = (params.options) ? params.options : {
            nullable: this.nullable.includes(params.column),
            hash: this.hash_member.includes(params.column),
            encrypt: this.secure_member.includes(params.column),
            decrypt: false,
        };

        console.log(`this.fillable:: <${JSON.stringify(this.fillable)}>`);
        console.log(`params.column:: <${JSON.stringify(params.column)}>`);
        const sv: string[] | undefined = this.separateValue(params.value);
        if(params.indepth && sv && sv.length > 0) {
            sv.forEach((data) => {
                this.orwherecondreq.push(`${params.column} ${params.operator} ${sQLFormat.Json(data, params.begin, params.end, params.options)}`);
            });
        } else {
            this.orwherecondreq.push(`${params.column} ${params.operator} ${sQLFormat.Json(params.value, params.begin, params.end, params.options)}`);
        }
        return this;
    }
    WhereMultiple(
        params: {
            columns: string[];
            operator: string;
            value: any;
            begin?: string;
            end?: string;
            indepth?: boolean;
            options?: JSONOptions;
        }
    ) {
        params.columns.forEach((column)=> {
            const paramsFinal: {
                column: string;
                operator: string;
                value: any;
                begin?: string;
                end?: string;
                indepth?: boolean;
                options?: JSONOptions;
            } = {
                column:  column,
                operator: params.operator,
                value: params.value,
                begin: params.begin,
                end: params.end,
                indepth: params.indepth,
                options: params.options
            }
            this.Where(paramsFinal);
        });
        return this;
    }
    OrWhereMultiple(
        params: {
            columns: string[];
            operator: string;
            value: any;
            begin: string;
            end: string;
            indepth?: boolean;
            options?: JSONOptions;
        }
    ) {
        params.columns.forEach((column)=> {
            const paramsFinal: {
                column: string;
                operator: string;
                value: any;
                begin?: string;
                end?: string;
                indepth?: boolean;
                options?: JSONOptions;
            } = {
                column:  column,
                operator: params.operator,
                value: params.value,
                begin: params.begin,
                end: params.end,
                indepth: params.indepth,
                options: params.options
            }
            this.OrWhere(paramsFinal);
        });
        return this;
    }
    Limit(
        params: {
            limit: number;
            offset?: number;
        }
    ){
        params.offset = (params.offset) ? params.offset : 0;
        if(params.limit && params.offset) {
            this.limit_val = Math.floor(params.limit).toString();
            this.skip_val = Math.floor(params.offset).toString();
            this.limitcondreq = ` LIMIT ${this.limit_val} OFFSET ${this.skip_val}`;
        }
        return this;
    }
    Order(
        params: {
            column: string;
            order?: 'asc' | 'ASC' | 'desc' | 'DESC';
        }
    ){
        params.order = (params.order) ? params.order : 'asc';
        if(params.column && params.order) {
            var params2 = `${params.column} ${params.order.toUpperCase()}`;
            this.ordercondreq.push(params2);
        }
        return this;
    }
    OrderMultiple(
        params: {
            columns: string[];
            order?: 'asc' | 'ASC' | 'desc' | 'DESC';
        }
    ) {
        params.columns.forEach((column) => {
            const paramsFinal: {
                column: string;
                order?: 'asc' | 'ASC' | 'desc' | 'DESC';
            } = {
                column: column,
                order: params.order
            };
            this.Order(paramsFinal);
        });
        return this;
    }
    
    private separateValue(value: any): string[] | undefined {
        let result;
        const indice: string[] = ['+', ' ', `'`, `.`, '-'];
        const MoveVideElement = function(value: string[]): string[] {
            let result: string[] = value;
            value.forEach(function(data: string, index: number) {
                if(data.length <= 0) {
                    result.splice(index, 1);
                }
            });
            return result;
        }
        const OrganizedValue = function(value: string): string {
            let organizedValue: string = value;
            indice.forEach(function(data: string) {
                organizedValue = organizedValue.ReplaceAll(data, '+');
            });
            return organizedValue;
        }
        if(typeof(value)=="string") {
            result = OrganizedValue(value)
            .split('+');
            result = MoveVideElement(result);
            //result = result2(result);
            //result = result3(result);
            console.log(result);
            result = (result) ? result : [];
        }
        return result;
    }
    protected GetFillable (othersFillables: any[] = []): any[] {
        let fillables: any[] = this.fillable;
        let result: any[] = [];

        if( othersFillables.length <= 0 ){
            result = fillables;
        } else {
            othersFillables.forEach((data)=>{
                if(fillables.includes(data)){
                    result.push(data);
                }
            });
            if(result.length<=0){
                result = fillables;
            }
        }
        
        return result;
    }
    protected GetSecureResult(datas: any[], hash_member: string[] = [], secure_member: string[] = []): any[]{
        const arranger = function(datas: any[]) {
            const datas_pre1 = JSON.stringify(datas);
            const datas_pre2 = datas_pre1
                .ReplaceAll('&#39;', `'`)
                .ReplaceAll('&#34;', `"`)
                .ReplaceAll('&#36;', `$`);
            const datas_pre3 = JSON.parse(datas_pre2);
            datas = datas_pre3;
            
            //console.log(`>> datas_pre1`);
            //console.log(datas_pre1);
            //console.log(`>> datas_pre2`);
            //console.log(datas_pre2);
            //console.log(`>> datas_pre3`);
            //console.log(datas_pre3);
            //console.log(`>> datas`);
            //console.log(datas);

            return datas;
        };
        let result: any[] = arranger(datas);
        (result as any[]).map((data)=>{

            Object.keys(data).forEach((key)=>{
                if(hash_member.includes(key)){
                    data[key] = sha.Hash(data[key]);
                }
                if(secure_member.includes(key)){
                    data[key] = aes.EncryptHexa(data[key]);
                    //data[key] = (stateEncrypt) ? aes.EncryptHexa(data[key]) : aes.DecryptHexa(data[key]);
                }
            });
            return data;
        });
        return result;
    }
    protected GetWherePart(wherePresence: boolean = true): string
    {
        let whererequete: string = '';
        if (this.wherecondreq.length > 0) {
          whererequete = whererequete + this.wherecondreq.join(' AND ');
        }
        if (this.wherecondreq.length > 0 && this.orwherecondreq.length > 0) {
          whererequete = whererequete + ' OR ';
        }
        if (this.orwherecondreq.length > 0) {
          whererequete = whererequete + this.orwherecondreq.join(' OR ');
        }
        if (whererequete.length > 0) {
            if (wherePresence) {
                whererequete = ' WHERE( ' + whererequete + ' )';
            }
        }
        return whererequete;
    }
    protected GetOrderPart(): string
    {
        let orderrequete: string = '';
        if (this.ordercondreq.length > 0) {
          orderrequete = ` ORDER BY ${this.ordercondreq.join(' , ')} `;
        }
        return orderrequete;
    }
    protected CondFinal(): string{
      var whererequete = this.GetWherePart();
      
      var orderrequete = this.GetOrderPart();

      var requete = `${whererequete}${orderrequete}${this.limitcondreq}`;
      return requete;
    }
}

export class CModel<E extends Entity<IE>, IE> extends CViewModel<IE>
{
    protected elementEntity: E;
    constructor(EntityType: (new (argsEntity?: IE) => E)){
        super();
        this.elementEntity = InstantiateGenericTypeEntity(EntityType);
    }

    async Edit(element?: IE): Promise<void> {
        this.GetPrefix();
            
        //console.log(`this.nullable:: <${JSON.stringify(this.nullable)}>`);
        //console.log(`this.fillable:: <${JSON.stringify(this.fillable)}>`);
        //console.log(`this.hash_member:: <${JSON.stringify(this.hash_member)}>`);
        //console.log(`this.secure_member:: <${JSON.stringify(this.secure_member)}>`);
        this.elementEntity.Init(element);
        //console.log(`this.elementEntity:: <${JSON.stringify(this.elementEntity)}>`);
        let dataExtractElement: any = this.elementEntity.Extract(
            this.nullable,
            this.fillable,
            this.hash_member,
            this.secure_member
        );
        let req: string = '';
        
        if(
            this.GetWherePart().length > 0
        ){
            const existTest = ((await this.Exist())) ? (await this.Exist()) : false;

            if( existTest ) {
                //console.log(`dataExtractElement:: <${JSON.stringify(dataExtractElement)}>`);
                req = `UPDATE ${this.table} SET ${dataExtractElement.set}${this.GetWherePart()}`;
            } else {
                req = `INSERT INTO ${this.table}(${dataExtractElement.keys}) VALUES (${dataExtractElement.values})`;
            }
        } else {
            req = `INSERT INTO ${this.table}(${dataExtractElement.keys}) VALUES (${dataExtractElement.values})`;
        }
        console.log(`req:: <${req}>`);
        await this.sQLDatabaseManipulation.Execute(req);
    }
    async Create(element?: IE): Promise<void> {
        this.GetPrefix();
        
        this.elementEntity.Init(element);
        let dataExtractElement: any = this.elementEntity.Extract(
            this.nullable,
            this.fillable,
            this.hash_member,
            this.secure_member
        );
        //console.log('--create--');
        //console.log(dataExtractElement);
        let req: string = `INSERT INTO ${this.table}(${dataExtractElement.keys}) VALUES (${dataExtractElement.values})`;
        console.log(`req:: <${req}>`);

        await this.sQLDatabaseManipulation.Execute(req);
    }
    async Update(element?: IE): Promise<void> {
        this.GetPrefix();
        
        if(
            this.GetWherePart().length > 0
        ){
            const existTest = ((await this.Exist())) ? (await this.Exist()) : false;
            if( existTest ) {
                //console.log(`this.nullable:: <${JSON.stringify(this.nullable)}>`);
                //console.log(`this.fillable:: <${JSON.stringify(this.fillable)}>`);
                //console.log(`this.hash_member:: <${JSON.stringify(this.hash_member)}>`);
                //console.log(`this.secure_member:: <${JSON.stringify(this.secure_member)}>`);
                this.elementEntity.Init(element);
                //console.log(`this.elementEntity:: <${JSON.stringify(this.elementEntity)}>`);
                let dataExtractElement: any = this.elementEntity.Extract(
                    this.nullable,
                    this.fillable,
                    this.hash_member,
                    this.secure_member
                );
                //console.log(`dataExtractElement:: <${JSON.stringify(dataExtractElement)}>`);
                let req: string = `UPDATE ${this.table} SET ${dataExtractElement.set}${this.GetWherePart()}`;
                console.log(`req:: <${req}>`);
                await this.sQLDatabaseManipulation.Execute(req);
            } else {
                throw new Error('CSTM_0001');
            }
        } else {
            throw new Error('CSTM_0002');
        }
    }
    async UpdateAll(element?: IE): Promise<void> {
        this.GetPrefix();
        
        this.elementEntity.Init(element);
        let dataExtractElement: any = this.elementEntity.Extract(
            this.nullable,
            this.fillable,
            this.hash_member,
            this.secure_member
        );
        let req: string = `UPDATE ${this.table} SET ${dataExtractElement.set}`;
        console.log(`req:: <${req}>`);
        await this.sQLDatabaseManipulation.Execute(req);
    }
    async Delete(): Promise<void> {
        this.GetPrefix();
        
        if(
            this.GetWherePart().length > 0
        ){
            const existTest = ((await this.Exist())) ? (await this.Exist()) : false;
            if( existTest ) {
                let req: string = `DELETE FROM ${this.table}${this.GetWherePart()}`;
                console.log(`req:: <${req}>`);
                await this.sQLDatabaseManipulation.Execute(req);
            } else {
                throw new Error('CSTM_0001');
            }
        } else {
            throw new Error('CSTM_0002');
        }
    }
    async DeleteAll(): Promise<void> {
        this.GetPrefix();
        
        let req: string = `TRUNCATE TABLE ${this.table}`;
        await this.sQLDatabaseManipulation.Execute(req);
    }
    async CTRL_Create(element: any): Promise<any> {
        return await this.Create(element);
    }
    async CTRL_Update(element: any): Promise<any> {
        return await this.Update(element);
    }
    async CTRL_Delete(): Promise<any> {
        return await this.Delete();
    }
}