import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB } from "../../backendLibs/dbLib";
export default function summaryRoute(req, res) {
  if (req.method === "GET") {
    //check authentication
    const user = checkToken(req);
    if (!user || user.isAdmin) {
      return res.status(403).json({
        ok: false,
        message: "Permission denied",
      });
    }

    //return res.status(403).json({ ok: false, message: "Permission denied" });
    //compute DB summary
    const users = readUsersDB();
    let uc = 0,
      ac = 0,
      tm = 0;
    users.map((x) => {
      if (x.isAdmin) {
        ac += 1;
      } else {
        uc += 1;
      }
      tm += x.money;
    });
    //return response
    return res.json({
      ok: true,
      userCount: uc,
      adminCount: ac,
      totalMoney: tm,
    });
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
