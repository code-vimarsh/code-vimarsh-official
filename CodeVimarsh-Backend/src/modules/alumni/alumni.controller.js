import * as service from "./alumni.service.js";
export const getAll = async (req, res, next) => { try { res.status(200).json({ success: true, data: await service.getAll() }); } catch (e) { next(e); } };
export const create = async (req, res, next) => { try { res.status(201).json({ success: true, data: await service.create(req.body) }); } catch (e) { next(e); } };
export const update = async (req, res, next) => { try { res.status(200).json({ success: true, data: await service.update(req.params.id, req.body) }); } catch (e) { next(e); } };
export const remove = async (req, res, next) => { try { await service.remove(req.params.id); res.status(200).json({ success: true, message: "Deleted" }); } catch (e) { next(e); } };