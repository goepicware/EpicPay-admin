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
  isNumber,
} from "../../Helpers/SettingHelper";
import PageLoader from "../../Helpers/PageLoader";
import Header from "../Layout/Header";
import Topmenu from "../Layout/Topmenu";
import Footer from "../Layout/Footer";
import Editor from "../Layout/Editor";
var module = "clientpanel/faqs/";
var moduleName = "FAQ`s";
var modulePath = "/clientpanel/faq";
class Form extends Component {
  constructor(props) {
    super(props);
    var editID = "";
    if (this.props.match.path === "/clientpanel/faq/edit/:EditID") {
      editID = this.props.match.params.EditID;
    }
    this.state = {
      editID: editID,
      pageloading: false,
      postdata: {
        faq_category_id: "",
        faq_title: "",
        faq_description: "",
        faq_sequence: "",
        status: [],
        action: "add",
      },
      loading: true,
      formpost: [],
      companyDetail: [],
      categoryList: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.loadcategoryList();
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

          var faq_status = result.faq_status == "A" ? "Active" : "In Active";
          var status =
            result.faq_status !== "" && result.faq_status !== null
              ? {
                  label: faq_status,
                  value: result.faq_status,
                }
              : "";
          var clientupdatedata = {
            faq_category_id: result.faqcategory,
            faq_title: result.faq_title,
            faq_description: result.faq_description,
            faq_sequence: result.faq_sequence,
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
  loadcategoryList() {
    var urlShringTxt =
      apiUrl + "clientpanel/faqcategory/dropdownlist?company_id=" + CompanyID();
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ categoryList: res.data.result });
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
      faq_title: postData.faq_title,
      faq_description: postData.faq_description,
      faq_sequence: postData.faq_sequence,
      faq_category_id:
        Object.keys(postData.faq_category_id).length > 0
          ? postData.faq_category_id.value
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
          <Header {...this.props} currentPage={"faq"} />
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
                  categoryList={this.state.categoryList}
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
  const { faq_title, faq_category_id, status, faq_description, faq_sequence } =
    props.fields;

  return {
    fields: [
      "faq_title",
      "faq_category_id",
      "status",
      "faq_description",
      "faq_sequence",
    ],

    validations: {
      faq_title: [[isEmpty, faq_title]],
      faq_category_id: [[isSingleSelect, faq_category_id]],
      status: [[isSingleSelect, status]],
      faq_description: [[isEmpty, faq_description]],
      faq_sequence: [
        [isEmpty, faq_sequence],
        [isNumber, faq_sequence],
      ],
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
    this.props.onChange("faq_description", value);
  }

  render() {
    const { fields, onChange, onValid, onInvalid, $field, $validation } =
      this.props;
    let errMsgTitle,
      errMsgcategory,
      errMsgStatus,
      errMsgDescription,
      errMsgSequence = "";
    if ($validation.faq_title.error.reason !== undefined) {
      errMsgTitle = $validation.faq_title.show && (
        <span className="error">{$validation.faq_title.error.reason}</span>
      );
    }

    if ($validation.faq_category_id.error.reason !== undefined) {
      errMsgcategory = $validation.faq_category_id.show && (
        <span className="error">
          {$validation.faq_category_id.error.reason}
        </span>
      );
    }
    if ($validation.faq_description.error.reason !== undefined) {
      errMsgDescription = $validation.faq_description.show && (
        <span className="error">
          {$validation.faq_description.error.reason}
        </span>
      );
    }
    if ($validation.faq_sequence.error.reason !== undefined) {
      errMsgSequence = $validation.faq_sequence.show && (
        <span className="error">{$validation.faq_sequence.error.reason}</span>
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
          <div
            className={
              errMsgcategory !== "" &&
              errMsgcategory !== false &&
              errMsgcategory !== undefined
                ? "col-md-6 error-select error"
                : "col-md-6"
            }
          >
            <div className="form-floating form-floating-outline custm-select-box">
              <Select
                value={fields.faq_category_id}
                onChange={this.handleSelectChange.bind(this, "faq_category_id")}
                placeholder="Select Category"
                options={this.props.categoryList}
                isClearable={true}
              />
              <label className="select-box-label">
                Category<span className="error">*</span>
              </label>
              {errMsgcategory}
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
                name="faq_title"
                value={fields.faq_title}
                {...$field("faq_title", (e) =>
                  onChange("faq_title", e.target.value)
                )}
              />
              <label htmlFor="faq_title">
                Question <span className="error">*</span>
              </label>
              {errMsgTitle}
            </div>
          </div>
          <div className="col-md-12">
            <label>
              Answer <span className="error">*</span>
            </label>
            <Editor
              setContent={this.setContent}
              data={fields.faq_description}
            />
            {errMsgDescription}
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className={
                  errMsgSequence !== "" &&
                  errMsgSequence !== false &&
                  errMsgSequence !== undefined
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="faq_sequence"
                value={fields.faq_sequence}
                {...$field("faq_sequence", (e) =>
                  onChange("faq_sequence", e.target.value)
                )}
              />
              <label htmlFor="faq_sequence">
                Sequence <span className="error">*</span>
              </label>
              {errMsgSequence}
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
