"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = __importDefault(require("net"));
const config_1 = __importDefault(require("./config"));
let IdSesion = '';
const enviarCmd = (cmd, cb) => {
    const client = new net_1.default.Socket();
    // ---------- EC ------------
    //interno: 10.160.1.162 puerto 3000
    //externo: 181.27.126.129 puerto 3000
    //const host = '181.27.126.129';
    //const host = 'localhost';
    //const port = 3000;
    const host = config_1.default.HOST_EXT;
    const port = config_1.default.PORT_EXT;
    console.log(`Cliente conectandose al servicio TCP AppQR ${host}:${port}`);
    client.connect(+port, host, () => {
        console.log(`Conectado al servicio TCP AppQR ${host}:${port}`);
        const cmdStr = JSON.stringify(cmd);
        console.log('\n>TX (cmd)', cmd, new Date().toLocaleString(), Date.now());
        client.write(cmdStr);
    });
    client.on('data', (data) => {
        const datosRx = JSON.parse(data);
        console.log('<RX (cmd)', datosRx, new Date().toLocaleString(), Date.now());
        if (datosRx.Comando == 'RtaLogin') {
            IdSesion = datosRx.IdSesion;
            //console.log(IdSesion)
        }
        //console.log('Data received from Server:', data.toString());
        client.end();
        if (cb)
            cb();
    });
    client.on('close', () => {
        console.log('Connection closed');
        //process.exit()
    });
    client.on('error', (err) => {
        console.error('Connection error:', err);
    });
};
enviarCmd({
    "Comando": "Login",
    "Dispositivo": "1",
    "Ip": "",
    "IMEI": '1234'
}, () => {
    enviarCmd({
        "IdSesion": IdSesion,
        //"Comando": "Vivo",
        "Comando": "ListaUID",
        "UID": "1111"
    }, null);
});
//setInterval(() => {
/* setTimeout(() => {
    const cmd = {
        "Comando": "Vivo",
        "IdSesion": IdSesion
    }
    //const cmdStr = JSON.stringify(cmd,null,'\t')
    const cmdStr = JSON.stringify(cmd)

    console.log('\n>TX (cmd)', cmd, new Date().toLocaleString(), Date.now())
    client.write(cmdStr);
}, 2000) */
