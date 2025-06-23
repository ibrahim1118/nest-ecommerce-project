import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed() {
    const adminExists = await this.userRepository.findOne({
      where: { email: 'admin@example.com' }
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Admin123!@#', 10);
      
      await this.userRepository.save({
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        password: hashedPassword,
        role: UserRole.ADMIN,
        isActive: true
      });
    }

    const userExists = await this.userRepository.findOne({
      where: { email: 'user@example.com' }
    });

    if (!userExists) {
      const hashedPassword = await bcrypt.hash('User123!@#', 10);
      
      await this.userRepository.save({
        email: 'user@example.com',
        firstName: 'Regular',
        lastName: 'User',
        password: hashedPassword,
        role: UserRole.USER,
        isActive: true
      });
    }
  }
} 