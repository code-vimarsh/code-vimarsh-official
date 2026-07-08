import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function cleanupDuplicates() {
  console.log("🧹 Starting duplicate team member cleanup...");

  try {
    // Get all team members ordered by creation date
    const allMembers = await prisma.teamMember.findMany({
      orderBy: { created_at: "asc" }
    });

    console.log(`📊 Total team members in database: ${allMembers.length}`);

    // Track seen emails and duplicates
    const seen = new Map();
    const duplicateIds = [];

    allMembers.forEach(member => {
      if (seen.has(member.email)) {
        // This is a duplicate - mark for deletion
        duplicateIds.push(member.id);
        console.log(`  🔄 Duplicate found: ${member.name} (${member.email}) - ID: ${member.id}`);
      } else {
        // First occurrence - keep it
        seen.set(member.email, member.id);
        console.log(`  ✔ Keeping: ${member.name} (${member.email}) - ID: ${member.id}`);
      }
    });

    if (duplicateIds.length === 0) {
      console.log("\n✅ No duplicates found! Database is clean.");
    } else {
      console.log(`\n⚠️ Found ${duplicateIds.length} duplicate(s). Deleting...`);
      
      // Delete all duplicates
      const deleteResult = await prisma.teamMember.deleteMany({
        where: { id: { in: duplicateIds } }
      });

      console.log(`✅ Deleted ${deleteResult.count} duplicate team member(s).`);
      console.log(`✔ Remaining unique members: ${allMembers.length - duplicateIds.length}`);
    }

  } catch (error) {
    console.error("❌ Error during cleanup:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDuplicates();
