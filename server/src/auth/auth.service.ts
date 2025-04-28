import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private jwtService: JwtService) { };

    async register(email: string, number: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 12);

        const role = email === process.env.ADMIN_EMAIL as string || number === process.env.ADMIN_TELEPHONE as string ? process.env.ADMIN_ROLE as string : 'User';

        try {
            await this.prisma.users.create({
                data: {
                    email,
                    number,
                    role,
                    password: hashedPassword
                }
            });

            const currentUser = await this.prisma.users.findFirst({
                where: {
                    OR: [
                        { email: email },
                        { number: number }
                    ]
                }
            });

            if(!currentUser) throw new UnauthorizedException('Registration error!!!');;

            const payload = { sub: currentUser.id, email: currentUser.email, number: currentUser.number, role: currentUser.role };

            return {
                access_token: this.jwtService.sign(payload)
            };
        }
        catch (error) {
            console.error(error);
            if (error.code === 'P2002') throw new ConflictException('The user already exists!!!');
            throw new InternalServerErrorException('Server error during registration!!!');
        }
    };

    async login(login: string, password: string): Promise<{ access_token: string }> {
        const currentUser = await this.prisma.users.findFirst({
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

        const payload = { sub: verifiedUser.id, email: verifiedUser.email, number: verifiedUser.number, role: verifiedUser.role };

        return {
            access_token: this.jwtService.sign(payload)
        };
    };
}
