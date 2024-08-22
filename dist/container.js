"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const inversify_1 = require("inversify");
const container_types_1 = __importDefault(require("./container.types"));
const server_1 = __importDefault(require("./server"));
const UI_HTTP_1 = __importStar(require("./in/Adaptadores/UI_HTTP"));
const maquina_1 = __importDefault(require("./servicio/maquina"));
const movimientos_1 = __importDefault(require("./servicio/movimientos"));
const sistemaExt_1 = __importDefault(require("./out/Adaptadores/sistemaExt"));
exports.container = new inversify_1.Container();
exports.container.bind(container_types_1.default.IUI).to(UI_HTTP_1.default);
exports.container.bind(container_types_1.default.IControladorMaq).to(UI_HTTP_1.ControladorMaq);
exports.container.bind(container_types_1.default.IControladorMov).to(UI_HTTP_1.ControladorMov);
exports.container.bind(container_types_1.default.IServicioMaquina).to(maquina_1.default);
exports.container.bind(container_types_1.default.IServicioMovimientos).to(movimientos_1.default);
exports.container.bind(container_types_1.default.ISistemaExt).to(sistemaExt_1.default).inSingletonScope();
exports.container.bind(container_types_1.default.IServer).to(server_1.default);
