import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sing-in.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('sign-up')
  async signup(@Body() signupDto: SignUpDto) {
    return this.authenticationService.signup(signupDto);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() signinDto: SignInDto) {
    return this.authenticationService.signin(signinDto);
  }
}
