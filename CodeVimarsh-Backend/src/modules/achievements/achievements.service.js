import prisma from "../../config/prisma.js";
export const getAll = async () => prisma.achievement.findMany({ orderBy: { created_at: "desc" } });
export const create = async (data) => prisma.achievement.create({ data });
export const update = async (id, data) => prisma.achievement.update({ where: { id }, data });
export const remove = async (id) => prisma.achievement.delete({ where: { id } });