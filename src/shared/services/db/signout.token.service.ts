import { config } from '@root/config';
import { sign } from 'jsonwebtoken';

export function signToken(id: number, email: string, username: string): string {
    return sign(
      {
        id,
        email,
        username
      },
      config.JWT_TOKEN!
        );
  }
  