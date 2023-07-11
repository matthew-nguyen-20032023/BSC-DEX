import { Command, Console } from "nestjs-console";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserRepository } from "src/models/repositories/user.repository";
import { User, UserDocument, UserRole } from "src/models/schemas/user.schema";
import { AuthMessageError } from "src/modules/authentication/auth.const";
import * as bcrypt from "bcrypt";

@Console()
export class AuthConsole {
  private userRepository: UserRepository;

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>
  ) {
    this.userRepository = new UserRepository(this.userModel);
  }

  @Command({ command: "register <email> <password> <role>" })
  async autoCompleteStake(
    email: string,
    password: string,
    userRole: UserRole
  ): Promise<void> {
    const existUser = await this.userRepository.getUserByEmail(email);
    if (existUser) throw Error(AuthMessageError.EmailTaken);

    const newUser = new User();
    newUser.email = email;
    newUser.password = await bcrypt.hash(
      password,
      Number(process.env.SALT_OR_ROUNDS)
    );
    newUser.role = userRole;
    const userCreated = await this.userRepository.save(newUser);
    console.log("User created", userCreated);
  }
}
