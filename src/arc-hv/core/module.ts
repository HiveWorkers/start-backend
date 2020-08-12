import * as express from 'express';
import * as path from 'path';
import { IRequest, IResponse } from './other/custom.express';
import { errorHandlerForServer } from './other/middleware';
import { RouteDefinition } from './route';

let sassMiddleware = require('node-sass-middleware');

export interface IModule {
  modules?: (typeof CModule)[];
  controllers?: Array<any>;
  view?: string;
  assets?: Array< {src: string, dest: string} >;
}

export interface IViewEJS {
    engine: any
    rep: string
    layout: string
    partial: string
}

export interface IAsset {
    src: string,
    dest: string
}

export function Module(prefix: IModule = {}) {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
          prefix = prefix;
        }
    }
}

export class CModule
{
    private prefix: IModule = {};
    private app: any;
    private repPrinc: string = '';
    private modules: Array<any> = [];
    private controllers: Array<any> = [];
    private view: string = '/';
    private assets: Array< IAsset > = [];
    private config: IModule = {
        assets: [],
        view: '',
        controllers: [],
        modules: []
    };
    
    before: (
        (
            req: IRequest,
            res: IResponse
        ) => Promise<void> | void
    )[] = [];
    after: (
        (
            req: IRequest,
            res: IResponse
        ) => Promise<void> | void
    )[] = [];

    constructor()
    {
    }

    private GetPrefix() {
        this.modules = this.prefix.modules || [];
        this.controllers = this.prefix.controllers || [];
        this.view = this.prefix.view || '';
        this.modules = this.prefix.modules || [];
        this.assets = this.prefix.assets || [];

        //console.log('> DATAS MODULES');
        //const datasModule = this['prefix'];
        //console.log(datasModule);
    }
    
    SetApp(app: any) {
        this.app = app;
    }
    SetRepPrinc(repPrinc: any) {
        this.repPrinc = repPrinc;
    }
    
    public Init(): void
    {

        this.config = this.GetConfig();
        console.log('> config');
        console.log(this.config);

        this.InitAssets();
        this.InitControllers();
        this.InitView();
    }
    public GetConfig(): IModule
    {
        this.GetPrefix();

        this.modules.map((data)=>
        {
            return new data(this.app, this.repPrinc);
        }).forEach(mdle =>
        {
            let config = mdle['GetConfig']();
            //console.log(config);
            this.modules = this.modules.concat(config['modules'] || []);
            this.controllers = this.controllers.concat(config['controllers'] || []);

            this.view = this.view.concat(config.view || []);
            this.assets = this.assets.concat(config['assets'] || []);
        });

        let config = {
            modules: this.modules,
            controllers: this.controllers,
            view: this.view,
            assets: this.assets
        };
        return <IModule>config;
    }
    private InitView(): void
    {
        const view = this.config.view || '';
        const viewDest: string = path.join(this.repPrinc, view);
        
        console.log('> views');
        console.log(this.config.view);
        console.log(`view:: ${viewDest}`);
        //console.log(`engine:: ${view.engine}`);

        this.app.set('views', viewDest);
        this.app.set('view engine', 'ejs');
        this.app.engine('ejs', require('ejs-mate'));
    }
    private InitAssets(): void
    {
        const assets = this.config.assets || [];
        //console.log('> assets');
        //console.log(this.config.assets);

        assets.forEach(asset => {
            const src: string = path.join(this.repPrinc, asset.src);
            const dest: string = asset.dest;
            this.app.use(sassMiddleware({
              src: this.repPrinc,
              dest: dest,
              indentedSyntax: true, // true = .sass and false = .scss
              sourceMap: true
            }));
            this.app.use(dest, express.static(src));
        });
    }
    private InitControllers(): void
    {
        const controllers = this.config.controllers || [];
        //console.log('> controllers');
        //console.log(this.config.controllers);

        controllers.forEach(controller => {
            const instance = new controller();
            const prefix = Reflect.getMetadata('prefix', controller);
            const routes: Array<RouteDefinition> = Reflect.getMetadata('routes', controller);

            

            routes.forEach(route => {
                //console.log(`methodName:: <${JSON.stringify(methodName)}>`);
                //console.log(this.app);
                //console.log(`>> prefix:: ${prefix}`);
                //console.log(`>> route.path:: ${route.path}`);
                //console.log(`>> route.requestMethod:: ${route.requestMethod}`);
                this.app[route.requestMethod](prefix + route.path, route.data, async (req: any, res: any) => {
                    let methodName: string = route.methodName;
                    //instance[methodName](req, res);
                    //console.log(`methodName:: <${JSON.stringify(methodName)}>`);
                    //errorHandlerForServer(req, res, instance[methodName](req, res));

                    if(instance.before && this.before.length > 0) {
                        instance.before = instance.before.concat(this.before) || [];
                    }
                    if(instance.after && this.after.length > 0) {
                        instance.after = instance.after.concat(this.after) || [];
                    }

                    await errorHandlerForServer(
                        req, res,
                        instance,
                        methodName,
                        instance.before,
                        instance.after
                    );
                });
            });

        });
    }
}