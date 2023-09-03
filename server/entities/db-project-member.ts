import { DataTypes, Model } from "sequelize";
import { AppProjectMember } from "../../client/src/entities/app-project-member";
import { sequelize } from "../lib/database";
import DbProject from "./db-project";
import DbUser from "./db-user";

export class DbProjectMember extends Model<AppProjectMember> {
    id: number;
    UserId?: number;
    projectRights: number;
    membersRights: number;
}

DbProjectMember.init({
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
    membersRights: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    projectRights: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
}, {
    sequelize,
    indexes: [
        { unique: true, fields: ['UserId', 'ProjectId'] }
    ]
});
DbProjectMember.belongsTo(DbProject, { as: 'Project', onDelete: 'Cascade' });
DbProjectMember.belongsTo(DbUser, { as: 'User', onDelete: 'Cascade' });
export default DbProjectMember;

