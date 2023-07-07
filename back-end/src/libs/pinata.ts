// eslint-disable-next-line @typescript-eslint/no-var-requires
const pinataSDK = require("@pinata/sdk");
const stream = require("stream");

export async function pinFileToIPFS(
  // @ts-ignore
  file: Express.Multer.File
): Promise<IResponsePinFile> {
  const pinata = new pinataSDK({
    pinataApiKey: process.env.PINATA_API_KEY,
    pinataSecretApiKey: process.env.PINATA_API_SECRET,
  });

  const options = {
    pinataMetadata: {
      name: "NOVA_NFT",
    },
    pinataOptions: {
      cidVersion: 0,
    },
  };

  const readableStream = new stream.Readable();
  readableStream.push(file.buffer);
  readableStream.push(null);

  return pinata
    .pinFileToIPFS(readableStream, options)
    .then((result) => {
      return result;
    })
    .catch(() => {
      return "";
    });
}

export interface IResponsePinFile {
  IpfsHash: string;
  PinSize: number;
  Timestamp: Date;
  isDuplicate: boolean;
}
