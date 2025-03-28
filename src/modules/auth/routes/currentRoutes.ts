import { CurrentUser } from '@auth/controllers/current-user';
import { authMiddleware } from '@globals/helpers/auth-middleware';

import express, { Router } from 'express';

class CurrentUserRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/currentuser', authMiddleware.checkAuthentication, CurrentUser.prototype.read);
    this.router.get('/refresh-token', authMiddleware.checkAuthentication, CurrentUser.prototype.token);

    return this.router;
  }
}

export const currentUserRoutes: CurrentUserRoutes = new CurrentUserRoutes();
