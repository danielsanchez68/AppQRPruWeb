"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUuid = void 0;
const faker_1 = require("@faker-js/faker");
const getUuid = () => {
    let uuid = faker_1.fakerES.string.uuid();
    return uuid;
};
exports.getUuid = getUuid;
//console.log(getUuid())
