import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('project/adding')
export class ProtectedController {
    @Get()
    @UseGuards(AuthGuard('jwt'))
    getProtectedResource() {
        return { message: 'This is a protected resource!!!' };
    }
}