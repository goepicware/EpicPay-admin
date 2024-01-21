import React, { Component } from "react";
import cookie from "react-cookies";
import {
  deliveryId,
  pickupId,
  cateringId,
  reservationId,
} from "../Helpers/Config";

class Refpage extends Component {
  constructor(props) {
    super(props);

    let slugtext =
      typeof this.props.match.params.slugtext !== "undefined"
        ? this.props.match.params.slugtext
        : "";

    if (slugtext === "delivery") {
      cookie.save("triggerAvlPop", deliveryId, {
        path: "/",
      });
    } else if (slugtext === "pickup") {
      cookie.save("triggerAvlPop", pickupId, {
        path: "/",
      });
    } else if (slugtext === "catering") {
      cookie.save("triggerAvlPop", cateringId, {
        path: "/",
      });
    } else if (slugtext === "reservation") {
      cookie.save("triggerAvlPop", reservationId, {
        path: "/",
      });
    } else if (slugtext === "ordernow") {
      cookie.save("orderPopuptrigger", "Yes", {
        path: "/",
      });
    } else if (slugtext === "promopopup") {
      cookie.save("promoPopupTrigger", "Yes", {
        path: "/",
      });
    } else if (slugtext === "home") {
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