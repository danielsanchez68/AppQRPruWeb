import net from 'node:net';

import * as servicioMaquinas from './DAO/maquinas.js'

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
            console.log('\n> Datos recibidos', datosRecibidos);

            let datosEnviados:any
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
            console.log('< Datos enviados', datosEnviados);

            // Enviar datos de vuelta al cliente
            socket.write(JSON.stringify(datosEnviados));
        } catch (error:any) {
            console.log('ERROR:', error.message);
        }
    });

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
