/* eslint-disable */
import React from "react";
import cookie from "react-cookies";
import { format } from "date-fns";
import noimage from "../../common/images/noimg-800x800.jpg";
import { apiUrl, masterheaderconfig, clientheaderconfig } from "./Config";
import $ from "jquery";
import Axios from "axios";
import Swal from "sweetalert2";
var qs = require("qs");
var base64 = require("base-64");
import Parser from "html-react-parser";

/* stripslashes  */
export const stripslashes = function (str) {
  if (str !== "" && typeof str !== undefined && typeof str !== "undefined") {
    str = str.replace(/\\'/g, "'");
    str = str.replace(/\\"/g, '"');
    str = str.replace(/\\0/g, "\0");
    str = str.replace(/\\\\/g, "\\");
    return str;
  }
};

/* Random ID  */
export const randomId = function () {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 50; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

/* Call image */
export const callImage = function (
  image_source,
  image,
  width,
  height,
  timthumb,
  imageTag = "Yes"
) {
  var imagesource = "";

  if (image !== null && image !== "") {
    imagesource =
      timthumb +
      image_source +
      "/" +
      image +
      "&w=" +
      width +
      "&h=" +
      height +
      "&q=80";
  } else {
    imagesource = noimage;
  }
  if (imageTag === "Yes") {
    return <img src={imagesource} alt="" width={width} height={height} />;
  } else {
    return imagesource;
  }
};

/* sample funtion */
export const showSubTotalValue = function (price) {
  price = price !== "" ? parseFloat(price) : 0.0;
  var priceTxt = price.toFixed(2);
  return priceTxt;
};

/*Reference ID Generate*/
export const getReferenceID = function () {
  if (typeof cookie.load("referenceId") === "undefined") {
    var randomKey = randomId();
    cookie.save("referenceId", randomKey, { path: "/" });
    return randomKey;
  } else {
    return cookie.load("referenceId");
  }
};

/*remove promotion value*/
export const removePromoCkValue = function () {
  cookie.remove("reedemPointVal", { path: "/" });
  cookie.remove("promoCodeVal", { path: "/" });
  cookie.remove("promotionApplied", { path: "/" });
  cookie.remove("promotionType", { path: "/" });
  cookie.remove("promotionAmount", { path: "/" });
  cookie.remove("promotionSource", { path: "/" });
  cookie.remove("promoIsDelivery", { path: "/" });
  cookie.remove("usedPoints", { path: "/" });
};

/*remove order date time*/
export const removeOrderDateTime = function () {
  cookie.remove("orderDateTime", { path: "/" });
  cookie.remove("deliveryDate", { path: "/" });
  cookie.remove("deliveryTime", { path: "/" });
};

/*remove promotion value*/
export const getPromoCkValue = function () {
  var reedemPointVal =
    typeof cookie.load("reedemPointVal") === "undefined"
      ? ""
      : cookie.load("reedemPointVal");
  var promoCodeVal =
    typeof cookie.load("promoCodeVal") === "undefined"
      ? ""
      : cookie.load("promoCodeVal");
  var promotionApplied =
    typeof cookie.load("promotionApplied") === "undefined"
      ? ""
      : cookie.load("promotionApplied");
  var promotionType =
    typeof cookie.load("promotionType") === "undefined"
      ? ""
      : cookie.load("promotionType");
  var promotionAmount =
    typeof cookie.load("promotionAmount") === "undefined"
      ? ""
      : cookie.load("promotionAmount");
  var promotionSource =
    typeof cookie.load("promotionSource") === "undefined"
      ? ""
      : cookie.load("promotionSource");
  var promoIsDelivery =
    typeof cookie.load("promoIsDelivery") === "undefined"
      ? ""
      : cookie.load("promoIsDelivery");
  var usedPoints =
    typeof cookie.load("usedPoints") === "undefined"
      ? 0
      : cookie.load("usedPoints");

  var resultArr = [];
  resultArr["reedemPointVal"] = reedemPointVal;
  resultArr["promoCodeVal"] = promoCodeVal;
  resultArr["promotionApplied"] = promotionApplied;
  resultArr["promotionType"] = promotionType;
  resultArr["promotionAmount"] = promotionAmount;
  resultArr["promotionSource"] = promotionSource;
  resultArr["promoIsDelivery"] = promoIsDelivery;
  resultArr["usedPoints"] = usedPoints;

  return resultArr;
};

/* address format */
export const addressFormat = function (
  unitOne,
  unitTwo,
  addressOne,
  addressTwo,
  postCode,
  country = ""
) {
  var countryName = country !== "" ? country : "Singapore";
  var unit =
    unitTwo !== "" && unitOne !== ""
      ? "#" + unitOne + "-" + unitTwo + ", "
      : unitOne !== ""
      ? "#" + unitOne + ", "
      : "";
  unit = addressOne !== "" ? unit + addressOne + ", " : unit;
  unit =
    addressTwo !== "" && addressTwo !== null ? unit + addressTwo + ", " : unit;
  unit = postCode !== "" ? unit + "<br/>" + countryName + " " + postCode : unit;

  return unit !== "" ? Parser(unit.replace(/,\s*$/, "")) : "N/A";
};

/* show Alert */
export const showAlert = function (header, message, type, autoClose = "No") {
  if (autoClose === "No") {
    var icon = "";
    if (type === "success") {
      icon = "success";
    } else if (type === "warning") {
      icon = "warning";
    } else {
      icon = "error";
    }
    Swal.fire({
      title: header,
      html: message,
      icon: icon,
      customClass: {
        confirmButton: "btn btn-primary waves-effect waves-light",
      },
      buttonsStyling: false,
    });
  } else {
    $("body").append(
      '<div class="white-popup mfp-hide popup_sec alert_popup custom-alrt-popupcls" ><div class="custom_alert"><div class="custom_alertin"><div class="alert_height"><div class="alert_header">' +
        header +
        '</div><div class="alert_body"><p>' +
        message +
        '</p><div class="alt_btns"></div></div></div></div></div></div>'
    );
    setTimeout(function () {
      autoClose.close();
    }, 1800);
  }
};

/* smooth Scroll */
export const smoothScroll = function (limit, value) {
  var limitTxt = limit !== "" ? parseInt(limit) : 0;
  var valueTxt = value !== "" ? parseInt(value) : 0;

  var stickyTop = $(window).scrollTop();
  if (stickyTop > limitTxt) {
    var i = 10;
    var int = setInterval(function () {
      window.scrollTo(0, i);
      i += 10;
      if (i >= valueTxt) clearInterval(int);
    }, 20);
  }
};

/* show Custom Alert */
export const showCustomAlert = function (type, message) {
  var clsIdTxt = type === "success" ? "jquery-success-msg" : "jquery-error-msg";
  $(".custom_alertcls").hide();
  $("." + clsIdTxt).html(message);
  $("#" + clsIdTxt).fadeIn();
  setTimeout(function () {
    $(".custom_alertcls").hide();
  }, 6000);
};

/* show Custom Center Alert */
export const showCustomCenterAlert = function (type, message) {
  var clsIdTxt =
    type === "success"
      ? "jquery-common-success-msg"
      : "jquery-common-error-msg";
  $(".custom_center_alertcls").hide();
  $("." + clsIdTxt).html(message);
  $("#" + clsIdTxt).fadeIn();
  setTimeout(function () {
    $(".custom_center_alertcls").hide();
  }, 6000);
};

/* show Cart Count */
export const showCartItemCount = function (cartDetail) {
  var itemCount =
    Object.keys(cartDetail).length > 0 ? cartDetail.cart_total_items : 0;
  var subTotal =
    Object.keys(cartDetail).length > 0 ? cartDetail.cart_sub_total : 0;
  cookie.save("cartTotalItems", itemCount, { path: "/" });
  $(".hcart_round").html(itemCount);
  if (parseFloat(subTotal) > 0) {
    $(".crttotl_amt").show();
  } else {
    $(".crttotl_amt").hide();
  }
  var subTotalHtml = "$" + subTotal;
  $(".crttotl_amt").html(subTotalHtml);
};

/* show Loader */
export const showLoader = function (divRef, type) {
  if (type === "class") {
    $("." + divRef)
      .addClass("loader-main-cls")
      .append(
        '<div class="spinner-border loader-sub-div" role="status"><span class="visually-hidden">Loading...</span></div>'
      );
  } else {
    $("#" + divRef)
      .addClass("loader-main-cls")
      .append(
        '<div class="spinner-border loader-sub-div" role="status"><span class="visually-hidden">Loading...</span></div>'
      );
  }
};

/* hide Loader */
export const hideLoader = function (divRef, type) {
  if (type === "class") {
    $("." + divRef).removeClass("loader-main-cls");
    $("." + divRef)
      .find(".loader-sub-div")
      .remove();
  } else {
    $("#" + divRef).removeClass("loader-main-cls");
    $("#" + divRef)
      .find(".loader-sub-div")
      .remove();
  }
};

/* get subtotal value  */
export const getsubTotal = function (
  subTotal,
  OriginalAmount,
  promotionApplied,
  redeemptionApplied = null
) {
  if (promotionApplied === "Yes") {
    return subTotal;
  } else if (redeemptionApplied === "Yes") {
    return subTotal;
  } else {
    return OriginalAmount;
  }
};

/* get subtotal value  */
export const getDeliveryCharge = function (
  promotionApplied,
  deliveryEnabled,
  OriginalAmount,
  isFreeDelivery = null
) {
  if (
    (promotionApplied === "Yes" && deliveryEnabled === "Yes") ||
    isFreeDelivery === "Yes"
  ) {
    return 0;
  } else {
    return OriginalAmount;
  }
};

/* sample funtion */
export const showPriceValue = function (price) {
  price = price !== "" ? parseFloat(price) : 0.0;
  var priceTxt = "$" + price.toFixed(2);
  return priceTxt;
};
/* sample funtion */
export const showPriceValueNew = function (price) {
  price = price !== "" ? parseFloat(price) : 0.0;
  var priceTxt = "$" + price.toFixed(2);
  return priceTxt;
};

/* int to str funtion */
export const cnvrtStr = function (d) {
  return d < 10 ? "0" + d.toString() : d.toString();
};

/* sample funtion */
export const getGstValue = function (gst, subtotal, format) {
  gst = parseFloat(gst);
  subtotal = parseFloat(subtotal);
  var gstResult = 0;

  if (gst > 0) {
    gstResult = (gst / 100) * subtotal;
  }

  if (format === "format") {
    return gstResult.toFixed(2);
  } else {
    return gstResult;
  }
};

/* GST Reverse Calculation funtion */
export const getReverseGST = function (total) {
  var vatDivisor = 1 + 7 / 100;
  var gstpercentage = 7 / 100;
  var productvalue = total / vatDivisor;
  var gst = productvalue * gstpercentage;
  return "GST Inclusive (7%): $" + gst.toFixed(2);
};

/* time conversion  */
export const timeToConv12 = function (time24) {
  var ts = time24;
  if (ts !== "" && typeof ts !== "undefined") {
    var H = +ts.substr(0, 2);
    var h = H % 12 || 12;
    h = h < 10 ? "0" + h : h;
    var ampm = H < 12 ? " AM" : " PM";
    ts = h + ts.substr(2, 3) + ampm;
  }
  return ts;
};

/* Date conversion  */
export const getOrderDateTime = function (dateTxt, TatTxt) {
  var dateStr = new Date();
  var TatTxtVl =
    TatTxt !== "" && typeof TatTxt !== "undefined" ? parseInt(TatTxt) : 0;
  var deliveryTime =
    typeof cookie.load("deliveryTime") === "undefined"
      ? ""
      : cookie.load("deliveryTime");
  if (dateTxt !== "" && typeof dateTxt !== "undefined" && deliveryTime !== "") {
    dateTxt = dateTxt.replace(/\"/g, "");
    var dateTxtArr = dateTxt.split("T");
    var selectTmArr = deliveryTime.split(":");
    var seletedDate = new Date(dateTxtArr[0]);
    seletedDate.setHours(parseInt(selectTmArr[0]));
    seletedDate.setMinutes(parseInt(selectTmArr[1]));
    seletedDate.setSeconds(0);
    dateStr = seletedDate;
  } else {
    var CurrentDate = new Date();
    CurrentDate.setMinutes(CurrentDate.getMinutes() + TatTxtVl);
    dateStr = CurrentDate;
  }

  return dateStr;
};

/* Date conversion  */
export const dateConvFun = function (dateTxt, type) {
  var dateStr = dateTxt;
  if (dateStr !== "" && typeof dateStr !== "undefined") {
    var newDateTxtone = dateTxt.replace(/-/g, "/");
    var todayTime = new Date(newDateTxtone);
    var month = todayTime.getMonth() + 1;
    month = month > 9 ? month : "0" + month;
    var day = todayTime.getDate();
    day = day > 9 ? day : "0" + day;
    var year = todayTime.getFullYear();

    if (type === 1) {
      dateStr = day + "/" + month + "/" + year;
    } else if (type === 2) {
      dateStr = day + "-" + month + "-" + year;
    }
  }

  return dateStr;
};

/* Date conversion  */
export const getTimeFrmDate = function (timeTxt, type) {
  var timeStr = timeTxt;
  if (timeStr !== "" && typeof timeStr !== "undefined") {
    var newtimeStr = timeStr.replace(/-/g, "/");
    var todayTime = new Date(newtimeStr);
    var hours = todayTime.getHours();
    var minut = todayTime.getMinutes();

    hours = parseInt(hours) < 10 ? "0" + hours : hours;
    minut = parseInt(minut) < 10 ? "0" + minut : minut;

    if (type === 1) {
      timeStr = hours + " : " + minut;
    } else if (type === 2) {
      timeStr = hours + ":" + minut;
      timeStr = timeToConv12(timeStr);
    }
  }

  return timeStr;
};

/* Date conversion  */
export const getCurrentDateTm = function () {
  var dateTimeStr = "";
  var todayTime = new Date();

  var month = todayTime.getMonth() + 1;
  month = month > 9 ? month : "0" + month;
  var day = todayTime.getDate();
  day = day > 9 ? day : "0" + day;
  var year = todayTime.getFullYear();

  var hours = todayTime.getHours();
  var minut = todayTime.getMinutes();
  var second = todayTime.getSeconds();

  hours = parseInt(hours) < 10 ? "0" + hours : hours;
  minut = parseInt(minut) < 10 ? "0" + minut : minut;
  second = parseInt(minut) < 10 ? "0" + second : second;

  dateTimeStr =
    year + "-" + month + "-" + day + " " + hours + ":" + minut + ":" + second;

  return dateTimeStr;
};

/* sample funtion */
export const validateEmailFun = function (mailIdVal) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mailIdVal)) {
    return true;
  }

  return false;
};

/* sample funtion */
export const showCartLst = function () {
  setTimeout(function () {
    $(".hcart_dropdown").toggleClass("open");
    $(".hcartdd_trigger").toggleClass("active");
  }, 1000);
};

/* sample funtion */
export const resetCrtStyle = function () {
  $(".cart_body").find(".cart_row").removeAttr("style");
};

/* sample funtion */
export const getAliasName = function (alias, productName) {
  return alias !== "" ? alias : productName;
};

/* Uc first funtion */
export const jsUcfirstFun = function (string) {
  if (string !== "") {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } else {
    return "";
  }
};

/* surcharge splitup */
export const getSurchargesplitup = function (surcharge, surlog) {
  let sur_deliverysetup_fee = 0;
  let sur_ear_deliverysetup_fee = 0;
  let sur_lat_teardown_fee = 0;

  let sur_deliverysetup_fee_name = "";
  let sur_ear_deliverysetup_fee_name = "";

  if (surcharge > 0) {
    sur_deliverysetup_fee = parseFloat(surlog.OrderPax.charge);
    sur_deliverysetup_fee += parseFloat(surlog.OrderAmount.charge);
    sur_deliverysetup_fee += parseFloat(surlog.Surcharge.charge);

    /*Pax value*/
    if (surlog.OrderPax.conditions.catering.amount_range_from !== undefined) {
      sur_deliverysetup_fee_name =
        "(" +
        surlog.OrderPax.conditions.catering.amount_range_from +
        " pax - " +
        surlog.OrderPax.conditions.catering.amount_range_to +
        " pax)";
    }

    /*Surchare based on date,time and day settings*/
    let sur_ear_deliverysetup_fee_time = 0;

    if (surlog.Surcharge.conditions !== undefined) {
      let basetimeArr = surlog.Surcharge.conditions.filter(
        (condobj) => condobj.surchage_based_on === "Time"
      );

      basetimeArr.forEach((item, i) => {
        sur_ear_deliverysetup_fee_time += parseFloat(item.price_value);

        sur_ear_deliverysetup_fee_name =
          "(" + item.subchr_from_time + " - " + item.subchr_to_time + ")";
      });

      if (basetimeArr.length != 1) {
        sur_ear_deliverysetup_fee_name = "";
      }

      sur_deliverysetup_fee =
        sur_deliverysetup_fee - sur_ear_deliverysetup_fee_time;
      sur_ear_deliverysetup_fee = sur_ear_deliverysetup_fee_time;
    }

    sur_lat_teardown_fee = surlog.After9pm.charge;
  }

  return {
    sur_deliverysetup_fee: sur_deliverysetup_fee.toFixed(2),
    sur_ear_deliverysetup_fee: sur_ear_deliverysetup_fee.toFixed(2),
    sur_lat_teardown_fee: sur_lat_teardown_fee.toFixed(2),
    sur_deliverysetup_fee_name: sur_deliverysetup_fee_name,
    sur_ear_deliverysetup_fee_name: sur_ear_deliverysetup_fee_name,
  };
};

export const getTimeobject = [
  { value: "", label: "Select" },
  { value: "01:00", label: "01:00 AM" },
  { value: "01:30", label: "01:30 AM" },
  { value: "02:00", label: "02:00 AM" },
  { value: "02:30", label: "02:30 AM" },
  { value: "03:00", label: "03:00 AM" },
  { value: "03:30", label: "03:30 AM" },
  { value: "04:00", label: "04:00 AM" },
  { value: "04:30", label: "04:30 AM" },
  { value: "05:00", label: "05:00 AM" },
  { value: "05:30", label: "05:30 AM" },
  { value: "06:00", label: "06:00 AM" },
  { value: "06:30", label: "06:30 AM" },
  { value: "07:00", label: "07:00 AM" },
  { value: "07:30", label: "07:30 AM" },
  { value: "08:00", label: "08:00 AM" },
  { value: "08:30", label: "08:30 AM" },
  { value: "09:00", label: "09:00 AM" },
  { value: "09:30", label: "09:30 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "10:30", label: "10:30 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "11:30", label: "11:30 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "12:30", label: "12:30 PM" },
  { value: "13:00", label: "01:00 PM" },
  { value: "13:30", label: "01:30 PM" },
  { value: "14:00", label: "02:00 PM" },
  { value: "14:30", label: "02:30 PM" },
  { value: "15:00", label: "03:00 PM" },
  { value: "15:30", label: "03:30 PM" },
  { value: "16:00", label: "04:00 PM" },
  { value: "16:30", label: "04:30 PM" },
  { value: "17:00", label: "05:00 PM" },
  { value: "17:30", label: "05:30 PM" },
  { value: "18:00", label: "06:00 PM" },
  { value: "18:30", label: "06:30 PM" },
  { value: "19:00", label: "07:00 PM" },
  { value: "19:30", label: "07:30 PM" },
  { value: "20:00", label: "08:00 PM" },
  { value: "20:30", label: "08:30 PM" },
  { value: "21:00", label: "09:00 PM" },
  { value: "21:30", label: "09.30 PM" },
  { value: "22:00", label: "10.00 PM" },
  { value: "22:30", label: "10.30 PM" },
  { value: "23:00", label: "11.00 PM" },
  { value: "23:30", label: "11.30 PM" },
  { value: "24:00", label: "12.00 PM" },
];

export const formatCreditCardNumber = function (value) {
  if (!value) {
    return value;
  }

  const issuer = Payment.fns.cardType(value);
  const clearValue = clearNumber(value);
  let nextValue;
  switch (issuer) {
    case "visa":
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        8
      )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 16)}`;

    case "mastercard":
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        8
      )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 16)}`;

    default:
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        8
      )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 16)}`;
      break;
  }

  return nextValue.trim();
};

export const formatCVC = function (value, prevValue, allValues = {}) {
  const clearValue = clearNumber(value);
  let maxLength = 3;
  if (allValues.number) {
    const issuer = Payment.fns.cardType(allValues.number);
    maxLength = issuer === "visa" ? 3 : 3;
  }
  return clearValue.slice(0, maxLength);
};

export const formatExpirationDate = function (value) {
  const clearValue = clearNumber(value);

  if (clearValue.length >= 3) {
    return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
  }

  return clearValue;
};

export const formatFormData = function (data) {
  return Object.keys(data).map((d) => `${d}: ${data[d]}`);
};

/* Validate Int Value */
export const validateIntval = function (e) {
  const re = /[0-9]+/g;
  if (!re.test(e.key)) {
    e.preventDefault();
  }
};

/* Show Time Meridiem */
export const meridiem = function (time) {
  if (time !== "" && time !== null) {
    var timeSplit = time.split(":");
    var merid = "am";
    if (timeSplit[0] >= 12) {
      merid = "pm";
    }
    var result = "";

    var finaTime = "";
    if (timeSplit[0] > 12) {
      var Fonttime = timeSplit[0] / 2;
      finaTime = Math.floor(Fonttime);
    } else {
      finaTime = timeSplit[0];
    }
    result = finaTime + "" + merid;
    return result;
  }
};

export const showStatus = function (status) {
  if (status === "A") {
    return <span className="badge bg-label-success me-1">Active</span>;
  } else if (status === "I") {
    return <span className="badge bg-label-danger me-1">InActive</span>;
  }
};

export const userID = function () {
  return cookie.load("loginID");
};
export const CompanyID = function () {
  return cookie.load("companyID");
};
export const clientID = function () {
  return cookie.load("clientID");
};

export const encodeValue = function (value) {
  if (value !== "") {
    return base64.encode(value);
  }
};
export const decodeValue = function (value) {
  if (value !== "") {
    return base64.decode(value);
  }
};

export const removeItem = function (formPayload, delUrl, type) {
  Swal.fire({
    title: "Are you sure?",
    text: "You want remove this item!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    customClass: {
      confirmButton: "btn btn-primary me-3 waves-effect waves-light",
      cancelButton: "btn btn-label-secondary waves-effect",
    },
    buttonsStyling: false,
    showLoaderOnConfirm: true,
    preConfirm: () => {
      var headerconfig =
        type === "client" ? clientheaderconfig : masterheaderconfig;

      return Axios.post(
        apiUrl + delUrl,
        qs.stringify(formPayload),
        headerconfig
      ).then((res) => {
        return res.data;
      });
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    console.log(result, "resultresult");
    if (result.value !== "" && typeof result.value !== undefined) {
      if (result.value.status == "ok") {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: result.value.message,
          customClass: {
            confirmButton: "btn btn-success waves-effect",
          },
        }).then((dataarr) => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          title: "Alert",
          text: result.value.message,
          icon: "error",
          customClass: {
            confirmButton: "btn btn-danger waves-effect",
          },
        });
      }
    }
  });
};
export const showDateTime = function (date) {
  if (date !== "") {
    return format(new Date(date), "MM/dd/yyyy hh:mm a");
  }
};
export const showDate = function (date) {
  if (date !== "") {
    return format(new Date(date), "MM/dd/yyyy");
  }
};

export const checkClientAuth = function (props) {
  if (
    cookie.load("clientID") === "" ||
    typeof cookie.load("clientID") === undefined ||
    typeof cookie.load("clientID") === "undefined"
  ) {
    props.history.push("/");
  }
};
export const checkMasterAuth = function (props) {
  if (
    cookie.load("loginID") === "" ||
    typeof cookie.load("loginID") === undefined ||
    typeof cookie.load("loginID") === "undefined"
  ) {
    props.history.push("/masterpanel");
  }
};
export const isEmpty = function (value) {
  return value === "" ? "This field is required." : null;
};
export const isEmail = function (value) {
  var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
  return value !== "" && value !== null && !pattern.test(value)
    ? "This is not a valid email."
    : null;
};
export const isPhone = function (value) {
  var filter = /^[0-9-+]+$/;
  return value !== "" && value !== null && !filter.test(value)
    ? "This is not a valid phone."
    : null;
};
export const isNumber = function (value) {
  var regex = /^[0-9\s]*$/;
  return value !== "" && value !== null && !regex.test(value)
    ? "This is not a valid number."
    : null;
};
export const isSingleSelect = function (value) {
  if (value !== null) {
    return Object.keys(value).length > 0 ? null : "This field is required.";
  } else {
    return "This field is required.";
  }
};
export const isMultiSelect = function (value) {
  return value.length > 0 ? null : "This field is required.";
};

export const isValidPrice = function (value) {
  var regex = /^\d{0,8}(\.\d{1,4})?$/;
  return value !== "" && !regex.test(value)
    ? "This is not a valid price."
    : null;
};

export const showSorting = function (value) {
  if (value === "ASC") {
    return <span class="mdi mdi-sort-descending"></span>;
  } else {
    return <span class="mdi mdi-sort-ascending"></span>;
  }
};
