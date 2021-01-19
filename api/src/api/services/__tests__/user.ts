import faker from 'faker';
import db from '@exmpl/utils/db';
import user from '../user';

beforeAll(async () => {
  await db.open();
});
afterAll( async () => {
  await db.close();
});

describe('auth', () => {
  it('should resolve to true and valid userId for hardcoded token', async () => {
    const response = await user.auth('fakeToken');
    expect(response).toEqual({userId: 'fakeTokenId'});
  });
  it('should resolve with false for invalid token', async () => {
    const response = await user.auth('invalidToken');
    expect(response).toEqual({error: {type: 'unauthorized', message: 'Authorization Failed'}});
  });
});

describe('createUser', () => {
  it('should resolve true in valid userId', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const name = faker.name.findName();
    await expect( user.createUser(email, password, name)).resolves.toEqual({
      userId: expect.stringMatching(/^[a-f0-9]{24}$/)
    });
  });
  it('should resolves false and valid error if duplicate', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const name = faker.name.findName();
    await user.createUser(email, password, name);
    await expect(user.createUser(email, password, name)).resolves.toEqual({
      error: {
        type: 'account_already_exists',
        message: `${email} already exists`,
      }
    });

  });
});