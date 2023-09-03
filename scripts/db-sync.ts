import {sql} from "../server/lib/database";
import {resolve} from "path";

sql(syncModels);

async function syncModels() {
    const models = [
        'user',
        'project',
        'project-invitation',
        'project-member'
    ];
    // This must be done with a for as execution sequence is relevant, avoiding the posibility of using a Promise.all(map)
    for(let i = 0; i < models.length; i++){
        await syncModel(models[i]);
    }
}

async function syncModel(entity: string) {
    const path = resolve(__dirname, `../server/entities/db-${entity}.ts`).replace(/\\/gi,'/');
    console.log('Syncing ', path);
    const model = require(path).default;
    await model.sync({ alter: true });
}