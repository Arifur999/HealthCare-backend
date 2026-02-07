import express, { Application, NextFunction, Request, Response } from 'express';
import { prisma } from './app/lib/prisma';
import { indexRoute } from './app/routes';
import { errorHandler } from './app/middleware/globalErrorHandler';
const app: Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());



//-------------------start------------------------------


app.use('/api/v1',indexRoute)  

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use (errorHandler)



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