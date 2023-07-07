/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { HydratedDocument } from "mongoose";
import { CreateUpdateSchema } from "src/models/schemas/create-update.schema";
export declare type NftTypeDocument = HydratedDocument<NftType>;
export declare class NftType extends CreateUpdateSchema {
    nftType: string;
    name: string;
    symbol: string;
    evmAddress: string;
    accountId: string;
    tier: string;
    defaultBalance: number;
    isRegister: boolean;
}
export declare const NftTypeSchema: import("mongoose").Schema<NftType, import("mongoose").Model<NftType, any, any, any, import("mongoose").Document<unknown, any, NftType> & Omit<NftType & Required<{
    _id: string;
}>, never>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, NftType, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<NftType>> & Omit<import("mongoose").FlatRecord<NftType> & Required<{
    _id: string;
}>, never>>;
