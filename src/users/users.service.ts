import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from 'src/auth/dto/login.dto';
import { ArtistsService } from 'src/artists/artists.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>, // 1.
    private artistService: ArtistsService
  ) {}

  async create(userDTO: CreateUserDTO): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOneBy({ email: userDTO.email });
    if (existingUser) {
      throw new HttpException({
        status: HttpStatus.CONFLICT,
        error: 'User with this email already exists',
      }, HttpStatus.CONFLICT);
    }
    const salt = await bcrypt.genSalt(); // 2.
    userDTO.password = await bcrypt.hash(userDTO.password, salt); // 3.
    const user = await this.userRepository.save(userDTO); // 4.

    // Create the artist for this user
    await this.artistService.createArtistForUser(user);
    const { password, ...userWithoutPassword } = user; // 5.
    return userWithoutPassword as User; // 6.
    // Now, the password property is completely removed from the user object before it is returned, so it will not be sent in the response. This approach is type-safe and avoids TypeScript errors. Let me know if you need this applied elsewhere or want to handle it differently!
  }

  async findOne(data: LoginDTO): Promise<any> {
    const user = await this.userRepository.findOneBy({ email: data.email });
    
    return user;
  }

  async findByEmail(email: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }
}