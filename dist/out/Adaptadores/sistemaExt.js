"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = __importDefault(require("net"));
const inversify_1 = require("inversify");
const config_1 = __importDefault(require("../../config"));
class NetPromise {
    constructor() {
        this.client = new net_1.default.Socket();
        const host = config_1.default.HOST_EXT;
        const port = config_1.default.PORT_EXT;
        this.client.on('close', () => {
            //console.log('net Connection closed');
        });
        this.client.on('error', (err) => {
            console.error('Connection error:', err);
        });
        this.client.connect(port, host, () => {
            try {
                //console.log(`Connect net ${host}:${port}`);
            }
            catch (error) {
                console.log('Error client.connect', error.message);
                this.client = null;
            }
        });
    }
    send(cmd, datos = {}) {
        return new Promise(resolve => {
            let buffer = '';
            this.client.write(JSON.stringify(datos));
            this.client.on('data', (data) => {
                buffer += data.toString();
                try {
                    const datos = JSON.parse(buffer);
                    this.client.destroy();
                    resolve(datos);
                }
                catch (_a) { }
            });
        });
    }
}
let SistemaExt = class SistemaExt {
    consultaTerminal(datos) {
        return new NetPromise().send(datos.Comando, datos);
    }
};
SistemaExt = __decorate([
    (0, inversify_1.injectable)()
], SistemaExt);
exports.default = SistemaExt;
