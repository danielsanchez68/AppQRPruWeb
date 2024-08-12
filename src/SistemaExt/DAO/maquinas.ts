import fs from 'fs';

// Ruta del archivo DB.Json
const dbFilePath = './DB.json';

export async function obtener() {
    try {
        const data = (await fs.promises.readFile(dbFilePath)).toString();
        const maquinas = JSON.parse(data);
        return maquinas
    } catch (error:any) {
        console.error('Error DAO Maquinas obtener(): ', error.message);
        return [];
    }
}

async function guardar(maquinas) {
    try {
        await fs.promises.writeFile(dbFilePath, JSON.stringify(maquinas,null,'\t'))
    } catch (error:any) {
        console.error('Error DAO Maquinas guardar(): ', error.message);
        return [];
    }
}

export async function obtenerPorCodigo(codigo) {
    try {
        const maquinas = await obtener()
        //console.log(maquinas)
        const maquina = maquinas.find(maquina => maquina.codigo === codigo);
        if(!maquina) throw new Error(`código ${codigo} no relacionado a ninguna máquina`)
        return maquina;
    } catch (error:any) {
        return { error: error.message };
    }
}

export async function relacionarCodigo(codigo, uuid) {
    try {
        const maquinas = await obtener()
        const maquina = maquinas.find(maquina => maquina.uuid === uuid);
        if(!maquina.codigo) {
            maquina.codigo = codigo
            await guardar(maquinas)
            const maquinasActualizada = await obtener()
            return maquinasActualizada
        }
        else throw new Error(`máquina ${uuid} ya relacionada con el código ${maquina.codigo}`)
    } catch (error:any) {
        return { error: error.message };
    }
}
