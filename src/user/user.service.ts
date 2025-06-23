import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { validate as isUUID } from 'uuid';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user with email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(createUserDto.password);

    // Create new user
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async findAll(pagination: any): Promise<PaginatedResponse<User>> {
    const { page = 1, limit = 10, name, email, sort = "ASC" } = pagination;
    console.log(page, limit, name, email, sort);
    if (Number.isNaN(+page) || Number.isNaN(+limit)) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    if (sort !== "ASC" &&sort!=="DESC")
      throw new BadRequestException("Invalid sort parameter");
    const query = this.userRepository.createQueryBuilder('user');
    if(name) {
      query.andWhere('user.firstName LIKE :name', { name: `%${name}%` });
    }
    if(email) {
      query.andWhere('user.email LIKE :email', { email: `%${email}%` });
    }
    query.skip((page - 1) * limit);
    query.take(limit);
    query.orderBy('user.createdAt', sort);

    const [users, total] = await query.getManyAndCount();

    return {
      data: users,
      total,
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);

    // If updating password, hash it
    if (updateData.password) {
      updateData.password = await this.hashPassword(updateData.password);
    }

    // If updating email, check if new email already exists
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await this.findByEmail(updateData.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }

  async validatePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async getProfile(id: string): Promise<User> {
    console.log('Service ID:', id);
    
    // Validate UUID format
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID format');
    }

    const user = await this.userRepository.findOne({ 
      where: { id },
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'phoneNumber', 'address', 'createdAt', 'updatedAt']
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user;
  }
}
