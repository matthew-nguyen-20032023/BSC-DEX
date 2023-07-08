import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserRepository } from "src/models/repositories/user.repository";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument, UserRole } from "src/models/schemas/user.schema";
import { Model } from "mongoose";
import { AuthMessageError } from "src/modules/authentication/auth.const";
import { ILoginResponse } from "src/modules/authentication/auth.interface";
const { ethers } = require("ethers");

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

  public async register(
    email: string,
    password: string,
    userRole: UserRole
  ): Promise<User> {
    const existUser = await this.userRepository.getUserByEmail(email);
    if (existUser) {
      throw new HttpException(
        { message: AuthMessageError.EmailTaken },
        HttpStatus.BAD_REQUEST
      );
    }

    const newUser = new User();
    newUser.email = email;
    newUser.password = await bcrypt.hash(
      password,
      Number(process.env.SALT_OR_ROUNDS)
    );
    newUser.role = userRole;
    return this.userRepository.save(newUser);
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

  public async loginWithWallet(signedMessage: string): Promise<ILoginResponse> {
    const signer = ethers.utils.verifyMessage("authByWallet", signedMessage);
    console.log(signer);
    const accessToken = this.jwtService.sign({
      walletAddress: signer,
    });

    return {
      accessToken,
    };
  }
}
