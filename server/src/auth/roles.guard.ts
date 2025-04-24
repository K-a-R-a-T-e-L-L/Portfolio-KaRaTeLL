import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {

        const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();

        if (!request.user?.role) {
            throw new UnauthorizedException('User role not defined');
        }

        if (!requiredRoles.includes(request.user.role)) {
            throw new UnauthorizedException('Insufficient permissions');
        }

        return true;
    }
}