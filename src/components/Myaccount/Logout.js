import React, { Component } from "react";
import cookie from "react-cookies";

class Logout extends Component {
  UNSAFE_componentWillMount() {
    cookie.remove("UserId", { path: "/" });
    cookie.remove("UserFname", { path: "/" });
    cookie.remove("UserLname", { path: "/" });
    cookie.remove("UserMobile", { path: "/" });
    cookie.remove("UserEmail", { path: "/" });
    cookie.remove("orderPaymentMode", { path: "/" });
    cookie.remove("orderOutletId", { path: "/" });
    cookie.remove("orderTableNo", { path: "/" });
    cookie.remove("product_remarks", { path: "/" });
    cookie.remove("orderOutletName", { path: "/" });
    cookie.remove("orderZoneId", { path: "/" });
    cookie.remove("carttotalitems", { path: "/" });
    cookie.remove("cartsubtotal", { path: "/" });
    cookie.remove("cartid", { path: "/" });

    /* Delivery avilablity */
    cookie.remove("DeliveryDate", { path: "/" });
    cookie.remove("DeliveryTime", { path: "/" });
    cookie.remove("unitNoOne", { path: "/" });
    cookie.remove("unitNoTwo", { path: "/" });

    cookie.remove("promotion_id", { path: "/" });
    cookie.remove("promotion_applied", { path: "/" });
    cookie.remove("promotion_code", { path: "/" });
    cookie.remove("promotion_delivery_charge_applied", { path: "/" });
    cookie.remove("promotion_amount", { path: "/" });
    cookie.remove("promotion_category", { path: "/" });
    cookie.remove("prmo_type", { path: "/" });

    /*Remove voucher*/
    cookie.remove("voucher_applied", { path: "/" });
    cookie.remove("voucher_code", { path: "/" });
    cookie.remove("voucher_amount", { path: "/" });

    cookie.remove("cateringPay", { path: "/" });
    cookie.remove("orderIdTxt", { path: "/" });
    cookie.remove("paymentIdTxt", { path: "/" });

    cookie.remove("reservation_date", { path: "/" });
    cookie.remove("reservation_show_date", { path: "/" });
    cookie.remove("reservation_show_time", { path: "/" });
    cookie.remove("reservation_time", { path: "/" });
    cookie.remove("reservation_time_type", { path: "/" });
    cookie.remove("reservation_adult", { path: "/" });
    cookie.remove("reservation_child", { path: "/" });
    cookie.remove("reservation_outlet_id", { path: "/" });
    cookie.remove("reservation_outlet_name", { path: "/" });
    cookie.remove("reservation_selected_outlet", { path: "/" });
    cookie.remove("reservation_notes", { path: "/" });
    cookie.remove("reservation_date_array", { path: "/" });
    cookie.remove("reservation_time_flag_next", { path: "/" });
    cookie.remove("reservation_time_flag", { path: "/" });
    cookie.remove("reservation_date_flag_keySet", { path: "/" });
    cookie.remove("reservation_date_flag_dateSet", { path: "/" });

    this.props.history.push("/");
  }

  render() {
    return <h1 className="loading-text">Logging out...</h1>;
  }
}

export default Logout;
