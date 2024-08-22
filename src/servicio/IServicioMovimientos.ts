export interface IServicioMovimientos {
    obtenerMovimientos: () => Promise<[]>
    obtenerMovimientoPorUuid: (uuid:string) => Promise<Object>
    agregarMovimiento: (movimiento:any) => Promise<[]>
}
