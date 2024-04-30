import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  
  async create(createUserDto: CreateUserDto) {
    const userExists = await this.userRepository.findOne({where: {email: createUserDto.email}});
    if (userExists) {
      throw new NotFoundException('User already exists');
    }
    const user =  this.userRepository.create(createUserDto);
    const date = new Date();
    user.createdAt = date;
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    return this.userRepository.save(user);
  }
  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({where: {email: loginUserDto.email}});
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const match = await bcrypt.compare(loginUserDto.password, user.password);
    if (!match) {
      throw new NotFoundException('Invalid credentials');
    }
    const token = await this.jwtService.signAsync({id: user.id});
    return {token};
  }

  findOne(id: number) {
    const user = this.userRepository.findOne({where: {id}});
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateById(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({where: {id}});
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.name = updateUserDto.name || user.name;
    user.email = updateUserDto.email || user.email;
    user.password = updateUserDto.password || user.password;
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({where: {id}});
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.remove(user);
  }
}
