import {hashPassword} from "../services/hashPassword.js";

const hashPasswordExec = async () => {
    try {
        await hashPassword();
        console.log("Todas las contraseñas han sido hasheadas.");
    } catch (error) {
        console.error("Aviso de contraseñas: ", error.message);
    }
}

export default hashPasswordExec;