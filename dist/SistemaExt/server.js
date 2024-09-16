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
const net_1 = __importDefault(require("net"));
const fs_1 = __importDefault(require("fs"));
const config_1 = __importDefault(require("./config"));
const inversify_1 = require("inversify");
const container_types_1 = __importDefault(require("./container.types"));
const coloring_1 = __importDefault(require("./util/coloring"));
const timeout_1 = __importDefault(require("./timeout"));
const nombres_1 = require("./util/nombres");
const uuid_1 = require("./util/uuid");
const timeOut = new timeout_1.default();
let Server = class Server {
    constructor(maquinas, ultimosMovimientos) {
        this.maquinas = maquinas;
        this.ultimosMovimientos = ultimosMovimientos;
    }
    start() {
        const options = {
            keepAlive: true
        };
        // Crear el servidor TCP
        const server = net_1.default.createServer(options, socket => {
            let buffer = '';
            //https://nodejs.org/docs/latest-v8.x/api/net.html#net_class_net_socket
            //console.log(`\n[${Date.now()} ${new Date().toLocaleString()}] Client connected: ip[${socket.remoteAddress}] port[${socket.remotePort}]`)
            // Evento para manejar datos recibidos del cliente
            socket.on('data', (data) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e;
                buffer += data;
                let imeiRx = '';
                let idSesionRx = '';
                let imeiExistente = '';
                try {
                    const datosRecibidos = JSON.parse(buffer);
                    buffer = '';
                    let datosEnviados = {};
                    const cmd = JSON.parse(yield fs_1.default.promises.readFile('./Comandos/listado.json', 'utf-8'));
                    const comando = datosRecibidos === null || datosRecibidos === void 0 ? void 0 : datosRecibidos.Comando;
                    // para pruebas
                    //console.log(timeOut.getLives())
                    //JSON.parse('Holas')
                    imeiRx = datosRecibidos === null || datosRecibidos === void 0 ? void 0 : datosRecibidos.imei;
                    idSesionRx = datosRecibidos === null || datosRecibidos === void 0 ? void 0 : datosRecibidos.IdSesion;
                    imeiExistente = timeOut.getImeiSesion(idSesionRx);
                    /* console.log('imeiRx', imeiRx)
                    console.log('imeiExistente', imeiExistente)
                    console.log('idSesionRx', idSesionRx) */
                    coloring_1.default.colorLog(timeOut.getColorSesion(idSesionRx), `[${Date.now()} ${new Date().toLocaleString()}]${imeiRx ? (' imei[' + imeiRx + ']') : ''}${imeiExistente ? (' imei[' + imeiExistente + ']') : ''}${idSesionRx ? (' sesion[' + idSesionRx + ']') : ''} <cmd[${comando}] port[${socket.remotePort}]`);
                    const comandoExists = (_b = (_a = cmd[comando]) === null || _a === void 0 ? void 0 : _a.tx) === null || _b === void 0 ? void 0 : _b.Comando;
                    if (comandoExists) {
                        // si se recibe un imei
                        if (imeiRx) {
                            // y el comando es login
                            if (comando == 'Login') {
                                //console.log('LOGIN!!!', imeiRx)
                                if (!timeOut.sesionExists(imeiRx)) {
                                    //console.log('GENERAR!!!', imeiRx)
                                    cmd[comando].rx.Operador = (0, nombres_1.getNombre)() || 'Juan Perez';
                                    let idSesion = (0, uuid_1.getUuid)() || '';
                                    cmd[comando].rx.IdSesion = idSesion;
                                    timeOut.setLive(imeiRx, idSesion);
                                    datosEnviados = (_c = cmd[comando]) === null || _c === void 0 ? void 0 : _c.rx;
                                }
                            }
                        }
                        else if (imeiExistente) {
                            timeOut.setLive(imeiRx, idSesionRx);
                            if (comando == 'ConsultaTerminal') {
                                const codigo = datosRecibidos === null || datosRecibidos === void 0 ? void 0 : datosRecibidos.QR;
                                const maquina = yield this.maquinas.obtenerPorCodigo(codigo);
                                cmd[comando].rx.Fabricante = maquina.NombreFabricante;
                                cmd[comando].rx.Juego = maquina.NombreJuego;
                                cmd[comando].rx.UID = maquina.uuid;
                            }
                            else if (comando == 'ListaUID') {
                                const uuid = datosRecibidos === null || datosRecibidos === void 0 ? void 0 : datosRecibidos.UID;
                                const maquinas = yield this.maquinas.filtrarPorUuid(uuid);
                                cmd[comando].rx.Terminales = maquinas.map(maq => {
                                    return {
                                        Vinculada: maq.codigo,
                                        UID: maq.uuid,
                                        Fabricante: maq.NombreFabricante,
                                        Juego: maq.NombreJuego
                                    };
                                });
                            }
                            else if (comando == 'Operacion_SubirDinero') {
                                const codigo = datosRecibidos === null || datosRecibidos === void 0 ? void 0 : datosRecibidos.QR;
                                const importe = datosRecibidos === null || datosRecibidos === void 0 ? void 0 : datosRecibidos.Importe;
                                const FyH = new Date().toLocaleString().replace(',', '');
                                const maquina = yield this.maquinas.obtenerPorCodigo(codigo);
                                const movimiento = {
                                    Fabricante: maquina.NombreFabricante,
                                    Juego: maquina.NombreJuego,
                                    UID: maquina.uuid,
                                    Importe: importe,
                                    FechaHora: FyH
                                };
                                yield this.ultimosMovimientos.agregar(movimiento);
                            }
                            else if (comando == 'UltimosMovimientos') {
                                cmd[comando].rx.Movimientos = (yield this.ultimosMovimientos.obtener()).map(mov => (Object.assign(Object.assign({}, mov), { ticket: '12345678', impuesto: 69.82, neto: mov.Importe - 69.82 })));
                            }
                            else if (comando == 'VinculaTerminal') {
                                const codigo = datosRecibidos === null || datosRecibidos === void 0 ? void 0 : datosRecibidos.QR;
                                const uuid = datosRecibidos === null || datosRecibidos === void 0 ? void 0 : datosRecibidos.UID;
                                yield this.maquinas.relacionarCodigo(codigo, uuid);
                                const maquina = (yield this.maquinas.filtrarPorUuid(uuid))[0];
                                cmd[comando].rx.Fabricante = maquina.NombreFabricante;
                                cmd[comando].rx.Juego = maquina.NombreJuego;
                                cmd[comando].rx.UID = uuid;
                            }
                            datosEnviados = (_d = cmd[comando]) === null || _d === void 0 ? void 0 : _d.rx;
                        }
                        if (Object.keys(datosEnviados).length) {
                            coloring_1.default.colorLog(timeOut.getColorSesion(idSesionRx), `[${Date.now()} ${new Date().toLocaleString()}]${imeiRx ? (' imei[' + imeiRx + ']') : ''}${imeiExistente ? (' imei[' + imeiExistente + ']') : ''}${idSesionRx ? (' sesion[' + idSesionRx + ']') : ''} >cmd[${(_e = cmd[comando]) === null || _e === void 0 ? void 0 : _e.rx.Comando}] port[${socket.remotePort}]`);
                            // Enviar datos de vuelta al cliente
                            socket.write(JSON.stringify(datosEnviados));
                        }
                    }
                }
                //catch { }
                catch (error) {
                    const stackLines = error.stack.split('\n');
                    const errorLine = stackLines[1] || 'No line info';
                    const fileNameMatch = /at\s+(.+):(\d+):(\d+)/.exec(errorLine);
                    const fileName = fileNameMatch ? fileNameMatch[1] : 'Unknown file';
                    console.log(coloring_1.default.colorString(coloring_1.default.BgRed, 'ERROR:'), 
                    //Color.colorString(timeOut.getColorIdsesion(idSesion),`idSesion[${idSesion}]`), 
                    coloring_1.default.colorString(coloring_1.default.BgWhite + coloring_1.default.FgBlack, error.message));
                }
            }));
            // Evento cuando se cierra la conexión del cliente
            socket.on('close', () => {
                //console.log(`[${Date.now()} ${new Date().toLocaleString()}] Client disconnected: ip[${socket.remoteAddress}] port[${socket.remotePort}]`)
            });
            // Manejar errores de conexión
            socket.on('error', (err) => {
                console.error('Connection error:', err);
            });
        });
        const PORT = config_1.default.PORT_EXT;
        server.listen(PORT, () => {
            console.log(`Servicio TCP AppQR escuchando en el puerto ${PORT} (persistencia en ${config_1.default.MODO_PERSISTENCIA})`);
        });
    }
};
Server = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(container_types_1.default.IMaquinas)),
    __param(1, (0, inversify_1.inject)(container_types_1.default.IUltimosMovimientos)),
    __metadata("design:paramtypes", [Object, Object])
], Server);
exports.default = Server;
