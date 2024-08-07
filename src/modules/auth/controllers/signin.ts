import { Request, Response } from 'express';
import { config } from '@root/config';
import JWT from 'jsonwebtoken';
import { joiValidation } from '@globals/decorators/joi-validation.decorators';
import HTTP_STATUS from 'http-status-codes';
import { authService } from '@service/db/auth.service';
import { loginSchema } from '@auth/schemes/signin';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { BadRequestError } from '@globals/helpers/error-handler';
import { IUserDocument } from '@user/interfaces/user.interface';
import { userService } from '@user/services/user.service';

export class SignIn {
  @joiValidation(loginSchema)
  public async read(req: Request, res: Response): Promise<void> {
    // console.log('Request body:', req.body); // Log del cuerpo de la solicitud

    const { username, password } = req.body;

    try {
      const existingUser: IAuthDocument = await authService.getAuthUserByUsername(username);
      // console.log('Existing user:', existingUser); // Log del usuario existente

      if (!existingUser) {
        // console.log('User not found');
        throw new BadRequestError('Invalid credentials');
      }

      const passwordsMatch: boolean = await existingUser.comparePassword(password);
      // console.log('Passwords match:', passwordsMatch); // Log de la comparación de contraseñas

      if (!passwordsMatch) {
        // console.log('Passwords do not match');
        throw new BadRequestError('Invalid credentials');
      }

      const user: IUserDocument = await userService.getUserByAuthId(`${existingUser._id}`);
      // console.log('User document:', user); // Log del documento del usuario

      const userJwt: string = JWT.sign(
        {
          userId: existingUser._id,
          uId: existingUser.uId,
          email: existingUser.email,
          username: existingUser.username,
          avatarColor: existingUser.avatarColor
        },
        config.JWT_TOKEN!
      );
      // console.log('JWT token:', userJwt); // Log del token JWT

      req.session = { jwt: userJwt };
      // console.log('Session set:', req.session); // Log de la sesión

      const userDocument: IUserDocument = {
        ...user,
        authId: existingUser!._id,
        username: existingUser!.username,
        email: existingUser!.email,
        avatarColor: existingUser!.avatarColor,
        uId: existingUser!.uId,
        createdAt: existingUser!.createdAt
      } as IUserDocument;
      // console.log('User document to be sent:', userDocument); // Log del documento de usuario a enviar

      res.status(HTTP_STATUS.OK).json({ message: 'User login successfully', user: userDocument, token: userJwt });
    } catch (error) {
      console.error('Error during login:', error); // Log de cualquier error ocurrido
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }
  }
}
