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
  isNumber,
} from "../../Helpers/SettingHelper";
import PageLoader from "../../Helpers/PageLoader";
import Header from "../Layout/Header";
import Topmenu from "../Layout/Topmenu";
import Footer from "../Layout/Footer";
import AWS from "aws-sdk";
AWS.config.update(awsCredentials);
const s3 = new AWS.S3();
var module = "clientpanel/menuitem/";
var moduleName = "Menu Item";
var modulePath = "/clientpanel/menuitem";
class Form extends Component {
  constructor(props) {
    super(props);
    var editID = "";
    if (this.props.match.path === "/clientpanel/menuitem/edit/:EditID") {
      editID = this.props.match.params.EditID;
    }
    this.state = {
      editID: editID,
      pageloading: false,
      postdata: {
        nav_group: "",
        nav_title: "",
        nav_parent_title: "",
        nav_type: "",
        custom_link: "",
        nav_link_type: { value: "_self", label: "Same Window" },
        nav_position: "",
        nav_icon: "",
        status: "",
        action: "add",
      },
      loading: true,
      formpost: [],
      companyDetail: [],
      menuGroup: [],
      menuItem: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.loadmenuGroup();
    this.loadmenuItem();
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

          var nav_status = result.nav_status == "A" ? "Active" : "In Active";
          var status =
            result.nav_status !== "" && result.nav_status !== null
              ? {
                  label: nav_status,
                  value: result.nav_status,
                }
              : [];

          var nav_link_type =
            result.nav_link_type === "_self" ? "Same Window" : "New Window";
          var navlinktype =
            result.nav_link_type !== "" && result.nav_link_type !== null
              ? {
                  label: nav_link_type,
                  value: result.nav_link_type,
                }
              : [];

          var clientupdatedata = {
            nav_group: result.menu_group,
            nav_title: result.nav_title,
            nav_parent_title:
              result.nav_parent_menu !== "" && result.nav_parent_menu !== null
                ? result.nav_parent_menu
                : "",
            custom_link: result.nav_pages,
            nav_position: result.nav_position,
            nav_link_type: navlinktype,
            nav_icon: result.nav_icon,
            status: status,
            action: "edit",
          };
          this.setState({ postdata: clientupdatedata, pageloading: false });
        } else {
          this.setState({ pageloading: false });
          this.props.history.push(modulePath);
          showAlert("Error", "Invalid" + moduleName, "error");
        }
      });
    }
  }

  loadmenuGroup() {
    var urlShringTxt =
      apiUrl + "clientpanel/menugroup/dropdownlist?company_id=" + CompanyID();
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ menuGroup: res.data.result });
      }
    });
  }
  loadmenuItem() {
    var urlShringTxt =
      apiUrl + module + "dropdownlist?company_id=" + CompanyID();
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ menuItem: res.data.result });
      }
    });
  }

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
      nav_group:
        Object.keys(postData.nav_group).length > 0
          ? postData.nav_group.value
          : "",
      nav_title: postData.nav_title,
      nav_parent_title:
        Object.keys(postData.nav_parent_title).length > 0
          ? postData.nav_parent_title.value
          : "",
      nav_type: "3",
      custom_link: postData.custom_link,
      nav_position: postData.nav_position,
      nav_link_type:
        Object.keys(postData.nav_link_type).length > 0
          ? postData.nav_link_type.value
          : "",
      nav_icon: postData.nav_icon,
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
          <Header {...this.props} currentPage={"menuitem"} />
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
                  menuGroup={this.state.menuGroup}
                  menuItem={this.state.menuItem}
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
  const { nav_title, nav_group, custom_link, nav_position, status } =
    props.fields;

  return {
    fields: ["nav_title", "nav_group", "custom_link", "nav_position", "status"],

    validations: {
      nav_title: [[isEmpty, nav_title]],
      nav_group: [[isSingleSelect, nav_group]],
      custom_link: [[isEmpty, custom_link]],
      nav_position: [
        [isEmpty, nav_position],
        [isNumber, nav_position],
      ],
      status: [[isSingleSelect, status]],
    },
  };
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
    var imagefile = document.querySelector("#nav_icon");
    const file = imagefile.files[0];
    const params = {
      Bucket: bucketName,
      Key: `media/${foldername}/navigation/${file.name}`,
      Body: file,
      ACL: "public-read",
    };
    const { Location } = await s3.upload(params).promise();
    this.props.onChange("nav_icon", Location);
    $("#nav_icon").val("");
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
      errMssNavGroup,
      errMssLink,
      errMsgNavPosition,
      errMsgStatus = "";
    if ($validation.nav_title.error.reason !== undefined) {
      errMsgTitle = $validation.nav_title.show && (
        <span className="error">{$validation.nav_title.error.reason}</span>
      );
    }
    if ($validation.nav_group.error.reason !== undefined) {
      errMssNavGroup = $validation.nav_group.show && (
        <span className="error">{$validation.nav_group.error.reason}</span>
      );
    }
    if ($validation.custom_link.error.reason !== undefined) {
      errMssLink = $validation.custom_link.show && (
        <span className="error">{$validation.custom_link.error.reason}</span>
      );
    }
    if ($validation.nav_position.error.reason !== undefined) {
      errMsgNavPosition = $validation.nav_position.show && (
        <span className="error">{$validation.nav_position.error.reason}</span>
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
          <div
            className={
              errMssNavGroup !== "" &&
              errMssNavGroup !== false &&
              errMssNavGroup !== undefined
                ? "col-md-6 error-select error"
                : "col-md-6"
            }
          >
            <div className="form-floating form-floating-outline custm-select-box">
              <Select
                value={fields.nav_group}
                onChange={this.handleSelectChange.bind(this, "nav_group")}
                placeholder="Select Menu Group"
                options={this.props.menuGroup}
                isClearable={true}
              />
              <label className="select-box-label">
                Menu Group<span className="error">*</span>
              </label>
              {errMssNavGroup}
            </div>
          </div>
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
                name="nav_title"
                value={fields.nav_title}
                {...$field("nav_title", (e) =>
                  onChange("nav_title", e.target.value)
                )}
              />
              <label htmlFor="nav_title">
                Title <span className="error">*</span>
              </label>
              {errMsgTitle}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline custm-select-box">
              <Select
                value={fields.nav_parent_title}
                onChange={this.handleSelectChange.bind(
                  this,
                  "nav_parent_title"
                )}
                placeholder="Select Child Of"
                options={this.props.menuItem}
                isClearable={true}
              />
              <label className="select-box-label">Child Of</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className={
                  errMssLink !== "" &&
                  errMssLink !== false &&
                  errMssLink !== undefined
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="custom_link"
                id="custom_link"
                value={fields.custom_link}
                {...$field("custom_link", (e) =>
                  onChange("custom_link", e.target.value)
                )}
              />
              <label htmlFor="custom_link">
                Url / Slug<span className="error">*</span>
              </label>
              {errMssLink}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline custm-select-box">
              <Select
                value={fields.nav_link_type}
                onChange={this.handleSelectChange.bind(this, "nav_link_type")}
                placeholder="Open In"
                options={[
                  { value: "_self", label: "Same Window" },
                  { value: "_blank", label: "New Window" },
                ]}
                isClearable={true}
              />
              <label className="select-box-label">Open In</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className={
                  errMsgNavPosition !== "" &&
                  errMsgNavPosition !== false &&
                  errMsgNavPosition !== undefined
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="nav_position"
                id="nav_position"
                value={fields.nav_position}
                {...$field("nav_position", (e) =>
                  onChange("nav_position", e.target.value)
                )}
              />
              <label htmlFor="nav_position">
                Sequence <span className="error">*</span>
              </label>
              {errMsgNavPosition}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <div className="mb-3">
                <label htmlFor="formFile" className="form-label">
                  Menu Icon
                </label>
                <input
                  className="form-control"
                  type="file"
                  id="nav_icon"
                  onChange={(event) => {
                    this.uplaodFiles(event);
                    return false;
                  }}
                />
              </div>
            </div>
            {fields.nav_icon !== "" && (
              <div className="dz-preview dz-processing dz-image-preview dz-success dz-complete">
                <div className="dz-details">
                  <div className="dz-thumbnail">
                    <img alt="" src={fields.nav_icon} />
                  </div>
                </div>
                <a
                  className="dz-remove"
                  href={void 0}
                  onClick={this.removeImage.bind(
                    this,
                    fields.nav_icon,
                    "nav_icon"
                  )}
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
            <div className="form-floating form-floating-outline custm-select-box mt-4">
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
