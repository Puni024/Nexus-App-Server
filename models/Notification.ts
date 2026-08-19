import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export type NotificationType =
    | "newsletter_submitted"
    | "newsletter_approved"
    | "newsletter_rejected"
    | "newsletter_published";

const Notification = sequelize.define(
    "Notification",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "user_id",
        },
        type: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        entityType: {
            type: DataTypes.STRING(50),
            allowNull: true,
            field: "entity_type",
        },
        entityId: {
            // newsletter_id (and userId) are STRING primary keys in this
            // schema, so this must be STRING too — was INTEGER before.
            type: DataTypes.STRING,
            allowNull: true,
            field: "entity_id",
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: "is_read",
        },
    },
    {
        tableName: "notifications",
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ["user_id", "is_read"] },
            { fields: ["user_id", "created_at"] },
        ],
    }
);

export default Notification;