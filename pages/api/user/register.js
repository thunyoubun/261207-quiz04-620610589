import { readUsersDB, writeUsersDB } from "../../../backendLibs/dbLib";
import bcrypt from "bcrypt";
import { checkToken } from "../../../backendLibs/checkToken";

export default function userRegisterRoute(req, res) {
  if (req.method === "POST") {
    const { username, password, isAdmin } = req.body;

    //check authentication
    const user = checkToken(req);
    if (!user.isAdmin) {
      return res.status(403).json({
        ok: false,
        message: "You do not have permission to create account",
      });
    } else {
      const user = checkToken(req);
      if (!user || !user.isAdmin) {
        return res.status(403).json({
          ok: false,
          message: "You do not have permission to create account",
        });
      }
    }
    //return res.status(403).json({ok: false,message: "You do not have permission to create account",});

    //validate body
    if (
      typeof username !== "string" ||
      username.length === 0 ||
      typeof password !== "string" ||
      password.length === 0 ||
      typeof isAdmin !== "boolean"
    )
      return res
        .status(400)
        .json({ ok: false, message: "Invalid request body" });

    //check if username is already in database
    const users = readUsersDB();
    //return res.status(400).json({ ok: false, message: "Username is already taken" });
    const foundUser = users.find((x) => x.username === username);
    if (foundUser)
      return res
        .status(400)
        .json({ ok: false, message: "Username is already taken" });

    //send username back when successfully registered
    const newUser = {
      username,
      password: bcrypt.hashSync(password, 12),
      isAdmin,
    };

    if (newUser.isAdmin) {
      newUser.money = null;
    } else {
      newUser.money = 0;
    }

    //create new user and add in db
    users.push(newUser);
    writeUsersDB(users);

    //return response
    return res.json({ ok: true, username, isAdmin });
  }
}
