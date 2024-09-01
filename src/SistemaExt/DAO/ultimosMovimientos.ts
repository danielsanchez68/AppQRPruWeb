import fs from 'fs';

// Ruta del archivo DB.Json
const dbFilePath = './DB/UM.json';

export async function obtener() {
    try {
        const data = (await fs.promises.readFile(dbFilePath)).toString();
        const ultimosMovimientos = JSON.parse(data);
        return ultimosMovimientos
    } catch (error:any) {
        console.error('Error DAO ultimosMovimientos obtener(): ', error.message);
        return [];
    }
}

async function guardar(movimientos) {
    try {
        await fs.promises.writeFile(dbFilePath, JSON.stringify(movimientos,null,'\t'))
    } catch (error:any) {
        console.error('Error DAO ultimosMovimientos guardar(): ', error.message);
        return [];
    }
}

export async function obtenerPorUuid(uuid) {
    try {
        const ultimosMovimientos = await obtener()
        //console.log(maquinas)
        const movimiento = ultimosMovimientos.find(movimiento => movimiento.uuid === uuid);
        if(!movimiento) throw new Error(`uuid ${uuid} no relacionado a ningún movimiento`)
        return movimiento;
    } catch (error:any) {
        return { error: error.message };
    }
}

export async function agregar(movimiento:any) {
    try {
        const ultimosMovimientos = await obtener()
        ultimosMovimientos.push(movimiento)
        await guardar(ultimosMovimientos)
    } catch (error:any) {
        return { error: error.message };
    }
}
