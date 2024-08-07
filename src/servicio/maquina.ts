import { inject, injectable } from 'inversify'
import { IDAOProductos } from '../DAO/productos/IDAOProductos'
import { IServicioMaquina } from '../interfaces/IServicioMaquina'

//import validar from './validaciones/producto'

import TYPES from '../container.types'
import { ISistemaExt } from '../interfaces/ISistemaExt'


@injectable()
class Servicio implements IServicioMaquina {
    constructor(
        @inject(TYPES.ISistemaExt) private sistemaExt:ISistemaExt, 
        @inject(TYPES.IDAOProductos) private model:IDAOProductos
    ) {}

    enviarCodigoMaquina = async (datosEntrada:string) => {
        const datosMaquina:Object = await new Promise(resolve => {
            this.sistemaExt.send(datosEntrada, (datosMaquina:any) => {
                resolve(datosMaquina)
            })
        })
        return datosMaquina
    }
}

export default Servicio