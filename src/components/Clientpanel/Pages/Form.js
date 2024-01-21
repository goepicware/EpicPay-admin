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
var module = "clientpanel/pages/";
var moduleName = "Page";
var modulePath = "/clientpanel/pages";
class Form extends Component {
  constructor(props) {
    super(props);
    var editID = "";
    if (this.props.match.path === "/clientpanel/pages/edit/:EditID") {
      editID = this.props.match.params.EditID;
    }
    this.state = {
      editID: editID,
      pageloading: false,
      postdata: {
        cmspage_title: "",
        cmspage_slug: "",
        cmspage_description: "",
        cmspage_meta_title: "",
        cmspage_meta_description: "",
        cmspage_meta_keyword: "",
        banner_image: "",
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

          var cmspage_status =
            result.cmspage_status == "A" ? "Active" : "In Active";
          var status =
            result.cmspage_status !== "" && result.cmspage_status !== null
              ? {
                  label: cmspage_status,
                  value: result.cmspage_status,
                }
              : "";
          var clientupdatedata = {
            cmspage_title: result.cmspage_title,
            cmspage_slug: result.cmspage_slug,
            cmspage_description: result.cmspage_description,
            cmspage_meta_title: result.cmspage_meta_title,
            cmspage_meta_description: result.cmspage_meta_description,
            cmspage_meta_keyword: result.cmspage_meta_keyword,
            banner_image:
              result.cmspage_banner_image !== "" &&
              result.cmspage_banner_image !== null
                ? result.cmspage_banner_image
                : "",
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
        console.log(res.data.result, "res.data.result");
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

    var postObject = {
      cmspage_title: postData.cmspage_title,
      cmspage_slug: postData.cmspage_slug,
      cmspage_description: postData.cmspage_description,
      cmspage_meta_title: postData.cmspage_meta_title,
      cmspage_meta_description: postData.cmspage_meta_description,
      cmspage_meta_keyword: postData.cmspage_meta_keyword,
      banner_image: postData.banner_image,
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
          <Header {...this.props} currentPage={"pages"} />
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
  const { cmspage_title, cmspage_slug, status } = props.fields;

  return {
    fields: ["cmspage_title", "cmspage_slug", "status"],

    validations: {
      cmspage_title: [[isEmpty, cmspage_title]],
      cmspage_slug: [[isEmpty, cmspage_slug]],
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
    this.props.onChange("cmspage_description", value);
  }
  async uplaodFiles() {
    var imagefile = document.querySelector("#banner_image");
    const file = imagefile.files[0];
    const params = {
      Bucket: bucketName,
      Key: `media/${foldername}/navigation/${file.name}`,
      Body: file,
      ACL: "public-read",
    };
    const { Location } = await s3.upload(params).promise();
    this.props.onChange("banner_image", Location);
    $("#banner_image").val("");
  }
  async removeImage(fileNamme, ImageType) {
    var fileNammeSplit = fileNamme.split("/");
    var params = {
      Bucket: bucketName,
      Key: `media/${foldername}/navigation/${
        fileNammeSplit[fileNammeSplit.length - 1]
      }`,
    };
    await s3.deleteObject(params).promise();
    this.props.onChange(ImageType, "");
  }

  render() {
    const { fields, onChange, onValid, onInvalid, $field, $validation } =
      this.props;
    let errMsgTitle,
      errMsSlug,
      errMsgStatus = "";
    if ($validation.cmspage_title.error.reason !== undefined) {
      errMsgTitle = $validation.cmspage_title.show && (
        <span className="error">{$validation.cmspage_title.error.reason}</span>
      );
    }
    if ($validation.cmspage_slug.error.reason !== undefined) {
      errMsSlug = $validation.cmspage_slug.show && (
        <span className="error">{$validation.cmspage_slug.error.reason}</span>
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
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className={
                  errMsgTitle !== "" &&
                  errMsgTitle !== false &&
                  errMsgTitle !== undefined
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="cmspage_title"
                value={fields.cmspage_title}
                {...$field("cmspage_title", (e) =>
                  onChange("cmspage_title", e.target.value)
                )}
              />
              <label htmlFor="cmspage_title">
                Title <span className="error">*</span>
              </label>
              {errMsgTitle}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className={
                  errMsSlug !== "" &&
                  errMsSlug !== false &&
                  errMsSlug !== undefined
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="cmspage_slug"
                id="cmspage_slug"
                value={fields.cmspage_slug}
                {...$field("cmspage_slug", (e) =>
                  onChange("cmspage_slug", e.target.value)
                )}
              />
              <label htmlFor="cmspage_slug">Slug</label>
              {errMsSlug}
            </div>
          </div>
          <div className="col-md-12">
            <label>Description</label>
            <Editor
              setContent={this.setContent}
              data={fields.cmspage_description}
            />
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className="form-control"
                name="cmspage_meta_title"
                id="cmspage_meta_title"
                value={fields.cmspage_meta_title}
                {...$field("cmspage_meta_title", (e) =>
                  onChange("cmspage_meta_title", e.target.value)
                )}
              />
              <label htmlFor="cmspage_meta_title">Meta Title</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className="form-control"
                name="cmspage_meta_keyword"
                id="cmspage_meta_keyword"
                value={fields.cmspage_meta_keyword}
                {...$field("cmspage_meta_keyword", (e) =>
                  onChange("cmspage_meta_keyword", e.target.value)
                )}
              />
              <label htmlFor="cmspage_meta_keyword">Meta Keyword</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className="form-control"
                name="cmspage_meta_description"
                id="cmspage_meta_description"
                value={fields.cmspage_meta_description}
                {...$field("cmspage_meta_description", (e) =>
                  onChange("cmspage_meta_description", e.target.value)
                )}
              />
              <label htmlFor="cmspage_meta_description">Meta Description</label>
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
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <div className="mb-3">
                <label for="formFile" className="form-label">
                  Page Banner Image
                </label>
                <input
                  className="form-control"
                  type="file"
                  id="banner_image"
                  onChange={(event) => {
                    this.uplaodFiles(event);
                    return false;
                  }}
                />
              </div>
            </div>
            {fields.banner_image !== "" && (
              <div className="dz-preview dz-processing dz-image-preview dz-success dz-complete">
                <div className="dz-details">
                  <div className="dz-thumbnail">
                    <img alt="" src={fields.banner_image} />
                  </div>
                </div>
                <a
                  className="dz-remove"
                  href={void 0}
                  onClick={this.removeImage.bind(
                    this,
                    fields.nav_icon,
                    "banner_image"
                  )}
                >
                  Remove file
                </a>
              </div>
            )}
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
