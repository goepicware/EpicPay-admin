/* eslint-disable */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Select from "react-select";
import cookie from "react-cookies";
import axios from "axios";
import moment from "moment";
import {
  apiUrl,
  adminlimit,
  clientheaderconfig,
  deliveryId,
  pickupId,
} from "../../Helpers/Config";
import { GET_LISTDATA } from "../../../actions";
import {
  encodeValue,
  removeItem,
  showPriceValue,
  showDateTime,
  showLoader,
  hideLoader,
  showAlert,
} from "../../Helpers/SettingHelper";
import Header from "../Layout/Header";
import Topmenu from "../Layout/Topmenu";
import Footer from "../Layout/Footer";
import Pagenation from "../Layout/Pagenation";
import OrderAdvancedDatetimeSlot from "../Layout/OrderAdvancedDatetimeSlot";
var module = "clientpanel/orders/";
var base64 = require("base-64");
var qs = require("qs");
class List extends Component {
  constructor(props) {
    super(props);
    var companyID = cookie.load("companyID");
    var orderType = "c";
    var moduleName = "Current Orders";
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
        if (this.props.match.params.orderType === "today-order") {
          orderType = "c";
        } else if (this.props.match.params.orderType === "feature-order") {
          orderType = "a";
          var moduleName = "Feature Orders";
        }
      }
    }

    this.state = {
      moduleName: moduleName,
      companyID: companyID,
      path: this.props.match.path,
      orderType: orderType,
      order_type: order_type,
      totalRecords: 0,
      totalPage: 0,
      currentPage: 1,
      listdata: [],
      loading: true,
      outletList: [],
      riderList: [],
      riderID: "",
      orderIndex: "",
      orderDetails: "",
      riderError: false,

      /* For Advanced Slot */
      getDateTimeFlg: "",
      seleted_ord_date: "",
      seleted_ord_time: "",
      seleted_ord_slot: "",
      seleted_ord_slotTxt: "",
      seletedAvilablityId: "",
      order_tat_time: "",
      orderDateTime: "",
      orderSlotVal: "",
      orderSlotTxt: "",
      orderSlotStrTime: "",
      orderSlotEndTime: "",
      labelDateName: "",
      labelTimeName: "",
      change_date_remark: "",
      dateHistory: [],
      statusList: [],
      order_status: "",
      statusError: "",
      order_tracking_remarks: "",
      showorder_remarks: false,
      order_remarks: "",
      cancelRemarkError: "",
    };
  }
  componentDidMount() {
    this.loadList(1);
    this.loadRiderList();
    this.loadStatusList();
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.order_type !== nextProps.match.params.orderType) {
      var orderType = "c";
      var moduleName = "Current Orders";
      if (nextProps.match.params.orderType === "today-order") {
        orderType = "c";
      } else if (nextProps.match.params.orderType === "feature-order") {
        orderType = "a";
        var moduleName = "Feature Orders";
      }
      this.setState(
        {
          order_type: nextProps.match.params.orderType,
          orderType: orderType,
          moduleName: moduleName,
          path: nextProps.match.path,
          loading: true,
        },
        function () {
          this.loadList(1);
        }
      );
    }
    if (nextProps.listdata !== this.state.listdata) {
      this.setState({
        listdata: nextProps.listdata,
        loading: false,
        totalRecords: nextProps.totalRecords,
        totalPage: nextProps.totalPages,
        outletList: nextProps.outlet,
      });
    }
  }
  sateValChange = (field, value) => {
    if (field === "page") {
      this.setState(
        {
          loading: true,
          currentPage: value,
        },
        function () {
          this.loadList(value);
        }
      );
    }
  };
  loadList(offset) {
    var params = {
      params:
        "limit=" +
        adminlimit +
        "&offset=" +
        offset +
        "&company_id=" +
        this.state.companyID +
        "&order_type=" +
        this.state.orderType,
      url: apiUrl + module + "list",
      authType: "client",
    };
    this.props.getListData(params);
  }
  removeItem(deleteID) {
    var params = { delete_id: deleteID, company_id: this.state.companyID };
    var delurl = module + "delete";
    removeItem(params, delurl, "client");
  }
  changeStatus(orderDetails, type = "") {
    if (
      orderDetails.order_status !== "5" &&
      orderDetails.order_status !== "4"
    ) {
      var rider_id = "";
      if (Object.keys(this.state.riderID).length > 0) {
        rider_id = this.state.riderID.value;
      }

      if (
        orderDetails.order_status === "3" &&
        rider_id === "" &&
        orderDetails.order_availability_id === deliveryId &&
        type === ""
      ) {
        this.setState(
          {
            orderDetails: orderDetails,
            riderError: false,
          },
          function () {
            $("#openmodel")
              .click(function () {
                this.click();
              })
              .click();
          }
        );
      } else {
        if (type !== "") {
          showLoader("change-order-status");
        } else {
          showLoader("orderstatus_" + orderDetails.order_primary_id);
        }

        var updStatus = "";
        if (type !== "") {
          updStatus = this.state.order_status.value;
        } else {
          if (orderDetails.order_status === "1") {
            updStatus = "3";
          } else if (orderDetails.order_status === "3") {
            updStatus = "2";
          } else if (orderDetails.order_status === "2") {
            updStatus = "4";
          }
        }
        if (updStatus !== "") {
          var postObject = {
            company_id: this.state.companyID,
            company_admin_id: cookie.load("clientUnquieID"),
            order_id: base64.encode(orderDetails.order_id),
            order_status: updStatus,
            order_tracking_remarks: this.state.order_tracking_remarks,
            order_remarks: this.state.order_remarks,
            directChange: type !== "" ? "Yes" : "No",
          };
          if (rider_id !== "") {
            postObject["rider_id"] = rider_id;
          }

          axios
            .post(
              apiUrl + "clientpanel/orders/changeOrderStatus",
              qs.stringify(postObject),
              clientheaderconfig
            )
            .then((res) => {
              if (type !== "") {
                hideLoader("change-order-status");
              } else {
                hideLoader("orderstatus_" + orderDetails.order_primary_id);
              }
              if (res.data.status === "success") {
                this.updateOrderList();
              }
              if (type !== "") {
                $("#orderchangestatusmodel").modal("toggle");
                showAlert("Success", res.data.msg, "success", "No");
              } else {
                if (Object.keys(this.state.riderID).length > 0) {
                  this.setState({ riderID: "" }, function () {
                    $(function () {
                      $("#modalCenter").modal("toggle");
                    });
                  });
                }
              }
            });
        }
      }
    }
  }
  changePopupStatus(orderDetails) {
    this.setState(
      {
        orderDetails: orderDetails,
        order_status: "",
        statusError: "",
        order_tracking_remarks: "",
        showorder_remarks: false,
        order_remarks: "",
        cancelRemarkError: "",
      },
      function () {
        $("#orderchangestatus")
          .click(function () {
            this.click();
          })
          .click();
      }
    );
  }
  changeStatusConfirm() {
    var error = 0;
    if (this.state.order_status === "") {
      this.setState({ statusError: true });
      error++;
    } else {
      this.setState({ statusError: false });
      if (this.state.order_status.value === "5") {
        if (this.state.order_remarks === "") {
          error++;
          this.setState({ cancelRemarkError: true });
        } else {
          this.setState({ cancelRemarkError: false });
        }
      }
    }
    console.log(error, "errorerror");
    if (error === 0) {
      this.changeStatus(this.state.orderDetails, "popupstatus");
    }
  }

  updateOrderList() {
    this.loadList(this.state.currentPage);
  }
  loadRiderList() {
    var urlShringTxt =
      apiUrl +
      "clientpanel/rider/dropdownlist?company_id=" +
      this.state.companyID;
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ riderList: res.data.result }, function () {});
      }
    });
  }
  loadStatusList() {
    var urlShringTxt = apiUrl + module + "loadstatus";
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ statusList: res.data.result }, function () {});
      }
    });
  }

  handleSelectChange(name, value) {
    console.log(name, value, "valuevalue");
    this.setState({ [name]: value, riderError: false }, function () {
      if (name === "order_status") {
        this.setState({ statusError: false });
        if (value.value === "5") {
          this.setState({ showorder_remarks: true });
        } else {
          this.setState({ showorder_remarks: false });
        }
      }
    });
  }
  assingRider() {
    if (Object.keys(this.state.riderID).length > 0) {
      this.setState({ riderError: false }, function () {
        this.changeStatus(this.state.orderDetails);
      });
    } else {
      this.setState({ riderError: true });
    }
  }

  setdateTimeFlg = (field, value) => {
    if (field == "tmflg") {
      this.setState({ getDateTimeFlg: value });
    } else if (field == "ordDate") {
      var ordTime = "";
      $(".ordrdatetime_error").html("");
      console.log(value, field, "valuevaluevalue");
      this.setState({
        seleted_ord_date: value,
        seleted_ord_time: ordTime,
        seleted_ord_slot: ordTime,
        seleted_ord_slotTxt: ordTime,
        orderSlotStrTime: ordTime,
        orderSlotEndTime: ordTime,
      });
    } else if (field == "ordTime") {
      var tmSltArr = value;
      console.log(tmSltArr, "tmSltArrtmSltArr");
      var ordTime = "";
      $(".ordrdatetime_error").html("");
      this.setState({
        seleted_ord_time: tmSltArr["startTime"],
        seleted_ord_slot: ordTime,
        seleted_ord_slotTxt: ordTime,
        orderSlotStrTime: ordTime,
        orderSlotEndTime: ordTime,
      });
    } else if (field == "ordSlotDate") {
      var ordTime = "";
      $(".ordrdatetime_error").html("");
      console.log(value, field, "ordSlotDate");
      this.setState({
        seleted_ord_date: value,
        seleted_ord_time: ordTime,
        seleted_ord_slot: ordTime,
        seleted_ord_slotTxt: ordTime,
        orderSlotStrTime: ordTime,
        orderSlotEndTime: ordTime,
      });
    } else if (field == "ordSlotTime") {
      var tmSltArr = value;
      console.log(tmSltArr, "tmSltArr");
      $(".ordrdatetime_error").html("");
      this.setState({
        seleted_ord_time: tmSltArr["startTime"],
        seleted_ord_slot: tmSltArr["ordSlotVal"],
        seleted_ord_slotTxt: tmSltArr["ordSlotLbl"],
        orderSlotStrTime: tmSltArr["ordSlotStr"],
        orderSlotEndTime: tmSltArr["ordSlotEnd"],
      });
    }
  };

  opentimeslotmodel(orderDetails) {
    console.log(orderDetails, "orderDetails");
    var order_date = orderDetails.order_date;
    var datetz = moment(order_date).format("Y-MM-DDTHH:mm:ssZ");
    var deliveryTime = moment(order_date).format("HH:mm:ss");
    var orderSlotVal = "";
    var orderSlotTxt = "";
    var orderSlotStrTime = "";
    var orderSlotEndTime = "";
    if (orderDetails.order_is_timeslot === "Yes") {
      var slot_from = orderDetails.order_pickup_time_slot_from;
      var slot_to = orderDetails.order_pickup_time_slot_to;
      var from_time = moment(
        new Date(moment(order_date).format("Y-MM-DD") + " " + slot_from)
      ).format("hh:mm A");
      var to_time = moment(
        new Date(moment(order_date).format("Y-MM-DD") + " " + slot_to)
      ).format("hh:mm A");
      var from_time1 = moment(
        new Date(moment(order_date).format("Y-MM-DD") + " " + slot_from)
      ).format("h:mm A");
      var to_time1 = moment(
        new Date(moment(order_date).format("Y-MM-DD") + " " + slot_to)
      ).format("h:mm A");
      orderSlotVal =
        slot_from + " - " + slot_to + "/" + from_time1 + " - " + to_time1;

      orderSlotTxt = from_time + "-" + to_time;
      orderSlotStrTime = slot_from;
      orderSlotEndTime = slot_to;
    }
    this.setState(
      {
        orderDetails: orderDetails,
        orderDateTime: datetz,
        getDateTimeFlg: "yes",
        seletedAvilablityId: orderDetails.order_availability_id,
        order_tat_time: orderDetails.order_tat_time,
        deliveryTime: deliveryTime,
        orderSlotVal: orderSlotVal,
        orderSlotTxt: orderSlotTxt,
        orderSlotStrTime: orderSlotStrTime,
        orderSlotEndTime: orderSlotEndTime,
        labelDateName: orderDetails.order_availability_name + " Date",
        labelTimeName: orderDetails.order_availability_name + " Time",
        dateHistory: "",
      },
      function () {
        this.datehistory(orderDetails.order_id);
        $("#opentimeslotmodel")
          .click(function () {
            this.click();
          })
          .click();
      }
    );
  }
  changeTxt(event) {
    var name = event.target.name;
    var value = event.target.value;
    this.setState({ [name]: value });
    if (name === "order_remarks") {
      this.setState({ cancelRemarkError: false });
    }
  }
  changeTime() {
    var orderDetails = this.state.orderDetails;
    var order_date = orderDetails.order_date;
    var pickup_timing = moment(this.state.seleted_ord_date).format("Y-MM-DD");
    var timeslot = orderDetails.order_is_timeslot === "Yes" ? 1 : 0;
    var updated_time = "";
    var orderSlotEndTime = this.state.orderSlotEndTime;
    if (timeslot == 1) {
      var orderSlotStrTime =
        this.state.orderSlotStrTime !== ""
          ? this.state.orderSlotStrTime
          : orderDetails.order_pickup_time_slot_from;
      var orderSlotEndTime =
        this.state.orderSlotEndTime !== ""
          ? this.state.orderSlotEndTime
          : orderDetails.order_pickup_time_slot_to;

      updated_time = orderSlotStrTime + "-" + orderSlotEndTime;
      pickup_timing = pickup_timing + " " + orderSlotStrTime;
    } else {
      pickup_timing = pickup_timing + " " + this.state.seleted_ord_time;
    }
    var postObject = {
      company_id: this.state.companyID,
      company_admin_id: cookie.load("clientUnquieID"),
      order_id: base64.encode(orderDetails.order_id),
      order_date: order_date,
      slotEnable: timeslot,
      old_slot_from:
        timeslot === 1 ? orderDetails.order_pickup_time_slot_from : "",
      old_slot_to: timeslot === 1 ? orderDetails.order_pickup_time_slot_to : "",
      slot_from: timeslot === 1 ? orderSlotStrTime : "",
      slot_to: timeslot === 1 ? orderSlotEndTime : "",
      pickup_timing: pickup_timing,
      change_date_remark: this.state.change_date_remark,
    };
    showLoader("change-time", "class");
    axios
      .post(
        apiUrl + "clientpanel/orders/updateorderdate",
        qs.stringify(postObject),
        clientheaderconfig
      )
      .then((res) => {
        hideLoader("change-time", "class");
        if (res.data.status === "ok") {
          this.updateOrderList();
          this.datehistory(orderDetails.order_id);
          this.setState(
            {
              orderDetails: "",
              getDateTimeFlg: "",
              seleted_ord_date: "",
              seleted_ord_time: "",
              seleted_ord_slot: "",
              seleted_ord_slotTxt: "",
              seletedAvilablityId: "",
              order_tat_time: "",
              orderDateTime: "",
              orderSlotVal: "",
              orderSlotTxt: "",
              orderSlotStrTime: "",
              orderSlotEndTime: "",
              labelDateName: "",
              labelTimeName: "",
              change_date_remark: "",
            },
            function () {
              $(function () {
                $("#orderdatetime").modal("toggle");
                showAlert("Success", res.data.msg, "success", "No");
              });
            }
          );
        }
      });
  }
  datehistory(orderID) {
    var urlShringTxt =
      apiUrl +
      module +
      "datehistory?company_id=" +
      this.state.companyID +
      "&order_id=" +
      base64.encode(orderID);
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ dateHistory: res.data.orderdatehistory });
      }
    });
  }

  render() {
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
                    <h4 className="fw-bold">{this.state.moduleName}</h4>
                  </div>
                  <div className="col-lg-2 col-md-6 text-end">
                    <Link to={this.state.path + "add"}>
                      <button
                        type="button"
                        className="btn btn-outline-primary waves-effect"
                      >
                        Add New
                      </button>
                    </Link>
                  </div>
                </div>

                <a
                  href={void 0}
                  className="hidden"
                  data-bs-toggle="modal"
                  data-bs-target="#modalCenter"
                  id="openmodel"
                >
                  Load
                </a>
                <a
                  href={void 0}
                  className="hidden"
                  data-bs-toggle="modal"
                  data-bs-target="#orderdatetime"
                  id="opentimeslotmodel"
                >
                  Load
                </a>
                <a
                  href={void 0}
                  className="hidden"
                  data-bs-toggle="modal"
                  data-bs-target="#orderchangestatusmodel"
                  id="orderchangestatus"
                >
                  Load
                </a>

                <div className="card">
                  <div className="table-responsive text-nowrap p-1 mt-4">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Order Number</th>
                          <th>Fulfilment Date </th>
                          <th>Customer Name</th>
                          <th>Order Type</th>
                          <th>
                            <span className="align-items-center">Status</span>
                          </th>
                          <th>Amount</th>
                          <th>Outlets</th>
                          <th>Payment Mode</th>
                          <th>Rider</th>
                          <th>Created On</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.loading === true ? (
                          <tr>
                            <td colSpan={11} align="center">
                              <div
                                className="spinner-border spinner-border-lg text-primary"
                                role="status"
                              >
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </div>
                            </td>
                          </tr>
                        ) : this.state.listdata.length > 0 ? (
                          this.state.listdata.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  <strong>{item.order_local_no}</strong>
                                </td>
                                <td>
                                  {showDateTime(item.order_date)}&nbsp;
                                  <a
                                    href={void 0}
                                    onClick={this.opentimeslotmodel.bind(
                                      this,
                                      item
                                    )}
                                  >
                                    <span className="mdi mdi-wrench-clock mdi-24px"></span>
                                  </a>
                                </td>
                                <td>{item.customer_name}</td>
                                <td>{item.order_availability_name}</td>
                                <td align="center">
                                  <button
                                    id={"orderstatus_" + item.order_primary_id}
                                    type="button"
                                    onClick={this.changeStatus.bind(this, item)}
                                    className={
                                      "btn rounded-pill waves-effect btn-label-" +
                                      (() => {
                                        if (item.order_status === "1") {
                                          return "primary";
                                        } else if (item.order_status === "2") {
                                          return "warning";
                                        } else if (item.order_status === "3") {
                                          return "info";
                                        } else if (item.order_status === "4") {
                                          return "success";
                                        } else if (item.order_status === "5") {
                                          return "danger";
                                        }
                                      })()
                                    }
                                  >
                                    {item.order_availability_id === pickupId &&
                                    item.order_status === "2"
                                      ? "Ready to Eat"
                                      : item.status_name}
                                  </button>
                                </td>
                                <td>
                                  {showPriceValue(item.order_total_amount)}
                                </td>
                                <td>{item.outlet_id}</td>
                                <td>{item.order_method_name}</td>

                                <td>N/A</td>
                                <td>{showDateTime(item.order_created_on)}</td>
                                <td>
                                  <div className="dropdown">
                                    <button
                                      type="button"
                                      className="btn p-0 dropdown-toggle hide-arrow"
                                      data-bs-toggle="dropdown"
                                    >
                                      <i className="mdi mdi-dots-horizontal"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                      <Link
                                        to={
                                          "/clientpanel/order/" +
                                          this.state.order_type +
                                          "/" +
                                          encodeValue(item.order_primary_id)
                                        }
                                        className="dropdown-item"
                                      >
                                        <i className="mdi mdi-eye-outline me-1"></i>
                                        View
                                      </Link>
                                      <a
                                        className="dropdown-item"
                                        href={void 0}
                                        onClick={this.changePopupStatus.bind(
                                          this,
                                          item
                                        )}
                                      >
                                        <span className="mdi mdi-reload me-1"></span>
                                        Change Status
                                      </a>
                                      <a
                                        className="dropdown-item"
                                        href={void 0}
                                      >
                                        <i className="mdi mdi-file-pdf-box me-1"></i>
                                        View Invoice
                                      </a>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td className="text-center" colSpan={11}>
                              No Outlet Found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <Pagenation
                    params={{
                      totalRecords: this.state.totalRecords,
                      totalPage: this.state.totalPage,
                      currentPage: this.state.currentPage,
                    }}
                    sateValChange={this.sateValChange}
                  />
                </div>
              </div>

              <Footer />
            </div>
          </div>
        </div>

        <div className="layout-overlay layout-menu-toggle"></div>
        <div className="drag-target"></div>
        <div
          className="modal fade"
          id="modalCenter"
          aria-hidden="true"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title" id="modalCenterTitle">
                  Assign Rider
                </h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className=" mb-4">
                  <div className="card-header">
                    <div className="nav-align-top">
                      <ul className="nav nav-tabs" role="tablist">
                        <li className="nav-item">
                          <button
                            type="button"
                            className="nav-link active"
                            role="tab"
                            data-bs-toggle="tab"
                            data-bs-target="#navs-own-rider"
                            aria-controls="navs-own-rider"
                            aria-selected="true"
                          >
                            Own Rider
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="card-body mt-3">
                    <div className="tab-content p-0">
                      <div
                        className="tab-pane fade show active"
                        id="navs-own-rider"
                        role="tabpanel"
                      >
                        <h6 className="text-muted">Own Rider</h6>
                        <div className="form-floating form-floating-outline custm-select-box">
                          <Select
                            value={this.state.riderID}
                            onChange={this.handleSelectChange.bind(
                              this,
                              "riderID"
                            )}
                            placeholder="Select Rider *"
                            options={this.state.riderList}
                          />
                          {this.state.riderError === true && (
                            <span className="validate-error">
                              Please Select Rider
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-label-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.assingRider.bind(this)}
                >
                  Assign Rider
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="orderdatetime"
          aria-hidden="true"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Change Order Time</h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className=" mb-4">
                  <div className="card-header">
                    <div className="nav-align-top">
                      <ul className="nav nav-tabs" role="tablist">
                        <li className="nav-item">
                          <button
                            type="button"
                            className="nav-link active"
                            role="tab"
                            data-bs-toggle="tab"
                            data-bs-target="#navs-change-date"
                            aria-controls="navs-change-date"
                            aria-selected="true"
                          >
                            Order Date
                          </button>
                        </li>
                        <li className="nav-item">
                          <button
                            type="button"
                            className="nav-link"
                            role="tab"
                            data-bs-toggle="tab"
                            data-bs-target="#navs-date-history"
                            aria-controls="navs-date-history"
                            aria-selected="false"
                          >
                            Order Date History
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="card-body mt-3">
                    <div className="tab-content p-0">
                      <div
                        className="tab-pane fade show active"
                        id="navs-change-date"
                        role="tabpanel"
                      >
                        <OrderAdvancedDatetimeSlot
                          {...this.props}
                          hdrState={this.state}
                          setdateTimeFlg={this.setdateTimeFlg}
                          indutualText={true}
                          labelDateName={this.state.labelDateName}
                          labelTimeName={this.state.labelTimeName}
                        />
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-floating form-floating-outline mt-4">
                              <textarea
                                className="form-control h-px-100"
                                id="change_date_remark"
                                name="change_date_remark"
                                placeholder="Comments here..."
                                value={this.state.change_date_remark}
                                onChange={this.changeTxt.bind(this)}
                              ></textarea>
                              <label htmlFor="change_date_remark">Reason</label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="navs-date-history"
                        role="tabpanel"
                      >
                        <div className="table-responsive text-nowrap p-1 mt-4">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Old Date & Time</th>
                                <th>New Date & Time</th>
                                <th>Reason</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.dateHistory.length > 0 ? (
                                this.state.dateHistory.map((item, index) => {
                                  var olddate =
                                    item.ohd_from_date !== "" &&
                                    item.ohd_from_date !== null &&
                                    item.ohd_from_date !== "0000-00-00 00:00:00"
                                      ? new Date(item.ohd_from_date)
                                      : "";
                                  var newdate =
                                    item.ohd_to_date !== "" &&
                                    item.ohd_to_date !== null &&
                                    item.ohd_to_date !== "0000-00-00 00:00:00"
                                      ? new Date(item.ohd_to_date)
                                      : "";
                                  var ohd_old_from_slot =
                                    item.ohd_old_from_slot !== "" &&
                                    item.ohd_old_from_slot !== null &&
                                    item.ohd_old_from_slot !== "00:00:00"
                                      ? item.ohd_old_from_slot
                                      : "";
                                  var ohd_new_from_slot =
                                    item.ohd_new_from_slot !== "" &&
                                    item.ohd_new_from_slot !== null &&
                                    item.ohd_new_from_slot !== "00:00:00"
                                      ? item.ohd_new_from_slot
                                      : "";
                                  var ohd_old_to_slot =
                                    item.ohd_old_to_slot !== "" &&
                                    item.ohd_old_to_slot !== null &&
                                    item.ohd_old_to_slot !== "00:00:00"
                                      ? item.ohd_old_to_slot
                                      : "";
                                  var ohd_new_to_slot =
                                    item.ohd_new_to_slot !== "" &&
                                    item.ohd_new_to_slot !== null &&
                                    item.ohd_new_to_slot !== "00:00:00"
                                      ? item.ohd_new_to_slot
                                      : "";
                                  var existDate = "";
                                  if (
                                    ohd_old_from_slot !== "" &&
                                    ohd_old_to_slot !== ""
                                  ) {
                                    var fromTime = new Date(
                                      moment(olddate).format("Y-MM-DD") +
                                        " " +
                                        ohd_old_from_slot
                                    );
                                    var toTime = new Date(
                                      moment(olddate).format("Y-MM-DD") +
                                        " " +
                                        ohd_old_to_slot
                                    );
                                    existDate =
                                      moment(olddate).format("Y-MM-DD") +
                                      " " +
                                      moment(fromTime).format("hh:mm A") +
                                      " - " +
                                      moment(toTime).format("hh:mm A");
                                  } else {
                                    existDate = new Date(
                                      moment(olddate).format("Y-MM-DD hh:mm A")
                                    );
                                  }

                                  var newDate = "";
                                  if (
                                    ohd_new_from_slot !== "" &&
                                    ohd_new_to_slot !== ""
                                  ) {
                                    var fromTime = new Date(
                                      moment(newdate).format("Y-MM-DD") +
                                        " " +
                                        ohd_new_from_slot
                                    );
                                    var toTime = new Date(
                                      moment(newdate).format("Y-MM-DD") +
                                        " " +
                                        ohd_new_to_slot
                                    );
                                    newDate =
                                      moment(newdate).format("Y-MM-DD") +
                                      " " +
                                      moment(fromTime).format("hh:mm A") +
                                      " - " +
                                      moment(toTime).format("hh:mm A");
                                  } else {
                                    newDate = new Date(
                                      moment(newdate).format("Y-MM-DD hh:mm A")
                                    );
                                  }

                                  return (
                                    <tr key={index}>
                                      <td>{existDate}</td>
                                      <td>{newDate}</td>
                                      <td>{item.ohd_remark}</td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  <td colSpan={3} className="text-center">
                                    No Record Found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-label-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary change-time"
                  onClick={this.changeTime.bind(this)}
                >
                  Change Time
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="orderchangestatusmodel"
          aria-hidden="true"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Change Order Status</h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className=" mb-4">
                  <div className="form-floating form-floating-outline custm-select-box">
                    <Select
                      value={this.state.order_status}
                      onChange={this.handleSelectChange.bind(
                        this,
                        "order_status"
                      )}
                      placeholder="Select Status *"
                      options={this.state.statusList}
                    />
                    {this.state.statusError === true && (
                      <span className="validate-error">
                        Please Select Status
                      </span>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-floating form-floating-outline mt-4">
                      <textarea
                        className="form-control h-px-100"
                        id="order_tracking_remarks"
                        name="order_tracking_remarks"
                        placeholder="Comments here..."
                        value={this.state.order_tracking_remarks}
                        onChange={this.changeTxt.bind(this)}
                      ></textarea>
                      <label htmlFor="order_tracking_remarks">
                        Order tracking Remarks
                      </label>
                    </div>
                  </div>
                </div>
                {this.state.showorder_remarks === true && (
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-floating form-floating-outline mt-4">
                        <textarea
                          className="form-control h-px-100"
                          id="order_remarks"
                          name="order_remarks"
                          placeholder="Comments here..."
                          value={this.state.order_remarks}
                          onChange={this.changeTxt.bind(this)}
                        ></textarea>
                        <label htmlFor="order_remarks">Cancel Remarks</label>
                      </div>
                      {this.state.cancelRemarkError === true && (
                        <span className="validate-error">
                          Please enter cancel remarks
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-label-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  id="change-order-status"
                  onClick={this.changeStatusConfirm.bind(this)}
                >
                  Change Status
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateTopProps = (state) => {
  var listdata = Array();
  var listdataStatus = "";
  var totalPages = 0;
  var totalRecords = 0;
  if (Object.keys(state.listdata).length > 0) {
    listdataStatus = state.listdata[0].status;
    if (state.listdata[0].status === "ok") {
      listdata = state.listdata[0].result;
      totalPages = state.listdata[0].totalPages;
      totalRecords = state.listdata[0].totalRecords;
    }
  }
  return {
    listdata: listdata,
    totalPages: totalPages,
    totalRecords: totalRecords,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getListData: (datas) => {
      dispatch({ type: GET_LISTDATA, datas });
    },
  };
};

export default connect(mapStateTopProps, mapDispatchToProps)(List);
