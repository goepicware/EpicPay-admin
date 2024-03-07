import React, { Component } from "react";
import cookie from "react-cookies";

class Refpage extends Component {
  constructor(props) {
    super(props);

    let slugtext =
      typeof this.props.match.params.slugtext !== "undefined"
        ? this.props.match.params.slugtext
        : "";

    if (slugtext === "home") {
    } else {
      cookie.remove("triggerAvlPop", { path: "/" });
      cookie.remove("orderPopuptrigger", { path: "/" });
      cookie.remove("promoPopupTrigger", { path: "/" });
    }

    this.props.history.push("/");
  }

  render() {
    return <div></div>;
  }
}

export default Refpage;
