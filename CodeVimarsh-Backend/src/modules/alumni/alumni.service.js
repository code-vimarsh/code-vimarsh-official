import prisma from "../../config/prisma.js";
export const getAll = async () => prisma.alum.findMany({ orderBy: { created_at: "desc" } });
export const create = async (data) => prisma.alum.create({ data });
export const update = async (id, data) => prisma.alum.update({ where: { id }, data });
export const remove = async (id) => prisma.alum.delete({ where: { id } });