import { Container } from 'inversify';
import TYPES from './container.types';

import UI_HTTP, { Controlador, IControlador } from './in/Adaptadores/UI_HTTP';

import Servicio from './servicio/maquina';

import Server from './server';
import SistemaExt from './out/Adaptadores/sistemaExt';

//interfaces
import { IUI } from './in/Puertos/IUI';
import { IServicioMaquina } from './servicio/IServicioMaquina';
import { ISistemaExt } from './out/Puertos/ISistemaExt';
import { IServer } from './IServer';


export const container = new Container();

container.bind<IUI>(TYPES.IUI).to(UI_HTTP);
container.bind<IControlador>(TYPES.IControlador).to(Controlador);

container.bind<IServicioMaquina>(TYPES.IServicioMaquina).to(Servicio);
container.bind<ISistemaExt>(TYPES.ISistemaExt).to(SistemaExt);

container.bind<IServer>(TYPES.IServer).to(Server);
