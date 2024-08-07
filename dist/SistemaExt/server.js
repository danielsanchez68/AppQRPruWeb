"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = __importDefault(require("net"));
const config_1 = __importDefault(require("../config"));
// Create TCP server
const server = net_1.default.createServer(socket => {
    console.log('Client connected');
    // Event when receiving data from the client
    socket.on('data', (data) => {
        try {
            const datosRecibidos = JSON.parse(data);
            console.log('\n> Datos recibidos', datosRecibidos);
            const datosEnviados = Object.assign(Object.assign({}, datosRecibidos), { fyh: new Date().toLocaleString(), timestamp: Date.now() });
            console.log('< Datos enviados', datosEnviados);
            // Send data back to the client
            socket.write(JSON.stringify(datosEnviados));
        }
        catch (error) {
            console.log('ERROR:', error.message);
        }
    });
    // Event when the client connection is closed
    socket.on('close', () => {
        console.log('Client disconnected');
    });
    // Handle connection errors
    socket.on('error', (err) => {
        console.error('Connection error:', err);
    });
});
const port = +config_1.default.PORT + 1;
server.listen(port, () => {
    console.log(`TCP server started on port ${port}`);
});
