import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Role } from '@/common/enums/role.enum';
import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

  const mockUser: User = {
    id: 'user-1',
    username: 'alice',
    passwordHash: 'hashed',
    role: Role.USER,
    createdAt: new Date(),
    reservations: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(UsersService);
    repository = module.get(getRepositoryToken(User));
    jest.clearAllMocks();
  });

  describe('findByUsername', () => {
    it('returns user when found', async () => {
      repository.findOne.mockResolvedValue(mockUser);

      await expect(service.findByUsername('alice')).resolves.toBe(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { username: 'alice' },
      });
    });

    it('returns null when not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findByUsername('missing')).resolves.toBeNull();
    });
  });

  describe('findById', () => {
    it('returns user when found', async () => {
      repository.findOne.mockResolvedValue(mockUser);

      await expect(service.findById('user-1')).resolves.toBe(mockUser);
    });

    it('throws NotFoundException when user does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findById('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createUser', () => {
    it('throws ConflictException when username already exists', async () => {
      repository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.createUser('alice', 'password', Role.USER),
      ).rejects.toThrow(ConflictException);
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    it('creates user with hashed password and default USER role', async () => {
      repository.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('new-hash');
      repository.create.mockReturnValue({
        ...mockUser,
        username: 'bob',
        passwordHash: 'new-hash',
      });
      repository.save.mockResolvedValue({
        ...mockUser,
        id: 'user-2',
        username: 'bob',
        passwordHash: 'new-hash',
        role: Role.USER,
      });

      const result = await service.createUser('bob', 'secret');

      expect(bcrypt.hash).toHaveBeenCalledWith('secret', 10);
      expect(repository.create).toHaveBeenCalledWith({
        username: 'bob',
        passwordHash: 'new-hash',
        role: Role.USER,
      });
      expect(result.username).toBe('bob');
      expect(result.role).toBe(Role.USER);
    });

    it('creates user with explicit ADMIN role', async () => {
      repository.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('admin-hash');
      repository.create.mockReturnValue({
        ...mockUser,
        username: 'admin2',
        role: Role.ADMIN,
      });
      repository.save.mockResolvedValue({
        ...mockUser,
        username: 'admin2',
        role: Role.ADMIN,
      });

      const result = await service.createUser('admin2', 'secret', Role.ADMIN);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ role: Role.ADMIN }),
      );
      expect(result.role).toBe(Role.ADMIN);
    });
  });

  describe('validatePassword', () => {
    it('returns true when bcrypt compare succeeds', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(
        service.validatePassword(mockUser, 'correct'),
      ).resolves.toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith('correct', 'hashed');
    });

    it('returns false when bcrypt compare fails', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validatePassword(mockUser, 'wrong'),
      ).resolves.toBe(false);
    });
  });
});
