import { Test, TestingModule } from '@nestjs/testing';
import { AuthAdminService } from './auth-admin.service';
import { AdminService } from 'src/admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

class MockAdminService {}
class MockJwtService {}
class MockConfigService {}

describe('AuthAdminService', () => {
  let service: AuthAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthAdminService,
        { provide: AdminService, useClass: MockAdminService },
        { provide: JwtService, useClass: MockJwtService },
        { provide: ConfigService, useClass: MockConfigService },
      ],
    }).compile();

    service = module.get<AuthAdminService>(AuthAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
