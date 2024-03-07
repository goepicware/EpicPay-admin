import React, { Component } from "react";
import cookie from "react-cookies";

class Logout extends Component {
  LoginType;
  constructor(props) {
    super(props);
    var LoginType =
      this.props.match?.params !== "" ? this.props.match.params.LoginType : "";
    this.state = {
      loginType: LoginType,
    };
  }
  componentWillMount() {
    cookie.remove("loginName", { path: "/" });
    cookie.remove("accessToken", { path: "/" });
    cookie.remove("loginID", { path: "/" });
    cookie.remove("clientAccessToken", { path: "/" });
    cookie.remove("clientID", { path: "/" });
    cookie.remove("clientFirstName", { path: "/" });
    cookie.remove("clientAllowOutlet", { path: "/" });
    cookie.remove("clientTimeFormat", { path: "/" });
    cookie.remove("clientDateFormat", { path: "/" });
    cookie.remove("clientLoginType", { path: "/" });
    cookie.remove("clientCurrency", { path: "/" });
    cookie.remove("companyID", { path: "/" });
    cookie.remove("clientCurrency", { path: "/" });
    cookie.remove("clientPerPage", { path: "/" });
    cookie.remove("clientUnquieID", { path: "/" });

    if (this.state.loginType === "master") {
      this.props.history.push("/masterpanel");
    } else {
      this.props.history.push("/");
    }
  }
  render() {
    return <h1 className="loading-text">Logging out...</h1>;
  }
}

export default Logout;
