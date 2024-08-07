import { inject, injectable } from "inversify"
import { IUI } from "./interfaces/IUI"
import TYPES from "./container.types"
import { IServer } from "./interfaces/IServer"

@injectable()
class Server implements IServer {
    constructor(@inject(TYPES.IUI) private ui: IUI) {}

    start() {
        this.ui.start()
    }
}

export default Server