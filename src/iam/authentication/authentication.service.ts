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

const errCodePgUniqueViolation = '23505';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(JwtConfig.KEY)
    private readonly jwtConfig: ConfigType<typeof JwtConfig>,
  ) {}

  async signup(signupDto: SignUpDto) {
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

  async signin(signinDto: SignInDto) {
    const user = await this.userRepository.findOne({
      where: { email: signinDto.email },
    });
    if (!user) {
      throw new UnauthorizedException('user does not exist');
    }

    const isPasswordValid = await this.hashingService.compare(
      signinDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('invalid credentials');
    }

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id, //todo deprecated, find a better way
        email: user.email,
      },
      {
        secret: this.jwtConfig.secret,
        issuer: this.jwtConfig.issuer,
        audience: this.jwtConfig.audience,
        expiresIn: this.jwtConfig.accessTokenTTL,
      },
    );

    return {
      accessToken,
    };
  }
}
