import defaultParams, {secret} from "./defaultParams";
import md5 from "md5";
import * as querystring from "querystring";
import * as https from "https";

type ErrorMapType = {
    [key: string]: string
}
const errorMap: ErrorMapType = {
    52003: '用户认证失败',
    54001: '签名错误',
    54004: '账户余额不足',
};

type ResultType = {
    error_code?: string;
    error_msg?: string;
    from: string;
    to: string;
    trans_result: { src: string; dst: string; }[]
}

export const translate = (word: string) => {
    const sign = md5(`${defaultParams.appid}${word}${defaultParams.salt}${secret}`);
    const query: string = querystring.stringify({
        ...defaultParams,
        q: word,
        sign
    })
    const options = {
        hostname: 'fanyi-api.baidu.com',
        path: `/api/trans/vip/translate?${query}`,
        mthod: 'GET'
    };

    const request = https.request(options, (response) => {
        let chunks: Buffer[] = [];
        response.on('data', (chunk) => {
            chunks.push(chunk);
        });
        response.on('end', () => {
            const string = Buffer.concat(chunks).toString();
            const object: ResultType = JSON.parse(string)
            const {error_code, error_msg, trans_result} = object || {}
            if (error_code) {
                console.error(errorMap[error_code] || error_msg)
                process.exit(1);
            } else {
                trans_result?.map(obj => {
                    console.log(obj.dst)
                })
                process.exit(0)
            }
        })

    })

    request.on('error', (e) => {
        console.error(e);
    });

    request.end();
};