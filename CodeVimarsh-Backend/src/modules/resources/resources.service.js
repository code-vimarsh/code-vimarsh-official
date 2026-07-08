import prisma from "../../config/prisma.js";
export const getAll = async () => prisma.resource.findMany({ orderBy: { created_at: "desc" } });
export const create = async (data) => prisma.resource.create({ data });
export const update = async (id, data) => prisma.resource.update({ where: { id }, data });
export const remove = async (id) => prisma.resource.delete({ where: { id } });