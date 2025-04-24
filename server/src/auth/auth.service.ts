import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private jwtService: JwtService) {};

    async register(email: string, number: string, password: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 12);
        try {
            return await this.prisma.user.create({
                data: {
                    email,
                    number,
                    password: hashedPassword
                }
            })
        }
        catch (error) {
            console.error(error);
            if (error.code === 'P2002') throw new ConflictException('The user already exists!!!');
            throw new InternalServerErrorException('Server error during registration!!!');
        }
    };

    async login(login: string, password: string): Promise<{ access_token: string }> {
        const currentUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: login },
                    { number: login },
                ],
            },
        });
        if (!currentUser) throw new UnauthorizedException('Invalid login!!!');

        const verifiedUser = await bcrypt.compare(password, currentUser.password) ? currentUser : null;
        if (!verifiedUser) throw new UnauthorizedException('Invalid password!!!');
        
        const role = verifiedUser.email === process.env.ADMIN_EMAIL as string || verifiedUser.number === process.env.ADMIN_TELEPHONE as string ? process.env.ADMIN_ROLE as string : 'User';

        const payload = { sub: verifiedUser.id, email: verifiedUser.email, number: verifiedUser.number, role: role };

        return {
            access_token: this.jwtService.sign(payload)
        };
    };
}
