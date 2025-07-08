import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from 'src/auth/dto/login.dto';
import { ArtistsService } from 'src/artists/artists.service';
import { v4 as uuid4 } from "uuid";

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

    userDTO.apiKey = uuid4(); // generate unique API key for each user
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

  async findById(id: number): Promise<any> {
    const user = await this.userRepository.findOneBy({ id: id });
    return user;
  }

  async updateSecretKey(userId: number, secret: string): Promise<UpdateResult> {
    return this.userRepository.update(
      { id: userId },
      {
        twoFASecret: secret,
        enable2FA: true,
      },
    );
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.userRepository.update(
      { id: userId },
      {
        enable2FA: false
      },
    );
  }

  async findByApiKey(apiKey: string): Promise<any> {
    return this.userRepository.findOneBy({ apiKey });
  }
}