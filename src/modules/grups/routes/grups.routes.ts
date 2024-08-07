import express, { Router } from 'express';

import { authMiddleware } from '@globals/helpers/auth-middleware';

class GrupsRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/grups/all/:page', authMiddleware.checkAuthentication, (req,res)=>(res.send('hola')));
    this.router.get('/grups/images/:page', authMiddleware.checkAuthentication, (req,res)=>(res.send('hola')));

    this.router.post('/grups', authMiddleware.checkAuthentication, (req,res)=>(res.send('hola')));
    this.router.post('/grups/image', authMiddleware.checkAuthentication, (req,res)=>(res.send('hola')));

    this.router.delete('/grups/:blogId', authMiddleware.checkAuthentication, (req,res)=>(res.send('hola')));

    return this.router;
  }
}

export const grupsRoutes: GrupsRoutes = new GrupsRoutes();
