/* Live */
import cookie from "react-cookies";
export const apiUrl = "https://walletapi.goepicware.com/api/";

export const baseUrl = "http://localhost:3000/";
//export const baseUrl = "https://wallet.goepicware.com/";

export const defaultUniqueID = "11427810-47D6-4977-AC44-CFA53992B77A";
export const adminlimit = "10";
var accesstoken = {
  Authorization: cookie.load("accessToken"),
};

export const masterheaderconfig = {
  headers: accesstoken,
};

var clientaccesstoken = {
  Authorization: cookie.load("clientAccessToken"),
};

export const clientheaderconfig = {
  headers: clientaccesstoken,
};

export const awsCredentials = {
  accessKeyId: "AKIATICWS2EXCXAHYWVQ",
  secretAccessKey: "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",
  region: "us-east-1",
  signatureVersion: "v4",
};
export const bucketName = "goepicmarketplacemedia";
export const foldername = "abcpvt";
