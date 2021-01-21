import * as express from 'express';
import {OutgoingHttpHeaders} from 'http';
import logger from '@exmpl/utils/logger'

export const writeJsonResponse = (
  res: express.Response, code: any, payload: any,
  headers?: OutgoingHttpHeaders | undefined ): void => {
    logger.debug(`utils::express.ts::writeJsonResponse()`);
    const data = typeof payload === 'object' 
    ? JSON.stringify(payload, null, 2) 
    : payload;
    res.writeHead(code, {...headers, 'Content-Type': 'application/json'});
    res.end(data); 
}