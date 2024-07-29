import { Controller, Post, Body, Req, Res, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';

class LoginDto {
    @ApiProperty({default: 'pavel'})
    username: string;

    @ApiProperty({default: 'pavel'})
    password: string;
}

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @HttpCode(200)
    @ApiBody({ type: LoginDto }) 
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() loginDto: LoginDto, @Req() req, @Res() res): Promise<any> {
        let authorized: boolean = this.authService.validateUser(loginDto.username, loginDto.password);
        if (authorized) {
            req.session.user = loginDto.username;  // create user in session 
            return res.json({ message: 'Login successful' });

        } else {
            return res.status(401).send({ message: 'wrong password, so Invalid credentials' });
        }
    }

    @Post('logout')
    @HttpCode(200)
    async logout(@Req() req, @Res() res) {
        req.session.destroy();
        return res.json({ message: 'Logout successful' });
    }
}