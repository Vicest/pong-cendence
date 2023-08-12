// import express from 'express'
// import session from 'express-session'
// import bodyParser from "body-parser";
// import cookieParser from "cookie-parser";
// import cors from 'cors'

// const app = express();
// const port = 3001;

// // Configurar sesión
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(cors({
//   origin: "http://localhost:4200",
//   credentials: true
// }));

// app.use(cookieParser("1234567890QWERTY"));
// app.use(session({
// 	secret: '1234567890QWERTY',
// 	resave: true,
// 	saveUninitialized: false,
//     cookie: {
//         sameSite: 'none',
//         secure: false,
//         maxAge: 30 * 60 * 60 * 1000
//       }

// }));

// // Permitir solicitudes desde el origen del frontend (ajusta esto según tu configuración)
// // app.use(cors({
// //   origin: 'http://localhost:4200',
// //   credentials: true,
// // }));

// // Ruta para establecer datos en la sesión
// app.get('/api/login', (req, res) => {
//   req.session.username = 'exampleUser';
//   console.log(req.session)
//   res.send('User logged in.');
// });

// // Ruta para obtener datos desde la sesión
// app.get('/api/data', (req, res) => {
//   const { username } = req.session;
//   console.log(req.session)
//   res.send(`Data for user: ${username}`);
// });

// app.listen(port, () => {
//   console.log(`Backend server is running on http://localhost:${port}`);
// });

import express from 'express'
import session from 'express-session'
import cookieParser from "cookie-parser";
import cors from 'cors';
import bodyParser from "body-parser";
import proxy from 'express-http-proxy'

var app = express();
const URL_FRONT = 'http://localhost:4200'

app.use(cookieParser());
app.use(session({
  secret: "1234567890QWERTY",
  resave: true,
  saveUninitialized: false,
  
}));

app.use(
  cors({
    origin: URL_FRONT,
    credentials: true
  })
);


app.get('/', function(req, res){
   if(req.session.page_views){
      req.session.page_views++;
      console.log(req.session.page_views)
      res.send(req.session.page_views.toString());
   } else {
      req.session.page_views = 1;
      res.send(req.session.page_views.toString());
   }
});

// Ruta para establecer datos en la sesión
app.get('/login', (req, res) => {
  req.session.username = 'exampleUser';
  console.log(req.session)
  res.send('User logged in.');
});

// Ruta para obtener datos desde la sesión
app.get('/data', (req, res) => {
  const { username } = req.session;
  console.log(req.session)
  res.send(`Data for user: ${username}`);
});

app.use(proxy(URL_FRONT));


app.listen(3001);