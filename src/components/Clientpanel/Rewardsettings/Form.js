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
var module = "clientpanel/rewardsettings/";
var moduleName = "Rewards Settings";
var modulePath = "/clientpanel/rewardsettings";
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
      rewardsRowData: [],
      productList: [],
      productListOptions: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.loadRewardsettingsDetail();
    this.loadproductList();

    if (this.state.editID !== "") {
      var params = {
        params: "company_id=" + CompanyID() + "&detail_id=" + this.state.editID,
        url: apiUrl + module + "details",
        type: "client",
      };
      this.setState({ pageloading: true });
      this.props.getDetailData(params);
    }

    /*let rewardsRowData = [
      {
        "reward_pointstoreach": 100,
        "reward_freeproduct_id": "4F34CA16-4FBB-4802-80BA-C117A0F58451",
        "reward_freeproduct_name": "Equate Somerset - Matcha Latte",
        "reward_expirydays": 7
      },
      {
        "reward_pointstoreach": 200,
        "reward_freeproduct_id": "E7118197-6033-4AFE-86ED-C1951B633873",
        "reward_freeproduct_name": "Tsuta Takashimaya - Yu Sheng Add Ons - Rest - Abalone ( 1 Can )",
        "reward_expirydays": 10
      },
      {
        "reward_pointstoreach": 300,
        "reward_freeproduct_id": "D2D6B616-4EE9-48BF-8528-43102976E131",
        "reward_freeproduct_name": "Project Burgs Vivo - Minute Maid - Orange - Regular",
        "reward_expirydays": 20
      }];
      this.setState({ rewardsRowData: rewardsRowData });*/ 
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

  loadRewardsettingsDetail() {
    this.setState({ pageloading: true });
    var urlShringTxt = apiUrl + module + "list?company_id=" + CompanyID();
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ rewardsRowData: res.data.result, pageloading: false});
      } else {
        let rewardsRowData = [
          {
            "reward_pointstoreach": 0,
            "reward_freeproduct_id": "",
            "reward_freeproduct_name": "",
            "reward_expirydays": 0
          }];
        this.setState({ rewardsRowData: rewardsRowData, pageloading: false});
      }
    });
  }

  loadproductList() {
    this.setState({ pageloading: true });
    var urlShringTxt =
      apiUrl + "clientpanel/paintbasedproducts/simpleproductlist?company_id=" + CompanyID();
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ productList: res.data.result, pageloading: false },
          function () {
              var tempVal = '';
              this.productListOption(tempVal);
          });
      }
    });
  }

  productListOption = (selectedId) => {
    var productList = this.state.productList;
    if(selectedId != '' && selectedId != null  && selectedId != undefined) {
      var productLstHtml = productList.map((productlst, proInt) => {
      if(selectedId == productlst.product_id) {
        return ({value: productlst.product_id,label: productlst.product_name});
      }
    });
    return (productLstHtml != '')?productLstHtml:'';
    } else {
      var productLstHtml = productList.map((productlst, proInt) => {
          return ({value: productlst.product_id,label: productlst.product_name});
      });
      this.setState({ productListOptions: productLstHtml });
    }
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
    var rewardsRowData = this.state.rewardsRowData;
    if(field=='plus') {
      rewardsRowData.push({
        "reward_pointstoreach": 0,
        "reward_freeproduct_id": "",
        "reward_freeproduct_name": "",
        "reward_expirydays": 0
      });
      
    } else if(field=='minus') {
      rewardsRowData.splice(rowval, 1);
    } else if(field=='reward_freeproduct') {
      rewardsRowData[rowval]['reward_freeproduct_id'] = value.value;
      rewardsRowData[rowval]['reward_freeproduct_name'] = value.label;  
    } else {
      rewardsRowData[rowval][field] = value;
    }
    this.setState({ rewardsRowData: rewardsRowData });
  };

  handleSubmit = () => {
    showLoader("submit_frm", "class");
    var postData = this.state.rewardsRowData;
    var postObject = {
      rewardsRowData: postData,
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
          <Header {...this.props} currentPage={"rewardsettings"} />
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
                  rewardsRowData={this.state.rewardsRowData}
                  memberShipData={this.state.memberShipData}
                  productList={this.state.productList}
                  productListOptions={this.state.productListOptions}
                  productListOption={this.productListOption}
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
    this.props.onChange(name, value, incrt);
  }

  handlePlusMinusAct(actn, incrt) {
    this.props.onChange(actn, actn, incrt);
  }
  
  rewardsRowView(fields,$field, onChange) {
    var productListOptions = this.props.productListOptions;
    var rewardsRowData = this.props.rewardsRowData;
    if(rewardsRowData != undefined && rewardsRowData != '' && Object.keys(rewardsRowData).length > 0) {
    var rewardsRowCount = Object.keys(rewardsRowData).length;
    const rewardsRowHtml = rewardsRowData.map((rewardsRow, rwInt) => {
      let rwIntCnt = rwInt + 1;
      let reward_freeproduct = (rewardsRow.reward_freeproduct_id != '') ? {value: rewardsRow.reward_freeproduct_id,label: rewardsRow.reward_freeproduct_name} : '';    
      return (<div className={"rewards-row row"}>

                <div className="col-md-3">
                  <div className="form-floating form-floating-outline mb-4">
                    <input
                      type="text"
                      className="form-control"
                      name="reward_pointstoreach"
                      value={(Object.keys(rewardsRow).length > 0) ? rewardsRow.reward_pointstoreach: ''}
                      {...$field("reward_pointstoreach", (e) =>
                        onChange("reward_pointstoreach", e.target.value, rwInt)
                      )}
                    />
                    <label htmlFor="reward_pointstoreach">Points To Reach</label>
                  </div>
                </div>

                <div className="col-md-4 reward_freeproduct_id">
                  <div className="form-floating form-floating-outline custm-select-box mb-4">
                      <Select
                        value={reward_freeproduct}
                        placeholder={"Select Products"}
                        onChange={this.handleChangeTierAct.bind(
                          this,
                          "reward_freeproduct",
                          rwInt
                        )}
                        options={productListOptions}
                      />
                      <label className="select-box-label">
                        Free Products
                      </label>
                    </div>
                  </div>

                <div className="col-md-3">
                  <div className="form-floating form-floating-outline mb-4">
                    <input
                      type="text"
                      className="form-control"
                      name="reward_expirydays"
                      value={(Object.keys(rewardsRow).length > 0) ? rewardsRow.reward_expirydays: ''}
                      {...$field("reward_expirydays", (e) =>
                        onChange("reward_expirydays", e.target.value, rwInt)
                      )}
                    />
                    <label htmlFor="reward_expirydays">Expiry days</label>
                  </div>
                </div>
                {(rewardsRowCount == rwIntCnt)?<div className="col-md-2 act-plusminus-maindiv">
                  {(rwIntCnt != 1)&&<span className="act-minus-icon" onClick={this.handlePlusMinusAct.bind(this,"minus",rwInt)}><i className="mdi mdi-minus-circle-outline"></i></span>}
                  <span className="act-plus-icon" onClick={this.handlePlusMinusAct.bind(this,"plus",rwInt)}><i className="mdi mdi-plus-circle-outline"></i></span>
                </div>:<div className="col-md-2 act-plusminus-maindiv">
                  <span className="act-minus-icon" onClick={this.handlePlusMinusAct.bind(this,"minus",rwInt)}><i className="mdi mdi-minus-circle-outline"></i></span>
                </div>}

            </div>); 

    });


    return rewardsRowHtml;

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
            {this.rewardsRowView(fields,$field, onChange)}
        </div>
        <div className="row g-3">
        <div
            className="pt-1 pb-4 pr-2 text-end"
            style={{ paddingRight: "20px" }}
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
