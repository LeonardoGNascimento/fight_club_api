import { User, verifyToken } from '@clerk/backend';
import { JwtPayload } from '@clerk/types';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { ClerkClient } from '@clerk/backend';

@Injectable()
export class ClerkStrategy extends PassportStrategy(Strategy, 'clerk') {
  constructor(
    @Inject('ClerkClient')
    private readonly clerkClient: ClerkClient,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async validate(req: Request): Promise<User> {
    const token: string = req.headers.authorization?.split(' ').pop();

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const tokenPayload: JwtPayload = await verifyToken(token, {
        secretKey: this.configService.get('CLERK_SECRET_KEY'),
      });

      return await this.clerkClient.users.getUser(tokenPayload.sub);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
