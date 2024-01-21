/* eslint-disable */
import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Select from "react-select";
import update from "immutability-helper";
import { validated } from "react-custom-validation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  isNumber,
  isSingleSelect,
} from "../../Helpers/SettingHelper";
import Header from "../Layout/Header";
import Topmenu from "../Layout/Topmenu";
import Footer from "../Layout/Footer";
import PageLoader from "../../Helpers/PageLoader";

var dayList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

var module = "clientpanel/timeslot/";
var moduleName = "Sub Categories";
var modulePath = "/clientpanel/timeslot";
class Form extends Component {
  constructor(props) {
    super(props);
    var editID = "";
    if (this.props.match.path === "/clientpanel/timeslot/edit/:EditID") {
      editID = this.props.match.params.EditID;
    }
    this.state = {
      editID: editID,
      pageloading: false,
      clientdata: {
        assign_outlet: "",
        assign_availability: "",
        slot_type: "",
        timeslot: [
          {
            day: "",
            from: "",
            to: "",
            order_count: "",
            order_count_type: "",
          },
        ],
        cut_of_time: "",
        interval_time: "",
        minimum_day: "",
        maximum_day: "",
        datebasecount: [
          {
            date: "",
            from: "",
            to: "",
            order_count: "",
          },
        ],
        status: "",
        action: "add",
      },
      loading: true,
      tatList: [],
      availabiltyList: [],
      outlet_availability: [],
      formpost: [],
      companyDetail: [],
      outletList: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.loadOutlet();
    this.loadAvailabilty();

    if (this.state.editID !== "") {
      var params = {
        params: "company_id=" + CompanyID() + "&detail_id=" + this.state.editID,
        url: apiUrl + module + "details",
        type: "client",
      };
      this.setState({ pageloading: true });
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
            history.push(modulePath);
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

          var delivery_time_setting_status =
            result.delivery_time_setting_status == "A" ? "Active" : "In Active";
          var status =
            result.delivery_time_setting_status !== "" &&
            result.delivery_time_setting_status !== null
              ? {
                  label: delivery_time_setting_status,
                  value: result.delivery_time_setting_status,
                }
              : "";
          var slot_type = "";
          if (result.delivery_time_slot_type === "1") {
            slot_type = { value: "1", label: "Time" };
          } else if (result.delivery_time_slot_type === "2") {
            slot_type = { value: "2", label: "Timeslot" };
          }
          var cut_of_time = new Date();
          if (
            result.delivery_time_setting_cutt_off !== "" &&
            result.delivery_time_setting_cutt_off !== null &&
            result.delivery_time_setting_cutt_off !== "00:00:00"
          ) {
            var splitCutof = result.delivery_time_setting_cutt_off.split(":");
            cut_of_time.setHours(splitCutof[0]);
            cut_of_time.setMinutes(splitCutof[1]);
            cut_of_time.setSeconds(splitCutof[1]);
          }
          var timeslot = [];
          if (result.timeslot) {
            result.timeslot.map((item) => {
              var fromtime = "";
              if (
                item.from_time !== "" &&
                item.from_time !== null &&
                item.from_time !== "00:00:00"
              ) {
                var fromtime = new Date();
                var splitfromTime = item.from_time.split(":");
                fromtime.setHours(splitfromTime[0]);
                fromtime.setMinutes(splitfromTime[1]);
                fromtime.setSeconds(splitfromTime[1]);
              }

              var totime = "";
              if (
                item.to_time !== "" &&
                item.to_time !== null &&
                item.to_time !== "00:00:00"
              ) {
                var totime = new Date();
                var splittoTime = item.to_time.split(":");
                totime.setHours(splittoTime[0]);
                totime.setMinutes(splittoTime[1]);
                totime.setSeconds(splittoTime[1]);
              }

              timeslot.push({
                day: item.avail_days,
                from: fromtime,
                to: totime,
                order_count: item.order_count,
                order_count_type: item.order_count_type,
              });
            });
          }

          var datebasecount = [];
          if (result.datebasecount) {
            result.datebasecount.map((item) => {
              var fromtime = "";
              if (
                item.from_time !== "" &&
                item.from_time !== null &&
                item.from_time !== "00:00:00"
              ) {
                var fromtime = new Date();
                var splitfromTime = item.from.split(":");
                fromtime.setHours(splitfromTime[0]);
                fromtime.setMinutes(splitfromTime[1]);
                fromtime.setSeconds(splitfromTime[1]);
              }

              var totime = "";
              if (
                item.to_time !== "" &&
                item.to_time !== null &&
                item.to_time !== "00:00:00"
              ) {
                var totime = new Date();
                var splittoTime = item.to.split(":");
                totime.setHours(splittoTime[0]);
                totime.setMinutes(splittoTime[1]);
                totime.setSeconds(splittoTime[1]);
              }
              var splitdate = "";
              if (
                item.date !== "" &&
                item.date !== null &&
                item.date !== "0000-00-00"
              ) {
                var splitdate = new Date(item.date);
              }

              datebasecount.push({
                date: splitdate,
                from: fromtime,
                to: totime,
                order_count: item.order_count,
              });
            });
          }
          var clientupdatedata = {
            assign_outlet:
              Object.keys(result.assign_outlet).length > 0
                ? result.assign_outlet
                : { label: "Common", value: "" },
            assign_availability: result.assign_availability,
            slot_type: slot_type,
            timeslot:
              timeslot.length > 0
                ? timeslot
                : [
                    {
                      day: "",
                      from: "",
                      to: "",
                      order_count: "",
                      order_count_type: "",
                    },
                  ],
            datebasecount:
              datebasecount.length > 0
                ? datebasecount
                : [
                    {
                      date: "",
                      from: "",
                      to: "",
                      order_count: "",
                    },
                  ],
            cut_of_time: cut_of_time,
            interval_time: result.delivery_time_setting_interval_time,
            minimum_day: result.delivery_time_setting_minimum_date,
            maximum_day: result.delivery_time_setting_maximum_date,
            status: status,
            action: "edit",
          };
          console.log(clientupdatedata, "clientupdatedata");
          this.setState({ clientdata: clientupdatedata, pageloading: false });
        } else {
          this.setState({ pageloading: false });
          this.props.history.push(modulePath);
          showAlert("Error", "Invalid" + moduleName, "error");
        }
      });
    }
  }
  loadOutlet() {
    var urlShringTxt =
      apiUrl + "clientpanel/outlets/dropdownlist?company_id=" + CompanyID();
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        var result = [{ label: "Common", value: "" }];
        res.data.result.map((item) => {
          result.push(item);
        });
        this.setState({ outletList: result });
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

  sateValChange = (field, value) => {
    if (field === "page") {
    }
  };

  handleChange(checked, name) {
    this.setState({ checked });
  }

  /* signin - start*/
  fieldChange = (field, value) => {
    this.setState(
      update(this.state, { clientdata: { [field]: { $set: value } } })
    );
  };

  handleSubmit = () => {
    showLoader("submit_frm", "class");
    var postData = this.state.clientdata;
    var postObject = {
      assign_outlet:
        Object.keys(postData.assign_outlet).length > 0
          ? postData.assign_outlet.value
          : "",
      assign_availability:
        Object.keys(postData.assign_availability).length > 0
          ? postData.assign_availability.value
          : "",
      slot_type:
        Object.keys(postData.slot_type).length > 0
          ? postData.slot_type.value
          : "",
      timeslot: JSON.stringify(postData.timeslot),
      datebasecount: JSON.stringify(postData.datebasecount),
      cut_of_time: postData.cut_of_time,
      interval_time: postData.interval_time,
      minimum_day: postData.minimum_day,
      maximum_day: postData.maximum_day,

      status:
        Object.keys(postData.status).length > 0 ? postData.status.value : "A",
      loginID: userID(),
      company_admin_id: clientID(),
      company_id: CompanyID(),
      action: postData.action,
    };

    var post_url = module + "add";
    if (postData.action === "edit" && this.state.editID !== "") {
      postObject["edit_id"] = this.state.editID;
      post_url = module + "update";
    }

    this.props.getFormPost(postObject, post_url, "client");
  };

  render() {
    return (
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <Header {...this.props} currentPage={"timeslot"} />
          <div className="layout-page">
            <Topmenu />
            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row mb-3">
                  <div className="col-lg-10 col-md-6">
                    <h4 className="fw-bold">
                      {this.state.editID !== "" ? "Update" : "Add New"}{" "}
                      {moduleName}
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
                  fields={this.state.clientdata}
                  onChange={this.fieldChange}
                  onValid={this.handleSubmit}
                  error_msg={this.state.error_msg}
                  categoryList={this.state.categoryList}
                  outletList={this.state.outletList}
                  availabiltyList={this.state.availabiltyList}
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
                          100
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
  const {
    assign_outlet,
    assign_availability,
    slot_type,
    minimum_day,
    maximum_day,
    status,
  } = props.fields;

  return {
    fields: [
      "assign_outlet",
      "assign_availability",
      "slot_type",
      "minimum_day",
      "maximum_day",
      "status",
    ],

    validations: {
      assign_outlet: [[isSingleSelect, assign_outlet]],
      assign_availability: [[isSingleSelect, assign_availability]],
      slot_type: [[isSingleSelect, slot_type]],
      minimum_day: [
        [isEmpty, minimum_day],
        [isNumber, minimum_day],
      ],
      maximum_day: [
        [isEmpty, maximum_day],
        [isNumber, maximum_day],
      ],
      status: [[isSingleSelect, status]],
    },
  };
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
  myFilter(elm) {
    return elm != null && elm !== false && elm !== "";
  }
  addSlot() {
    var timeslot = this.props.fields.timeslot;
    timeslot.push({
      day: "",
      from: "",
      to: "",
      order_count: "",
      order_count_type: "",
    });
    this.props.onChange("timeslot", timeslot);
  }
  removeSlot(removeIndex) {
    var timeslot = this.props.fields.timeslot;
    timeslot.splice(removeIndex, 1);
    this.props.onChange("timeslot", timeslot);
  }
  handleChangeCheckBox(slotIndex, name, event) {
    this.updateSlot(slotIndex, name, event.target.value, event.target.checked);
  }
  handleChangeCheckRadio(slotIndex, name, event) {
    this.updateSlot(slotIndex, name, event.target.value, "");
  }
  handleChangeAvailDate(slotIndex, name, selectDate) {
    this.updateSlot(slotIndex, name, selectDate, "");
  }

  handleChangeText(slotIndex, name, event) {
    this.updateSlot(slotIndex, name, event.target.value, "");
  }

  updateSlot(slotIndex, name, value, checkedStatus = null) {
    var timeslot = this.props.fields.timeslot;
    var updatedtimeslot = [];
    if (timeslot.length > 0) {
      timeslot.map((item, index) => {
        if (index === slotIndex) {
          var updday = item.day;
          var updfrom = item.from;
          var updto = item.to;
          var updorder_count = item.order_count;
          var updorder_count_type = item.order_count_type;

          if (name === "day") {
            var splitupdday = updday.split(",").filter(this.myFilter);
            if (checkedStatus === true) {
              splitupdday.push(value);
            } else {
              const index = splitupdday.indexOf(value);
              splitupdday.splice(index, 1);
            }
            updday = splitupdday.length > 0 ? splitupdday.join(",") : "";
          } else if (name === "fromtime") {
            updfrom = value;
          } else if (name === "totime") {
            updto = value;
          } else if (name === "order_count") {
            updorder_count = value;
          } else if (name === "order_count_type") {
            updorder_count_type = value;
          }

          updatedtimeslot.push({
            day: updday,
            from: updfrom,
            to: updto,
            order_count: updorder_count,
            order_count_type: updorder_count_type,
          });
        } else {
          updatedtimeslot.push(item);
        }
      });
    }
    this.props.onChange("timeslot", updatedtimeslot);
  }
  handleChangeDate(name, selectDate) {
    this.props.onChange(name, selectDate);
  }
  addSpecificDate() {
    var datebasecount = this.props.fields.datebasecount;
    datebasecount.push({
      date: "",
      from: "",
      to: "",
      order_count: "",
    });
    this.props.onChange("datebasecount", datebasecount);
  }
  handleChangeSpecificDate(slotIndex, name, selectDate) {
    this.updateDateSlot(slotIndex, name, selectDate);
  }
  handleChangeSpecificText(slotIndex, name, event) {
    this.updateDateSlot(slotIndex, name, event.target.value);
  }
  updateDateSlot(slotIndex, name, value) {
    var datebasecount = this.props.fields.datebasecount;
    var updateddatebasecount = [];
    if (datebasecount.length > 0) {
      datebasecount.map((item, index) => {
        if (index === slotIndex) {
          var upddate = item.date;
          var updfrom = item.from;
          var updto = item.to;
          var updorder_count = item.order_count;

          if (name === "date") {
            upddate = value;
          } else if (name === "fromtime") {
            updfrom = value;
          } else if (name === "totime") {
            updto = value;
          } else if (name === "order_count") {
            updorder_count = value;
          }

          updateddatebasecount.push({
            date: upddate,
            from: updfrom,
            to: updto,
            order_count: updorder_count,
          });
        } else {
          updateddatebasecount.push(item);
        }
      });
    }
    this.props.onChange("datebasecount", updateddatebasecount);
  }

  render() {
    const { fields, onChange, onValid, onInvalid, $field, $validation } =
      this.props;
    let errMsgOutlet,
      errMsgAvail,
      errMsgSlotType,
      errMsgMin,
      errMsgMax,
      errMsgStatus = "";
    if ($validation.assign_outlet.error.reason !== undefined) {
      errMsgOutlet = $validation.assign_outlet.show && (
        <span className="error">{$validation.assign_outlet.error.reason}</span>
      );
    }
    if ($validation.assign_availability.error.reason !== undefined) {
      errMsgAvail = $validation.assign_availability.show && (
        <span className="error">
          {$validation.assign_availability.error.reason}
        </span>
      );
    }

    if ($validation.slot_type.error.reason !== undefined) {
      errMsgSlotType = $validation.slot_type.show && (
        <span className="error">{$validation.slot_type.error.reason}</span>
      );
    }
    if ($validation.minimum_day.error.reason !== undefined) {
      errMsgMin = $validation.minimum_day.show && (
        <span className="error">{$validation.minimum_day.error.reason}</span>
      );
    }
    if ($validation.maximum_day.error.reason !== undefined) {
      errMsgMax = $validation.maximum_day.show && (
        <span className="error">{$validation.maximum_day.error.reason}</span>
      );
    }

    if ($validation.status.error.reason !== undefined) {
      errMsgStatus = $validation.status.show && (
        <span className="error">{$validation.status.error.reason}</span>
      );
    }

    return (
      <form className="card fv-plugins-bootstrap5" id="modulefrm">
        <div className="card-body row g-3 mt-4">
          <div
            className={
              errMsgOutlet !== "" &&
              errMsgOutlet !== false &&
              errMsgOutlet !== undefined
                ? "col-md-6 error-select is-invalid error"
                : "col-md-6"
            }
          >
            <div className="form-floating form-floating-outline custm-select-box mb-4">
              <Select
                value={fields.assign_outlet}
                onChange={this.handleSelectChange.bind(this, "assign_outlet")}
                placeholder={"Select Outlet"}
                options={this.props.outletList}
              />
              <label className="select-box-label">
                Outlet<span className="error">*</span>
              </label>
              {errMsgOutlet}
            </div>
          </div>
          <div
            className={
              errMsgAvail !== "" &&
              errMsgAvail !== false &&
              errMsgAvail !== undefined
                ? "col-md-6 error-select is-invalid error"
                : "col-md-6"
            }
          >
            <div className="form-floating form-floating-outline custm-select-box mb-4">
              <Select
                value={fields.assign_availability}
                onChange={this.handleSelectChange.bind(
                  this,
                  "assign_availability"
                )}
                placeholder="Select Availabilty"
                options={this.props.availabiltyList.map((item) => {
                  return {
                    value: item.av_id,
                    label: item.av_name,
                  };
                })}
              />
              <label className="select-box-label">
                Availabilty<span className="error">*</span>
              </label>
              {errMsgAvail}
            </div>
          </div>
          <div
            className={
              errMsgSlotType !== "" &&
              errMsgSlotType !== false &&
              errMsgSlotType !== undefined
                ? "col-md-6 error-select is-invalid error"
                : "col-md-6"
            }
          >
            <div className="form-floating form-floating-outline custm-select-box mb-4">
              <Select
                value={fields.slot_type}
                onChange={this.handleSelectChange.bind(this, "slot_type")}
                placeholder="Select Slot Type*"
                options={[
                  { label: "Time", value: "1" },
                  { label: "Timeslot", value: "2" },
                ]}
              />
              <label className="select-box-label">
                Slot Type<span className="error">*</span>
              </label>
              {errMsgSlotType}
            </div>
          </div>
          {fields.timeslot.length > 0 && (
            <>
              <div className="col-md-12 text-end mb-3">
                <a href={void 0} onClick={this.addSlot.bind(this)}>
                  <button
                    type="button"
                    className="btn btn-outline-primary waves-effect"
                  >
                    Add New
                  </button>
                </a>
              </div>

              <div className="col-md-12">
                {fields.timeslot.map((item, index) => {
                  return (
                    <div
                      className="card mb-4 border-2 border-primary mb-3"
                      key={index}
                    >
                      <div className="card-body">
                        <div className="text-end">
                          <a
                            href={void 0}
                            onClick={this.removeSlot.bind(this, index)}
                          >
                            <span className="mdi mdi-trash-can-outline"></span>
                          </a>
                        </div>
                        <h4 className="card-title">
                          Slot {parseInt(index) + 1}
                        </h4>
                        <div className="row g-3">
                          <div className="col-md-12">
                            <div className="form-group daywiseitem_form_group">
                              {dayList.map((day, dayListIndex) => {
                                var selectedday =
                                  item.day !== "" && item.day !== null
                                    ? item.day.split(",")
                                    : [];
                                return (
                                  <div
                                    className="form-check form-check-inline mt-3"
                                    key={dayListIndex}
                                  >
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id={
                                        "day_" +
                                        index +
                                        "_" +
                                        dayListIndex +
                                        "_"
                                      }
                                      value={day.toLowerCase()}
                                      checked={
                                        selectedday.indexOf(
                                          day.toLowerCase()
                                        ) >= 0
                                          ? true
                                          : false
                                      }
                                      onChange={this.handleChangeCheckBox.bind(
                                        this,
                                        index,
                                        "day"
                                      )}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={
                                        "day_" +
                                        index +
                                        "_" +
                                        dayListIndex +
                                        "_"
                                      }
                                    >
                                      {day}
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-floating-outline mt-2">
                              <DatePicker
                                className="form-control"
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={5}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                                placeholderText="From"
                                selected={
                                  item.from !== "" && item.from !== null
                                    ? new Date(item.from)
                                    : ""
                                }
                                onChange={this.handleChangeAvailDate.bind(
                                  this,
                                  index,
                                  "fromtime"
                                )}
                              />
                            </div>
                          </div>

                          <div className="col-md-3">
                            <div className="form-floating-outline mt-2">
                              <DatePicker
                                className="form-control"
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={5}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                                placeholderText="To"
                                selected={
                                  item.to !== "" && item.to !== null
                                    ? new Date(item.to)
                                    : ""
                                }
                                onChange={this.handleChangeAvailDate.bind(
                                  this,
                                  index,
                                  "totime"
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="form-floating form-floating-outline mb-4 mt-2">
                              <input
                                type="text"
                                className="form-control"
                                name="sequence"
                                value={item.order_count}
                                id="sequence"
                                onChange={this.handleChangeText.bind(
                                  this,
                                  index,
                                  "order_count"
                                )}
                              />
                              <label htmlFor="sequence">Order Count</label>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-check form-check-inline mt-3">
                              <input
                                className="form-check-input"
                                type="radio"
                                id={"ordercounttype_range" + item}
                                value="1"
                                checked={
                                  item.order_count_type === "1" ? true : false
                                }
                                onChange={this.handleChangeCheckRadio.bind(
                                  this,
                                  index,
                                  "order_count_type"
                                )}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={"ordercounttype_range" + item}
                              >
                                Between time range
                              </label>
                            </div>
                            <div className="form-check form-check-inline mt-3">
                              <input
                                className="form-check-input"
                                type="radio"
                                id={"ordercounttype_minutes" + item}
                                checked={
                                  item.order_count_type === "2" ? true : false
                                }
                                value="2"
                                onChange={this.handleChangeCheckRadio.bind(
                                  this,
                                  index,
                                  "order_count_type"
                                )}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={"ordercounttype_minutes" + item}
                              >
                                By Interval minutes
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="col-md-12 text-end mb-3">
                <a href={void 0} onClick={this.addSlot.bind(this)}>
                  <button
                    type="button"
                    className="btn btn-outline-primary waves-effect"
                  >
                    Add New
                  </button>
                </a>
              </div>
            </>
          )}

          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className={
                  errMsgMin !== "" &&
                  errMsgMin !== false &&
                  errMsgMin !== undefined
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="minimum_day"
                value={fields.minimum_day}
                id="minimum_day"
                {...$field("minimum_day", (e) =>
                  onChange("minimum_day", e.target.value)
                )}
              />
              <label htmlFor="minimum_day">
                Minimum Day<span className="error">*</span>
              </label>
              {errMsgMin}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className={
                  errMsgMax !== "" &&
                  errMsgMax !== false &&
                  errMsgMax !== undefined
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="maximum_day"
                value={fields.maximum_day}
                id="maximum_day"
                {...$field("maximum_day", (e) =>
                  onChange("maximum_day", e.target.value)
                )}
              />
              <label htmlFor="maximum_day">
                Maximum Day<span className="error">*</span>
              </label>
              {errMsgMax}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating-outline mt-2">
              <DatePicker
                className="form-control"
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                placeholderText="Cutof Time"
                selected={fields.cut_of_time}
                onChange={this.handleChangeDate.bind(this, "cut_of_time")}
              />
            </div>
          </div>
          {Object.keys(fields.slot_type).length > 0 &&
            fields.slot_type.value === "1" && (
              <div className="col-md-6">
                <div className="form-floating form-floating-outline mb-4">
                  <input
                    type="text"
                    className="form-control"
                    name="interval_time"
                    value={fields.interval_time}
                    {...$field("interval_time", (e) =>
                      onChange("interval_time", e.target.value)
                    )}
                  />
                  <label htmlFor="interval_time">
                    Interval Minutes<span className="error">*</span>
                  </label>
                </div>
              </div>
            )}

          <hr />
          <h5 className="display-6 mb-0">Order count for a specific date</h5>
          <div className="col-md-12 text-end mb-3">
            <a href={void 0} onClick={this.addSpecificDate.bind(this)}>
              <button
                type="button"
                className="btn btn-outline-primary waves-effect"
              >
                Add New
              </button>
            </a>
          </div>
          {fields.datebasecount.length > 0 &&
            fields.datebasecount.map((item, index) => {
              return (
                <div
                  className="card mb-4 border-2 border-primary mb-3"
                  key={index}
                >
                  <div className="card-body">
                    <div className="text-end">
                      <a href={void 0}>
                        <span className="mdi mdi-trash-can-outline"></span>
                      </a>
                    </div>
                    <div className="row">
                      <div className="col-md-3">
                        <div className="form-floating-outline mt-2">
                          <DatePicker
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            className="form-control"
                            placeholderText="Date"
                            dateFormat="dd-MM-yyy"
                            minDate={new Date()}
                            selected={
                              item.date !== "" && item.date !== null
                                ? item.date
                                : ""
                            }
                            onChange={this.handleChangeSpecificDate.bind(
                              this,
                              index,
                              "date"
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="form-floating-outline mt-2">
                          <DatePicker
                            className="form-control"
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                            placeholderText="From"
                            selected={
                              item.from !== "" && item.from !== null
                                ? item.from
                                : ""
                            }
                            onChange={this.handleChangeSpecificDate.bind(
                              this,
                              index,
                              "fromtime"
                            )}
                          />
                        </div>
                      </div>

                      <div className="col-md-2">
                        <div className="form-floating-outline mt-2">
                          <DatePicker
                            className="form-control"
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                            placeholderText="To"
                            selected={
                              item.to !== "" && item.to !== null ? item.to : ""
                            }
                            onChange={this.handleChangeSpecificDate.bind(
                              this,
                              index,
                              "totime"
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="form-floating form-floating-outline mb-4 mt-2">
                          <input
                            type="text"
                            className="form-control"
                            value={item.order_count}
                            id={"specific_count" + index}
                            onChange={this.handleChangeSpecificText.bind(
                              this,
                              index,
                              "order_count"
                            )}
                          />
                          <label htmlFor={"specific_count" + index}>
                            Order Count
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          <div className="col-md-12 text-end mb-3">
            <a href={void 0} onClick={this.addSpecificDate.bind(this)}>
              <button
                type="button"
                className="btn btn-outline-primary waves-effect"
              >
                Add New
              </button>
            </a>
          </div>

          <div
            className={
              errMsgStatus !== "" &&
              errMsgStatus !== false &&
              errMsgStatus !== undefined
                ? "col-md-6 error-select error"
                : "col-md-6"
            }
          >
            <div className="form-floating form-floating-outline custm-select-box mb-4">
              <Select
                value={fields.status}
                onChange={this.handleSelectChange.bind(this, "status")}
                placeholder="Select Status"
                options={[
                  { value: "A", label: "Active" },
                  { value: "I", label: "In Active" },
                ]}
              />
              <label className="select-box-label">
                Status<span className="error">*</span>
              </label>
              {errMsgStatus}
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
            <Link to={"/clientpanel/outlet"}>
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
