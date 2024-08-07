import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 443//8080//
const STRCNX = process.env.STRCNX || 'mongodb://127.0.0.1'
const BASE = process.env.BASE || 'test'

export default {
    PORT,
    STRCNX,
    BASE,
}