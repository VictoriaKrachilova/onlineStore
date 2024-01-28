
import { createClient } from 'redis';

const redisClient = createClient({
    socket: {
        connectTimeout: 10000,
        reconnectStrategy: (retries) => {
            console.log(`retry ${retries}`);
            return Math.min(retries * 50, 500);
        },
    },
});
redisClient.connect();
redisClient.configSet("notify-keyspace-events", "Ex");

function convertToString (data : any) {
    const dataType = typeof data;
    if (dataType === 'string') return data;
    if (dataType === 'object') return JSON.stringify(data);
    return data.toString();
}

export async function redisSetEx (key : string, data : any, ttl = 24 * 60 * 60) {
    data = convertToString(data);
    return redisClient.setEx(key, ttl, data);
}
export async function redisDelete (key : string) {
    return redisClient.del(key);
}
export async function redisGet (key : string) {
    const data = await redisClient.get(key);
    if (!data) return null;
    try {
        return JSON.parse(data);
    } catch {
        return data;
    }
}