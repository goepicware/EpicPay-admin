/* eslint-disable */
import React, { Component } from "react";
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
  isEmpty,
  isSingleSelect,
} from "../../Helpers/SettingHelper";
import PageLoader from "../../Helpers/PageLoader";
import Header from "../Layout/Header";
import Topmenu from "../Layout/Topmenu";
import Footer from "../Layout/Footer";
import Editor from "../Layout/Editor";
import AWS from "aws-sdk";
AWS.config.update(awsCredentials);
const s3 = new AWS.S3();
var module = "clientpanel/promotion/";
var moduleName = "Promotions";
var modulePath = "/clientpanel/promotions";
class Form extends Component {
  constructor(props) {
    super(props);
    var editID = "";
    if (this.props.match.path === "/clientpanel/promotions/edit/:EditID") {
      editID = this.props.match.params.EditID;
    }
    this.state = {
      editID: editID,
      pageloading: false,
      postdata: {
        outlets: { label: "All Outlet", value: "" },
        promotion_name: "",
        start_date: "",
        end_date: "",
        promotion_qty: "",
        promotion_amount: "",
        promotion_coupon_type: "",
        promotion_type: "",
        promotion_percentage: "",
        promotion_max_amt: "",
        promotion_no_use: "",
        assign_availability: [],
        promotion_cata_flag: "No",
        promotion_delivery_charge_discount: "No",
        promotion_desc: "",
        promotion_long_desc: "",
        promotion_category: [],
        promo_customer: [],
        thumbnail: "",
        banner: "",
        status: [],
        action: "add",
      },
      loading: true,
      formpost: [],
      companyDetail: [],
      outletList: [],
      availabiltyList: [],
      categoryList: [],
      customerList: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.loadOutlet();
    this.loadAvailabilty();
    this.loadcategory();
    this.loadCustomer();
    if (this.state.editID !== "") {
      var params = {
        params: "company_id=" + CompanyID() + "&detail_id=" + this.state.editID,
        url: apiUrl + module + "details",
        type: "client",
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
          showAlert("Success", errMsg, "success", "No");
          this.props.history.push(modulePath);
        } else {
          showAlert("Error", errMsg, "error", "No");
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

          var promotion_status =
            result.promotion_status == "A" ? "Active" : "In Active";
          var status =
            result.promotion_status !== "" && result.promotion_status !== null
              ? {
                  label: promotion_status,
                  value: result.promotion_status,
                }
              : "";

          var promotionCouponType = "";
          if (result.promotion_coupon_type === "1") {
            promotionCouponType = "Multiple Use";
          } else if (result.promotion_coupon_type === "2") {
            promotionCouponType = "One Time Use";
          }
          var promotion_Coupon_Type = "";
          if (promotionCouponType !== "") {
            promotion_Coupon_Type = {
              label: promotionCouponType,
              value: result.promotion_coupon_type,
            };
          }
          var promo_outlet =
            result.promo_outlet !== "" && result.promo_outlet !== null
              ? result.promo_outlet
              : { label: "All Outlet", value: "" };

          var clientupdatedata = {
            outlets: promo_outlet,
            promotion_name: result.promotion_name,
            promotion_title: result.promotion_title,
            start_date:
              result.promotion_start_date !== "" &&
              result.promotion_start_date !== null
                ? new Date(result.promotion_start_date)
                : "",
            end_date:
              result.promotion_end_date !== "" &&
              result.promotion_end_date !== null
                ? new Date(result.promotion_end_date)
                : "",
            promotion_qty: result.promotion_qty,
            promotion_amount: result.promotion_amount,

            promotion_coupon_type: promotion_Coupon_Type,
            promotion_type:
              result.promotion_type !== "" && result.promotion_type !== null
                ? {
                    label: result.promotion_type,
                    value: result.promotion_type.toLowerCase(),
                  }
                : "",
            promotion_percentage: result.promotion_percentage,
            promotion_max_amt: result.promotion_max_amt,
            promotion_no_use: result.promotion_no_use,
            assign_availability:
              result.promo_availability.length > 0
                ? result.promo_availability
                : [],
            promotion_cata_flag: result.promotion_cata_flag,
            promotion_delivery_charge_discount:
              result.promotion_delivery_charge_discount,
            promotion_desc: result.promotion_desc,
            promotion_long_desc: result.promotion_long_desc,
            promotion_category:
              result.promo_category.length > 0 ? result.promo_category : [],
            promo_customer:
              result.promo_customer.length > 0 ? result.promo_customer : [],
            thumbnail:
              result.promotion_thumbnail_image !== "" &&
              result.promotion_thumbnail_image !== null
                ? result.promotion_thumbnail_image
                : "",
            banner:
              result.promotion_banner_image !== "" &&
              result.promotion_banner_image !== null
                ? result.promotion_banner_image
                : "",
            status: status,
            action: "edit",
          };
          this.setState({ postdata: clientupdatedata, pageloading: false });
        } else {
          this.setState({ pageloading: false });
          this.props.history.push(modulePath);
          showAlert("Error", "Invalid Company", "error");
        }
      });
    }
  }
  loadOutlet() {
    var urlShringTxt =
      apiUrl + "clientpanel/outlets/dropdownlist?company_id=" + CompanyID();
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ outletList: res.data.result });
      }
    });
  }
  loadAvailabilty() {
    var urlShringTxt = apiUrl + "company/settings/availabilty_list";

    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "success") {
        this.setState({ availabiltyList: res.data.result });
      }
    });
  }
  loadcategory() {
    var urlShringTxt =
      apiUrl + "clientpanel/category/dropdownlist?company_id=" + CompanyID();
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        var result = res.data.result;
        var catList = [];
        if (result.length > 0) {
          result.map((Item) => {
            catList.push({
              value: Item.pro_cate_primary_id,
              label: Item.pro_cate_name,
            });
          });
        }
        this.setState({ categoryList: catList });
      }
    });
  }
  loadCustomer() {
    var urlShringTxt =
      apiUrl + "clientpanel/customer/dropdownlist?company_id=" + CompanyID();
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ customerList: res.data.result });
      }
    });
  }
  sateValChange = (field, value) => {};

  handleChange(checked, name) {
    this.setState({ checked });
  }

  /* signin - start*/
  fieldChange = (field, value) => {
    this.setState(
      update(this.state, { postdata: { [field]: { $set: value } } })
    );
  };

  handleSubmit = () => {
    showLoader("submit_frm", "class");
    var postData = this.state.postdata;
    var assign_availability = [];
    if (postData.assign_availability.length > 0) {
      postData.assign_availability.map((item) => {
        assign_availability.push(item.value);
      });
    }

    var customer = [];
    if (postData.promo_customer.length > 0) {
      postData.promo_customer.map((item) => {
        customer.push(item.value);
      });
    }

    var promotion_category = [];
    if (postData.promotion_category.length > 0) {
      postData.promotion_category.map((item) => {
        promotion_category.push(item.value);
      });
    }

    var postObject = {
      outlets:
        Object.keys(postData.outlets).length > 0 ? postData.outlets.value : "",
      promotion_name: postData.promotion_name,
      start_date: postData.start_date,
      end_date: postData.end_date,
      promotion_qty: postData.promotion_qty,
      promotion_amount: postData.promotion_amount,
      promotion_category:
        promotion_category.length > 0 ? promotion_category.join(",") : "",
      promotion_coupon_type:
        Object.keys(postData.promotion_coupon_type).length > 0
          ? postData.promotion_coupon_type.value
          : "",
      promotion_type:
        Object.keys(postData.promotion_type).length > 0
          ? postData.promotion_type.value
          : "",
      promotion_percentage: postData.promotion_percentage,
      promotion_max_amt: postData.promotion_max_amt,
      promotion_no_use: postData.promotion_no_use,
      assign_availability:
        assign_availability.length > 0 ? assign_availability.join(",") : "",
      promo_customer: customer.length > 0 ? customer.join(",") : "",
      promotion_cata_flag:
        postData.promotion_cata_flag !== ""
          ? postData.promotion_cata_flag
          : "No",
      promotion_delivery_charge_discount:
        postData.promotion_delivery_charge_discount !== ""
          ? postData.promotion_delivery_charge_discount
          : "No",
      promotion_desc: postData.promotion_desc,
      promotion_long_desc: postData.promotion_long_desc,
      thumbnail: postData.thumbnail,
      banner: postData.banner,
      status:
        Object.keys(postData.status).length > 0 ? postData.status.value : "A",
      loginID: userID(),
      company_admin_id: clientID(),
      company_id: CompanyID(),
      action: postData.action,
    };

    var post_url = module + "add";
    if (postData.action === "edit" && this.state.editID !== "") {
      postObject["edit_id"] = this.state.editID;
      post_url = module + "update";
    }
    this.props.getFormPost(postObject, post_url, "client");
  };

  render() {
    return (
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <Header {...this.props} currentPage={"promotions"} />
          <div className="layout-page">
            <Topmenu />
            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row mb-3">
                  <div className="col-lg-10 col-md-6">
                    <h4 className="fw-bold">
                      {this.state.editID !== "" ? "Update" : "Add New"}{" "}
                      {moduleName}
                    </h4>
                  </div>
                  <div className="col-lg-2 col-md-6 text-end">
                    <Link to={modulePath}>
                      <button
                        type="button"
                        className="btn btn-outline-primary waves-effect"
                      >
                        Back
                      </button>
                    </Link>
                  </div>
                </div>

                <PostForm
                  {...this.props}
                  fields={this.state.postdata}
                  onChange={this.fieldChange}
                  onValid={this.handleSubmit}
                  outletList={this.state.outletList}
                  availabiltyList={this.state.availabiltyList}
                  categoryList={this.state.categoryList}
                  customerList={this.state.customerList}
                  error_msg={this.state.error_msg}
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

function validationConfig(props) {
  const { promotion_name, start_date, end_date, status } = props.fields;

  return {
    fields: ["promotion_name", "start_date", "end_date", "status"],

    validations: {
      promotion_name: [[isEmpty, promotion_name]],
      start_date: [[isEmpty, start_date]],
      end_date: [[isEmpty, end_date]],
      status: [[isSingleSelect, status]],
    },
  };
}

class PostForm extends Component {
  constructor(props) {
    super(props);
    this.setContent = this.setContent.bind(this);
    this.setLongContent = this.setLongContent.bind(this);
  }

  handleChange(name, value) {
    this.props.onChange(name, value);
  }
  handleSelectChange(name, value) {
    this.props.onChange(name, value);
  }
  handleChangeDate(name, value) {
    this.props.onChange(name, value);
  }
  setContent(value) {
    this.props.onChange("promotion_desc", value);
  }
  setLongContent(value) {
    this.props.onChange("promotion_long_desc", value);
  }

  handleChangeCheck(name, event) {
    var value = event.target.checked === true ? "Yes" : "No";
    this.props.onChange(name, value);
  }
  async uplaodFiles(imageType) {
    var imagefile = document.querySelector("#" + imageType);
    const file = imagefile.files[0];
    const params = {
      Bucket: bucketName,
      Key: `media/${foldername}/promotion/${file.name}`,
      Body: file,
      ACL: "public-read",
    };
    const { Location } = await s3.upload(params).promise();
    this.props.onChange(imageType, Location);
    $("#" + imageType).val("");
  }
  async removeImage(fileNamme, imageType) {
    var fileNammeSplit = fileNamme.split("/");
    var params = {
      Bucket: bucketName,
      Key: `media/${foldername}/promotion/${
        fileNammeSplit[fileNammeSplit.length - 1]
      }`,
    };
    await s3.deleteObject(params).promise();
    this.props.onChange(imageType, "");
  }

  render() {
    const { fields, onChange, onValid, onInvalid, $field, $validation } =
      this.props;
    let errMsgPromoCode,
      errMsgStartDate,
      errMsgEndDate,
      errMsgStatus = "";
    if ($validation.promotion_name.error.reason !== undefined) {
      errMsgPromoCode = $validation.promotion_name.show && (
        <span className="error">{$validation.promotion_name.error.reason}</span>
      );
    }
    if ($validation.start_date.error.reason !== undefined) {
      errMsgStartDate = $validation.start_date.show && (
        <span className="error">{$validation.start_date.error.reason}</span>
      );
    }
    if ($validation.end_date.error.reason !== undefined) {
      errMsgEndDate = $validation.end_date.show && (
        <span className="error">{$validation.end_date.error.reason}</span>
      );
    }
    if ($validation.status.error.reason !== undefined) {
      errMsgStatus = $validation.status.show && (
        <span className="error">{$validation.status.error.reason}</span>
      );
    }

    return (
      <form className="card fv-plugins-bootstrap5" id="modulefrm">
        <div className="card-body row g-3">
          <div className="col-md-6">
            <div className="form-floating form-floating-outline custm-select-box">
              <Select
                value={fields.outlets}
                onChange={this.handleSelectChange.bind(this, "outlets")}
                placeholder="Select Outlet"
                options={this.props.outletList}
              />
              <label className="select-box-label">
                Outlet<span className="error">*</span>
              </label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className={
                  errMsgPromoCode !== "" &&
                  errMsgPromoCode !== false &&
                  errMsgPromoCode !== undefined
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="promotion_name"
                value={fields.promotion_name}
                {...$field("promotion_name", (e) =>
                  onChange("promotion_name", e.target.value)
                )}
              />
              <label htmlFor="promotion_name">
                Promo Code <span className="error">*</span>
              </label>
              {errMsgPromoCode}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className="form-control"
                name="promotion_title"
                value={fields.promotion_title}
                {...$field("promotion_title", (e) =>
                  onChange("promotion_title", e.target.value)
                )}
              />
              <label htmlFor="promotion_title">Title</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className="form-control"
                name="promotion_qty"
                value={fields.promotion_qty}
                {...$field("promotion_qty", (e) =>
                  onChange("promotion_qty", e.target.value)
                )}
              />
              <label htmlFor="promotion_qty">Cart Minimum Qty</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <DatePicker
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                showTimeSelect
                dropdownMode="select"
                className="form-control"
                selected={fields.start_date}
                minDate={new Date()}
                dateFormat="d-MM-yyyy h:mm aa"
                placeholderText="Start Date *"
                onChange={this.handleChangeDate.bind(this, "start_date")}
              />
              {errMsgStartDate}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <DatePicker
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                showTimeSelect
                dropdownMode="select"
                className="form-control"
                selected={fields.end_date}
                minDate={
                  fields.start_date !== "" ? fields.start_date : new Date()
                }
                dateFormat="d-MM-yyyy h:mm aa"
                placeholderText="End Date *"
                onChange={this.handleChangeDate.bind(this, "end_date")}
              />
              {errMsgEndDate}
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className="form-control"
                name="promotion_amount"
                value={fields.promotion_amount}
                {...$field("promotion_amount", (e) =>
                  onChange("promotion_amount", e.target.value)
                )}
              />
              <label htmlFor="promotion_amount">
                Cart Minimum Amount <span className="error">*</span>
              </label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline custm-select-box mb-4">
              <Select
                value={fields.promotion_coupon_type}
                onChange={this.handleSelectChange.bind(
                  this,
                  "promotion_coupon_type"
                )}
                placeholder="Select Coupon Type"
                options={[
                  { value: "1", label: "Multiple Use" },
                  { value: "2", label: "One Time Use" },
                ]}
                isClearable={true}
              />
              <label className="select-box-label">
                Coupon Type<span className="error">*</span>
              </label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline custm-select-box">
              <Select
                value={fields.promotion_type}
                onChange={this.handleSelectChange.bind(this, "promotion_type")}
                placeholder="Select Promotion Type"
                options={[
                  { value: "percentage", label: "Percentage" },
                  { value: "fixed", label: "Fixed" },
                ]}
                isClearable={true}
              />
              <label className="select-box-label">
                Promotion Type<span className="error">*</span>
              </label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className="form-control"
                name="promotion_percentage"
                value={fields.promotion_percentage}
                {...$field("promotion_percentage", (e) =>
                  onChange("promotion_percentage", e.target.value)
                )}
              />
              <label htmlFor="promotion_percentage">Percentage</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className="form-control"
                name="promotion_max_amt"
                value={fields.promotion_max_amt}
                {...$field("promotion_max_amt", (e) =>
                  onChange("promotion_max_amt", e.target.value)
                )}
              />
              <label htmlFor="promotion_max_amt">Maximum Amount Applied</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className="form-control"
                name="promotion_no_use"
                value={fields.promotion_no_use}
                {...$field("promotion_no_use", (e) =>
                  onChange("promotion_no_use", e.target.value)
                )}
              />
              <label htmlFor="promotion_no_use">No Of Use</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline custm-select-box mb-4">
              <Select
                value={fields.assign_availability}
                onChange={this.handleSelectChange.bind(
                  this,
                  "assign_availability"
                )}
                isMulti
                placeholder="Select Availabilty"
                options={this.props.availabiltyList.map((item) => {
                  return {
                    value: item.av_id,
                    label: item.av_name,
                  };
                })}
                isClearable={true}
              />
              <label className="select-box-label">Availabilty</label>
            </div>
          </div>
          <div className="col-md-6">
            <div class="form-check form-check-inline mt-3">
              <input
                class="form-check-input"
                type="checkbox"
                checked={fields.promotion_cata_flag === "Yes" ? true : false}
                onChange={this.handleChangeCheck.bind(
                  this,
                  "promotion_cata_flag"
                )}
              />
              <label class="form-check-label" for="inlineCheckbox1">
                Show As Customer View
              </label>
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="checkbox"
                checked={
                  fields.promotion_delivery_charge_discount === "Yes"
                    ? true
                    : false
                }
                onChange={this.handleChangeCheck.bind(
                  this,
                  "promotion_delivery_charge_discount"
                )}
              />
              <label class="form-check-label" for="inlineCheckbox2">
                Free Delivery Charge
              </label>
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-floating form-floating-outline custm-select-box mb-4">
              <Select
                value={fields.promotion_category}
                onChange={this.handleSelectChange.bind(
                  this,
                  "promotion_category"
                )}
                placeholder="Select Category"
                isMulti
                options={this.props.categoryList}
                isClearable={true}
              />
              <label className="select-box-label">Category</label>
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-floating form-floating-outline custm-select-box">
              <Select
                value={fields.promo_customer}
                onChange={this.handleSelectChange.bind(this, "promo_customer")}
                isMulti
                placeholder="Select Customer"
                options={this.props.customerList}
                isClearable={true}
              />
              <label className="select-box-label">Customer</label>
            </div>
          </div>
          <div className="col-md-12">
            <label>Short Description</label>
            <Editor setContent={this.setContent} data={fields.promotion_desc} />
          </div>
          <div className="col-md-12">
            <label>Long Description</label>
            <Editor
              setContent={this.setLongContent}
              data={fields.promotion_long_desc}
            />
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <div className="mb-3">
                <label htmlFor="formFile" className="form-label">
                  Thumbnail
                </label>
                <input
                  className="form-control"
                  type="file"
                  id="thumbnail"
                  onChange={(event) => {
                    this.uplaodFiles("thumbnail", event);
                    return false;
                  }}
                />
              </div>
            </div>
            {fields.thumbnail !== "" && (
              <div className="dz-preview dz-processing dz-image-preview dz-success dz-complete">
                <div className="dz-details">
                  <div className="dz-thumbnail">
                    <img alt="" src={fields.thumbnail} />
                  </div>
                </div>
                <a
                  className="dz-remove"
                  href={void 0}
                  onClick={this.removeImage.bind(
                    this,
                    fields.thumbnail,
                    "thumbnail"
                  )}
                >
                  Remove file
                </a>
              </div>
            )}
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <div className="mb-3">
                <label htmlFor="formFile" className="form-label">
                  Banner
                </label>
                <input
                  className="form-control"
                  type="file"
                  id="banner"
                  onChange={(event) => {
                    this.uplaodFiles("banner", event);
                    return false;
                  }}
                />
              </div>
            </div>
            {fields.banner !== "" && (
              <div className="dz-preview dz-processing dz-image-preview dz-success dz-complete">
                <div className="dz-details">
                  <div className="dz-thumbnail">
                    <img alt="" src={fields.banner} />
                  </div>
                </div>
                <a
                  className="dz-remove"
                  href={void 0}
                  onClick={this.removeImage.bind(this, fields.banner, "banner")}
                >
                  Remove file
                </a>
              </div>
            )}
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
                value={fields.status}
                onChange={this.handleSelectChange.bind(this, "status")}
                placeholder="Select Status"
                options={[
                  { value: "A", label: "Active" },
                  { value: "I", label: "In Active" },
                ]}
                isClearable={true}
              />
              <label className="select-box-label">
                Status<span className="error">*</span>
              </label>
              {errMsgStatus}
            </div>
          </div>

          <div className="pt-1 pb-4 pt-1 text-end">
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
