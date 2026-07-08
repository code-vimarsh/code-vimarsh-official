import prisma from "../../config/prisma.js";
export const getAll = async () => prisma.blog.findMany({ orderBy: { created_at: "desc" } });
export const create = async (data) => prisma.blog.create({ data });
export const update = async (id, data) => prisma.blog.update({ where: { id }, data });
export const remove = async (id) => prisma.blog.delete({ where: { id } });