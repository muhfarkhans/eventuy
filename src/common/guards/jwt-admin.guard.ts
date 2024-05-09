import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { Observable } from 'rxjs';

@Injectable()
export class JwtAdminGuard extends AuthGuard(['jwt-admin', 'jwt-client']) {
  constructor() {
    super({});
  }
  // canActivate(
  //   context: ExecutionContext,
  // ): boolean | Promise<boolean> | Observable<boolean> {
  //   return super.canActivate(context);
  // }
}
