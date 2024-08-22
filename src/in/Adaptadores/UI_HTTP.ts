import express, { Request, Response } from 'express'
import http from 'http'

import config from '../../config'

import cors from 'cors'
import { IUI } from '../Puertos/IUI'
import { inject, injectable } from 'inversify'
import TYPES from '../../container.types'
import { IServicioMaquina } from '../../servicio/IServicioMaquina'
import { IServicioMovimientos } from '../../servicio/IServicioMovimientos';

export interface IControladorMaq {
    enviarCodigoMaquina: (req:Request, res:Response) => Promise<void>
    getListadoMaquinas: (req:Request, res:Response) => Promise<void>
    asociarMaquina: (req:Request, res:Response) => Promise<void>
    filtrarMaquina: (req:Request, res:Response) => Promise<void>
}

export interface IControladorMov {
    obtenerMovimientos: (req:Request, res:Response) => Promise<void>
    obtenerMovimientoPorUuid: (req:Request, res:Response) => Promise<void>
    agregarMovimiento: (req:Request, res:Response) => Promise<void>
}

@injectable()
export class ControladorMaq implements IControladorMaq {
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
export class ControladorMov implements IControladorMov {
    constructor(@inject(TYPES.IServicioMovimientos)private servicio:IServicioMovimientos) {}
    
    obtenerMovimientos = async (req:Request, res:Response) => {
        try {
            const movimientos = await this.servicio.obtenerMovimientos()
            res.json(movimientos)
        }
        catch(error:any) {
            res.status(500).json({errMsg: error.message})
        }
    }

    obtenerMovimientoPorUuid = async (req:Request, res:Response) => {
        try {
            const uuid = req.body
            if(!Object.keys(uuid).length) throw new Error('ERROR: uuid vacío')
            const movimiento = await this.servicio.obtenerMovimientoPorUuid(uuid)

            res.json(movimiento)
        }
        catch(error:any) {
            res.status(500).json({errMsg: error.message})
        }
    }

    agregarMovimiento = async (req:Request, res:Response) => {
        try {
            const movimiento = req.body
            
            if(!Object.keys(movimiento).length) throw new Error('ERROR: movimiento vacío')
            const movimientos = await this.servicio.agregarMovimiento(movimiento)
            res.json(movimientos)
        }
        catch(error:any) {
            res.status(500).json({errMsg: error.message})
        }
    }
}


@injectable()
class UI_HTTP implements IUI {
    constructor(
        @inject(TYPES.IControladorMaq) private controladorMaq:IControladorMaq,
        @inject(TYPES.IControladorMov) private controladorMov:IControladorMov
    ) {}

    private configRouterMaq() {
        const router = express.Router()

        router.post('/codigo', this.controladorMaq.enviarCodigoMaquina )
        router.get('/listado', this.controladorMaq.getListadoMaquinas )
        router.post('/asociar', this.controladorMaq.asociarMaquina )
        router.post('/filtrar', this.controladorMaq.filtrarMaquina )

        return router
    }

    private configRouterMov() {
        const router = express.Router()

        router.get('/listado', this.controladorMov.obtenerMovimientos )
        router.post('/uuid', this.controladorMov.obtenerMovimientoPorUuid )
        router.post('/agregar', this.controladorMov.agregarMovimiento )

        return router
    }

    public async start() {
        const app = express()

        app.use(cors())
        app.use(express.static('public'))
        app.use(express.json())
        
        // --------- Configuración de Rutas / endpoints ---------
        app.use('/api/maquina', this.configRouterMaq())
        app.use('/api/movimientos', this.configRouterMov())
        
        // --------------- Listen del Servidor ------------------
        const PORT = config.PORT

        const server = http.createServer(app).listen(PORT, () => console.log(`Server AppQR listen in http://localhost:${PORT}`))
        server.on('error', error => console.log(`Error en servidor: ${error.message}`))
    }    
}

export default UI_HTTP
