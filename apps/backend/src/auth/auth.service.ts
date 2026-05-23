import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@/common/enums/role.enum';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { AuthenticatedUser } from '@/common/interfaces/authenticated-user.interface';
import { UsersService } from '@/users/users.service';
import { User } from '@/users/entities/user.entity';
import { LoginDto } from '@/auth/dto/login.dto';
import { RegisterDto } from '@/auth/dto/register.dto';
import { LoginResponseDto, UserResponseDto } from '@/auth/dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<UserResponseDto> {
    const user = await this.usersService.createUser(
      dto.username,
      dto.password,
      dto.role,
    );
    return this.toUserResponse(user);
  }

  async loginForRole(dto: LoginDto, expectedRole: Role): Promise<LoginResponseDto> {
    const user = await this.usersService.findByUsername(dto.username);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const valid = await this.usersService.validatePassword(user, dto.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    if (user.role !== expectedRole) {
      throw new BadRequestException(
        expectedRole === Role.ADMIN
          ? 'This account does not have administrator access'
          : 'Please use a user account to log in',
      );
    }

    return {
      accessToken: this.signToken(user),
      user: this.toUserResponse(user),
    };
  }

  async getProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.usersService.findById(userId);
    return this.toUserResponse(user);
  }

  validateJwtPayload(payload: JwtPayload): AuthenticatedUser {
    return {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }

  private signToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  private toUserResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      role: user.role,
    };
  }
}
