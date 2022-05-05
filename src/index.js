const express = require("express");
const morgan = require("morgan");
const exphds = require("express-handlebars");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const MySQLStore = require("express-mysql-session");
const passport = require("passport");
const { database } = require("./keys");

//inicio
const app = express();
require("./lib/passport");

//configuracion
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphds.engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: require("./lib/handlebars"),
  })
);
app.set("view engine", ".hbs");

//funciones
app.use(
  session({
    secret: "Marcelo",
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database),
  })
);
app.use(flash());
app.use(morgan("dev"));
app.use(express.urlencoded({ extensions: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//variables globales
app.use((req, res, next) => {
  app.locals.success = req.flash("success");
  app.locals.message = req.flash("message");
  app.locals.noexiste = req.flash("noexiste");
  app.locals.user = req.user;
  next();
});

//rutas
app.use(require("./routes"));
app.use(require("./routes/autenticacion"));
app.use("/links", require("./routes/links"));

//archivos publicos
app.use(express.static(path.join(__dirname, "public")));

//comenzar servidor
app.listen(app.get("port"), () => {
  console.log("Se ejecuta en el puerto", app.get("port"));
});
