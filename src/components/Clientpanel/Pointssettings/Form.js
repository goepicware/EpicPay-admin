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
var module = "clientpanel/pointssettings/";
var moduleName = "Points Settings";
var modulePath = "/clientpanel/pointssettings";
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
      pointsRowData: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.loadPointssettingsDetail();
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

  loadPointssettingsDetail() {
    this.setState({ pageloading: true });
    var urlShringTxt = apiUrl + module + "list?company_id=" + CompanyID();
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ pointsRowData: res.data.result, pageloading: false});
      } else {
        let pointsRowData = [
          {
            "pntset_registration_bonuspoints": 0,
            "pntset_referrals_signup_bonuspoints": 0,
            "pntset_first_transaction_bonuspoints": 0,
            "pntset_referralspoints_validity": 30,
            "pntset_referee_signup_bonuspoints": 0,
            "pntset_referee_firsttransaction_bonuspoints": 0,
            "pntset_refereepoints_validity": 30
          }];
        this.setState({ pointsRowData: pointsRowData, pageloading: false});
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
  fieldChange = (field, value, rowval=0) => {
    var pointsRowData = this.state.pointsRowData;
    pointsRowData[rowval][field] = value;
    this.setState({ pointsRowData: pointsRowData });
  };

  handleSubmit = () => {
    showLoader("submit_frm", "class");
    var postData = this.state.pointsRowData;
    var postObject = {
      pointsRowData: postData,
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
          <Header {...this.props} currentPage={"pointssettings"} />
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
                  pointsRowData={this.state.pointsRowData}
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
  
  missionsRowView(fields,$field, onChange) {
    var pointsRowData = this.props.pointsRowData;
    if(pointsRowData != undefined && pointsRowData != '' && Object.keys(pointsRowData).length > 0) {
    var pointsRowDataArr = pointsRowData[0];
    
      return (<div className={"points-row"}>
                <p>Referrer points setting</p>
                <div className="row">
                {/*<div className="col-md-4">
                  <div className="form-floating form-floating-outline mb-4">
                    <input
                      type="text"
                      className="form-control"
                      name="pntset_registration_bonuspoints"
                      value={(Object.keys(pointsRowDataArr).length > 0) ? pointsRowDataArr.pntset_registration_bonuspoints: 0}
                      {...$field("pntset_registration_bonuspoints", (e) =>
                        onChange("pntset_registration_bonuspoints", e.target.value, 0)
                      )}
                    />
                    <label htmlFor="pntset_registration_bonuspoints">Registration Bonus</label>
                  </div>
                </div>*/}

                <div className="col-md-4">
                  <div className="form-floating form-floating-outline mb-4">
                    <input
                      type="text"
                      className="form-control"
                      name="pntset_referrals_signup_bonuspoints"
                      value={(Object.keys(pointsRowDataArr).length > 0) ? pointsRowDataArr.pntset_referrals_signup_bonuspoints: 0}
                      {...$field("pntset_referrals_signup_bonuspoints", (e) =>
                        onChange("pntset_referrals_signup_bonuspoints", e.target.value, 0)
                      )}
                    />
                    <label htmlFor="pntset_referrals_signup_bonuspoints">Referrals Signup Points</label>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-floating form-floating-outline mb-4">
                    <input
                      type="text"
                      className="form-control"
                      name="pntset_first_transaction_bonuspoints"
                      value={(Object.keys(pointsRowDataArr).length > 0) ? pointsRowDataArr.pntset_first_transaction_bonuspoints: ''}
                      {...$field("pntset_first_transaction_bonuspoints", (e) =>
                        onChange("pntset_first_transaction_bonuspoints", e.target.value, 0)
                      )}
                    />
                    <label htmlFor="pntset_first_transaction_bonuspoints">Referee 1<sup>st</sup> Transaction Bonus Points</label>
                  </div>
                </div>

                <div className="col-md-4"  style={{display:'none'}}>
                  <div className="form-floating form-floating-outline mb-4">
                    <input
                      type="text"
                      className="form-control"
                      name="pntset_referralspoints_validity"
                      value={(Object.keys(pointsRowDataArr).length > 0) ? pointsRowDataArr.pntset_referralspoints_validity: ''}
                      {...$field("pntset_referralspoints_validity", (e) =>
                        onChange("pntset_referralspoints_validity", e.target.value, 0)
                      )}
                    />
                    <label htmlFor="pntset_referralspoints_validity">Bonus Points Validity( days )</label>
                  </div>
                </div>

              </div>
              
              <div className="row">
              <p>Referee points setting</p> 
              <div className="col-md-4">
                  <div className="form-floating form-floating-outline mb-4">
                    <input
                      type="text"
                      className="form-control"
                      name="pntset_referee_signup_bonuspoints"
                      value={(Object.keys(pointsRowDataArr).length > 0) ? pointsRowDataArr.pntset_referee_signup_bonuspoints: 0}
                      {...$field("pntset_referee_signup_bonuspoints", (e) =>
                        onChange("pntset_referee_signup_bonuspoints", e.target.value, 0)
                      )}
                    />
                    <label htmlFor="pntset_referee_signup_bonuspoints">Referee Signup Points</label>
                  </div>
                </div>
              <div className="col-md-4">
                  <div className="form-floating form-floating-outline mb-4">
                    <input
                      type="text"
                      className="form-control"
                      name="pntset_referee_firsttransaction_bonuspoints"
                      value={(Object.keys(pointsRowDataArr).length > 0) ? pointsRowDataArr.pntset_referee_firsttransaction_bonuspoints: ''}
                      {...$field("pntset_referee_firsttransaction_bonuspoints", (e) =>
                        onChange("pntset_referee_firsttransaction_bonuspoints", e.target.value, 0)
                      )}
                    />
                    <label htmlFor="pntset_referee_firsttransaction_bonuspoints">Referee 1<sup>st</sup> Transaction Bonus Points</label>
                  </div>
                </div>

                <div className="col-md-4" style={{display:'none'}}>
                  <div className="form-floating form-floating-outline mb-4">
                    <input
                      type="text"
                      className="form-control"
                      name="pntset_refereepoints_validity"
                      value={(Object.keys(pointsRowDataArr).length > 0) ? pointsRowDataArr.pntset_refereepoints_validity: ''}
                      {...$field("pntset_refereepoints_validity", (e) =>
                        onChange("pntset_refereepoints_validity", e.target.value, 0)
                      )}
                    />
                    <label htmlFor="pntset_refereepoints_validity">Bonus Points Validity( days )</label>
                  </div>
                </div>

              </div>


            </div>);


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
