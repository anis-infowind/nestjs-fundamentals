import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from "bcryptjs";
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService
  ) {}
  async login(loginDTO: LoginDTO): Promise<User> {
    const user = await this.userService.findOne(loginDTO); // 1.
    const passwordMatched = await bcrypt.compare(loginDTO.password, user.password); // 2.
    if (passwordMatched) {
    // 3.
    const { password, ...userWithoutPassword } = user; // 5.
    return userWithoutPassword as User;  // 4.
      return user;
    } else {
      throw new UnauthorizedException("Password does not match"); // 5.
    }
  }
}
