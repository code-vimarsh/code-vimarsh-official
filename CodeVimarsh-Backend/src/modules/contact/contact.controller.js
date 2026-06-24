import prisma from "../../config/prisma.js";

export const createContact = async (req, res) => {
  try {
    const { name, email, message, phone, subject } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required",
      });
    }

    const contact = await prisma.contactMessage.create({
      data: {
        name,
        email,
        message,
        subject: subject || "Contact Form Submission",
        user_id: null,
      },
    });

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};