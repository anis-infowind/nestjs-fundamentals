import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from 'src/auth/dto/login.dto';
import { ArtistsService } from 'src/artists/artists.service';
import { v4 as uuid4 } from "uuid";
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    
    private artistService: ArtistsService
  ) {}

  async create(userDTO: CreateUserDTO): Promise<UserDocument> {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email: userDTO.email });
    if (existingUser) {
      throw new HttpException({
        status: HttpStatus.CONFLICT,
        error: 'User with this email already exists',
      }, HttpStatus.CONFLICT);
    }

    userDTO.apiKey = uuid4(); // generate unique API key for each user
    const salt = await bcrypt.genSalt(); // 2.
    userDTO.password = await bcrypt.hash(userDTO.password, salt); // 3.
    const createdUser = await this.userModel.create(userDTO); // 4.
    // Create the artist for this user
    await this.artistService.createArtistForUser(createdUser);

    return createdUser.toObject();

  }

  async findOne(data: LoginDTO): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email: data.email });

    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email: email });
    return user;
  }

  async findById(id: string): Promise<UserDocument | null> {
    const user = await this.userModel.findById(id);
    return user;
  }

  async updateSecretKey(userId: string, secret: string): Promise<UserDocument | null> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { twoFASecret: secret, enable2FA: true },
      { new: true }
    );
    return updatedUser;
  }

  async disable2FA(userId: string): Promise<UserDocument | null> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { enable2FA: false },
      { new: true }
    );
    return updatedUser;
  }

  async findByApiKey(apiKey: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ apiKey }).exec();
  }
}