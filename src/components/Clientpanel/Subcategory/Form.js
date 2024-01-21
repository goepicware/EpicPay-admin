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
  isSingleSelect,
} from "../../Helpers/SettingHelper";
import Header from "../Layout/Header";
import Topmenu from "../Layout/Topmenu";
import Footer from "../Layout/Footer";
import PageLoader from "../../Helpers/PageLoader";
import Editor from "../Layout/Editor";

var module = "clientpanel/subcategory/";
var moduleName = "Sub Categories";
var modulePath = "/clientpanel/catalog-subcategories";
var dayList = [
  { day: "Mon", checked: "No", start: "", end: "" },
  { day: "Tue", checked: "No", start: "", end: "" },
  { day: "Wed", checked: "No", start: "", end: "" },
  { day: "Thu", checked: "No", start: "", end: "" },
  { day: "Fri", checked: "No", start: "", end: "" },
  { day: "Sat", checked: "No", start: "", end: "" },
  { day: "Sun", checked: "No", start: "", end: "" },
];
class Form extends Component {
  constructor(props) {
    super(props);
    var editID = "";
    if (
      this.props.match.path ===
      "/clientpanel/catalog-subcategories/edit/:EditID"
    ) {
      editID = this.props.match.params.EditID;
    }
    this.state = {
      editID: editID,
      pageloading: false,
      clientdata: {
        category: "",
        subcate_name: "",
        assign_outlet: "",
        sequence: "",
        description: "",
        assign_availability: [],
        status: "",
        lead_time: "",
        timeavailability: dayList,
        action: "add",
      },
      loading: true,
      tatList: [],
      availabiltyList: [],
      outlet_availability: [],
      formpost: [],
      companyDetail: [],
      categoryList: [],
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

          var pro_subcate_status =
            result.pro_subcate_status == "A" ? "Active" : "In Active";
          var status =
            result.pro_subcate_status !== "" &&
            result.pro_subcate_status !== null
              ? {
                  label: pro_subcate_status,
                  value: result.pro_subcate_status,
                }
              : "";
          var selectcategory = "";
          if (Object.keys(result.category).length > 0) {
            selectcategory = {
              value:
                result.category.pro_cate_primary_id +
                "_" +
                result.category.pro_cate_id,
              label: result.category.pro_cate_name,
            };
          }
          var updtimeavailability = [];
          if (result.day_availability.length > 0) {
            result.day_availability.map((item) => {
              updtimeavailability.push({
                day: item.day,
                checked: item.checked,
                start: item.checked === "Yes" ? new Date(item.start) : "",
                end: item.checked === "Yes" ? new Date(item.end) : "",
              });
            });
          } else {
            updtimeavailability = dayList;
          }

          var clientupdatedata = {
            category: selectcategory,
            subcate_name: result.pro_subcate_name,
            assign_outlet:
              result.subcat_outlet.length > 0 ? result.subcat_outlet[0] : "",
            sequence: result.pro_subcate_sequence,
            description: result.pro_subcate_description,
            assign_availability: result.subcat_availability,
            lead_time: result.pro_subcate_lead_time,
            timeavailability: updtimeavailability,
            status: status,
            action: "edit",
          };
          this.setState(
            { clientdata: clientupdatedata, pageloading: false },
            function () {
              this.loadCategory();
            }
          );
        } else {
          this.setState({ pageloading: false });
          this.props.history.push(modulePath);
          showAlert("Error", "Invalid" + moduleName, "error");
        }
      });
    }
  }
  loadCategory() {
    var storeID =
      Object.keys(this.state.clientdata.assign_outlet).length > 0
        ? this.state.clientdata.assign_outlet.value
        : "";
    if (storeID !== "") {
      var urlShringTxt =
        apiUrl +
        "clientpanel/category/dropdownlist?company_id=" +
        CompanyID() +
        "&storeID=" +
        storeID;
      axios.get(urlShringTxt, clientheaderconfig).then((res) => {
        var categoryList = [];
        if (res.data.status === "ok") {
          var result = res.data.result;
          result.map((item) => {
            categoryList.push({
              value: item.pro_cate_primary_id + "_" + item.pro_cate_id,
              label: item.pro_cate_name,
            });
          });
        }
        this.setState({ categoryList: categoryList });
      });
    }
  }

  loadOutlet() {
    var urlShringTxt =
      apiUrl + "clientpanel/outlets/dropdownlist?company_id=" + CompanyID();
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ outletList: res.data.result });
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
      update(this.state, { clientdata: { [field]: { $set: value } } }),
      function () {
        if (field === "assign_outlet") {
          this.setState(
            update(this.state, { clientdata: { category: { $set: "" } } })
          );
          this.loadCategory();
        }
      }
    );
  };

  handleSubmit = () => {
    showLoader("submit_frm", "class");
    var postData = this.state.clientdata;

    var assign_availability = [];
    if (postData.assign_availability.length > 0) {
      postData.assign_availability.map((item) => {
        assign_availability.push(item.value);
      });
    }

    var postObject = {
      category:
        Object.keys(postData.category).length > 0
          ? postData.category.value
          : "",
      subcate_name: postData.subcate_name,
      assign_outlet:
        Object.keys(postData.assign_outlet).length > 0
          ? postData.assign_outlet.value
          : "",
      assign_availability:
        assign_availability.length > 0 ? assign_availability.join(",") : "",
      enable_navigation: postData.enable_navigation === true ? 1 : 0,
      custom_title:
        postData.enable_navigation === true ? postData.custom_title : "",
      sequence: postData.sequence,
      description: postData.description,
      lead_time: postData.lead_time,
      timeavailability: JSON.stringify(postData.timeavailability),
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
          <Header {...this.props} currentPage={"catalog-subcategories"} />
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
                                .offset().top - 200,
                          },
                          500
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
  const { assign_outlet, category, subcate_name, status } = props.fields;

  return {
    fields: ["assign_outlet", "category", "subcate_name", "status"],

    validations: {
      assign_outlet: [[isSingleSelect, assign_outlet]],
      category: [[isSingleSelect, category]],
      subcate_name: [[isEmpty, subcate_name]],
      status: [[isSingleSelect, status]],
    },
  };
}

class PostForm extends Component {
  constructor(props) {
    super(props);
    this.setContent = this.setContent.bind(this);
  }

  handleChange(name, value) {
    this.props.onChange(name, value);
  }
  handleSelectChange(name, value) {
    this.props.onChange(name, value);
  }

  setContent(value) {
    this.props.onChange("description", value);
  }

  handleChangeAvailDate(dayIndex, elementType, selectDate) {
    this.updateDayAvail(dayIndex, elementType, selectDate);
  }
  handleChangeCheck(dayIndex, elementType, event) {
    var value = event.target.checked === true ? "Yes" : "No";
    this.updateDayAvail(dayIndex, elementType, value);
  }
  updateDayAvail(dayIndex, elementType, value) {
    var timeavailability = this.props.fields.timeavailability;
    var updtimeavailability = [];
    timeavailability.map((item, index) => {
      if (index === dayIndex) {
        var start = item.start;
        var end = item.end;
        var checked = item.checked;
        if (elementType === "start") {
          start = value;
        } else if (elementType === "end") {
          end = value;
        } else if (elementType === "checked") {
          checked = value;
          start = "";
          end = "";
        }
        updtimeavailability.push({
          day: item.day,
          checked: checked,
          start: start,
          end: end,
        });
      } else {
        updtimeavailability.push(item);
      }
    });
    this.props.onChange("timeavailability", updtimeavailability);
  }

  render() {
    const { fields, onChange, onValid, onInvalid, $field, $validation } =
      this.props;
    let errMsgOutlet,
      errMsgCategory,
      errMsgSubCatName,
      errMsgStatus = "";
    if ($validation.assign_outlet.error.reason !== undefined) {
      errMsgOutlet = $validation.assign_outlet.show && (
        <span className="error">{$validation.assign_outlet.error.reason}</span>
      );
    }
    if ($validation.category.error.reason !== undefined) {
      errMsgCategory = $validation.category.show && (
        <span className="error">{$validation.category.error.reason}</span>
      );
    }
    if ($validation.subcate_name.error.reason !== undefined) {
      errMsgSubCatName = $validation.subcate_name.show && (
        <span className="error">{$validation.subcate_name.error.reason}</span>
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
                ? "col-md-6 error-select error"
                : "col-md-6"
            }
          >
            <div className="form-floating form-floating-outline custm-select-box mb-4">
              <Select
                value={fields.assign_outlet}
                onChange={this.handleSelectChange.bind(this, "assign_outlet")}
                placeholder={"Select Outlet"}
                options={this.props.outletList}
                isClearable={true}
              />
              <label className="select-box-label">
                Outlet<span className="error">*</span>
              </label>
              {errMsgOutlet}
            </div>
          </div>
          <div
            className={
              errMsgCategory !== "" &&
              errMsgCategory !== false &&
              errMsgCategory !== undefined
                ? "col-md-6 error-select error"
                : "col-md-6"
            }
          >
            <div className="form-floating form-floating-outline custm-select-box">
              <Select
                value={fields.category}
                onChange={this.handleSelectChange.bind(this, "category")}
                placeholder={"Select Category"}
                options={this.props.categoryList}
                isClearable={true}
              />
              <label className="select-box-label">
                Category<span className="error">*</span>
              </label>
              {errMsgCategory}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className={
                  errMsgSubCatName !== "" &&
                  errMsgSubCatName !== false &&
                  errMsgSubCatName !== undefined
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="subcate_name"
                value={fields.subcate_name}
                {...$field("subcate_name", (e) =>
                  onChange("subcate_name", e.target.value)
                )}
              />
              <label htmlFor="subcate_name">
                Subcategory Name <span className="error">*</span>
              </label>
              {errMsgSubCatName}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline custm-select-box mb-4">
              <Select
                value={fields.assign_availability}
                onChange={this.handleSelectChange.bind(
                  this,
                  "assign_availability"
                )}
                isMulti
                placeholder="Select Availabilty"
                options={this.props.availabiltyList.map((item) => {
                  return {
                    value: item.av_id,
                    label: item.av_name,
                  };
                })}
                isClearable={true}
              />
              <label className="select-box-label">Availabilty</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className="form-control"
                name="sequence"
                value={fields.sequence}
                id="sequence"
                {...$field("sequence", (e) =>
                  onChange("sequence", e.target.value)
                )}
              />
              <label htmlFor="sequence">Sequence</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className="form-control"
                name="lead_time"
                value={fields.lead_time}
                {...$field("lead_time", (e) =>
                  onChange("lead_time", e.target.value)
                )}
              />
              <label htmlFor="lead_time">Lead Time</label>
            </div>
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
                isClearable={true}
              />
              <label className="select-box-label">
                Status<span className="error">*</span>
              </label>
              {errMsgStatus}
            </div>
          </div>
          <div className="col-md-12">
            <label>Description</label>
            <Editor setContent={this.setContent} data={fields.description} />
          </div>

          <h1 className="display-6 mb-0">Time Availability</h1>
          {fields.timeavailability.map((item, index) => {
            return (
              <div className="row" key={index}>
                <div className="col-md-1">
                  <div className="form-check form-check-inline mt-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="low_stock_alert"
                      checked={item.checked === "Yes" ? true : false}
                      onChange={this.handleChangeCheck.bind(
                        this,
                        index,
                        "checked"
                      )}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="low_stock_alert"
                    >
                      {item.day}
                    </label>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-floating-outline mt-2 custm-date-box">
                    <DatePicker
                      className="form-control"
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      selected={
                        item.start !== "" && item.start !== null
                          ? new Date(item.start)
                          : ""
                      }
                      onChange={this.handleChangeAvailDate.bind(
                        this,
                        index,
                        "start"
                      )}
                      disabled={item.checked === "Yes" ? false : true}
                    />
                    <label className="select-box-label">From</label>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-floating-outline mt-2 custm-date-box">
                    <DatePicker
                      className="form-control"
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      selected={
                        item.end !== "" && item.end !== null
                          ? new Date(item.end)
                          : ""
                      }
                      onChange={this.handleChangeAvailDate.bind(
                        this,
                        index,
                        "end"
                      )}
                      disabled={item.checked === "Yes" ? false : true}
                    />
                    <label className="select-box-label">To</label>
                  </div>
                </div>
              </div>
            );
          })}

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
