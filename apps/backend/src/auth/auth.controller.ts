import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Role } from '@/common/enums/role.enum';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@/common/interfaces/authenticated-user.interface';
import { AuthService } from '@/auth/auth.service';
import { LoginDto } from '@/auth/dto/login.dto';
import { RegisterDto } from '@/auth/dto/register.dto';
import {
  LoginResponseDto,
  UserResponseDto,
} from '@/auth/dto/auth-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  register(@Body() dto: RegisterDto): Promise<UserResponseDto> {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login and receive JWT' })
  @ApiQuery({
    name: 'role',
    required: true,
    enum: Role,
    description: 'Expected role from landing page selection',
  })
  login(
    @Body() dto: LoginDto,
    @Query('role') role?: Role,
  ): Promise<LoginResponseDto> {
    if (role !== Role.ADMIN && role !== Role.USER) {
      throw new BadRequestException('role query parameter is required');
    }
    return this.authService.loginForRole(dto, role);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile from JWT' })
  me(@CurrentUser() user: AuthenticatedUser): Promise<UserResponseDto> {
    return this.authService.getProfile(user.id);
  }
}
