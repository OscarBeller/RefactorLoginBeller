import { Router } from "express";
import passport from "passport";
export const router = Router();

router.get("/error", (req, res) => {
  return res.status(500).json({ error: "Authentication error" });
});

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/api/sessions/error" }),
  async (req, res) => {
    return res
      .status(201)
      .json({ payload: "Successful registration", newUser: req.user });
  }
);

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/api/sessions/error" }),
  async (req, res) => {
    let { web } = req.body;
    let user = { ...req.user };
    delete user.password;
    req.session.user = user;

    if (web) {
      console.log(web);
      res.redirect("/");
    } else {
      return res.json({ payload: "Successfull login" });
    }
  }
);

router.get("/github", passport.authenticate("github", {}), (req, res) => {});
router.get(
  "/githubCallback",
  passport.authenticate("github", {
    failureRedirect: "/api/sessions/error",
  }),
  (req, res) => {
    req.session.user = req.user;
    return res.redirect("/");
  }
);

router.get("/current", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "User does not exist" });
  }
  return res.json({ currentUser: req.session.user });
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Unexpected server error" });
    }
  });
  res.json({ payload: "logout successfull" });
});
