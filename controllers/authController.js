const { User } = require("../models/user");
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
      name: foundUser.name,
      firstName: foundUser.firstName,
      email: foundUser.email,
      token: `Bearer ${token}`,
    },
  });
};

module.exports.register = async (request, response) => {
    const { name, password, email, firstName } = request.body;
    if (!name || !password || !email || !firstName) {
      return response.status(415).json({
        type: "Erreur",
        message: "Tous les données",
      });
    }
    const existsEmail = await User.findOne({ email: email });
    if (existsEmail) {
      return response.status(415).json({
        type: "Erreur",
        message: "l'email existe déjà",
      });
    }
  
    const cryptedPassword = await bcrypt.encrypt(password);
    const user = await User.create({
      name: name,
      password: cryptedPassword,
      firstName: firstName,
      email: email,
    });
  
    if (user) {
      const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        firstName: user.firstName,
      };
      const token = jsonwebtoken.sign(payload, secret, { expiresIn: "1d" });
      return response.status(201).json({
        type: "Success",
        message: "Successfull",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            firstName: user.firstName,
            token: `Bearer ${token}`,
        },
      });
    }
  };
