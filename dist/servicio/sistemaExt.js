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
const config_1 = __importDefault(require("../config"));
let SistemaExt = class SistemaExt {
    constructor() {
        try {
            const client = new net_1.default.Socket();
            const port = +config_1.default.PORT + 1;
            const host = 'localhost'; // Change to the host where the server is
            client.connect(port, host, () => {
                try {
                    console.log('Connected to the TCP server');
                    //client.write('Hello from the TCP client');
                }
                catch (error) {
                    console.log('Error client.connect', error.message);
                }
            });
            client.on('data', (data) => {
                const datos = JSON.parse(data);
                //console.log('client.on(data)', datos)
                if (typeof this.receive === 'function')
                    this.receive(datos);
            });
            client.on('close', () => {
                console.log('Connection closed');
                process.exit();
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
    send(datos, receive) {
        if (this.client) {
            //console.log(datos)
            this.client.write(JSON.stringify(datos));
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
