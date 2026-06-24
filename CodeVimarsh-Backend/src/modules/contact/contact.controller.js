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

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await prisma.contactMessage.findMany({
      orderBy: { created_at: "desc" },
    });
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!["Open", "Resolved"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const contact = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });
    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.contactMessage.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Message deleted" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};