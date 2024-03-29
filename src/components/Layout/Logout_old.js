import React, { Component } from "react";
import cookie from "react-cookies";

class Logout extends Component {
  componentWillMount() {
    cookie.remove("companyID", { path: "/" });
    cookie.remove("clientID", { path: "/" });
    cookie.remove("clientUnquieID", { path: "/" });
    cookie.remove("clientCurrency", { path: "/" });
    cookie.remove("clientLoginType", { path: "/" });
    cookie.remove("clientPerPage", { path: "/" });
    cookie.remove("clientAllowOutlet", { path: "/" });
    cookie.remove("clientFirstName", { path: "/" });
    cookie.remove("clientAccessToken", { path: "/" });
    cookie.remove("clientDateFormat", { path: "/" });
    cookie.remove("clientTimeFormat", { path: "/" });

    this.props.history.push("/");
  }

  render() {
    return <h1 className="loading-text">Logging out...</h1>;
  }
}

export default Logout;
