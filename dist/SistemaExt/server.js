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
const delay_1 = __importDefault(require("./util/delay"));
const maquinas_1 = require("./DAO/maquinas");
const ultimosMovimientos_1 = require("./DAO/ultimosMovimientos");
const config_1 = __importDefault(require("../config"));
const options = {
    keepAlive: true
};
// Crear el servidor TCP
const server = net_1.default.createServer(options, socket => {
    //console.log('Client connected');
    // Evento para manejar datos recibidos del cliente
    socket.on('data', (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const datosRecibidos = JSON.parse(data);
            console.log('\n> Datos recibidos', JSON.stringify(datosRecibidos), new Date().toLocaleString());
            let datosEnviados = {};
            const cmd = JSON.parse(yield fs_1.default.promises.readFile('./Comandos/listado.json', 'utf-8'));
            //nuevo server TCP
            const comando = datosRecibidos === null || datosRecibidos === void 0 ? void 0 : datosRecibidos.Comando;
            //console.log(comando)
            if ((_b = (_a = cmd[comando]) === null || _a === void 0 ? void 0 : _a.tx) === null || _b === void 0 ? void 0 : _b.Comando) {
                //console.log(comando)
                /* if(
                    comando === 'Operacion_SubirDinero' ||
                    comando === 'VinculaTerminal' ||
                    comando === 'ConsultaTerminal' ||
                    comando === 'ListaUID' ||
                    comando === 'UltimosMovimientos'
                ) */ yield (0, delay_1.default)(200);
                if (comando == 'ConsultaTerminal') {
                    const codigo = datosRecibidos === null || datosRecibidos === void 0 ? void 0 : datosRecibidos.QR;
                    const maquina = yield (0, maquinas_1.obtenerPorCodigo)(codigo);
                    cmd[comando].rx.Fabricante = maquina.NombreFabricante;
                    cmd[comando].rx.Juego = maquina.NombreJuego;
                    cmd[comando].rx.UID = maquina.uuid;
                }
                else if (comando == 'ListaUID') {
                    const uuid = datosRecibidos === null || datosRecibidos === void 0 ? void 0 : datosRecibidos.UID;
                    const maquinas = yield (0, maquinas_1.filtrarPorUuid)(uuid);
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
                    const FyH = datosRecibidos === null || datosRecibidos === void 0 ? void 0 : datosRecibidos.FyH;
                    const maquina = yield (0, maquinas_1.obtenerPorCodigo)(codigo);
                    const movimiento = {
                        Fabricante: maquina.NombreFabricante,
                        Juego: maquina.NombreJuego,
                        UID: maquina.uuid,
                        Importe: importe,
                        FechaHora: FyH
                    };
                    yield (0, ultimosMovimientos_1.agregar)(movimiento);
                }
                else if (comando == 'UltimosMovimientos') {
                    cmd[comando].rx.Movimientos = (yield (0, ultimosMovimientos_1.obtener)()).map(mov => (Object.assign(Object.assign({}, mov), { ticket: '12345678', impuesto: 69.82, neto: mov.Importe - 69.82 })));
                }
                else if (comando == 'VinculaTerminal') {
                    const codigo = datosRecibidos === null || datosRecibidos === void 0 ? void 0 : datosRecibidos.QR;
                    const uuid = datosRecibidos === null || datosRecibidos === void 0 ? void 0 : datosRecibidos.UID;
                    yield (0, maquinas_1.relacionarCodigo)(codigo, uuid);
                    const maquina = (yield (0, maquinas_1.filtrarPorUuid)(uuid))[0];
                    cmd[comando].rx.Fabricante = maquina.NombreFabricante;
                    cmd[comando].rx.Juego = maquina.NombreJuego;
                    cmd[comando].rx.UID = uuid;
                }
                datosEnviados = (_c = cmd[comando]) === null || _c === void 0 ? void 0 : _c.rx;
            }
            console.log('< Datos enviados', JSON.stringify(datosEnviados), new Date().toLocaleString());
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
