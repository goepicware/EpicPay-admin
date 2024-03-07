/* eslint-disable */
import React, { Component } from "react";
import cookie from "react-cookies";
import axios from "axios";
import { connect } from "react-redux";
import update from "immutability-helper";
import { validated } from "react-custom-validation";

/* import Form from "./Form"; */

import { apiUrl, baseUrl } from "../../Helpers/Config";

import { showLoader, hideLoader } from "../../Helpers/SettingHelper";
var qs = require("qs");
var Parser = require("html-react-parser");
var base64 = require("base-64");
class Login extends Component {
  constructor(props) {
    super(props);
    var LoginType =
      this.props.match.params !== "" &&
      typeof this.props.match.params !== undefined &&
      typeof this.props.match.params !== "undefined"
        ? this.props.match.params.LoginType
        : "";
    var clientID =
      this.props.match.params !== "" &&
      typeof this.props.match.params !== undefined &&
      typeof this.props.match.params !== "undefined"
        ? this.props.match.params.clientID
        : "";
    LoginType = LoginType != undefined ? LoginType : "";
    clientID = clientID != undefined ? clientID : "";
    this.state = {
      fields: {
        username: "",
        password: "",
      },
      error_msg: "",
      login_type: LoginType,
      client_id: clientID,
    };

    if (LoginType != "" && LoginType != "masteradmin") {
      location.href = baseUrl + "clientpanel/login";
    }
  }

  /* signin - start*/
  fieldChange = (field, value) => {
    this.setState(update(this.state, { fields: { [field]: { $set: value } } }));
  };

  handleSignin = () => {
    const formPayload = this.state.fields;
    this.setState({ error_msg: "" });
    var postObject = {
      username: formPayload.username,
      password: formPayload.password,
      login_type: this.state.login_type,
      client_id: this.state.client_id,
    };
    showLoader("do_login", "class");

    axios
      .post(apiUrl + "clientpanel/clients/login", qs.stringify(postObject))
      .then((res) => {
        hideLoader("do_login", "class");
        if (res.data.status === "ok") {
          var ResulSet = res.data.result;
          cookie.save("companyID", base64.encode(ResulSet.company_id), {
            path: "/",
          });
          cookie.save("clientID", base64.encode(ResulSet.company_admin_id), {
            path: "/",
          });

          cookie.save("clientUnquieID", ResulSet.company_unquie_id, {
            path: "/",
          });
          cookie.save("clientCurrency", ResulSet.admin_currency, { path: "/" });
          cookie.save("clientLoginType", ResulSet.admin_type, { path: "/" });
          cookie.save("clientPerPage", ResulSet.admin_records_perpage, {
            path: "/",
          });
          cookie.save("clientAllowOutlet", ResulSet.user_permission_outlet, {
            path: "/",
          });
          cookie.save("clientFirstName", ResulSet.company_firstlast_name, {
            path: "/",
          });

          cookie.save("clientAccessToken", res.data.token, {
            path: "/",
          });
          cookie.save("clientDateFormat", ResulSet.admin_dateformat, {
            path: "/",
          });
          cookie.save("clientTimeFormat", ResulSet.admin_timeformat, {
            path: "/",
          });
          // var this_ = this;
          location.href = baseUrl + "clientpanel/outlet";
          setTimeout(function () {
            hideLoader("do_login", "class");
            // this_.props.history.push("/clientpanel/outlet");
          }, 500);
        } else {
          var errorMsg =
            res.data.form_error !== "" ? res.data.form_error : res.data.message;
          this.setState({ error_msg: errorMsg });
          var this_ = this;
          setTimeout(function () {
            this_.setState({ error_msg: "" });
          }, 5000);
        }
      });
  };
  /* signin - end*/

  render() {
    return (
      <div className="position-relative">
        <div className="authentication-wrapper authentication-basic container-p-y">
          <div className="authentication-inner py-4">
            <div className="card p-2">
              <div className="app-brand justify-content-center mt-5">
                <a href="index.html" className="app-brand-link gap-2">
                  <span className="app-brand-logo demo">
                    <span>
                      <img src={"/epicpay.png"} alt="GoepicPay" />
                    </span>
                  </span>
                </a>
              </div>

              <div className="card-body mt-2">
                <h4 className="mb-2 fw-semibold">
                  Welcome to GoepicPay Wallet! 👋
                </h4>
                <p className="mb-4">
                  Please sign-in to your account and start the adventure
                </p>
                <Form
                  {...this.props}
                  fields={this.state.fields}
                  onChange={this.fieldChange}
                  onValid={this.handleSignin}
                  error_msg={this.state.error_msg}
                  onInvalid={() => console.log("Form invalid!")}
                />
              </div>
            </div>
            <img
              alt="mask"
              src="../../assets/img/illustrations/auth-basic-login-mask-light.png"
              className="authentication-image d-none d-lg-block"
              data-app-light-img="illustrations/auth-basic-login-mask-light.png"
              data-app-dark-img="illustrations/auth-basic-login-mask-dark.png"
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateTopProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateTopProps, mapDispatchToProps)(Login);

const isEmpty = (value) => (value === "" ? "This field is required." : null);

function validationConfig(props) {
  const { username, password } = props.fields;

  return {
    fields: ["username", "password"],

    validations: {
      username: [[isEmpty, username]],
      password: [[isEmpty, password]],
    },
  };
}

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = { pass_input_type: "password" };
  }

  changePassInputtype() {
    let passIntTyp = this.state.pass_input_type;
    passIntTyp = passIntTyp == "password" ? "text" : "password";
    this.setState({ pass_input_type: passIntTyp });
  }

  render() {
    const { fields, onChange, onValid, onInvalid, $field, $validation } =
      this.props;
    let errMsgUsername = "";
    let errMsgPassword = "";

    if ($validation.username.error.reason !== undefined) {
      errMsgUsername = $validation.username.show && (
        <span className="error">{$validation.username.error.reason}</span>
      );
    }
    if ($validation.password.error.reason !== undefined) {
      errMsgPassword = $validation.password.show && (
        <span className="error">{$validation.password.error.reason}</span>
      );
    }

    return (
      <div className="mb-3">
        <div
          className={
            errMsgUsername !== "" && errMsgUsername !== false
              ? "form-floating form-floating-outline mb-3 fv-plugins-bootstrap5-row-invalid"
              : "form-floating form-floating-outline mb-3"
          }
        >
          <input
            type="text"
            className={
              errMsgUsername !== "" && errMsgUsername !== false
                ? "form-control is-invalid"
                : "form-control"
            }
            id="username"
            name="username"
            placeholder="Enter your username"
            value={fields.username}
            {...$field("username", (e) => onChange("username", e.target.value))}
          />
          <label htmlFor="email">Username</label>
          {errMsgUsername !== "" && errMsgUsername !== false && (
            <div className="fv-plugins-message-container invalid-feedback">
              <div data-field="email-username" data-validator="notEmpty">
                Please enter username
              </div>
            </div>
          )}
        </div>
        <div className="mb-3">
          <div className="form-password-toggle">
            <div className="input-group input-group-merge">
              <div
                className={
                  errMsgPassword !== "" && errMsgPassword !== false
                    ? "form-floating form-floating-outline fv-plugins-bootstrap5-row-invalid"
                    : "form-floating form-floating-outline"
                }
              >
                <input
                  type={this.state.pass_input_type}
                  id="password"
                  className={
                    errMsgPassword !== "" && errMsgPassword !== false
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  name="password"
                  placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                  aria-describedby="password"
                  value={fields.password}
                  {...$field("password", (e) =>
                    onChange("password", e.target.value)
                  )}
                />
                <label htmlFor="password">Password</label>
                {errMsgPassword !== "" && errMsgPassword !== false && (
                  <div className="fv-plugins-message-container invalid-feedback">
                    <div data-field="email-username" data-validator="notEmpty">
                      Please enter password
                    </div>
                  </div>
                )}
              </div>
              <span
                className="input-group-text cursor-pointer"
                style={{ height: "49px" }}
                onClick={this.changePassInputtype.bind(this)}
              >
                {this.state.pass_input_type == "password" ? (
                  <i className="mdi mdi-eye-off-outline"></i>
                ) : (
                  <i className="mdi mdi-eye-outline"></i>
                )}
              </span>
            </div>
          </div>
        </div>
        {/*<div className="mb-3 d-flex justify-content-between">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="remember-me"
            />
            <label className="form-check-label" htmlFor="remember-me">
              {" "}
              Remember Me{" "}
            </label>
          </div>
          <a href="auth-forgot-password-basic.html" className="float-end mb-1">
            <span>Forgot Password?</span>
          </a>
        </div>*/}
        {this.props.error_msg !== "" && (
          <div className="alert alert-danger login-error" role="alert">
            {Parser(this.props.error_msg)}
          </div>
        )}
        <div className="mb-3">
          <button
            type="button"
            className="btn btn-primary d-grid w-100 do_login"
            onClick={(e) => {
              e.preventDefault();
              this.props.$submit(onValid, onInvalid);
            }}
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }
}
Form = validated(validationConfig)(Form);
