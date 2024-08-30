"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cmd = {
    Login: {
        tx: {
            Comando: "Login",
            Dispositivo: "",
            Ip: "",
            EMEI: ""
        },
        rx: {
            Comando: "RtaLogin",
            Operador: "Pedro Perez",
            Tarjeta: 1234567890,
            ImporteMin: 1000,
            ImporteMax: 200000,
            ImporteManual: true,
            Importes: [1000, 2000, 10000],
            Error: 0,
            ErrorDesc: ""
        }
    },
    Vivo: {
        tx: {
            Comando: "Vivo",
        },
        rx: {
            Comando: "RtaVivo",
            TurnoAbierto: true,
            TurnoEstado: "Amarillo", // Verde, Amarillo, Rojo
            IdOperacionPendiente: "",
            Error: 0,
            ErrorDesc: ""
        }
    },
    ConsultaTerminal: {
        tx: {
            Comando: "ConsultaTerminal",
            QR: ""
        },
        rx: {
            Comando: "RtaConsultaTerminal",
            Fabricante: "",
            Juego: "",
            UID: "",
            Error: 0,
            ErrorDesc: ""
        }
    },
    Operacion_SubirDinero: {
        tx: {
            Comando: "Operacion_SubirDinero",
            QR: "",
            Importe: 10000.15,
        },
        rx: {
            Comando: "RtaOperacion_SubirDinero",
            IdOperacion: "",
            Error: 0,
            ErrorDesc: ""
        }
    },
    ConsultaOperacion: {
        tx: {
            Comando: "ConsultaOperacion",
            IdOperacion: "",
        },
        rx: {
            Comando: "RtaConsultaOperacion",
            IdOperacion: "",
            Error: 0,
            ErrorDesc: ""
        }
    },
    UltimosMovimientos: {
        tx: {
            Comando: "UltimosMovimientos",
        },
        rx: {
            Comando: "RtaUltimosMovimientos",
            Movimientos: [{
                    Fabricante: "",
                    Juego: "",
                    UID: "",
                    Importe: "",
                    FechaHora: ""
                },
                {
                    Fabricante: "",
                    Juego: "",
                    UID: "",
                    Importe: "",
                    FechaHora: ""
                }],
            Error: 0,
            ErrorDesc: ""
        }
    },
    ListaUID: {
        tx: {
            Comando: "ListaUID",
            UID: "" //4 caracters o mas
        },
        rx: {
            Comando: "RtaListaUID",
            Terminales: [{
                    Fabricante: "",
                    Juego: "",
                    UID: "",
                    Vinculada: false
                },
                {
                    Fabricante: "",
                    Juego: "",
                    UID: "",
                    Vinculada: false
                }],
            Error: 0,
            ErrorDesc: ""
        }
    },
    VinculaTerminal: {
        tx: {
            Comando: "VinculaTerminal",
            QR: "",
            UID: ""
        },
        rx: {
            Comando: "RtaVinculaTerminal",
            Fabricante: "",
            Juego: "",
            UID: "",
            Error: 0,
            ErrorDesc: ""
        }
    }
};
exports.default = cmd;
