import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@/common/enums/role.enum';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { UsersService } from '@/users/users.service';
import { User } from '@/users/entities/user.entity';
import { AuthService } from '@/auth/auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser: User = {
    id: 'user-1',
    username: 'alice',
    passwordHash: 'hashed',
    role: Role.USER,
    createdAt: new Date(),
    reservations: [],
  };

  const adminUser: User = {
    ...mockUser,
    id: 'admin-1',
    username: 'admin',
    role: Role.ADMIN,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            findByUsername: jest.fn(),
            findById: jest.fn(),
            validatePassword: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('returns user response from created user', async () => {
      usersService.createUser.mockResolvedValue(mockUser);

      const result = await service.register({
        username: 'alice',
        password: 'secret',
        role: Role.USER,
      });

      expect(usersService.createUser).toHaveBeenCalledWith(
        'alice',
        'secret',
        Role.USER,
      );
      expect(result).toEqual({
        id: 'user-1',
        username: 'alice',
        role: Role.USER,
      });
    });
  });

  describe('loginForRole', () => {
    const loginDto = { username: 'alice', password: 'secret' };

    it('throws UnauthorizedException when user not found', async () => {
      usersService.findByUsername.mockResolvedValue(null);

      await expect(
        service.loginForRole(loginDto, Role.USER),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when password is invalid', async () => {
      usersService.findByUsername.mockResolvedValue(mockUser);
      usersService.validatePassword.mockResolvedValue(false);

      await expect(
        service.loginForRole(loginDto, Role.USER),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws admin message when USER tries ADMIN login', async () => {
      usersService.findByUsername.mockResolvedValue(mockUser);
      usersService.validatePassword.mockResolvedValue(true);

      await expect(
        service.loginForRole(loginDto, Role.ADMIN),
      ).rejects.toThrow(
        new BadRequestException(
          'This account does not have administrator access',
        ),
      );
    });

    it('throws user message when ADMIN tries USER login', async () => {
      usersService.findByUsername.mockResolvedValue(adminUser);
      usersService.validatePassword.mockResolvedValue(true);

      await expect(
        service.loginForRole(
          { username: 'admin', password: 'secret' },
          Role.USER,
        ),
      ).rejects.toThrow(
        new BadRequestException('Please use a user account to log in'),
      );
    });

    it('returns token and user on successful USER login', async () => {
      usersService.findByUsername.mockResolvedValue(mockUser);
      usersService.validatePassword.mockResolvedValue(true);
      jwtService.sign.mockReturnValue('jwt-token');

      const result = await service.loginForRole(loginDto, Role.USER);

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'user-1',
        username: 'alice',
        role: Role.USER,
      });
      expect(result).toEqual({
        accessToken: 'jwt-token',
        user: { id: 'user-1', username: 'alice', role: Role.USER },
      });
    });

    it('returns token and user on successful ADMIN login', async () => {
      usersService.findByUsername.mockResolvedValue(adminUser);
      usersService.validatePassword.mockResolvedValue(true);
      jwtService.sign.mockReturnValue('admin-jwt');

      const result = await service.loginForRole(
        { username: 'admin', password: 'secret' },
        Role.ADMIN,
      );

      expect(result.accessToken).toBe('admin-jwt');
      expect(result.user.role).toBe(Role.ADMIN);
    });
  });

  describe('getProfile', () => {
    it('returns user response', async () => {
      usersService.findById.mockResolvedValue(mockUser);

      await expect(service.getProfile('user-1')).resolves.toEqual({
        id: 'user-1',
        username: 'alice',
        role: Role.USER,
      });
    });
  });

  describe('validateJwtPayload', () => {
    it('maps JWT payload to authenticated user', () => {
      const payload: JwtPayload = {
        sub: 'user-1',
        username: 'alice',
        role: Role.USER,
      };

      expect(service.validateJwtPayload(payload)).toEqual({
        id: 'user-1',
        username: 'alice',
        role: Role.USER,
      });
    });
  });
});
