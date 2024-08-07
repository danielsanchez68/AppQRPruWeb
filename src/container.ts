import { Container } from 'inversify';
import TYPES from './container.types';

import UI_HTTP, { Controlador, IControlador } from './ui/UI_HTTP';

import Servicio from './servicio/maquina';

import ModelMongoDB from './DAO/productos/productosMongoDB';
import ModelFile from './DAO/productos/productosFile';
import ModelMem from './DAO/productos/productosMem';

import Server from './server';
import SistemaExt from './servicio/sistemaExt';

//interfaces
import { IUI } from './interfaces/IUI';
import { IServicioMaquina } from './interfaces/IServicioMaquina';
import { ISistemaExt } from './interfaces/ISistemaExt';
import { IDAOProductos } from './DAO/productos/IDAOProductos';
import { IServer } from './interfaces/IServer';


export const container = new Container();

container.bind<IUI>(TYPES.IUI).to(UI_HTTP);
container.bind<IControlador>(TYPES.IControlador).to(Controlador);

container.bind<IServicioMaquina>(TYPES.IServicioMaquina).to(Servicio);
container.bind<ISistemaExt>(TYPES.ISistemaExt).to(SistemaExt);

//container.bind<IDAOProductos>(TYPES.IDAOProductos).to(ModelMem);
//container.bind<IDAOProductos>(TYPES.IDAOProductos).to(ModelFile);
container.bind<IDAOProductos>(TYPES.IDAOProductos).to(ModelMongoDB);

container.bind<IServer>(TYPES.IServer).to(Server);
