import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthLoginDTO, CreateAuthRegisterDTO } from './create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() createAuthRegisterDTO: CreateAuthRegisterDTO){
    const {email, number, password} = createAuthRegisterDTO;
    return this.authService.register(email, number, password);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() createAuthLoginDTO: CreateAuthLoginDTO): Promise<{ access_token: string }> {
    const { login, password } = createAuthLoginDTO;
    return this.authService.login(login, password);
  }
}
