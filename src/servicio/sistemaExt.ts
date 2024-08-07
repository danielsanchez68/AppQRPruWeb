import net from 'net';
import { ISistemaExt } from '../interfaces/ISistemaExt';
import { injectable } from 'inversify';
import config from '../config';

@injectable()
class SistemaExt implements ISistemaExt {
    private client:net.Socket
    private receive:any

    constructor() {
        try {
            const client = new net.Socket();

            const port = +config.PORT + 1;
            const host = 'localhost'; // Change to the host where the server is
            
            client.connect(port, host, () => {
                try {
                    console.log('Connected to the TCP server');
                    //client.write('Hello from the TCP client');
                }
                catch(error:any) {
                    console.log('Error client.connect', error.message);
                    
                }
            });

            client.on('data', (data:any) => {
                const datos = JSON.parse(data)
                //console.log('client.on(data)', datos)
                if(typeof this.receive === 'function' ) this.receive(datos)
            });
            
            client.on('close', () => {
                console.log('Connection closed');
                process.exit()
            });
            
            client.on('error', (err) => {
                console.error('Connection error:', err);
            });

            this.client = client
        }
        catch(error:any) {
            console.log('Error conexión TCP:', error.message);
        }
    }

    send(datos:any, receive:any) {
        if(this.client) {
            //console.log(datos)
            this.client.write(JSON.stringify(datos))
            if(typeof receive === 'function' ) this.receive = receive
            //console.log(this.receive)
        }
    }
}

export default SistemaExt