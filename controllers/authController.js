const User = require("../models/user");
const bcrypt = require("../services/bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

module.exports.login = async (request, response) => {
  const { email, password } = request.body;
  if (!email || !password)
    return response.status(400).json({
      type: "Erreur",
      message: "Le mot de passe et l'adresse email sont obligatoires !",
    });

  const foundUser = await User.findOne({ email: email });

  if (!foundUser)
    return response.json({
      type: "Erreur",
      message: "L'email que vous avez entré est incorrect",
    });

  const cryptedPassword = foundUser.password;
  const match = await bcrypt.compare(password, cryptedPassword);
  if (!match)
    return response.json({
      type: "Erreur",
      message: "Le mot de passe entré est incorrecte",
    });

  const payload = {
    email: foundUser.email,
    id: foundUser.id,
  };

  const token = jsonwebtoken.sign(payload, secret, { expiresIn: "1d" });

  return response.send({
    type: "Success",
    message: "Utilisateur est connecté !",
    user: {
      id: foundUser._id,
      pseudo: foundUser.pseudo,
      avatar: foundUser.avatar,
      token: `Bearer ${token}`,
    },
  });
};
