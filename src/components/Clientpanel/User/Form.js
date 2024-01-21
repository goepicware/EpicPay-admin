/* eslint-disable */
import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Select from "react-select";
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
  isEmail,
  isSingleSelect,
} from "../../Helpers/SettingHelper";
import PageLoader from "../../Helpers/PageLoader";
import Header from "../Layout/Header";
import Topmenu from "../Layout/Topmenu";
import Footer from "../Layout/Footer";
import AWS from "aws-sdk";
AWS.config.update(awsCredentials);
const s3 = new AWS.S3();
var module = "clientpanel/adminusers/";
var moduleName = "Users";
var modulePath = "/clientpanel/users";
class Form extends Component {
  constructor(props) {
    super(props);
    var editID = "";
    if (this.props.match.path === "/clientpanel/users/edit/:EditID") {
      editID = this.props.match.params.EditID;
    }
    this.state = {
      editID: editID,
      pageloading: false,
      postdata: {
        first_name: "",
        last_name: "",
        username: "",
        password: "",
        cpassword: "",
        email: "",
        outlet_id: "",
        profile_picture: "",
        status: [],
        action: "add",
      },
      loading: true,
      formpost: [],
      companyDetail: [],
      outletList: [],
      roleList: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.laodUserRole();
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
console.log('DDDDFFF', result);
          var company_user_status =
            result.company_user_status == "A" ? "Active" : "In Active";
          var status =
            result.company_user_status !== "" &&
            result.company_user_status !== null
              ? {
                  label: company_user_status,
                  value: result.company_user_status,
                }
              : "";
          var clientupdatedata = {
            first_name: result.company_user_fname,
            last_name: result.company_user_lname,
            username: result.company_username,
            email: result.company_user_email_address,
            password: "",
            cpassword: "",
            outlet_id:
              result.user_mepped_outlet !== null
                ? result.user_mepped_outlet
                : { label: "Select Outlet", value: "" },
            profile_picture:
              result.company_user_profile_picture !== "" &&
              result.company_user_profile_picture !== null
                ? result.company_user_profile_picture
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

  laodUserRole() {
    var urlShringTxt =
      apiUrl + "clientpanel/userrole/dropdownlist?company_id=" + CompanyID();
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ roleList: res.data.result });
      }
    });
  }

  loadOutlet() {
    var urlShringTxt =
      apiUrl + "clientpanel/outlets/dropdownlist?company_id=" + CompanyID();
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        var result = [{ label: "Select Outlet", value: "" }];
        res.data.result.map((item) => {
          result.push(item);
        });
        this.setState({ outletList: result });
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
      company_user_fname: postData.first_name,
      company_user_lname: postData.last_name,
      company_user_password: postData.password,
      company_user_email_address: postData.email,
      company_user_permission_outlet:
        Object.keys(postData.outlet_id).length > 0
          ? postData.outlet_id.value
          : "",
      profile_picture: postData.profile_picture,
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
    } else {
      postObject["company_username"] = postData.username;
    }
    this.props.getFormPost(postObject, post_url, "client");
  };

  render() {
    return (
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <Header {...this.props} currentPage={"users"} />
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
                  roleList={this.state.roleList}
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

const minLength = (password, length) =>
  password.length >= length || password === ""
    ? null
    : "Password must be at least 6 characters.";
const areSame = (password, rePassword) =>
  password === rePassword ? null : "Password do not match.";

function validationConfig(props) {
  const {
    first_name,
    username,
    password,
    cpassword,
    email,
    outlet_id,
    status,
  } = props.fields;
  if (props.fields.action === "add") {
    return {
      fields: [
        "first_name",
        "username",
        "password",
        "cpassword",
        "email",
        "outlet_id",
        "status",
      ],

      validations: {
        first_name: [[isEmpty, first_name]],
        username: [[isEmpty, username]],
        password: [
          [isEmpty, password],
          [minLength, password, 6],
        ],
        cpassword: {
          rules: [
            [areSame, password, cpassword],
            [isEmpty, cpassword],
          ],
          fields: ["password", "cpassword"],
        },
        email: [
          [isEmpty, email],
          [isEmail, email],
        ],
        outlet_id: [[isSingleSelect, outlet_id]],
        status: [[isSingleSelect, status]],
      },
    };
  } else {
    return {
      fields: [
        "first_name",
        "username",
        "password",
        "cpassword",
        "email",
        "outlet_id",
        "status",
      ],

      validations: {
        first_name: [[isEmpty, first_name]],
        username: [[isEmpty, username]],
        cpassword: {
          rules: [[areSame, password, cpassword]],
          fields: ["password", "cpassword"],
        },
        email: [
          [isEmpty, email],
          /*  [isEmail, email], */
        ],
        outlet_id: [[isSingleSelect, outlet_id]],
        status: [[isSingleSelect, status]],
      },
    };
  }
}

class PostForm extends Component {
  constructor(props) {
    super(props);
  }

  handleChange(name, value) {
    this.props.onChange(name, value);
  }
  handleSelectChange(name, value) {
    this.props.onChange(name, value);
  }
  async uplaodFiles() {
    var imagefile = document.querySelector("#profile_picture");
    const file = imagefile.files[0];
    const params = {
      Bucket: bucketName,
      Key: `media/${foldername}/user/${file.name}`,
      Body: file,
      ACL: "public-read",
    };
    const { Location } = await s3.upload(params).promise();
    this.props.onChange("profile_picture", Location);
    $("#profile_picture").val("");
  }
  async removeImage(fileNamme) {
    var fileNammeSplit = fileNamme.split("/");
    var params = {
      Bucket: bucketName,
      Key: `media/${foldername}/user/${
        fileNammeSplit[fileNammeSplit.length - 1]
      }`,
    };
    await s3.deleteObject(params).promise();
    this.props.onChange("profile_picture", "");
  }
  render() {
    const { fields, onChange, onValid, onInvalid, $field, $validation } =
      this.props;
    let errMsgName,
      errMsgUserName,
      errMsgPassword,
      errMsgConfirmPassword,
      errMsgEmail,
      errMsgOutlet,
      errMsgRole,
      errMsgStatus = "";
    if ($validation.first_name.error.reason !== undefined) {
      errMsgName = $validation.first_name.show && (
        <span className="error">{$validation.first_name.error.reason}</span>
      );
    }
    if ($validation.username.error.reason !== undefined) {
      errMsgUserName = $validation.username.show && (
        <span className="error">{$validation.username.error.reason}</span>
      );
    }
    if (this.props.fields.action === "add") {
      if ($validation.password.error.reason !== undefined) {
        errMsgPassword = $validation.password.show && (
          <span className="error">{$validation.password.error.reason}</span>
        );
      }
      if ($validation.cpassword.error.reason !== undefined) {
        errMsgConfirmPassword = $validation.cpassword.show && (
          <span className="error">{$validation.cpassword.error.reason}</span>
        );
      }
    }
    if ($validation.email.error.reason !== undefined) {
      errMsgEmail = $validation.email.show && (
        <span className="error">{$validation.email.error.reason}</span>
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
                name="first_name"
                value={fields.first_name}
                {...$field("first_name", (e) =>
                  onChange("first_name", e.target.value)
                )}
              />
              <label htmlFor="first_name">
                First Name <span className="error">*</span>
              </label>
              {errMsgName}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className="form-control"
                name="last_name"
                value={fields.last_name}
                {...$field("last_name", (e) =>
                  onChange("last_name", e.target.value)
                )}
              />
              <label htmlFor="last_name">Last Name</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className={
                  errMsgUserName !== "" &&
                  errMsgUserName !== false &&
                  errMsgUserName !== undefined
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="username"
                readOnly={fields.action === "edit" ? true : false}
                value={fields.username}
                {...$field("username", (e) =>
                  onChange("username", e.target.value)
                )}
              />
              <label htmlFor="username">
                Username <span className="error">*</span>
              </label>
              {errMsgUserName}
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
                name="email"
                value={fields.email}
                {...$field("email", (e) => onChange("email", e.target.value))}
              />
              <label htmlFor="email">
                Email ID <span className="error">*</span>
              </label>
              {errMsgEmail}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-4 form-password-toggle">
              <div className="input-group input-group-merge">
                <div className="form-floating form-floating-outline">
                  <input
                    type="password"
                    id="password"
                    className={
                      errMsgPassword !== "" &&
                      errMsgPassword !== false &&
                      errMsgPassword !== undefined
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    value={fields.password}
                    {...$field("password", (e) =>
                      onChange("password", e.target.value)
                    )}
                  />
                  <label htmlFor="password">
                    Password <span className="error">*</span>
                  </label>
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
                    id="cpassword"
                    className={
                      errMsgConfirmPassword !== "" &&
                      errMsgConfirmPassword !== false &&
                      errMsgConfirmPassword !== undefined
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    value={fields.cpassword}
                    {...$field("cpassword", (e) =>
                      onChange("cpassword", e.target.value)
                    )}
                  />
                  <label htmlFor="cpassword">
                    Confirm Password <span className="error">*</span>
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
          <div
            className={
              errMsgOutlet !== "" &&
              errMsgOutlet !== false &&
              errMsgOutlet !== undefined
                ? "col-md-6 error-select error"
                : "col-md-6"
            }
          >
            <div className="form-floating form-floating-outline custm-select-box mb-4">
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
            <div className="form-floating form-floating-outline custm-select-box mb-4">
              <Select
                value={fields.status}
                onChange={this.handleSelectChange.bind(this, "status")}
                placeholder="Select Status *"
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
                <label htmlFor="formFile" className="form-label">
                  User Profile Image
                </label>
                <input
                  className="form-control"
                  type="file"
                  id="profile_picture"
                  onChange={(event) => {
                    this.uplaodFiles(event);
                    return false;
                  }}
                />
              </div>
            </div>
            {fields.profile_picture !== "" && (
              <div className="dz-preview dz-processing dz-image-preview dz-success dz-complete">
                <div className="dz-details">
                  <div className="dz-thumbnail">
                    <img alt="" src={fields.profile_picture} />
                  </div>
                </div>
                <a
                  className="dz-remove"
                  href={void 0}
                  onClick={this.removeImage.bind(this, fields.profile_picture)}
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
