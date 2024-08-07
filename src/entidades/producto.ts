import { IProducto } from "../interfaces/IProducto"

export class Producto implements IProducto {
    id: string
    nombre: string
    precio: number
    stock: number
    marca: string
    categoria: string
    detalles: string
    foto: string
    envio: boolean
}
