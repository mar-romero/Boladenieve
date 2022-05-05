const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn, isAdm } = require("../lib/auth");

router.get("/signup", isNotLoggedIn, (req, res) => {
  res.render("auth/signup");
});

router.post(
  "/signup",
  passport.authenticate("local.signup", {
    successRedirect: "/links/ventas/list",
    failureRedirect: "/signup",
    failureFlash: true,
  })
);

router.get("/signin", isNotLoggedIn, (req, res) => {
  res.render("auth/signin");
});

router.post("/signin", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local.signin", {
    successRedirect: "/links/ventas/list",
    failureRedirect: "/signin",
    failureFlash: true,
  })(req, res, next);
});



router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/signin');
});

module.exports = router;
