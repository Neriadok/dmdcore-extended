import { DataTypes, Model } from "sequelize";
import { AppProjectInvitation } from "../../client/src/entities/app-project-invitation";
import { sequelize } from "../lib/database";
import DbProject from "./db-project";
import DbUser from "./db-user";

export class DbProjectInvitation extends Model<AppProjectInvitation> {
    id: number;
    uid: string;
    projectRights: number;
    membersRights: number;
}

DbProjectInvitation.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    uid: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    text: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    indexes: [
        { unique: true, fields: ['email', 'ProjectId'] }
    ]
});
DbProjectInvitation.belongsTo(DbProject, {as: 'Project', onDelete: 'Cascade'});
export default DbProjectInvitation;

