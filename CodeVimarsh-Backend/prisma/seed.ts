// prisma/seed.ts
// Run: npx prisma db seed
//      (tsx is used automatically via prisma.config.ts migrations.seed)
//
// IDEMPOTENT — safe to run multiple times.

import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts"; // ← .ts is correct here

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 12;

// ── Users ─────────────────────────────────────────────────────────────────────
const usersData = [
  {
    prn: "8022003911",
    name: "Humpy Koneru",
    email: "humpy@gmail.com",
    password: "DevPass@123",
    role: "SUPER_ADMIN",
    xp: 1500,
    level: 15,
    is_verified: true,
  },
  {
    prn: "8022003912",
    name: "Divya Deshmukh",
    email: "divya@gmail.com",
    password: "DevPass@123",
    role: "CONTENT_ADMIN",
    xp: 1100,
    level: 11,
    is_verified: true,
  },
];

// ── Admin permission sets ─────────────────────────────────────────────────────
const adminPermissions: Record<string, {
  can_manage_events: boolean;
  can_manage_projects: boolean;
  can_manage_blogs: boolean;
  can_manage_resources: boolean;
  can_manage_users: boolean;
  can_manage_achievements: boolean;
}> = {
  "8022003911": {
    can_manage_events: true,
    can_manage_projects: true,
    can_manage_blogs: true,
    can_manage_resources: true,
    can_manage_users: true,
    can_manage_achievements: true,
  },
  "8022003912": {
    can_manage_events: true,
    can_manage_projects: true,
    can_manage_blogs: true,
    can_manage_resources: true,
    can_manage_users: false,
    can_manage_achievements: true,
  },
};

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🌱  Starting seed...\n");

  // Step 1: Users
  console.log("👤  Seeding users...");
  const createdUsers: Record<string, { id: string; name: string; prn: string; role: string }> = {};

  for (const userData of usersData) {
    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

    const user = await prisma.user.upsert({
      where: { prn: userData.prn },
      update: {},
      create: {
        prn: userData.prn,
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role as "USER" | "CONTENT_ADMIN" | "SUPER_ADMIN",
        xp: userData.xp,
        level: userData.level,
        is_verified: userData.is_verified,
      },
    });

    createdUsers[userData.prn] = user;
    console.log(`   ✔  ${user.name} (${user.prn}) — ${user.role}`);
  }

  // Step 2: Admin records
  console.log("\n🛡️   Seeding admin records...");
  for (const [prn, permissions] of Object.entries(adminPermissions)) {
    const user = createdUsers[prn];
    await prisma.admin.upsert({
      where: { user_id: user.id },
      update: {},
      create: { user_id: user.id, ...permissions },
    });
    console.log(`   ✔  Admin record for ${user.name}`);
  }

  // Summary
  console.log("\n✅  Seed complete!");
  console.log("\n🔑  Test credentials — password: DevPass@123");
  usersData.forEach((u) =>
    console.log(`     ${u.prn}  →  ${u.role}`)
  );
}

main()
  .catch((e) => {
    console.error("❌  Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });