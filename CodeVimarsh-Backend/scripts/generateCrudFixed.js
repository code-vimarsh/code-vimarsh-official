import fs from 'fs';
import path from 'path';

const modules = [
  { name: 'team', model: 'teamMember' },
  { name: 'alumni', model: 'alum' },
  { name: 'blogs', model: 'blog' },
  { name: 'achievements', model: 'achievement' },
  { name: 'resources', model: 'resource' }
];

const basePath = path.join(process.cwd(), 'src', 'modules');

modules.forEach(({ name, model }) => {
  const modPath = path.join(basePath, name);
  if (!fs.existsSync(modPath)) fs.mkdirSync(modPath, { recursive: true });

  const service = `import prisma from "../../config/prisma.js";
export const getAll = async () => prisma.${model}.findMany({ orderBy: { created_at: "desc" } });
export const create = async (data) => prisma.${model}.create({ data });
export const update = async (id, data) => prisma.${model}.update({ where: { id }, data });
export const remove = async (id) => prisma.${model}.delete({ where: { id } });`;

  const controller = `import * as service from "./${name}.service.js";
export const getAll = async (req, res, next) => { try { res.status(200).json({ success: true, data: await service.getAll() }); } catch (e) { next(e); } };
export const create = async (req, res, next) => { try { res.status(201).json({ success: true, data: await service.create(req.body) }); } catch (e) { next(e); } };
export const update = async (req, res, next) => { try { res.status(200).json({ success: true, data: await service.update(req.params.id, req.body) }); } catch (e) { next(e); } };
export const remove = async (req, res, next) => { try { await service.remove(req.params.id); res.status(200).json({ success: true, message: "Deleted" }); } catch (e) { next(e); } };`;

  const routes = `import { Router } from "express";
import * as controller from "./${name}.controller.js";
import { protect, authorize } from "../../middleware/auth.middleware.js";
const router = Router();
router.get("/", controller.getAll);
router.post("/", protect, authorize("SUPER_ADMIN", "CONTENT_ADMIN"), controller.create);
router.put("/:id", protect, authorize("SUPER_ADMIN", "CONTENT_ADMIN"), controller.update);
router.delete("/:id", protect, authorize("SUPER_ADMIN", "CONTENT_ADMIN"), controller.remove);
export default router;`;

  fs.writeFileSync(path.join(modPath, `${name}.service.js`), service);
  fs.writeFileSync(path.join(modPath, `${name}.controller.js`), controller);
  fs.writeFileSync(path.join(modPath, `${name}.routes.js`), routes);
});
