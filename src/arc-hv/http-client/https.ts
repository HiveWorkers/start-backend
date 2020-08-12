import * as https from 'https';
import * as path from 'path';
import { StringSup } from '../other/string';
import * as request from 'request';
import { BaseError } from '../other/error/base.error';

const stringSup = new StringSup();

export class HTTPS
{
    protected conf: HTTPConf = {
        access: 'http',
        hote: 'localhost',
        port: 3000,
        auth: {
            key: 'Fuck les bitches neger 1998@',
            username: 'USER-6nkl2rf80q',
            password: 'Physio1998@',
            priority: 5
        }
    };
    protected hostnameState: boolean = true;
    hostname: string = '{0}://{1}:{2}'.Format(
        (this.conf.access) ? this.conf.access : 'http',
        (this.conf.hote) ? this.conf.hote : 'localhost',
        (this.conf.port) ? this.conf.port : 8080
    );

    constructor() {
        this.hostname = (this.hostnameState) ? this.hostname : '';
    }

    private InitOptions(
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        url: string,
        options: HTTPOptions = {}
    ) {
        options.url = (url) ? this.GetUrl(url) : this.GetUrl(String('/'));
        options.method = (method) ? method : 'GET';
        options.json = (
            options.json == undefined ||
            options.json == null
        ) ? true : options.json;

        let optionsFinal: HTTPOptions = options;
        console.log('> optionsFinal');
        console.log(optionsFinal);
        return optionsFinal;
    }
    private GetUrl(route: string): string {
        const url = '{0}{1}'.Format(
            this.hostname,
            route
        );
        console.log(`> url:: <${url}>`);
        return url;
    }

    async Route(
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        url: string,
        options: HTTPOptions = {}
    ) {
        const optionsFinal = this.InitOptions(method, url, options);
        url = optionsFinal.url || '/';

        return new Promise(function(resolve, reject){
            request(url, optionsFinal, (err, res, body) => {
                if (err) {
                    const httpsError = new HTTPSError(err);
                    httpsError.body = body;
                    //console.log(`> HTTPSCatch::`);
                    //console.log(httpsError);
                    //console.log(`---------------------------<`);
                    return reject(httpsError);
                }
                try {
                    resolve(body);
                } catch(e) {
                    const httpsError = new HTTPSError(e);
                    reject(httpsError);
                }
            });
        });
    }

    async Get(
        url: string,
        options: HTTPOptions = {}
    ) {
        return await this.Route('GET', url, options);
    }

    async Post(
        url: string,
        options: HTTPOptions = {}
    ) {
        return await this.Route('POST', url, options);
    }

    async Put(
        url: string,
        options: HTTPOptions = {}
    ) {
        return await this.Route('PUT', url, options);
    }

    async Delete(
        url: string,
        options: HTTPOptions = {}
    ) {
        return await this.Route('DELETE', url, options);
    }

}

export class HTTPSError extends BaseError {
    body: any | undefined = undefined;

    constructor(err: any) {
        super(err);
        
        this.SetBody(err.body);
    }
    
    public init(err: any) {
        super.init(err);
        
        this.SetBody(err.body);
    }
    

    SetBody(body: any) {
        this.body = (body) ? body : undefined;
    }
}

export function HTTPSThen(data: unknown) {
    let result: any = data as any;
    return {
      type: (result.alert) ? result.alert : "success",
      value: (result.value) ? result.value : result
    };
}
export function HTTPSCatch(err: any) {
    console.log(`> HTTPSCatch::`);
    const error = new BaseError(err);
    console.log(error);
    console.log(`---------------------------<`);
    throw err;
}

export interface HTTPOptions {
    url?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    headers?: any;
    json?: boolean;
    qs?: any;
    form?: any;
    auth?: any;
}
export interface HTTPConf {
    access?: 'http' | 'https';
    hote?: string | 'localhost';
    port?: number;
    auth: {
        key: string;
        username: string;
        password: string;
        priority: number;
    }
};