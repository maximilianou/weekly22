export type ErrorResponse = { error: {type: string, message: string}};
export type AuthResponse = ErrorResponse | {userId: string};
export type CreateUserResponse = ErrorResponse | {userId: string};
import logger from '@exmpl/utils/logger';
import User from '@exmpl/api/models/user';


function auth(bearerToken: string): Promise<AuthResponse>{
  logger.debug(`services::user.ts::auth()`);
    return new Promise(function(resolve, reject){      
      const token = bearerToken.replace('Bearer ','');
      logger.debug(`services::user.ts::auth() .. token::[${token}]`);
      if(token === 'fakeToken'){
        return resolve({userId: 'fakeTokenId'});
      }
      return resolve({error: {type: 'unauthorized', message: 'Authorization Failed'}});
    });
};

function createUser(email: string, password: string, name: string): Promise<CreateUserResponse> {
  return new Promise( (resolve, reject) => {
    const user = new User({email: email, password:password, name:name});
    user.save()
      .then( u => {
        resolve({ userId: u._id.toString() });
      })
      .catch( err => {
        if( err.code === 11000 ){
          resolve( {error: { type: 'account_already_exists', message: `${email} already exists`}} );
        }else{
          logger.error(`createUser: ${err}`);
          reject(err);
        }
      });
  });
};

export default { auth: auth, createUser: createUser };
