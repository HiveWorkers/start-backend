import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as methodOverride from 'method-override';
import * as logger from 'morgan';
import * as cors from 'cors';
const flash = require('express-flash');
import * as session from 'express-session';
import * as AppConfig from '../../../AppConfig.json';
import { CModule } from './module';
import { IRequest, IResponse } from './other/custom.express';
import { BaseError } from '../other/error/base.error';

const sessionStore = new session.MemoryStore;
        
const app = express();

export default class Server{
    private dirname: string;
    private AppModule: typeof CModule;
    private appModule: CModule;
    constructor(dirname: string, AppModule: typeof CModule){
        this.dirname = dirname;
        this.AppModule = AppModule;
        this.appModule = new this.AppModule();
        this.appModule.SetApp(app);
        this.appModule.SetRepPrinc(this.dirname);
    }

    Init(middlewareForServer: boolean = true): void {
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        app.use(methodOverride());
        app.use(cors());
        //app.use(logErrors);
        //app.use(clientErrorHandler);
        //app.use(errorHandlerForServer);
        /*app.use((req: express.Request, res: express.Response) => {
            res.setHeader('Content-Type', 'text/plain')
            res.write('you posted:\n')
            //res.end(JSON.stringify(req.body, null, 2))
        });*/
        app.use(logger(AppConfig.mode.env));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cookieParser());
        app.use(session({
            secret: 'secret',
            cookie: { maxAge: 60000 },
            store: sessionStore,
            saveUninitialized: true,
            resave: true
        }));
        app.use(flash());
        
        this.appModule.Init();

        function logErrors(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            console.error(err.stack);
            next(err);
        }
        function clientErrorHandler(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            if (req.xhr) {
              res.status(500).send({ error: 'Something failed!' });
            } else {
              next(err);
            }
        }
        function errorHandler(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            const baseError = new BaseError(err);
            res.status(baseError.status || 500);
            res.send({
                alert: baseError.alert,
                message: baseError.value
            });
        }

        app.use(logErrors);
        app.use(clientErrorHandler);
        app.use(errorHandler);
        
        app.listen(AppConfig.port, err =>
        {
            if(err)
            {
                return console.error(err);
            }
            return console.log(`Le server a bien demarré. Ouvrez le navigateur est tapez comme url <http://localhost:${AppConfig.port}/>`);
        })
    }
}