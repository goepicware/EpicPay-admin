import React from "react";
/* import { render } from "react-dom"; */
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { getStore } from "./store";

import "./assets/vendor/fonts/materialdesignicons.css";
import "./assets/vendor/fonts/fontawesome.css";
import "./assets/vendor/css/rtl/core.css";
import "./assets/vendor/css/rtl/theme-default.css";
import "./assets/css/demo.css";
import "./assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css";
import "./assets/vendor/libs/node-waves/node-waves.css";
import "./assets/vendor/libs/typeahead-js/typeahead.css";
import "./assets/vendor/libs/formvalidation/dist/css/formValidation.min.css";
import "./assets/vendor/css/pages/page-auth.css";
import "./assets/vendor/libs/toastr/toastr.css";
import "./assets/vendor/libs/dropzone/dropzone.css";

import "./common/css/slick.css";
import "./common/css/custom.css";

import Login from "./components/Masterpanel/Auth/Login";
import Dashboard from "./components/Masterpanel/Dashboard/Dashboard";
import Clientlist from "./components/Masterpanel/Client/List";
import Clientform from "./components/Masterpanel/Client/Clientform";
import CmCategorylist from "./components/Masterpanel/Category/List";
import CmCategoryform from "./components/Masterpanel/Category/Categoryform";
//import Logout from "./components/Myaccount/Logout";

import Clientlogin from "./components/Clientpanel/Auth/Login";
import Clientdashboard from "./components/Clientpanel/Dashboard/Dashboard";
import Outletlist from "./components/Clientpanel/Outlet/List";
import Outletform from "./components/Clientpanel/Outlet/Form";
import Zonelist from "./components/Clientpanel/Zone/List";
import Zoneform from "./components/Clientpanel/Zone/Zoneform";
import Pagelist from "./components/Clientpanel/Pages/List";
import Pageform from "./components/Clientpanel/Pages/Form";
import Staticblocklist from "./components/Masterpanel/Staticblock/List";
import Staticblockform from "./components/Masterpanel/Staticblock/Form";
import Bannerlist from "./components/Masterpanel/Banner/List";
import Bannerform from "./components/Masterpanel/Banner/Form";
import Emailtemplatelist from "./components/Masterpanel/Emailtemplate/List";
import Emailtemplateform from "./components/Masterpanel/Emailtemplate/Form";
import Userroleslist from "./components/Clientpanel/Userroles/List";
import Userrolesform from "./components/Clientpanel/Userroles/Form";
import Userlist from "./components/Clientpanel/User/List";
import Userform from "./components/Clientpanel/User/Form";
import Promotionlist from "./components/Clientpanel/Promotion/List";
import Promotionform from "./components/Clientpanel/Promotion/Form";
import Wallettopupplanlist from "./components/Clientpanel/Wallettopupplan/List";
import Wallettopupplanform from "./components/Clientpanel/Wallettopupplan/Form";
import Wallettopuphistorylist from "./components/Clientpanel/Wallettopuphistory/List";
import Customerlist from "./components/Clientpanel/Customer/List";
import Customerform from "./components/Clientpanel/Customer/Form";
import Categorylist from "./components/Clientpanel/Category/List";
import Categoryform from "./components/Clientpanel/Category/Form";
import Subcategorylist from "./components/Clientpanel/Subcategory/List";
import Subcategoryform from "./components/Clientpanel/Subcategory/Form";
import Productslist from "./components/Clientpanel/Products/List";
import Productsform from "./components/Clientpanel/Products/Form";
import Subscriptionlist from "./components/Clientpanel/Subscription/List";
import Subscriptionform from "./components/Clientpanel/Subscription/Form";
import Crmsettingsform from "./components/Clientpanel/Crmsettings/Form";
import Rewardsettingsform from "./components/Clientpanel/Rewardsettings/Form";
import Missionform from "./components/Masterpanel/Mission/Form";
import Pointssettingsform from "./components/Masterpanel/Pointssettings/Form";
import Timeslotlist from "./components/Clientpanel/Timeslot/List";
import Timeslotform from "./components/Clientpanel/Timeslot/Form";
import Tagslist from "./components/Clientpanel/Tags/List";
import Tagsform from "./components/Clientpanel/Tags/Form";
import Pointslist from "./components/Clientpanel/Points/List";
import Pointsform from "./components/Clientpanel/Points/Form";
import Settingsform from "./components/Clientpanel/Settings/Form";
import ReferralHistory from "./components/Clientpanel/ReferralHistory/List";

import Refpage from "./components/Layout/Refpage";
import Logout from "./components/Layout/Logout";
import Page404 from "./Page404";

const store = getStore();
const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <Router>
      <Switch>
        {/*  Master Admin Start*/}
        <Route exact path="/" component={Clientlogin} />
        <Route exact path="/masterpanel" component={Login} />
        <Route exact path="/masterpanel/dashboard" component={Dashboard} />
        <Route exact path="/masterpanel/client" component={Clientlist} />
        <Route exact path="/masterpanel/client/add" component={Clientform} />
        <Route
          exact
          path="/masterpanel/client/edit/:clientID"
          component={Clientform}
        />
        <Route exact path="/masterpanel/category" component={CmCategorylist} />
        <Route
          exact
          path="/masterpanel/category/add"
          component={CmCategoryform}
        />
        <Route
          exact
          path="/masterpanel/category/edit/:categoryID"
          component={CmCategoryform}
        />
        <Route path={"/logout/:LoginType"} component={Logout} />
        <Route path={"/logout"} component={Logout} />
        {/*  Master Admin End*/}

        {/*  Client Panel Start*/}
        <Route
          path={"/clientpanel/login/:LoginType/:clientID"}
          component={Clientlogin}
        />
        <Route exact path="/clientpanel/login" component={Clientlogin} />
        <Route
          exact
          path="/clientpanel/dashboard"
          component={Clientdashboard}
        />

        <Route exact path="/clientpanel/outlet/" component={Outletlist} />
        <Route exact path="/clientpanel/outlet/add" component={Outletform} />
        <Route
          exact
          path="/clientpanel/outlet/edit/:EditID"
          component={Outletform}
        />
        <Route exact path="/clientpanel/zone/" component={Zonelist} />
        <Route exact path="/clientpanel/zone/add" component={Zoneform} />
        <Route
          exact
          path="/clientpanel/zone/edit/:EditID"
          component={Zoneform}
        />
        <Route exact path="/clientpanel/pages/" component={Pagelist} />
        <Route exact path="/clientpanel/pages/add" component={Pageform} />
        <Route
          exact
          path="/clientpanel/pages/edit/:EditID"
          component={Pageform}
        />
        <Route
          exact
          path="/masterpanel/staticblock/"
          component={Staticblocklist}
        />
        <Route
          exact
          path="/masterpanel/staticblock/add"
          component={Staticblockform}
        />
        <Route
          exact
          path="/masterpanel/staticblock/edit/:EditID"
          component={Staticblockform}
        />
        <Route exact path="/masterpanel/banner/" component={Bannerlist} />
        <Route exact path="/masterpanel/banner/add" component={Bannerform} />
        <Route
          exact
          path="/masterpanel/banner/edit/:EditID"
          component={Bannerform}
        />
        <Route
          exact
          path="/masterpanel/emailtemplate/"
          component={Emailtemplatelist}
        />
        <Route
          exact
          path="/masterpanel/emailtemplate/add"
          component={Emailtemplateform}
        />
        <Route
          exact
          path="/masterpanel/emailtemplate/edit/:EditID"
          component={Emailtemplateform}
        />
        <Route exact path="/clientpanel/userroles/" component={Userroleslist} />
        <Route
          exact
          path="/clientpanel/userroles/add"
          component={Userrolesform}
        />
        <Route
          exact
          path="/clientpanel/userroles/edit/:EditID"
          component={Userrolesform}
        />
        <Route exact path="/clientpanel/users/" component={Userlist} />
        <Route exact path="/clientpanel/users/add" component={Userform} />
        <Route
          exact
          path="/clientpanel/users/edit/:EditID"
          component={Userform}
        />
        <Route
          exact
          path="/clientpanel/referral/"
          component={ReferralHistory}
        />
        <Route
          exact
          path="/clientpanel/promotions/"
          component={Promotionlist}
        />
        <Route
          exact
          path="/clientpanel/promotions/add"
          component={Promotionform}
        />
        <Route
          exact
          path="/clientpanel/promotions/edit/:EditID"
          component={Promotionform}
        />
        <Route
          exact
          path="/clientpanel/wallettopupplan/"
          component={Wallettopupplanlist}
        />
        <Route
          exact
          path="/clientpanel/wallettopupplan/add"
          component={Wallettopupplanform}
        />
        <Route
          exact
          path="/clientpanel/wallettopupplan/edit/:EditID"
          component={Wallettopupplanform}
        />
        <Route
          exact
          path="/clientpanel/wallettopuphistory/"
          component={Wallettopuphistorylist}
        />
        <Route
          exact
          path="/clientpanel/crmsettings/"
          component={Crmsettingsform}
        />
        <Route
          exact
          path="/clientpanel/rewardsettings/"
          component={Rewardsettingsform}
        />
        <Route exact path="/masterpanel/mission/" component={Missionform} />
        <Route
          exact
          path="/masterpanel/pointssettings/"
          component={Pointssettingsform}
        />
        <Route exact path="/clientpanel/customers/" component={Customerlist} />
        <Route
          exact
          path="/clientpanel/customers/add"
          component={Customerform}
        />
        <Route
          exact
          path="/clientpanel/customers/edit/:EditID"
          component={Customerform}
        />
        <Route
          exact
          path="/clientpanel/catalog-categories/"
          component={Categorylist}
        />
        <Route
          exact
          path="/clientpanel/catalog-categories/add"
          component={Categoryform}
        />
        <Route
          exact
          path="/clientpanel/catalog-categories/edit/:EditID"
          component={Categoryform}
        />
        <Route
          exact
          path="/clientpanel/catalog-subcategories/"
          component={Subcategorylist}
        />
        <Route
          exact
          path="/clientpanel/catalog-subcategories/add"
          component={Subcategoryform}
        />
        <Route
          exact
          path="/clientpanel/catalog-subcategories/edit/:EditID"
          component={Subcategoryform}
        />
        <Route
          exact
          path="/clientpanel/catalog-products/"
          component={Productslist}
        />
        <Route
          exact
          path="/clientpanel/catalog-products/add"
          component={Productsform}
        />
        <Route
          exact
          path="/clientpanel/catalog-products/edit/:EditID"
          component={Productsform}
        />
        <Route
          exact
          path="/clientpanel/subscription/"
          component={Subscriptionlist}
        />
        <Route
          exact
          path="/clientpanel/subscription/add"
          component={Subscriptionform}
        />
        <Route
          exact
          path="/clientpanel/subscription/edit/:EditID"
          component={Subscriptionform}
        />
        <Route exact path="/clientpanel/timeslot/" component={Timeslotlist} />
        <Route
          exact
          path="/clientpanel/timeslot/add"
          component={Timeslotform}
        />
        <Route
          exact
          path="/clientpanel/timeslot/edit/:EditID"
          component={Timeslotform}
        />
        <Route exact path="/clientpanel/catalog-tag/" component={Tagslist} />
        <Route exact path="/clientpanel/catalog-tag/add" component={Tagsform} />
        <Route
          exact
          path="/clientpanel/catalog-tag/edit/:EditID"
          component={Tagsform}
        />
        <Route exact path="/clientpanel/points/" component={Pointslist} />
        <Route exact path="/clientpanel/points/:Type" component={Pointsform} />
        <Route exact path="/clientpanel/settings" component={Settingsform} />

        {/*  Client Panel Start*/}
        <Route path={"/refpage/:slugtext"} component={Refpage} />
        <Route component={Page404} />
      </Switch>
    </Router>
  </Provider>
);
