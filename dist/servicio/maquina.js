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
//import validar from './validaciones/producto'
const container_types_1 = __importDefault(require("../container.types"));
let ServicioMaq = class ServicioMaq {
    constructor(sistemaExt) {
        this.sistemaExt = sistemaExt;
        this.enviarCodigoMaquina = (datosEntrada) => __awaiter(this, void 0, void 0, function* () {
            const datosMaquina = yield new Promise(resolve => {
                this.sistemaExt.send(datosEntrada, (datosMaquina) => {
                    resolve(datosMaquina);
                });
            });
            return datosMaquina;
        });
        this.getListadoMaquinas = () => __awaiter(this, void 0, void 0, function* () {
            const listado = yield new Promise(resolve => {
                this.sistemaExt.get((listado) => {
                    resolve(listado);
                });
            });
            return listado;
        });
        this.asociarMaquina = (datosEntrada) => __awaiter(this, void 0, void 0, function* () {
            const datosMaquina = yield new Promise(resolve => {
                this.sistemaExt.asociar(datosEntrada, (datosMaquina) => {
                    resolve(datosMaquina);
                });
            });
            return datosMaquina;
        });
        this.filtrarMaquina = (datosEntrada) => __awaiter(this, void 0, void 0, function* () {
            const datosMaquina = yield new Promise(resolve => {
                this.sistemaExt.filtrar(datosEntrada, (datosMaquina) => {
                    resolve(datosMaquina);
                });
            });
            return datosMaquina;
        });
    }
};
ServicioMaq = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(container_types_1.default.ISistemaExt)),
    __metadata("design:paramtypes", [Object])
], ServicioMaq);
exports.default = ServicioMaq;
