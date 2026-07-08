import "dotenv/config";
import app from "./app.js";
import prisma from "./config/prisma.js";

const PORT = process.env.PORT ?? 5000;

const start = async () => {
  try {
    await prisma.$connect();
    console.log("✅  Database connected via Prisma + Supabase");

    app.listen(PORT, () => {
      console.log(`🚀  Code Vimarsh API  →  http://localhost:${PORT}`);
      console.log(`📖  Swagger docs      →  http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("❌  Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑  Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

start();
