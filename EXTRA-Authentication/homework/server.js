const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();

const users = [
  { id: 1, name: "Franco", email: "Franco@mail.com", password: "1234" },
  { id: 2, name: "Toni", email: "Toni@mail.com", password: "1234" },
];

app.use(morgan("dev"));
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(req.cookies);
  next();
});
app.use(express.urlencoded({ extended: true }));

const isAuthenticated = (req, res, next) => {
  req.cookies.userId ? next() : res.redirect("/login");
};
const isNotAuthenticated = (req, res, next) => {
  req.cookies.userId ? res.redirect("/home") : next();
};

app.get("/", (req, res) => {
  res.send(`
  <h1>Bienvenidos a Henry!</h1>
  ${
    req.cookies.userId
      ? `
    <a href='/home'>Perfil</a>
    <form method='post' action='/logout'>
      <button>Salir</button>
    </form>
    `
      : `
    <a href='/login'>Ingresar</a>
    <a href='/register'>Registrarse</a>
    `
  }
  `);
});

app.get("/register", (req, res) => {
  res.send(`
    <h1>Registrarse</h1>
    <form method='post' action='/register'>
      <input name='name' placeholder='Nombre' required />
      <input type='email' name='email' placeholder='Email' required />
      <input type='password' name='password' placeholder='Contraseña' required />
      <input type='submit' value='Registrarse' />
    </form>
    <a href='/login'>Iniciar sesión</a>
  `);
});

app.get("/login", (req, res) => {
  res.send(`
    <h1>Iniciar sesión</h1>
    <form method='post' action='/login'>
      <input type='email' name='email' placeholder='Email' required />
      <input type='password' name='password' placeholder='Contraseña' required />
      <input type='submit' value='Ingresar' />
    </form>
    <a href='/register'>Registrarse</a>
  `);
});

app.post("/login", isNotAuthenticated, (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const user = users.find(
      (userEl) => userEl.email === email && userEl.password === password
    );
    if (user) {
      res.cookie("userId", user.id);
      res.redirect("/home");
    } else res.redirect("/login");
  } else res.redirect("/login");
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  if (name && email && password) {
    const existingUser = users.some((user) => user.email === email);
    if (!existingUser) {
      const user = { ...req.body, id: users.length + 1 };
      users.push(user);
      res.redirect("/");
    } else res.redirect("/register");
  } else res.redirect("/register");
});

app.get("/home", isAuthenticated, (req, res) => {
  const { userId } = req.cookies;
  const user = users.find((userEl) => userEl.id === Number(userId));
  res.send(`
    <h1>Bienvenido ${user.name}</h1>
    <h4>${user.email}</h4>
    <a href='/'>Inicio</a>
  `);
});

app.post("/logout", (req, res) => {
  res.clearCookie("userId");
  res.redirect("/");
});

app.listen(3000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Listening on localhost:3000");
  }
});
