import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserRepository } from "src/models/repositories/user.repository";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "src/models/schemas/user.schema";
import { Model } from "mongoose";
import { AuthMessageError } from "src/modules/authentication/auth.const";
import { ILoginResponse } from "src/modules/authentication/auth.interface";

@Injectable()
export class AuthService {
  private userRepository: UserRepository;

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) {
    this.userRepository = new UserRepository(this.userModel);
  }

  public async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.getUserByEmail(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  public static async checkPasswordMatch(
    password: string,
    hashPassword: string,
    errorMessage: string
  ): Promise<void> {
    const isMatchPassword = await bcrypt.compare(password, hashPassword);
    if (!isMatchPassword) {
      throw new HttpException(
        { message: errorMessage },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  public async login(email: string, password: string): Promise<ILoginResponse> {
    const user = await this.userRepository.getUserByEmail(email);

    await AuthService.checkPasswordMatch(
        password,
        user.password,
        AuthMessageError.WrongEmailOrPassword
    );
    const accessToken = this.jwtService.sign({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      userId: user._id,
    };
  }
}
