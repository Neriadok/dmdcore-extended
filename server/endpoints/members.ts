import { CrudEndpoints } from "../interfaces/crud-endpoints";
import { setEntity } from "../lib/entity-management";
import { AppProjectMember } from "../../client/src/entities/app-project-member";
import DbProjectMember from "../entities/db-project-member";
import { getSession, hasProjectRight } from "../lib/session";

const methods: CrudEndpoints<AppProjectMember> = { read, destroy, update }
export default methods;

async function read(req, res) {
    if (!await hasProjectRight(req, 'membersRights')) {
        res.status(403).send();
        return;
    }
    const entities = await DbProjectMember.findAndCountAll({
        where: { ProjectId: req.headers?.project || null, },
        offset: req.query?.offset || undefined,
        limit: req.query?.limit || undefined,
        include: ['User']
    });
    res.status(entities.count ? 200 : 204).send(entities);
}

async function update(req, res) {
    if (!await hasProjectRight(req, 'membersRights', 2)) {
        res.status(403).send();
        return;
    }
    const body = req.body;
    const entity = await setEntity<AppProjectMember>(body, DbProjectMember, { where: { uid: body.uid }, rejectOnEmpty: true })
    res.status(200).send(entity);
}

async function destroy(req, res) {
    const session = await getSession(req);
    const entity = await DbProjectMember.findOne({ where: { uid: req.query?.uid }, rejectOnEmpty: false });
    if (entity && (entity.UserId === session.id || await hasProjectRight(req, 'membersRights', 2))) {
        entity.destroy();
        res.status(204).send();
    } else if(!entity) {
        res.status(404).send();
    } else {
        res.status(403).send({entity, session})
    }
}