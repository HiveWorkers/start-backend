import {Request, Response} from 'express';

//declare namespace Express {
//    export interface Request/*<T = any>*/ {
//        guard?: {
//            user: string,
//            mdp: string | number
//        };
//        //otherDatas?: T;
//    }
//}

export interface IRequest<T = any> extends Request {
    guard?: {
        user: string,
        mdp: string | number
    };
    lang?: string;
    otherDatas?: T;
}
export interface IResponse extends Response {}