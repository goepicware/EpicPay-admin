/* eslint-disable */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Select from "react-select";
import cookie from "react-cookies";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import moment from "moment";
import {
  apiUrl,
  adminlimit,
  clientheaderconfig,
  pickupId,
} from "../../Helpers/Config";
import { GET_LISTDATA } from "../../../actions";
import {
  showPriceValue,
  showDateTime,
  encodeValue,
} from "../../Helpers/SettingHelper";
import Header from "../Layout/Header";
import Topmenu from "../Layout/Topmenu";
import Footer from "../Layout/Footer";
import Pagenation from "../Layout/Pagenation";
var module = "clientpanel/report/";
var base64 = require("base-64");
var qs = require("qs");
class List extends Component {
  constructor(props) {
    super(props);
    var companyID = cookie.load("companyID");
    var orderType = "c";
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
        }
      }
    }

    this.state = {
      moduleName: "Reports",
      companyID: companyID,
      path: this.props.match.path,
      orderType: orderType,
      order_type: order_type,
      totalRecords: 0,
      totalPage: 0,
      currentPage: 1,
      listdata: [],
      orderOutletList: [],
      listsearchdata: [],
      loading: false,
      outletList: [],
      availabiltyList: [],
      statusList: [],
      order_number: "",
      start_date: "",
      end_date: "",
      order_availability: "",
      order_status: "",
      order_outlet: "",
      exportUrl: "",
    };
    this.handleChangeText = this.handleChangeText.bind(this);
  }
  componentDidMount() {
    this.loadOutlet();
    this.loadAvailabilty();
    this.loadStatusList();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.listsearchdata !== this.state.listdata) {
      this.setState({
        listdata: nextProps.listdata,
        listsearchdata: nextProps.listdata,
        loading: false,
        totalRecords: nextProps.totalRecords,
        totalPage: nextProps.totalPages,
      });
    }
  }
  loadOutlet() {
    var urlShringTxt =
      apiUrl +
      "clientpanel/outlets/dropdownlist?company_id=" +
      this.state.companyID;
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        var orderOutletList = [];
        if (res.data.result.length > 0) {
          res.data.result.map((item) => {
            orderOutletList[item.value] = item.label;
          });
        }
        this.setState({
          outletList: res.data.result,
          orderOutletList: orderOutletList,
        });
      }
    });
  }
  loadAvailabilty() {
    var urlShringTxt = apiUrl + "company/settings/availabilty_list";

    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "success") {
        this.setState({ availabiltyList: res.data.result });
      }
    });
  }
  loadStatusList() {
    var urlShringTxt = apiUrl + "clientpanel/orders/loadstatus";
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ statusList: res.data.result }, function () {});
      }
    });
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
  searchList() {
    this.setState({ loading: true }, function () {
      this.loadList(1);
    });
  }
  loadList(offset) {
    var addParams = "";
    if (this.state.order_number !== "") {
      addParams += "&order_number=" + this.state.order_number;
    }

    if (
      this.state.order_availability !== null &&
      Object.keys(this.state.order_availability).length > 0
    ) {
      addParams += "&order_availability=" + this.state.order_availability.value;
    }
    if (
      this.state.order_status !== null &&
      Object.keys(this.state.order_status).length > 0
    ) {
      addParams += "&order_status=" + this.state.order_status.value;
    }
    if (
      this.state.order_outlet !== null &&
      Object.keys(this.state.order_outlet).length > 0
    ) {
      addParams += "&order_outlet=" + this.state.order_outlet.value;
    }

    if (this.state.start_date !== "" && this.state.end_date !== "") {
      addParams +=
        "&from_date=" +
        moment(this.state.start_date).format("Y-MM-DD HH:mm:ss") +
        "&to_date=" +
        moment(this.state.end_date).format("Y-MM-DD HH:mm:ss");
    } else if (this.state.start_date !== "" && this.state.end_date !== "") {
      addParams +=
        "&from_date=" +
        moment(this.state.start_date).format("Y-MM-DD HH:mm:ss");
    }
    var params = {
      params:
        "limit=" +
        adminlimit +
        "&offset=" +
        offset +
        "&company_id=" +
        this.state.companyID +
        addParams,
      url: apiUrl + module + "list",
      authType: "client",
    };
    var exportUrl =
      apiUrl +
      "clientpanel/report/export?company_id=" +
      this.state.companyID +
      addParams;
    this.setState({ exportUrl: exportUrl });
    this.props.getListData(params);
  }
  handleSelectChange(name, value) {
    this.setState({ [name]: value });
  }
  handleChangeDate(name, value) {
    this.setState({ [name]: value });
  }
  handleChangeText(event) {
    var name = event.target.name;
    var value = event.target.value;
    this.setState({ [name]: value });
  }
  resetSearch() {
    this.setState(
      {
        loading: true,
        listdata: [],
        order_number: "",
        start_date: "",
        end_date: "",
        order_availability: "",
        order_status: "",
        order_outlet: "",
        totalRecords: 0,
        totalPage: 0,
      },
      function () {
        this.loadList(1);
      }
    );
  }

  render() {
    var exportParams = "";

    return (
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <Header {...this.props} currentPage={"order-reports"} />
          <div className="layout-page">
            <Topmenu />

            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row mb-3">
                  <div className="col-lg-10 col-md-6">
                    <h4 className="fw-bold">{this.state.moduleName}</h4>
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-2">
                    <div className="form-floating form-floating-outline mb-4">
                      <input
                        type="text"
                        className="form-control"
                        name="order_number"
                        onChange={this.handleChangeText}
                        value={this.state.order_number}
                      />
                      <label htmlFor="outlet_pos_id">Order Number</label>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="form-floating form-floating-outline">
                      <Select
                        placeholder={"Select Availability"}
                        isClearable={true}
                        value={this.state.order_availability}
                        options={this.state.availabiltyList.map((item) => {
                          return {
                            value: item.av_id,
                            label: item.av_name,
                          };
                        })}
                        onChange={this.handleSelectChange.bind(
                          this,
                          "order_availability"
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-floating form-floating-outline mb-4">
                      <DatePicker
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        showTimeSelect
                        dropdownMode="select"
                        className="form-control"
                        selected={this.state.start_date}
                        dateFormat="d-MM-yyyy h:mm aa"
                        placeholderText="Start Date"
                        onChange={this.handleChangeDate.bind(
                          this,
                          "start_date"
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-floating form-floating-outline mb-4">
                      <DatePicker
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        showTimeSelect
                        dropdownMode="select"
                        className="form-control"
                        selected={this.state.end_date}
                        minDate={
                          this.state.start_date !== ""
                            ? this.state.start_date
                            : ""
                        }
                        dateFormat="d-MM-yyyy h:mm aa"
                        placeholderText="Start Date"
                        onChange={this.handleChangeDate.bind(this, "end_date")}
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="form-floating form-floating-outline">
                      <Select
                        placeholder={"Select Order Status"}
                        value={this.state.order_status}
                        options={this.state.statusList}
                        onChange={this.handleSelectChange.bind(
                          this,
                          "order_status"
                        )}
                        isClearable={true}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-floating form-floating-outline">
                      <Select
                        placeholder={"Select Outlet"}
                        value={this.state.order_outlet}
                        options={this.state.outletList}
                        onChange={this.handleSelectChange.bind(
                          this,
                          "order_outlet"
                        )}
                        isClearable={true}
                      />
                    </div>
                  </div>
                  <div className="col-md-1 mt-2">
                    <button
                      type="button"
                      className="btn btn-primary me-sm-3 me-1 waves-effect waves-light"
                      onClick={this.searchList.bind(this)}
                    >
                      Search
                    </button>
                  </div>
                  &nbsp;
                  <div className="col-md-1 mt-2">
                    <button
                      type="reset"
                      className="btn btn-label-secondary waves-effect"
                      onClick={this.resetSearch.bind(this)}
                    >
                      Reset
                    </button>
                  </div>
                  {this.state.listdata.length > 0 &&
                    this.state.exportUrl !== "" && (
                      <div className="col-md-1 mt-2">
                        <a href={this.state.exportUrl} target="_blank">
                          <button
                            type="button"
                            className="btn btn-info waves-effect waves-light"
                          >
                            Export
                          </button>
                        </a>
                      </div>
                    )}
                </div>

                <a
                  href={void 0}
                  className="hidden"
                  data-bs-toggle="modal"
                  data-bs-target="#modalCenter"
                  id="openmodel"
                >
                  Launch modal
                </a>
                <a
                  href={void 0}
                  className="hidden"
                  data-bs-toggle="modal"
                  data-bs-target="#orderdatetime"
                  id="opentimeslotmodel"
                >
                  Launch modal
                </a>

                <div className="card">
                  <div className="table-responsive text-nowrap p-1 mt-4">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Order Number</th>
                          <th>Fulfilment Date </th>
                          <th>Created On</th>
                          <th>Outlets</th>
                          <th>Customer Name</th>
                          <th>Order Type</th>
                          <th>Status</th>
                          <th>Sub Total</th>
                          <th>Delivery Chareg</th>
                          <th>Additional Delivery</th>
                          <th>Tax Percentage</th>
                          <th>Tax Type</th>
                          <th>Tax Amount</th>
                          <th>Service Charges</th>
                          <th>Discount</th>
                          <th>Special Discount</th>
                          <th>Grand Amount</th>
                          <th>Payment Mode</th>
                          <th>Rider</th>
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
                            var splitOutlet =
                              item.outlet_id !== "" && item.outlet_id !== null
                                ? item.outlet_id.split(",")
                                : [];
                            var displyOutlet = [];
                            if (splitOutlet.length > 0) {
                              splitOutlet.map((outletItem) => {
                                if (
                                  this.state.orderOutletList[outletItem] !==
                                    "" &&
                                  typeof this.state.orderOutletList[
                                    outletItem
                                  ] !== undefined &&
                                  typeof this.state.orderOutletList[
                                    outletItem
                                  ] !== "undefined"
                                ) {
                                  displyOutlet.push(
                                    this.state.orderOutletList[outletItem]
                                  );
                                }
                              });
                            }

                            return (
                              <tr key={index}>
                                <td>
                                  <strong>
                                    <Link
                                      to={
                                        "/clientpanel/order/today-order" +
                                        this.state.order_type +
                                        "/" +
                                        encodeValue(item.order_primary_id)
                                      }
                                    >
                                      {item.order_local_no}
                                    </Link>
                                  </strong>
                                </td>
                                <td>{showDateTime(item.order_date)}&nbsp;</td>
                                <td>{showDateTime(item.order_created_on)}</td>
                                <td>
                                  {displyOutlet.length > 0
                                    ? displyOutlet.join(",")
                                    : "N/A"}
                                </td>
                                <td>{item.customer_name}</td>
                                <td>{item.order_availability_name}</td>
                                <td align="center">
                                  {item.order_availability_id === pickupId &&
                                  item.order_status === "2"
                                    ? "Ready to Eat"
                                    : item.status_name}
                                </td>
                                <td>{showPriceValue(item.order_sub_total)}</td>
                                <td>
                                  {showPriceValue(item.order_delivery_charge)}
                                </td>
                                <td>
                                  {showPriceValue(
                                    item.order_additional_delivery
                                  )}
                                </td>
                                <td>{showPriceValue(item.order_tax_charge)}</td>
                                <td>
                                  {parseFloat(
                                    item.order_tax_calculate_amount_inclusive
                                  ) > 0
                                    ? "Inclusive"
                                    : "Exclusive"}
                                </td>
                                <td>
                                  {parseFloat(
                                    item.order_tax_calculate_amount_inclusive
                                  ) > 0
                                    ? showPriceValue(
                                        item.order_tax_calculate_amount_inclusive
                                      )
                                    : showPriceValue(
                                        item.order_tax_calculate_amount
                                      )}
                                </td>
                                <td>
                                  {showPriceValue(
                                    item.order_service_charge_amount
                                  )}
                                </td>
                                <td>
                                  {showPriceValue(item.order_discount_amount)}
                                </td>
                                <td>
                                  {showPriceValue(
                                    item.order_special_discount_amount
                                  )}
                                </td>
                                <td>
                                  {showPriceValue(item.order_total_amount)}
                                </td>

                                <td>{item.order_method_name}</td>
                                <td>N/A</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td className="text-center" colSpan={11}>
                              No Record Found
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
