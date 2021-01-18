import logger from '@exmpl/utils/logger';
import {createServer} from '@exmpl/utils/server';
import db from '@exmpl/utils/db';

db.open()
  .then( () =>  
    createServer() )
  .then( (server: { listen: (arg0: number, arg1: () => void) => void; }) => {
      server.listen( 3021, () => {
          logger.info(`Listening on port: ${3021}`);
      })
  })
  .catch( (err: any) => {
      logger.error(`Error:: ${err}`);
  });
