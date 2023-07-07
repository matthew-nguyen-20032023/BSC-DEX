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
export declare type WalletAssociateTokenDocument = HydratedDocument<WalletAssociateToken>;
export declare class WalletAssociateToken extends CreateUpdateSchema {
    userId: string;
    tokenId: string;
}
export declare const WalletAssociateTokenSchema: import("mongoose").Schema<WalletAssociateToken, import("mongoose").Model<WalletAssociateToken, any, any, any, import("mongoose").Document<unknown, any, WalletAssociateToken> & Omit<WalletAssociateToken & Required<{
    _id: string;
}>, never>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, WalletAssociateToken, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<WalletAssociateToken>> & Omit<import("mongoose").FlatRecord<WalletAssociateToken> & Required<{
    _id: string;
}>, never>>;
