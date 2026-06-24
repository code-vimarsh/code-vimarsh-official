import * as eventsService from "./events.service.js";

export const createEvent = async (req, res, next) => {
  try {
    const event = await eventsService.createEvent(req.body, req.user.id);
    res.status(201).json({ success: true, event });
  } catch (err) {
    next(err);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const event = await eventsService.updateEvent(req.params.id, req.body);
    res.status(200).json({ success: true, event });
  } catch (err) {
    next(err);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const event = await eventsService.deleteEvent(req.params.id);
    res.status(200).json({ success: true, message: "Event deleted successfully.", event });
  } catch (err) {
    next(err);
  }
};

export const getAllEvents = async (req, res, next) => {
  try {
    const events = await eventsService.getAllEvents();
    res.status(200).json({ success: true, events });
  } catch (err) {
    next(err);
  }
};

export const getEventById = async (req, res, next) => {
  try {
    const event = await eventsService.getEventById(req.params.id);
    res.status(200).json({ success: true, event });
  } catch (err) {
    if (err.message === "Event not found") {
      return res.status(404).json({ success: false, message: err.message });
    }
    next(err);
  }
};

export const registerForEvent = async (req, res, next) => {
  try {
    const registration = await eventsService.registerForEvent(
      req.params.id,
      req.user,
      req.body
    );
    res.status(201).json({ 
      success: true, 
      registration, 
      message: "Successfully registered! A confirmation email has been sent." 
    });
  } catch (err) {
    if (err.message === "Event not found") {
      return res.status(404).json({ success: false, message: err.message });
    }
    if (err.message === "You are already registered for this event.") {
      return res.status(409).json({ success: false, message: err.message });
    }
    next(err);
  }
};

export const addEventSpeaker = async (req, res, next) => {
  try {
    const speaker = await eventsService.addEventSpeaker(req.params.id, req.body);
    res.status(201).json({ success: true, speaker, message: "Speaker added successfully." });
  } catch (err) {
    if (err.message === "Event not found") {
      return res.status(404).json({ success: false, message: err.message });
    }
    next(err);
  }
};
export const updateEventSpeaker = async (req, res, next) => {
  try {
    const speaker = await eventsService.updateEventSpeaker(req.params.speakerId, req.body);
    res.status(200).json({ success: true, speaker, message: "Speaker updated successfully." });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ success: false, message: "Speaker not found" });
    }
    next(err);
  }
};

export const deleteEventSpeaker = async (req, res, next) => {
  try {
    const speaker = await eventsService.deleteEventSpeaker(req.params.speakerId);
    res.status(200).json({ success: true, speaker, message: "Speaker deleted successfully." });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ success: false, message: "Speaker not found" });
    }
    next(err);
  }
};
