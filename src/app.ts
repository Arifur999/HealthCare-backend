import express, { Application, Request, Response } from 'express';
import { prisma } from './app/lib/prisma';
import { indexRoute } from './app/routes';
import { errorHandler } from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import cookieParser from 'cookie-parser';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './app/lib/auth';
import path from 'path';
import cors from 'cors';
import { env } from './config/env';
import qs from "qs";



const app: Application = express();
app.set("query parser",(str:string)=>qs.parse(str));



app.set("view engine", "ejs")
app.set("views", path.resolve(process.cwd(),`src/app/templates`))

app.post("/webhook",express.raw({type:"application/json"}),async (req:Request,res:Response)=>{
 console.log("webhook received :", req.body);
  res.status(200).json({received:true});
});

app.use(cors({
  origin:[env.FRONTEND_URL,env.BETTER_AUTH_URL,"http://localhost:5000","http://localhost:3000"],
  credentials:true,
  methods:["GET","POST","PUT","DELETE"],
  allowedHeaders:["Content-Type","Authorization"],
  
}))

app.use("/api/auth",toNodeHandler(auth))

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());



//-------------------start------------------------------


app.use('/api/v1',indexRoute)  



//-------------------global------------------------------
app.use (errorHandler)
app.use(notFound)

// Basic route
app.get('/', async (req: Request, res: Response) => {

const specialty = await prisma.specialty.create({
  data: {
    title: 'Cardiology',
    description: 'Specialty focused on heart-related conditions and diseases.',
  },
})
res.status(200).json({
success: true,
data: specialty,
message: 'Specialty created successfully',

})


  res.send('Hello, TypeScript + Express!');
});

export default app;