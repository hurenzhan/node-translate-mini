type ParamsType = {
    appid: string
    salt: number
    from: string
    to: string
}

const appid = ''
export const secret = ''
const salt = new Date().getTime()

export default {
    appid,
    salt,
    from: 'auto',
    to: 'auto'
} as ParamsType