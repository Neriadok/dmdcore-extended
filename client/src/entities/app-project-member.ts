import { CoreEntity } from "./core-entity";
import { AppUser } from "./app-user";

export interface AppProjectMember extends CoreEntity{
    ProjectId?: number;
    projectRights: number;
    membersRights: number;
    UserId?: number;
    User?: AppUser;
}