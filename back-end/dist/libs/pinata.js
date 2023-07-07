"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pinFileToIPFS = void 0;
const pinataSDK = require("@pinata/sdk");
const stream = require("stream");
async function pinFileToIPFS(file) {
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
exports.pinFileToIPFS = pinFileToIPFS;
//# sourceMappingURL=pinata.js.map