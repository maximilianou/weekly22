import express from 'express';
import { Express } from 'express-serve-static-core'
import * as OpenApiValidator from 'express-openapi-validator';
import { connector, summarise} from 'swagger-routes-express';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';

import * as api from '@exmpl/api/controllers';

import bodyParser from "body-parser";
import morgan from 'morgan';
import morganBody from 'morgan-body';
import {expressDevLogger} from '@exmpl/utils/express_dev_logger';

import config from '@exmpl/config';

import logger from '@exmpl/utils/logger';

export async function createServer(): Promise<Express> {
  logger.debug(`utils::server.ts::createServer()`);
  const yamlSpecFile = './config/openapi.yml';
  const apiDefinition = YAML.load(yamlSpecFile);
  const apiSummary = summarise(apiDefinition);

  const server = express();
  
  server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDefinition));
  
  const validatorOptions = {
    coerceType: true,
    apiSpec: yamlSpecFile,
    validateRequests: true,
    validateResponses: true
  }

  server.use(OpenApiValidator.middleware(validatorOptions));
//  await new OpenApiValidator(validatorOptions).install(server);

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
  
  server.use(bodyParser.json());
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
