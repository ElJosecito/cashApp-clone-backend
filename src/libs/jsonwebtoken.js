const jwt = require("jsonwebtoken");


//Generate token
const GenerateAccessToken = (user) => {
  const payload = {
    user: {
      name: user.name,
    },
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

//Validate token
const ValidateToken = (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload.user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Handle token expiration
      return res.status(401).json({ message: "Token expirado" });
    } else {
      console.error(error);
      return res.status(500).json({ message: "Error en el servidor" });
    }
  }
};

module.exports = {
  GenerateAccessToken,
  ValidateToken,
};
