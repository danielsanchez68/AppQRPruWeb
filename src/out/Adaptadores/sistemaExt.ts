import net from 'net';
import { ISistemaExt } from '../Puertos/ISistemaExt';
import { injectable } from 'inversify';

import config from '../../config'


class NetPromise {
    client:any

    constructor() {
        this.client = new net.Socket();

        const host:any = config.HOST_EXT
        const port:any = config.PORT_EXT;

        this.client.on('close', () => {
            //console.log('net Connection closed');
        });
        
        this.client.on('error', (err:any) => {
            console.error('Connection error:', err);
        });    
        
        this.client.connect(port, host, () => {
            try {
                //console.log(`Connect net ${host}:${port}`);
            }
            catch(error:any) {
                console.log('Error client.connect', error.message);
                this.client = null
            }
        });
    }    

    send(cmd:any, datos:any = {}) {
        return new Promise<Object>(resolve => {
            let buffer = ''
            this.client.write(JSON.stringify({cmd, datos}))
            this.client.on('data', (data:any) => {
                buffer += data.toString()
                try {
                    const datos = JSON.parse(buffer)
                    this.client.destroy()
                    resolve(datos)
                }
                catch {}
            });
        })
    }
}


@injectable()
class SistemaExt implements ISistemaExt {

    consultaTerminal(datos:any) {
        return new NetPromise().send(datos.Comando, datos)
    }    
}

export default SistemaExt