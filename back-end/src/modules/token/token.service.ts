import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { TokenRepository } from "src/models/repositories/token.repository";
import { Token, TokenDocument } from "src/models/schemas/token.schema";
import { Binance } from "src/blockchains/binance";
import { TokenMessageError } from "src/modules/token/token.const";

@Injectable()
export class TokenService {
  private tokenRepository: TokenRepository;

  constructor(
    @InjectModel(Token.name)
    private readonly tokenModel: Model<TokenDocument>
  ) {
    this.tokenRepository = new TokenRepository(this.tokenModel);
  }

  public async addToken(tokenAddress: string): Promise<Token> {
    const existToken = await this.tokenRepository.getTokenByAddress(
      tokenAddress
    );

    if (existToken) {
      throw new HttpException(
        { message: TokenMessageError.ExistTokenAdded },
        HttpStatus.BAD_REQUEST
      );
    }

    const tokenInformation = await Binance.getInstance().getERC20TokenInfo(
      tokenAddress
    );

    const newToken = new Token();
    newToken.name = tokenInformation.name;
    newToken.symbol = tokenInformation.symbol;
    newToken.decimals = tokenInformation.decimals;
    newToken.address = tokenAddress;

    return this.tokenRepository.save(newToken);
  }

  public async listToken(
    page: number,
    limit: number
  ): Promise<{ data: Token[]; total: number }> {
    if (page < 1) page = 1;
    if (limit < 10) limit = 10;
    const [data, total] = await Promise.all([
      await this.tokenRepository.listToken(page, limit),
      await this.tokenRepository.countTotalToken(),
    ]);
    if (data.length === 0) {
      throw new HttpException(
        { message: TokenMessageError.TokenNotFound },
        HttpStatus.BAD_REQUEST
      );
    }
    return {
      data,
      total,
    };
  }

  public async getTokenByAddress(tokenAddress: string): Promise<Token> {
    const token = await this.tokenRepository.getTokenByAddress(tokenAddress);
    if (!token) {
      throw new HttpException(
        { message: TokenMessageError.TokenNotFound },
        HttpStatus.BAD_REQUEST
      );
    }
    return token;
  }
}
