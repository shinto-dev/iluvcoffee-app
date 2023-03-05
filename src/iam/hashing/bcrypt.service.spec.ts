import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from './bcrypt.service';

describe('BcryptService', () => {
  let service: BcryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptService],
    }).compile();

    service = module.get<BcryptService>(BcryptService);
  });

  it('should hash a password', async () => {
    const password = 'password';
    const hashedPassword = await service.hash(password);
    expect(hashedPassword).not.toBe(password);
  });

  it('should compare a password', async () => {
    const password = 'password';
    const hashedPassword = await service.hash(password);
    const isPasswordValid = await service.compare(password, hashedPassword);
    expect(isPasswordValid).toBe(true);
  });

  it('should compare a password - incorrect', async () => {
    const password = 'password';
    const hashedPassword = await service.hash(password);
    const isPasswordValid = await service.compare('wrong', hashedPassword);
    expect(isPasswordValid).toBe(false);
  });
});
