import { IconDefinition, faFileLines, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import { AppProjectMember } from "../entities/app-project-member";
import { projectSubject } from "./session";

export interface AppMenuItem {
    path: () => string;
    icon: IconDefinition;
    right?: keyof AppProjectMember
};

export const appMenuItems: AppMenuItem[] = [
    {icon: faFileLines, path: () => `/project/${projectSubject.value?.id}`},
    {icon: faPeopleGroup, path: () => `/project/${projectSubject.value?.id}/members`, right: 'membersRights'}
]