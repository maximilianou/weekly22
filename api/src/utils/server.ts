import express from 'express';
import { Express } from 'express-serve-static-core'
import * as OpenApiValidator from 'express-openapi-validator';
import { connector, summarise } from 'swagger-routes-express';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';

import * as api from '@exmpl/api/controllers';

//import bodyParser from "body-parser"; // REFERENCE:: https://stackoverflow.com/questions/10005939/how-do-i-consume-the-json-post-data-in-an-express-application
import morgan from 'morgan';
import morganBody from 'morgan-body';
import {expressDevLogger} from '@exmpl/utils/express_dev_logger';

import config from '@exmpl/config';

import logger from '@exmpl/utils/logger';

export const createServer = async (): Promise<Express> => {
  logger.debug(`utils::server.ts::createServer()`);
  const yamlSpecFile = './config/openapi.yml';
  const apiDefinition = YAML.load(yamlSpecFile);
  const apiSummary = summarise(apiDefinition);

  const server = express();
  
  server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDefinition));
  
  const validatorOptions = {
    apiSpec: yamlSpecFile,
    validateRequests: true,
    validateResponses: true
  }

  //server.use(bodyParser.json()); // REFERENCE:: https://stackoverflow.com/questions/10005939/how-do-i-consume-the-json-post-data-in-an-express-application
  server.use(express.json()); // REFERENCE:: https://stackoverflow.com/questions/10005939/how-do-i-consume-the-json-post-data-in-an-express-application

  server.use(OpenApiValidator.middleware(validatorOptions));

  logger.info(apiSummary);

  server.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(err.status).json({
      error: {
        type: 'request_validation',
        message: err.message,
        errors: err.errors
      }
    });
  });
  
  /* istanbul ignore file */  
  if(config.morganLogger){
    server.use(morgan(`:method :url :status :response-time ms - :res[content-length]`));
  }
  /* istanbul ignore file */
  if(config.morganBodyLogger){
    morganBody(server);
  }
  /* istanbul ignore file */
  if(config.exmplDevLogger){
    server.use(expressDevLogger); 
  }

  const connect = connector(api, apiDefinition, {
    onCreateRoute: (method: string, descriptor: any[]) => {
      descriptor.shift();
      logger.verbose(`${method}: ${descriptor.map((d:any) => d.name).join(', ')}`);
    },
    security: {
      bearerAuth: api.auth
    }
  });
  connect(server);

  return server;
}
