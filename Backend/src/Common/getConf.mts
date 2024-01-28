process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import path from "path";
import { Conf } from "./newTypes.mjs";
import { createRequire } from 'node:module';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

export async function getConf () : Promise<Conf> {
    const defaultconf = require(`${__dirname}/../../assets/defaultconf.json`);
    console.log(`Trying to get ${defaultconf.configType} config from remote server...`);
    return defaultconf;
};