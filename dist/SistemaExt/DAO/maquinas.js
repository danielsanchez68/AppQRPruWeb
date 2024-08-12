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
exports.obtenerPorCodigo = obtenerPorCodigo;
exports.relacionarCodigo = relacionarCodigo;
const fs_1 = __importDefault(require("fs"));
// Ruta del archivo DB.Json
const dbFilePath = './DB.json';
function obtener() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = (yield fs_1.default.promises.readFile(dbFilePath)).toString();
            const maquinas = JSON.parse(data);
            return maquinas;
        }
        catch (error) {
            console.error('Error DAO Maquinas obtener(): ', error.message);
            return [];
        }
    });
}
function guardar(maquinas) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fs_1.default.promises.writeFile(dbFilePath, JSON.stringify(maquinas, null, '\t'));
        }
        catch (error) {
            console.error('Error DAO Maquinas guardar(): ', error.message);
            return [];
        }
    });
}
function obtenerPorCodigo(codigo) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const maquinas = yield obtener();
            //console.log(maquinas)
            const maquina = maquinas.find(maquina => maquina.codigo === codigo);
            if (!maquina)
                throw new Error(`código ${codigo} no relacionado a ninguna máquina`);
            return maquina;
        }
        catch (error) {
            return { error: error.message };
        }
    });
}
function relacionarCodigo(codigo, uuid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const maquinas = yield obtener();
            const maquina = maquinas.find(maquina => maquina.uuid === uuid);
            if (!maquina.codigo) {
                maquina.codigo = codigo;
                yield guardar(maquinas);
                const maquinasActualizada = yield obtener();
                return maquinasActualizada;
            }
            else
                throw new Error(`máquina ${uuid} ya relacionada con el código ${maquina.codigo}`);
        }
        catch (error) {
            return { error: error.message };
        }
    });
}
