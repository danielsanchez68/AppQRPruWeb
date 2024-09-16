"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const coloring_1 = __importDefault(require("./util/coloring"));
class TimeOut {
    constructor() {
        this.setLive = (imei, idsesion) => {
            if (imei) {
                if (!Object.keys(this.imeisLive).includes(imei)) {
                    this.imeisLive[imei] = {};
                    this.imeisLive[imei].color = coloring_1.default.index(+imei % coloring_1.default.colors.length); // Color.random()
                    this.imeisLive[imei].idsesion = idsesion;
                    this.imeisLive[imei].to = Date.now();
                }
            }
            else if (idsesion) {
                for (let im in this.imeisLive) {
                    if (this.imeisLive[im].idsesion == idsesion)
                        this.imeisLive[im].to = Date.now();
                }
            }
        };
        this.getLives = () => this.imeisLive;
        this.getColorSesion = (idsesion) => {
            var _a;
            let color = coloring_1.default.FgWhite;
            for (let im in this.imeisLive) {
                if (this.imeisLive[im].idsesion == idsesion)
                    color = ((_a = this.imeisLive[im]) === null || _a === void 0 ? void 0 : _a.color) || coloring_1.default.FgWhite;
            }
            return color;
        };
        this.sesionExists = (imei) => { var _a; return ((_a = this.imeisLive[imei]) === null || _a === void 0 ? void 0 : _a.idsesion) || false; };
        this.getImeiSesion = (idsesion) => {
            if (!idsesion)
                return '';
            for (let im in this.imeisLive) {
                if (this.imeisLive[im].idsesion == idsesion)
                    return im;
            }
            return '';
        };
        this.imeisLive = {};
        setInterval(() => {
            Object.keys(this.imeisLive).forEach((imei) => {
                var _a;
                if ((Date.now() - this.imeisLive[imei].to) > 10000) {
                    const idSesion = (_a = this.imeisLive[imei]) === null || _a === void 0 ? void 0 : _a.idsesion;
                    console.log(coloring_1.default.colorString(coloring_1.default.BgRed, 'TimeOut'), coloring_1.default.colorString(this.getColorSesion(idSesion), `imei[${imei}] IdSesion[${idSesion}]`));
                    delete this.imeisLive[imei];
                }
            });
        }, 1000);
    }
}
exports.default = TimeOut;
