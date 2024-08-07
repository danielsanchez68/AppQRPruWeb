import Joi from 'joi'
import { IProducto } from '../../interfaces/IProducto';


const validar = (producto:IProducto) => {
    const productoSchema = Joi.object({
        nombre: Joi.string().min(2).max(20).required(),
        precio: Joi.number().required(),
        stock: Joi.number().required(),
        marca: Joi.string().required(),
        categoria: Joi.string().required(),
        detalles: Joi.string().required(),
        foto: Joi.string().required(),
        envio: Joi.boolean().required()
    })

    const { error } = productoSchema.validate(producto);
    return error
}

export default validar