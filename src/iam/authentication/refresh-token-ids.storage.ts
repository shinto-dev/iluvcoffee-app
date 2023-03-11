import {
  Inject,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigType } from '@nestjs/config';
import RedisConfig from '../config/redis.config';

@Injectable()
export class RefreshTokenIdsStorage
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  redisClient: Redis;

  constructor(
    @Inject(RedisConfig.KEY)
    private readonly redisConfig: ConfigType<typeof RedisConfig>,
  ) {}

  onApplicationBootstrap(): any {
    // TODO: Ideally, we should move this to a dedicated "RedisModule"
    this.redisClient = new Redis({
      host: this.redisConfig.host,
      port: this.redisConfig.port,
      username: this.redisConfig.username,
      password: this.redisConfig.password,
    });
  }

  onApplicationShutdown(signal?: string): any {
    return this.redisClient.quit();
  }

  async insert(userId: number, tokenId: string): Promise<void> {
    //todo add expiration
    await this.redisClient.set(this.getKey(userId), tokenId);
  }

  async validate(userId: number, tokenId: string): Promise<boolean> {
    const storedTokenId = await this.redisClient.get(this.getKey(userId));
    return storedTokenId === tokenId;
  }

  async remove(userId: number): Promise<void> {
    await this.redisClient.del(this.getKey(userId));
  }

  private getKey(userId: number): string {
    return `user: ${userId}:session`;
  }
}
