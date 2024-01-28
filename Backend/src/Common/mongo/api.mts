import { mongoController } from "./mongoController.mjs";

const mongo = await mongoController("archive");

export async function archiveItem (item : any) {
    const c = await mongo.collection('item');
    await c.findOneAndUpdate({ itemId: item.id }, { $set: item }, { upsert: true });
    return null;
}