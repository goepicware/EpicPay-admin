/* eslint-disable */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
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

var module = "clientpanel/rewardspoints/";
var modulePath = "/clientpanel/points";
class Form extends Component {
  constructor(props) {
    super(props);
    var pointType = "";
    console.log(this.props, "this.props");
    if (
      this.props.match.params.Type !== "" &&
      typeof this.props.match.params.Type !== undefined &&
      typeof this.props.match.params.Type !== "undefined"
    ) {
      pointType = this.props.match.params.Type;
    } else {
      this.props.history.push(modulePath);
    }

    this.state = {
      pointType: pointType,
      pageloading: false,
      postdata: {
        reward_customer: "",
        reward_points: "",
        expiry_days: "",
        reason: "",
        action: pointType,
      },
      loading: true,
      formpost: [],
      companyDetail: [],
      customerList: [],
    };
  }
  componentDidMount() {
    this.loadCustomer();
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
  }

  loadCustomer() {
    var urlShringTxt =
      apiUrl + "clientpanel/customer/dropdownlist?company_id=" + CompanyID();
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ customerList: res.data.result });
      }
    });
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
      reward_customer:
        Object.keys(postData.reward_customer).length > 0
          ? postData.reward_customer.value
          : "",
      reward_points: postData.reward_points,
      expiry_days: postData.expiry_days,
      reason: postData.reason,
      point_type: this.state.pointType,
      loginID: userID(),
      company_admin_id: clientID(),
      company_id: CompanyID(),
      action: postData.action,
    };
    if (this.state.pointType === "credit") {
      var post_url = module + "credit";
    } else {
      var post_url = module + "debit";
    }
    this.props.getFormPost(postObject, post_url, "client");
  };

  render() {
    return (
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <Header {...this.props} currentPage={"points"} />
          <div className="layout-page">
            <Topmenu />
            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row mb-3">
                  <div className="col-lg-10 col-md-6">
                    <h4 className="fw-bold">
                      {this.state.pointType == "credit" ? "Credit" : "Debit"}{" "}
                      Reward Point
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
                  customerList={this.state.customerList}
                  pointType={this.state.pointType}
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
  const { reward_customer, reward_points, expiry_days, reason } = props.fields;
  if (props.pointType === "credit") {
    return {
      fields: ["reward_customer", "reward_points", "expiry_days", "reason"],

      validations: {
        reward_customer: [[isSingleSelect, reward_customer]],
        reward_points: [[isEmpty, reward_points]],
        expiry_days: [[isEmpty, expiry_days]],
        reason: [[isEmpty, reason]],
      },
    };
  } else {
    return {
      fields: ["reward_customer", "reward_points", "expiry_days", "reason"],

      validations: {
        reward_customer: [[isSingleSelect, reward_customer]],
        reward_points: [[isEmpty, reward_points]],
        reason: [[isEmpty, reason]],
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

  render() {
    const { fields, onChange, onValid, onInvalid, $field, $validation } =
      this.props;
    let errMsgCustomer,
      errMsgPoints,
      errMsgDayexpiry,
      errMsgReason = "";

    if ($validation.reward_customer.error.reason !== undefined) {
      errMsgCustomer = $validation.reward_customer.show && (
        <span className="error">
          {$validation.reward_customer.error.reason}
        </span>
      );
    }
    if ($validation.reward_points.error.reason !== undefined) {
      errMsgPoints = $validation.reward_points.show && (
        <span className="error">{$validation.reward_points.error.reason}</span>
      );
    }
    if (this.props.pointType === "credit") {
      if ($validation.expiry_days.error.reason !== undefined) {
        errMsgDayexpiry = $validation.expiry_days.show && (
          <span className="error">{$validation.expiry_days.error.reason}</span>
        );
      }
    }
    if ($validation.reason.error.reason !== undefined) {
      errMsgReason = $validation.reason.show && (
        <span className="error">{$validation.reason.error.reason}</span>
      );
    }

    return (
      <form className="card fv-plugins-bootstrap5" id="modulefrm">
        <div className="card-body row g-3">
          <div
            className={
              errMsgCustomer !== "" &&
              errMsgCustomer !== false &&
              errMsgCustomer !== undefined
                ? "col-md-6 error-select error"
                : "col-md-6"
            }
          >
            <div className="form-floating form-floating-outline custm-select-box">
              <Select
                value={fields.reward_customer}
                onChange={this.handleSelectChange.bind(this, "reward_customer")}
                placeholder="Select Customer"
                options={this.props.customerList}
                isClearable={true}
              />
              <label className="select-box-label">
                Customer<span className="error">*</span>
              </label>
              {errMsgCustomer}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className={
                  errMsgPoints !== "" &&
                  errMsgPoints !== false &&
                  errMsgPoints !== undefined
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="reward_points"
                id="reward_points"
                value={fields.reward_points}
                {...$field("reward_points", (e) =>
                  onChange("reward_points", e.target.value)
                )}
              />
              <label htmlFor="reward_points">
                Points<span className="error">*</span>
              </label>
              {errMsgPoints}
            </div>
          </div>
          {this.props.pointType === "credit" && (
            <div className="col-md-6">
              <div className="form-floating form-floating-outline mb-4">
                <input
                  type="text"
                  className={
                    errMsgDayexpiry !== "" &&
                    errMsgDayexpiry !== false &&
                    errMsgDayexpiry !== undefined
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  name="expiry_days"
                  id="expiry_days"
                  value={fields.expiry_days}
                  {...$field("expiry_days", (e) =>
                    onChange("expiry_days", e.target.value)
                  )}
                />
                <label htmlFor="expiry_days">
                  Expiry Day<span className="error">*</span>
                </label>
                {errMsgDayexpiry}
              </div>
            </div>
          )}
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <textarea
                className={
                  errMsgReason !== "" &&
                  errMsgReason !== false &&
                  errMsgReason !== undefined
                    ? "form-control h-px-75 is-invalid"
                    : "form-control h-px-75"
                }
                id="reason"
                name="reason"
                placeholder="Reason"
                value={fields.reason}
                rows="3"
                {...$field("reason", (e) => onChange("reason", e.target.value))}
              ></textarea>
              <label htmlFor="reason">
                Reason<span className="error">*</span>
              </label>
              {errMsgReason}
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
