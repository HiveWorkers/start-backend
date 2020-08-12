import * as path from 'path';
import * as express from 'express';
import * as AppConfigJson from '../../../../AppConfig.json';
import { IRequest, IResponse } from './custom.express';
import { CustomError } from '../../other/error/custom.error';
import { BaseError } from '../../other/error/base.error';

export function logErrors (
    err: any,
    req: any,
    res: any,
    next: any
) {
    console.error(err.stack)
    next(err)
}

export function clientErrorHandler (
    err: any,
    req: any,
    res: any,
    next: any
) {
    if (req.xhr) {
      res.status(500).send({ error: err })
    } else {
      next(err)
    }
}

export async function errorHandlerForServer(
    req: IRequest,
    res: IResponse,
    instance: any,
    methodName: string,
    before: (
        (
            req: IRequest,
            res: IResponse
        ) => Promise<void> | void
    )[] = [],
    after: (
        (
            req: IRequest,
            res: IResponse
        ) => Promise<void> | void
    )[] = []
) {
    const TreatError = (err: any) => {
        //logManipulation_backend.Add({
        //    end: "error",
        //    title: `erreur`,
        //    result: err
        //});
        const baseError = new BaseError(err);
        console.log(baseError);
        res.setHeader("Err", "Erreur");
        res.status(baseError.status || 500);
        res.send({
            alert: baseError.alert,
            message: baseError.value
        });
    };

    try {
        //console.log(`errorHandlerForServer > guard:: `);
        for (const key in before) {
            try {
                await before[key](req, res);
            } catch (err) {
                throw err;
            }
        }

        const funct1 = await instance[methodName](req, res);
        await funct1;

        for (const key in after) {
            try {
                await after[key](req, res);
            } catch (err) {
                throw err;
            }
        }
    } catch(err) {
        TreatError(err);
    }
}

export async function errorHandlerForClient(
    req: express.Request,
    res: express.Response,
    instance: any,
    methodName: string
) {
    try {
        if(!AppConfigJson.maintenance) {
            const funct1 = await instance[methodName](req, res);
            await funct1;
        } else {
            //logManipulation_backoffice.Add({
            //    end: "maintenance",
            //    title: `maintenance`
            //});
            res.render('error', {
                favicon: '/medias/system/anding-joyce.logo.svg',
                name: 'Anding Joyce',
                title: 'Maintenance',
                error: {
                    icon: {
                        value: 'fa-tools',
                        color: 'blue'
                    },
                    title: 'Maintenance',
                    content: 'Le site est actuellement inaccessible et sera opérationnel dans les meilleurs délais.'
                }
            });
        }
    } catch(err) {
        //logManipulation_backoffice.Add({
        //    end: "error",
        //    title: `erreur`,
        //    result: err
        //});
        res.render('error', {
            favicon: '/medias/system/anding-joyce.logo.svg',
            name: 'Anding-Joyce',
            title: 'error',
            error: {
                icon: {
                    value: 'fa-exclamation-triangle',
                    color: 'warning'
                },
                title: 'Erreur Fatal',
                content: 'Nous avons rencontré un problème interne, nos experts ont déjà été informés pour le résoudre.'
            }
        });
    }
}