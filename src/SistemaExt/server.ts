import net from 'net';
import config from '../config'

// Create TCP server
const server = net.createServer(socket => {
    console.log('Client connected');

    // Event when receiving data from the client
    socket.on('data', (data:any) => {
        try {
            const datosRecibidos = JSON.parse(data)
            console.log('\n> Datos recibidos', datosRecibidos);

            const datosEnviados = {...datosRecibidos, fyh: new Date().toLocaleString(), timestamp: Date.now() } 
            console.log('< Datos enviados', datosEnviados);

            // Send data back to the client
            socket.write(JSON.stringify(datosEnviados));
        }
        catch(error:any) {
            console.log('ERROR:', error.message)
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

const port = +config.PORT + 1;
server.listen(port, () => {
    console.log(`TCP server started on port ${port}`);
});
