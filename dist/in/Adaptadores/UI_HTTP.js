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
exports.Controlador = void 0;
const express_1 = __importDefault(require("express"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const config_1 = __importDefault(require("../../config"));
const cors_1 = __importDefault(require("cors"));
const inversify_1 = require("inversify");
const container_types_1 = __importDefault(require("../../container.types"));
let Controlador = class Controlador {
    constructor(servicio) {
        this.servicio = servicio;
        this.enviarCodigoMaquina = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const datosEntrada = req.body;
                //console.log(datosEntrada)
                if (!Object.keys(datosEntrada).length)
                    throw new Error('ERROR: datosEntrada vacío');
                const datosMaquina = yield this.servicio.enviarCodigoMaquina(datosEntrada);
                res.json(datosMaquina);
            }
            catch (error) {
                res.status(500).json({ errMsg: error.message });
            }
        });
        this.getListadoMaquinas = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const listado = yield this.servicio.getListadoMaquinas();
                res.json(listado);
            }
            catch (error) {
                res.status(500).json({ errMsg: error.message });
            }
        });
        this.asociarMaquina = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const datosEntrada = req.body;
                if (!Object.keys(datosEntrada).length)
                    throw new Error('ERROR: datosEntrada vacío');
                const datosMaquina = yield this.servicio.asociarMaquina(datosEntrada);
                res.json(datosMaquina);
            }
            catch (error) {
                res.status(500).json({ errMsg: error.message });
            }
        });
    }
};
exports.Controlador = Controlador;
exports.Controlador = Controlador = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(container_types_1.default.IServicioMaquina)),
    __metadata("design:paramtypes", [Object])
], Controlador);
let UI_HTTP = class UI_HTTP {
    constructor(controlador) {
        this.controlador = controlador;
    }
    config() {
        const router = express_1.default.Router();
        router.post('/codigo', this.controlador.enviarCodigoMaquina);
        router.get('/listado', this.controlador.getListadoMaquinas);
        router.post('/asociar', this.controlador.asociarMaquina);
        return router;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const app = (0, express_1.default)();
            app.use((0, cors_1.default)());
            app.use(express_1.default.static('public'));
            app.use(express_1.default.json());
            // --------- Configuración de Rutas / endpoints ---------
            app.use('/api/maquina', this.config());
            // --------------- Listen del Servidor ------------------
            const PORT = config_1.default.PORT;
            const sslKey = 'ssl/localhost.key';
            const sslCrt = 'ssl/localhost.crt';
            var options = {
                key: fs_1.default.readFileSync(sslKey),
                cert: fs_1.default.readFileSync(sslCrt)
            };
            const ip = sslCrt.replace('.', '/').split('/')[1] || '127.0.0.1';
            const server = https_1.default.createServer(options, app).listen(PORT, () => console.log(`Server AppQR listen in https://${ip}:${PORT} - cert[${sslCrt} - ${sslKey}]`));
            server.on('error', error => console.log(`Error en servidor: ${error.message}`));
        });
    }
};
UI_HTTP = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(container_types_1.default.IControlador)),
    __metadata("design:paramtypes", [Object])
], UI_HTTP);
exports.default = UI_HTTP;
