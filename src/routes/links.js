const { isLoggedIn, isAdm } = require("../lib/auth");
const express = require("express");
const router = express.Router();
const pool = require("../database");

router.get("/add", isLoggedIn, isAdm, (req, res) => {
  res.render("links/add");
});

router.get("/ventas", isLoggedIn, (req, res) => {
  res.render("links/ventas");
});

router.post("/add", isLoggedIn, isAdm, async (req, res) => {
  const { nombre, unidades, description, precio } = req.body;
  const nuevObjeto = {
    nombre,
    unidades,
    description,
    precio,
  };
  await pool.query("INSERT INTO inventario SET ?", [nuevObjeto]);
  req.flash("success", "Producto agregado correctamente");
  res.redirect("/links/");
});

router.get("/vendio/:id", isLoggedIn, async (req, res) => {
  const inve = await pool.query("SELECT * FROM inventario");
  res.render("links/ventas", { inve });
});

router.post("/vendio/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body;
  const { vprecio } = req.body;
  const canti = await pool.query(
    "SELECT unidades, dprecio FROM inventario WHERE id =?",
    [id]
  );
  const canti2 = canti[0].unidades;
  const pre = canti[0].dprecio;
  const fpre = Number(vprecio) + Number(pre);
  const final = canti2 - cantidad;
  await pool.query(
    "UPDATE inventario set unidades = ?, dprecio = ? WHERE id = ?",
    [final, fpre, id]
  );
  res.redirect("/links/ventas/list");
});

router.get("/ventas/list", isLoggedIn, async (req, res) => {
  const inve = await pool.query("SELECT * FROM inventario");
  req.flash("success", "Producto no existe");
  res.render("links/ventas", { inve });
});

router.get("/", isLoggedIn, isAdm, async (req, res) => {
  const inve = await pool.query("SELECT * FROM inventario");
  res.render("links/list", { inve });
});

router.get("/delete/:id", isLoggedIn, isAdm, async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM inventario WHERE ID =?", [id]);
  req.flash("success", "Producto eliminado correctamente");
  res.redirect("/links/");
});

router.get("/edit/:id", isLoggedIn, isAdm, async (req, res) => {
  const { id } = req.params;
  const cant = await pool.query("SELECT * FROM inventario WHERE id =?", [id]);
  res.render("links/edit", { cant: cant[0] });
});

router.post("/edit/:id", isAdm, async (req, res) => {
  const { id } = req.params;
  const { nombre, cantidad, description, precio } = req.body;
  const dprecio = 0;
  const created_at = new Date();
  const newObj = {
    nombre,
    unidades: cantidad,
    description,
    precio,
    dprecio,
    created_at,
  };
  await pool.query("UPDATE inventario set ? WHERE id =?", [newObj, id]);
  req.flash("success", "Producto modificado correctamente");
  res.redirect("/links/");
});

router.post("/buscar", isLoggedIn, async (req, res) => {
  const { producto } = req.body;
  var inve = await pool.query("SELECT * FROM inventario WHERE nombre =?", [
    producto,
  ]);
  if (inve == "") {
    inve = await pool.query("SELECT * FROM inventario");
  }
  res.render("links/busco", { inve });
});

router.post("/buscar/inve", isLoggedIn, async (req, res) => {
  const { producto } = req.body;
  var inve = await pool.query("SELECT * FROM inventario WHERE nombre =?", [
    producto,
  ]);
  if (inve == "") {
    inve = await pool.query("SELECT * FROM inventario");
  }
  res.render("links/buscoinve", { inve });
});


module.exports = router;
