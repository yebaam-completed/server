import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { authService } from '@service/db/auth.service';
import { signToken } from '@service/db/signout.token.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export async function RefresToken(req: Request, res: Response,username:string): Promise<void> {
  const existingUser: IAuthDocument | undefined = await authService.getAuthUserByUsername(username);
  const userJWT: string = signToken(existingUser!.id!, existingUser!.email!, existingUser!.username!);
  res.status(StatusCodes.OK).json({ message: 'Refresh token', user: existingUser, token: userJWT });
}
