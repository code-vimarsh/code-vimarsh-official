import * as adminService from "./admin.service.js";

export const changeUserRole = async (req, res, next) => {
  try {
    const result = await adminService.changeUserRole(
      req.user.id,
      req.params.userId,
      req.body.role
    );
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const result = await adminService.getAllUsers({ page, limit });
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await adminService.getUserProfile(req.params.userId);
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};
