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
var module = "clientpanel/wallettopupplan/";
var moduleName = "Plans";
var modulePath = "/clientpanel/wallettopupplan";
class Form extends Component {
  constructor(props) {
    super(props);
    var editID = "";
    if (this.props.match.path === "/clientpanel/wallettopupplan/edit/:EditID") {
      editID = this.props.match.params.EditID;
    }
    this.state = {
      editID: editID,
      pageloading: false,
      postdata: {
        outlets: { label: "All Outlet", value: "" },
        plan_display_name: "",
        start_date: "",
        end_date: "",
        plan_bonus_amount: "",
        plan_credits_amount: "",
        plan_desc: "",
        plan_long_desc: "",
        thumbnail: "",
        banner: "",
        status: [],
        action: "add",
      },
      loading: true,
      formpost: [],
      companyDetail: [],
      outletList: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.loadOutlet();
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

          var topupplan_status =
            result.topupplan_status == "A" ? "Active" : "In Active";
          var status =
            result.topupplan_status !== "" && result.topupplan_status !== null
              ? {
                  label: topupplan_status,
                  value: result.topupplan_status,
                }
              : "";

          var topupplan_outlet =
            result.topupplan_outlet !== "" && result.topupplan_outlet !== null
              ? result.topupplan_outlet
              : { label: "All Outlet", value: "" };

          var clientupdatedata = {
            outlets: topupplan_outlet,
            plan_display_name: result.topupplan_display_name,
            start_date:
              result.topupplan_start_date !== "" &&
              result.topupplan_start_date !== null
                ? new Date(result.topupplan_start_date)
                : "",
            end_date:
              result.topupplan_end_date !== "" &&
              result.topupplan_end_date !== null
                ? new Date(result.topupplan_end_date)
                : "",
            plan_bonus_amount: result.topupplan_bonus_amount,
            plan_credits_amount: result.topupplan_credits_amount,
            plan_desc: result.topupplan_desc,
            plan_long_desc: result.topupplan_long_desc,
            thumbnail:
              result.topupplan_thumbnail_image !== "" &&
              result.topupplan_thumbnail_image !== null
                ? result.topupplan_thumbnail_image
                : "",
            banner:
              result.topupplan_banner_image !== "" &&
              result.topupplan_banner_image !== null
                ? result.topupplan_banner_image
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
    
    var postObject = {
      outlets:
        Object.keys(postData.outlets).length > 0 ? postData.outlets.value : "",
      plan_display_name: postData.plan_display_name,
      start_date: postData.start_date,
      end_date: postData.end_date,
      plan_bonus_amount: postData.plan_bonus_amount,
      plan_credits_amount: postData.plan_credits_amount,
      plan_desc: postData.plan_desc,
      plan_long_desc: postData.plan_long_desc,
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
          <Header {...this.props} currentPage={"wallettopupplans"} />
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
  const { plan_display_name, start_date, end_date, status } = props.fields;

  return {
    fields: ["plan_display_name", "start_date", "end_date", "status"],

    validations: {
      plan_display_name: [[isEmpty, plan_display_name]],
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
    this.props.onChange("plan_desc", value);
  }
  setLongContent(value) {
    this.props.onChange("plan_long_desc", value);
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
      Key: `media/${foldername}/wallettopupplan/${file.name}`,
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
      Key: `media/${foldername}/wallettopupplan/${
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
    if ($validation.plan_display_name.error.reason !== undefined) {
      errMsgPromoCode = $validation.plan_display_name.show && (
        <span className="error">{$validation.plan_display_name.error.reason}</span>
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
                name="plan_display_name"
                value={fields.plan_display_name}
                {...$field("plan_display_name", (e) =>
                  onChange("plan_display_name", e.target.value)
                )}
              />
              <label htmlFor="plan_display_name">
              Top Up Plan Title<span className="error">*</span>
              </label>
              {errMsgPromoCode}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className="form-control"
                name="plan_credits_amount"
                value={fields.plan_credits_amount}
                {...$field("plan_credits_amount", (e) =>
                  onChange("plan_credits_amount", e.target.value)
                )}
              />
              <label htmlFor="plan_credits_amount">
                Credits ($) <span className="error">*</span>
              </label>
            </div>
          </div>
          <div className="col-md-6">
           <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className="form-control"
                name="plan_bonus_amount"
                value={fields.plan_bonus_amount}
                {...$field("plan_bonus_amount", (e) =>
                  onChange("plan_bonus_amount", e.target.value)
                )}
              />
              <label htmlFor="plan_bonus_amount">Bonus ($)</label>
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
          <div className="col-md-12">
            <label>Short Description</label>
            <Editor setContent={this.setContent} data={fields.plan_desc} />
          </div>
          <div className="col-md-12">
            <label>Long Description</label>
            <Editor
              setContent={this.setLongContent}
              data={fields.plan_long_desc}
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
