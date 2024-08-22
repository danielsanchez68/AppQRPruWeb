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
exports.ControladorMov = exports.ControladorMaq = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const config_1 = __importDefault(require("../../config"));
const cors_1 = __importDefault(require("cors"));
const inversify_1 = require("inversify");
const container_types_1 = __importDefault(require("../../container.types"));
let ControladorMaq = class ControladorMaq {
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
        this.filtrarMaquina = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const datosEntrada = req.body;
                if (!Object.keys(datosEntrada).length)
                    throw new Error('ERROR: datosEntrada vacío');
                const datosMaquina = yield this.servicio.filtrarMaquina(datosEntrada);
                //console.log(datosMaquina)
                res.json(datosMaquina);
            }
            catch (error) {
                res.status(500).json({ errMsg: error.message });
            }
        });
    }
};
exports.ControladorMaq = ControladorMaq;
exports.ControladorMaq = ControladorMaq = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(container_types_1.default.IServicioMaquina)),
    __metadata("design:paramtypes", [Object])
], ControladorMaq);
let ControladorMov = class ControladorMov {
    constructor(servicio) {
        this.servicio = servicio;
        this.obtenerMovimientos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const movimientos = yield this.servicio.obtenerMovimientos();
                res.json(movimientos);
            }
            catch (error) {
                res.status(500).json({ errMsg: error.message });
            }
        });
        this.obtenerMovimientoPorUuid = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const uuid = req.body;
                if (!Object.keys(uuid).length)
                    throw new Error('ERROR: uuid vacío');
                const movimiento = yield this.servicio.obtenerMovimientoPorUuid(uuid);
                res.json(movimiento);
            }
            catch (error) {
                res.status(500).json({ errMsg: error.message });
            }
        });
        this.agregarMovimiento = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const movimiento = req.body;
                if (!Object.keys(movimiento).length)
                    throw new Error('ERROR: movimiento vacío');
                const movimientos = yield this.servicio.agregarMovimiento(movimiento);
                res.json(movimientos);
            }
            catch (error) {
                res.status(500).json({ errMsg: error.message });
            }
        });
    }
};
exports.ControladorMov = ControladorMov;
exports.ControladorMov = ControladorMov = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(container_types_1.default.IServicioMovimientos)),
    __metadata("design:paramtypes", [Object])
], ControladorMov);
let UI_HTTP = class UI_HTTP {
    constructor(controladorMaq, controladorMov) {
        this.controladorMaq = controladorMaq;
        this.controladorMov = controladorMov;
    }
    configRouterMaq() {
        const router = express_1.default.Router();
        router.post('/codigo', this.controladorMaq.enviarCodigoMaquina);
        router.get('/listado', this.controladorMaq.getListadoMaquinas);
        router.post('/asociar', this.controladorMaq.asociarMaquina);
        router.post('/filtrar', this.controladorMaq.filtrarMaquina);
        return router;
    }
    configRouterMov() {
        const router = express_1.default.Router();
        router.get('/listado', this.controladorMov.obtenerMovimientos);
        router.post('/uuid', this.controladorMov.obtenerMovimientoPorUuid);
        router.post('/agregar', this.controladorMov.agregarMovimiento);
        return router;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const app = (0, express_1.default)();
            app.use((0, cors_1.default)());
            app.use(express_1.default.static('public'));
            app.use(express_1.default.json());
            // --------- Configuración de Rutas / endpoints ---------
            app.use('/api/maquina', this.configRouterMaq());
            app.use('/api/movimientos', this.configRouterMov());
            // --------------- Listen del Servidor ------------------
            const PORT = config_1.default.PORT;
            const server = http_1.default.createServer(app).listen(PORT, () => console.log(`Server AppQR listen in http://localhost:${PORT}`));
            server.on('error', error => console.log(`Error en servidor: ${error.message}`));
        });
    }
};
UI_HTTP = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(container_types_1.default.IControladorMaq)),
    __param(1, (0, inversify_1.inject)(container_types_1.default.IControladorMov)),
    __metadata("design:paramtypes", [Object, Object])
], UI_HTTP);
exports.default = UI_HTTP;
