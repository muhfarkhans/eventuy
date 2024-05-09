import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(private jwt: JwtService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    if (request.headers.authorization) {
      const accessToken: string = request.headers.authorization.split(' ')[1];
      const decoded = this.jwt.decode(accessToken);
      request._jwt = decoded;
    }

    return next.handle();
  }
}
