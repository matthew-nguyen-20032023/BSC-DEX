export declare function pinFileToIPFS(file: Express.Multer.File): Promise<IResponsePinFile>;
export interface IResponsePinFile {
    IpfsHash: string;
    PinSize: number;
    Timestamp: Date;
    isDuplicate: boolean;
}
