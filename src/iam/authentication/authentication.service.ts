import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { HashingService } from '../hashing/hashing.service';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sing-in.dto';
import { JwtService } from '@nestjs/jwt';
import JwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { randomUUID } from 'crypto';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage';

const errCodePgUniqueViolation = '23505';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private readonly RefreshTokenIdsStorage: RefreshTokenIdsStorage,
    @Inject(JwtConfig.KEY)
    private readonly jwtConfig: ConfigType<typeof JwtConfig>,
  ) {}

  async signUp(signupDto: SignUpDto) {
    const password = await this.hashingService.hash(signupDto.password);
    const user = {
      ...this.userRepository.create(signupDto),
      password,
    };

    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === errCodePgUniqueViolation) {
        throw new ConflictException();
      }
      throw error;
    }
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userRepository.findOne({
      where: { email: signInDto.email },
    });
    if (!user) {
      throw new UnauthorizedException('user does not exist');
    }

    const isPasswordValid = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('invalid credentials');
    }

    return await this.generateTokens(user);
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfig.secret,
        issuer: this.jwtConfig.issuer,
        audience: this.jwtConfig.audience,
      });

      const isRefreshTokenExists = await this.RefreshTokenIdsStorage.validate(
        sub,
        refreshTokenId,
      );
      if (!isRefreshTokenExists) {
        throw Error('Refresh token is invalid');
      }

      const user = await this.userRepository.findOneByOrFail({ id: sub });
      return await this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('invalid refresh token');
    }
  }

  private async generateTokens(user: User) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      await this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfig.accessTokenTTL,
        {
          email: user.email,
        },
      ),
      await this.signToken(user.id, this.jwtConfig.refreshTokenTTL, {
        refreshTokenId,
      }),
    ]);

    await this.RefreshTokenIdsStorage.insert(user.id, refreshTokenId);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId, //todo deprecated, find a better way
        ...payload,
      },
      {
        secret: this.jwtConfig.secret,
        issuer: this.jwtConfig.issuer,
        audience: this.jwtConfig.audience,
        expiresIn: expiresIn,
      },
    );
  }
}
