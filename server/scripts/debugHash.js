import bcrypt from "bcryptjs";

const input = "password";
const hash = "hashed_code";

const result = await bcrypt.compare(input,hash);
console.log(result);