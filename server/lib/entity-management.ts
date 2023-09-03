import {Model} from "sequelize";
import {Attributes, NonNullFindOptions} from "sequelize/types/model";

export async function setEntity<T>(data: Partial<T>, model, options?: NonNullFindOptions<Attributes<Model<T>>>):  Promise<T> {
    // @ts-ignore
    const instance = (options && await model.findOne(options)) || new model(data);
    await instance.set(data);
    await instance.save();
    return model.findOne({...options, raw: true});
}

export async function getEntity<T>(model: typeof Model<T>, options?: NonNullFindOptions<Attributes<Model<T>>>): Promise<T> {
    // @ts-ignore
    return model.findOne({...options, raw: true});
}