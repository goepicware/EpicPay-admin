/* eslint-disable */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Select from "react-select";
import update from "immutability-helper";
import { validated } from "react-custom-validation";
import { GET_FORMPOST, GET_DETAILDATA } from "../../../actions";
import {
  apiUrl,
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
var module = "clientpanel/staticblocks/";
var moduleName = "Static Block";
var modulePath = "/clientpanel/staticblock";
class Form extends Component {
  constructor(props) {
    super(props);
    var editID = "";
    if (this.props.match.path === "/clientpanel/staticblock/edit/:EditID") {
      editID = this.props.match.params.EditID;
    }
    this.state = {
      editID: editID,
      pageloading: false,
      postdata: {
        staticblocks_title: "",
        staticblocks_description: "",
        status: "",
        staticblocks_images: [],
        action: "add",
      },
      loading: true,
      formpost: [],
      companyDetail: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
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

          var staticblocks_status =
            result.staticblocks_status == "A" ? "Active" : "In Active";
          var status =
            result.staticblocks_status !== "" &&
            result.staticblocks_status !== null
              ? {
                  label: staticblocks_status,
                  value: result.staticblocks_status,
                }
              : "";
          var clientupdatedata = {
            staticblocks_title: result.staticblocks_title,
            staticblocks_description: result.staticblocks_description,
            staticblocks_images:
              result.staticblocks_images !== "" &&
              result.staticblocks_images !== null
                ? result.staticblocks_images.split(",")
                : [],
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
      static_title: postData.staticblocks_title,
      static_description: postData.staticblocks_description,
      staticblocks_images:
        postData.staticblocks_images.length > 0
          ? postData.staticblocks_images.join(",")
          : "",
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
          <Header {...this.props} currentPage={"staticblock"} />
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
                          100
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
  const { staticblocks_title, status } = props.fields;

  return {
    fields: ["staticblocks_title", "status"],
    validations: {
      staticblocks_title: [[isEmpty, staticblocks_title]],
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
    this.props.onChange("staticblocks_description", value);
  }

  async uplaodFiles() {
    var imagefile = document.querySelector("#staticblocks_images");
    const file = imagefile.files[0];
    const params = {
      Bucket: bucketName,
      Key: `media/${foldername}/staticblocks/${file.name}`,
      Body: file,
      ACL: "public-read",
    };
    const { Location } = await s3.upload(params).promise();
    var staticblocks_images = this.props.fields.staticblocks_images;
    staticblocks_images.push(Location);
    this.props.onChange("staticblocks_images", staticblocks_images);
    $("#staticblocks_images").val("");
  }
  async removeImage(fileNamme, removeIndex) {
    var fileNammeSplit = fileNamme.split("/");
    var params = {
      Bucket: bucketName,
      Key: `media/${foldername}/staticblocks/${
        fileNammeSplit[fileNammeSplit.length - 1]
      }`,
    };
    await s3.deleteObject(params).promise();
    var staticblocks_images = this.props.fields.staticblocks_images;
    staticblocks_images.splice(removeIndex, 1);
    this.props.onChange("staticblocks_images", staticblocks_images);
  }

  render() {
    const { fields, onChange, onValid, onInvalid, $field, $validation } =
      this.props;
    let errMsgTitle,
      errMsgStatus = "";
    if ($validation.staticblocks_title.error.reason !== undefined) {
      errMsgTitle = $validation.staticblocks_title.show && (
        <span className="error">
          {$validation.staticblocks_title.error.reason}
        </span>
      );
    }
    if ($validation.status.error.reason !== undefined) {
      errMsgStatus = $validation.status.show && (
        <span className="error">{$validation.status.error.reason}</span>
      );
    }

    return (
      <form className="card fv-plugins-bootstrap5" id="modulefrm">
        <div className="card-body row g-3 mt-3">
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
                name="staticblocks_title"
                value={fields.staticblocks_title}
                {...$field("staticblocks_title", (e) =>
                  onChange("staticblocks_title", e.target.value)
                )}
              />
              <label htmlFor="staticblocks_title">
                Title <span className="error">*</span>
              </label>
              {errMsgTitle}
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
          <div className="col-md-12">
            <label>Description</label>
            <Editor
              setContent={this.setContent}
              data={fields.staticblocks_description}
            />
          </div>
          <div className="col-md-12">
            <div className="card mb-4">
              <h5 className="card-header">Gallery Images</h5>
              <div className="card-body">
                <div className="dz-message needsclick">
                  Drop files here or click to upload
                  <span className="note needsclick">
                    (This is just a demo dropzone. Selected files are{" "}
                    <strong>not</strong> actually uploaded.)
                  </span>
                </div>
                <div className="fallback">
                  <input
                    name="file"
                    type="file"
                    id="staticblocks_images"
                    onChange={(event) => {
                      this.uplaodFiles(event);
                      return false;
                    }}
                  />
                </div>
                {fields.staticblocks_images.length > 0 &&
                  fields.staticblocks_images.map((item, index) => {
                    return (
                      <div
                        className="dz-preview dz-processing dz-image-preview dz-success dz-complete"
                        key={index}
                      >
                        <div className="dz-details">
                          <div className="dz-thumbnail">
                            <img alt="" src={item} />
                          </div>
                        </div>
                        <a
                          className="dz-remove"
                          href={void 0}
                          onClick={this.removeImage.bind(this, item, index)}
                        >
                          Remove file
                        </a>
                      </div>
                    );
                  })}
              </div>
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
