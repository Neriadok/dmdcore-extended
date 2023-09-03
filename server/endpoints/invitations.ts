import { CrudEndpoints } from "../interfaces/crud-endpoints";
import { getEntity, setEntity } from "../lib/entity-management";
import DbProjectInvitation from "../entities/db-project-invitation";
import { getEmailTemplate, sendEmail } from "../lib/email";
import smtp from "../env/smtp.json";
import { AppProjectInvitation } from "../../client/src/entities/app-project-invitation";
import { AppProjectMember } from "../../client/src/entities/app-project-member";
import { t } from "i18next";
import { AppProject } from "../../client/src/entities/app-project";
import DbProject from "../entities/db-project";
import { AppUser } from "../../client/src/entities/app-user";
import DbUser from "../entities/db-user";
import DbProjectMember from "../entities/db-project-member";
import { hasProjectRight } from "../lib/session";

const methods: CrudEndpoints<AppProjectInvitation> = { create, read, destroy }
export default methods;

async function create(req, res) {
    if(!await hasProjectRight(req, 'membersRights', 2)){
        res.status(403).send();
        return;
    } 
    const body: Partial<AppProjectInvitation> = req.body;
    const project = await getEntity<AppProject>(DbProject, { where: { id: body.ProjectId }, rejectOnEmpty: false });
    const user = await getEntity<AppUser>(DbUser, { where: { email: body.email }, rejectOnEmpty: false});
    let entity: AppProjectInvitation;
    if (user) {
        const member: Partial<AppProjectMember> = { uid: body.uid, UserId: user.id, ProjectId: body.ProjectId }
        await setEntity<AppProjectMember>(member, DbProjectMember, { where: { uid: body.uid }, rejectOnEmpty: false });
    } else {
        entity = await setEntity<AppProjectInvitation>(body, DbProjectInvitation, { where: { uid: body.uid }, rejectOnEmpty: false });
    }
    await sendEmail({
        from: smtp.auth.user,
        to: body.email,
        subject: t('invitation.mail.subject'),
        html: getEmailTemplate(
            t('invitation.mail.subject'),
            t('invitation.mail.body', project),
            `${require('../env/host.json').url}project/${body.ProjectId}`,
            t('invitation.mail.cta', project)
        )
    });
    res.status(entity ? 200 : 204).send(entity);
}

async function read(req, res) {
    
    if(!await hasProjectRight(req, 'membersRights')){
        res.status(403).send();
        return;
    }
    const entities = await DbProjectInvitation.findAndCountAll({
        where: {
            ProjectId: req.headers?.project || null,
        },
        offset: req.query?.offset || undefined,
        limit: req.query?.limit || undefined,
        raw: true
    });
    res.status(entities.count ? 200 : 204).send(entities);
}

async function destroy(req, res) {
    if(!await hasProjectRight(req, 'membersRights', 2)){
        res.status(403).send();
        return;
    } 
    const entity = await DbProjectInvitation.findOne({ where: { uid: req.query?.uid }, rejectOnEmpty: false });
    if (entity) {
        entity.destroy();
        res.status(204).send();
    } else {
        res.status(404).send();
    }
}