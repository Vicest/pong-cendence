// Main Server
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from 'express'
const app = express();
import { userroutes } from './routes/user.routes.js'
import { chatroutes } from "./routes/mockupchat.routes.js";
import session from 'express-session'
import cors from 'cors'
import proxy from 'express-http-proxy'

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

app.use("/",userroutes);
app.use("/",chatroutes); // TEST

app.use(proxy('http://localhost:4200'));



app.listen(process.env.PORT, (err) =>{
    if (err) throw err;
    console.log(`Listening on ${process.env.PORT}`)
})
