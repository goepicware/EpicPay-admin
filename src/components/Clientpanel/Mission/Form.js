/* eslint-disable */
import React, { Component } from "react";
import cookie from "react-cookies";
import axios from "axios";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  isSingleSelect,
  isValidPrice,
  isNumber,
} from "../../Helpers/SettingHelper";
import PageLoader from "../../Helpers/PageLoader";
import Header from "../Layout/Header";
import Topmenu from "../Layout/Topmenu";
import Footer from "../Layout/Footer";
import Editor from "../Layout/Editor";
import AWS from "aws-sdk";
AWS.config.update(awsCredentials);
const s3 = new AWS.S3();
var module = "clientpanel/missionsettings/";
var moduleName = "Mission";
var modulePath = "/clientpanel/mission";
import { format } from "date-fns";
class Form extends Component {
  constructor(props) {
    super(props);
    var editID = "";
    this.state = {
      editID: editID,
      pageloading: false,
      clientdata: {
        product_name: "test",
        action: "add",
      },
      loading: true,
      formpost: [],
      missionRowData: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.loadMissionsettingsDetail();
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
  }

  loadMissionsettingsDetail() {
    this.setState({ pageloading: true });
    var urlShringTxt = apiUrl + module + "list?company_id=" + CompanyID();
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ missionRowData: res.data.result, pageloading: false});
      } else {
        let missionRowData = [
          {
            "mission_type": "Monthly",
            "mission_noof_transaction": 0,
            "mission_bonus_points": 0,
            "mission_bonuspoints_validity": 30,
            "mission_info_icon": ""
          }];
        this.setState({ missionRowData: missionRowData, pageloading: false});
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
  fieldChange = (field, value, rowval) => {
    var missionRowData = this.state.missionRowData;
    if(field=='plus') {
      missionRowData.push({
        "mission_type": "Monthly",
        "mission_noof_transaction": 0,
        "mission_bonus_points": 0,
        "mission_bonuspoints_validity": 30,
        "mission_info_icon": ""
      });
      
    } else if(field=='minus') {
      missionRowData.splice(rowval, 1);
    } else {
      missionRowData[rowval][field] = value;
    }
    this.setState({ missionRowData: missionRowData });
  };

  handleSubmit = () => {
    showLoader("submit_frm", "class");
    var postData = this.state.missionRowData;
    var postObject = {
      missionRowData: postData,
      loginID: userID(),
      company_admin_id: clientID(),
      company_id: CompanyID(),
    };
    var post_url = module + "update";
    this.props.getFormPost(postObject, post_url, "client");
  };

  render() {
    return (
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <Header {...this.props} currentPage={"mission"} />
          <div className="layout-page">
            <Topmenu />
            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row mb-3">
                  <div className="col-lg-10 col-md-6">
                    <h4 className="fw-bold">
                      {moduleName}
                    </h4>
                  </div>
                  <div className="col-lg-2 col-md-6 text-end">
                  </div>
                </div>
                <PostForm
                  {...this.props}
                  fields={this.state.clientdata}
                  onChange={this.fieldChange}
                  onValid={this.handleSubmit}
                  error_msg={this.state.error_msg}
                  missionRowData={this.state.missionRowData}
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

export default connect(mapStateTopProps, mapDispatchToProps)(Form);

function validationConfig(props) {
  const {
    product_name
  } = props.fields;

  return {
    fields: [
      "product_name"
    ],

    validations: {
      product_name: [[isEmpty, product_name]]
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
  handleChangeTierAct(name, incrt, value) {
    this.props.onChange(name, value.value, incrt);
  }

  handlePlusMinusAct(actn, incrt) {
    this.props.onChange(actn, actn, incrt);
  }

  async uplaodFiles(imageType, rwInt) {
    var imagefile = document.querySelector("#" + imageType+"_"+rwInt);
    const file = imagefile.files[0];
    const params = {
      Bucket: bucketName,
      Key: `media/${foldername}/category/${file.name}`,
      Body: file,
      ACL: "public-read",
    };
    const { Location } = await s3.upload(params).promise();
    this.props.onChange(imageType, Location, rwInt);
    $("#" + imageType+"_"+rwInt).val("");
  }

  async removeImage(fileNamme, imageType, rwInt) {
    var fileNammeSplit = fileNamme.split("/");
    var params = {
      Bucket: bucketName,
      Key: `media/${foldername}/category/${
        fileNammeSplit[fileNammeSplit.length - 1]
      }`,
    };
    await s3.deleteObject(params).promise();
    this.props.onChange(imageType, "", rwInt);
  }
  
  missionsRowView(fields,$field, onChange) {
    var missionTypeOptions = [{value: "Monthly",label: "Monthly"},{value: "Weekly",label: "Weekly"}];
    var missionRowData = this.props.missionRowData;
    if(missionRowData != undefined && missionRowData != '' && Object.keys(missionRowData).length > 0) {
    var missionsRowCount = Object.keys(missionRowData).length;
    const missionsRowHtml = missionRowData.map((missionsRow, rwInt) => {
      let rwIntCnt = rwInt + 1;
      let mission_typeval = (missionsRow.mission_type != '') ? {value: missionsRow.mission_type,label: missionsRow.mission_type} : {value: "Monthly",label: "Monthly"};    
      return (<div className={"rewards-row row"}>

                <div className="col-md-2 mission_type">
                  <div className="form-floating form-floating-outline custm-select-box mb-4">
                      <Select
                        value={mission_typeval}
                        placeholder={"Select Type"}
                        onChange={this.handleChangeTierAct.bind(
                          this,
                          "mission_type",
                          rwInt
                        )}
                        options={missionTypeOptions}
                      />
                      <label className="select-box-label">
                      Mission Type
                      </label>
                    </div>
                </div>

                <div className="col-md-2 mission_nooftransaction">
                  <div className="form-floating form-floating-outline mb-4">
                    <input
                      type="text"
                      className="form-control"
                      name="mission_noof_transaction"
                      value={(Object.keys(missionsRow).length > 0) ? missionsRow.mission_noof_transaction: ''}
                      {...$field("mission_noof_transaction", (e) =>
                        onChange("mission_noof_transaction", e.target.value, rwInt)
                      )}
                    />
                    <label htmlFor="mission_noof_transaction">N<sup>th</sup> Transaction</label>
                  </div>
                </div>

                <div className="col-md-1 mission_bonus_points_maindiv">
                  <div className="form-floating form-floating-outline mb-4">
                    <input
                      type="text"
                      className="form-control"
                      name="mission_bonus_points"
                      value={(Object.keys(missionsRow).length > 0) ? missionsRow.mission_bonus_points: ''}
                      {...$field("mission_bonus_points", (e) =>
                        onChange("mission_bonus_points", e.target.value, rwInt)
                      )}
                    />
                    <label htmlFor="mission_bonus_points">Bonus Points</label>
                  </div>
                </div>

                <div className="col-md-1 mission_bonuspoints_validity_maindiv" style={{display:'none'}}>
                  <div className="form-floating form-floating-outline mb-4">
                    <input
                      type="text"
                      className="form-control"
                      name="mission_bonuspoints_validity"
                      value={(Object.keys(missionsRow).length > 0) ? missionsRow.mission_bonuspoints_validity: ''}
                      {...$field("mission_bonuspoints_validity", (e) =>
                        onChange("mission_bonuspoints_validity", e.target.value, rwInt)
                      )}
                    />
                    <label htmlFor="mission_bonuspoints_validity">Validity(days)</label>
                  </div>
                </div>

                <div className="col-md-4 mission_icon_div">
                  <div className="form-floating form-floating-outline mb-4">
                    <div className="mb-3">
                      <input
                        className="form-control"
                        type="file"
                        id={"mission_info_icon_"+rwInt}
                        onChange={(event) => {
                          this.uplaodFiles("mission_info_icon", rwInt, event);
                          return false;
                        }}
                      />
                    </div>
                  </div>
                  {((Object.keys(missionsRow).length > 0) && missionsRow.mission_info_icon !== "" && missionsRow.mission_info_icon !== null && missionsRow.mission_info_icon !== undefined) && (
                    <div className="dz-preview dz-processing dz-image-preview dz-success dz-complete">
                      <div className="dz-details">
                        <div className="dz-thumbnail">
                          <img alt="" src={missionsRow.mission_info_icon} />
                        </div>
                      </div>
                      <a
                        className="dz-remove"
                        href={void 0}
                        onClick={this.removeImage.bind(
                          this,
                          missionsRow.mission_info_icon,
                          "mission_info_icon",
                          rwInt
                        )}
                      >
                        Remove
                      </a>
                    </div>
                  )}
                </div>


                {(missionsRowCount == rwIntCnt)?<div className="col-md-2 act-plusminus-maindiv">
                  {(rwIntCnt != 1)&&<span className="act-minus-icon" onClick={this.handlePlusMinusAct.bind(this,"minus",rwInt)}><i className="mdi mdi-minus-circle-outline"></i></span>}
                  <span className="act-plus-icon" onClick={this.handlePlusMinusAct.bind(this,"plus",rwInt)}><i className="mdi mdi-plus-circle-outline"></i></span>
                </div>:<div className="col-md-2 act-plusminus-maindiv">
                  <span className="act-minus-icon" onClick={this.handlePlusMinusAct.bind(this,"minus",rwInt)}><i className="mdi mdi-minus-circle-outline"></i></span>
                </div>}

            </div>); 

    });


    return missionsRowHtml;

  } else {
    return '';
  }


  }

  render() {
    const { fields, onChange, onValid, onInvalid, $field, $validation } =
      this.props;

    return (
      <form className="card fv-plugins-bootstrap5 reward-setting-maindiv" id="modulefrm">
        <div className="card-body row g-3 pt-5">
            {this.missionsRowView(fields,$field, onChange)}
        </div>
        <div className="row g-3">
        <div
            className="pt-1 pb-4 pr-2 text-end123"
            style={{ paddingRight: "20px", textAlign: "center" }}
          >
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
PostForm = validated(validationConfig)(PostForm);
