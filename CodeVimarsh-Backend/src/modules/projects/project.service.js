import prisma from "../../config/prisma.js";

// create project controller
export const createProject = async (userId, data) => {

  // Remove duplicate members
  const uniqueMembers = [...new Set(data.members || [])];

  // Remove creator if included accidentally
  const filteredMembers = uniqueMembers.filter(
    (memberId) => memberId !== userId
  );

  const project = await prisma.project.create({

    data: {

      title: data.title,
      short_description: data.short_description,
      category: data.category,
      about: data.about,
      key_features: data.key_features,
      tech_stack: data.tech_stack,
      github_link: data.github_link,
      image: data.image,
      author_name: data.author_name,

      created_by: userId,

      members: {
        create: [
          {
            user_id: userId
          },
          ...filteredMembers.map((memberId) => ({
            user_id: memberId
          }))
        ]
      }

    },

    include: {
      members: true
    }

  });

  return project;

};

// get All project controller

export const getAllProjects = async () => {

  return prisma.project.findMany({

    where: {
      status: "Approved"
    },

    include: {
      creator: {
        select: {
          id: true,
          name: true
        }
      },

      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }

    },

    orderBy: {
      created_at: "desc"
    }

  });

};

// find project by id

export const getProjectById = async (projectId) => {

  return prisma.project.findUnique({

    where: { id: projectId },

    include: {

      creator: true,

      members: {
        include: {
          user: true
        }
      }

    }

  });

};

//update project controller
export const updateProject = async (projectId, userId, data) => {

  const project = await prisma.project.findUnique({
    where: { id: projectId }
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.created_by !== userId) {
    throw new Error("Unauthorized");
  }

  return prisma.project.update({

    where: { id: projectId },

    data: {
      title: data.title,
      short_description: data.short_description,
      category: data.category,
      about: data.about,
      key_features: data.key_features,
      tech_stack: data.tech_stack,
      github_link: data.github_link,
      image: data.image,
      author_name: data.author_name
    }

  });

};

// delete project controller

export const deleteProject = async (projectId, userId) => {

  const project = await prisma.project.findUnique({
    where: { id: projectId }
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.created_by !== userId) {
    throw new Error("Unauthorized");
  }

  await prisma.projectMember.deleteMany({
    where: { project_id: projectId }
  });

  return prisma.project.delete({
    where: { id: projectId }
  });

};

