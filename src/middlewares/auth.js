export const auth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(500).redirect("/login");
  }
  next();
};
