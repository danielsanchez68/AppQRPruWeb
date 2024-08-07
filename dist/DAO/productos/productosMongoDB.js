"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DBMongo_1 = __importDefault(require("../DBMongo"));
const inversify_1 = require("inversify");
const productoSchema = new mongoose_1.default.Schema({
    nombre: String,
    precio: Number,
    stock: Number,
    marca: String,
    categoria: String,
    detalles: String,
    foto: String,
    envio: Boolean,
}, { versionKey: false });
const ProductoModel = mongoose_1.default.model('productos', productoSchema);
let ModelMongoDB = class ModelMongoDB {
    constructor() {
        this.obtenerProductos = () => __awaiter(this, void 0, void 0, function* () {
            if (!DBMongo_1.default.connectionOK)
                throw new Error('[ERROR] DAO sin conexión a MongoDB');
            const productos = yield ProductoModel.find({});
            return productos || [];
        });
        this.obtenerProducto = (id) => __awaiter(this, void 0, void 0, function* () {
            if (!DBMongo_1.default.connectionOK)
                throw new Error('[ERROR] DAO sin conexión a MongoDB');
            const producto = yield ProductoModel.findOne({ _id: id });
            return producto || {};
        });
        this.guardarProducto = (producto) => __awaiter(this, void 0, void 0, function* () {
            if (!DBMongo_1.default.connectionOK)
                throw new Error('[ERROR] DAO sin conexión a MongoDB');
            const productoModel = new ProductoModel(producto);
            const productoGuardado = yield productoModel.save();
            return productoGuardado || {};
        });
        this.actualizarProducto = (id, producto) => __awaiter(this, void 0, void 0, function* () {
            if (!DBMongo_1.default.connectionOK)
                throw new Error('[ERROR] DAO sin conexión a MongoDB');
            yield ProductoModel.updateOne({ _id: id }, { $set: producto });
            const productoActualizado = yield this.obtenerProducto(id);
            return productoActualizado || {};
        });
        this.borrarProducto = (id) => __awaiter(this, void 0, void 0, function* () {
            if (!DBMongo_1.default.connectionOK)
                throw new Error('[ERROR] DAO sin conexión a MongoDB');
            const productoBorrado = yield this.obtenerProducto(id);
            yield ProductoModel.deleteOne({ _id: id });
            return productoBorrado || {};
        });
        (() => __awaiter(this, void 0, void 0, function* () { return yield DBMongo_1.default.conectar(); }))();
    }
};
ModelMongoDB = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ModelMongoDB);
exports.default = ModelMongoDB;
