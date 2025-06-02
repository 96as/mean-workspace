import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import { RegisterDto, LoginDto, AuthResponseDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { name, email, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // Generate JWT token
    const payload = { sub: savedUser._id, email: savedUser.email };
    const access_token = this.jwtService.sign(payload, { expiresIn: '8h' });

    return {
      token: access_token,
      user: {
        id: savedUser._id.toString(),
        email: savedUser.email,
        name: savedUser.name,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: user._id, email: user.email };
    const access_token = this.jwtService.sign(payload, { expiresIn: '8h' });

    return {
      token: access_token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userModel.findById(userId).select('-password');
  }
}