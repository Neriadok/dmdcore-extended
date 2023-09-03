import { CoreEntity } from "./core-entity";
import { AppProjectMember } from "./app-project-member";

export interface AppProject extends CoreEntity {
    OwnerId?: number;
    name: string;
    sinthesys?: string;
    porpourse?: string;
    targetPublic?: string;
    expectedResult?: string;
    keyPerformanceIndicator?: string;
    rights?: AppProjectMember;
}