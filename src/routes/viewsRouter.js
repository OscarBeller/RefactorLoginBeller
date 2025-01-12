import { Router } from "express";
export const router = Router();
import ProductManager from "../dao/ProductManagerDB.js";
import CartManager from "../dao/CartManagerDB.js";
import { auth } from "../middlewares/auth.js";
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/", auth, (req, res) => {
  res.redirect("/products");
});
router.get("/products", auth, async (req, res) => {
  let { limit = 10, sort, page = 1, ...filters } = req.query;
  let user = req.session.user;
  let cart = { _id: req.session.user.cart };
  let {
    payload: products,
    totalPages,
    prevPage,
    nextPage,
    hasPrevPage,
    hasNextPage,
    prevLink,
    nextLink,
  } = await productManager.getProducts(limit, page, sort, filters);
  res.status(200).render("home", {
    products,
    totalPages,
    prevPage,
    nextPage,
    page,
    hasPrevPage,
    hasNextPage,
    prevLink,
    nextLink,
    user,
    cart,
  });
});

router.get("/realTimeProducts", auth, async (req, res) => {
  let products = await productManager.getAllProducts();
  let user = req.session.user;
  let cart = { _id: req.session.user.cart };
  res.status(200).render("realTimeProducts", { products, user, cart });
});

router.get("/chat", (req, res) => {
  res.status(200).render("chat");
});

router.get("/carts/:cid", auth, async (req, res) => {
  let user = req.session.user;
  let cid = req.params.cid;
  let cart = { _id: req.session.user.cart };
  let userCart = await cartManager.getCartById(cid);
  userCart = userCart.products.map((c) => c.toJSON());

  res.status(200).render("carts", { cart, user, userCart });
});

router.get("/register", (req, res) => {
  res.render("register");
});
router.get("/login", (req, res) => {
  let error = req.query;
  res.render("login", { error });
});

router.get("/profile", auth, (req, res) => {
  let user = req.session.user;
  let cart = { _id: req.session.user.cart };
  res.render("profile", { user, cart });
});
