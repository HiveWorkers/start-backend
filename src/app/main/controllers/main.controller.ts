import {Request, Response} from 'express';
import { IRequest, IResponse } from '../../../arc-hv/core/other/custom.express';
import { Controller, CController } from '../../../arc-hv/core/controller';
import { Get } from '../../../arc-hv/core/route';

@Controller('/test')
export class MainController extends CController {

  @Get('/error')
  public error(req: IRequest, res: IResponse) {
    const state: boolean = true;
    if(state) {
      throw new Error("Custom error");
    }

    res.send("Erreur - Hello World");
  }

  @Get('/route1')
  public route1(req: IRequest, res: IResponse) {
    const body = req.body;
    const query = req.query;
    const params = req.params;
    req.guard = {
      user : "bilong",
      mdp: "Physio1998@"
    };

    console.log("Guard:: ");
    console.log(req.guard);

    res.send('route 1 - hello world');
  }

  @Get('/')
  public route2(req: Request, res: Response) {
    const body = req.body;
    const query = req.query;
    const params = req.params;

    res.send('route 2 - hello world');
  }

}