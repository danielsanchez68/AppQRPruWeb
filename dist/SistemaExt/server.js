"use strict";
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
const delay_js_1 = __importDefault(require("./util/delay.js"));
const maquinas_js_1 = require("./DAO/maquinas.js");
const ultimosMovimientos_js_1 = require("./DAO/ultimosMovimientos.js");
const config_1 = __importDefault(require("../config"));
const options = {
    keepAlive: true
};
// Crear el servidor TCP
const server = net_1.default.createServer(options, socket => {
    //console.log('Client connected');
    // Evento para manejar datos recibidos del cliente
    socket.on('data', (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        try {
            const datosRecibidos = JSON.parse(data);
            console.log('\n> Datos recibidos', datosRecibidos, new Date().toLocaleString());
            let datosEnviados = {};
            const cmd = JSON.parse(yield fs_1.default.promises.readFile('./Comandos/listado.json', 'utf-8'));
            //nuevo server TCP
            const comando = (_a = datosRecibidos === null || datosRecibidos === void 0 ? void 0 : datosRecibidos.datos) === null || _a === void 0 ? void 0 : _a.Comando;
            if ((_c = (_b = cmd[comando]) === null || _b === void 0 ? void 0 : _b.tx) === null || _c === void 0 ? void 0 : _c.Comando) {
                //console.log(comando)
                /* if(
                    comando === 'Operacion_SubirDinero' ||
                    comando === 'VinculaTerminal' ||
                    comando === 'ConsultaTerminal' ||
                    comando === 'ListaUID' ||
                    comando === 'UltimosMovimientos'
                ) */ yield (0, delay_js_1.default)(200);
                if (comando == 'ConsultaTerminal') {
                    const codigo = (_d = datosRecibidos === null || datosRecibidos === void 0 ? void 0 : datosRecibidos.datos) === null || _d === void 0 ? void 0 : _d.QR;
                    const maquina = yield (0, maquinas_js_1.obtenerPorCodigo)(codigo);
                    cmd[comando].rx.Fabricante = maquina.NombreFabricante;
                    cmd[comando].rx.Juego = maquina.NombreJuego;
                    cmd[comando].rx.UID = maquina.uuid;
                }
                else if (comando == 'ListaUID') {
                    const uuid = (_e = datosRecibidos === null || datosRecibidos === void 0 ? void 0 : datosRecibidos.datos) === null || _e === void 0 ? void 0 : _e.UID;
                    const maquinas = yield (0, maquinas_js_1.filtrarPorUuid)(uuid);
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
                    const codigo = (_f = datosRecibidos === null || datosRecibidos === void 0 ? void 0 : datosRecibidos.datos) === null || _f === void 0 ? void 0 : _f.QR;
                    const importe = (_g = datosRecibidos === null || datosRecibidos === void 0 ? void 0 : datosRecibidos.datos) === null || _g === void 0 ? void 0 : _g.Importe;
                    const FyH = (_h = datosRecibidos === null || datosRecibidos === void 0 ? void 0 : datosRecibidos.datos) === null || _h === void 0 ? void 0 : _h.FyH;
                    const maquina = yield (0, maquinas_js_1.obtenerPorCodigo)(codigo);
                    const movimiento = {
                        Fabricante: maquina.NombreFabricante,
                        Juego: maquina.NombreJuego,
                        UID: maquina.uuid,
                        Importe: importe,
                        FechaHora: FyH
                    };
                    yield (0, ultimosMovimientos_js_1.agregar)(movimiento);
                }
                else if (comando == 'UltimosMovimientos') {
                    cmd[comando].rx.Movimientos = (yield (0, ultimosMovimientos_js_1.obtener)()).map(mov => (Object.assign(Object.assign({}, mov), { ticket: '12345678', impuesto: 69.82, neto: mov.Importe - 69.82 })));
                }
                else if (comando == 'VinculaTerminal') {
                    const codigo = (_j = datosRecibidos === null || datosRecibidos === void 0 ? void 0 : datosRecibidos.datos) === null || _j === void 0 ? void 0 : _j.QR;
                    const uuid = (_k = datosRecibidos === null || datosRecibidos === void 0 ? void 0 : datosRecibidos.datos) === null || _k === void 0 ? void 0 : _k.UID;
                    yield (0, maquinas_js_1.relacionarCodigo)(codigo, uuid);
                    const maquina = (yield (0, maquinas_js_1.filtrarPorUuid)(uuid))[0];
                    cmd[comando].rx.Fabricante = maquina.NombreFabricante;
                    cmd[comando].rx.Juego = maquina.NombreJuego;
                    cmd[comando].rx.UID = uuid;
                }
                datosEnviados = (_l = cmd[comando]) === null || _l === void 0 ? void 0 : _l.rx;
            }
            console.log('< Datos enviados', datosEnviados, new Date().toLocaleString());
            // Enviar datos de vuelta al cliente
            socket.write(JSON.stringify(datosEnviados));
        }
        catch (error) {
            console.log('ERROR:', error.message);
        }
    }));
    // Evento cuando se cierra la conexi�n del cliente
    socket.on('close', () => {
        //console.log('Client disconnected');
    });
    // Manejar errores de conexi�n
    socket.on('error', (err) => {
        console.error('Connection error:', err);
    });
});
const port = config_1.default.PORT_EXT;
server.listen(port, () => {
    console.log(`TCP server started on port ${port}`);
});
