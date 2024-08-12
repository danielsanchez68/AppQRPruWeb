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
const node_net_1 = __importDefault(require("node:net"));
const servicioMaquinas = __importStar(require("./DAO/maquinas.js"));
const options = {
    keepAlive: true
};
// Crear el servidor TCP
const server = node_net_1.default.createServer(options, socket => {
    console.log('Client connected');
    // Evento para manejar datos recibidos del cliente
    socket.on('data', (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const datosRecibidos = JSON.parse(data);
            console.log('\n> Datos recibidos', datosRecibidos);
            let datosEnviados;
            if (datosRecibidos.cmd == 'send') {
                const { codigo } = datosRecibidos.datos;
                const maquina = yield servicioMaquinas.obtenerPorCodigo(codigo);
                //console.log(maquina)
                datosEnviados = Object.assign({}, maquina);
            }
            else if (datosRecibidos.cmd == 'get') {
                const maquinas = yield servicioMaquinas.obtener();
                datosEnviados = maquinas;
            }
            else if (datosRecibidos.cmd == 'asociar') {
                const { codigo, uuid } = datosRecibidos.datos;
                const maquina = yield servicioMaquinas.relacionarCodigo(codigo, uuid);
                datosEnviados = maquina;
            }
            console.log('< Datos enviados', datosEnviados);
            // Enviar datos de vuelta al cliente
            socket.write(JSON.stringify(datosEnviados));
        }
        catch (error) {
            console.log('ERROR:', error.message);
        }
    }));
    // Evento cuando se cierra la conexi�n del cliente
    socket.on('close', () => {
        console.log('Client disconnected');
    });
    // Manejar errores de conexi�n
    socket.on('error', (err) => {
        console.error('Connection error:', err);
    });
});
const port = 3000;
server.listen(port, () => {
    console.log(`TCP server started on port ${port}`);
});
