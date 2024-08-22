import { Container } from 'inversify';
import TYPES from './container.types';

import Server from './server';

import UI_HTTP, { 
    ControladorMaq, IControladorMaq,
    ControladorMov, IControladorMov 
} from './in/Adaptadores/UI_HTTP';

import ServicioMaq from './servicio/maquina';
import ServicioMov from './servicio/movimientos';

import SistemaExt from './out/Adaptadores/sistemaExt';

//interfaces
import { IUI } from './in/Puertos/IUI';
import { IServicioMaquina } from './servicio/IServicioMaquina';
import { ISistemaExt } from './out/Puertos/ISistemaExt';
import { IServer } from './IServer';
import { IServicioMovimientos } from './servicio/IServicioMovimientos';


export const container = new Container();

container.bind<IUI>(TYPES.IUI).to(UI_HTTP);
container.bind<IControladorMaq>(TYPES.IControladorMaq).to(ControladorMaq);
container.bind<IControladorMov>(TYPES.IControladorMov).to(ControladorMov);

container.bind<IServicioMaquina>(TYPES.IServicioMaquina).to(ServicioMaq);
container.bind<IServicioMovimientos>(TYPES.IServicioMovimientos).to(ServicioMov);

container.bind<ISistemaExt>(TYPES.ISistemaExt).to(SistemaExt).inSingletonScope();

container.bind<IServer>(TYPES.IServer).to(Server);
