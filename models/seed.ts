import crypto from "crypto";
import User from "./User";

export async function seedDatabase() {
  const admin = await User.findOne({
    where: {
      email: process.env.ADMIN_EMAIL,
    },
  });

  if (admin) {
    console.log("✅ Admin already exists");
    return;
  }

  await User.create({
    id: crypto.randomUUID(),
    name: "Admin",
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASS,
    isAdmin: true,
    info: {},
    signedwith: "email",
    isVerified: true,
    isActive: true,
  });

  console.log("✅ Admin created");
}