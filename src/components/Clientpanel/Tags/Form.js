/* eslint-disable */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
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

import AWS from "aws-sdk";
AWS.config.update(awsCredentials);
const s3 = new AWS.S3();

var module = "clientpanel/tags/";
var moduleName = "Tag";
var modulePath = "/clientpanel/catalog-tag";
class Form extends Component {
  constructor(props) {
    super(props);
    var editID = "";
    if (this.props.match.path === "/clientpanel/catalog-tag/edit/:EditID") {
      editID = this.props.match.params.EditID;
    }
    this.state = {
      editID: editID,
      pageloading: false,
      clientdata: {
        tag_name: "",
        outlet_id: "",
        tag_image: "",
        status: [],
        action: "add",
      },
      loading: true,
      formpost: [],
      companyDetail: [],
      outletList: [],
    };
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
          var pro_tag_status =
            result.pro_tag_status == "A" ? "Active" : "In Active";
          var status =
            result.pro_tag_status !== "" && result.pro_tag_status !== null
              ? {
                  label: pro_tag_status,
                  value: result.pro_tag_status,
                }
              : "";

          var clientupdatedata = {
            tag_name: result.pro_tag_name,
            outlet_id:
              Object.keys(result.outlet).length > 0 ? result.outlet : "",
            tag_image:
              result.pro_tag_image !== "" && result.pro_tag_image !== null
                ? result.pro_tag_image
                : "",
            status: status,
            action: "edit",
          };
          this.setState({ clientdata: clientupdatedata, pageloading: false });
        } else {
          this.setState({ pageloading: false });
          this.props.history.push(modulePath);
          showAlert("Error", "Invalid Tag", "error");
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

  /* signin - start*/
  fieldChange = (field, value) => {
    this.setState(
      update(this.state, { clientdata: { [field]: { $set: value } } })
    );
  };

  handleSubmit = () => {
    showLoader("submit_frm", "class");
    var postData = this.state.clientdata;
    var postObject = {
      tag_name: postData.tag_name,
      outlet_id:
        Object.keys(postData.outlet_id).length > 0
          ? postData.outlet_id.value
          : "",
      tag_image: postData.tag_image,
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
          <Header {...this.props} currentPage={"catalog-tag"} />
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
                  fields={this.state.clientdata}
                  onChange={this.fieldChange}
                  onValid={this.handleSubmit}
                  error_msg={this.state.error_msg}
                  outletList={this.state.outletList}
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
  const { tag_name, outlet_id, status } = props.fields;

  return {
    fields: ["tag_name", "outlet_id", "status"],

    validations: {
      tag_name: [[isEmpty, tag_name]],
      outlet_id: [[isSingleSelect, outlet_id]],
      status: [[isSingleSelect, status]],
    },
  };
}

class PostForm extends Component {
  constructor(props) {
    super(props);
  }

  handleSelectChange(name, value) {
    this.props.onChange(name, value);
  }

  async uplaodFiles() {
    var imagefile = document.querySelector("#tag_image");
    const file = imagefile.files[0];
    const params = {
      Bucket: bucketName,
      Key: `media/${foldername}/tag/${file.name}`,
      Body: file,
      ACL: "public-read",
    };
    const { Location } = await s3.upload(params).promise();
    this.props.onChange("tag_image", Location);
    $("#tag_image").val("");
  }
  async removeImage(fileNamme) {
    var fileNammeSplit = fileNamme.split("/");
    var params = {
      Bucket: bucketName,
      Key: `media/${foldername}/tag/${
        fileNammeSplit[fileNammeSplit.length - 1]
      }`,
    };
    await s3.deleteObject(params).promise();
    this.props.onChange("tag_image", "");
  }

  render() {
    const { fields, onChange, onValid, onInvalid, $field, $validation } =
      this.props;
    let errMsgName,
      errMsgOutlet,
      errMsgStatus = "";
    if ($validation.tag_name.error.reason !== undefined) {
      errMsgName = $validation.tag_name.show && (
        <span className="error">{$validation.tag_name.error.reason}</span>
      );
    }
    if ($validation.outlet_id.error.reason !== undefined) {
      errMsgOutlet = $validation.outlet_id.show && (
        <span className="error">{$validation.outlet_id.error.reason}</span>
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
                  errMsgName !== "" &&
                  errMsgName !== false &&
                  errMsgName !== undefined
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="tag_name"
                value={fields.tag_name}
                {...$field("tag_name", (e) =>
                  onChange("tag_name", e.target.value)
                )}
              />
              <label htmlFor="tag_name">
                Tag Name <span className="error">*</span>
              </label>
              {errMsgName}
            </div>
          </div>
          <div
            className={
              errMsgOutlet !== "" &&
              errMsgOutlet !== false &&
              errMsgOutlet !== undefined
                ? "col-md-6 error-select error"
                : "col-md-6"
            }
          >
            <div className="form-floating form-floating-outline custm-select-box">
              <Select
                value={fields.outlet_id}
                onChange={this.handleSelectChange.bind(this, "outlet_id")}
                placeholder={"Select Outlet"}
                options={this.props.outletList}
                isClearable={true}
              />
              <label className="select-box-label">
                Outlet<span className="error">*</span>
              </label>
              {errMsgOutlet}
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
          <div className="col-md-6"></div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <div className="mb-3">
                <label htmlFor="formFile" className="form-label">
                  Tag Image
                </label>
                <input
                  className="form-control"
                  type="file"
                  id="tag_image"
                  onChange={(event) => {
                    this.uplaodFiles(event);
                    return false;
                  }}
                />
              </div>
            </div>
            {fields.tag_image !== "" && (
              <div className="dz-preview dz-processing dz-image-preview dz-success dz-complete">
                <div className="dz-details">
                  <div className="dz-thumbnail">
                    <img alt="" src={fields.tag_image} />
                  </div>
                </div>
                <a
                  className="dz-remove"
                  href={void 0}
                  onClick={this.removeImage.bind(this, fields.tag_image)}
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
