export interface IServicioMaquina {
    enviarCodigoMaquina: (codigo:string) => Promise<Object>
    getListadoMaquinas: () => Promise<[]>
    asociarMaquina: (codigo:string) => Promise<Object>
    filtrarMaquina: (uuidParcial:string) => Promise<Object>
}