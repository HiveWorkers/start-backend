import { CController, Controller } from "../../../arc-hv/core/controller";
import { Get } from "../../../arc-hv/core/route";
import { IRequest, IResponse } from "../../../arc-hv/core/other/custom.express";
import { Guard } from "../middleware/auth1.guard";

@Controller("/:user/:mdp/guard")
export class GuardController extends CController {
    constructor() {
        super();

        this.before = [
            Guard
        ];
    }

    @Get('/')
    public guard(req: IRequest, res: IResponse) {
  
      res.send("Guard - Hello World");
    }
}