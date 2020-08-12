import { IRequest, IResponse } from "../../../arc-hv/core/other/custom.express";
import { CustomError } from "../../../arc-hv/other/error/custom.error";

export const Guard = (req: IRequest, res: IResponse) => {
    const body = req.body;
    const query = req.query;
    const params = req.params;

    console.log(`body:: ${JSON.stringify(body)}`);
    console.log(`query:: ${JSON.stringify(query)}`);
    console.log(`params:: ${JSON.stringify(params)}`);

    req.guard = {
      user : params.user,
      mdp: params.mdp
    };
    console.log(`GUARD:: `);
    console.log(req.guard);

    if(
      req.guard &&
      req.guard.user &&
      req.guard.user == "bilong" &&
      req.guard.mdp &&
      req.guard.mdp == "Physio1998@"
    ) {
      console.log(`Vous avez l'accès à l'application`);
    } else {
      throw new CustomError({code: "AUTH_no_authorization"});
    }
};