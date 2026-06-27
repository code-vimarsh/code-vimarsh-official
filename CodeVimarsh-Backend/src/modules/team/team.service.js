import prisma from "../../config/prisma.js";

// Deduplicate team members by email, keeping the first occurrence
const deduplicateByEmail = (members) => {
  const seen = new Map();
  const deduplicated = [];
  
  for (const member of members) {
    if (!seen.has(member.email)) {
      seen.set(member.email, true);
      deduplicated.push(member);
    }
  }
  
  return deduplicated;
};

export const getAll = async () => {
  const members = await prisma.teamMember.findMany({ orderBy: { created_at: "asc" } });
  return deduplicateByEmail(members);
};
export const create = async (data) => prisma.teamMember.create({ data });
export const update = async (id, data) => prisma.teamMember.update({ where: { id }, data });
export const remove = async (id) => prisma.teamMember.delete({ where: { id } });