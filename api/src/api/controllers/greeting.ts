import * as express from 'express';
//import { writeJsonResponse } from '../../utils/express';
import { writeJsonResponse } from '@exmpl/utils/express';
import logger from '@exmpl/utils/logger';
export const hello = (req: express.Request, res: express.Response): void => {
  logger.debug(`controller::greeting.ts::hello()`);
  const name = req.query.name || 'stranger';
  writeJsonResponse(res, 200, {"message": `Hello, ${name}!`});
}

export const goodbye = (req: express.Request, res: express.Response): void => {
  logger.debug(`controller::greeting.ts::goodbye()`);
  logger.debug(`controller::greeting.ts::goodbye() .. res.locals=[${JSON.stringify(res.locals)}]`);
  logger.debug(`controller::greeting.ts::goodbye() .. res.locals.auth=[${res.locals.auth}]`);
  const userId = res.locals.auth.userId;
  writeJsonResponse(res, 200, {"message": `Goodbye, ${userId}!`});
}
