import { IProducto } from "../../interfaces/IProducto"

export interface IDAOProductos {
    obtenerProductos: () => Promise<IProducto[]|[]>,
    obtenerProducto: (id:string) => Promise<IProducto|Object>,
    guardarProducto: (producto:IProducto) => Promise<IProducto|Object>,
    actualizarProducto: (id:string, producto:IProducto) => Promise<IProducto|Object>
    borrarProducto: (id:string) => Promise<IProducto|Object>
}