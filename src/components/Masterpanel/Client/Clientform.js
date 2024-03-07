/* eslint-disable */
import React, { Component } from "react";
import cookie from "react-cookies";
import axios from "axios";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Select from "react-select";
import update from "immutability-helper";
import { validated } from "react-custom-validation";
import validator from "validator";
import { format } from "date-fns";
import { GET_FORMPOST, GET_DETAILDATA } from "../../../actions";
import {
  apiUrl,
  masterheaderconfig,
  awsCredentials,
  bucketName,
  foldername,
} from "../../Helpers/Config";
import {
  showLoader,
  hideLoader,
  showAlert,
  userID,
  isSingleSelect,
} from "../../Helpers/SettingHelper";
import PageLoader from "../../Helpers/PageLoader";
import Header from "../Layout/Header";
import Topmenu from "../Layout/Topmenu";
import Footer from "../Layout/Footer";
import Switch from "react-switch";
import AWS from "aws-sdk";
AWS.config.update(awsCredentials);
const s3 = new AWS.S3();

var todayDate = new Date();
class Clientform extends Component {
  constructor(props) {
    super(props);
    var editID = "";
    if (this.props.match.path === "/masterpanel/client/edit/:clientID") {
      editID = this.props.match.params.clientID;
    }
    this.state = {
      editID: editID,
      pageloading: false,
      clientdata: {
        company_name: "",
        company_username: "",
        company_password: "",
        company_cpassword: "",
        company_email_address: "",
        category_list: [],
        company_country: [],
        company_currency: [],
        company_language: [],
        company_zoom: "",
        company_amount: "",
        company_date_format: [],
        company_time_format: [],
        company_logo: "",
        company_status: "",
        company_merchants_type: { label: "Complete", value: "1" },
        enable_menu: false,
        enable_subscription: false,
        enable_tat: false,
        enable_zone: false,
        enable_zone_value_base_delivery_charge: false,
        enable_guest_checkout: false,
        enable_maintenance_mode: false,
        enable_itemwise_report: false,
        enable_loyalty: false,
        enable_promocode: false,
        enable_new_signup_promocode: false,
        enable_holiday: false,
        enable_order_count: false,
        enable_tax: false,
        enable_highlight_product: false,
        enable_product_time_availability: false,
        enable_productspecial_days: false,
        enable_product_rating: false,
        enable_stock: false,
        enable_stock_auto_update: false,
        enable_sms: false,
        sms_mode: false,
        sms_period: "",
        sms_count: "",
        sms_live_account_sid: "",
        sms_live_auth_token: "",
        sms_live_from_number: "",
        sms_test_account_sid: "",
        sms_test_auth_token: "",
        sms_test_from_number: "",
        enable_corporate_customer: false,
        enable_membership: false,
        enable_strip: false,
        company_availability_name: [],
        company_payment_method: [],
        action: "add",
      },
      loading: true,
      checked: true,
      categoryList: [],
      countryList: [],
      currencyList: [],
      languageList: [],
      formpost: [],
      availabiltyList: [],
      companyDetail: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.companycategoryList();
    this.loadCountyList();
    this.loadCurrency();
    this.loadLanguage();
    this.loadAvailabilty();

    if (this.state.editID !== "") {
      var params = {
        params: "company_id=" + this.state.editID,
        url: apiUrl + "company/companycontroller/company_details",
        type: "master",
      };
      this.setState({ pageloading: true });
      this.props.getDetailData(params);
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      this.state.formpost !== nextProps.formpost &&
      this.props.formpost != nextProps.formpost
    ) {
      if (nextProps.formpost.length > 0) {
        hideLoader("submit_frm", "class");
        var errMsg =
          nextProps.formpost[0].form_error !== ""
            ? nextProps.formpost[0].form_error
            : nextProps.formpost[0].message;
        if (nextProps.formpost[0].status === "success") {
          showAlert("Success", errMsg, "success");
          this.props.history.push("/masterpanel/client");
        } else {
          showAlert("Error", errMsg, "error");
        }
      }
    }
    if (
      this.state.companyDetail !== nextProps.detaildata &&
      this.state.editID !== ""
    ) {
      this.setState({ companyDetail: nextProps.detaildata }, function () {
        if (nextProps.detaildata[0].status === "ok") {
          var result = nextProps.detaildata[0].result;
          /*   $.blockUI({
            timeout: 10,
            css: {
              backgroundColor: "transparent",
              color: "#fff",
              border: "0",
            },
            overlayCSS: {
              opacity: 0.5,
            },
          }); */

          var company_status_txt = "Inactive";
          if (result.company_status == "A") {
            company_status_txt = "Active";
          } else if (result.company_status == "I") {
            company_status_txt = "Inactive";
          } else if (result.company_status == "D") {
            company_status_txt = "Deleted";
          }
          var status =
            result.company_status !== "" && result.company_status !== null
              ? {
                  label: company_status_txt,
                  value: result.company_status,
                }
              : "";
          var companymerchantstype = { label: "Complete", value: "1" };
          if (result.company_merchants_type == "1") {
            companymerchantstype = { label: "Complete", value: "1" };
          } else if (result.company_merchants_type == "2") {
            companymerchantstype = { label: "Voucher Only", value: "2" };
          }
          var clientupdatedata = {
            company_name: result.company_name,
            company_username: result.company_username,
            company_password: "",
            company_cpassword: "",
            company_email_address: result.company_email_address,
            category_list: result.company_categories_arr,
            company_country: {
              label: result.country,
              value: result.company_country,
            },

            company_currency: {
              label: result.currency,
              value: result.company_currency,
            },
            company_language: {
              label: result.language,
              value: result.company_language,
            },
            company_zoom: result.company_zoom,
            company_amount: result.company_amount,
            company_status: status,
            company_merchants_type: companymerchantstype,
            company_logo:
              result.company_logo !== "" && result.company_logo !== null
                ? result.company_logo
                : "",
            company_date_format:
              result.company_date_format !== "" &&
              result.company_date_format !== null
                ? {
                    label: format(todayDate, result.company_date_format),
                    value: result.company_date_format,
                  }
                : "",
            company_time_format:
              result.company_date_format !== "" &&
              result.company_date_format !== null
                ? {
                    label: format(todayDate, result.company_time_format),
                    value: result.company_time_format,
                  }
                : "",
            enable_menu:
              result.enable_menu == "1" &&
              result.enable_menu !== "" &&
              typeof result.enable_menu !== undefined &&
              typeof result.enable_menu !== "undefined"
                ? true
                : false,
            enable_subscription: result?.enable_subscription,

            enable_tat:
              result.enable_tat == "1" &&
              result.enable_tat !== "" &&
              typeof result.enable_tat !== undefined &&
              typeof result.enable_tat !== "undefined"
                ? true
                : false,
            enable_zone:
              result.enable_zone == "1" &&
              result.enable_zone !== "" &&
              typeof result.enable_zone !== undefined &&
              typeof result.enable_zone !== "undefined"
                ? true
                : false,
            enable_zone_value_base_delivery_charge:
              result.enable_zone_value_base_delivery_charge == "1" &&
              result.enable_zone_value_base_delivery_charge !== "" &&
              typeof result.enable_zone_value_base_delivery_charge !==
                undefined &&
              typeof result.enable_zone_value_base_delivery_charge !==
                "undefined"
                ? true
                : false,
            enable_guest_checkout:
              result.enable_guest_checkout == "1" &&
              result.enable_guest_checkout !== "" &&
              typeof result.enable_guest_checkout !== undefined &&
              typeof result.enable_guest_checkout !== "undefined"
                ? true
                : false,
            enable_maintenance_mode:
              result.enable_maintenance_mode == "1" &&
              result.enable_maintenance_mode !== "" &&
              typeof result.enable_maintenance_mode !== undefined &&
              typeof result.enable_maintenance_mode !== "undefined"
                ? true
                : false,
            enable_itemwise_report:
              result.enable_itemwise_report == "1" &&
              result.enable_itemwise_report !== "" &&
              typeof result.enable_itemwise_report !== undefined &&
              typeof result.enable_itemwise_report !== "undefined"
                ? true
                : false,
            enable_loyalty:
              result.enable_loyalty == "1" &&
              result.enable_loyalty !== "" &&
              typeof result.enable_loyalty !== undefined &&
              typeof result.enable_loyalty !== "undefined"
                ? true
                : false,
            enable_promocode:
              result.enable_promocode == "1" &&
              result.enable_promocode !== "" &&
              typeof result.enable_promocode !== undefined &&
              typeof result.enable_promocode !== "undefined"
                ? true
                : false,
            enable_new_signup_promocode:
              result.enable_new_signup_promocode == "1" &&
              result.enable_new_signup_promocode !== "" &&
              typeof result.enable_new_signup_promocode !== undefined &&
              typeof result.enable_new_signup_promocode !== "undefined"
                ? true
                : false,
            enable_holiday:
              result.enable_holiday == "1" &&
              result.enable_holiday !== "" &&
              typeof result.enable_holiday !== undefined &&
              typeof result.enable_holiday !== "undefined"
                ? true
                : false,
            enable_order_count:
              result.enable_order_count == "1" &&
              result.enable_order_count !== "" &&
              typeof result.enable_order_count !== undefined &&
              typeof result.enable_order_count !== "undefined"
                ? true
                : false,
            enable_tax:
              result.enable_tax == "1" &&
              result.enable_tax !== "" &&
              typeof result.enable_tax !== undefined &&
              typeof result.enable_tax !== "undefined"
                ? true
                : false,
            enable_highlight_product:
              result.enable_highlight_product == "1" &&
              result.enable_highlight_product !== "" &&
              typeof result.enable_highlight_product !== undefined &&
              typeof result.enable_highlight_product !== "undefined"
                ? true
                : false,
            enable_product_time_availability:
              result.enable_product_time_availability == "1" &&
              result.enable_product_time_availability !== "" &&
              typeof result.enable_product_time_availability !== undefined &&
              typeof result.enable_product_time_availability !== "undefined"
                ? true
                : false,
            enable_productspecial_days:
              result.enable_productspecial_days == "1" &&
              result.enable_productspecial_days !== "" &&
              typeof result.enable_productspecial_days !== undefined &&
              typeof result.enable_productspecial_days !== "undefined"
                ? true
                : false,
            enable_product_rating:
              result.enable_product_rating == "1" &&
              result.enable_product_rating !== "" &&
              typeof result.enable_product_rating !== undefined &&
              typeof result.enable_product_rating !== "undefined"
                ? true
                : false,
            enable_stock:
              result.enable_stock == "1" &&
              result.enable_stock !== "" &&
              typeof result.enable_stock !== undefined &&
              typeof result.enable_stock !== "undefined"
                ? true
                : false,
            enable_stock_auto_update:
              result.enable_stock_auto_update == "1" &&
              result.enable_stock_auto_update !== "" &&
              typeof result.enable_stock_auto_update !== undefined &&
              typeof result.enable_stock_auto_update !== "undefined"
                ? true
                : false,
            enable_sms:
              result.enable_sms == "1" &&
              result.enable_sms !== "" &&
              typeof result.enable_sms !== undefined &&
              typeof result.enable_sms !== "undefined"
                ? true
                : false,
            sms_mode:
              result.sms_mode == "1" &&
              result.sms_mode !== "" &&
              typeof result.sms_mode !== undefined &&
              typeof result.sms_mode !== "undefined"
                ? true
                : false,
            sms_period:
              result.sms_period == "1" &&
              result.sms_period !== "" &&
              typeof result.sms_period !== undefined &&
              typeof result.sms_period !== "undefined"
                ? [{ value: result.sms_period, label: result.sms_period }]
                : [],
            sms_count:
              result.sms_count == "1" &&
              result.sms_count !== "" &&
              typeof result.sms_count !== undefined &&
              typeof result.sms_count !== "undefined"
                ? result.sms_count
                : "",
            sms_live_account_sid:
              result.sms_live_account_sid == "1" &&
              result.sms_live_account_sid !== "" &&
              typeof result.sms_live_account_sid !== undefined &&
              typeof result.sms_live_account_sid !== "undefined"
                ? result.sms_live_account_sid
                : "",
            sms_live_auth_token:
              result.sms_live_auth_token == "1" &&
              result.sms_live_auth_token !== "" &&
              typeof result.sms_live_auth_token !== undefined &&
              typeof result.sms_live_auth_token !== "undefined"
                ? true
                : false,
            sms_live_from_number:
              result.sms_live_from_number == "1" &&
              result.sms_live_from_number !== "" &&
              typeof result.sms_live_from_number !== undefined &&
              typeof result.sms_live_from_number !== "undefined"
                ? result.sms_live_from_number
                : "",
            sms_test_account_sid:
              result.sms_test_account_sid == "1" &&
              result.sms_test_account_sid !== "" &&
              typeof result.sms_test_account_sid !== undefined &&
              typeof result.sms_test_account_sid !== "undefined"
                ? result.sms_test_account_sid
                : "",
            sms_test_auth_token:
              result.sms_test_auth_token == "1" &&
              result.sms_test_auth_token !== "" &&
              typeof result.sms_test_auth_token !== undefined &&
              typeof result.sms_test_auth_token !== "undefined"
                ? result.sms_test_auth_token
                : "",
            sms_test_from_number:
              result.sms_test_from_number == "1" &&
              result.sms_test_from_number !== "" &&
              typeof result.sms_test_from_number !== undefined &&
              typeof result.sms_test_from_number !== "undefined"
                ? result.sms_test_from_number
                : "",
            enable_corporate_customer:
              result.enable_corporate_customer == "1" &&
              result.enable_corporate_customer !== "" &&
              typeof result.enable_corporate_customer !== undefined &&
              typeof result.enable_corporate_customer !== "undefined"
                ? true
                : false,
            enable_membership:
              result.enable_membership == true &&
              result.enable_membership !== "" &&
              typeof result.enable_membership !== undefined &&
              typeof result.enable_membership !== "undefined"
                ? true
                : false,
            enable_strip:
              result.enable_strip == "1" &&
              result.enable_strip !== "" &&
              typeof result.enable_strip !== undefined &&
              typeof result.enable_strip !== "undefined"
                ? true
                : false,
            company_availability_name: result.availability_list,
            company_payment_method: {
              label: result.company_payment_method,
              value: result.company_payment_method,
            },
            action: "edit",
          };
          this.setState({ clientdata: clientupdatedata, pageloading: false });
        } else {
          showAlert("Error", "Invalid Company", "error");
        }
      });
    }
  }

  companycategoryList() {
    var urlShringTxt = apiUrl + "company/companycategory/categoryselectlist";

    axios.get(urlShringTxt, masterheaderconfig).then((res) => {
      var categoryList = new Array();
      if (res.data.status === "ok") {
        res.data.result.map((item) => {
          categoryList.push({
            label: item.cate_name,
            value: item.cate_id,
          });
        });
      }
      this.setState({ categoryList: categoryList });
    });
  }

  loadCountyList() {
    var urlShringTxt = apiUrl + "company/settings/country_list";

    axios.get(urlShringTxt, masterheaderconfig).then((res) => {
      var countryList = new Array();
      if (res.data.status === "success") {
        res.data.result.map((item) => {
          countryList.push({
            label: item.country_name,
            value: item.country_id,
          });
        });
      }
      this.setState({ countryList: countryList });
    });
  }
  loadCurrency() {
    var urlShringTxt = apiUrl + "company/settings/currency_list";

    axios.get(urlShringTxt, masterheaderconfig).then((res) => {
      var currencyList = new Array();
      if (res.data.status === "success") {
        res.data.result.map((item) => {
          currencyList.push({
            label: item.currency_name,
            value: item.currency_name,
          });
        });
      }
      this.setState({ currencyList: currencyList });
    });
  }
  loadLanguage() {
    var urlShringTxt = apiUrl + "company/settings/language_list";

    axios.get(urlShringTxt, masterheaderconfig).then((res) => {
      var languageList = new Array();
      if (res.data.status === "success") {
        res.data.result.map((item) => {
          languageList.push({
            label: item.language_code,
            value: item.language_code,
          });
        });
      }
      this.setState({ languageList: languageList });
    });
  }
  loadAvailabilty() {
    var urlShringTxt = apiUrl + "company/settings/availabilty_list";

    axios.get(urlShringTxt, masterheaderconfig).then((res) => {
      if (res.data.status === "success") {
        this.setState({ availabiltyList: res.data.result });
      }
    });
  }

  sateValChange = (field, value) => {
    if (field === "page") {
    }
  };

  handleChange(checked, name) {
    this.setState({ checked });
  }

  /* signin - start*/
  fieldChange = (field, value) => {
    this.setState(
      update(this.state, { clientdata: { [field]: { $set: value } } })
    );
  };

  handleSubmit = () => {
    showLoader("submit_frm", "class");
    var client_data = this.state.clientdata;

    let cate_idtxt = "";
    let categorylistvl = client_data.category_list;
    if (categorylistvl != undefined && Object.keys(categorylistvl).length > 0) {
      categorylistvl.map((valuetxt, index) => {
        cate_idtxt =
          index == 0 ? valuetxt.value : cate_idtxt + "~" + valuetxt.value;
      });
    }
    client_data["category_list"] = cate_idtxt;
    client_data["company_country"] =
      Object.keys(client_data.company_country).length > 0
        ? client_data.company_country.value
        : "";

    client_data["company_status"] =
      Object.keys(client_data.company_status).length > 0
        ? client_data.company_status.value
        : "I";
    client_data["company_merchants_type"] =
      Object.keys(client_data.company_merchants_type).length > 0
        ? client_data.company_merchants_type.value
        : "1";
    client_data["company_currency"] =
      Object.keys(client_data.company_currency).length > 0
        ? client_data.company_currency.value
        : "";

    client_data["company_date_format"] =
      Object.keys(client_data.company_date_format).length > 0
        ? client_data.company_date_format.value
        : "";
    client_data["company_time_format"] =
      Object.keys(client_data.company_time_format).length > 0
        ? client_data.company_time_format.value
        : "";
    client_data["company_language"] =
      Object.keys(client_data.company_language).length > 0
        ? client_data.company_language.value
        : "";
    client_data["company_payment_method"] =
      Object.keys(client_data.company_payment_method).length > 0
        ? client_data.company_payment_method.value
        : "";
    client_data["company_availability_name"] =
      client_data.company_availability_name.length > 0
        ? client_data.company_availability_name.join(",")
        : "";
    client_data["loginID"] = userID();
    var post_url = "company/companycontroller/add";
    if (client_data.action === "edit" && this.state.editID !== "") {
      client_data["edit_id"] = this.state.editID;
      post_url = "company/companycontroller/edit";
    }
    this.props.getFormPost(client_data, post_url, "master");
  };

  render() {
    return (
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <Header {...this.props} currentPage={"client"} />
          <div className="layout-page">
            <Topmenu />
            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row mb-3">
                  <div className="col-lg-10 col-md-6">
                    <h4 className="fw-bold">
                      {this.state.editID !== "" ? "Update" : "Add New"} Client
                    </h4>
                  </div>
                  <div className="col-lg-2 col-md-6 text-end">
                    <Link to={"/masterpanel/client"}>
                      <button
                        type="button"
                        className="btn btn-outline-primary waves-effect"
                      >
                        Back
                      </button>
                    </Link>
                  </div>
                </div>
                <Form
                  {...this.props}
                  fields={this.state.clientdata}
                  onChange={this.fieldChange}
                  onValid={this.handleSubmit}
                  error_msg={this.state.error_msg}
                  categoryList={this.state.categoryList}
                  countryList={this.state.countryList}
                  currencyList={this.state.currencyList}
                  languageList={this.state.languageList}
                  availabiltyList={this.state.availabiltyList}
                  onInvalid={() => {
                    setTimeout(function () {
                      if ($("#modulefrm .is-invalid").length > 0) {
                        $("html, body").animate(
                          {
                            scrollTop:
                              $(document)
                                .find("#modulefrm .is-invalid:first")
                                .offset().top - 100,
                          },
                          500
                        );
                      }
                    }, 500);
                  }}
                />
              </div>

              <Footer />
            </div>
          </div>
        </div>

        <div className="layout-overlay layout-menu-toggle"></div>

        <div className="drag-target"></div>
        <PageLoader pageloading={this.state.pageloading} />
      </div>
    );
  }
}

const mapStateTopProps = (state) => {
  return {
    formpost: state.formpost,
    detaildata: state.detaildata,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getFormPost: (formPayload, postUrl, authType) => {
      dispatch({ type: GET_FORMPOST, formPayload, postUrl, authType });
    },
    getDetailData: (datas) => {
      dispatch({ type: GET_DETAILDATA, datas });
    },
  };
};

export default connect(mapStateTopProps, mapDispatchToProps)(Clientform);

const isEmpty = (value) => (value === "" ? "This field is required." : null);
const minLength = (password, length) =>
  password.length >= length || password === ""
    ? null
    : "Password must be at least 6 characters.";
const areSame = (password, rePassword) =>
  password === rePassword ? null : "Password do not match.";
const isEmail = (email) =>
  validator.isEmail(email) ? null : "This is not a valid email.";

function validationConfig(props) {
  const {
    company_name,
    company_username,
    company_password,
    company_cpassword,
    company_email_address,
    company_amount,
    company_status,
    company_merchants_type,
  } = props.fields;
  if (props.fields.action === "add") {
    return {
      fields: [
        "company_name",
        "company_username",
        "company_password",
        "company_cpassword",
        "company_email_address",
        "company_amount",
        "company_status",
        "company_merchants_type",
      ],

      validations: {
        company_name: [[isEmpty, company_name]],
        company_username: [[isEmpty, company_username]],
        company_password: [
          [isEmpty, company_password],
          [minLength, company_password, 6],
        ],
        company_cpassword: {
          rules: [
            [areSame, company_password, company_cpassword],
            [isEmpty, company_cpassword],
          ],
          fields: ["company_password", "company_cpassword"],
        },
        company_email_address: [
          [isEmpty, company_email_address],
          [isEmail, company_email_address],
        ],
        company_amount: [[isEmpty, company_amount]],
        company_status: [[isSingleSelect, company_status]],
        company_merchants_type: [[isSingleSelect, company_merchants_type]],
      },
    };
  } else {
    return {
      fields: [
        "company_name",
        "company_username",
        "company_password",
        "company_cpassword",
        "company_email_address",
        "company_amount",
        "company_status",
        "company_merchants_type",
      ],

      validations: {
        company_name: [[isEmpty, company_name]],
        company_username: [[isEmpty, company_username]],
        company_password: [[minLength, company_password, 6]],
        company_cpassword: {
          rules: [[areSame, company_password, company_cpassword]],
          fields: ["company_password", "company_cpassword"],
        },
        company_email_address: [
          [isEmpty, company_email_address],
          [isEmail, company_email_address],
        ],
        company_amount: [[isEmpty, company_amount]],
        company_status: [[isSingleSelect, company_status]],
        company_merchants_type: [[isSingleSelect, company_merchants_type]],
      },
    };
  }
}

class Form extends Component {
  constructor(props) {
    super(props);
  }

  handleChange(name, value) {
    this.props.onChange(name, value);
  }
  handleSelectChange(name, value) {
    this.props.onChange(name, value);
  }
  handleChangeRadio(fields, name, value) {
    var selectedAvail = value.target.value;
    var company_availability_name = fields.company_availability_name;
    if (value.target.checked === true) {
      company_availability_name.push(value.target.value);
    } else {
      const indexNew = company_availability_name.indexOf(selectedAvail);
      company_availability_name.splice(indexNew, 1);
    }
    this.props.onChange(name, company_availability_name);
  }

  async uplaodcompanyImage() {
    var imagefile = document.querySelector("#company_logo");
    const file = imagefile.files[0];
    const params = {
      Bucket: bucketName,
      Key: `media/${foldername}/outlet/${file.name}`,
      Body: file,
      ACL: "public-read",
    };
    const { Location } = await s3.upload(params).promise();
    this.props.onChange("company_logo", Location);
    $("#company_logo").val("");
  }

  async removeImage(fileNamme, ImageType, event) {
    event.preventDefault();
    var imagePath = "";
    if (ImageType === "company_logo") {
      imagePath = "outlet";
    }
    var fileNammeSplit = fileNamme.split("/");
    console.log(fileNammeSplit, "fileNammeSplit");
    var params = {
      Bucket: bucketName,
      Key: `media/${foldername}/${imagePath}/${
        fileNammeSplit[fileNammeSplit.length - 1]
      }`,
    };
    await s3.deleteObject(params).promise();
    this.props.onChange(ImageType, "");
  }

  render() {
    const { fields, onChange, onValid, onInvalid, $field, $validation } =
      this.props;
    let errMsgName,
      errMsgUsername,
      errMsgPassword,
      errMsgConfirmPassword,
      errMssEmail,
      errMsgStatus,
      errMssAmount,
      errMsgMerType = "";
    if ($validation.company_name.error.reason !== undefined) {
      errMsgName = $validation.company_name.show && (
        <span className="error">{$validation.company_name.error.reason}</span>
      );
    }

    if ($validation.company_username.error.reason !== undefined) {
      errMsgUsername = $validation.company_username.show && (
        <span className="error">
          {$validation.company_username.error.reason}
        </span>
      );
    }
    if ($validation.company_password.error.reason !== undefined) {
      errMsgPassword = $validation.company_password.show && (
        <span className="error">
          {$validation.company_password.error.reason}
        </span>
      );
    }
    if ($validation.company_cpassword.error.reason !== undefined) {
      errMsgConfirmPassword = $validation.company_cpassword.show && (
        <span className="error">
          {$validation.company_cpassword.error.reason}
        </span>
      );
    }
    if ($validation.company_email_address.error.reason !== undefined) {
      errMssEmail = $validation.company_email_address.show && (
        <span className="error">
          {$validation.company_email_address.error.reason}
        </span>
      );
    }
    if ($validation.company_amount.error.reason !== undefined) {
      errMssAmount = $validation.company_amount.show && (
        <span className="error">{$validation.company_amount.error.reason}</span>
      );
    }

    if ($validation.company_status.error.reason !== undefined) {
      errMsgStatus = $validation.company_status.show && (
        <span className="error">{$validation.company_status.error.reason}</span>
      );
    }
    if ($validation.company_merchants_type.error.reason !== undefined) {
      errMsgMerType = $validation.company_merchants_type.show && (
        <span className="error">
          {$validation.compancompany_merchants_typey_status.error.reason}
        </span>
      );
    }

    return (
      <form className="card-body fv-plugins-bootstrap5" id="modulefrm">
        <div
          className="accordion mt-3 accordion-header-primary"
          id="accordionStyle1"
        >
          <div className="accordion-item active">
            <h2 className="accordion-header">
              <button
                type="button"
                className="accordion-button"
                data-bs-toggle="collapse"
                data-bs-target="#accordionStyle1-3"
                aria-expanded="true"
              >
                Client Info
              </button>
            </h2>
            <div
              id="accordionStyle1-3"
              className="accordion-collapse collapse show"
              data-bs-parent="#accordionStyle1"
            >
              <div className="accordion-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating form-floating-outline mb-4">
                      <input
                        type="text"
                        className={
                          errMsgName !== "" &&
                          errMsgName !== false &&
                          errMsgName !== undefined
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        name="company_name"
                        value={fields.company_name}
                        {...$field("company_name", (e) =>
                          onChange("company_name", e.target.value)
                        )}
                      />
                      <label htmlFor="company_name">
                        Client Name <span className="error">*</span>
                      </label>
                      {errMsgName}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating form-floating-outline mb-4">
                      <input
                        type="text"
                        className={
                          errMsgUsername !== "" &&
                          errMsgUsername !== false &&
                          errMsgUsername !== undefined
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        name="company_username"
                        value={fields.company_username}
                        {...$field("company_username", (e) =>
                          onChange("company_username", e.target.value)
                        )}
                      />
                      <label htmlFor="company_username">
                        Username <span className="error">*</span>
                      </label>
                      {errMsgUsername}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-4 form-password-toggle">
                      <div className="input-group input-group-merge">
                        <div className="form-floating form-floating-outline">
                          <input
                            type="password"
                            id="company_password"
                            className={
                              errMsgPassword !== "" &&
                              errMsgPassword !== false &&
                              errMsgPassword !== undefined
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            value={fields.company_password}
                            {...$field("company_password", (e) =>
                              onChange("company_password", e.target.value)
                            )}
                          />
                          <label htmlFor="company_password">Password</label>
                          {errMsgPassword}
                        </div>
                        <span
                          className="input-group-text rounded-end cursor-pointer"
                          id="basic-default-password4"
                          style={{ height: "49px" }}
                        >
                          <i className="mdi mdi-eye-off-outline"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-4 form-password-toggle">
                      <div className="input-group input-group-merge">
                        <div className="form-floating form-floating-outline">
                          <input
                            type="password"
                            id="company_cpassword"
                            className={
                              errMsgConfirmPassword !== "" &&
                              errMsgConfirmPassword !== false &&
                              errMsgConfirmPassword !== undefined
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            value={fields.company_cpassword}
                            {...$field("company_cpassword", (e) =>
                              onChange("company_cpassword", e.target.value)
                            )}
                          />
                          <label htmlFor="company_cpassword">
                            Confirm Password
                          </label>
                          {errMsgConfirmPassword}
                        </div>
                        <span
                          className="input-group-text rounded-end cursor-pointer"
                          id="basic-default-password3"
                          style={{ height: "49px" }}
                        >
                          <i className="mdi mdi-eye-off-outline"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating form-floating-outline mb-4">
                      <input
                        type="text"
                        className={
                          errMssEmail !== "" &&
                          errMssEmail !== false &&
                          errMssEmail !== undefined
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        name="company_email_address"
                        id="company_email_address"
                        value={fields.company_email_address}
                        {...$field("company_email_address", (e) =>
                          onChange("company_email_address", e.target.value)
                        )}
                      />
                      <label htmlFor="company_email_address">
                        Email ID <span className="error">*</span>
                      </label>
                      {errMssEmail}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating form-floating-outline">
                      <Select
                        value={fields.category_list}
                        onChange={this.handleSelectChange.bind(
                          this,
                          "category_list"
                        )}
                        placeholder="Select Category"
                        isMulti={true}
                        options={this.props.categoryList}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating form-floating-outline">
                      <Select
                        value={fields.company_country}
                        onChange={this.handleSelectChange.bind(
                          this,
                          "company_country"
                        )}
                        placeholder="Select Country"
                        options={this.props.countryList}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating form-floating-outline">
                      <Select
                        value={fields.company_currency}
                        onChange={this.handleSelectChange.bind(
                          this,
                          "company_currency"
                        )}
                        placeholder="Select Currency"
                        options={this.props.currencyList}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating form-floating-outline">
                      <Select
                        value={fields.company_language}
                        onChange={this.handleSelectChange.bind(
                          this,
                          "company_language"
                        )}
                        placeholder="Select Language"
                        options={this.props.languageList}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating form-floating-outline mb-4">
                      <input
                        type="text"
                        className="form-control"
                        name="company_zoom"
                        id="company_zoom"
                        value={fields.company_zoom}
                        {...$field("company_zoom", (e) =>
                          onChange("company_zoom", e.target.value)
                        )}
                      />
                      <label htmlFor="company_zoom">
                        Map Zoom Level <span className="error">*</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating form-floating-outline">
                      <Select
                        value={fields.company_date_format}
                        onChange={this.handleSelectChange.bind(
                          this,
                          "company_date_format"
                        )}
                        placeholder="Select Date Format"
                        options={[
                          {
                            value: "LLLL d, yyyy",
                            label: format(todayDate, "LLLL d, yyyy"),
                          },
                          {
                            value: "yyyy-MM-dd",
                            label: format(todayDate, "yyyy-MM-dd"),
                          },
                          {
                            value: "MM/dd/yyyy",
                            label: format(todayDate, "MM/dd/yyyy"),
                          },
                          {
                            value: "MM/dd/yy",
                            label: format(todayDate, "MM/dd/yy"),
                          },
                          {
                            value: "dd/MM/yyyy",
                            label: format(todayDate, "dd/MM/yyyy"),
                          },
                          {
                            value: "dd-MM-yyyy",
                            label: format(todayDate, "dd-MM-yyyy"),
                          },
                        ]}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating form-floating-outline">
                      <Select
                        value={fields.company_time_format}
                        onChange={this.handleSelectChange.bind(
                          this,
                          "company_time_format"
                        )}
                        placeholder="Select Time Format"
                        options={[
                          {
                            value: "hh:mm a",
                            label: format(todayDate, "hh:mm a"),
                          },
                          {
                            value: "HH:mm",
                            label: format(todayDate, "HH:mm"),
                          },
                        ]}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating form-floating-outline mb-4">
                      <input
                        type="text"
                        className={
                          errMssEmail !== "" &&
                          errMssEmail !== false &&
                          errMssEmail !== undefined
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        name="company_amount"
                        id="company_amount"
                        value={fields.company_amount}
                        {...$field("company_amount", (e) =>
                          onChange("company_amount", e.target.value)
                        )}
                      />
                      <label htmlFor="company_amount">
                        Subscription Amount21 <span className="error">*</span>
                      </label>
                      {errMssAmount}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating form-floating-outline">
                      <Select
                        value={fields.company_payment_method}
                        onChange={this.handleSelectChange.bind(
                          this,
                          "company_payment_method"
                        )}
                        placeholder="Select Payment Method"
                        options={[
                          { value: "online", label: "Online" },
                          { value: "offline", label: "Offline" },
                        ]}
                      />
                    </div>
                  </div>

                  <div
                    className={
                      errMsgMerType !== "" &&
                      errMsgMerType !== false &&
                      errMsgMerType !== undefined
                        ? "col-md-6 error-select error"
                        : "col-md-6"
                    }
                  >
                    <div className="form-floating form-floating-outline custm-select-box">
                      <Select
                        value={fields.company_merchants_type}
                        onChange={this.handleSelectChange.bind(
                          this,
                          "company_merchants_type"
                        )}
                        placeholder="Select Merchants Type"
                        options={[
                          { value: "2", label: "Voucher Only" },
                          { value: "1", label: "Complete " },
                        ]}
                      />
                      <label className="select-box-label">
                        Merchants Type<span className="error">*</span>
                      </label>
                      {errMsgMerType}
                    </div>
                  </div>
                  <div
                    className={
                      errMsgStatus !== "" &&
                      errMsgStatus !== false &&
                      errMsgStatus !== undefined
                        ? "col-md-6 error-select error"
                        : "col-md-6"
                    }
                  >
                    <div className="form-floating form-floating-outline custm-select-box">
                      <Select
                        value={fields.company_status}
                        onChange={this.handleSelectChange.bind(
                          this,
                          "company_status"
                        )}
                        placeholder="Select Status"
                        options={[
                          { value: "A", label: "Active" },
                          { value: "I", label: "Inactive" },
                        ]}
                      />
                      <label className="select-box-label">
                        Status<span className="error">*</span>
                      </label>
                      {errMsgStatus}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating form-floating-outline mb-4">
                      <div className="mb-3">
                        <label htmlFor="formFile" className="form-label">
                          Company Image
                        </label>
                        <input
                          className="form-control"
                          type="file"
                          id="company_logo"
                          onChange={(event) => {
                            this.uplaodcompanyImage(event);
                            return false;
                          }}
                        />
                      </div>
                    </div>
                    {fields.company_logo !== "" && (
                      <div className="dz-preview dz-processing dz-image-preview dz-success dz-complete">
                        <div className="dz-details">
                          <div className="dz-thumbnail">
                            <img alt="" src={fields.company_logo} />
                          </div>
                        </div>
                        <a
                          className="dz-remove"
                          href={void 0}
                          onClick={this.removeImage.bind(
                            this,
                            fields.company_logo,
                            "company_logo"
                          )}
                        >
                          Remove file
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="col-md-12" style={{ display: "none" }}>
                    <h1 className="display-6 mb-0">
                      Availability<span className="error">*</span>
                    </h1>
                    <div className="row">
                      {this.props.availabiltyList.length > 0 &&
                        this.props.availabiltyList.map((item, index) => {
                          return (
                            <div className="col-md-2" key={index}>
                              <div className="form-check mt-3">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value={item.av_id}
                                  id={"avail_" + index}
                                  checked={
                                    fields.company_availability_name.indexOf(
                                      item.av_id
                                    ) >= 0
                                      ? true
                                      : false
                                  }
                                  onChange={this.handleChangeRadio.bind(
                                    this,
                                    fields,
                                    "company_availability_name"
                                  )}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={"avail_" + index}
                                >
                                  {item.av_name}
                                </label>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="accordion-item ">
            <h2 className="accordion-header">
              <button
                type="button"
                className="accordion-button collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#accordionStyle1-1"
                aria-expanded="false"
              >
                Basic Settings
              </button>
            </h2>

            <div
              id="accordionStyle1-1"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionStyle1"
            >
              <div className="accordion-body">
                <div className="row g-3">
                  <div className="col-md-3">
                    <div className="form-floating form-floating-outline mb-4">
                      <Switch
                        onChange={this.handleChange.bind(this, "enable_menu")}
                        checked={fields.enable_menu}
                        onColor="#666cff"
                        className="react-switch"
                        onHandleColor="#bdbfff"
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      />
                      <span>Enable Menu</span>
                    </div>
                  </div>
                  <div className="col-md-3" style={{ display: "none" }}>
                    <div className="form-floating form-floating-outline mb-4">
                      <Switch
                        onChange={this.handleChange.bind(this, "enable_tat")}
                        checked={fields.enable_tat}
                        onColor="#666cff"
                        className="react-switch"
                        onHandleColor="#bdbfff"
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      />
                      <span>Enable TAT Time</span>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-floating form-floating-outline mb-4">
                      <Switch
                        onChange={this.handleChange.bind(this, "enable_zone")}
                        checked={fields.enable_zone}
                        onColor="#666cff"
                        className="react-switch"
                        onHandleColor="#bdbfff"
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      />
                      <span>Enable Zone Option</span>
                    </div>
                  </div>
                  <div className="col-md-3" style={{ display: "none" }}>
                    <div className="form-floating form-floating-outline mb-4">
                      <Switch
                        onChange={this.handleChange.bind(
                          this,
                          "enable_zone_value_base_delivery_charge"
                        )}
                        checked={fields.enable_zone_value_base_delivery_charge}
                        onColor="#666cff"
                        className="react-switch"
                        onHandleColor="#bdbfff"
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      />
                      <span>Enable Zone Order Value Base Delivery Charge</span>
                    </div>
                  </div>
                  <div className="col-md-3" style={{ display: "none" }}>
                    <div className="form-floating form-floating-outline mb-4">
                      <Switch
                        onChange={this.handleChange.bind(
                          this,
                          "enable_guest_checkout"
                        )}
                        checked={fields.enable_guest_checkout}
                        onColor="#666cff"
                        className="react-switch"
                        onHandleColor="#bdbfff"
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      />
                      <span>Enable Guest Checkout</span>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-floating form-floating-outline mb-4">
                      <Switch
                        onChange={this.handleChange.bind(
                          this,
                          "enable_maintenance_mode"
                        )}
                        checked={fields.enable_maintenance_mode}
                        onColor="#666cff"
                        className="react-switch"
                        onHandleColor="#bdbfff"
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      />
                      <span>Enable Maintenance Mode</span>
                    </div>
                  </div>
                  <div className="col-md-3" style={{ display: "none" }}>
                    <div className="form-floating form-floating-outline mb-4">
                      <Switch
                        onChange={this.handleChange.bind(
                          this,
                          "enable_itemwise_report"
                        )}
                        checked={fields.enable_itemwise_report}
                        onColor="#666cff"
                        className="react-switch"
                        onHandleColor="#bdbfff"
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      />
                      <span>Enable Itemwise Report</span>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-floating form-floating-outline mb-4">
                      <Switch
                        onChange={this.handleChange.bind(
                          this,
                          "enable_subscription"
                        )}
                        checked={fields.enable_subscription}
                        onColor="#666cff"
                        className="react-switch"
                        onHandleColor="#bdbfff"
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      />
                      <span>Enable Subscription</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                type="button"
                className="accordion-button collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#accordionStyle1-2"
                aria-expanded="false"
              >
                Promotion Settings
              </button>
            </h2>
            <div
              id="accordionStyle1-2"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionStyle1"
            >
              <div className="accordion-body">
                <div className="row g-3">
                  <div className="col-md-3">
                    <div className="form-floating form-floating-outline mb-4">
                      <Switch
                        onChange={this.handleChange.bind(
                          this,
                          "enable_loyalty"
                        )}
                        checked={fields.enable_loyalty}
                        onColor="#666cff"
                        className="react-switch"
                        onHandleColor="#bdbfff"
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      />
                      <span>Enable Loyalty</span>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-floating form-floating-outline mb-4">
                      <Switch
                        onChange={this.handleChange.bind(
                          this,
                          "enable_promocode"
                        )}
                        checked={fields.enable_promocode}
                        onColor="#666cff"
                        className="react-switch"
                        onHandleColor="#bdbfff"
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      />
                      <span>Enable Promocode</span>
                    </div>
                  </div>
                  <div className="col-md-3" style={{ display: "none" }}>
                    <div className="form-floating form-floating-outline mb-4">
                      <Switch
                        onChange={this.handleChange.bind(
                          this,
                          "enable_new_signup_promocode"
                        )}
                        checked={fields.enable_new_signup_promocode}
                        onColor="#666cff"
                        className="react-switch"
                        onHandleColor="#bdbfff"
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      />
                      <span>Enable New Signup Promocode</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="accordion-item " style={{ display: "none" }}>
            <h2 className="accordion-header">
              <button
                type="button"
                className="accordion-button collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#accordiontime"
                aria-expanded="false"
              >
                Time Settings
              </button>
            </h2>

            <div
              id="accordiontime"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionStyle1"
            >
              <div className="accordion-body">
                <div className="row g-3">
                  <div className="col-md-3">
                    <div className="form-floating form-floating-outline mb-4">
                      <Switch
                        onChange={this.handleChange.bind(
                          this,
                          "enable_holiday"
                        )}
                        checked={fields.enable_holiday}
                        onColor="#666cff"
                        className="react-switch"
                        onHandleColor="#bdbfff"
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      />
                      <span>Enable Holiday</span>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-floating form-floating-outline mb-4">
                      <Switch
                        onChange={this.handleChange.bind(
                          this,
                          "enable_order_count"
                        )}
                        checked={fields.enable_order_count}
                        onColor="#666cff"
                        className="react-switch"
                        onHandleColor="#bdbfff"
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      />
                      <span>Enable Order Count</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="accordion-item ">
            <h2 className="accordion-header">
              <button
                type="button"
                className="accordion-button collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#accordiontax"
                aria-expanded="false"
              >
                Tax Settings
              </button>
            </h2>

            <div
              id="accordiontax"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionStyle1"
            >
              <div className="accordion-body">
                <div className="row g-3">
                  <div className="col-md-3">
                    <div className="form-floating form-floating-outline mb-4">
                      <Switch
                        onChange={this.handleChange.bind(this, "enable_tax")}
                        checked={fields.enable_tax}
                        onColor="#666cff"
                        className="react-switch"
                        onHandleColor="#bdbfff"
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      />
                      <span>Enable Tax</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="accordion-item " style={{ display: "none" }}>
            <h2 className="accordion-header">
              <button
                type="button"
                className="accordion-button collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#accordionproduct"
                aria-expanded="false"
              >
                Product Settings
              </button>
            </h2>

            <div
              id="accordionproduct"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionStyle1"
            >
              <div className="accordion-body">
                <div className="row g-3">
                  <div className="col-md-3">
                    <div className="form-floating form-floating-outline mb-4">
                      <Switch
                        onChange={this.handleChange.bind(
                          this,
                          "enable_highlight_product"
                        )}
                        checked={fields.enable_highlight_product}
                        onColor="#666cff"
                        className="react-switch"
                        onHandleColor="#bdbfff"
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      />
                      <span>Enable Highlight Product</span>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-floating form-floating-outline mb-4">
                      <Switch
                        onChange={this.handleChange.bind(
                          this,
                          "enable_product_time_availability"
                        )}
                        checked={fields.enable_product_time_availability}
                        onColor="#666cff"
                        className="react-switch"
                        onHandleColor="#bdbfff"
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      />
                      <span>Enable Product Time Availability</span>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-floating form-floating-outline mb-4">
                      <Switch
                        onChange={this.handleChange.bind(
                          this,
                          "enable_productspecial_days"
                        )}
                        checked={fields.enable_productspecial_days}
                        onColor="#666cff"
                        className="react-switch"
                        onHandleColor="#bdbfff"
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      />
                      <span>Enable Product Special Days</span>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-floating form-floating-outline mb-4">
                      <Switch
                        onChange={this.handleChange.bind(
                          this,
                          "enable_product_rating"
                        )}
                        checked={fields.enable_product_rating}
                        onColor="#666cff"
                        className="react-switch"
                        onHandleColor="#bdbfff"
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      />
                      <span>Enable Product Rating</span>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-floating form-floating-outline mb-4">
                      <Switch
                        onChange={this.handleChange.bind(this, "enable_stock")}
                        checked={fields.enable_stock}
                        onColor="#666cff"
                        className="react-switch"
                        onHandleColor="#bdbfff"
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      />
                      <span>Enable Stock</span>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-floating form-floating-outline mb-4">
                      <Switch
                        onChange={this.handleChange.bind(
                          this,
                          "enable_stock_auto_update"
                        )}
                        checked={fields.enable_stock_auto_update}
                        onColor="#666cff"
                        className="react-switch"
                        onHandleColor="#bdbfff"
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      />
                      <span>Enable Stock Auto Update</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="accordion-item ">
            <h2 className="accordion-header">
              <button
                type="button"
                className="accordion-button collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#accordionsms"
                aria-expanded="false"
              >
                SMS Settings
              </button>
            </h2>

            <div
              id="accordionsms"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionStyle1"
            >
              <div className="accordion-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating form-floating-outline mb-4">
                      <Switch
                        onChange={this.handleChange.bind(this, "enable_sms")}
                        checked={fields.enable_sms}
                        onColor="#666cff"
                        className="react-switch"
                        onHandleColor="#bdbfff"
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      />
                      <span>Enable SMS</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating form-floating-outline mb-4">
                      <Switch
                        onChange={this.handleChange.bind(this, "sms_mode")}
                        checked={fields.sms_mode}
                        onColor="#666cff"
                        className="react-switch"
                        onHandleColor="#bdbfff"
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                        width={100}
                        uncheckedIcon={
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "left",
                              alignItems: "left",
                              height: "100%",
                              marginLeft: "-26px",
                              marginTop: "3px",
                              fontSize: 15,
                              color: "white",
                              paddingRight: 2,
                            }}
                          >
                            Sandbox
                          </div>
                        }
                        checkedIcon={
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              height: "100%",
                              fontSize: 15,
                              color: "white",
                              paddingRight: 2,
                            }}
                          >
                            Live
                          </div>
                        }
                      />
                      <span>Mode</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating form-floating-outline mb-4">
                      <Select
                        value={fields.sms_period}
                        onChange={this.handleSelectChange.bind(
                          this,
                          "sms_period"
                        )}
                        placeholder="Select Period"
                        options={[
                          { value: "1", label: "1 Month" },
                          { value: "2", label: "2 Months" },
                          { value: "3", label: "3 Months" },
                          { value: "4", label: "6 Months" },
                          { value: "5", label: "1 Year" },
                        ]}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating form-floating-outline mb-4">
                      <input
                        type="text"
                        className="form-control"
                        name="sms_count"
                        id="sms_count"
                        value={fields.sms_count}
                        {...$field("sms_count", (e) =>
                          onChange("sms_count", e.target.value)
                        )}
                      />
                      <label htmlFor="sms_count">SMS Count / Period</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating form-floating-outline mb-4">
                      <input
                        type="text"
                        className="form-control"
                        name="sms_live_account_sid"
                        id="sms_live_account_sid"
                        value={fields.sms_live_account_sid}
                        {...$field("sms_live_account_sid", (e) =>
                          onChange("sms_live_account_sid", e.target.value)
                        )}
                      />
                      <label htmlFor="sms_live_account_sid">
                        Live Account SID
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating form-floating-outline mb-4">
                      <input
                        type="text"
                        className="form-control"
                        name="sms_live_auth_token"
                        id="sms_live_auth_token"
                        value={fields.sms_live_auth_token}
                        {...$field("sms_live_auth_token", (e) =>
                          onChange("sms_live_auth_token", e.target.value)
                        )}
                      />
                      <label htmlFor="sms_live_auth_token">
                        Live Auth Token
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating form-floating-outline mb-4">
                      <input
                        type="text"
                        className="form-control"
                        name="sms_live_from_number"
                        id="sms_live_from_number"
                        value={fields.sms_live_from_number}
                        {...$field("sms_live_from_number", (e) =>
                          onChange("sms_live_from_number", e.target.value)
                        )}
                      />
                      <label htmlFor="sms_live_from_number">
                        Live From Number
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating form-floating-outline mb-4">
                      <input
                        type="text"
                        className="form-control"
                        name="sms_test_account_sid"
                        id="sms_test_account_sid"
                        value={fields.sms_test_account_sid}
                        {...$field("sms_test_account_sid", (e) =>
                          onChange("sms_test_account_sid", e.target.value)
                        )}
                      />
                      <label htmlFor="sms_test_account_sid">
                        Test Account SID
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating form-floating-outline mb-4">
                      <input
                        type="text"
                        className="form-control"
                        name="sms_test_auth_token"
                        id="sms_test_auth_token"
                        value={fields.sms_test_auth_token}
                        {...$field("sms_test_auth_token", (e) =>
                          onChange("sms_test_auth_token", e.target.value)
                        )}
                      />
                      <label htmlFor="sms_test_auth_token">
                        Test Auth Token
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating form-floating-outline mb-4">
                      <input
                        type="text"
                        className="form-control"
                        name="sms_test_from_number"
                        id="sms_test_from_number"
                        value={fields.sms_test_from_number}
                        {...$field("sms_test_from_number", (e) =>
                          onChange("sms_test_from_number", e.target.value)
                        )}
                      />
                      <label htmlFor="sms_test_from_number">
                        Test From Number
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="accordion-item " style={{ display: "none" }}>
            <h2 className="accordion-header">
              <button
                type="button"
                className="accordion-button collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#accordioncustomer"
                aria-expanded="false"
              >
                Customer Settings
              </button>
            </h2>

            <div
              id="accordioncustomer"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionStyle1"
            >
              <div className="accordion-body">
                <div className="row g-3">
                  <div className="col-md-3">
                    <div className="form-floating form-floating-outline mb-4">
                      <Switch
                        onChange={this.handleChange.bind(
                          this,
                          "enable_corporate_customer"
                        )}
                        checked={fields.enable_corporate_customer}
                        onColor="#666cff"
                        className="react-switch"
                        onHandleColor="#bdbfff"
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      />
                      <span>Enable Corporate Customer </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="accordion-item ">
            <h2 className="accordion-header">
              <button
                type="button"
                className="accordion-button collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#accordionpayment"
                aria-expanded="false"
              >
                Membership Settings
              </button>
            </h2>

            <div
              id="accordionpayment"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionStyle1"
            >
              <div className="accordion-body">
                <div className="row g-3">
                  <div className="col-md-3">
                    <div className="form-floating form-floating-outline mb-4">
                      <Switch
                        onChange={this.handleChange.bind(
                          this,
                          "enable_membership"
                        )}
                        checked={fields.enable_membership}
                        onColor="#666cff"
                        className="react-switch"
                        onHandleColor="#bdbfff"
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      />
                      <span>Enable Membership</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="accordion-item ">
            <h2 className="accordion-header">
              <button
                type="button"
                className="accordion-button collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#accordionmembership"
                aria-expanded="false"
              >
                Payment Settings
              </button>
            </h2>
            <div
              id="accordionmembership"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionStyle1"
            >
              <div className="accordion-body">
                <div className="row g-3">
                  <div className="col-md-12">
                    <div className="form-floating form-floating-outline mb-4">
                      <Switch
                        onChange={this.handleChange.bind(this, "enable_strip")}
                        checked={fields.enable_strip}
                        onColor="#666cff"
                        className="react-switch"
                        onHandleColor="#bdbfff"
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      />
                      <span>Enable Strip</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-4 text-end">
          <button
            type="button"
            className="btn btn-primary me-sm-3 me-1 waves-effect waves-light submit_frm"
            onClick={(e) => {
              e.preventDefault();
              this.props.$submit(onValid, onInvalid);
            }}
          >
            Submit
          </button>
          <Link to={"/masterpanel/client"}>
            <button
              type="reset"
              className="btn btn-label-secondary waves-effect"
            >
              Cancel
            </button>
          </Link>
        </div>
      </form>
    );
  }
}
Form = validated(validationConfig)(Form);
