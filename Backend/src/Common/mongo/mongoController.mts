import { MongoClient } from 'mongodb';
import { conf } from "../../conf.mjs";
import { HttpException, HttpStatus } from '@nestjs/common';

export async function mongoController(dbname : string) {
    const connectionString = `mongodb://${conf.mongo.host}:${conf.mongo.port}/${dbname}`;
    let lastDB : any = null;
    const connect = async ()=>{
        try {
            const client = await MongoClient.connect(connectionString);
            lastDB = client.db(dbname);
            return lastDB;
        } catch {
            lastDB = null;
            return null;
        }
    }
    return {
        collection : async (collection : string) =>{
            if (!lastDB) await connect();
            if (!lastDB) throw new HttpException('Unable to connect to MongoDB', HttpStatus.BAD_REQUEST);
            if (typeof lastDB.collection !== 'function') {
                lastDB = null;
                await connect();
            }
            return lastDB.collection(collection);
        }

    };
}
