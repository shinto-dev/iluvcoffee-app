import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sing-in.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';

@Controller('authentication')
@Auth(AuthType.None)
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('sign-up')
  async signUp(@Body() signupDto: SignUpDto) {
    return this.authenticationService.signup(signupDto);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signinDto: SignInDto) {
    return this.authenticationService.signin(signinDto);
  }

  // example of httpOnly cookie: more safer
  // @Post('sign-in')
  // @HttpCode(HttpStatus.OK)
  // async signin(
  //   @Res({ passthrough: true }) response,
  //   @Body() signInDto: SignInDto,
  // ) {
  //   const accessToken = await this.authenticationService.signin(signInDto);
  //   response.cookie('accessToken', accessToken, {
  //     secure: true,
  //     httpOnly: true,
  //     sameSite: true,
  //   });
  // }
}
