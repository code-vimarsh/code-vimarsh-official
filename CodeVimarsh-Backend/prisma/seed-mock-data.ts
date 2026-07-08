import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { MOCK_TEAM, MOCK_PROJECTS, MOCK_MANAGED_ACHIEVEMENTS, MOCK_MANAGED_BLOGS, MOCK_ALUMNI, MOCK_VIDEOS, MOCK_LINKS } from "../../Code_Vimarsh_Frontend/constants.ts";
import { EVENTS_DATA } from "../../Code_Vimarsh_Frontend/data/eventsData.ts";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting mock data seed...");

  // Clear existing data first (to avoid duplicates on re-runs)
  console.log("🧹 Clearing existing seeded data...");
  await prisma.resource.deleteMany({});
  await prisma.achievement.deleteMany({});
  await prisma.blog.deleteMany({});
  await prisma.alum.deleteMany({});
  // Don't delete team members that may have been manually added — use upsert
  // Don't delete events with registrations — delete only events without registrations
  const eventsWithRegs = await prisma.event.findMany({ where: { registrations: { some: {} } }, select: { id: true } });
  const eventsWithRegsIds = eventsWithRegs.map(e => e.id);
  await prisma.event.deleteMany({ where: { id: { notIn: eventsWithRegsIds } } });
  // Don't delete projects with members — delete only orphan projects
  const projectsWithMembers = await prisma.project.findMany({ where: { members: { some: {} } }, select: { id: true } });
  const projectsWithMembersIds = projectsWithMembers.map(p => p.id);
  await prisma.project.deleteMany({ where: { id: { notIn: projectsWithMembersIds } } });
  console.log("✔ Cleared existing data.");
  // 1. Seed Team Members
  console.log("Seeding Team Members...");
  for (const member of MOCK_TEAM) {
    await prisma.teamMember.upsert({
      where: { email: member.email },
      update: {},
      create: {
        name: member.name,
        role: member.role,
        section: member.section,
        image: member.image,
        email: member.email,
        github: member.github,
        linkedin: member.linkedin,
      },
    });
  }
  console.log(`✔ Seeded ${MOCK_TEAM.length} team members.`);

  // 2. Seed Projects
  console.log("Seeding Projects...");
  // Need to get a valid user ID for created_by
  const adminUser = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } });
  if (!adminUser) {
    console.error("No SUPER_ADMIN user found to assign projects. Skipping projects.");
  } else {
    const mapCategory = (cat: string) => {
      if (cat === "Web") return "Web";
      if (cat === "Mobile") return "Mobile";
      if (cat === "AI / ML") return "MachineLearning";
      return "Other";
    };

    for (const project of MOCK_PROJECTS) {
      await prisma.project.create({
        data: {
          title: project.title,
          short_description: project.shortDescription,
          about: project.fullDescription,
          category: mapCategory(project.category),
          key_features: project.features || [],
          tech_stack: project.tech || [],
          github_link: project.links?.github,
          image: project.image,
          author_name: project.author,
          status: 'Approved',
          created_by: adminUser.id,
        },
      });
    }
    console.log(`✔ Seeded ${MOCK_PROJECTS.length} projects.`);
  }

  // 3. Seed Events
  console.log("Seeding Events...");
  if (adminUser) {
    for (const event of EVENTS_DATA) {
      await prisma.event.create({
        data: {
          title: event.title,
          description: event.description,
          long_description: event.fullDescription,
          type: "Workshop", // Defaulting to Workshop for mock data
          status: event.status === 'live' ? 'Live' : event.status === 'upcoming' ? 'Upcoming' : 'Past',
          location: event.location,
          start_date: new Date(event.date === 'live' ? new Date() : event.date || new Date()),
          end_date: new Date(event.date === 'live' ? new Date() : event.date || new Date()),
          max_participants: event.capacity,
          banner_image: event.image,
          topics: event.tags || [],
          created_by: adminUser.id,
          is_published: event.status !== 'upcoming',
        },
      });
    }
    console.log(`✔ Seeded ${EVENTS_DATA.length} events.`);
  }

  // 4. Seed Achievements
  console.log("Seeding Achievements...");
  for (const ach of MOCK_MANAGED_ACHIEVEMENTS) {
    await prisma.achievement.create({
      data: {
        title: ach.title,
        description: ach.description,
        date: ach.date,
        tag: ach.tag,
        icon: ach.icon,
        category: ach.category,
        order: ach.order,
      },
    });
  }
  console.log(`✔ Seeded ${MOCK_MANAGED_ACHIEVEMENTS.length} achievements.`);

  // 5. Seed Blogs
  console.log("Seeding Blogs...");
  for (const blog of MOCK_MANAGED_BLOGS) {
    await prisma.blog.create({
      data: {
        title: blog.title,
        slug: blog.slug || blog.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '-' + Date.now(),
        topic: blog.topic,
        short_description: (blog as any).shortDescription || (blog as any).excerpt,
        content: blog.content,
        featured_image: (blog as any).featuredImage || (blog as any).image,
        images: blog.images || [],
        author_name: (blog as any).authorName || (blog as any).author?.name || 'Unknown',
        author_role: (blog as any).authorRole || (blog as any).author?.role || 'Guest',
        tags: blog.tags,
        status: blog.status,
      },
    });
  }
  console.log(`✔ Seeded ${MOCK_MANAGED_BLOGS.length} blogs.`);

  // 6. Seed Alumni
  console.log("Seeding Alumni...");
  for (const alum of MOCK_ALUMNI) {
    await prisma.alum.create({
      data: {
        name: alum.name,
        initials: alum.initials,
        photo: alum.photo,
        role: alum.role,
        company: alum.company,
        batch: alum.batch,
        location: alum.location,
        domain: alum.domain,
        bio: alum.bio,
        advice: alum.advice,
        tech: alum.tech,
        linkedin: alum.linkedin,
        github: alum.github,
        website: alum.website,
        achievements: alum.achievements,
        roadmap: alum.roadmap ? JSON.parse(JSON.stringify(alum.roadmap)) : null,
      },
    });
  }
  console.log(`✔ Seeded ${MOCK_ALUMNI.length} alumni.`);

  // 7. Seed Resources
  console.log("Seeding Resources...");
  for (const vid of MOCK_VIDEOS) {
    await prisma.resource.create({
      data: {
        title: vid.title,
        category: 'youtube',
        url: vid.url,
        thumbnail: vid.thumbnail,
        tags: vid.tags,
        best_for: (vid as any).bestFor || 'Beginners',
      },
    });
  }
  for (const link of MOCK_LINKS) {
    await prisma.resource.create({
      data: {
        title: link.title,
        category: 'website',
        url: link.url,
        tags: link.tags,
        content_type: (link as any).type || 'article',
      },
    });
  }
  console.log(`✔ Seeded resources.`);

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
