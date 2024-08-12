"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = __importDefault(require("net"));
const inversify_1 = require("inversify");
const config_1 = __importDefault(require("../../config"));
let SistemaExt = class SistemaExt {
    constructor() {
        this.buffer = '';
        this.init();
    }
    init() {
        try {
            const client = new net_1.default.Socket();
            const host = config_1.default.HOST_EXT;
            const port = config_1.default.PORT_EXT;
            client.connect(port, host, () => {
                try {
                    console.log(`Connect to external service TCP ${host}:${port}`);
                    //client.write('Hello from the TCP client');
                }
                catch (error) {
                    console.log('Error client.connect', error.message);
                }
            });
            client.on('data', (data) => {
                this.buffer += data.toString();
                try {
                    const datos = JSON.parse(this.buffer);
                    this.buffer = '';
                    if (typeof this.receive === 'function')
                        this.receive(datos);
                }
                catch (error) {
                    //console.log('Error data SistemaExt:', error.message)//, error)
                }
            });
            client.on('close', () => {
                console.log('Connection closed');
                this.reconectar();
                //process.exit()
            });
            client.on('error', (err) => {
                console.error('Connection error:', err);
            });
            this.client = client;
        }
        catch (error) {
            console.log('Error conexión TCP:', error.message);
        }
    }
    reconectar() {
        console.log('!!! Reconectando a sistema Externo... ', new Date().toLocaleString());
        setTimeout(() => this.init(), 5000);
    }
    send(datos, receive) {
        if (this.client) {
            this.buffer = '';
            this.client.write(JSON.stringify({ cmd: 'send', datos }));
            if (typeof receive === 'function')
                this.receive = receive;
        }
    }
    get(receive) {
        if (this.client) {
            this.buffer = '';
            //console.log(datos)
            this.client.write(JSON.stringify({ cmd: 'get' }));
            if (typeof receive === 'function')
                this.receive = receive;
            //console.log(this.receive)
        }
    }
    asociar(datos, receive) {
        if (this.client) {
            this.buffer = '';
            //console.log(datos)
            this.client.write(JSON.stringify({ cmd: 'asociar', datos }));
            if (typeof receive === 'function')
                this.receive = receive;
            //console.log(this.receive)
        }
    }
};
SistemaExt = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], SistemaExt);
exports.default = SistemaExt;
