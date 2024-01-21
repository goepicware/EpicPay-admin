/* eslint-disable */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Select from "react-select";
import update from "immutability-helper";
import { validated } from "react-custom-validation";
import { GET_FORMPOST, GET_DETAILDATA } from "../../../actions";
import { apiUrl } from "../../Helpers/Config";
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
var module = "clientpanel/sitelocation/";
var moduleName = "Site Location";
var modulePath = "/clientpanel/sitelocation";
class Form extends Component {
  constructor(props) {
    super(props);
    var editID = "";
    if (this.props.match.path === "/clientpanel/sitelocation/edit/:EditID") {
      editID = this.props.match.params.EditID;
    }
    this.state = {
      editID: editID,
      pageloading: false,
      postdata: {
        sl_name: "",
        sl_pickup_postal_code: "",
        sl_pickup_address_line1: "",
        sl_pickup_unit_number1: "",
        sl_pickup_unit_number2: "",
        status: "",
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

          var sl_status = result.sl_status == "A" ? "Active" : "In Active";
          var status =
            result.sl_status !== "" && result.sl_status !== null
              ? {
                  label: sl_status,
                  value: result.sl_status,
                }
              : "";
          var clientupdatedata = {
            sl_name: result.sl_name,
            sl_pickup_postal_code: result.sl_pickup_postal_code,
            sl_pickup_address_line1: result.sl_pickup_address_line1,
            sl_pickup_unit_number1: result.sl_pickup_unit_number1,
            sl_pickup_unit_number2: result.sl_pickup_unit_number2,
            status: status,
            action: "edit",
          };
          this.setState({ postdata: clientupdatedata, pageloading: false });
        } else {
          this.setState({ pageloading: false }, function () {
            this.props.history.push(modulePath);
            showAlert("Error", "Invalid" + moduleName, "error");
          });
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
      sl_name: postData.sl_name,
      sl_pickup_postal_code: postData.sl_pickup_postal_code,
      sl_pickup_address_line1: postData.sl_pickup_address_line1,
      sl_pickup_unit_number1: postData.sl_pickup_unit_number1,
      sl_pickup_unit_number2: postData.sl_pickup_unit_number2,
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
          <Header {...this.props} currentPage={"sitelocation"} />
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
  const { sl_name, sl_pickup_postal_code, sl_pickup_address_line1, status } =
    props.fields;

  return {
    fields: [
      "sl_name",
      "sl_pickup_postal_code",
      "sl_pickup_address_line1",
      "status",
    ],

    validations: {
      sl_name: [[isEmpty, sl_name]],
      sl_pickup_postal_code: [
        [isEmpty, sl_pickup_postal_code],
        [isNumber, sl_pickup_postal_code],
      ],
      sl_pickup_address_line1: [[isEmpty, sl_pickup_address_line1]],
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

  render() {
    const { fields, onChange, onValid, onInvalid, $field, $validation } =
      this.props;
    let errMsgSLName,
      errMsgPostalCode,
      errMssAddress,
      errMsgStatus = "";
    if ($validation.sl_name.error.reason !== undefined) {
      errMsgSLName = $validation.sl_name.show && (
        <span className="error">{$validation.sl_name.error.reason}</span>
      );
    }
    if ($validation.sl_pickup_postal_code.error.reason !== undefined) {
      errMsgPostalCode = $validation.sl_pickup_postal_code.show && (
        <span className="error">
          {$validation.sl_pickup_postal_code.error.reason}
        </span>
      );
    }
    if ($validation.sl_pickup_address_line1.error.reason !== undefined) {
      errMssAddress = $validation.sl_pickup_address_line1.show && (
        <span className="error">
          {$validation.sl_pickup_address_line1.error.reason}
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
        <div className="card-body row g-3">
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className={
                  errMsgSLName !== "" &&
                  errMsgSLName !== false &&
                  errMsgSLName !== undefined
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="sl_name"
                value={fields.sl_name}
                {...$field("sl_name", (e) =>
                  onChange("sl_name", e.target.value)
                )}
              />
              <label htmlFor="sl_name">
                Name <span className="error">*</span>
              </label>
              {errMsgSLName}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className={
                  errMsgPostalCode !== "" &&
                  errMsgPostalCode !== false &&
                  errMsgPostalCode !== undefined
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="sl_pickup_postal_code"
                id="sl_pickup_postal_code"
                value={fields.sl_pickup_postal_code}
                {...$field("sl_pickup_postal_code", (e) =>
                  onChange("sl_pickup_postal_code", e.target.value)
                )}
              />
              <label htmlFor="sl_pickup_postal_code">
                Postal Code<span className="error">*</span>
              </label>
              {errMsgPostalCode}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className={
                  errMssAddress !== "" &&
                  errMssAddress !== false &&
                  errMssAddress !== undefined
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="sl_pickup_address_line1"
                id="sl_pickup_address_line1"
                value={fields.sl_pickup_address_line1}
                {...$field("sl_pickup_address_line1", (e) =>
                  onChange("sl_pickup_address_line1", e.target.value)
                )}
              />
              <label htmlFor="sl_pickup_address_line1">
                Address<span className="error">*</span>
              </label>
              {errMssAddress}
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className="form-control"
                name="sl_pickup_unit_number1"
                id="sl_pickup_unit_number1"
                value={fields.sl_pickup_unit_number1}
                {...$field("sl_pickup_unit_number1", (e) =>
                  onChange("sl_pickup_unit_number1", e.target.value)
                )}
              />
              <label htmlFor="sl_pickup_unit_number1">Unit No.</label>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className="form-control"
                name="sl_pickup_unit_number2"
                id="sl_pickup_unit_number2"
                value={fields.sl_pickup_unit_number2}
                {...$field("sl_pickup_unit_number2", (e) =>
                  onChange("sl_pickup_unit_number2", e.target.value)
                )}
              />
              <label htmlFor="sl_pickup_unit_number2">Floor No.</label>
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
