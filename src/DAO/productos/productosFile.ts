import fs from 'fs'
import { IDAOProductos } from './IDAOProductos'
import { injectable } from 'inversify'
import { IProducto } from '../../interfaces/IProducto'


@injectable()
class ModelFile implements IDAOProductos {
    private nombreArchivo:string

    constructor() {
        this.nombreArchivo = 'productos.json'
    }

    leerArchivo = async (nombre:string) => {
        let productos = []
        try {
            productos = JSON.parse(await fs.promises.readFile(nombre, 'utf-8'))
        }
        catch {}

        return productos
    }

    escribirArchivo = async (nombre:string, productos:IProducto[]) => {
        await fs.promises.writeFile(nombre, JSON.stringify(productos, null, '\t'))
    }

    obtenerProductos = async () => {
        const productos = await this.leerArchivo(this.nombreArchivo)
        return productos
    }

    obtenerProducto = async (id:string) => {
        const productos = await this.leerArchivo(this.nombreArchivo)    
        const producto = productos.find((producto:IProducto) => producto.id === id)
        return producto || {}    
    }

    guardarProducto = async (producto:IProducto) => {
        const productos:IProducto[] = await this.leerArchivo(this.nombreArchivo)

        producto.id = String(+(productos[productos.length-1]?.id || 0) + 1)
        productos.push(producto)

        await this.escribirArchivo(this.nombreArchivo, productos)

        return producto
    }

    actualizarProducto = async (id:string,producto:IProducto) => {
        const productos:IProducto[] = await this.leerArchivo(this.nombreArchivo)

        producto.id = id

        const index = productos.findIndex((p:IProducto) => p.id === id)
        const productoAnt:IProducto = productos[index]
        const productoNuevo:IProducto = {...productoAnt, ...producto}

        productos.splice(index, 1, productoNuevo)

        await this.escribirArchivo(this.nombreArchivo, productos)

        return productoNuevo
    }

    borrarProducto = async (id:string) => {
        const productos:IProducto[] = await this.leerArchivo(this.nombreArchivo)

        let productoEliminado = {}

        const index = productos.findIndex(p => p.id === id)

        if(index != -1) {
            productoEliminado = productos.splice(index, 1)[0]
            await this.escribirArchivo(this.nombreArchivo, productos)
        }
        return productoEliminado
    }
}

export default ModelFile