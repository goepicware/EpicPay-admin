/* eslint-disable */
import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Select from "react-select";
import update from "immutability-helper";
import { validated } from "react-custom-validation";
import { GET_FORMPOST, GET_DETAILDATA } from "../../../actions";
import { apiUrl, clientheaderconfig } from "../../Helpers/Config";
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
var module = "clientpanel/emailtemplate/";
var moduleName = "Email Template";
var modulePath = "/clientpanel/emailtemplate";
class Form extends Component {
  constructor(props) {
    super(props);
    var editID = "";
    if (this.props.match.path === "/clientpanel/emailtemplate/edit/:EditID") {
      editID = this.props.match.params.EditID;
    }
    this.state = {
      editID: editID,
      pageloading: false,
      postdata: {
        email_subject: "",
        email_content: "",
        email_config_key: "",
        status: [],
        action: "add",
      },
      loading: true,
      formpost: [],
      companyDetail: [],
      kelyList: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.loadkelyList();
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

          var staticblocks_status =
            result.sl_status == "A" ? "Active" : "In Active";
          var status =
            result.sl_status !== "" && result.sl_status !== null
              ? [
                  {
                    label: staticblocks_status,
                    value: result.staticblocks_status,
                  },
                ]
              : [];
          var clientupdatedata = {
            email_subject: result.email_subject,
            email_content:
              result.email_content !== null ? result.email_content : "",
            email_config_key:
              result.email_config_key !== "" && result.email_config_key !== null
                ? {
                    label: result.email_config_key,
                    value: result.email_config_key,
                  }
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
  loadkelyList() {
    var urlShringTxt = apiUrl + "clientpanel/emailtemplate/keylist";
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        var kelyList = [];
        res.data.result.map((item) => {
          kelyList.push({ label: item, value: item });
        });
        this.setState({ kelyList: kelyList });
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
      email_title: postData.email_subject,
      email_template: postData.email_content,
      email_config_key:
        Object.keys(postData.email_config_key).length > 0
          ? postData.email_config_key.value
          : "A",
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
          <Header {...this.props} currentPage={"emailtemplate"} />
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
                  kelyList={this.state.kelyList}
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
  const { email_subject, email_config_key, email_content } = props.fields;

  return {
    fields: ["email_subject", "email_config_key", "email_content"],

    validations: {
      email_subject: [[isEmpty, email_subject]],
      email_config_key: [[isSingleSelect, email_config_key]],
      email_content: [[isEmpty, email_content]],
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
    this.props.onChange("email_content", value);
  }

  render() {
    const { fields, onChange, onValid, onInvalid, $field, $validation } =
      this.props;
    let errMsgSubject,
      errMsgConfigKey,
      errMsgContent = "";
    if ($validation.email_subject.error.reason !== undefined) {
      errMsgSubject = $validation.email_subject.show && (
        <span className="error">{$validation.email_subject.error.reason}</span>
      );
    }
    if ($validation.email_config_key.error.reason !== undefined) {
      errMsgConfigKey = $validation.email_config_key.show && (
        <span className="error">
          {$validation.email_config_key.error.reason}
        </span>
      );
    }
    if ($validation.email_content.error.reason !== undefined) {
      errMsgContent = $validation.email_content.show && (
        <span className="error">{$validation.email_content.error.reason}</span>
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
                  errMsgSubject !== "" &&
                  errMsgSubject !== false &&
                  errMsgSubject !== undefined
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="email_subject"
                value={fields.email_subject}
                {...$field("email_subject", (e) =>
                  onChange("email_subject", e.target.value)
                )}
              />
              <label htmlFor="email_subject">
                Subject <span className="error">*</span>
              </label>
              {errMsgSubject}
            </div>
          </div>
          <div
            className={
              errMsgConfigKey !== "" &&
              errMsgConfigKey !== false &&
              errMsgConfigKey !== undefined
                ? "col-md-6 error-select error"
                : "col-md-6"
            }
          >
            <div className="form-floating form-floating-outline custm-select-box">
              <Select
                value={fields.email_config_key}
                onChange={this.handleSelectChange.bind(
                  this,
                  "email_config_key"
                )}
                placeholder="Select Email Config Key"
                options={this.props.kelyList}
                isClearable={true}
              />
              <label className="select-box-label">
                Email Config Key<span className="error">*</span>
              </label>
              {errMsgConfigKey}
            </div>
          </div>
          <div className="col-md-12">
            <label>Description</label>
            <Editor setContent={this.setContent} data={fields.email_content} />
            {errMsgContent}
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
