import { DataTypes, Model } from "sequelize";
import { AppProject } from "../../client/src/entities/app-project";
import { sequelize } from "../lib/database";
import DbUser from "./db-user";

export class DbProject extends Model<AppProject> {
    id: number;
    uid: string;
    name: string;
    OwnerId: number;
}

DbProject.init({
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
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'Project',

    },
    OwnerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    sequelize,
    indexes: [
        { unique: true, fields: ['OwnerId', 'name'] }
    ]
});

DbProject.belongsTo(DbUser, {as: 'Owner', onDelete: 'Cascade'})
export default DbProject;

