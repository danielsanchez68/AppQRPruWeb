import express, { Request, Response } from 'express'
//import https from 'https';
import '../SistemaExt/server'
import http from 'http';

import fs from 'fs';

import config from '../config'

import cors from 'cors'
import { IUI } from '../interfaces/IUI'
import { inject, injectable } from 'inversify'
import TYPES from '../container.types'
import { IServicioMaquina } from '../interfaces/IServicioMaquina'

export interface IControlador {
    enviarCodigoMaquina: (req:Request, res:Response) => Promise<void>
}

@injectable()
export class Controlador implements IControlador {
    constructor(@inject(TYPES.IServicioMaquina)private servicio:IServicioMaquina) {}
    
    enviarCodigoMaquina = async (req:Request, res:Response) => {
        try {
            const datosEntrada = req.body
            //console.log(datosEntrada)
            if(!Object.keys(datosEntrada).length) throw new Error('ERROR: datosEntrada vacío')
            const datosMaquina = await this.servicio.enviarCodigoMaquina(datosEntrada)

            res.json(datosMaquina)
        }
        catch(error:any) {
            res.status(500).json({errMsg: error.message})
        }
    }
}

@injectable()
class UI_HTTP implements IUI {
    constructor(@inject(TYPES.IControlador) private controlador:IControlador) {}

    private config() {
        const router = express.Router()

        router.post('/', this.controlador.enviarCodigoMaquina )

        return router
    }

    public async start() {
        const app = express()

        app.use(cors())
        app.use(express.static('public'))
        app.use(express.json())
        
        // --------- Configuración de Rutas / endpoints ---------
        app.use('/api/maquina', this.config())
        
        // --------------- Listen del Servidor ------------------
        const PORT = config.PORT

        // This line is from the Node.js HTTPS documentation.
        /* const sslKey = 'ssl/localhost.key'
        const sslCrt = 'ssl/localhost.crt'
        
        var options = {
            key: fs.readFileSync(sslKey),
            cert: fs.readFileSync(sslCrt)
        };

        const ip = sslCrt.replace('.','/').split('/')[1] || '127.0.0.1' */

        /* console.log('ssl key:', sslKey)
        console.log('ssl crt:', sslCrt)
        console.log(ip) */

        //console.log(options)
        //const server = https.createServer(options, app).listen(PORT, () => console.log(`Server AppQR listen in https://${ip}:${PORT} - cert[${sslCrt} - ${sslKey}]`))
        const server = http.createServer(app).listen(PORT, () => console.log(`Server AppQR listen in http://localhost:${PORT}`))
        server.on('error', error => console.log(`Error en servidor: ${error.message}`))
    }    
}

export default UI_HTTP
