import { inject, injectable } from 'inversify'
import { IServicioMaquina } from './IServicioMaquina'

//import validar from './validaciones/producto'

import TYPES from '../container.types'
import { ISistemaExt } from '../out/Puertos/ISistemaExt'
import { IServicioMovimientos } from './IServicioMovimientos'


@injectable()
class ServicioMov implements IServicioMovimientos {
    constructor(
        @inject(TYPES.ISistemaExt) private sistemaExt:ISistemaExt
    ) {}

    obtenerMovimientos = async () => {
        const movimientos:[] = await new Promise(resolve => {
            this.sistemaExt.obtenerUM((movimientos:any) => {
                resolve(movimientos)
            })
        })
        return movimientos
    }

    obtenerMovimientoPorUuid = async (uuid:string) => {
        const movimiento:Object = await new Promise(resolve => {
            this.sistemaExt.obtenerUM_Uuid(uuid, (movimiento:any) => {
                resolve(movimiento)
            })
        })
        return movimiento
    }

    agregarMovimiento = async (movimiento:string) => {
        const movimientos:[] = await new Promise(resolve => {
            this.sistemaExt.agregarUM(movimiento, (movimientos:any) => {
                resolve(movimientos)
            })
        })
        return movimientos
    }
}

export default ServicioMov