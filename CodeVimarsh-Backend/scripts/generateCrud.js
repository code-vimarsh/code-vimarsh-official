import fs from 'fs';
import path from 'path';

const modules = [
  {
    name: 'team',
    model: 'teamMember',
    schema: `
import { z } from "zod";
export const teamSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  section: z.string().min(1),
  image: z.string().optional().nullable(),
  email: z.string().email(),
  github: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
});`
  },
  {
    name: 'alumni',
    model: 'alum',
    schema: `
import { z } from "zod";
export const alumniSchema = z.object({
  name: z.string().min(1),
  initials: z.string().optional().nullable(),
  photo: z.string().optional().nullable(),
  role: z.string().min(1),
  company: z.string().min(1),
  batch: z.string().min(1),
  location: z.string().min(1),
  domain: z.string().min(1),
  bio: z.string().optional().nullable(),
  advice: z.string().optional().nullable(),
  tech: z.array(z.string()).optional().default([]),
  linkedin: z.string().optional().nullable(),
  github: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  achievements: z.array(z.string()).optional().default([]),
  roadmap: z.any().optional().nullable(),
});`
  },
  {
    name: 'blogs',
    model: 'blog',
    schema: `
import { z } from "zod";
export const blogSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  topic: z.string().min(1),
  short_description: z.string().optional().nullable(),
  content: z.string().min(1),
  featured_image: z.string().optional().nullable(),
  images: z.array(z.string()).optional().default([]),
  author_name: z.string().min(1),
  author_role: z.string().min(1),
  tags: z.array(z.string()).optional().default([]),
  status: z.string().default("Draft"),
});`
  },
  {
    name: 'achievements',
    model: 'achievement',
    schema: `
import { z } from "zod";
export const achievementSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  date: z.string().min(1),
  tag: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  category: z.string().min(1),
  order: z.number().int().default(1),
});`
  },
  {
    name: 'resources',
    model: 'resource',
    schema: `
import { z } from "zod";
export const resourceSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  url: z.string().min(1),
  thumbnail: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  best_for: z.string().optional().nullable(),
  content_type: z.string().optional().nullable(),
});`
  }
];

const basePath = path.join(process.cwd(), 'src', 'modules');

modules.forEach(({ name, model, schema }) => {
  const modPath = path.join(basePath, name);
  if (!fs.existsSync(modPath)) fs.mkdirSync(modPath, { recursive: true });

  // Schema
  fs.writeFileSync(path.join(modPath, name + '.schema.js'), schema.trim() + '\\n');

  // Service
  const serviceCode = 'import prisma from "../../config/prisma.js";\\n\\n' +
'export const getAll = async () => {\\n' +
'  return await prisma.' + model + '.findMany({ orderBy: { created_at: \\'desc\\' } });\\n' +
'};\\n\\n' +
'export const create = async (data) => {\\n' +
'  return await prisma.' + model + '.create({ data });\\n' +
'};\\n\\n' +
'export const update = async (id, data) => {\\n' +
'  return await prisma.' + model + '.update({ where: { id }, data });\\n' +
'};\\n\\n' +
'export const remove = async (id) => {\\n' +
'  return await prisma.' + model + '.delete({ where: { id } });\\n' +
'};\\n';
  fs.writeFileSync(path.join(modPath, name + '.service.js'), serviceCode);

  // Controller
  const controllerCode = 'import * as service from "./' + name + '.service.js";\\n\\n' +
'export const getAll = async (req, res, next) => {\\n' +
'  try {\\n' +
'    const data = await service.getAll();\\n' +
'    res.status(200).json({ success: true, data });\\n' +
'  } catch (error) {\\n' +
'    next(error);\\n' +
'  }\\n' +
'};\\n\\n' +
'export const create = async (req, res, next) => {\\n' +
'  try {\\n' +
'    const newData = await service.create(req.body);\\n' +
'    res.status(201).json({ success: true, data: newData });\\n' +
'  } catch (error) {\\n' +
'    next(error);\\n' +
'  }\\n' +
'};\\n\\n' +
'export const update = async (req, res, next) => {\\n' +
'  try {\\n' +
'    const updatedData = await service.update(req.params.id, req.body);\\n' +
'    res.status(200).json({ success: true, data: updatedData });\\n' +
'  } catch (error) {\\n' +
'    next(error);\\n' +
'  }\\n' +
'};\\n\\n' +
'export const remove = async (req, res, next) => {\\n' +
'  try {\\n' +
'    await service.remove(req.params.id);\\n' +
'    res.status(200).json({ success: true, message: "Deleted successfully" });\\n' +
'  } catch (error) {\\n' +
'    next(error);\\n' +
'  }\\n' +
'};\\n';
  fs.writeFileSync(path.join(modPath, name + '.controller.js'), controllerCode);

  let schemaExport = '';
  if (name.includes('blog')) schemaExport = 'blogSchema';
  else if (name.includes('alumni')) schemaExport = 'alumniSchema';
  else if (name.includes('team')) schemaExport = 'teamSchema';
  else if (name.includes('achievement')) schemaExport = 'achievementSchema';
  else schemaExport = 'resourceSchema';

  // Routes
  const routeCode = 'import { Router } from "express";\\n' +
'import * as controller from "./' + name + '.controller.js";\\n' +
'import { protect, authorize } from "../../middleware/auth.middleware.js";\\n' +
'import { validate } from "../../middleware/validate.middleware.js";\\n' +
'import { ' + schemaExport + ' } from "./' + name + '.schema.js";\\n\\n' +
'const router = Router();\\n\\n' +
'router.get("/", controller.getAll);\\n' +
'router.post("/", protect, authorize("SUPER_ADMIN", "CONTENT_ADMIN"), validate(' + schemaExport + '), controller.create);\\n' +
'router.put("/:id", protect, authorize("SUPER_ADMIN", "CONTENT_ADMIN"), validate(' + schemaExport + '), controller.update);\\n' +
'router.delete("/:id", protect, authorize("SUPER_ADMIN", "CONTENT_ADMIN"), controller.remove);\\n\\n' +
'export default router;\\n';
  fs.writeFileSync(path.join(modPath, name + '.routes.js'), routeCode);

  console.log('Generated ' + name + ' module');
});
