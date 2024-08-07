import express, { Router } from 'express';

import { authMiddleware } from '@globals/helpers/auth-middleware';

class BlogRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/blog/all/:page', authMiddleware.checkAuthentication, (req,res)=>(res.send('hola')));
    this.router.get('/blog/images/:page', authMiddleware.checkAuthentication, (req,res)=>(res.send('hola')));

    this.router.post('/blog', authMiddleware.checkAuthentication, (req,res)=>(res.send('hola')));
    this.router.post('/blog/image', authMiddleware.checkAuthentication, (req,res)=>(res.send('hola')));

    this.router.delete('/blog/:blogId', authMiddleware.checkAuthentication, (req,res)=>(res.send('hola')));

    return this.router;
  }
}

export const blogRoutes: BlogRoutes = new BlogRoutes();
