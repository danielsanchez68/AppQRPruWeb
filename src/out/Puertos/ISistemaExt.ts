export interface ISistemaExt {
    send(datos:any, receive:any):void,
    get(receive:any):void,
    asociar(datos:any, receive:any):void
    filtrar(datos:any, receive:any):void
}
