export interface IServicioMaquina {
    enviarCodigoMaquina: (codigo:string) => Promise<Object>,
}