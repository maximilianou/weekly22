"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const userSchema = new mongoose_1.Schema({
    password: { type: String, required: true },
    email: { type: String, required: true, trim: true,
        validate: [validator_1.default.isEmail, 'do not match email regex'] },
    name: { type: String, required: true },
    created: { type: Date, default: Date.now },
}, { strict: true }).index({ email: 1 }, { unique: true,
    collation: { locale: 'en_US', strength: 1 }, sparse: true });
userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcrypt_1.default.genSalt(10, (err, salt) => {
            if (err)
                return next(err);
            bcrypt_1.default.hash(this.password, salt, (err, hash) => {
                if (err)
                    return next(err);
                this.password = hash;
                next();
            });
        });
    }
    else {
        next();
    }
});
userSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.created = ret.created.getTime();
        delete ret.__v;
        delete ret._id;
        delete ret.password;
    }
});
userSchema.methods.comparePassword = function (candidatePassword) {
    const { password } = this;
    return new Promise(function (resolve, reject) {
        bcrypt_1.default.compare(candidatePassword, password, function (err, isMatch) {
            if (err)
                return reject(err);
            return resolve(isMatch);
        });
    });
};
exports.User = mongoose_1.model('User', userSchema);
exports.default = exports.User;
