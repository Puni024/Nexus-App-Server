import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import User from "./User";
import File from "./File";

const Newsletter = sequelize.define(
  "Newsletter",
  {
    newsletter_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    file_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: File,
        key: "file_id",
      },
    },

    submitted_by: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },

    status: {
      type: DataTypes.ENUM(
        "PENDING",
        "APPROVED",
        "REJECTED"
      ),
      defaultValue: "PENDING",
    },

    approved_by: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },

    uploaded_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    is_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

  },
  {
    tableName: "newsletters",
    timestamps: false,
  }
);

export default Newsletter;