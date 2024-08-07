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
const fs_1 = __importDefault(require("fs"));
const inversify_1 = require("inversify");
let ModelFile = class ModelFile {
    constructor() {
        this.leerArchivo = (nombre) => __awaiter(this, void 0, void 0, function* () {
            let productos = [];
            try {
                productos = JSON.parse(yield fs_1.default.promises.readFile(nombre, 'utf-8'));
            }
            catch (_a) { }
            return productos;
        });
        this.escribirArchivo = (nombre, productos) => __awaiter(this, void 0, void 0, function* () {
            yield fs_1.default.promises.writeFile(nombre, JSON.stringify(productos, null, '\t'));
        });
        this.obtenerProductos = () => __awaiter(this, void 0, void 0, function* () {
            const productos = yield this.leerArchivo(this.nombreArchivo);
            return productos;
        });
        this.obtenerProducto = (id) => __awaiter(this, void 0, void 0, function* () {
            const productos = yield this.leerArchivo(this.nombreArchivo);
            const producto = productos.find((producto) => producto.id === id);
            return producto || {};
        });
        this.guardarProducto = (producto) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const productos = yield this.leerArchivo(this.nombreArchivo);
            producto.id = String(+(((_a = productos[productos.length - 1]) === null || _a === void 0 ? void 0 : _a.id) || 0) + 1);
            productos.push(producto);
            yield this.escribirArchivo(this.nombreArchivo, productos);
            return producto;
        });
        this.actualizarProducto = (id, producto) => __awaiter(this, void 0, void 0, function* () {
            const productos = yield this.leerArchivo(this.nombreArchivo);
            producto.id = id;
            const index = productos.findIndex((p) => p.id === id);
            const productoAnt = productos[index];
            const productoNuevo = Object.assign(Object.assign({}, productoAnt), producto);
            productos.splice(index, 1, productoNuevo);
            yield this.escribirArchivo(this.nombreArchivo, productos);
            return productoNuevo;
        });
        this.borrarProducto = (id) => __awaiter(this, void 0, void 0, function* () {
            const productos = yield this.leerArchivo(this.nombreArchivo);
            let productoEliminado = {};
            const index = productos.findIndex(p => p.id === id);
            if (index != -1) {
                productoEliminado = productos.splice(index, 1)[0];
                yield this.escribirArchivo(this.nombreArchivo, productos);
            }
            return productoEliminado;
        });
        this.nombreArchivo = 'productos.json';
    }
};
ModelFile = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ModelFile);
exports.default = ModelFile;
