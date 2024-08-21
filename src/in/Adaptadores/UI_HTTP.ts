import express, { Request, Response } from 'express'
import http from 'http';

import config from '../../config'

import cors from 'cors'
import { IUI } from '../Puertos/IUI'
import { inject, injectable } from 'inversify'
import TYPES from '../../container.types'
import { IServicioMaquina } from '../../servicio/IServicioMaquina'

export interface IControlador {
    enviarCodigoMaquina: (req:Request, res:Response) => Promise<void>
    getListadoMaquinas: (req:Request, res:Response) => Promise<void>
    asociarMaquina: (req:Request, res:Response) => Promise<void>
    filtrarMaquina: (req:Request, res:Response) => Promise<void>
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

    getListadoMaquinas = async (req:Request, res:Response) => {
        try {
            const listado = await this.servicio.getListadoMaquinas()
            res.json(listado)
        }
        catch(error:any) {
            res.status(500).json({errMsg: error.message})
        }
    }

    asociarMaquina = async (req:Request, res:Response) => {
        try {
            const datosEntrada = req.body
            if(!Object.keys(datosEntrada).length) throw new Error('ERROR: datosEntrada vacío')
            const datosMaquina = await this.servicio.asociarMaquina(datosEntrada)

            res.json(datosMaquina)
        }
        catch(error:any) {
            res.status(500).json({errMsg: error.message})
        }
    }

    filtrarMaquina = async (req:Request, res:Response) => {
        try {
            const datosEntrada = req.body
            if(!Object.keys(datosEntrada).length) throw new Error('ERROR: datosEntrada vacío')
            const datosMaquina = await this.servicio.filtrarMaquina(datosEntrada)
            //console.log(datosMaquina)
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

        router.post('/codigo', this.controlador.enviarCodigoMaquina )
        router.get('/listado', this.controlador.getListadoMaquinas )
        router.post('/asociar', this.controlador.asociarMaquina )
        router.post('/filtrar', this.controlador.filtrarMaquina )

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

        const server = http.createServer(app).listen(PORT, () => console.log(`Server AppQR listen in http://localhost:${PORT}`))
        server.on('error', error => console.log(`Error en servidor: ${error.message}`))
    }    
}

export default UI_HTTP
