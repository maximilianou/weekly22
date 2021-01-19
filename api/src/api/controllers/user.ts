import * as express from 'express';
import UserService from '@exmpl/api/services/user';
import {writeJsonResponse} from '@exmpl/utils/express';
import logger from '@exmpl/utils/logger';
export function auth(req: express.Request, res: express.Response, 
  next: express.NextFunction): void {
    logger.debug(`controller::user.ts::auth()`);
    const token = req.headers.authorization!;
    logger.debug(`controller::user.ts::auth() .. token=[${token}]`);
      UserService.auth(token)
        .then(authResponse => {
          logger.debug(`controller::user.ts::auth() .. authResponse=[${authResponse}]`);
          if(!(authResponse as any).error){
            res.locals.auth = {
              userId: (authResponse as {userId: string}).userId
            };
            next();
          }else{
            writeJsonResponse(res, 401, authResponse);
          }
        })
        .catch(err => {
          logger.error(`auth: ${err}`);
          writeJsonResponse(res, 500, {
            error: {
              type: 'internal_server_error',
              message: 'Internal Server Error'
            }});
        });

}