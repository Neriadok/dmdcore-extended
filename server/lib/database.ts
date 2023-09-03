import { Sequelize } from "sequelize";
import conf from "../env/database.json"

export const sequelize = new Sequelize(conf.database, conf.username, conf.password, {
    host: conf.host,
    dialect: 'mysql'
});

export async function sql(callback: () => Promise<any>){
    try{
        await connect();
        await callback();
        await disconnect();
    } catch (e) {
        console.warn(e)
    }
}

async function connect(){
    try {
        await sequelize.authenticate();
        console.log('Connection has been established.');
    } catch (error) {
        console.error('Unable to connect to database:', error);
    }
}

async function disconnect(){
    try {
        await sequelize.close();
        console.log('Connection has been closed.');
    } catch (error) {
        console.error('Unable to disconnect from database:', error);
    }
}