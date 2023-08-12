// Main Server
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from 'express'
const app = express();
import { routes } from './routes/user.routes.js'
import session from 'express-session'
import cors from 'cors'
import proxy from 'express-http-proxy'
// import jwt from 'jsonwebtoken';

// CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(cookieParser());
app.use(session({
  secret: "1234567890QWERTY",
  resave: true,
  saveUninitialized: false,
  
}));

app.use(cors({
  origin: "http://localhost:4200",
  credentials: true
}));

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

app.use("/",routes);

app.use(proxy('http://localhost:4200'));



app.listen(process.env.PORT, (err) =>{
    if (err) throw err;
    console.log(`Listening on ${process.env.PORT}`)
})
