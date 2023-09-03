import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import DbUser from '../entities/db-user';
import config from '../../client/src/env/firebase.json'
import { AppProjectMember } from '../../client/src/entities/app-project-member';
import DbProjectMember from '../entities/db-project-member';
import { Op } from 'sequelize';
import DbProject from '../entities/db-project';
import { getEntity } from './entity-management';
import { AppProject } from '../../client/src/entities/app-project';

export const firebaseApp = initializeApp(config);

export async function getSession(req): Promise<DbUser | undefined> {
    const token = req.headers.token;
    if (!token) return undefined;
    const { uid } = await getAuth(firebaseApp).verifyIdToken(token);
    return DbUser.findOne({ where: { uid } });
}

export async function getCheckedSession(req, res): Promise<DbUser> {
    const session = await getSession(req);
    if (!session) {
        res.status(401).send();
        return;
    }
    return session;
}

export async function getSessionProject(req): Promise<AppProject | undefined> {
    if (!req.headers.project) return undefined;
    return getEntity(DbProject, { where: { id: req.headers.project }, rejectOnEmpty: false });
}

export async function isProjectOwner(req): Promise<boolean> {
    const project = await getSessionProject(req);
    if (!project) return false;
    const session = await getSession(req);
    if (!session) return false;
    return project.OwnerId === session.id;
}

export async function getProjectMembership(req): Promise<AppProjectMember | undefined> {
    const project = await getSessionProject(req);
    if (!project) return undefined;
    const session = await getSession(req);
    if (!session) return undefined;
    if (project.OwnerId === session.id) return undefined;
    return getEntity(DbProjectMember, { where: { [Op.and]: { UserId: session.id, ProjectId: project.id } }, rejectOnEmpty: false });
}

export async function hasProjectRight(req, right: keyof AppProjectMember, level: 0 | 1 | 2 = 1): Promise<boolean> {
    const project = await getSessionProject(req);
    if (!project) return false;
    const session = await getSession(req);
    if (!session) return false;
    if (project.OwnerId === session.id) return true;
    const rights = await DbProjectMember.findOne({ where: { [Op.and]: { UserId: session.id, ProjectId: project.id } } })
    return rights[right] >= level;
}
