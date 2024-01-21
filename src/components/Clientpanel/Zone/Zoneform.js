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
  isNumber,
  isValidPrice,
} from "../../Helpers/SettingHelper";
import PageLoader from "../../Helpers/PageLoader";
import Header from "../Layout/Header";
import Topmenu from "../Layout/Topmenu";
import Footer from "../Layout/Footer";
var module = "clientpanel/outletzone/";
class Zoneform extends Component {
  constructor(props) {
    super(props);
    var editID = "";
    if (this.props.match.path === "/clientpanel/zone/edit/:EditID") {
      editID = this.props.match.params.EditID;
    }
    this.state = {
      editID: editID,
      pageloading: false,
      postdata: {
        zone_name: "",
        site_location_id: "",
        zone_availability: [],
        zone_postal_code: "",
        zone_address_line1: "",
        zone_min_amount: "",
        zone_delivery_charge: "",
        zone_additional_delivery_charge: "",
        zone_free_delivery: "",
        status: "",
        action: "add",
      },
      loading: true,
      availabiltyList: [],
      formpost: [],
      companyDetail: [],
      siteLocation: [],
      region_typemap: "",
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.loadSiteLocation();
    this.loadAvailabilty();

    if (this.state.editID !== "") {
      var params = {
        params: "company_id=" + CompanyID() + "&zone_id=" + this.state.editID,
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
          this.props.history.push("/clientpanel/zone");
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
          var availability = result.zone_availability;
          var availabilityList = [];
          if (availability.length > 0) {
            availability.map((item) => {
              availabilityList.push({
                value: item.oza_availability_id,
                label: item.av_name,
              });
            });
          }
          var zone_status = result.zone_status == "A" ? "Active" : "In Active";
          var status =
            result.zone_status !== "" && result.zone_status !== null
              ? {
                  label: zone_status,
                  value: result.zone_status,
                }
              : "";
          var clientupdatedata = {
            zone_name: result.zone_name,
            site_location_id: result.site_location,
            zone_availability: availabilityList,
            zone_postal_code: result.zone_postal_code,
            zone_address_line1: result.zone_address_line1,
            zone_min_amount: result.zone_min_amount,
            zone_delivery_charge: result.zone_delivery_charge,
            zone_additional_delivery_charge:
              result.zone_additional_delivery_charge,
            zone_free_delivery: result.zone_free_delivery,
            status: status,
            action: "edit",
          };
          this.setState({ postdata: clientupdatedata, pageloading: false });
        } else {
          this.props.history.push("/clientpanel/zone");
          showAlert("Error", "Invalid Zone", "error");
        }
      });
    }
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

  sateValChange = (field, value) => {};

  handleChange(checked, name) {
    this.setState({ checked });
  }

  /* signin - start*/
  fieldChange = (field, value) => {
    this.setState(
      update(this.state, { postdata: { [field]: { $set: value } } })
    );
  };

  handleSubmit = () => {
    var getIframeVal = $("iframe[name=zonemap]")
      .contents()
      .find("#iframeInputBox")
      .val();
    /*  console.log(
      $("iframe[name=zonemap]").contents().prevObject[0].html(),
      "aaaaaaa"
    ); */
    /*  console.log($("#zonemap").contents().prevObject.context);
    var region_typemap =
      $("#zonemap").contents().prevObject.context.all.region_typemap;
    console.log(region_typemap); */
    /* var splitID = (new String(id)) */
    /*  this.setState({ region_typemap: region_typemap }); */

    //return false;
    /* const iframe = document.getElementById("zonemap");
    const iWindow = iframe.contentWindow;
    const iDocument = iWindow.document; */

    // accessing the element
    /* const element = iDocument.getElementsByTagName("region_points")[0]; */
    //element.style.color = "green";

    /*   let textArea = iframeDoc.contentWindow.document.getElementById("some-textarea")[0]
     */
    /* .find("#region_pointsmap")
      .val() */
    //var name = $("#zonemap").contents().find("#region_points").val();
    /*  console.log(element, "zonemapzonemap");
    return false; */
    /*  var getIframeVal = $("iframe[name=zonemap]")
      .contents()
      .find("#region_pointsmap")
      .val();
    console.log(getIframeVal, "zonemapzonemap");
    return false; */
    showLoader("submit_frm", "class");
    var postData = this.state.postdata;

    var zone_availability = [];
    if (postData.zone_availability.length > 0) {
      postData.zone_availability.map((item) => {
        zone_availability.push(item.value);
      });
    }

    var postObject = {
      zone_name: postData.zone_name,
      zone_availability:
        zone_availability.length > 0 ? zone_availability.join(",") : "",
      zone_postal_code: postData.zone_postal_code,
      zone_address_line1: postData.zone_address_line1,
      zone_min_amount: postData.zone_min_amount,
      zone_delivery_charge: postData.zone_delivery_charge,
      zone_additional_delivery_charge: postData.zone_additional_delivery_charge,
      zone_free_delivery: postData.zone_free_delivery,
      status:
        Object.keys(postData.status).length > 0 ? postData.status.value : "A",
      site_location_id:
        Object.keys(postData.site_location_id).length > 0
          ? postData.site_location_id.value
          : "A",
      loginID: userID(),
      company_admin_id: clientID(),
      company_id: CompanyID(),
      region_type: JSON.stringify(["polygon"]),
      region_points: JSON.stringify([
        "1.2892083384677915,1.294356870957261,1.296587898458848,1.299162158517194,1.3025945011805202,1.3064558810875861,1.3085545825466576,1.3099704191754955,1.3118152960064469,1.3149043890487275,1.3169208782785515,1.3180036006266949,1.3173600406909614,1.3172313286838635,1.3153864558518233,1.3112247609688519,1.308528060191617,1.3032734609759302,1.2969955379214337,1.2951077458517635,1.290318066325462,1.287100229631193,1.2845688619110502,1.2826381560316595,1.280278402423296,1.279463214308177,1.2781331699853236,1.2781331699853236,1.2792057864285136,1.281222304127508,1.2870573251144806,1.288988027651452,1.2762794260853267,1.2719889527465496,1.2654245147393233,1.2614772629664404,1.2636225092392404,1.2661109926958702,1.2671407092897988,1.2613056431881722,1.2599755895229228,1.2711737620049666,1.2639657484785483,1.264734608542399,1.2677808538985127,1.2731439532045108,1.2802094670255975,1.2875461485755282,1.2931893246914388,1.3051325572660881,1.312040125707844,1.3188947343081934,1.3242148214910574,1.3299038564368308,1.33415132741623,1.3364252230090488,1.3353990930696007,1.333125196527908,1.3300790299457246,1.326051400873781,1.3206884136842436,1.3185270758284025,1.3150947549719643,1.306683961632231,1.2965778420540122,1.292802255886305,1.2879372042107515,1.2824454220123258,1.2761839795857848| 103.83308907336394, 103.83120079821745, 103.82982750720183, 103.82879753894011, 103.82806797808806, 103.82849713153044, 103.82936854225494, 103.83181471687652, 103.83331675392486, 103.83949656349517, 103.84486098152496, 103.85106859625972, 103.85733423651851, 103.85913668097652, 103.86390028418697, 103.8694363635937, 103.87139901719027, 103.87212857804232, 103.87212857804232, 103.8719998320096, 103.87079820237093, 103.8690815886014, 103.86646375260287, 103.86345967850619, 103.85942563614779, 103.85616406998568, 103.85213002762728, 103.8482247313016, 103.84208783707552, 103.83741006455355, 103.8332043608182, 103.83281812272006, 103.8129723971454, 103.8129723971454, 103.81687769347108, 103.82031092101015, 103.8283360903827, 103.83198389464296, 103.8389790957538, 103.84468683653749, 103.85223993712343, 103.85275492125429, 103.86035093718446, 103.86332155247989, 103.86104703923526, 103.86847139378848, 103.87837107469983, 103.88871367266125, 103.8932424812494, 103.89346685016085, 103.89179315173556, 103.8879946841821, 103.8830594195947, 103.87548058319585, 103.86711209106939, 103.85518162537115, 103.8424286494584, 103.83337351182412, 103.82534834245156, 103.81766964113753, 103.81140400087874, 103.80707309355101, 103.80252406706175, 103.80093619932494, 103.80222365965209, 103.8069443475183, 103.81007563091504, 103.81252180553662, 103.81303678966748",
      ]),
      region_radius: JSON.stringify(["region_radius"]),
      outlet_marker_location: "(1.293717, 103.851596)",
      outlet: "173",
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
          <Header {...this.props} currentPage={"zone"} />
          <div className="layout-page">
            <Topmenu />
            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row mb-3">
                  <div className="col-lg-10 col-md-6">
                    <h4 className="fw-bold">
                      {this.state.editID !== "" ? "Update" : "Add New"} Zone
                    </h4>
                  </div>
                  <div className="col-lg-2 col-md-6 text-end">
                    <Link to={"/clientpanel/zone"}>
                      <button
                        type="button"
                        className="btn btn-outline-primary waves-effect"
                      >
                        Back
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="kkkkkkkk">{this.state.region_typemap}</div>
                <Form
                  {...this.props}
                  fields={this.state.postdata}
                  onChange={this.fieldChange}
                  onValid={this.handleSubmit}
                  error_msg={this.state.error_msg}
                  availabiltyList={this.state.availabiltyList}
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
                                .offset().top - 100,
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

export default connect(mapStateTopProps, mapDispatchToProps)(Zoneform);

function validationConfig(props) {
  const {
    zone_name,
    site_location_id,
    zone_availability,
    zone_postal_code,
    zone_address_line1,
    zone_min_amount,
    zone_delivery_charge,
    zone_additional_delivery_charge,
    zone_free_delivery,
    status,
  } = props.fields;

  return {
    fields: [
      "zone_name",
      "site_location_id",
      "zone_availability",
      "zone_postal_code",
      "zone_address_line1",
      "zone_min_amount",
      "zone_delivery_charge",
      "zone_additional_delivery_charge",
      "zone_free_delivery",
      "status",
    ],

    validations: {
      zone_name: [[isEmpty, zone_name]],
      zone_availability: [[isSingleSelect, zone_availability]],
      site_location_id: [[isSingleSelect, site_location_id]],
      zone_postal_code: [
        [isEmpty, zone_postal_code],
        [isNumber, zone_postal_code],
      ],
      zone_address_line1: [[isEmpty, zone_address_line1]],
      zone_min_amount: [[isValidPrice, zone_min_amount]],
      zone_delivery_charge: [[isValidPrice, zone_delivery_charge]],
      zone_additional_delivery_charge: [
        [isValidPrice, zone_additional_delivery_charge],
      ],
      zone_free_delivery: [[isValidPrice, zone_free_delivery]],
      status: [[isSingleSelect, status]],
    },
  };
}

class Form extends Component {
  constructor(props) {
    super(props);
  }

  handleChange(name, value) {
    this.props.onChange(name, value);
  }
  handleSelectChange(name, value) {
    this.props.onChange(name, value);
  }

  render() {
    const { fields, onChange, onValid, onInvalid, $field, $validation } =
      this.props;
    let errMsgZoneName,
      errMsgAvail,
      errMsgSiteLoc,
      errMsgPostalCode,
      errMssAddress,
      errmMsgMinAmt,
      errmMsgDelivery,
      errmMsgAddDelivery,
      errmMsgFreeDelivery,
      errMsgStatus = "";
    if ($validation.zone_name.error.reason !== undefined) {
      errMsgZoneName = $validation.zone_name.show && (
        <span className="error">{$validation.zone_name.error.reason}</span>
      );
    }
    if ($validation.site_location_id.error.reason !== undefined) {
      errMsgSiteLoc = $validation.site_location_id.show && (
        <span className="error">
          {$validation.site_location_id.error.reason}
        </span>
      );
    }
    if ($validation.zone_availability.error.reason !== undefined) {
      errMsgAvail = $validation.zone_availability.show && (
        <span className="error">
          {$validation.zone_availability.error.reason}
        </span>
      );
    }
    if ($validation.zone_postal_code.error.reason !== undefined) {
      errMsgPostalCode = $validation.zone_postal_code.show && (
        <span className="error">
          {$validation.zone_postal_code.error.reason}
        </span>
      );
    }
    if ($validation.zone_address_line1.error.reason !== undefined) {
      errMssAddress = $validation.zone_address_line1.show && (
        <span className="error">
          {$validation.zone_address_line1.error.reason}
        </span>
      );
    }
    if ($validation.zone_min_amount.error.reason !== undefined) {
      errmMsgMinAmt = $validation.zone_min_amount.show && (
        <span className="error">
          {$validation.zone_min_amount.error.reason}
        </span>
      );
    }
    if ($validation.zone_delivery_charge.error.reason !== undefined) {
      errmMsgDelivery = $validation.zone_delivery_charge.show && (
        <span className="error">
          {$validation.zone_delivery_charge.error.reason}
        </span>
      );
    }
    if (
      $validation.zone_additional_delivery_charge.error.reason !== undefined
    ) {
      errmMsgAddDelivery = $validation.zone_additional_delivery_charge.show && (
        <span className="error">
          {$validation.zone_additional_delivery_charge.error.reason}
        </span>
      );
    }
    if ($validation.zone_free_delivery.error.reason !== undefined) {
      errmMsgFreeDelivery = $validation.zone_free_delivery.show && (
        <span className="error">
          {$validation.zone_free_delivery.error.reason}
        </span>
      );
    }
    if ($validation.status.error.reason !== undefined) {
      errMsgStatus = $validation.status.show && (
        <span className="error">{$validation.status.error.reason}</span>
      );
    }

    return (
      <form className="card fv-plugins-bootstrap5" id="modulefrm">
        <div className="card-body row g-3">
          <div
            className={
              errMsgSiteLoc !== "" &&
              errMsgSiteLoc !== false &&
              errMsgSiteLoc !== undefined
                ? "col-md-6 error-select error"
                : "col-md-6"
            }
          >
            <div className="form-floating form-floating-outline custm-select-box">
              <Select
                value={fields.site_location_id}
                onChange={this.handleSelectChange.bind(
                  this,
                  "site_location_id"
                )}
                placeholder="Select Site Location"
                options={this.props.siteLocation}
              />
              <label className="select-box-label">
                Site Location<span className="error">*</span>
              </label>
              {errMsgSiteLoc}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className={
                  errMsgZoneName !== "" &&
                  errMsgZoneName !== false &&
                  errMsgZoneName !== undefined
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="zone_name"
                value={fields.zone_name}
                {...$field("zone_name", (e) =>
                  onChange("zone_name", e.target.value)
                )}
              />
              <label htmlFor="zone_name">
                Zone Name <span className="error">*</span>
              </label>
              {errMsgZoneName}
            </div>
          </div>
          <div
            className={
              errMsgAvail !== "" &&
              errMsgAvail !== false &&
              errMsgAvail !== undefined
                ? "col-md-6 error-select error"
                : "col-md-6"
            }
          >
            <div className="form-floating form-floating-outline custm-select-box">
              <Select
                value={fields.zone_availability}
                onChange={this.handleSelectChange.bind(
                  this,
                  "zone_availability"
                )}
                isMulti
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
                name="zone_postal_code"
                id="zone_postal_code"
                value={fields.zone_postal_code}
                {...$field("zone_postal_code", (e) =>
                  onChange("zone_postal_code", e.target.value)
                )}
              />
              <label htmlFor="zone_postal_code">
                Postal Code<span className="error">*</span>
              </label>
              {errMsgPostalCode}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className={
                  errMssAddress !== "" &&
                  errMssAddress !== false &&
                  errMssAddress !== undefined
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="zone_address_line1"
                id="zone_address_line1"
                value={fields.zone_address_line1}
                {...$field("zone_address_line1", (e) =>
                  onChange("zone_address_line1", e.target.value)
                )}
              />
              <label htmlFor="zone_address_line1">
                Address<span className="error">*</span>
              </label>
              {errMssAddress}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className={
                  errmMsgMinAmt !== "" &&
                  errmMsgMinAmt !== false &&
                  errmMsgMinAmt !== undefined
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="zone_min_amount"
                value={fields.zone_min_amount}
                {...$field("zone_min_amount", (e) =>
                  onChange("zone_min_amount", e.target.value)
                )}
              />
              <label htmlFor="zone_min_amount">Minimum Amount</label>
              {errmMsgMinAmt}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className={
                  errmMsgDelivery !== "" &&
                  errmMsgDelivery !== false &&
                  errmMsgDelivery !== undefined
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="zone_delivery_charge"
                id="zone_delivery_charge"
                value={fields.zone_delivery_charge}
                {...$field("zone_delivery_charge", (e) =>
                  onChange("zone_delivery_charge", e.target.value)
                )}
              />
              <label htmlFor="zone_delivery_charge">Delivery Charge</label>
              {errmMsgDelivery}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className={
                  errmMsgAddDelivery !== "" &&
                  errmMsgAddDelivery !== false &&
                  errmMsgAddDelivery !== undefined
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="zone_additional_delivery_charge"
                id="zone_additional_delivery_charge"
                value={fields.zone_additional_delivery_charge}
                {...$field("zone_additional_delivery_charge", (e) =>
                  onChange("zone_additional_delivery_charge", e.target.value)
                )}
              />
              <label htmlFor="zone_additional_delivery_charge">
                Additional Delivery Charge
              </label>
              {errmMsgAddDelivery}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className={
                  errmMsgFreeDelivery !== "" &&
                  errmMsgFreeDelivery !== false &&
                  errmMsgFreeDelivery !== undefined
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="zone_free_delivery"
                id="zone_free_delivery"
                value={fields.zone_free_delivery}
                {...$field("zone_free_delivery", (e) =>
                  onChange("zone_free_delivery", e.target.value)
                )}
              />
              <label htmlFor="zone_free_delivery">Free Delivery</label>
              {errmMsgFreeDelivery}
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
          <div className="col-md-12">
            <input type="text" id="rangess" />
            <iframe
              allow="true"
              src="https://marketplace.goepicware.com/camppanel/zone/add"
              title=""
              height="520"
              name="zonemap"
              id="zonemap"
              width="100%"
            ></iframe>
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
            <Link to={"/clientpanel/zone"}>
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
Form = validated(validationConfig)(Form);
