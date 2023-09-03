import { getAuth } from "firebase/auth";
import { BehaviorSubject } from "rxjs";
import { AppProject } from "../entities/app-project";
import { AppUser } from "../entities/app-user";
import { firebaseApp } from "./firebase";
import { snackbarAlertSubject } from "./snackbar-alert";
import { t } from "i18next";
import { toPromise } from "../lib/async-utils";
import { AppProjectMember } from "../entities/app-project-member";

export const sessionReadySubject = new BehaviorSubject<boolean>(false);
export const userSubject = new BehaviorSubject<AppUser | undefined>(undefined);
export const projectSubject = new BehaviorSubject<AppProject | undefined>(undefined);
export const auth = getAuth(firebaseApp);

export async function loadProject(projectId: any, navigate: Function, setCurrentProject: Function) {
    const project = await loadSessionProject(projectId, true);
    if (project) setCurrentProject(project);
    else navigate('/');
}

export async function getSessionHeaders(): Promise<HeadersInit> {
    return {
        token: (await auth.currentUser?.getIdToken()) || '',
        project: `${projectSubject.value?.id}`
    }
}

export async function sessionReady(): Promise<void> {
    if(!sessionReadySubject.value){
        await toPromise(sessionReadySubject, 1)
    }
}

export function iAmProjectOwner(): boolean {
    return projectSubject.value?.OwnerId === userSubject.value?.id;}

export function hasProjectRight(right: keyof AppProjectMember, level: 0 | 1 | 2 = 1): boolean {
    const projectRights: any = projectSubject.value?.rights || {};
    return iAmProjectOwner() || (parseInt(projectRights[right]) || 0) >= level;
}

async function loadSessionProject(ProjectId: string, force?: boolean): Promise<AppProject | undefined>{
    if(!force && parseInt(ProjectId) === projectSubject.value?.id) return projectSubject.value;
    await sessionReady();
    const response = await fetch(`/api/project?id=${ProjectId}`, {
        headers: {
            "Content-Type": "application/json",
            token: (await auth.currentUser?.getIdToken()) || '',
            project: ProjectId
        }
    });
    if (response.status >= 300) {
        snackbarAlertSubject.next({severity: 'error', text: t(`server.error${response.status}`)})
    } else {
        const project = await response.json();
        projectSubject.next(project);
        return project;
    }
}