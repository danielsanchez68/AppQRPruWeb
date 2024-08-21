import net from 'net';

import * as servicioMaquinas from './DAO/maquinas'

import config from '../config'

const options = {
    keepAlive: true
}

// Crear el servidor TCP
const server = net.createServer(options, socket => {
    console.log('Client connected');

    // Evento para manejar datos recibidos del cliente
    socket.on('data', async (data:any) => {
        try {
            const datosRecibidos = JSON.parse(data);
            //console.log('\n> Datos recibidos', datosRecibidos);

            let datosEnviados
            if(datosRecibidos.cmd == 'send') {
                const { codigo } = datosRecibidos.datos;
                const maquina = await servicioMaquinas.obtenerPorCodigo(codigo);
                //console.log(maquina)

                datosEnviados = {
                    //...datosRecibidos,
                    ...maquina
                };
            }
            else if(datosRecibidos.cmd == 'get') {
                const maquinas = await servicioMaquinas.obtener();
                datosEnviados = maquinas
            }
            else if(datosRecibidos.cmd == 'asociar') {
                const { codigo, uuid } = datosRecibidos.datos;
                const maquina = await servicioMaquinas.relacionarCodigo(codigo, uuid);
                datosEnviados = maquina
            }
            else if(datosRecibidos.cmd == 'filtrar') {
                const { uuidParcial } = datosRecibidos.datos;
                const maquinas = await servicioMaquinas.filtrarPorUuid(uuidParcial);
                datosEnviados = maquinas
            }
            //console.log('< Datos enviados', datosEnviados);

            // Enviar datos de vuelta al cliente
            socket.write(JSON.stringify(datosEnviados));
        } catch (error:any) {
            console.log('ERROR:', error.message);
        }
    });

    // Evento cuando se cierra la conexión del cliente
    socket.on('close', () => {
        console.log('Client disconnected');
    });

    // Manejar errores de conexión
    socket.on('error', (err) => {
        console.error('Connection error:', err);
    });
});

const port = config.PORT_EXT;
server.listen(port, () => {
    console.log(`TCP server started on port ${port}`);
});
