import express from 'express';

const app=express();

// Standard Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));


export default app;