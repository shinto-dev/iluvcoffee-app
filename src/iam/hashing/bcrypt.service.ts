import { Injectable } from '@nestjs/common';
import { HashingService } from './hashing.service';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class BcryptService extends HashingService {
  compare(password: string | Buffer, hash: string): Promise<boolean> {
    return compare(password, hash);
  }

  async hash(password: string | Buffer): Promise<string> {
    const salt = await genSalt();
    return hash(password, salt);
  }
}
