import { CrudEndpoints } from "../interfaces/crud-endpoints";
import { AppProject } from "../../client/src/entities/app-project";
import { getCheckedSession, getSession } from "../lib/session";
import DbProject from "../entities/db-project";
import { Op, literal } from "sequelize";

const methods: CrudEndpoints<AppProject> = { read }
export default methods;


async function read(req, res) {
    const session = await getCheckedSession(req, res);
    const list = await DbProject.findAndCountAll({
        where:  {[Op.or]:{OwnerId: session.id, id: {[Op.in]: literal(`(SELECT ProjectId FROM DbProjectMembers WHERE userId = ${session.id})`)}}},
        offset: req.query?.offset || undefined,
        limit: req.query?.limit || undefined,

    });
    res.status(200).send(list);
}