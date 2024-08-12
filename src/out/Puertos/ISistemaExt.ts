export interface ISistemaExt {
    send(datos:any, receive:any):void,
    get(receive:any):void,
    asociar(datos:any, receive:any):void
}
