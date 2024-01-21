/* eslint-disable */
import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Select from "react-select";
import update from "immutability-helper";
import { validated } from "react-custom-validation";
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
  isMultiSelect,
  isSingleSelect,
  isNumber,
} from "../../Helpers/SettingHelper";
import PageLoader from "../../Helpers/PageLoader";
import Header from "../Layout/Header";
import Topmenu from "../Layout/Topmenu";
import Footer from "../Layout/Footer";
import Editor from "../Layout/Editor";
var module = "clientpanel/brands/";
var moduleName = "Brand";
var modulePath = "/clientpanel/brand";
import AWS from "aws-sdk";
AWS.config.update(awsCredentials);
const s3 = new AWS.S3();
class Form extends Component {
  constructor(props) {
    super(props);
    var editID = "";
    if (this.props.match.path === "/clientpanel/brand/edit/:EditID") {
      editID = this.props.match.params.EditID;
    }
    this.state = {
      editID: editID,
      pageloading: false,
      postdata: {
        brand_name: "",
        brand_website: "",
        brand_fb: "",
        brand_twitter: "",
        brand_instagram: "",
        brand_open_time: "",
        brand_description: "",
        brand_sequence: "",
        siteLocation: [],
        brand_image: "",
        brand_active_image: "",
        status: [],
        action: "add",
      },
      loading: true,
      formpost: [],
      companyDetail: [],
      siteLocation: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.loadSiteLocation();
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
          var history = this.props.history;
          setTimeout(function () {
            history.push(modulePath);
          }, 1000);
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

          var b_status = result.status == "A" ? "Active" : "In Active";
          var status =
            result.status !== "" && result.status !== null
              ? {
                  label: b_status,
                  value: result.status,
                }
              : [];
          var clientupdatedata = {
            brand_name: result.brand_name,
            brand_website: result.brand_website,
            brand_fb: result.brand_fb,
            brand_twitter: result.brand_twitter,
            brand_instagram: result.brand_instagram,
            brand_open_time: result.brand_open_time,
            brand_description: result.brand_description,
            brand_sequence: result.brand_sequence,
            siteLocation: result.site_location_list,
            brand_image: result.brand_image,
            brand_active_image: result.brand_active_image,
            status: status,
            action: "edit",
          };
          this.setState({ postdata: clientupdatedata, pageloading: false });
        } else {
          this.props.history.push(modulePath);
          showAlert("Error", "Invalid" + moduleName, "error");
        }
      });
    }
  }
  loadSiteLocation() {
    var urlShringTxt =
      apiUrl +
      "clientpanel/sitelocation/dropdownlist?company_id=" +
      CompanyID();
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ siteLocation: res.data.result });
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
    var siteLocation = [];
    if (postData.siteLocation.length > 0) {
      postData.siteLocation.map((item) => {
        siteLocation.push(item.value);
      });
    }

    var postObject = {
      shop_type: 1,
      brand_name: postData.brand_name,
      brand_site_location_id:
        siteLocation.length > 0 ? siteLocation.join(",") : "",
      brand_website: postData.brand_website,
      brand_fb: postData.brand_fb,
      brand_twitter: postData.brand_twitter,
      brand_instagram: postData.brand_instagram,
      brand_open_time: postData.brand_open_time,
      brand_description: postData.brand_description,
      brand_sequence: postData.brand_sequence,
      brand_image: postData.brand_image,
      brand_active_image: postData.brand_active_image,
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
          <Header {...this.props} currentPage={"brand"} />
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
                  siteLocation={this.state.siteLocation}
                  onChange={this.fieldChange}
                  onValid={this.handleSubmit}
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
  const {
    brand_name,
    sl_pickup_address_line1,
    siteLocation,
    brand_sequence,
    status,
  } = props.fields;

  return {
    fields: [
      "brand_name",
      "sl_pickup_address_line1",
      "siteLocation",
      "brand_sequence",
      "status",
    ],

    validations: {
      brand_name: [[isEmpty, brand_name]],
      sl_pickup_address_line1: [[isEmpty, sl_pickup_address_line1]],
      siteLocation: [[isMultiSelect, siteLocation]],
      brand_sequence: [[isNumber, brand_sequence]],
      status: [[isSingleSelect, status]],
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
  setContent(value) {
    this.props.onChange("brand_description", value);
  }
  async uplaodFiles() {
    var imagefile = document.querySelector("#brand_image");
    const file = imagefile.files[0];
    const params = {
      Bucket: bucketName,
      Key: `media/${foldername}/brand/${file.name}`,
      Body: file,
      ACL: "public-read",
    };
    const { Location } = await s3.upload(params).promise();
    this.props.onChange("brand_image", Location);
    $("#brand_image").val("");
  }
  async uplaodBrandActiveImage() {
    var imagefile = document.querySelector("#brand_active_image");
    const file = imagefile.files[0];

    const params = {
      Bucket: bucketName,
      Key: `media/${foldername}/brand/${file.name}`,
      Body: file,
      ACL: "public-read",
    };
    const { Location } = await s3.upload(params).promise();
    this.props.onChange("brand_active_image", Location);
    $("#brand_active_image").val("");
  }
  async removeImage(fileNamme, ImageType) {
    var fileNammeSplit = fileNamme.split("/");
    console.log(fileNammeSplit, "fileNammeSplit");
    var params = {
      Bucket: bucketName,
      Key: `media/${foldername}/brand/${
        fileNammeSplit[fileNammeSplit.length - 1]
      }`,
    };
    await s3.deleteObject(params).promise();
    this.props.onChange(ImageType, "");
  }

  render() {
    const { fields, onChange, onValid, onInvalid, $field, $validation } =
      this.props;
    let errMsgBrandName,
      errMssAddress,
      errMsgSiteLocation,
      errMsgSequence,
      errMsgStatus = "";
    if ($validation.brand_name.error.reason !== undefined) {
      errMsgBrandName = $validation.brand_name.show && (
        <span className="error">{$validation.brand_name.error.reason}</span>
      );
    }

    if ($validation.sl_pickup_address_line1.error.reason !== undefined) {
      errMssAddress = $validation.sl_pickup_address_line1.show && (
        <span className="error">
          {$validation.sl_pickup_address_line1.error.reason}
        </span>
      );
    }
    if ($validation.siteLocation.error.reason !== undefined) {
      errMsgSiteLocation = $validation.siteLocation.show && (
        <span className="error">{$validation.siteLocation.error.reason}</span>
      );
    }
    if ($validation.brand_sequence.error.reason !== undefined) {
      errMsgSequence = $validation.brand_sequence.show && (
        <span className="error">{$validation.brand_sequence.error.reason}</span>
      );
    }

    if ($validation.status.error.reason !== undefined) {
      errMsgStatus = $validation.status.show && (
        <span className="error">{$validation.status.error.reason}</span>
      );
    }

    return (
      <form className="card fv-plugins-bootstrap5" id="modulefrm">
        <div className="card-body row g-3 pt-5">
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className={
                  errMsgBrandName !== "" &&
                  errMsgBrandName !== false &&
                  errMsgBrandName !== undefined
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="brand_name"
                value={fields.brand_name}
                {...$field("brand_name", (e) =>
                  onChange("brand_name", e.target.value)
                )}
              />
              <label htmlFor="brand_name">
                Name <span className="error">*</span>
              </label>
              {errMsgBrandName}
            </div>
          </div>
          <div
            className={
              errMsgSiteLocation !== "" &&
              errMsgSiteLocation !== false &&
              errMsgSiteLocation !== undefined
                ? "col-md-6 error-select error"
                : "col-md-6"
            }
          >
            <div className="form-floating form-floating-outline custm-select-box  mb-4">
              <Select
                value={fields.siteLocation}
                isMulti
                onChange={this.handleSelectChange.bind(this, "siteLocation")}
                placeholder="Select Site Location"
                options={this.props.siteLocation}
              />
              <label className="select-box-label">
                Site Location<span className="error">*</span>
              </label>
              {errMsgSiteLocation}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline">
              <input
                type="text"
                className="form-control"
                name="brand_website"
                id="brand_website"
                value={fields.brand_website}
                {...$field("brand_website", (e) =>
                  onChange("brand_website", e.target.value)
                )}
                aria-describedby="basic-addon13"
              />
              <label htmlFor="basic-addon13">Website</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className="form-control"
                name="brand_fb"
                id="brand_fb"
                value={fields.brand_fb}
                {...$field("brand_fb", (e) =>
                  onChange("brand_fb", e.target.value)
                )}
              />
              <label htmlFor="brand_fb">FB</label>
              {errMssAddress}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className="form-control"
                name="brand_twitter"
                id="brand_twitter"
                value={fields.brand_twitter}
                {...$field("brand_twitter", (e) =>
                  onChange("brand_twitter", e.target.value)
                )}
              />
              <label htmlFor="brand_twitter">Twitter</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className="form-control"
                name="brand_instagram"
                id="brand_instagram"
                value={fields.brand_instagram}
                {...$field("brand_instagram", (e) =>
                  onChange("brand_instagram", e.target.value)
                )}
              />
              <label htmlFor="brand_instagram">Instagram</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className="form-control"
                name="brand_open_time"
                id="brand_open_time"
                value={fields.brand_open_time}
                {...$field("brand_open_time", (e) =>
                  onChange("brand_open_time", e.target.value)
                )}
              />
              <label htmlFor="brand_open_time">Opening Hours</label>
            </div>
          </div>
          <div
            className={
              errMsgSequence !== "" &&
              errMsgSequence !== false &&
              errMsgSequence !== undefined
                ? "col-md-6 error"
                : "col-md-6"
            }
          >
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className="form-control"
                name="brand_sequence"
                id="brand_sequence"
                value={fields.brand_sequence}
                {...$field("brand_sequence", (e) =>
                  onChange("brand_sequence", e.target.value)
                )}
              />
              <label htmlFor="brand_sequence">Sequence</label>
              {errMsgSequence}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <div className="mb-3">
                <label htmlFor="formFile" className="form-label">
                  Brand Image
                </label>
                <input
                  className="form-control"
                  type="file"
                  id="brand_image"
                  onChange={(event) => {
                    this.uplaodFiles(event);
                    return false;
                  }}
                />
              </div>
            </div>
            {fields.brand_image !== "" && (
              <div className="dz-preview dz-processing dz-image-preview dz-success dz-complete">
                <div className="dz-details">
                  <div className="dz-thumbnail">
                    <img alt="" src={fields.brand_image} />
                  </div>
                </div>
                <a
                  className="dz-remove"
                  href={void 0}
                  onClick={this.removeImage.bind(
                    this,
                    fields.brand_image,
                    "brand_image"
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
                  Brand Active Image
                </label>
                <input
                  className="form-control"
                  type="file"
                  id="brand_active_image"
                  onChange={(event) => {
                    this.uplaodBrandActiveImage(event);
                    return false;
                  }}
                />
              </div>
            </div>
            {fields.brand_active_image !== "" && (
              <div className="dz-preview dz-processing dz-image-preview dz-success dz-complete">
                <div className="dz-details">
                  <div className="dz-thumbnail">
                    <img alt="" src={fields.brand_active_image} />
                  </div>
                </div>
                <a
                  className="dz-remove"
                  href={void 0}
                  onClick={this.removeImage.bind(
                    this,
                    fields.brand_active_image,
                    "brand_active_image"
                  )}
                >
                  Remove file
                </a>
              </div>
            )}
          </div>
          <div className="col-md-12">
            <label>Brand Description</label>
            <Editor
              setContent={this.setContent}
              data={fields.brand_description}
            />
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
