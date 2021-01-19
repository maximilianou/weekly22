"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = __importDefault(require("faker"));
const user_1 = __importDefault(require("@exmpl/api/models/user"));
const db_1 = __importDefault(require("@exmpl/utils/db"));
beforeAll(async () => {
    await db_1.default.open();
});
afterAll(async () => {
    await db_1.default.close();
});
describe('save', () => {
    it('should create user', async () => {
        const email = faker_1.default.internet.email();
        const password = faker_1.default.internet.password();
        const name = faker_1.default.name.firstName();
        const before = Date.now();
        const user = new user_1.default({
            email: email, password: password, name: name
        });
        await user.save();
        const after = Date.now();
        const fetched = await user_1.default.findById(user._id);
        expect(fetched).not.toBeNull();
        expect(fetched.email).toBe(email);
        expect(fetched.name).toBe(name);
        expect(fetched.password).not.toBe(password);
        expect(before).toBeLessThanOrEqual(fetched.created.getTime());
    });
    it('should update user', async () => {
        const name1 = faker_1.default.name.firstName();
        const user = new user_1.default({
            email: faker_1.default.internet.email(),
            password: faker_1.default.internet.password(),
            name: name1,
        });
        const dbUser1 = await user.save();
        const name2 = faker_1.default.name.firstName();
        dbUser1.name = name2;
        const dbUser2 = await dbUser1.save();
        expect(dbUser2.name).toEqual(name2);
    });
    it('should not save user with invalid mail', async () => {
        const user1 = new user_1.default({
            name: faker_1.default.name.findName(),
            email: 'e@e',
            password: faker_1.default.internet.password(),
        });
        return expect(user1.save()).rejects.toThrowError(/email/);
    });
    it('should not save user without an email', async () => {
        const user = new user_1.default({
            password: faker_1.default.internet.password(),
            name: faker_1.default.name.firstName(),
        });
        return expect(user.save()).rejects.toThrowError(/email/);
    });
    it('should not save without a password', async () => {
        const user2 = new user_1.default({
            email: faker_1.default.internet.email(),
            name: faker_1.default.name.firstName,
        });
        return expect(user2.save()).rejects.toThrowError(/password/);
    });
    it('should not save user without a name', async () => {
        const user1 = new user_1.default({
            email: faker_1.default.internet.email(),
            password: faker_1.default.internet.password(),
        });
        return expect(user1.save()).rejects.toThrowError(/name/);
    });
    it('should not save users with the same email', async () => {
        const email = faker_1.default.internet.email();
        const password = faker_1.default.internet.password();
        const name = faker_1.default.name.firstName();
        const userData = { email: email, password: password, name: name };
        const user1 = new user_1.default(userData);
        await user1.save();
        const user2 = new user_1.default(userData);
        return expect(user2.save()).rejects.toThrowError(/E11000/);
    });
    it('should not save password in a readable form', async () => {
        const password = faker_1.default.internet.password();
        const user1 = new user_1.default({
            email: faker_1.default.internet.email(),
            password: password,
            name: faker_1.default.name.firstName(),
        });
        await user1.save();
        expect(user1.password).not.toBe(password);
        const user2 = new user_1.default({
            email: faker_1.default.internet.email(),
            password: password,
            name: faker_1.default.name.firstName(),
        });
        await user2.save();
        expect(user2.password).not.toBe(password);
        expect(user1.password).not.toBe(user2.password);
    });
});
describe('comparePassword', () => {
    it('should return true for valid password', async () => {
        const password = faker_1.default.internet.password();
        const user = new user_1.default({
            email: faker_1.default.internet.email(),
            password: password,
            name: faker_1.default.name.firstName(),
        });
        await user.save();
        expect(await user.comparePassword(password)).toBe(true);
    });
    it('should return false for invalid password', async () => {
        const user = new user_1.default({
            email: faker_1.default.internet.email(),
            password: faker_1.default.internet.password,
            name: faker_1.default.name.firstName(),
        });
        await user.save();
        expect(await user.comparePassword(faker_1.default.internet.password())).toBe(false);
    });
    it('should update password hash if password is updated', async () => {
        const password1 = faker_1.default.internet.password();
        const user = new user_1.default({
            email: faker_1.default.internet.email(),
            password: password1,
            name: faker_1.default.name.findName(),
        });
        const dbUser1 = await user.save();
        expect(await dbUser1.comparePassword(password1)).toBe(true);
        const password2 = faker_1.default.internet.password();
        dbUser1.password = password2;
        const dbUser2 = await dbUser1.save();
        expect(await dbUser2.comparePassword(password2)).toBe(true);
        expect(await dbUser2.comparePassword(password1)).toBe(false);
    });
});
describe('toJSON', () => {
    it('should return valid JSON', async () => {
        const email = faker_1.default.internet.email();
        const password = faker_1.default.internet.password();
        const name = faker_1.default.name.findName();
        const user = new user_1.default({ email: email, password: password, name: name });
        await user.save();
        expect(user.toJSON()).toEqual({ email: email, name: name, created: expect.any(Number) });
    });
});
