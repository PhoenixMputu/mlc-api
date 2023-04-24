const { Event } = require("../models/event");

module.exports.create = async (request, response) => {
  const { lieu, name, date, image, hour, description } = request.body;

  if (!lieu || !name || !date || !image || !hour || !description) {
    return response.status(400).json({
      error: "Tous les champs sont requis",
    });
  }

  const event = new Event({
    name: name,
    lieu: lieu,
    date: date,
    image: image,
    hour: hour,
    description: description,
  });

  event
    .save()
    .then(() => {
      return response.status(201).json({
        message: "Event crée",
      });
    })
    .catch((error) => {
      response.status(400).json({
        error: error,
      });
    });
};