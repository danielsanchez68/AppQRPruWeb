import Color from "./util/coloring"


class TimeOut {
    private imeisLive:any

    constructor() {
        this.imeisLive = {}
        setInterval(() => {
            Object.keys(this.imeisLive).forEach((imei) => {
                if((Date.now() - this.imeisLive[imei].to) > 10000) {
                    const idSesion = this.imeisLive[imei]?.idsesion
                    console.log(
                        Color.colorString(Color.BgRed,'TimeOut'), 
                        Color.colorString(this.getColorSesion(idSesion), `imei[${imei}] IdSesion[${idSesion}]`)
                    )
                    delete this.imeisLive[imei]
                }
            })
        },1000)
    }

    setLive = (imei:string, idsesion:string) => {
        if(imei) {
            if(!Object.keys(this.imeisLive).includes(imei)) {
                this.imeisLive[imei] = {}
                this.imeisLive[imei].color = Color.index(+imei % Color.colors.length) // Color.random()
                this.imeisLive[imei].idsesion = idsesion
                this.imeisLive[imei].to = Date.now()
            }
        }
        else if(idsesion) {
            for(let im in this.imeisLive) {
                if(this.imeisLive[im].idsesion == idsesion) this.imeisLive[im].to = Date.now()
            }
        }
    }
    getLives = () => this.imeisLive
    getColorSesion = (idsesion:string) => {
        let color = Color.FgWhite
        for(let im in this.imeisLive) {
            if(this.imeisLive[im].idsesion == idsesion) color = this.imeisLive[im]?.color || Color.FgWhite
        }
        return color
    }
    sesionExists = (imei:string) => this.imeisLive[imei]?.idsesion || false
    getImeiSesion = (idsesion:string) => {
        if(!idsesion) return ''
        for(let im in this.imeisLive) {
            if(this.imeisLive[im].idsesion == idsesion) return im
        }
        return ''
    }
}

export default TimeOut
