import { CrudEndpoints } from "../interfaces/crud-endpoints";
import { getEntity, setEntity } from "../lib/entity-management";
import { AppUser } from "../../client/src/entities/app-user";
import DbUser from "../entities/db-user";
import { getAuth } from "firebase-admin/auth";
import { firebaseApp } from "../lib/session";
import DbProjectInvitation from "../entities/db-project-invitation";
import { AppProjectMember } from "../../client/src/entities/app-project-member";
import DbProjectMember from "../entities/db-project-member";
import { v4 } from 'uuid'
import { AppProjectInvitation } from "../../client/src/entities/app-project-invitation";

const methods: CrudEndpoints<AppUser> = { create, read }
export default methods;

async function create({ body, headers }, res) {
    const { uid } = await getAuth(firebaseApp).verifyIdToken(headers.token);
    if (body.uid !== uid) res.status(403).send();
    const entity = await setEntity<AppUser>(body, DbUser, { where: { uid: body.uid }, rejectOnEmpty: false });
    await acceptPendingInvitations(entity);
    res.status(entity ? 200 : 204).send(entity);
}

async function read({ query, headers }, res) {
    const { uid } = await getAuth(firebaseApp).verifyIdToken(headers.token);
    if (query?.uid !== uid) res.status(403).send();
    const entity = await getEntity<AppUser>(DbUser, { where: { uid: query?.uid }, rejectOnEmpty: false });
    res.status(entity ? 200 : 204).send(entity);
}

async function acceptPendingInvitations(user: AppUser) {
    const invitations: any = await DbProjectInvitation.findAll({ where: { email: user.email }, raw: true });
    await Promise.all(invitations.map((invitation) => toMember(invitation, user)));
}

async function toMember(invitation: AppProjectInvitation, user: AppUser) {
    const uid = v4();
    const member: Partial<AppProjectMember> = { uid, UserId: user.id, ProjectId: invitation.ProjectId };
    await setEntity<AppProjectMember>(member, DbProjectMember, { where: { uid }, rejectOnEmpty: false });
    await DbProjectInvitation.destroy({where: {uid: invitation.uid}});
}

