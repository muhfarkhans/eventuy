import { Test, TestingModule } from '@nestjs/testing';
import { AuthAdminController } from './auth-admin.controller';
import { AuthAdminService } from './auth-admin.service';

class MockAuthAdminService {}

describe('AuthAdminController', () => {
  let controller: AuthAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthAdminController],
      providers: [
        { provide: AuthAdminService, useClass: MockAuthAdminService },
      ],
    }).compile();

    controller = module.get<AuthAdminController>(AuthAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
