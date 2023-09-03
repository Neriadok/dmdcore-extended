import { CoreEntity } from "./core-entity";

export interface AppProjectInvitation extends CoreEntity{
    email: string;
    ProjectId?: number;
    text?: string;
}