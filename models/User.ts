import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

const User = sequelize.define(
    "User",
    {

        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        info: {
            type: DataTypes.JSONB,
            allowNull: false,
        },
        signedwith: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,   
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

    },
    {
    tableName: "users",
    timestamps: false,
  }
);

export default User;