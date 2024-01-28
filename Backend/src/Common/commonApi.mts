import fetch from 'node-fetch';
import { HttpException, HttpStatus } from "@nestjs/common";
import { conf } from "../conf.mjs";

const secret = `gkwr500x49l6dbeoof6ke6qjgsru5m00`;


export function makeToken () {
    let text = "";
    const possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 20; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text + Date.now();
}

export async function wait (ms = 1000) {
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(null);
        }, ms);
    });
}

