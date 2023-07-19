import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { PairRepository } from "src/models/repositories/pair.repository";
import { Pair, PairDocument, PairStatus } from "src/models/schemas/pair.schema";
import { Token, TokenDocument } from "src/models/schemas/token.schema";
import { TokenRepository } from "src/models/repositories/token.repository";
import { PairMessageError } from "src/modules/pair/pair.const";

@Injectable()
export class PairService {
  private pairRepository: PairRepository;
  private tokenRepository: TokenRepository;

  constructor(
    @InjectModel(Pair.name)
    private readonly pairModel: Model<PairDocument>,
    @InjectModel(Token.name)
    private readonly tokenModel: Model<TokenDocument>
  ) {
    this.pairRepository = new PairRepository(this.pairModel);
    this.tokenRepository = new TokenRepository(this.tokenModel);
  }

  public async createPair(
    baseTokenAddress: string,
    quoteTokenAddress: string
  ): Promise<Pair> {
    if (baseTokenAddress.toLowerCase() === quoteTokenAddress.toLowerCase()) {
      throw new HttpException(
        { message: PairMessageError.SameBaseQuoteToken },
        HttpStatus.BAD_REQUEST
      );
    }
    const [baseToken, quoteToken] = await Promise.all([
      await this.tokenRepository.getTokenByAddress(baseTokenAddress),
      await this.tokenRepository.getTokenByAddress(quoteTokenAddress),
    ]);

    if (!baseToken) {
      throw new HttpException(
        { message: PairMessageError.BaseTokenNotFound },
        HttpStatus.BAD_REQUEST
      );
    }

    if (!quoteToken) {
      throw new HttpException(
        { message: PairMessageError.QuoteTokenNotFound },
        HttpStatus.BAD_REQUEST
      );
    }

    const pairName = `${baseToken.symbol} / ${quoteToken.symbol}`;
    const existPair = await this.pairRepository.getPairByBaseQuoteToken(
      baseToken.address,
      quoteToken.address
    );

    if (existPair) {
      throw new HttpException(
        { message: PairMessageError.PairExist },
        HttpStatus.BAD_REQUEST
      );
    }

    const newPair = new Pair();
    newPair.name = pairName;
    newPair.baseTokenAddress = baseToken.address;
    newPair.quoteTokenAddress = quoteToken.address;
    newPair.status = PairStatus.Active;
    return this.pairRepository.save(newPair);
  }

  public async listPair(
    page: number,
    limit: number
  ): Promise<{ data: Pair[]; total: number }> {
    if (page < 1) page = 1;
    if (limit < 10) limit = 10;
    const [data, total] = await Promise.all([
      await this.pairRepository.listPair(page, limit),
      await this.pairRepository.countPair(),
    ]);
    if (data.length === 0) {
      throw new HttpException(
        { message: PairMessageError.PairNotFound },
        HttpStatus.BAD_REQUEST
      );
    }
    return {
      data,
      total,
    };
  }

  public async disablePair(pairId: string, status: PairStatus): Promise<Pair> {
    const pair = await this.pairRepository.getPairById(pairId);
    pair.status = status;
    pair.updatedAt = new Date();
    return this.pairRepository.save(pair);
  }
}
