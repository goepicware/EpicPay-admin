/* eslint-disable */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { GET_FORMPOST, GET_DETAILDATA } from "../../../actions";
import { apiUrl } from "../../Helpers/Config";
import {
  hideLoader,
  showAlert,
  CompanyID,
  showPriceValue,
  showDateTime,
  addressFormat,
} from "../../Helpers/SettingHelper";
import PageLoader from "../../Helpers/PageLoader";
import Header from "../Layout/Header";
import Topmenu from "../Layout/Topmenu";
import Footer from "../Layout/Footer";

var module = "clientpanel/orders/";
var moduleName = "Order Details";
var modulePath = "/clientpanel/order/";
class Details extends Component {
  constructor(props) {
    super(props);
    var editID = "";
    if (this.props.match.path === "/clientpanel/order/:orderType/:orderID") {
      editID = this.props.match.params.orderID;
    }
    var order_type = "";
    if (
      this.props.match.params !== "" &&
      typeof this.props.match.params !== undefined &&
      typeof this.props.match.params !== "undefined"
    ) {
      if (
        this.props.match.params.orderType !== "" &&
        typeof this.props.match.params.orderType !== undefined &&
        typeof this.props.match.params.orderType !== "undefined"
      ) {
        order_type = this.props.match.params.orderType;
      }
    }
    this.state = {
      editID: editID,
      order_type: order_type,
      order_details: [],
      pageloading: true,
    };
  }
  componentDidMount() {
    if (this.state.editID !== "") {
      var params = {
        params: "company_id=" + CompanyID() + "&detail_id=" + this.state.editID,
        url: apiUrl + module + "details",
        type: "client",
      };
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
            history.push(modulePath + this.state.order_type);
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
          this.setState({ order_details: result, pageloading: false });
        } else {
          this.setState({ pageloading: false });
          //this.props.history.push(modulePath+this.state.order_type);
          showAlert("Error", "Invalid Product", "error");
        }
      });
    }
  }
  sateValChange = (field, value) => {};

  render() {
    var order = this.state.order_details;
    return (
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <Header {...this.props} currentPage={this.state.order_type} />
          <div className="layout-page">
            <Topmenu />
            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row mb-3">
                  <div className="col-lg-10 col-md-6">
                    <h4 className="fw-bold">{moduleName}</h4>
                  </div>
                  <div className="col-lg-2 col-md-6 text-end">
                    <Link to={modulePath + this.state.order_type}>
                      <button
                        type="button"
                        className="btn btn-outline-primary waves-effect"
                      >
                        Back
                      </button>
                    </Link>
                  </div>
                </div>
                {Object.keys(this.state.order_details).length > 0 && (
                  <div className="card invoice-preview-card">
                    <ul class="list-group fw-bold">
                      <li
                        class={
                          "list-group-item text-end list-group-item-" +
                          (() => {
                            if (order.order_status === "1") {
                              return "primary";
                            } else if (order.order_status === "2") {
                              return "warning";
                            } else if (order.order_status === "3") {
                              return "info";
                            } else if (order.order_status === "4") {
                              return "success";
                            } else if (order.order_status === "5") {
                              return "danger";
                            }
                          })()
                        }
                        style={{
                          borderBottomLeftRadius: 0,
                          borderBottomRightRadius: 0,
                        }}
                      >
                        {order.status_name}
                      </li>
                    </ul>
                    <div className="card-body">
                      <div className="d-flex justify-content-between flex-xl-row flex-md-column flex-sm-row flex-column">
                        <div className="mb-xl-0 pb-3">
                          <div className="d-flex svg-illustration align-items-center gap-2 mb-4">
                            <span className="h4 mb-0 app-brand-text fw-bold">
                              {order.order_availability_name}
                            </span>
                          </div>
                          <p className="mb-1">{order.customer.customer_name}</p>
                          <p className="mb-1">
                            <a
                              href={
                                "mailto:" + order.customer.order_customer_email
                              }
                            >
                              {order.customer.order_customer_email}
                            </a>
                          </p>
                          <p className="mb-0">
                            <a
                              href={
                                "tel:" + order.customer.order_customer_email
                              }
                            >
                              {order.customer.order_customer_mobile_no}
                            </a>
                          </p>
                          <p className="mb-0">
                            <span className="fw-semibold">Order Source: </span>{" "}
                            {order.order_source}
                          </p>
                          <p className="mb-0">
                            <span className="fw-semibold">Order Status: </span>{" "}
                            {order.status_name}
                          </p>
                          <p className="mb-0">
                            <span className="fw-semibold">Cutlery: </span>{" "}
                            {order.order_cutlery}
                          </p>
                        </div>
                        <div>
                          <h5 className="fw-bold">
                            Order Number #{order.order_local_no}
                          </h5>
                          <div className="mb-1">
                            <span>{order.order_availability_name} Date: </span>
                            <span className="fw-bold">
                              {showDateTime(order.order_date)}
                            </span>
                          </div>
                          <div>
                            <span>Order Created Date: </span>
                            <span className="fw-bold">
                              {showDateTime(order.order_created_on)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr className="my-0" />
                    <div className="card-body">
                      <div className="d-flex justify-content-between flex-wrap">
                        <div className="my-3">
                          <h6 className="pb-2 fw-bold">Delivery Address:</h6>
                          <p className="mb-1">{order.customer.customer_name}</p>
                          <p className="mb-1">
                            {addressFormat(
                              order.customer.order_customer_unit_no1,
                              order.customer.order_customer_unit_no2,
                              order.customer.order_customer_address_line1,
                              order.customer.order_customer_address_line2,
                              order.customer.order_customer_postal_code,
                              order.customer.order_customer_country
                            )}
                          </p>
                        </div>
                        {order.order_availability_name === "Delivery" && (
                          <div className="my-3">
                            <h6 className="pb-2 fw-bold">Bill Address:</h6>
                            <p className="mb-1">
                              {addressFormat(
                                order.customer.order_customer_billing_unit_no1,
                                order.customer.order_customer_billing_unit_no2,
                                order.customer
                                  .order_customer_billing_address_line1,
                                order.customer
                                  .order_customer_billing_address_line2,
                                order.customer
                                  .order_customer_billing_postal_code,
                                order.customer.order_customer_country
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table className="table m-0">
                        <thead className="table-light border-top">
                          <tr>
                            <th>Item Name</th>
                            <th>Combo Details</th>
                            <th width="150" className="text-end">
                              Cost
                            </th>
                            <th width="100">Qty</th>
                            <th width="150" className="text-end">
                              Price
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.order_item.length > 0 &&
                            order.order_item.map((item, index) => {
                              return (
                                <>
                                  <tr className="table-info" key={index}>
                                    <td className="text-nowrap" colSpan={3}>
                                      {item.outlet_name}
                                    </td>

                                    <td colSpan={2} className="text-end">
                                      Status:{" "}
                                      {item.outlet_order_details.status_name}
                                    </td>
                                  </tr>
                                  {item.outlet_item.length > 0 &&
                                    item.outlet_item.map((item1, index1) => {
                                      return (
                                        <tr key={index1}>
                                          <td
                                            className="text-nowrap"
                                            valign="top"
                                          >
                                            <span className="fw-semibold">
                                              {item1.item_name}
                                            </span>
                                            {item1.item_specification !== "" &&
                                              item1.item_specification !==
                                                null && (
                                                <i>
                                                  <br />
                                                  {item1.item_specification}
                                                </i>
                                              )}
                                          </td>
                                          <td className="text-nowrap">
                                            {item1.combo_set.length > 0 && (
                                              <ul className="list-unstyled">
                                                {item1.combo_set.map(
                                                  (comob, comboIndex) => {
                                                    return (
                                                      <li
                                                        className="mb-3"
                                                        key={comboIndex}
                                                      >
                                                        <i className="mdi mdi-chevron-right scaleX-n1-rtl text-muted me-1"></i>
                                                        <span className="fw-semibold">
                                                          {comob.component_name}
                                                        </span>
                                                        {comob.component_item
                                                          .length > 0 && (
                                                          <ul className="list-unstyled mx-4">
                                                            {comob.component_item.map(
                                                              (
                                                                comobItem,
                                                                comobItemIndex
                                                              ) => {
                                                                return (
                                                                  <li
                                                                    key={
                                                                      comobItemIndex
                                                                    }
                                                                  >
                                                                    <i className="mdi mdi-chevron-right scaleX-n1-rtl text-muted me-1"></i>
                                                                    {
                                                                      comobItem.menu_product_name
                                                                    }{" "}
                                                                    X{" "}
                                                                    {
                                                                      comobItem.menu_product_qty
                                                                    }
                                                                    {parseFloat(
                                                                      comobItem.menu_product_price
                                                                    ) > 0
                                                                      ? "(" +
                                                                        showPriceValue(
                                                                          comobItem.menu_product_price
                                                                        ) +
                                                                        ")"
                                                                      : ""}
                                                                  </li>
                                                                );
                                                              }
                                                            )}
                                                          </ul>
                                                        )}
                                                      </li>
                                                    );
                                                  }
                                                )}
                                              </ul>
                                            )}
                                          </td>
                                          <td className="text-end" valign="top">
                                            {showPriceValue(
                                              item1.item_unit_price
                                            )}
                                          </td>
                                          <td valign="top">{item1.item_qty}</td>
                                          <td className="text-end" valign="top">
                                            {showPriceValue(
                                              item1.item_total_amount
                                            )}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  <tr
                                    className="table-primary"
                                    key={index + "_1"}
                                  >
                                    <td
                                      className="text-nowrap"
                                      colSpan={3}
                                    ></td>

                                    <td colSpan={2} className="text-end">
                                      <span className="fw-semibold">
                                        Outlet Total:
                                      </span>{" "}
                                      {showPriceValue(
                                        item.outlet_order_details
                                          .outlet_grand_total_amount
                                      )}
                                    </td>
                                  </tr>
                                </>
                              );
                            })}

                          <tr>
                            <td colSpan="2" className="align-top px-4 py-5">
                              <p className="mb-2">
                                <span className="me-1 fw-semibold">
                                  Payment Method:
                                </span>
                                <span>{order.order_method_name}</span>
                              </p>
                              {order.order_payment_mode !== "1" && (
                                <>
                                  <p className="mb-2">
                                    <span className="me-1 fw-semibold">
                                      Payment Gateway:
                                    </span>
                                    <span>
                                      {order.order_payment_getway_type.toUpperCase()}
                                    </span>
                                  </p>
                                  <p className="mb-2">
                                    <span className="me-1 fw-semibold">
                                      Payment Status:
                                    </span>
                                    <span>
                                      {order.order_payment_getway_status.toUpperCase()}
                                    </span>
                                  </p>
                                </>
                              )}
                            </td>
                            <td colSpan="2" className="text-end px-4 py-5">
                              {parseFloat(order.order_sub_total) > 0 && (
                                <p className="mb-2">Subtotal:</p>
                              )}
                              {parseFloat(order.order_delivery_charge) > 0 && (
                                <p className="mb-2">Delivery Charge:</p>
                              )}
                              {parseFloat(order.order_additional_delivery) >
                                0 && (
                                <p className="mb-2">
                                  Additional Delivery Charge:
                                </p>
                              )}
                              {parseFloat(order.order_additional_delivery) >
                                0 && (
                                <p className="mb-2">
                                  Additional Delivery Charge:
                                </p>
                              )}
                              {parseFloat(order.order_service_charge) > 0 && (
                                <p className="mb-2">
                                  {order.order_servicecharge_displaylabel !==
                                    "" &&
                                  order.order_servicecharge_displaylabel !==
                                    null
                                    ? order.order_servicecharge_displaylabel
                                    : "Service Charge"}
                                </p>
                              )}
                              {(parseFloat(order.order_tax_charge) > 0 ||
                                parseFloat(
                                  order.order_tax_calculate_amount_inclusive
                                ) > 0) && (
                                <p className="mb-2">
                                  {parseFloat(
                                    order.order_tax_calculate_amount_inclusive
                                  ) > 0
                                    ? "Inclusive Tax "
                                    : "Tax"}
                                  ({order.order_service_charge}%):
                                </p>
                              )}
                              {order.order_discount_applied === "Yes" &&
                                parseFloat(order.order_discount_amount) >
                                  0(<p className="mb-2">Discount:</p>)}

                              <p className="mb-0">Total:</p>
                            </td>
                            <td className="px-4 py-5">
                              {parseFloat(order.order_sub_total) > 0 && (
                                <p className="fw-semibold mb-2 text-end">
                                  {showPriceValue(order.order_sub_total)}
                                </p>
                              )}{" "}
                              {parseFloat(order.order_delivery_charge) > 0 && (
                                <p className="fw-semibold mb-2 text-end">
                                  {showPriceValue(order.order_delivery_charge)}
                                </p>
                              )}
                              {parseFloat(order.order_additional_delivery) >
                                0 && (
                                <p className="fw-semibold mb-2 text-end">
                                  {showPriceValue(
                                    order.order_additional_delivery
                                  )}
                                </p>
                              )}
                              {parseFloat(order.order_service_charge) > 0 && (
                                <p className="fw-semibold mb-2 text-end">
                                  {showPriceValue(order.order_service_charge)}
                                </p>
                              )}
                              {(parseFloat(order.order_tax_charge) > 0 ||
                                parseFloat(
                                  order.order_tax_calculate_amount_inclusive
                                )) > 0 && (
                                <p className="fw-semibold mb-0 text-end">
                                  {parseFloat(
                                    order.order_tax_calculate_amount_inclusive
                                  ) > 0
                                    ? showPriceValue(
                                        order.order_tax_calculate_amount_inclusive
                                      )
                                    : showPriceValue(order.order_tax_charge)}
                                </p>
                              )}
                              {order.order_discount_applied === "Yes" &&
                                parseFloat(order.order_discount_amount) >
                                  0(
                                    <p className="fw-semibold mb-0 text-end">
                                      {showPriceValue(
                                        order.order_discount_amount
                                      )}
                                    </p>
                                  )}
                              <p className="fw-semibold mb-0 text-end">
                                {showPriceValue(order.order_total_amount)}
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="card-body">
                      <div className="row">
                        <div className="col-12"></div>
                      </div>
                    </div>
                  </div>
                )}
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

export default connect(mapStateTopProps, mapDispatchToProps)(Details);
