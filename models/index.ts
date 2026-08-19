import User from "./User";
import Newsletter from "./Newsletter";
import File from "./File";
import Notification from "./Notification";

// Newsletter -> File
Newsletter.belongsTo(File, {
  foreignKey: "file_id",
});

File.hasMany(Newsletter, {
  foreignKey: "file_id",
});

// Newsletter -> User (submitted_by)
Newsletter.belongsTo(User, {
  foreignKey: "submitted_by",
  as: "SubmittedBy",
});

// Newsletter -> User (approved_by)
Newsletter.belongsTo(User, {
  foreignKey: "approved_by",
  as: "ApprovedBy",
});

//Notification ->User

User.hasMany(Notification, { foreignKey: "userId", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "userId", as: "user" });

export {
  User,
  File,
  Newsletter,
  Notification,
};