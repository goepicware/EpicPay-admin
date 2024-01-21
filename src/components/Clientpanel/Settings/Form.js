/* eslint-disable */
import React, { Component } from "react";
import cookie from "react-cookies";
import axios from "axios";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import update from "immutability-helper";
import { validated } from "react-custom-validation";
import validator from "validator";
import { GET_FORMPOST, GET_DETAILDATA } from "../../../actions";
import {
  apiUrl,
  clientheaderconfig,
  awsCredentials,
  bucketName,
  foldername,
} from "../../Helpers/Config";
import {
  showLoader,
  hideLoader,
  showAlert,
  userID,
  clientID,
  CompanyID,
} from "../../Helpers/SettingHelper";
import PageLoader from "../../Helpers/PageLoader";
import Header from "../Layout/Header";
import Topmenu from "../Layout/Topmenu";
import Footer from "../Layout/Footer";
import Editor from "../Layout/Editor";
import AWS from "aws-sdk";
AWS.config.update(awsCredentials);
const s3 = new AWS.S3();
var module = "clientpanel/clients/";
var moduleName = "Product";
var modulePath = "/clientpanel/outlet";
var socilaMediaList = [
  { label: "Youtube", value: "Youtube" },
  { label: "Facebook", value: "Facebook" },
  { label: "Twitter", value: "Twitter" },
  { label: "Instagram", value: "Instagram" },
  { label: "Google+", value: "Google+" },
  { label: "Linkedin", value: "Linkedin" },
  { label: "Pinterest", value: "Pinterest" },
];
class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageloading: false,
      clientdata: {
        company_name: "",
        company_site_url: "",
        company_max_order_handle: "",
        company_logo: "",
        company_owner_name: "",
        company_postal_code: "",
        company_unit_no: "",
        company_floor_no: "",
        company_address: "",
        company_contact_number: "",
        company_email: "",
        company_tax_type: "",
        company_tax_percentage: "",
        company_gst_no: "",
        company_invoice_logo: "",
        enable_promotion_code_popup: "",
        enable_normal_popup: "",
        first_time_order_promotion: "",
        new_signup_promotion: "",
        company_reward_point: "",
        company_review_point: "",
        loyalty_percentage: "",
        loyalty_expiryon: "",
        social_media: [{ linktype: "", link: "" }],
        email_from_name: "",
        admin_email: "",
        order_notification_email: "",
        email_footer_content: "",
        email_setting_type: "",
        from_email: "",
        smtp_host: "",
        smtp_username: "",
        smtp_password: "",
        smtp_port: "",
        smtp_mail_path: "",
        enable_maintenance_mode: "",
        maintenance_mode_description: "",
        assign_availability: [],
        action: "add",
        company_stripe_mode: '',
        company_stripe_secret_test: '',
        company_stripe_secret_live: '',
        company_stripe_public_test: '',
        company_stripe_public_live: '',
      },
      loading: true,
      tatList: [],
      availabiltyList: [],
      promoList: [],
      formpost: [],
      companyDetail: [],
    };
  }
  componentDidMount() {
    this.loadAvailabilty();
    this.loadPromotions();

    var params = {
      params: "company_id=" + CompanyID(),
      url: apiUrl + module + "details",
      type: "client",
    };
    this.setState({ pageloading: true });
    this.props.getDetailData(params);
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
          showAlert("Success", errMsg, "success", "No");
        } else {
          showAlert("Error", errMsg, "error", "No");
        }
      }
    }
    if (this.state.companyDetail !== nextProps.detaildata) {
      this.setState({ companyDetail: nextProps.detaildata }, function () {
        if (nextProps.detaildata[0].status === "ok") {
          var result = nextProps.detaildata[0].result;

          var company_tax_type =
            result.company_tax_type !== "" &&
            typeof result.company_tax_type !== undefined &&
            typeof result.company_tax_type !== "undefined"
              ? {
                  label: result.company_tax_type,
                  value: result.company_tax_type,
                }
              : "";

          var company_stripe_mode =
            typeof result.company_stripe_mode !== undefined &&
            typeof result.company_stripe_mode !== "undefined" &&
            result.company_stripe_mode !== "" 
              ? {
                  label: result.company_stripe_mode == 1 ? 'Live': 'Test',
                  value: result.company_stripe_mode,
                }
              : "";

          var first_time_order_promotion =
            result.first_time_order_promotion !== "" &&
            typeof result.first_time_order_promotion !== undefined &&
            typeof result.first_time_order_promotion !== "undefined"
              ? {
                  label: result.first_time_order_promotion,
                  value: result.first_time_order_promotion,
                }
              : "";
          var new_signup_promotion =
            result.new_signup_promotion !== "" &&
            typeof result.new_signup_promotion !== undefined &&
            typeof result.new_signup_promotion !== "undefined"
              ? {
                  label: result.new_signup_promotion,
                  value: result.new_signup_promotion,
                }
              : "";
          var email_setting_type =
            result.email_setting_type !== "" &&
            typeof result.email_setting_type !== undefined &&
            typeof result.email_setting_type !== "undefined"
              ? {
                  label: result.email_setting_type,
                  value: result.email_setting_type,
                }
              : "";
          var clientupdatedata = {
            company_name: result.company_name,
            company_site_url: result.company_site_url,
            company_max_order_handle:
              result.company_max_order_handle !== "" &&
              typeof result.company_max_order_handle !== undefined &&
              typeof result.company_max_order_handle !== "undefined"
                ? result.company_max_order_handle
                : "",
            company_logo: result.company_logo,
            company_owner_name:
              result.company_owner_name !== null
                ? result.company_owner_name
                : "",
            company_postal_code:
              result.company_postal_code !== null
                ? result.company_postal_code
                : "",
            company_unit_no:
              result.company_unit_number !== null
                ? result.company_unit_number
                : "",
            company_floor_no:
              result.company_floor_number !== null
                ? result.company_floor_number
                : "",
            company_address:
              result.company_address !== null ? result.company_address : "",
            company_contact_number:
              result.company_contact_number !== null
                ? result.company_contact_number
                : "",
            company_email:
              result.company_email_address !== null
                ? result.company_email_address
                : "",
            company_tax_type: company_tax_type,
            company_tax_percentage:
              result.company_tax_percentage !== "" &&
              typeof result.company_tax_percentage !== undefined &&
              typeof result.company_tax_percentage !== "undefined"
                ? result.company_tax_percentage
                : "",
            company_stripe_mode: company_stripe_mode,
            company_stripe_public_live:
              typeof result.company_stripe_public_live !== undefined &&
              typeof result.company_stripe_public_live !== "undefined" && 
              result.company_stripe_public_live !== ""
                ? result.company_stripe_public_live
                : "",
            company_stripe_public_test:
              typeof result.company_stripe_public_test !== undefined &&
              typeof result.company_stripe_public_test !== "undefined" && 
              result.company_stripe_public_test !== ""
                ? result.company_stripe_public_test
                : "",
            company_stripe_secret_live:
              typeof result.company_stripe_secret_live !== undefined &&
              typeof result.company_stripe_secret_live !== "undefined" && 
              result.company_stripe_secret_live !== ""
                ? result.company_stripe_secret_live
                : "",
            company_stripe_secret_test:
              typeof result.company_stripe_secret_test !== undefined &&
              typeof result.company_stripe_secret_test !== "undefined" && 
              result.company_stripe_secret_test !== ""
                ? result.company_stripe_secret_test
                : "",

            company_gst_no:
              result.company_gst_no !== "" &&
              typeof result.company_gst_no !== undefined
                ? result.company_gst_no
                : "",
            company_invoice_logo:
              result.company_invoice_logo !== "" &&
              typeof result.company_invoice_logo !== undefined &&
              typeof result.company_invoice_logo !== "undefined"
                ? result.company_invoice_logo
                : "",
            enable_promotion_code_popup:
              result.enable_promotion_code_popup !== "" &&
              typeof result.enable_promotion_code_popup !== undefined &&
              typeof result.enable_promotion_code_popup !== "undefined"
                ? result.enable_promotion_code_popup
                : "",
            enable_normal_popup:
              result.enable_normal_popup !== "" &&
              typeof result.enable_normal_popup !== undefined &&
              typeof result.enable_normal_popup !== "undefined"
                ? result.enable_normal_popup
                : "",
            first_time_order_promotion: first_time_order_promotion,
            new_signup_promotion: new_signup_promotion,
            company_reward_point:
              result.company_reward_point !== "" &&
              typeof result.company_reward_point !== undefined &&
              typeof result.company_reward_point !== "undefined"
                ? result.company_reward_point
                : "",
            company_review_point:
              result.company_review_point !== "" &&
              typeof result.company_review_point !== undefined &&
              typeof result.company_review_point !== "undefined"
                ? result.company_review_point
                : "",
            loyalty_percentage:
              result.loyalty_percentage !== "" &&
              typeof result.loyalty_percentage !== undefined &&
              typeof result.loyalty_percentage !== "undefined"
                ? result.loyalty_percentage
                : "",
            loyalty_expiryon:
              result.loyalty_expiryon !== "" &&
              typeof result.loyalty_expiryon !== undefined &&
              typeof result.loyalty_expiryon !== "undefined"
                ? result.loyalty_expiryon
                : "",
            social_media:
              result.social_media !== "" &&
              typeof result.social_media !== undefined &&
              typeof result.social_media !== "undefined"
                ? JSON.parse(result.social_media)
                : [{ linktype: "", link: "" }],
            email_from_name:
              result.email_from_name !== "" &&
              typeof result.email_from_name !== undefined &&
              typeof result.email_from_name !== "undefined"
                ? result.email_from_name
                : "",
            admin_email:
              result.admin_email !== "" &&
              typeof result.admin_email !== undefined &&
              typeof result.admin_email !== "undefined"
                ? result.admin_email
                : "",
            order_notification_email:
              result.order_notification_email !== "" &&
              typeof result.order_notification_email !== undefined &&
              typeof result.order_notification_email !== "undefined"
                ? result.order_notification_email
                : "",
            email_footer_content:
              result.email_footer_content !== "" &&
              typeof result.email_footer_content !== undefined &&
              typeof result.email_footer_content !== "undefined"
                ? result.email_footer_content
                : "",
            email_setting_type: email_setting_type,
            from_email:
              result.from_email !== "" &&
              typeof result.from_email !== undefined &&
              typeof result.from_email !== "undefined"
                ? result.from_email
                : "",
            smtp_host:
              result.smtp_host !== "" &&
              typeof result.smtp_host !== undefined &&
              typeof result.smtp_host !== "undefined"
                ? result.smtp_host
                : "",
            smtp_username:
              result.smtp_username !== "" &&
              typeof result.smtp_username !== undefined &&
              typeof result.smtp_username !== "undefined"
                ? result.smtp_username
                : "",
            smtp_password:
              result.smtp_password !== "" &&
              typeof result.smtp_password !== undefined &&
              typeof result.smtp_password !== "undefined"
                ? result.smtp_password
                : "",
            smtp_port:
              result.smtp_port !== "" &&
              typeof result.smtp_port !== undefined &&
              typeof result.smtp_port !== "undefined"
                ? result.smtp_port
                : "",
            smtp_mail_path:
              result.smtp_mail_path !== "" &&
              typeof result.smtp_mail_path !== undefined &&
              typeof result.smtp_mail_path !== "undefined"
                ? result.smtp_mail_path
                : "",
            enable_maintenance_mode:
              result.enable_maintenance_mode !== "" &&
              typeof result.enable_maintenance_mode !== undefined &&
              typeof result.enable_maintenance_mode !== "undefined"
                ? result.enable_maintenance_mode
                : "",
            maintenance_mode_description:
              result.maintenance_mode_description !== "" &&
              typeof result.maintenance_mode_description !== undefined &&
              typeof result.maintenance_mode_description !== "undefined" &&
              result.maintenance_mode_description !== null
                ? result.maintenance_mode_description
                : "",
            assign_availability: [],
            action: "edit",
          };
          this.setState({ clientdata: clientupdatedata, pageloading: false });
        } else {
          this.setState({ pageloading: false });
          this.props.history.push(modulePath);
          showAlert("Error", "Invalid Product", "error");
        }
      });
    }
  }

  loadAvailabilty() {
    var urlShringTxt = apiUrl + "company/settings/availabilty_list";
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "success") {
        this.setState({ availabiltyList: res.data.result });
      }
    });
  }
  loadPromotions() {
    var urlShringTxt =
      apiUrl + "clientpanel/promotion/dropdownlist?company_id=" + CompanyID();
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      var promoList = [];
      if (res.data.status === "ok") {
        if (res.data.result.length > 0) {
          res.data.result.map((item) => {
            promoList.push({ label: item.label, value: item.label });
          });
        }
      }
      this.setState({ promoList: promoList });
    });
  }

  sateValChange = (field, value) => {
    if (field === "page") {
    }
  };

  /* signin - start*/
  fieldChange = (field, value) => {
    this.setState(
      update(this.state, { clientdata: { [field]: { $set: value } } })
    );
  };

  handleSubmit = () => {
    showLoader("submit_frm", "class");
    var postData = this.state.clientdata;

    var assign_availability = [];
    if (postData.assign_availability.length > 0) {
      postData.assign_availability.map((item) => {
        assign_availability.push(item.value);
      });
    }

    var postObject = {
      company_name: postData.company_name,
      company_site_url: postData.company_site_url,
      company_max_order_handle: postData.company_max_order_handle,
      company_logo: postData.company_logo,
      company_owner_name: postData.company_owner_name,
      company_postal_code: postData.company_postal_code,
      company_unit_no: postData.company_unit_no,
      company_floor_no: postData.company_floor_no,
      company_address: postData.company_address,
      company_contact_number: postData.company_contact_number,
      company_email: postData.company_email,
      company_tax_type:
        Object.keys(postData.company_tax_type).length > 0
          ? postData.company_tax_type.value
          : "",
      company_tax_percentage:
        Object.keys(postData.company_tax_type).length > 0
          ? postData.company_tax_percentage
          : "",
      company_stripe_mode:
        Object.keys(postData.company_stripe_mode).length > 0
          ? postData.company_stripe_mode.value
          : '',
      company_stripe_secret_test: postData.company_stripe_secret_test,
      company_stripe_secret_live: postData.company_stripe_secret_live,
      company_stripe_public_test: postData.company_stripe_public_test,
      company_stripe_public_live: postData.company_stripe_public_live,

      company_gst_no: postData.company_gst_no,
      company_invoice_logo: postData.company_invoice_logo,
      enable_promotion_code_popup: postData.enable_promotion_code_popup,
      enable_normal_popup: postData.enable_normal_popup,
      first_time_order_promotion:
        Object.keys(postData.first_time_order_promotion).length > 0
          ? postData.first_time_order_promotion.value
          : "",
      new_signup_promotion:
        Object.keys(postData.new_signup_promotion).length > 0
          ? postData.new_signup_promotion.value
          : "",
      company_reward_point: postData.company_reward_point,
      company_review_point: postData.company_review_point,
      loyalty_percentage: postData.loyalty_percentage,
      loyalty_expiryon: postData.loyalty_expiryon,
      social_media:
        postData.social_media.length > 0
          ? JSON.stringify(postData.social_media)
          : "",
      email_from_name: postData.email_from_name,
      admin_email: postData.admin_email,
      order_notification_email: postData.order_notification_email,
      email_footer_content: postData.email_footer_content,
      email_setting_type:
        Object.keys(postData.email_setting_type).length > 0
          ? postData.email_setting_type.value
          : "",
      from_email: postData.from_email,
      smtp_host: postData.smtp_host,
      smtp_username: postData.smtp_username,
      smtp_password: postData.smtp_password,
      smtp_port: postData.smtp_port,
      smtp_mail_path: postData.smtp_mail_path,
      enable_maintenance_mode: postData.enable_maintenance_mode,
      maintenance_mode_description: postData.maintenance_mode_description,
      assign_availability: assign_availability,
      loginID: userID(),
      company_admin_id: clientID(),
      company_id: CompanyID(),
      action: postData.action,
    };
    var post_url = module + "update";

    this.props.getFormPost(postObject, post_url, "client");
  };

  render() {
    return (
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <Header {...this.props} currentPage="" />
          <div className="layout-page">
            <Topmenu />
            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row mb-3">
                  <div className="col-lg-10 col-md-6">
                    <h4 className="fw-bold">Settings</h4>
                  </div>
                </div>
                <PostForm
                  {...this.props}
                  fields={this.state.clientdata}
                  onChange={this.fieldChange}
                  onValid={this.handleSubmit}
                  error_msg={this.state.error_msg}
                  availabiltyList={this.state.availabiltyList}
                  promoList={this.state.promoList}
                  onInvalid={() => {
                    console.log("Form invalid!");
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

export default connect(mapStateTopProps, mapDispatchToProps)(Form);

const isEmpty = (value) => (value === "" ? "This field is required." : null);
const isNumber = (value) =>
  validator.isNumeric(value) && value === ""
    ? null
    : "This is not a valid number.";
const isValidOption = (taxType, value) => {
  if (Object.keys(taxType).length > 0) {
    return value === "" ? "This field is required." : null;
  }
};
function validationConfig(props) {
  const {
    company_name,
    company_site_url,
    company_owner_name,
    company_postal_code,
    company_unit_no,
    company_address,
    company_email,
    company_invoice_logo,
    email_from_name,
    admin_email,
    order_notification_email,
    from_email,
    company_tax_type,
    company_tax_percentage,
    email_setting_type,
    smtp_host,
    smtp_username,
    smtp_password,
    smtp_port,
    smtp_mail_path,
    company_stripe_secret_test,
    company_stripe_secret_live,
    company_stripe_public_test,
    company_stripe_public_live,
    company_stripe_mode
  } = props.fields;

  return {
    fields: [
      "company_name",
      "company_site_url",
      "company_owner_name",
      "company_postal_code",
      "company_unit_no",
      "company_address",
      "company_email",
      "company_invoice_logo",
      "email_from_name",
      "admin_email",
      "order_notification_email",
      "from_email",
      "company_tax_type",
      "company_tax_percentage",
      "email_setting_type",
      "smtp_host",
      "smtp_username",
      "smtp_password",
      "smtp_port",
      "smtp_mail_path",
      "company_stripe_secret_test",
      "company_stripe_secret_live",
      "company_stripe_public_test",
      "company_stripe_public_live",
    ],

    validations: {
      company_name: [[isEmpty, company_name]],
      company_site_url: [[isEmpty, company_site_url]],
      company_owner_name: [[isEmpty, company_owner_name]],
      company_postal_code: [
        [isEmpty, company_postal_code],
        /* [isNumber, company_postal_code], */
      ],
      company_unit_no: [[isEmpty, company_unit_no]],
      company_address: [[isEmpty, company_address]],
      company_email: [[isEmpty, company_email]],
      company_invoice_logo: [[isEmpty, company_invoice_logo]],
      email_from_name: [[isEmpty, email_from_name]],
      admin_email: [[isEmpty, admin_email]],
      order_notification_email: [[isEmpty, order_notification_email]],
      from_email: [[isEmpty, from_email]],
      company_tax_percentage: [
        [isValidOption, company_tax_type, company_tax_percentage],
      ],
      smtp_host: [[isValidOption, email_setting_type, smtp_host]],
      smtp_username: [[isValidOption, email_setting_type, smtp_username]],
      smtp_password: [[isValidOption, email_setting_type, smtp_password]],
      smtp_port: [[isValidOption, email_setting_type, smtp_port]],
      smtp_mail_path: [[isValidOption, email_setting_type, smtp_mail_path]],
      company_stripe_secret_test: [[isEmpty, company_stripe_secret_test]],
      company_stripe_secret_live: [[isEmpty, company_stripe_secret_live]],
      company_stripe_public_test: [[isEmpty, company_stripe_public_test]],
      company_stripe_public_live: [[isEmpty, company_stripe_public_live]],
    },
  };
}

class PostForm extends Component {
  constructor(props) {
    super(props);
    this.setContent = this.setContent.bind(this);
  }

  handleChange(name, value) {
    this.props.onChange(name, value);
  }
  handleSelectChange(name, value) {
    this.props.onChange(name, value);
  }
  handleChangeCheck(name, event) {
    console.log(event.target, "event.target");
    var value = event.target.checked === true ? "Yes" : "No";
    if (name === "assign_availability") {
      var assign_availability = this.props.fields.assign_availability;
      if (
        this.props.fields.assign_availability.indexOf(event.target.value) >= 0
      ) {
        const index = assign_availability.indexOf(value);
        assign_availability.splice(index, 1);
      } else {
        assign_availability.push(event.target.value);
      }
      value = assign_availability;
    }

    this.props.onChange(name, value);
  }

  setContent(value) {
    this.props.onChange("maintenance_mode_description", value);
  }

  async uplaodFiles(imageType) {
    var imagefile = document.querySelector("#" + imageType);
    const file = imagefile.files[0];
    var imgFolder = foldername;
    if (imageType === "company_invoice_logo") {
      imgFolder = imgFolder + "/invoicelogo";
    }
    const params = {
      Bucket: bucketName,
      Key: `media/${imgFolder}/${file.name}`,
      Body: file,
      ACL: "public-read",
    };
    const { Location } = await s3.upload(params).promise();
    this.props.onChange(imageType, Location);
    $("#" + imageType).val("");
  }
  async removeImage(fileNamme, imageType) {
    var fileNammeSplit = fileNamme.split("/");
    var imgFolder = foldername;
    if (imageType === "company_invoice_logo") {
      imgFolder = imgFolder + "/invoicelogo";
    }
    var params = {
      Bucket: bucketName,
      Key: `media/${imgFolder}/${fileNammeSplit[fileNammeSplit.length - 1]}`,
    };
    await s3.deleteObject(params).promise();
    this.props.onChange(imageType, "");
  }

  addSocialMedia() {
    var social_media = this.props.fields.social_media;
    if (socilaMediaList.length >= social_media.length) {
      social_media.push({ linktype: "", link: "" });
      this.props.onChange("social_media", social_media);
    }
  }
  removeSocialMedia(removeIndex) {
    var updSocialMedia = [];
    if (this.props.fields.social_media.length > 0) {
      this.props.fields.social_media.map((item, index) => {
        if (removeIndex != index) {
          updSocialMedia.push(item);
        }
      });
    }
    this.props.onChange("social_media", updSocialMedia);
  }
  handleSelectSocial(updindex, type, val) {
    var updSocialMedia = [];
    if (this.props.fields.social_media.length > 0) {
      this.props.fields.social_media.map((item, index) => {
        if (updindex === index) {
          var social_media_type = item.social_media_type;
          var social_media_link = item.social_media_link;
          if (type === "social_media_type") {
            social_media_type = val;
          } else if (type === "social_media_link") {
            social_media_link = val.target.value;
          }
          var res = {
            social_media_type: social_media_type,
            social_media_link: social_media_link,
          };
          updSocialMedia.push(res);
        } else {
          updSocialMedia.push(item);
        }
      });
    }
    this.props.onChange("social_media", updSocialMedia);
  }
  render() {
    const { fields, onChange, onValid, onInvalid, $field, $validation } =
      this.props;
    let errMsgCompanyName,
      errMsgUrl,
      errMsgOwner,
      errMsgPostalCode,
      errMsgUnitNo,
      errMsgAddress,
      errMsgEmail,
      errMsgInvoiceLogo,
      errMsgFromName,
      errMsgAdminEmail,
      errMsgOrderNotify,
      errMsgFromEmail,
      errMsgTax,
      errMsgHost,
      errMsgSmtpUserName,
      errMsgPwd,
      errMsgSmtpPort,
      errMsgStripe,
      errMsgMailPath = "";
    if ($validation.company_name.error.reason !== undefined) {
      errMsgCompanyName = $validation.company_name.show && (
        <span className="error">{$validation.company_name.error.reason}</span>
      );
    }
    if ($validation.company_site_url.error.reason !== undefined) {
      errMsgUrl = $validation.company_site_url.show && (
        <span className="error">
          {$validation.company_site_url.error.reason}
        </span>
      );
    }
    if ($validation.company_owner_name.error.reason !== undefined) {
      errMsgOwner = $validation.company_owner_name.show && (
        <span className="error">
          {$validation.company_owner_name.error.reason}
        </span>
      );
    }
    if ($validation.company_postal_code.error.reason !== undefined) {
      errMsgPostalCode = $validation.company_postal_code.show && (
        <span className="error">
          {$validation.company_postal_code.error.reason}
        </span>
      );
    }
    if ($validation.company_unit_no.error.reason !== undefined) {
      errMsgUnitNo = $validation.company_unit_no.show && (
        <span className="error">
          {$validation.company_unit_no.error.reason}
        </span>
      );
    }

    if ($validation.company_address.error.reason !== undefined) {
      errMsgAddress = $validation.company_address.show && (
        <span className="error">
          {$validation.company_address.error.reason}
        </span>
      );
    }
    if ($validation.company_email.error.reason !== undefined) {
      errMsgEmail = $validation.company_email.show && (
        <span className="error">{$validation.company_email.error.reason}</span>
      );
    }
    if ($validation.company_invoice_logo.error.reason !== undefined) {
      errMsgInvoiceLogo = $validation.company_invoice_logo.show && (
        <span className="error">
          {$validation.company_invoice_logo.error.reason}
        </span>
      );
    }
    if ($validation.admin_email.error.reason !== undefined) {
      errMsgAdminEmail = $validation.admin_email.show && (
        <span className="error">{$validation.admin_email.error.reason}</span>
      );
    }
    if ($validation.order_notification_email.error.reason !== undefined) {
      errMsgOrderNotify = $validation.order_notification_email.show && (
        <span className="error">
          {$validation.order_notification_email.error.reason}
        </span>
      );
    }
    if ($validation.from_email.error.reason !== undefined) {
      errMsgFromEmail = $validation.from_email.show && (
        <span className="error">{$validation.from_email.error.reason}</span>
      );
    }
    if ($validation.company_tax_percentage.error.reason !== undefined) {
      errMsgTax = $validation.company_tax_percentage.show && (
        <span className="error">
          {$validation.company_tax_percentage.error.reason}
        </span>
      );
    }
    if ($validation.company_stripe_public_live.error.reason !== undefined) {
      errMsgStripe = $validation.company_stripe_public_live.show && (
        <span className="error">
          {$validation.company_stripe_public_live.error.reason}
        </span>
      );
    }
    if ($validation.company_stripe_public_test.error.reason !== undefined) {
      errMsgStripe = $validation.company_stripe_public_test.show && (
        <span className="error">
          {$validation.company_stripe_public_test.error.reason}
        </span>
      );
    }
    if ($validation.company_stripe_secret_live.error.reason !== undefined) {
      errMsgStripe = $validation.company_stripe_secret_live.show && (
        <span className="error">
          {$validation.company_stripe_secret_live.error.reason}
        </span>
      );
    }
    if ($validation.company_stripe_secret_test.error.reason !== undefined) {
      errMsgStripe = $validation.company_stripe_secret_test.show && (
        <span className="error">
          {$validation.company_stripe_secret_test.error.reason}
        </span>
      );
    }

    if ($validation.smtp_host.error.reason !== undefined) {
      errMsgHost = $validation.smtp_host.show && (
        <span className="error">{$validation.smtp_host.error.reason}</span>
      );
    }
    if ($validation.smtp_username.error.reason !== undefined) {
      errMsgSmtpUserName = $validation.smtp_username.show && (
        <span className="error">{$validation.smtp_username.error.reason}</span>
      );
    }
    if ($validation.smtp_password.error.reason !== undefined) {
      errMsgPwd = $validation.smtp_password.show && (
        <span className="error">{$validation.smtp_password.error.reason}</span>
      );
    }
    if ($validation.smtp_port.error.reason !== undefined) {
      errMsgSmtpPort = $validation.smtp_port.show && (
        <span className="error">{$validation.smtp_port.error.reason}</span>
      );
    }
    if ($validation.smtp_mail_path.error.reason !== undefined) {
      errMsgMailPath = $validation.smtp_mail_path.show && (
        <span className="error">{$validation.smtp_mail_path.error.reason}</span>
      );
    }

    return (
      <form className="card fv-plugins-bootstrap5" id="modulefrm">
        <div className="row g-3">
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
                  General Info
                </button>
              </h2>
              <div
                id="accordionStyle1-3"
                className="accordion-collapse collapse show  mt-3"
                data-bs-parent="#accordionStyle1"
              >
                <div className="accordion-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className={
                            errMsgCompanyName !== "" &&
                            errMsgCompanyName !== false &&
                            errMsgCompanyName !== undefined
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
                          Company Name<span className="error">*</span>
                        </label>
                        {errMsgCompanyName}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className={
                            errMsgUrl !== "" &&
                            errMsgUrl !== false &&
                            errMsgUrl !== undefined
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          name="company_site_url"
                          value={fields.company_site_url}
                          {...$field("company_site_url", (e) =>
                            onChange("company_site_url", e.target.value)
                          )}
                        />
                        <label htmlFor="company_site_url">
                          Site URL<span className="error">*</span>
                        </label>
                        {errMsgUrl}
                      </div>
                    </div>
                    <div className="col-md-6" style={{display:'none'}}>
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className="form-control"
                          name="company_max_order_handle"
                          value={fields.company_max_order_handle}
                          {...$field("company_max_order_handle", (e) =>
                            onChange("company_max_order_handle", e.target.value)
                          )}
                        />
                        <label htmlFor="company_max_order_handle">
                          Maximum Handle Order Count
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <div className="mb-3">
                          <label htmlFor="formFile" className="form-label">
                            Company Logo
                          </label>
                          <input
                            className="form-control"
                            type="file"
                            id="company_logo"
                            onChange={(event) => {
                              this.uplaodFiles("company_logo", event);
                              return false;
                            }}
                          />
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
                  data-bs-target="#accordionprice"
                  aria-expanded="false"
                >
                  Contact Info
                </button>
              </h2>

              <div
                id="accordionprice"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionStyle1"
              >
                <div className="accordion-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className={
                            errMsgOwner !== "" &&
                            errMsgOwner !== false &&
                            errMsgOwner !== undefined
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          name="company_owner_name"
                          value={fields.company_owner_name}
                          {...$field("company_owner_name", (e) =>
                            onChange("company_owner_name", e.target.value)
                          )}
                        />
                        <label htmlFor="company_owner_name">
                          Owner Name <span className="error">*</span>
                        </label>
                        {errMsgOwner}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className={
                            errMsgPostalCode !== "" &&
                            errMsgPostalCode !== false &&
                            errMsgPostalCode !== undefined
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          name="company_postal_code"
                          value={fields.company_postal_code}
                          {...$field("company_postal_code", (e) =>
                            onChange("company_postal_code", e.target.value)
                          )}
                        />
                        <label htmlFor="company_postal_code">
                          Postal Code<span className="error">*</span>
                        </label>
                        {errMsgPostalCode}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className={
                            errMsgUnitNo !== "" &&
                            errMsgUnitNo !== false &&
                            errMsgUnitNo !== undefined
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          name="company_unit_no"
                          value={fields.company_unit_no}
                          {...$field("company_unit_no", (e) =>
                            onChange("company_unit_no", e.target.value)
                          )}
                        />
                        <label htmlFor="company_unit_no">
                          Unit No.<span className="error">*</span>
                        </label>
                        {errMsgUnitNo}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className="form-control"
                          name="company_floor_no"
                          value={fields.company_floor_no}
                          {...$field("company_floor_no", (e) =>
                            onChange("company_floor_no", e.target.value)
                          )}
                        />
                        <label htmlFor="company_floor_no">Floor No.</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className={
                            errMsgAddress !== "" &&
                            errMsgAddress !== false &&
                            errMsgAddress !== undefined
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          name="company_address"
                          value={fields.company_address}
                          {...$field("company_address", (e) =>
                            onChange("company_address", e.target.value)
                          )}
                        />
                        <label htmlFor="company_address">
                          Address<span className="error">*</span>
                        </label>
                        {errMsgAddress}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className="form-control"
                          name="company_contact_number"
                          value={fields.company_contact_number}
                          {...$field("company_contact_number", (e) =>
                            onChange("company_contact_number", e.target.value)
                          )}
                        />
                        <label htmlFor="company_contact_number">
                          Contact Number
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className={
                            errMsgEmail !== "" &&
                            errMsgEmail !== false &&
                            errMsgEmail !== undefined
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          name="company_email"
                          value={fields.company_email}
                          {...$field("company_email", (e) =>
                            onChange("company_email", e.target.value)
                          )}
                        />
                        <label htmlFor="company_email">
                          Email Address<span className="error">*</span>
                        </label>
                        {errMsgEmail}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="accordion-item " style={{display:'none'}}>
              <h2 className="accordion-header">
                <button
                  type="button"
                  className="accordion-button collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#accordionstock"
                  aria-expanded="false"
                >
                  Available
                </button>
              </h2>

              <div
                id="accordionstock"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionStyle1"
              >
                <div className="accordion-body">
                  <div className="row g-3">
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
                                  fields.assign_availability.indexOf(
                                    item.av_id
                                  ) >= 0
                                    ? true
                                    : false
                                }
                                onChange={this.handleChangeCheck.bind(
                                  this,
                                  "assign_availability"
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

            <div className="accordion-item ">
              <h2 className="accordion-header">
                <button
                  type="button"
                  className="accordion-button collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#accordionvoucher"
                  aria-expanded="false"
                >
                  Tax Settings
                </button>
              </h2>

              <div
                id="accordionvoucher"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionStyle1"
              >
                <div className="accordion-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline custm-select-box mb-4 ">
                        <Select
                          value={fields.company_tax_type}
                          onChange={this.handleSelectChange.bind(
                            this,
                            "company_tax_type"
                          )}
                          placeholder="Select Tax Type"
                          options={[
                            { label: "Exclusive", value: "Exclusive" },
                            { label: "Inclusive", value: "Inclusive" },
                          ]}
                        />
                        <label className="select-box-label">Tax Type</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className={
                            errMsgTax !== "" &&
                            errMsgTax !== false &&
                            errMsgTax !== undefined
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          name="company_tax_percentage"
                          value={fields.company_tax_percentage}
                          {...$field("company_tax_percentage", (e) =>
                            onChange("company_tax_percentage", e.target.value)
                          )}
                          id="company_tax_percentage"
                        />
                        <label htmlFor="company_tax_percentage">
                          Tax Amount Percentage{" "}
                          {fields.company_tax_type !== "" && (
                            <span className="error">*</span>
                          )}
                        </label>
                        {errMsgTax}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="accordion-item " style={{display:'none'}}>
              <h2 className="accordion-header">
                <button
                  type="button"
                  className="accordion-button collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#accordiongallery"
                  aria-expanded="false"
                >
                  Invoice
                </button>
              </h2>

              <div
                id="accordiongallery"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionStyle1"
              >
                <div className="accordion-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className="form-control"
                          name="company_gst_no"
                          value={fields.company_gst_no}
                          {...$field("company_gst_no", (e) =>
                            onChange("company_gst_no", e.target.value)
                          )}
                        />
                        <label htmlFor="company_gst_no">GST Reg. No</label>
                      </div>
                    </div>
                    <div className="col-md-6"></div>
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <div className="mb-3">
                          <label htmlFor="formFile" className="form-label">
                            Invoice Logo <span className="error">*</span>
                          </label>
                          <input
                            className={
                              errMsgInvoiceLogo !== "" &&
                              errMsgInvoiceLogo !== false &&
                              errMsgInvoiceLogo !== undefined
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            type="file"
                            id="company_invoice_logo"
                            onChange={(event) => {
                              this.uplaodFiles("company_invoice_logo", event);
                              return false;
                            }}
                          />

                          {errMsgInvoiceLogo}
                        </div>
                      </div>
                      {fields.company_invoice_logo !== "" && (
                        <div className="dz-preview dz-processing dz-image-preview dz-success dz-complete">
                          <div className="dz-details">
                            <div className="dz-thumbnail">
                              <img alt="" src={fields.company_invoice_logo} />
                            </div>
                          </div>
                          <a
                            className="dz-remove"
                            href={void 0}
                            onClick={this.removeImage.bind(
                              this,
                              fields.company_invoice_logo,
                              "company_invoice_logo"
                            )}
                          >
                            Remove file
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="accordion-item " style={{display:'none'}}>
              <h2 className="accordion-header">
                <button
                  type="button"
                  className="accordion-button collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#accordiontimeavailability"
                  aria-expanded="false"
                >
                  Promotion Settings
                </button>
              </h2>

              <div
                id="accordiontimeavailability"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionStyle1"
              >
                <div className="accordion-body">
                  <div className="row g-3">
                    <div className="col-md-2">
                      <div className="form-check mt-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="enable_promotion_code_popup"
                          checked={
                            fields.enable_promotion_code_popup === "Yes"
                              ? true
                              : false
                          }
                          onChange={this.handleChangeCheck.bind(
                            this,
                            "enable_promotion_code_popup"
                          )}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="enable_promotion_code_popup"
                        >
                          Promotion Code Popup
                        </label>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-check mt-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value="Yes"
                          id="enable_normal_popup"
                          checked={
                            fields.enable_normal_popup === "Yes" ? true : false
                          }
                          onChange={this.handleChangeCheck.bind(
                            this,
                            "enable_normal_popup"
                          )}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="enable_normal_popup"
                        >
                          Normal Popup
                        </label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-floating form-floating-outline custm-select-box mb-4">
                        <Select
                          value={fields.first_time_order_promotion}
                          onChange={this.handleSelectChange.bind(
                            this,
                            "first_time_order_promotion"
                          )}
                          placeholder="Select First Time Order Promo Code"
                          options={this.props.promoList}
                        />
                        <label className="select-box-label">
                          First Time Order Promo Code
                        </label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-floating form-floating-outline custm-select-box mb-4">
                        {console.log(
                          this.props.promoList,
                          "this.props.promoList"
                        )}
                        <Select
                          value={fields.new_signup_promotion}
                          onChange={this.handleSelectChange.bind(
                            this,
                            "new_signup_promotion"
                          )}
                          placeholder="Select Promocode For New Signup"
                          options={this.props.promoList}
                        />
                        <label className="select-box-label">
                          Promocode For New Signup
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="accordion-item" style={{display:'none'}}>
              <h2 className="accordion-header">
                <button
                  type="button"
                  className="accordion-button collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#accordioncombo-1"
                  aria-expanded="false"
                >
                  Loyalty Settings
                </button>
              </h2>

              <div
                id="accordioncombo-1"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionStyle1"
              >
                <div className="accordion-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className="form-control"
                          name="company_reward_point"
                          value={fields.company_reward_point}
                          {...$field("company_reward_point", (e) =>
                            onChange("company_reward_point", e.target.value)
                          )}
                        />
                        <label htmlFor="company_reward_point">
                          Reward Point (S$1.00)
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className="form-control"
                          name="company_review_point"
                          value={fields.company_review_point}
                          {...$field("company_review_point", (e) =>
                            onChange("company_review_point", e.target.value)
                          )}
                        />
                        <label htmlFor="company_review_point">
                          Review Point (S$1.00)
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className="form-control"
                          name="loyalty_percentage"
                          value={fields.loyalty_percentage}
                          {...$field("loyalty_percentage", (e) =>
                            onChange("loyalty_percentage", e.target.value)
                          )}
                        />
                        <label htmlFor="loyalty_percentage">
                          Loyalty Percentage
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className="form-control"
                          name="loyalty_expiryon"
                          value={fields.loyalty_expiryon}
                          {...$field("loyalty_expiryon", (e) =>
                            onChange("loyalty_expiryon", e.target.value)
                          )}
                        />
                        <label htmlFor="loyalty_expiryon">
                          Loyalty Expiry On
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="accordion-item" style={{display:'none'}}>
              <h2 className="accordion-header">
                <button
                  type="button"
                  className="accordion-button collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#accordionsocialmedia-1"
                  aria-expanded="false"
                >
                  Social Media Links
                </button>
              </h2>

              <div
                id="accordionsocialmedia-1"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionStyle1"
              >
                <div className="accordion-body">
                  {fields.social_media.length > 0 &&
                    fields.social_media.map((item, index) => {
                      return (
                        <div className="row g-3" key={index}>
                          <div className="col-md-3">
                            <div className="form-floating form-floating-outline custm-select-box mb-4">
                              <Select
                                value={item.social_media_type}
                                onChange={this.handleSelectSocial.bind(
                                  this,
                                  index,
                                  "social_media_type"
                                )}
                                placeholder="Select Social Media Type"
                                options={socilaMediaList}
                              />
                              <label className="select-box-label">
                                Social Media Type
                              </label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-floating form-floating-outline mb-4">
                              <input
                                type="text"
                                className="form-control"
                                name="social_media_link"
                                value={item.social_media_link}
                                onChange={this.handleSelectSocial.bind(
                                  this,
                                  index,
                                  "social_media_link"
                                )}
                              />
                              <label htmlFor="social_media_link">Link</label>
                            </div>
                          </div>
                          <div className="col-md-1 mt-4">
                            {fields.social_media.length - 1 === index &&
                            fields.social_media.length !=
                              socilaMediaList.length ? (
                              <div className="d-flex justify-content-center ml-4">
                                {fields.social_media.length > 1 && (
                                  <button
                                    type="button"
                                    className="btn btn-primary me-sm-3 me-1 waves-effect waves-light"
                                    onClick={this.removeSocialMedia.bind(this)}
                                  >
                                    <span className="mdi mdi-minus"></span>
                                  </button>
                                )}
                                <button
                                  type="button"
                                  className="btn btn-primary me-sm-3 me-1 waves-effect waves-light"
                                  onClick={this.addSocialMedia.bind(this)}
                                >
                                  <span className="mdi mdi-plus"></span>
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-primary me-sm-3 me-1 waves-effect waves-light"
                                onClick={this.removeSocialMedia.bind(
                                  this,
                                  index
                                )}
                              >
                                <span className="mdi mdi-minus"></span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  type="button"
                  className="accordion-button collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#accordionmail-1"
                  aria-expanded="false"
                >
                  Mail Configration Settings
                </button>
              </h2>

              <div
                id="accordionmail-1"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionStyle1"
              >
                <div className="accordion-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className={
                            errMsgFromName !== "" &&
                            errMsgFromName !== false &&
                            errMsgFromName !== undefined
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          name="email_from_name"
                          value={fields.email_from_name}
                          {...$field("email_from_name", (e) =>
                            onChange("email_from_name", e.target.value)
                          )}
                        />
                        <label htmlFor="email_from_name">
                          From Name<span className="error">*</span>
                        </label>
                        {errMsgFromName}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className={
                            errMsgAdminEmail !== "" &&
                            errMsgAdminEmail !== false &&
                            errMsgAdminEmail !== undefined
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          name="admin_email"
                          value={fields.admin_email}
                          {...$field("admin_email", (e) =>
                            onChange("admin_email", e.target.value)
                          )}
                        />
                        <label htmlFor="admin_email">
                          Admin Email<span className="error">*</span>
                        </label>
                        {errMsgAdminEmail}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className={
                            errMsgOrderNotify !== "" &&
                            errMsgOrderNotify !== false &&
                            errMsgOrderNotify !== undefined
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          name="order_notification_email"
                          value={fields.order_notification_email}
                          {...$field("order_notification_email", (e) =>
                            onChange("order_notification_email", e.target.value)
                          )}
                        />
                        <label htmlFor="order_notification_email">
                          Order Notification Email
                          <span className="error">*</span>
                        </label>
                        {errMsgOrderNotify}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className={
                            errMsgOwner !== "" &&
                            errMsgOwner !== false &&
                            errMsgOwner !== undefined
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          name="email_footer_content"
                          value={fields.email_footer_content}
                          {...$field("email_footer_content", (e) =>
                            onChange("email_footer_content", e.target.value)
                          )}
                        />
                        <label htmlFor="email_footer_content">
                          Email Footer Content
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline custm-select-box mb-4">
                        <Select
                          value={fields.email_setting_type}
                          onChange={this.handleSelectChange.bind(
                            this,
                            "email_setting_type"
                          )}
                          placeholder="Select Email Type Setting"
                          options={[
                            { label: "SMTP", value: "SMTP" },
                            { label: "SendGrid", value: "SendGrid" },
                          ]}
                        />
                        <label className="select-box-label">
                          Email Type Setting<span className="error">*</span>
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className={
                            errMsgFromEmail !== "" &&
                            errMsgFromEmail !== false &&
                            errMsgFromEmail !== undefined
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          name="from_email"
                          value={fields.from_email}
                          {...$field("from_email", (e) =>
                            onChange("from_email", e.target.value)
                          )}
                        />
                        <label htmlFor="from_email">
                          From Email<span className="error">*</span>
                        </label>
                        {errMsgFromEmail}
                      </div>
                    </div>
                    {Object.keys(fields.email_setting_type).length > 0 &&
                      fields.email_setting_type.value === "SMTP" && (
                        <>
                          <div className="col-md-6">
                            <div className="form-floating form-floating-outline mb-4">
                              <input
                                type="text"
                                className={
                                  errMsgHost !== "" &&
                                  errMsgHost !== false &&
                                  errMsgHost !== undefined
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                name="smtp_host"
                                value={fields.smtp_host}
                                {...$field("smtp_host", (e) =>
                                  onChange("smtp_host", e.target.value)
                                )}
                              />
                              <label htmlFor="smtp_host">
                                SMTP Host<span className="error">*</span>
                              </label>
                              {errMsgHost}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-floating form-floating-outline mb-4">
                              <input
                                type="text"
                                className={
                                  errMsgSmtpUserName !== "" &&
                                  errMsgSmtpUserName !== false &&
                                  errMsgSmtpUserName !== undefined
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                name="smtp_username"
                                value={fields.smtp_username}
                                {...$field("smtp_username", (e) =>
                                  onChange("smtp_username", e.target.value)
                                )}
                              />
                              <label htmlFor="smtp_username">
                                SMTP Username<span className="error">*</span>
                              </label>
                              {errMsgSmtpUserName}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-floating form-floating-outline mb-4">
                              <input
                                type="text"
                                className={
                                  errMsgPwd !== "" &&
                                  errMsgPwd !== false &&
                                  errMsgPwd !== undefined
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                name="smtp_password"
                                value={fields.smtp_password}
                                {...$field("smtp_password", (e) =>
                                  onChange("smtp_password", e.target.value)
                                )}
                              />
                              <label htmlFor="smtp_password">
                                SMTP Password<span className="error">*</span>
                              </label>
                              {errMsgPwd}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-floating form-floating-outline mb-4">
                              <input
                                type="text"
                                className={
                                  errMsgSmtpPort !== "" &&
                                  errMsgSmtpPort !== false &&
                                  errMsgSmtpPort !== undefined
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                name="smtp_port"
                                value={fields.smtp_port}
                                {...$field("smtp_port", (e) =>
                                  onChange("smtp_port", e.target.value)
                                )}
                              />
                              <label htmlFor="smtp_port">
                                SMTP Port<span className="error">*</span>
                              </label>
                              {errMsgSmtpPort}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-floating form-floating-outline mb-4">
                              <input
                                type="text"
                                className={
                                  errMsgMailPath !== "" &&
                                  errMsgMailPath !== false &&
                                  errMsgMailPath !== undefined
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                name="smtp_mail_path"
                                value={fields.smtp_mail_path}
                                {...$field("smtp_mail_path", (e) =>
                                  onChange("smtp_mail_path", e.target.value)
                                )}
                              />
                              <label htmlFor="smtp_mail_path">
                                Mail Path<span className="error">*</span>
                              </label>
                              {errMsgMailPath}
                            </div>
                          </div>
                        </>
                      )}
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
                  data-bs-target="#accordionmaintenance-1"
                  aria-expanded="false"
                >
                  Maintenance Mode
                </button>
              </h2>

              <div
                id="accordionmaintenance-1"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionStyle1"
              >
                <div className="accordion-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-check mt-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value="Yes"
                          id="enable_maintenance_mode"
                          checked={
                            fields.enable_maintenance_mode === "Yes"
                              ? true
                              : false
                          }
                          onChange={this.handleChangeCheck.bind(
                            this,
                            "enable_maintenance_mode"
                          )}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="enable_maintenance_mode"
                        >
                          Maintenance Mode
                        </label>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <label>Maintenance Mode Description</label>
                      {console.log(
                        fields.maintenance_mode_description,
                        "fields.maintenance_mode_description"
                      )}
                      <Editor
                        setContent={this.setContent}
                        data={fields.maintenance_mode_description}
                      />
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
                  data-bs-target="#accordionstripe"
                  aria-expanded="false"
                >
                  Stripe Settings
                </button>
              </h2>

              <div
                id="accordionstripe"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionStyle1"
              >
                <div className="accordion-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline custm-select-box mb-4 ">
                        <Select
                          value={fields.company_stripe_mode}
                          onChange={this.handleSelectChange.bind(
                            this,
                            "company_stripe_mode"
                          )}
                          placeholder="Select Stripe Mode"
                          options={[
                            { label: "Live", value: "1" },
                            { label: "Test", value: "2" },
                          ]}
                        />
                        <label className="select-box-label">Mode</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className={
                            errMsgStripe !== "" &&
                            errMsgStripe !== false &&
                            errMsgStripe !== undefined
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          name="company_stripe_public_live"
                          value={fields.company_stripe_public_live}
                          {...$field("company_stripe_public_live", (e) =>
                            onChange("company_stripe_public_live", e.target.value)
                          )}
                          id="company_stripe_public_live"
                        />
                        <label htmlFor="company_stripe_public_live">
                          Live Public Key{" "}
                          {fields.company_stripe_public_live !== "" && (
                            <span className="error">*</span>
                          )}
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className={
                            errMsgStripe !== "" &&
                            errMsgStripe !== false &&
                            errMsgStripe !== undefined
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          name="company_stripe_secret_live"
                          value={fields.company_stripe_secret_live}
                          {...$field("company_stripe_secret_live", (e) =>
                            onChange("company_stripe_secret_live", e.target.value)
                          )}
                          id="company_stripe_secret_live"
                        />
                        <label htmlFor="company_stripe_secret_live">
                          Live Secret Key{" "}
                          {fields.company_stripe_secret_live !== "" && (
                            <span className="error">*</span>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className={
                            errMsgStripe !== "" &&
                            errMsgStripe !== false &&
                            errMsgStripe !== undefined
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          name="company_stripe_public_test"
                          value={fields.company_stripe_public_test}
                          {...$field("company_stripe_public_test", (e) =>
                            onChange("company_stripe_public_test", e.target.value)
                          )}
                          id="company_stripe_public_test"
                        />
                        <label htmlFor="company_stripe_public_test">
                          Test Public Key{" "}
                          {fields.company_stripe_public_test !== "" && (
                            <span className="error">*</span>
                          )}
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className={
                            errMsgStripe !== "" &&
                            errMsgStripe !== false &&
                            errMsgStripe !== undefined
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          name="company_stripe_secret_test"
                          value={fields.company_stripe_secret_test}
                          {...$field("company_stripe_secret_test", (e) =>
                            onChange("company_stripe_secret_test", e.target.value)
                          )}
                          id="company_stripe_secret_test"
                        />
                        <label htmlFor="company_stripe_secret_test">
                          Test Secret Key{" "}
                          {fields.company_stripe_secret_test !== "" && (
                            <span className="error">*</span>
                          )}
                        </label>
                        {errMsgStripe}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div
            className="pt-1 pb-4 pr-2 text-end"
            style={{ paddingRight: "20px" }}
          >
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
            <Link to={modulePath}>
              <button
                type="reset"
                className="btn btn-label-secondary waves-effect"
              >
                Cancel
              </button>
            </Link>
          </div>
        </div>
      </form>
    );
  }
}
PostForm = validated(validationConfig)(PostForm);
