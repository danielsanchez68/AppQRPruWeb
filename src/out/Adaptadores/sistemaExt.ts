import net from 'net';
import { ISistemaExt } from '../Puertos/ISistemaExt';
import { injectable } from 'inversify';

import config from '../../config'


@injectable()
class SistemaExt implements ISistemaExt {
    private client:net.Socket
    private receive:any
    private buffer = ''

    constructor() {
        this.init()
    }

    init() {
        try {
            const client = new net.Socket();

            const host:any = config.HOST_EXT
            const port:any = config.PORT_EXT;
            
            client.connect(port, host, () => {
                try {
                    console.log(`Connect to external service TCP ${host}:${port}`);
                    //client.write('Hello from the TCP client');
                }
                catch(error:any) {
                    console.log('Error client.connect', error.message);
                    
                }
            });

            client.on('data', (data:any) => {
                this.buffer += data.toString()

                try {
                    const datos = JSON.parse(this.buffer)
                    this.buffer = ''
                    if(typeof this.receive === 'function' ) this.receive(datos)
                }
                catch(error:any) {
                    //console.log('Error data SistemaExt:', error.message)//, error)
                }
            });

            client.on('close', () => {
                console.log('Connection closed');
                this.reconectar()
                //process.exit()
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

    reconectar() {
        console.log('!!! Reconectando a sistema Externo... ', new Date().toLocaleString())
        setTimeout(() => this.init(),5000)
    }

    send(datos:any, receive:any) {
        if(this.client) {
            this.buffer = ''
            this.client.write(JSON.stringify({cmd: 'send', datos}))
            if(typeof receive === 'function' ) this.receive = receive
        }
    }

    get(receive:any) {
        if(this.client) {
            this.buffer = ''
            this.client.write(JSON.stringify({cmd: 'get'}))
            if(typeof receive === 'function' ) this.receive = receive
        }
    }

    asociar(datos:any, receive:any) {
        if(this.client) {
            this.buffer = ''
            this.client.write(JSON.stringify({cmd: 'asociar', datos}))
            if(typeof receive === 'function' ) this.receive = receive
        }
    }

    filtrar(datos:any, receive:any) {
        if(this.client) {
            this.buffer = ''
            this.client.write(JSON.stringify({cmd: 'filtrar', datos}))
            if(typeof receive === 'function' ) this.receive = receive
        }
    }
}

export default SistemaExt