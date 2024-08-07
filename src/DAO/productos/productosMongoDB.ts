import mongoose from "mongoose"
import CnxMongoDB from "../DBMongo"
import { IDAOProductos } from "./IDAOProductos"
import { injectable } from "inversify"
import { IProducto } from "../../interfaces/IProducto"

const productoSchema = new mongoose.Schema({
    nombre: String,
    precio: Number,
    stock: Number,
    marca: String,
    categoria: String,
    detalles: String,
    foto: String,
    envio: Boolean,
}, { versionKey: false })

const ProductoModel = mongoose.model('productos', productoSchema)

@injectable()
class ModelMongoDB implements IDAOProductos {
    constructor() {
        (async () => await CnxMongoDB.conectar())()
    }

    obtenerProductos = async () => {
        if(!CnxMongoDB.connectionOK) throw new Error('[ERROR] DAO sin conexión a MongoDB')
        const productos:IProducto[] = await ProductoModel.find({})
        return productos || []
    }
    
    obtenerProducto = async (id:string) => {
        if(!CnxMongoDB.connectionOK) throw new Error('[ERROR] DAO sin conexión a MongoDB')
        const producto:(IProducto|null) = await ProductoModel.findOne({_id: id})
        return producto || {}
    }

    guardarProducto = async (producto:IProducto) => {
        if(!CnxMongoDB.connectionOK) throw new Error('[ERROR] DAO sin conexión a MongoDB')

        const productoModel = new ProductoModel(producto)
        const productoGuardado = await productoModel.save()
        return productoGuardado || {}
    }

    actualizarProducto = async (id:string, producto:IProducto) => {
        if(!CnxMongoDB.connectionOK) throw new Error('[ERROR] DAO sin conexión a MongoDB')

        await ProductoModel.updateOne(
            {_id: id }, 
            { $set: producto }
        )
        const productoActualizado = await this.obtenerProducto(id)
        return productoActualizado || {}
    }

    borrarProducto = async (id:string) => {
        if(!CnxMongoDB.connectionOK) throw new Error('[ERROR] DAO sin conexión a MongoDB')

        const productoBorrado = await this.obtenerProducto(id)
        await ProductoModel.deleteOne({_id: id})
        return productoBorrado || {}
    }
}

export default ModelMongoDB