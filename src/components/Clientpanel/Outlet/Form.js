/* eslint-disable */
import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Select from "react-select";
import update from "immutability-helper";
import { validated } from "react-custom-validation";
import validator from "validator";
import { GET_FORMPOST, GET_DETAILDATA } from "../../../actions";
import {
  apiUrl,
  clientheaderconfig,
  awsCredentials,
  bucketName,
  foldername,
} from "../../Helpers/Config";
import {
  showLoader,
  hideLoader,
  showAlert,
  userID,
  clientID,
  CompanyID,
  isEmpty,
  isEmail,
  isPhone,
  isNumber,
  isSingleSelect,
} from "../../Helpers/SettingHelper";
import Header from "../Layout/Header";
import Topmenu from "../Layout/Topmenu";
import Footer from "../Layout/Footer";
import Editor from "../Layout/Editor";
import PageLoader from "../../Helpers/PageLoader";
import AWS from "aws-sdk";
AWS.config.update(awsCredentials);
const s3 = new AWS.S3();
var module = "clientpanel/outlets/";
var moduleName = "Outlet";
var modulePath = "/clientpanel/outlet";
class Form extends Component {
  constructor(props) {
    super(props);
    var editID = "";
    if (this.props.match.path === "/clientpanel/outlet/edit/:EditID") {
      editID = this.props.match.params.EditID;
    }
    this.state = {
      editID: editID,
      pageloading: false,
      clientdata: {
        outlet_name: "",
        outlet_pos_id: "",
        outlet_email: "",
        outlet_phone: "",
        outlet_postal_code: "",
        outlet_unit_number1: "",
        outlet_unit_number2: "",
        outlet_address_line1: "",
        outlet_delivery_tat: "",
        outlet_pickup_tat: "",
        outlet_perday_limit: "",
        outlet_sequence: "",
        outlet_map_link: "",
        outlet_time_info: "",
        outlet_informations: "",
        availability: [],
        brand_id: "",
        siteLocation: "",
        outlet_image: "",
        outlet_menu_pdf: "",
        outlet_status: "",
        action: "add",
      },
      loading: true,
      tatList: [],
      availabiltyList: [],
      outlet_availability: [],
      formpost: [],
      companyDetail: [],
      brandList: [],
      siteLocation: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.loadTATList();
    this.loadAvailabilty();
    this.loadBrandList();
    this.loadSiteLocation();

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
          this.props.history.push(modulePath);
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
          var availability = result.availability;
          var availabilityList = [];
          if (availability.length > 0) {
            availability.map((item) => {
              availabilityList.push({
                value: item.oa_availability_id,
                label: item.av_name,
              });
            });
          }
          var outlet_delivery_tat =
            result.outlet_delivery_tat !== "" &&
            result.outlet_delivery_tat !== null
              ? {
                  label: result.outlet_delivery_tat,
                  value: result.outlet_delivery_tat,
                }
              : "";
          var outlet_pickup_tat =
            result.outlet_pickup_tat !== "" && result.outlet_pickup_tat !== null
              ? {
                  label: result.outlet_pickup_tat,
                  value: result.outlet_pickup_tat,
                }
              : "";
          var outlet_availability =
            result.outlet_availability == "1" ? "Open" : "Closed";
          var status =
            result.outlet_availability !== "" &&
            result.outlet_availability !== null
              ? {
                  label: outlet_availability,
                  value: result.outlet_availability,
                }
              : [];

          var clientupdatedata = {
            outlet_name: result.outlet_name,
            outlet_pos_id: result.outlet_pos_id,
            outlet_email: result.outlet_email,
            outlet_phone: result.outlet_phone,
            outlet_postal_code: result.outlet_postal_code,
            outlet_unit_number1: result.outlet_unit_number1,
            outlet_unit_number2: result.outlet_unit_number2,
            outlet_address_line1: result.outlet_address_line1,
            outlet_delivery_tat: outlet_delivery_tat,
            outlet_pickup_tat: outlet_pickup_tat,
            outlet_perday_limit: result.outlet_perday_limit,
            outlet_sequence: result.outlet_sequence,
            outlet_map_link: result.outlet_map_link,
            outlet_time_info: result.outlet_time_info,
            outlet_informations:
              result.outlet_informations !== "" &&
              result.outlet_informations !== null
                ? result.outlet_informations
                : "",
            availability: availabilityList,
            brand_id: result.outlet_brand !== null ? result.outlet_brand : "",
            siteLocation:
              result.siteLocation !== null ? result.siteLocation : "",
            outlet_image:
              result.outlet_image !== "" && result.outlet_image !== null
                ? result.outlet_image
                : "",
            outlet_menu_pdf:
              result.outlet_menu_pdf !== "" && result.outlet_menu_pdf !== null
                ? result.outlet_menu_pdf
                : "",
            outlet_status: status,
            action: "edit",
          };
          this.setState({ clientdata: clientupdatedata, pageloading: false });
        } else {
          this.setState({ pageloading: false });
          this.props.history.push(modulePath);
          showAlert("Error", "Invalid " + moduleName, "error");
        }
      });
    }
  }
  loadTATList() {
    var urlShringTxt = apiUrl + "company/settings/tattimelist";
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      var tatList = new Array();
      if (res.data.status === "success") {
        res.data.result.map((item) => {
          tatList.push({
            label: item.tattime_value,
            value: item.tattime_value,
          });
        });
      }
      this.setState({ tatList: tatList });
    });
  }
  loadBrandList() {
    var urlShringTxt =
      apiUrl + "clientpanel/brands/dropdownlist?company_id=" + CompanyID();
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ brandList: res.data.result });
      }
    });
  }
  loadSiteLocation() {
    var urlShringTxt =
      apiUrl +
      "clientpanel/sitelocation/dropdownlist?company_id=" +
      CompanyID();
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ siteLocation: res.data.result });
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
    var availability = [];
    if (postData.availability.length > 0) {
      postData.availability.map((item) => {
        availability.push(item.value);
      });
    }

    var postObject = {
      outlet_name: postData.outlet_name,
      outlet_pos_id: postData.outlet_pos_id,
      outlet_email: postData.outlet_email,
      outlet_phone: postData.outlet_phone,
      outlet_postal_code: postData.outlet_postal_code,
      outlet_unit_number1: postData.outlet_unit_number1,
      outlet_unit_number2: postData.outlet_unit_number2,
      outlet_address_line1: postData.outlet_address_line1,
      outlet_delivery_tat:
        Object.keys(postData.outlet_delivery_tat).length > 0
          ? postData.outlet_delivery_tat.value
          : "",
      outlet_pickup_tat:
        Object.keys(postData.outlet_delivery_tat).length > 0
          ? postData.outlet_delivery_tat.value
          : "",
      outlet_perday_limit: postData.outlet_perday_limit,
      outlet_sequence: postData.outlet_sequence,
      outlet_map_link: postData.outlet_map_link,
      outlet_time_info: postData.outlet_time_info,
      outlet_informations: postData.outlet_informations,
      availability: availability.length > 0 ? availability.join(",") : "",
      brand_id:
        Object.keys(postData.brand_id).length > 0
          ? postData.brand_id.value
          : "",
      siteLocation:
        Object.keys(postData.siteLocation).length > 0
          ? postData.siteLocation.value
          : "",
      outlet_image: postData.outlet_image,
      outlet_menu_pdf: postData.outlet_menu_pdf,
      outlet_availability:
        Object.keys(postData.outlet_status).length > 0
          ? postData.outlet_status.value
          : "0",
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
          <Header {...this.props} currentPage={"outlet"} />
          <div className="layout-page">
            <Topmenu />
            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row mb-3">
                  <div className="col-lg-10 col-md-6">
                    <h4 className="fw-bold">
                      {this.state.editID !== "" ? "Update" : "Add New"} Outlet
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
                <Postform
                  {...this.props}
                  fields={this.state.clientdata}
                  onChange={this.fieldChange}
                  onValid={this.handleSubmit}
                  error_msg={this.state.error_msg}
                  tatList={this.state.tatList}
                  availabiltyList={this.state.availabiltyList}
                  brandList={this.state.brandList}
                  siteLocation={this.state.siteLocation}
                  onInvalid={() => {
                    console.log("Form invalid!");
                    setTimeout(function () {
                      if ($("#modulefrm .is-invalid").length > 0) {
                        $("html, body").animate(
                          {
                            scrollTop:
                              $(document)
                                .find("#modulefrm .is-invalid:first")
                                .offset().top - 160,
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
    siteLocation,
    outlet_name,
    outlet_email,
    outlet_phone,
    outlet_postal_code,
    outlet_status,
  } = props.fields;

  return {
    fields: [
      "outlet_name",
      "outlet_email",
      "outlet_phone",
      "outlet_postal_code",
      "outlet_status",
    ],

    validations: {
      outlet_name: [[isEmpty, outlet_name]],
      outlet_email: [
        [isEmpty, outlet_email],
        [isEmail, outlet_email],
      ],
      outlet_phone: [[isPhone, outlet_phone]],
      outlet_postal_code: [
        [isEmpty, outlet_postal_code],
        [isNumber, outlet_postal_code],
      ],
      outlet_status: [[isSingleSelect, outlet_status]],
    },
  };
}

class Postform extends Component {
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
    this.props.onChange("outlet_informations", value);
  }
  async uplaodoutletImage() {
    var imagefile = document.querySelector("#outlet_image");
    const file = imagefile.files[0];
    const params = {
      Bucket: bucketName,
      Key: `media/${foldername}/outlet/${file.name}`,
      Body: file,
      ACL: "public-read",
    };
    const { Location } = await s3.upload(params).promise();
    this.props.onChange("outlet_image", Location);
    $("#outlet_image").val("");
  }
  async uplaodMenuPdf() {
    var imagefile = document.querySelector("#outlet_menu_pdf");
    const file = imagefile.files[0];

    const params = {
      Bucket: bucketName,
      Key: `media/${foldername}/outlet/menu/${file.name}`,
      Body: file,
      ACL: "public-read",
    };
    const { Location } = await s3.upload(params).promise();
    this.props.onChange("outlet_menu_pdf", Location);
    $("#outlet_menu_pdf").val("");
  }

  async removeImage(fileNamme, ImageType, event) {
    event.preventDefault();
    var imagePath = "";
    if (ImageType === "outlet_image") {
      imagePath = "outlet";
    } else if (ImageType === "outlet_menu_pdf") {
      imagePath = "outlet/menu";
    }
    var fileNammeSplit = fileNamme.split("/");
    console.log(fileNammeSplit, "fileNammeSplit");
    var params = {
      Bucket: bucketName,
      Key: `media/${foldername}/${imagePath}/${
        fileNammeSplit[fileNammeSplit.length - 1]
      }`,
    };
    await s3.deleteObject(params).promise();
    this.props.onChange(ImageType, "");
  }

  render() {
    const { fields, onChange, onValid, onInvalid, $field, $validation } =
      this.props;
    let errMsgOutletName,
      errMssEmail,
      errMsgPhone,
      errMsgPostalCode,
      errMsgStatus = "";
    if ($validation.outlet_name.error.reason !== undefined) {
      errMsgOutletName = $validation.outlet_name.show && (
        <span className="error">{$validation.outlet_name.error.reason}</span>
      );
    }
    if ($validation.outlet_email.error.reason !== undefined) {
      errMssEmail = $validation.outlet_email.show && (
        <span className="error">{$validation.outlet_email.error.reason}</span>
      );
    }
    if ($validation.outlet_phone.error.reason !== undefined) {
      errMsgPhone = $validation.outlet_phone.show && (
        <span className="error">{$validation.outlet_phone.error.reason}</span>
      );
    }

    if ($validation.outlet_postal_code.error.reason !== undefined) {
      errMsgPostalCode = $validation.outlet_postal_code.show && (
        <span className="error">
          {$validation.outlet_postal_code.error.reason}
        </span>
      );
    }

    if ($validation.outlet_status.error.reason !== undefined) {
      errMsgStatus = $validation.outlet_status.show && (
        <span className="error">{$validation.outlet_status.error.reason}</span>
      );
    }

    return (
      <form className="card fv-plugins-bootstrap5" id="modulefrm">
        <div className="card-body row g-3 pt-5">
          <div className={"col-md-6"} style={{display:'none'}}>
            <div className="form-floating form-floating-outline custm-select-box">
              <Select
                value={fields.siteLocation}
                onChange={this.handleSelectChange.bind(this, "siteLocation")}
                placeholder="Select Site Location"
                options={this.props.siteLocation}
              />
              <label className="select-box-label">
                Site Location
              </label>
            </div>
          </div>
          <div className="col-md-6" style={{display:'none'}}>
            <div className="form-floating form-floating-outline custm-select-box">
              <Select
                value={fields.brand_id}
                onChange={this.handleSelectChange.bind(this, "brand_id")}
                placeholder={"Select Brand"}
                options={this.props.brandList}
              />
              <label className="select-box-label">Brand</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className={
                  errMsgOutletName !== "" &&
                  errMsgOutletName !== false &&
                  errMsgOutletName !== undefined
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="outlet_name"
                value={fields.outlet_name}
                {...$field("outlet_name", (e) =>
                  onChange("outlet_name", e.target.value)
                )}
              />
              <label htmlFor="outlet_name">
                Outlet Name <span className="error">*</span>
              </label>
              {errMsgOutletName}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className="form-control"
                name="outlet_pos_id"
                value={fields.outlet_pos_id}
                {...$field("outlet_pos_id", (e) =>
                  onChange("outlet_pos_id", e.target.value)
                )}
              />
              <label htmlFor="outlet_pos_id">POS ID</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className={
                  errMssEmail !== "" &&
                  errMssEmail !== false &&
                  errMssEmail !== undefined
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="outlet_email"
                id="outlet_email"
                value={fields.outlet_email}
                {...$field("outlet_email", (e) =>
                  onChange("outlet_email", e.target.value)
                )}
              />
              <label htmlFor="outlet_email">Email ID</label>
              {errMssEmail}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className={
                  errMsgPhone !== "" &&
                  errMsgPhone !== false &&
                  errMsgPhone !== undefined
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="outlet_phone"
                id="outlet_phone"
                value={fields.outlet_phone}
                {...$field("outlet_phone", (e) =>
                  onChange("outlet_phone", e.target.value)
                )}
              />
              <label htmlFor="outlet_phone">Phone</label>
              {errMsgPhone}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className={
                  errMsgPostalCode !== "" &&
                  errMsgPostalCode !== false &&
                  errMsgPostalCode !== undefined
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="outlet_postal_code"
                id="outlet_postal_code"
                value={fields.outlet_postal_code}
                {...$field("outlet_postal_code", (e) =>
                  onChange("outlet_postal_code", e.target.value)
                )}
              />
              <label htmlFor="outlet_postal_code">
                Postal Code<span className="error">*</span>
              </label>
              {errMsgPostalCode}
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className="form-control"
                name="outlet_unit_number1"
                id="outlet_unit_number1"
                value={fields.outlet_unit_number1}
                {...$field("outlet_unit_number1", (e) =>
                  onChange("outlet_unit_number1", e.target.value)
                )}
              />
              <label htmlFor="outlet_unit_number1">Unit No.</label>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className="form-control"
                name="outlet_unit_number2"
                id="outlet_unit_number2"
                value={fields.outlet_unit_number2}
                {...$field("outlet_unit_number2", (e) =>
                  onChange("outlet_unit_number2", e.target.value)
                )}
              />
              <label htmlFor="outlet_unit_number2">Floor No.</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className="form-control"
                name="outlet_address_line1"
                id="outlet_address_line1"
                value={fields.outlet_address_line1}
                {...$field("outlet_address_line1", (e) =>
                  onChange("outlet_address_line1", e.target.value)
                )}
              />
              <label htmlFor="outlet_address_line1">Address</label>
            </div>
          </div>
          {this.props.availabiltyList.length > 0 &&
            this.props.availabiltyList.map((item, index) => {
              var slectedtat = [];
              if (item.av_name.toLowerCase() === "delivery") {
                slectedtat = fields.outlet_delivery_tat;
              }
              if (item.av_name.toLowerCase() === "pickup") {
                slectedtat = fields.outlet_pickup_tat;
              }
              return (
                <div className="col-md-3" key={index} style={{display:'none'}}>
                  <div className="form-floating form-floating-outline custm-select-box">
                    <Select
                      value={slectedtat}
                      onChange={this.handleSelectChange.bind(
                        this,
                        "outlet_" + item.av_name.toLowerCase() + "_tat"
                      )}
                      placeholder={"Select " + item.av_name + " TAT"}
                      options={this.props.tatList}
                    />
                    <label className="select-box-label">
                      {item.av_name + " TAT"}
                    </label>
                  </div>
                </div>
              );
            })}
          <div className="col-md-6" style={{display:'none'}}>
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className="form-control"
                name="outlet_perday_limit"
                id="outlet_perday_limit"
                value={fields.outlet_perday_limit}
                {...$field("outlet_perday_limit", (e) =>
                  onChange("outlet_perday_limit", e.target.value)
                )}
              />
              <label htmlFor="outlet_perday_limit">Order Limit Per Day</label>
            </div>
          </div>
          <div className="col-md-6" style={{display:'none'}}>
            <div className="form-floating form-floating-outline custm-select-box">
              <Select
                value={fields.availability}
                onChange={this.handleSelectChange.bind(this, "availability")}
                isMulti
                placeholder="Select Availabilty"
                options={this.props.availabiltyList.map((item) => {
                  return {
                    value: item.av_id,
                    label: item.av_name,
                  };
                })}
              />
              <label className="select-box-label">Availabilty</label>
            </div>
          </div>
          <div className="col-md-12">
            <label>Outlet Information</label>
            <Editor
              setContent={this.setContent}
              data={fields.outlet_informations}
            />
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className="form-control"
                name="outlet_sequence"
                id="outlet_sequence"
                value={fields.outlet_sequence}
                {...$field("outlet_sequence", (e) =>
                  onChange("outlet_sequence", e.target.value)
                )}
              />
              <label htmlFor="outlet_sequence">Sequence</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className="form-control"
                name="outlet_map_link"
                id="outlet_map_link"
                value={fields.outlet_map_link}
                {...$field("outlet_map_link", (e) =>
                  onChange("outlet_map_link", e.target.value)
                )}
              />
              <label htmlFor="outlet_map_link">Map Link</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className="form-control"
                name="outlet_time_info"
                id="outlet_time_info"
                value={fields.outlet_time_info}
                {...$field("outlet_time_info", (e) =>
                  onChange("outlet_time_info", e.target.value)
                )}
              />
              <label htmlFor="outlet_time_info">
                Time Info <span className="error">*</span>
              </label>
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
            <div className="form-floating form-floating-outline custm-select-box">
              <Select
                value={fields.outlet_status}
                onChange={this.handleSelectChange.bind(this, "outlet_status")}
                placeholder="Select Shop Opening Status"
                options={[
                  { value: "1", label: "Open" },
                  { value: "0", label: "Closed" },
                ]}
              />
              <label className="select-box-label">
                Shop Opening Status<span className="error">*</span>
              </label>
              {errMsgStatus}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <div className="mb-3">
                <label htmlFor="formFile" className="form-label">
                  Outlet Image
                </label>
                <input
                  className="form-control"
                  type="file"
                  id="outlet_image"
                  onChange={(event) => {
                    this.uplaodoutletImage(event);
                    return false;
                  }}
                />
              </div>
            </div>
            {fields.outlet_image !== "" && (
              <div className="dz-preview dz-processing dz-image-preview dz-success dz-complete">
                <div className="dz-details">
                  <div className="dz-thumbnail">
                    <img alt="" src={fields.outlet_image} />
                  </div>
                </div>
                <a
                  className="dz-remove"
                  href={void 0}
                  onClick={this.removeImage.bind(
                    this,
                    fields.outlet_image,
                    "outlet_image"
                  )}
                >
                  Remove file
                </a>
              </div>
            )}
          </div>
          <div className="col-md-5">
            <div className="form-floating form-floating-outline mb-4">
              <div className="mb-3">
                <label htmlFor="formFile" className="form-label">
                  Menu PDF
                </label>
                <input
                  className="form-control"
                  type="file"
                  id="outlet_menu_pdf"
                  onChange={(event) => {
                    this.uplaodMenuPdf(event);
                    return false;
                  }}
                />
              </div>
            </div>
            {fields.outlet_menu_pdf !== "" && (
              <a href={fields.outlet_menu_pdf} target="_blank">
                <button
                  type="button"
                  class="btn btn-label-primary text-nowrap d-inline-flex position-relative me-3"
                >
                  View Menu
                  <span
                    class="position-absolute top-0 start-100 translate-middle badge bg-primary text-white"
                    onClick={this.removeImage.bind(
                      this,
                      fields.outlet_image,
                      "outlet_menu_pdf"
                    )}
                  >
                    <span class="mdi mdi-close"></span>
                  </span>
                </button>
              </a>
            )}
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
            <Link to={modulePath}>
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
Postform = validated(validationConfig)(Postform);
