import * as projectService from "./project.service.js";

export const createProjectController = async (req, res, next) => {

  try {

    const userId = req.user.id;

    const project = await projectService.createProject(userId, req.body);

    res.status(201).json({
      success: true,
      data: project
    });

  } catch (error) {
    next(error);
  }

};

export const getProjectsController = async (req, res, next) => {

  try {

    const projects = await projectService.getAllProjects();

    res.json({
      success: true,
      data: projects
    });

  } catch (error) {
    next(error);
  }

};

export const getProjectController = async (req, res, next) => {

  try {

    const { id } = req.params;

    const project = await projectService.getProjectById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.json({
      success: true,
      data: project
    });

  } catch (error) {
    next(error);
  }

};


export const updateProjectController = async (req, res, next) => {

  try {

    const { id } = req.params;

    const userId = req.user.id;

    const updatedProject = await projectService.updateProject(
      id,
      userId,
      req.body
    );

    res.json({
      success: true,
      data: updatedProject
    });

  } catch (error) {
    next(error);
  }

};

export const deleteProjectController = async (req, res, next) => {

  try {

    const { id } = req.params;

    const userId = req.user.id;

    const result = await projectService.deleteProject(id, userId);

    res.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    next(error);
  }

};