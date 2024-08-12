import { inject, injectable } from 'inversify'
import { IServicioMaquina } from './IServicioMaquina'

//import validar from './validaciones/producto'

import TYPES from '../container.types'
import { ISistemaExt } from '../out/Puertos/ISistemaExt'


@injectable()
class Servicio implements IServicioMaquina {
    constructor(
        @inject(TYPES.ISistemaExt) private sistemaExt:ISistemaExt
    ) {}

    enviarCodigoMaquina = async (datosEntrada:string) => {
        const datosMaquina:Object = await new Promise(resolve => {
            this.sistemaExt.send(datosEntrada, (datosMaquina:any) => {
                resolve(datosMaquina)
            })
        })
        return datosMaquina
    }

    getListadoMaquinas = async () => {
        const listado:[] = await new Promise(resolve => {
            this.sistemaExt.get((listado:any) => {
                resolve(listado)
            })
        })
        return listado
    }

    asociarMaquina = async (datosEntrada:string) => {
        const datosMaquina:Object = await new Promise(resolve => {
            this.sistemaExt.asociar(datosEntrada, (datosMaquina:any) => {
                resolve(datosMaquina)
            })
        })
        return datosMaquina
    }
}

export default Servicio