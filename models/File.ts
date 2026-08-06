import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

const File = sequelize.define(
    "File",
    {
        file_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        file_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        file_url: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        tableName: "files",
        timestamps: false,
    }
);

export default File;