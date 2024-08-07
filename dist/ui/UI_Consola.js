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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const container_types_1 = __importDefault(require("../container.types"));
let UI_Consola = class UI_Consola {
    constructor(servicio) {
        this.servicio = servicio;
    }
    start() {
        console.log('--- Ingrese un comando ---');
        process.stdin.on('data', (data) => __awaiter(this, void 0, void 0, function* () {
            const cmdStr = data.toString().replace('\n', '').replace('\r', '');
            const [method, url, param1, param2] = cmdStr.split(' ');
            console.log(`Entrada: method[${method}] - url[${url}] - param1[${param1}] - param2[${param2}]`);
            if (method == 'post' && url == '/api/maquina') {
                const codigo = param1;
                const cod = yield this.servicio.enviarCodigoMaquina(codigo);
                console.log(cod);
            }
            else {
                console.log('***** COMANDO DESCONOCIDO *****');
            }
            console.log('\n--- Ingrese un comando ---');
        }));
    }
};
UI_Consola = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(container_types_1.default.IServicioMaquina)),
    __metadata("design:paramtypes", [Object])
], UI_Consola);
exports.default = UI_Consola;
