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
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
let ModelMem = class ModelMem {
    constructor() {
        this.obtenerProductos = () => __awaiter(this, void 0, void 0, function* () { return this.productos; });
        this.obtenerProducto = (id) => __awaiter(this, void 0, void 0, function* () {
            const producto = this.productos.find(producto => producto.id === id);
            return producto || {};
        });
        this.guardarProducto = (producto) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            producto.id = String(+(((_a = this.productos[this.productos.length - 1]) === null || _a === void 0 ? void 0 : _a.id) || 0) + 1);
            this.productos.push(producto);
            return producto || {};
        });
        this.actualizarProducto = (id, producto) => __awaiter(this, void 0, void 0, function* () {
            producto.id = id;
            const index = this.productos.findIndex(p => p.id === id);
            const productoAnt = this.productos[index];
            const productoNuevo = Object.assign(Object.assign({}, productoAnt), producto);
            this.productos.splice(index, 1, productoNuevo);
            return productoNuevo || {};
        });
        this.borrarProducto = (id) => __awaiter(this, void 0, void 0, function* () {
            let productoEliminado = {};
            const index = this.productos.findIndex(p => p.id === id);
            if (index != -1) {
                productoEliminado = this.productos.splice(index, 1)[0];
            }
            return productoEliminado;
        });
        this.productos = [
            {
                nombre: "Pants",
                precio: 227.00,
                stock: 0,
                marca: "Grocery",
                categoria: "Bespoke Granite Computer",
                detalles: "Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support",
                foto: "https://loremflickr.com/640/480/sports",
                envio: false,
                id: "1"
            },
            {
                nombre: "Chair",
                precio: 766.00,
                stock: 78,
                marca: "Automotive",
                categoria: "Rustic Cotton Bike",
                detalles: "The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients",
                foto: "https://loremflickr.com/640/480/sports",
                envio: false,
                id: "2"
            },
            {
                nombre: "Shoes",
                precio: 981.00,
                stock: 39,
                marca: "Outdoors",
                categoria: "Handmade Steel Sausages",
                detalles: "New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart",
                foto: "https://loremflickr.com/640/480/food",
                envio: false,
                id: "3"
            }
        ];
    }
};
ModelMem = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ModelMem);
exports.default = ModelMem;
