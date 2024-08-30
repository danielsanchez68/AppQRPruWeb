import net from 'net';
import fs from 'fs';

import delay from './util/delay.js';
import { filtrarPorUuid, obtenerPorCodigo, relacionarCodigo } from './DAO/maquinas.js';
import { agregar, obtener } from './DAO/ultimosMovimientos.js';

import config from '../config'


const options = {
    keepAlive: true
}

// Crear el servidor TCP
const server = net.createServer(options, socket => {
    //console.log('Client connected');

    // Evento para manejar datos recibidos del cliente
    socket.on('data', async (data:any) => {
        try {
            const datosRecibidos = JSON.parse(data);
            console.log('\n> Datos recibidos', datosRecibidos, new Date().toLocaleString());

            let datosEnviados = {}

            const cmd = JSON.parse(await fs.promises.readFile('./Comandos/listado.json','utf-8'))

            //nuevo server TCP
            const comando = datosRecibidos?.datos?.Comando
            if(cmd[comando]?.tx?.Comando) {
                //console.log(comando)
                /* if(
                    comando === 'Operacion_SubirDinero' ||
                    comando === 'VinculaTerminal' ||
                    comando === 'ConsultaTerminal' ||
                    comando === 'ListaUID' ||
                    comando === 'UltimosMovimientos'
                ) */ await delay(200)

                if(comando == 'ConsultaTerminal') {
                    const codigo = datosRecibidos?.datos?.QR
                    const maquina = await obtenerPorCodigo(codigo)

                    cmd[comando].rx.Fabricante = maquina.NombreFabricante
                    cmd[comando].rx.Juego = maquina.NombreJuego
                    cmd[comando].rx.UID = maquina.uuid
                }
                else if(comando == 'ListaUID') {
                    const uuid = datosRecibidos?.datos?.UID
                    const maquinas = await filtrarPorUuid(uuid)

                    cmd[comando].rx.Terminales = maquinas.map( maq => {
                        return {
                            Vinculada: maq.codigo,
                            UID: maq.uuid,
                            Fabricante: maq.NombreFabricante,
                            Juego: maq.NombreJuego
                        } 
                    })
                }
                else if(comando == 'Operacion_SubirDinero') {
                    const codigo = datosRecibidos?.datos?.QR
                    const importe = datosRecibidos?.datos?.Importe
                    const FyH = datosRecibidos?.datos?.FyH
                    const maquina = await obtenerPorCodigo(codigo)

                    const movimiento = {
                        Fabricante: maquina.NombreFabricante,
                        Juego: maquina.NombreJuego,
                        UID: maquina.uuid,
                        Importe: importe,
                        FechaHora: FyH
                    }
                    await agregar(movimiento)
                }
                else if(comando == 'UltimosMovimientos') {
                    cmd[comando].rx.Movimientos = (await obtener()).map(mov => ({
                        ...mov, 
                        ticket: '12345678',
                        impuesto: 69.82,
                        neto: mov.Importe - 69.82
                    }))
                }
                else if(comando == 'VinculaTerminal') {
                    const codigo = datosRecibidos?.datos?.QR
                    const uuid = datosRecibidos?.datos?.UID
                    await relacionarCodigo(codigo, uuid)

                    const maquina = (await filtrarPorUuid(uuid))[0]
                    cmd[comando].rx.Fabricante = maquina.NombreFabricante
                    cmd[comando].rx.Juego = maquina.NombreJuego
                    cmd[comando].rx.UID = uuid
                }
                datosEnviados = cmd[comando]?.rx
            }
            console.log('< Datos enviados', datosEnviados, new Date().toLocaleString());

            // Enviar datos de vuelta al cliente
            socket.write(JSON.stringify(datosEnviados));
        } catch (error:any) {
            console.log('ERROR:', error.message);
        }
    });

    // Evento cuando se cierra la conexi�n del cliente
    socket.on('close', () => {
        //console.log('Client disconnected');
    });

    // Manejar errores de conexi�n
    socket.on('error', (err) => {
        console.error('Connection error:', err);
    });
});

const port = config.PORT_EXT;
server.listen(port, () => {
    console.log(`TCP server started on port ${port}`);
});
