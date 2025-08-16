// función genérica y reutilizable, se puede usar en controladores, middlewares, servicios
// no depende de express (req,res) ni de la bd
// se relaciona a una funcionalidad común que es la autenticación
// no tiene lógica de negocio en sí

import jwt from "jsonwebtoken";

const generateToken = (
  payload,
  secret = process.env.JWT_SECRET,
  refresh = process.env.JWT_REFRESH_TOKEN,
  options = { expiresIn: "1h" }
) => {
  try {
    console.log("- GENERANDO TOKEN -");
    console.log("Payload recibido: ", payload);
    console.log("Propiedades del payload: ", Object.keys(payload));
    console.log("payload.id_u: ", payload.id_u);

    const accessToken = jwt.sign(
        payload, 
        secret, 
        options
    );

    const refreshToken = jwt.sign(
        payload,
        refresh,
        {expiresIn: '7d'}
    )

    console.log("Access Token generado con éxito: ", accessToken);
    console.log("Refresh Token generado con éxito: ", refreshToken);

    const decodedAccess = jwt.verify(accessToken, secret);
    const decodedRefresh = jwt.verify(refreshToken, refresh);

    console.log("Access Token decodificado (verificación): ", decodedAccess);
    console.log("Refresh Token decodificado (verificación): ", decodedRefresh);

    return {
        accessToken,
        refreshToken
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al generar el token: ${error.message}`);
    }
    throw new Error("Error desconocido al generar token");
  }
};

export { generateToken };
