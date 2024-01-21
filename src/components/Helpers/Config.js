/* Live */
import cookie from "react-cookies";
export const appId = "01DF0942-0B19-4E95-8EBA-2BEFFD2EFFE9";

export const apiUrl = "https://walletapi.goepicware.com/api/";
export const apiUrlV2 = "https://walletapi.goepicware.com/apiv2/";
export const apiUrlPro = "https://walletapi.goepicware.com/ninjapro/";
export const apiUrlNotify = "https://ccpl.promobuddy.asia/Pushorder/";

//export const baseUrl = "http://localhost:3000/";
export const baseUrl = "https://wallet.goepicware.com/";

export const stripeImage = "/img/stripe_logo.png";

export const deliveryId = "CF2EB35B-5D40-4FDE-94AB-DFC0EE8378EA";
export const pickupId = "DE0D5AF4-CE41-4AD9-B1A0-DA24C5469B34";
export const cateringId = "EB62AF63-0410-47CC-9464-038E796E28C4";
export const reservationId = "79FA4C7F-75A1-4A95-B7CE-81ECA2575363";
export const dineinId = "EF9FB350-4FD4-4894-9381-3E859AB74019";

export const CountryTxt = "Singapore";
export const productNoImg = "/img/product-noimg.jpg";
export const stripeCompany = "Goepicware";

export const fbAppId = "684030098921355";

export const stripeKey = "pk_test_mSKQhHZYbRvm1YvuX9mKN4zx";
export const stripeEmail = "dev@jankosoft.com";
export const stripeReference = "goepicware";
export const stripeDesc = "My Checkout";
export const stripeCurrency = "SGD";
export const ConfigoutletCategory = { 1: "Cafe", 2: "Pantry" };
export const defaultpantryOutlet = "321";
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
