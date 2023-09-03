import { CoreEntity } from "./core-entity";

export interface AppUser  extends CoreEntity{
    name: string;
    email: string;
}