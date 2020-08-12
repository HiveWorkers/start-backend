import { IRequest, IResponse } from "./other/custom.express";

export const Controller = (prefix: string = ''): ClassDecorator => {
    return (target: any) => {
      Reflect.defineMetadata('prefix', prefix, target);
      if (! Reflect.hasMetadata('routes', target)) {
        Reflect.defineMetadata('routes', [], target);
      }
    };
};

export class CController {
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
}