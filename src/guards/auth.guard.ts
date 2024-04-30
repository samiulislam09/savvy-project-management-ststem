import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { Request } from "express";


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if(!request.headers.authorization) {
            throw new UnauthorizedException('Unauthorized access');
        }
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException('Unauthorized access');
        }
        try{
            const payload = await this.jwtService.verifyAsync(token, {secret: 'secret'});
            request.user = payload;
        }
        catch (error) {
            throw new UnauthorizedException('Unauthorized access');
        }
        return true;
        
    }
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization.split(' ')??[];
        return type === 'Bearer' ? token : undefined;
    }
}