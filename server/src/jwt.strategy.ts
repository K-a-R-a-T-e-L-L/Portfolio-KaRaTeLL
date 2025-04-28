import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.SECRET_KEY_TOKEN_JWT as string,
        });
    }

    async validate(payload: any) {
        const user = await this.prisma.users.findUnique({
            where: { id: payload.sub },
            select: { id: true, email: true, number: true }
        });

        if (!user) throw new UnauthorizedException('Invalid token');

        return {
            ...user,
            role: payload.role
        };
    }
}