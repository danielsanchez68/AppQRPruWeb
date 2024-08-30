"use strict";
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
exports.obtener = obtener;
exports.obtenerPorUuid = obtenerPorUuid;
exports.agregar = agregar;
const fs_1 = __importDefault(require("fs"));
// Ruta del archivo DB.Json
const dbFilePath = './DB/UM.json';
function obtener() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = (yield fs_1.default.promises.readFile(dbFilePath)).toString();
            const ultimosMovimientos = JSON.parse(data);
            return ultimosMovimientos;
        }
        catch (error) {
            console.error('Error DAO ultimosMovimientos obtener(): ', error.message);
            return [];
        }
    });
}
function guardar(movimientos) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fs_1.default.promises.writeFile(dbFilePath, JSON.stringify(movimientos, null, '\t'));
        }
        catch (error) {
            console.error('Error DAO ultimosMovimientos guardar(): ', error.message);
            return [];
        }
    });
}
function obtenerPorUuid(uuid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ultimosMovimientos = yield obtener();
            //console.log(maquinas)
            const movimiento = ultimosMovimientos.find(movimiento => movimiento.uuid === uuid);
            if (!movimiento)
                throw new Error(`uuid ${uuid} no relacionado a ningún movimiento`);
            return movimiento;
        }
        catch (error) {
            return { error: error.message };
        }
    });
}
function agregar(movimiento) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ultimosMovimientos = yield obtener();
            ultimosMovimientos.push(movimiento);
            yield guardar(ultimosMovimientos);
        }
        catch (error) {
            return { error: error.message };
        }
    });
}
