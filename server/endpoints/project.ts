import { CrudEndpoints } from "../interfaces/crud-endpoints";
import { getEntity, setEntity } from "../lib/entity-management";
import { AppProject } from "../../client/src/entities/app-project";
import DbProject from "../entities/db-project";
import { Op } from "sequelize";
import { getCheckedSession, getProjectMembership, hasProjectRight, isProjectOwner } from "../lib/session";

const methods: CrudEndpoints<AppProject> = { create, read, destroy }
export default methods;

async function create(req, res) {
    const previousValues = await DbProject.findOne({ where: { uid: req.body.uid }, raw: true, rejectOnEmpty: false });
    const session = await getCheckedSession(req, res);
    if (previousValues && !await hasProjectRight(req, 'projectRights', 2)) {
        res.status(403).send();
        return;
    }
    // We keep ownership if user is not the owner and project already existed.
    const values = !previousValues || session.id === previousValues.OwnerId ? req.body : { ...req.body, OwnerId: previousValues.OwnerId };
    const entity = await setEntity<AppProject>(values, DbProject, { where: { uid: req.body.uid }, rejectOnEmpty: false });
    res.status(entity ? 200 : 204).send(entity);
}

async function read(req, res) {
    const rights = await getProjectMembership(req)
    if (!rights && !await isProjectOwner(req)) {
        res.status(403).send();
        return;
    }
    const entity = await getEntity<AppProject>(DbProject, {
        where: {
            [Op.or]: {
                uid: req.query?.uid || null,
                id: req.query?.id || null
            }
        },
        rejectOnEmpty: false,
        raw: true
    });

    res.status(entity ? 200 : 404).send({ ...entity, rights });
}

async function destroy(req, res) {
    const entity = await DbProject.findOne({ where: { id: req.headers.project }, rejectOnEmpty: false });
    if (entity) {
        if (!await isProjectOwner(req)) {
            res.status(403).send();
            return;
        }
        entity.destroy();
        res.status(204).send();
    } else {
        res.status(404).send();
    }
}