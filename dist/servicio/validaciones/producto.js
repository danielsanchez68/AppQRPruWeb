"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const validar = (producto) => {
    const productoSchema = joi_1.default.object({
        nombre: joi_1.default.string().min(2).max(20).required(),
        precio: joi_1.default.number().required(),
        stock: joi_1.default.number().required(),
        marca: joi_1.default.string().required(),
        categoria: joi_1.default.string().required(),
        detalles: joi_1.default.string().required(),
        foto: joi_1.default.string().required(),
        envio: joi_1.default.boolean().required()
    });
    const { error } = productoSchema.validate(producto);
    return error;
};
exports.default = validar;
