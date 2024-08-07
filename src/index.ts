import 'reflect-metadata';
import { container } from "./container";
import TYPES from "./container.types";
import { IServer } from "./interfaces/IServer";

process.on('uncaughtException', function (err) {
    console.log('EXCEPCIÓN:', err.message);
    //process.exit(0);
});

container.get<IServer>(TYPES.IServer).start();

