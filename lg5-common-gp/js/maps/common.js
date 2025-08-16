// ajax default send type setting
var commonSendType = "post";
// grid
if (location.port == "3000") $("body").addClass("show-grid");

var treasureDataFlag; // LGEITF-182
var digitalDataLayer = [];
// for debug
var DEBUG = false;
function debugMarkup() {
  DEBUG = true;
  $(".component").each(function () {
    var $obj = $(this);
    var css = $obj.attr("class").replace("component ", "").substr(0, 7);
    if ($(this).parent().is(".component-wrap")) {
      $(this)
        .parent()
        .css({ outline: "2px dashed rgb(14, 222, 51)" })
        .append(
          '<div style="position:absolute;right:0;top:0;padding:0 20px;background:rgb(14, 222, 51);opacity:0.5;text-transform:none;color:#fff;z-index:1000;">' +
            css +
            "</div>"
        )
        .find(".component")
        .css({ border: "2px dashed  #03A9F4" });
    } else {
      $(this)
        .css({ outline: "2px dashed #03A9F4" })
        .append(
          '<div style="position:absolute;right:0;top:0;padding:0 20px;background:#03A9F4;opacity:0.5;text-transform:none;color:#fff;z-index:1000;">' +
            css +
            "</div>"
        );
    }
  });
  $("h1, h2, h3, h4, h5, h6").each(function () {
    $(this).css({ outline: "5px dashed red" });
  });
  $("body").append(
    "<style>h1:before {content:'h1';color:red;font-size:12px;font-weight:700;position:absolute;margin:0 0 0 -30px;}h2:before {content:'h2';color:red;font-size:12px;font-weight:700;position:absolute;margin:0 0 0 -30px;}h3:before {content:'h3';color:red;font-size:12px;font-weight:700;position:absolute;margin:0 0 0 -30px;}h4:before {content:'h4';color:red;font-size:12px;font-weight:700;position:absolute;margin:0 0 0 -30px;}h5:before {content:'h5';color:red;font-size:12px;font-weight:700;position:absolute;margin:0 0 0 -30px;}h6:before {content:'h6';color:red;font-size:12px;font-weight:700;position:absolute;margin:0 0 0 -30px;}</style>"
  );
}
var testCookie = function () {
  console.log("s_ppv", getCookie("s_ppv"));
  debugMarkup();
  setTimeout(function () {
    ePrivacyCookies.controlCookieList();
  }, 100);
  setTimeout(function () {
    console.log("s_ppv", getCookie("s_ppv"));
  }, 1500);
};

var COUNTRY_CODE = $("html").data("countrycode"), // e.g) ch_de
  LANGUAGE_CODE = $("html").attr("lang"),
  DIRECTION_CODE = $("html").attr("dir"),
  OBS_LOGIN_FLAG = $(".navigation").data("obs"),
  USE_FBQ = false,
  // 20200429 START 박지영 - rtl 추가
  ISRTL = $("html[dir=rtl]").length > 0 ? true : false,
  // 20200429 END
  USE_NEW_FBQ = false; //LGEIS-10 20200327 add
if (!OBS_LOGIN_FLAG) OBS_LOGIN_FLAG = "N";

// PJTOBS-32 Start
var ISVIP = false;
// PJTOBS-32 End
var SIGN_IN_STATUS = "N"; //LGEDE-354
let COUNTRY_UNIT_OBS_FLAG = ""; // LGEPL-697

// 20200611 START 박지영 - IE main 에서 path 추가된 쿠키 잘 안 읽히는 case 예외 처리
/* 20201012 SSO domain 추가  */
var agent = navigator.userAgent.toLowerCase();
var ISMS =
    (navigator.appName == "Netscape" && agent.indexOf("trident") != -1) ||
    agent.indexOf("msie") != -1 ||
    window.navigator.userAgent.indexOf("Edge") > -1
      ? true
      : false, // ie or edge
  ISMAIN =
    location.pathname === "/" + COUNTRY_CODE.toLowerCase() ? true : false,
  ISSSO =
    location.host === "ssodev.lg.com" || location.host === "sso.lg.com"
      ? true
      : false,
  ISSIGNIN =
    ISSSO && window.location.pathname === "/oauth/page/login" ? true : false, // LGEGMC-4202
  SSODOMAIN = location.host === "sso.lg.com" ? "sso.lg.com" : "ssodev.lg.com",
  MAIN_DOMAIN = "", // LGEITF-961
  HOMEUSECOOKIELIST = new Array(),
  CANGETCART = true,
  ISB2B = $(".navigation").hasClass("b2b"), // LGEGMC-5405
  ISB2BMAIN =
    location.pathname === "/" + COUNTRY_CODE.toLowerCase() + "/business"
      ? true
      : false; //LGEBR-1244
if (ISMAIN && ISMS) CANGETCART = false;
/* 20201012 SSO domain 추가  */

if (ISSSO) {
  CANGETCART = false;
  // LGEITF-961 Start
  const mainLogoLink = $("header .size .logo > a").length
    ? $("header .size .logo > a").attr("href").split("/")
    : "";
  MAIN_DOMAIN = !!mainLogoLink ? mainLogoLink[0] + "//" + mainLogoLink[2] : "";
  // LGEITF-961 End
}
// 20200611 END

// browser supported check (popup)
var browse_check = function () {
  if (!document.getElementById("modal_browse_supported_guide")) return false;

  var browser_ver = navigator.userAgent,
    filter = /(msie) [2-9]/i;

  var _this = browse_check,
    layer = {
      popup_layer: document.getElementById("modal_browse_supported_guide"),
      popup_back_layer: document.getElementById("modal-background"),
      popup_close: document.getElementById("modal-layer-close"),
    },
    classSet = {
      activate: "active",
      popup_layer: "broswe-check-popup-layer",
      popup_back_layer: "modal-background",
    };

  _this.init = function () {
    if (browser_ver.search(filter) !== -1) {
      //console.log("ie lower case");
      _this.layer_active();
    }
    _this.addEvent();
  };

  _this.addEvent = function () {
    layer.popup_back_layer.onclick = function () {
      _this.layer_close();
    };
    layer.popup_close.onclick = function () {
      _this.layer_close();
    };
  };

  _this.layer_active = function () {
    layer.popup_layer.className =
      classSet.popup_layer + " " + classSet.activate;
    layer.popup_back_layer.className =
      classSet.popup_back_layer + " " + classSet.activate;
  };

  _this.layer_close = function () {
    if (layer.popup_layer.className.indexOf("active") > 1) {
      layer.popup_layer.className = classSet.popup_layer;
      layer.popup_back_layer.className = classSet.popup_back_layer;
    }
  };
  _this.init();
};
browse_check();

// isInScreen
var isInScreen = function (t, b) {
  var sTop = $(window).scrollTop();
  var bTop = $(window).scrollTop() + $(window).height();
  if (
    ((t > sTop || b < bTop) && !(t > bTop || b < sTop)) ||
    (t < sTop && b > bTop)
  ) {
    return true;
  } else {
    return false;
  }
};

// 20200611 START 박지영 - IE main 에서 path 추가된 쿠키 잘 안 읽히는 case 예외 처리
// addHomeCookie
var addHomeCookie = function (data) {
  HOMEUSECOOKIELIST.LG5_RecentlyView = data.LG5_RecentlyView;
  HOMEUSECOOKIELIST.LG5_CompareCart = data.LG5_CompareCart;
  HOMEUSECOOKIELIST.LG5_CartID = data.LG5_CartID;
  HOMEUSECOOKIELIST.LG5_SearchResult = data.LG5_SearchResult;

  CANGETCART = true;

  /* 20201012 SSO domain 추가  */
  if (
    (OBS_LOGIN_FLAG == "Y" && ISMAIN && ISMS) ||
    (OBS_LOGIN_FLAG == "Y" && ISSSO)
  ) {
    setTimeout(function () {
      // get the number of items in the cart
      if (addToCart) addToCart.init();
    }, 100);
  }
};
// 20200611 END

// Scripts that prevent users from entering script code
var xssfilter = function (content, isHTML) {
  if (typeof content == "string" || isHTML) {
    // Do not change the running order below.
    var returnTxt = content
      .replace(/%3C/g, "")
      .replace(/%3E/g, "") // <와 > 삭제 (for url)
      .replace(/javascript%3A/gi, "") // javascript: 을 삭제 (for url, 대소문자 구분없이)
      .replace(/%22/g, "")
      .replace(/%27/g, "") // "와 '를 삭제 (for url)
      .replace(/¼/g, "<")
      .replace(/¾/g, ">")
      .replace(/\+ADw\-/g, "<")
      .replace(/\+AD4\-/g, ">")
      .replace(/\0/gi, " ")
      .replace(/&#x09;/g, "")
      .replace(/&#x0A;/g, "")
      .replace(/&#x0D;/g, "") // 공백 대체 문자 제거
      .replace(
        /j( *	*\\*<*>*|\/\*.*\*\/)a( *	*\\*<*>*|\/\*.*\*\/)v( *	*\\*<*>*|\/\*.*\*\/)a( *	*\\*<*>*|\/\*.*\*\/)s( *	*\\*<*>*|\/\*.*\*\/)c( *	*\\*<*>*|\/\*.*\*\/)r( *	*\\*<*>*|\/\*.*\*\/)i( *	*\\*<*>*|\/\*.*\*\/)p( *	*\\*<*>*|\/\*.*\*\/)t( *	*\\*<*>*|\/\*.*\*\/):/gi,
        ""
      ) // javascript: 제거 (대소문자 구분 없이)
      .replace(
        /v( *	*\\*<*>*|\/\*.*\*\/)b( *	*\\*<*>*|\/\*.*\*\/)s( *	*\\*<*>*|\/\*.*\*\/)c( *	*\\*<*>*|\/\*.*\*\/)r( *	*\\*<*>*|\/\*.*\*\/)i( *	*\\*<*>*|\/\*.*\*\/)p( *	*\\*<*>*|\/\*.*\*\/)t( *	*\\*<*>*|\/\*.*\*\/):/gi,
        ""
      ) // vbscript: 제거 (대소문자 구분 없이)
      .replace(
        /l( *	*\\*<*>*|\/\*.*\*\/)i( *	*\\*<*>*|\/\*.*\*\/)v( *	*\\*<*>*|\/\*.*\*\/)e( *	*\\*<*>*|\/\*.*\*\/)s( *	*\\*<*>*|\/\*.*\*\/)c( *	*\\*<*>*|\/\*.*\*\/)r( *	*\\*<*>*|\/\*.*\*\/)i( *	*\\*<*>*|\/\*.*\*\/)p( *	*\\*<*>*|\/\*.*\*\/)t( *	*\\*<*>*|\/\*.*\*\/):/gi,
        ""
      ) // livescript: 제거 (대소문자 구분 없이)
      .replace(
        /e( *	*\\*<*>*|\/\*.*\*\/)x( *	*\\*<*>*|\/\*.*\*\/)p( *	*\\*<*>*|\/\*.*\*\/)r( *	*\\*<*>*|\/\*.*\*\/)e( *	*\\*<*>*|\/\*.*\*\/)s( *	*\\*<*>*|\/\*.*\*\/)s( *	*\\*<*>*|\/\*.*\*\/)i( *	*\\*<*>*|\/\*.*\*\/)o( *	*\\*<*>*|\/\*.*\*\/)n( *	*\\*<*>*|\/\*.*\*\/)\(/gi,
        ""
      ) // expression( 제거 (대소문자 구분 없이)
      .replace(/&#[x]*[0-9]+/gi, ".") // encoding 방지
      .replace(/<script.+\/script>/gi, "") // script로 시작해서 /script로 끝나는 태그 제거 (대소문자 구분없이)
      .replace(/String\.fromCharCode/gi, "")
      .replace(/Set\.constructor/gi, "")
      .replace(/FSCommand/gi, "")
      .replace(/seekSegmentTime/gi, "")
      .replace(/eval\(/gi, "")
      .replace(/window\.on.+/gi, "");
    // tag
    returnTxt = returnTxt
      .replace(/<link./gi, "")
      .replace(/<\/link>/gi, "")
      .replace(/<script./gi, "")
      .replace(/<\/script>/gi, "")
      .replace(/<style./gi, "")
      .replace(/<\/style>/gi, "")
      .replace(/<meta./gi, "")
      .replace(/<\/meta>/gi, "")
      .replace(/<object./gi, "")
      .replace(/<\/object>/gi, "")
      .replace(/<embed./gi, "")
      .replace(/<\/embed>/gi, "")
      .replace(/<iframe./gi, "")
      .replace(/<\/iframe>/gi, "")
      .replace(/<applet./gi, "")
      .replace(/<\/applet>/gi, "")
      .replace(/<base./gi, "")
      .replace(/<\/base>/gi, "")
      .replace(/<frameset./gi, "")
      .replace(/<\/frameset>/gi, "")
      .replace(/<xml./gi, "")
      .replace(/<\/xml>/gi, "");

    // form, input
    if (isHTML == "form") {
      returnTxt = returnTxt.replace(
        /(\%20| |	|\\|\/|\"|\'|\.)+on[a-z]+\=/gi,
        ""
      );
      //returnTxt = returnTxt.replace(/(\%20| |	|\\|\/|\"|\'|\.)+on[a-z]+(!?)[a-z]+\=/gi, '');
      returnTxt = returnTxt.replace(/\(/g, "").replace(/\)/g, "");
    } else {
      returnTxt = returnTxt.replace(
        /(\%20| |	|\\|\/|\"|\'|\.+)on([a-z]+\=)/gi,
        "$1&#111;n$2"
      );
    }

    // <와 > 제거
    if (!isHTML || isHTML == "form") {
      returnTxt = returnTxt
        .replace(/</g, "")
        .replace(/>/g, "")
        .replace(/&lt/gi, "")
        .replace(/&gt/gi, "");
    }

    //console.log('XSS :', typeof content, content, returnTxt);
    return returnTxt;
  } else if (typeof content == "object") {
    $.each(content, function (key, value) {
      content[key] = xssfilter(value);
    });
    return content;
  } else {
    return content;
  }
};

// price
// LGECH-148, LGEBR-1152
// 가격 천단위 표기(Thousands Separator) 처리 (Default : ',')
// 박지영 tr 추가(20200421), ca_en, ca_fr 추가(20200511)
// LGEGMC-1475, LGEGMC-1518, LGEDE-240, LGEAU-542, LGEGMC-2049
const countriesUsingTS_BLANK = ["cz", "fr", "pl", "ru"]; // 공백(' ') 사용
const countriesUsingTS_DOT = [
  "it",
  "vn",
  "tr",
  "de",
  "cl",
  "ch_de",
  "ch_fr",
  "br",
]; // 점('.') 사용
const countriesUsingTS_NONE = ["in", "tw", "th", "ca_en", "ca_fr"]; // 표기하지 않음
// LGEGMC-1475, LGEGMC-1518, LGEDE-240, LGEAU-542, LGEGMC-2049 End

var changeFormatPrice = function (num) {
  if (num == 0) return 0;
  num = parseFloat(num);
  if (isNaN(num)) return 0;
  var reg = /(^[+-]?\d+)(\d{3})/;
  var n = num + "";
  var cc = COUNTRY_CODE.toLowerCase();
  if (countriesUsingTS_BLANK.includes(cc)) {
    while (reg.test(n)) n = n.replace(reg, "$1" + " " + "$2");
  } else if (countriesUsingTS_DOT.includes(cc)) {
    while (reg.test(n)) n = n.replace(reg, "$1" + "." + "$2");
  } else if (countriesUsingTS_NONE.includes(cc)) {
    // do nothing
  } else {
    // Default
    while (reg.test(n)) n = n.replace(reg, "$1" + "," + "$2");
  }
  return n;
};

// 가격 소수점 표기(Decimal Separator) 처리 (Default : '.')
// 20200421 START 박지영 tr 추가
// LGEDE-240, LGEGMC-1475, LGEGMC-1518
const countriesUsingDS_COMMA = [
  "cz",
  "fr",
  "it",
  "pl",
  "de",
  "ch_de",
  "ch_fr",
  "br",
]; // 콤마(',') 사용
const countriesUsingDS_NONE = ["in", "tw", "th", "vn", "tr"]; // 소수점 표기 및 소수점 이하 값 사용하지 않음

var changeFormatPriceCent = function (num) {
  var n = "";
  if (num != "null" && num != null && num != "") {
    // 20200316 START 박지영 null이 string으로 들어오는 경우 발생
    var cc = COUNTRY_CODE.toLowerCase();
    if (countriesUsingDS_COMMA.includes(cc)) {
      n = "," + num;
    } else if (countriesUsingDS_NONE.includes(cc)) {
      n = "";
    } else {
      // else // dot 사용
      n = "." + num;
    }
  }
  return n;
};
var changeFormatFullPrice = function (price, cent) {
  return changeFormatPrice(price) + changeFormatPriceCent(cent);
};
// LGECH-148, LGEBR-1152 End

var countryUnitObsFlag; // LGEKZ-111
var obsUnitcountry;
var obsUnitCookieExpires;

// LGEGMC-5405 Start
const eloquaCountries = [
  "global",
  "africa",
  "africa_fr",
  "ar",
  "br",
  "ca_en",
  "ca_fr",
  "cac",
  "cac_en",
  "cl",
  "cn",
  "co",
  "cz",
  "eastafrica",
  "eg_en",
  "hu",
  "id",
  "levant_ar",
  "levant_en",
  "mx",
  "pe",
  "ph",
  "pl",
  "sa",
  "sa_en",
  "th",
  "tr",
  "ua",
  "vn",
  "za",
  "ae",
  "ae_ar",
  "au",
  "in",
  "nz",
  "uk",
];
let scriptGetElqGUID = "";
const scriptCommElq =
  '<script type="text/javascript">var _elqQ = _elqQ || [];_elqQ.push(["elqSetSiteId", "2523692"]);_elqQ.push(["elqGetCustomerGUID"]);_elqQ.push(["elqTrackPageView", window.location.href]);(function () {function async_load() {var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;s.src = "//img03.en25.com/i/elqCfg.min.js";var x = document.getElementsByTagName("script")[0]; x.parentNode.insertBefore(s, x);}if (window.addEventListener) window.addEventListener("DOMContentLoaded", async_load, false);else if (window.attachEvent) window.attachEvent("onload", async_load); })();</script>';

if (eloquaCountries.indexOf(COUNTRY_CODE) >= 0 && ISB2B) {
  // history : BTOBGLOBAL-409, BTOBGLOBAL-423, PJTROLLOUT21-7, BTOBGLOBAL-559
  if ($(".inquiry-fieldset-box").length)
    scriptGetElqGUID =
      '<script>var timerId = null, timeout = 5;var eloqua_GUID = "";function WaitUntilCustomerGUIDIsRetrieved(){if (!!(timerId)){if (timeout == 0) return;if (typeof this.GetElqCustomerGUID ==="function"){document.getElementByName("eloqua_GUID").value = GetElqCustomerGUID();return;}timeout -= 1;}timerId = setTimeout("WaitUntilCustomerGUIDIsRetrieved()", 500);return;}window.onload = WaitUntilCustomerGUIDIsRetrieved;</script>' +
      '<script>window.addEventListener("message", sendGUID); function sendGUID (e) { if(e.data.EloquaIframe !== "ready"){return;}; document.querySelector(".gpEloquaForm").contentWindow.postMessage({GUID: GetElqCustomerGUID()}, "*"); }</script>';
  $("head").prepend(scriptGetElqGUID + scriptCommElq);
}
// LGEGMC-5405 End

/* LGEGMC-4044, LGEGMC-5050, LGEITF-939, LGEGMC-5290 Start */
var BeusableCountries = [
  "at",
  "au",
  "br",
  "ch_de",
  "ch_fr",
  "cl",
  "cz",
  "de",
  "eg_ar",
  "eg_en",
  "es",
  "fr",
  "hu",
  "in",
  "it",
  "mx",
  "nl",
  "cac",
  "cac_en",
  "pe",
  "pl",
  "ru",
  "se",
  "tw",
  "uk",
  "vn",
  "sa",
  "sa_en",
  "jp",
  "ph",
  "ca_en",
  "ca_fr",
];
if (BeusableCountries.indexOf(COUNTRY_CODE) >= 0) {
  $("head").prepend(
    '<script defer type="text/javascript"> window.addEventListener("load", function(){ (function(w, d, a){ w.__beusablerumclient__ = { load : function(src){ var b = d.createElement("script"); b.src = src; b.defer=true; b.type = "text/javascript"; d.getElementsByTagName("head")[0].appendChild(b); } };w.__beusablerumclient__.load(a + "?url=" + encodeURIComponent(d.URL)); })(window, document, "//rum.beusable.net/load/b230321e175310u353"); }, false); </script>'
  );
}
/* LGEGMC-4044, LGEGMC-5050, LGEITF-939, LGEGMC-5290 End */

/* LGEGMC-3653 Start */
// expired 는 쿠키 expire date 기능에 완벽히 상응할 수는 없지만, 쿠키 미적용 국가가 포함된 요건에 expired 기능을 요청하여, 1차 방어 기능으로 적용됨.
// 캠페인 기간 완료 후, WCMS 페이지 closing 과 신규 CSR에서 기능 코드 삭제를 진행 예정이라고 전달받음.
const healthyHomeCountries = ["th", "ph", "vn", "br", "mx", "co", "pe", "id"]; // LGEGMC-3768, LGEGMC-3888

if (healthyHomeCountries.indexOf(COUNTRY_CODE) >= 0) {
  const urlPattern = new RegExp(/\/[a-z]{2}\/healthy-home-solution/);
  const today = new Date();
  const expired =
    today.getFullYear() > 2023 && today.getMonth() > 1 && today.getDate() > 28; // expireDate : 2023-02-28
  if (!expired && urlPattern.test(window.location.pathname)) {
    $("head").prepend(
      '<script>!function (w, d, t) { w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)}; ttq.load("CB7MMPJC77UEH0GNQUMG"); ttq.page(); }(window, document, "ttq");</script>'
    );
  }
}
/* LGEGMC-3653 End */

// adobe
function findPrice($obj) {
  var cc = COUNTRY_CODE.toLowerCase();
  var va = $obj
    .closest(".item")
    .find(".products-info .price-area .purchase-price .price")
    .text(); // for product list, mylg > my product
  if (!va) va = $obj.closest(".bundle").find(".purchase-price .price").text(); // for GPC0006
  if (!va)
    va = $obj
      .closest(".pdp-info")
      .find(".price-area .purchase-price .price")
      .text(); // for pdp summary (GPC0009)
  if (!va) va = $obj.closest(".model-info").find(".selling-price").text(); // for GPC0023
  if (!va)
    va = $obj
      .closest(".item")
      .find(".price-area .purchase-price .price")
      .text(); // for GPC0058
  if (!va) va = $obj.closest("li").find(".hidden-price").text(); // for gnb search
  if (!va) va = String($obj.data("price")); // for gnb search preview
  // for GPC0011
  if (!va && $obj.closest(".GPC0011").length > 0) {
    va = $(".GPC0009")
      .find(".pdp-info")
      .find(".price-area .purchase-price")
      .eq(0)
      .find(".price")
      .text();
  }
  if (!va || va == "undefined") va = "";
  //va = va.replace(/[\{\}\[\]\/?,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, '');
  // LGECH-148
  // price 되돌림 (세자리수 콤마 제거)
  if (countriesUsingTS_BLANK.includes(cc)) {
    va = va.replace(/ /gi, "");
  } else if (countriesUsingTS_DOT.includes(cc)) {
    va = va.replace(/\./gi, "");
  } else if (countriesUsingTS_NONE.includes(cc)) {
  } else {
    va = va.replace(/,/gi, "");
  }
  // cent 되돌림 (소수점을 dot로 변경)
  if (countriesUsingDS_COMMA.includes(cc)) {
    va = va.replace(/,/gi, ".");
  } else if (countriesUsingDS_NONE.includes(cc)) {
  } else {
  }
  // LGECH-148 End
  // number로 변경
  va = va.replace(/[^0-9\.]/gi, ""); // 숫자와 dot을 제외한 나머지 모두 삭제
  va = Number(va);
  console.log("	adobe-price:", va);
  return va;
}
function getStepProductCode() {
  var code;
  if ($("#modelSummary").length > 0)
    code = $("#modelSummary").data("adobe-salesmodelcode");
  if (!code) code = "";
  return code;
}
function changeTitleFormat(title) {
  // Please do not modify any spaces in the code below.
  //return $.trim(title.toLowerCase().replace(/[^a-z0-9_ ]/gi, "")).replace(/ /gi, "_").replace(/_+/gi, "_");
  var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^+<>®™@\#$%&\\\=\(\'\"]/gi;
  title = $.trim(title)
    .toLowerCase()
    .replace(regExp, "")
    .replace(/\-/gi, "_")
    .replace(/_+/gi, "_")
    .replace(/ +/gi, "_");
  return title;
}
function adobeSatellite(name, param) {
  console.log("adobe code : " + name, param);
  if (
    typeof _satellite != "undefined" &&
    typeof _satellite.track == "function" &&
    typeof _dl !== "undefined"
  ) {
    _satellite.track(name, param);
  }
}
function adobeTrackEvent(name, param) {
  console.log("adobe code : " + name, param);
  if (typeof _trackEvent == "function" && typeof _dl !== "undefined") {
    _trackEvent($.extend(_dl, param));
  }
}

/* LGEGMC-455 20200722 add*/
function findSalesSuffixCode($obj) {
  var va = $obj
    .closest(".item")
    .find("a.visual[data-adobe-salessuffixcode]")
    .data("adobe-salessuffixcode"); // for product list
  if (!va)
    va = $obj
      .closest(".bundle")
      .find("a[data-adobe-salessuffixcode]")
      .data("adobe-salessuffixcode"); // for GPC0006
  if (!va) va = $obj.closest(".GPC0009").data("adobe-salessuffixcode"); // for GPC0009
  if (!va)
    va = $obj
      .closest(".GPC0023")
      .find(".model-info")
      .data("adobe-salessuffixcode"); // for GPC0023
  if (!va)
    va = $obj
      .closest(".item")
      .find(".img a[data-adobe-salessuffixcode]")
      .data("adobe-salessuffixcode"); // for GPC0058
  if (!va)
    va = $obj.closest("li").find(".txt > a").data("adobe-salessuffixcode"); // for gnb search
  if (!va)
    va = $obj
      .closest(".match-product-list")
      .find(".product-image")
      .data("adobe-salessuffixcode"); //for search preview
  // for GPC0011
  if (!va && $obj.closest(".GPC0011").length) {
    va = $(".GPC0009").data("adobe-salessuffixcode");
  }
  //PJTPLP-10 WISH
  if (!va)
    va = $obj.closest("[data-wish-basic-info]").data("adobe-salessuffixcode"); // WISH TRACKING COMMON
  va = va || "";
  console.log("    adobe-salessuffixcode:", va);
  return va;
}

function findSalesModel($obj) {
  var suffix = findSalesSuffixCode($obj);
  return findSalesModelCode($obj) + (suffix ? "." : "") + suffix;
}
/* //LGEGMC-455 20200722 add*/

function findModelName($obj) {
  var va = $obj
    .closest(".item")
    .find("a.visual[data-adobe-modelname]")
    .data("adobe-modelname"); // for product list
  if (!va)
    va = $obj
      .closest(".bundle")
      .find("a[data-adobe-modelname]")
      .data("adobe-modelname"); // for GPC0006
  if (!va) va = $obj.closest(".GPC0009").data("adobe-modelname"); // for GPC0009
  if (!va)
    va = $obj.closest(".GPC0023").find(".model-info").data("adobe-modelname"); // for GPC0023
  if (!va)
    va = $obj
      .closest(".item")
      .find(".img a[data-adobe-modelname]")
      .data("adobe-modelname"); // for GPC0058
  if (!va) va = $obj.closest("li").find(".txt > a").data("adobe-modelname"); // for gnb search
  if (!va)
    va = $obj
      .closest(".match-product-list")
      .find(".product-image")
      .data("adobe-modelname"); //for search preview
  // for GPC0011
  if (!va && $obj.closest(".GPC0011").length > 0) {
    va = $(".GPC0009").data("adobe-modelname");
  }
  //PJTPLP-10 WISH
  if (!va) va = $obj.closest("[data-wish-basic-info]").data("adobe-modelname"); // WISH TRACKING COMMON

  if (!va || va == "undefined") va = "";
  console.log("	adobe-modelName:", va);
  return va;
}
function findSalesModelCode($obj) {
  var va = $obj
    .closest(".item")
    .find("a.visual[data-adobe-salesmodelcode]")
    .data("adobe-salesmodelcode"); // for product list
  if (!va)
    va = $obj
      .closest(".bundle")
      .find("a[data-adobe-salesmodelcode]")
      .data("adobe-salesmodelcode"); // for GPC0006
  if (!va) va = $obj.closest(".GPC0009").data("adobe-salesmodelcode"); // for GPC0009
  if (!va)
    va = $obj
      .closest(".GPC0023")
      .find(".model-info")
      .data("adobe-salesmodelcode"); // for GPC0023
  if (!va)
    va = $obj
      .closest(".item")
      .find(".img a[data-adobe-salesmodelcode]")
      .data("adobe-salesmodelcode"); // for GPC0058
  if (!va)
    va = $obj.closest("li").find(".txt > a").data("adobe-salesmodelcode"); // for gnb search
  if (!va)
    va = $obj
      .closest(".match-product-list")
      .find(".product-image")
      .data("adobe-salesmodelcode"); //for search preview
  // for GPC0011
  if (!va && $obj.closest(".GPC0011").length > 0) {
    va = $(".GPC0009").data("adobe-salesmodelcode");
  }
  //PJTPLP-10 WISH
  if (!va)
    va = $obj.closest("[data-wish-basic-info]").data("adobe-salesmodelcode"); // WISH TRACKING COMMON

  if (!va || va == "undefined") va = "";
  console.log("	adobe-salesModelCode:", va);
  return va;
}
function findModelCount($obj) {
  var va = 1;
  if ($obj.closest(".GPC0010").length > 0)
    num = $obj
      .closest(".GPC0010")
      .find(".selected-items .selected-number .number")
      .text();
  console.log("	adobe-count:", va);
  return va;
}
//where to buy LGEGMC-3202
$("body").on("click", ".where-to-buy", function () {
  /* LGEMS-20, LGEMS-38 Start   */
  if (
    !$(this).closest(".component").hasClass("GPC0009") ||
    $(".tab-menu-belt").length == 0 ||
    $(this).hasClass("wtb-external")
  ) {
    /*LGEGMC-1319 20210318 modify */
    /* LGEMS-20, LGEMS-38 End  */
    adobeTrackEvent("where-to-buy", {
      /* LGEGMC-1279 2021.03.12 start */
      //아래 주석 두 줄이 원본
      //products: [{sales_model_code : findSalesModel($(this)), model_name: findModelName($(this))}], /* LGEGMC-455 20200722 modify */
      //page_event: {where_to_buy_click: true}
      products: [
        {
          level1: $(this).attr("data-buname-one"),
          level2: $(this).attr("data-buname-two"),
          level3: $(this).attr("data-buname-three"),
          sales_model_code: $(this).attr("data-model-salesmodelcode"),
          model_name: $(this).attr("data-sku"),
          bu: $(this).attr("data-buname-one"),
        },
      ],
      page_event: { wtb_click: true },
      /* LGEGMC-1279 2021.03.12 end */
    });

    /* LGEGMC-1279 2021.03.12 start */
    //dataLayer.push({'event': 'wtb_click'});
    /* LGEGMC-1279 2021.03.17 start */
    var modelYear = nvl($(this).attr("data-model-year"), "");
    if (modelYear == "") {
      modelYear = $(".btn.where-to-buy").attr("data-model-year");
    }
    /* LGEGMC-1279 2021.03.17 end */
    var price = "";
    price = $(this).attr("data-price");
    if (price == "." || price == ".00" || price == "0.0" || price == "0") {
      price = "";
    }
    var msrp = "";
    msrp = $(this).attr("data-msrp");
    if ($(this).closest(".GPC0011").length > 0) {
      msrp = nvl($(".js-compare").attr("data-msrp"), "");
      if (msrp == "." || msrp == ".00" || msrp == "0.0" || msrp == "0") {
        msrp = "";
      }
    } else {
      msrp = $(this).attr("data-msrp");
    }
    if (msrp == "." || msrp == ".00" || msrp == "0.0" || msrp == "0") {
      msrp = "";
    }
    var cartBtn = "";
    if ($(this).closest(".GPC0011").length > 0) {
      if ($(".GPC0009").find(".add-to-cart").length > 0) {
        cartBtn = "Y";
      } else {
        cartBtn = "N";
      }
    } else if (
      $(this).closest(".GPC0007").length > 0 ||
      $(this).closest(".GPC0026").length > 0
    ) {
      if ($(this).parent(".button").find(".add-to-cart").hasClass("active")) {
        cartBtn = "Y";
      } else {
        cartBtn = "N";
      }
    } else {
      if ($(this).parent(".button").find(".add-to-cart").length > 0) {
        cartBtn = "Y";
      } else {
        cartBtn = "N";
      }
    }
    if ($(this).closest(".GPC0011").length > 0) {
      dataLayer.push({
        event: "wtb_click",
        superCategory: $(".js-compare").attr("data-super-category-name"),
        category: $(".js-compare").attr("data-buname-two"),
        subcategory: $(".js-compare").attr("data-buname-three"),
        modelYear:
          $(".js-compare").attr(
            "data-model-year"
          ) /* LGEGMC-1279 2021.03.17 modify */,
        modelName: $(".js-compare").attr("data-sku"),
        modelCode: $(".js-compare").attr("data-model-id"),
        salesModelCode: $(".js-compare").attr("data-model-salesmodelcode"),
        sku: $(".js-compare").attr("data-sku"),
        suffix: $(".js-compare").attr("data-model-suffixcode"),
        bu: $(".js-compare").attr("data-buname-one"),
        price: price,
        currencyCode: $(".currency-code").val(),
        dimension185: $(".navigation").attr("data-obs-group"),
        metric4: msrp,
        cart_btn: cartBtn,
      });
    } else {
      dataLayer.push({
        event: "wtb_click",
        superCategory: $(this).attr("data-super-category-name"),
        category: $(this).attr("data-buname-two"),
        subcategory: $(this).attr("data-buname-three"),
        modelYear: modelYear /* LGEGMC-1279 2021.03.17 modify */,
        modelName: $(this).attr("data-sku"),
        modelCode: $(this).attr("data-model-id"),
        salesModelCode: $(this).attr("data-model-salesmodelcode"),
        sku: $(this).attr("data-sku"),
        suffix: $(this).attr("data-model-suffixcode"),
        bu: $(this).attr("data-buname-one"),
        price: price,
        currencyCode: $(".currency-code").val(),
        dimension185: $(".navigation").attr("data-obs-group"),
        metric4: msrp,
        cart_btn: cartBtn,
      });
    }
    console.log("click.where-to-buy");
    /* LGEGMC-1279 2021.03.12 end */

    if (USE_FBQ) {
      try {
        console.log("run fbq");
        //LGESG-64 modify
        if (COUNTRY_CODE.toLowerCase() == "sg" && USE_NEW_FBQ == "") {
          console.log("run fbq FindLocation");
          if (typeof fbq == "function") fbq("track", "FindLocation");
        } else {
          /*LGEIS-10 20200327 LGEMS-12 20200423 modify*/
          if (USE_NEW_FBQ !== "") {
            console.log("run new fbq : " + USE_NEW_FBQ);
            if (typeof fbq == "function") fbq("track", "'" + USE_NEW_FBQ + "'");
          } else {
            if (typeof fbq == "function") fbq("track", "Purchase");
            console.log("run fbq Purchase");
          }
          /*//LGEIS-10 20200327,LGEMS-12 20200423 modify*/
        }
      } catch (err) {}
    }
    /* LGEMS-20, LGEMS-38 Start   */
  }
  /* LGEMS-20, LGEMS-38 End   */
  if ($(this).closest(".GPC0009").length > 0) {
    $(".GPC0011").find("a.where-to-buy").eq(0).click();
  }

  /* LGECN-214 Start */
  if (COUNTRY_CODE.toLowerCase() == "cn") {
    if (!!$(this).closest(".GPC0009").length) {
      baiduTrackEvent("where_to_buy_click", $(this).closest(".GPC0009"), "PDP");
    } else if (!!$(this).closest(".GPC0007").length) {
      baiduTrackEvent("where_to_buy_click", $(this).closest("li"), "PLP");
    }
  }
  /* LGECN-214 End */
});
// LGEGMC-1279 start
// buy now
$("body").on("click", ".in-buynow", function () {
  if ($(this).hasClass("pre-order") == false) {
    adobeTrackEvent("buy-now", {
      products: [
        {
          level1: $(this).attr("data-buname-one"),
          level2: $(this).attr("data-buname-two"),
          level3: $(this).attr("data-buname-three"),
          sales_model_code: $(this).attr("data-model-salesmodelcode"),
          model_name: $(this).attr("data-sku"),
          bu: $(this).attr("data-buname-one"),
        },
      ],
      page_event: { buy_now_click: true },
    });

    var price = "";
    price = $(this).attr("data-price");
    if (price == "." || price == ".00" || price == "0.0" || price == "0") {
      price = "";
    }
    var msrp = "";
    msrp = $(this).attr("data-msrp");
    if (msrp == "." || msrp == ".00" || msrp == "0.0" || msrp == "0") {
      msrp = "";
    }
    //dataLayer.push({'event': 'buy_now_click'});
    dataLayer.push({
      event: "buy_now_click",
      superCategory: $(this).attr("data-category-name"),
      category: $(this).attr("data-buname-two"),
      subcategory: $(this).attr("data-buname-three"),
      modelYear: $(this).attr("data-model-year"),
      modelName: $(this).attr("data-sku"),
      modelCode: $(this).attr("data-model-id"),
      salesModelCode: $(this).attr("data-model-salesmodelcode"),
      sku: $(this).attr("data-sku"),
      suffix: $(this).attr("data-model-suffixcode"),
      bu: $(this).attr("data-buname-one"),
      price: price,
      currencyCode: $(".currency-code").val(),
      dimension185: $(".navigation").attr("data-obs-group"),
      metric4: msrp,
    });
    console.log("click.in-buynow");
  }
});

// LGEGMC-1279 end
// inquiry to buy
$("body").on("click", ".inquiry-to-buy", function () {
  adobeTrackEvent("inquiry-to-buy", {
    // LGEGMC-585
    level1: typeof standardData === "undefined" ? "" : standardData.level1,
    level2: typeof standardData === "undefined" ? "" : standardData.level2,
    level3: typeof standardData === "undefined" ? "" : standardData.level3,
    sales_model_code: findSalesModel($(this)),
    // LGEGMC-585 End
    products: [
      {
        sales_model_code: findSalesModel($(this)),
        model_name: findModelName($(this)),
      },
    ] /* LGEGMC-455 20200722 modify */,
    page_event: { inquiry_to_buy_click: true },
  });
});
/* LGEID-32 Start */
//gp-gnb-inquiry-to-buy
$("body").on("click", ".gp-gnb-inquiry-to-buy", function () {
  if (COUNTRY_CODE.toLowerCase() == "id") {
    console.log("run fbq");
    console.log("run fbq Contact");
    if (typeof fbq == "function") fbq("track", "Contact");
  }
  // LGEGMC-585
  adobeTrackEvent("inquiry-to-buy", {
    level1: typeof standardData === "undefined" ? "" : standardData.level1,
    level2: typeof standardData === "undefined" ? "" : standardData.level2,
    level3: typeof standardData === "undefined" ? "" : standardData.level3,
    sales_model_code: findSalesModel($(this)),
    products: [
      {
        sales_model_code: findSalesModel($(this)),
        model_name: findModelName($(this)),
      },
    ] /* LGEGMC-455 20200722 modify */,
    page_event: { inquiry_to_buy_click: true },
  });
  // LGEGMC-585 End
});
/* LGEID-32 End */
// find a dealer
$("body").on("click", ".find-a-dealer", function () {
  adobeTrackEvent("find-a-dealer", {
    products: [
      {
        sales_model_code: findSalesModel($(this)),
        model_name: findModelName($(this)),
      },
    ] /* LGEGMC-455 20200722 modify */,
    page_event: { find_a_dealer_click: true },
  });
});
// PJTPLP-10 GILS
/* data-page-event 정의
 */

$("body").on("click", '[data-adobe-tracking-wish="Y"]', function () {
  if ($("#tempData").length == 0) $("body").append($('<div id="tempData">'));
  var el_tempData = $("#tempData");
  var page_event = {};
  if (typeof $(this).attr("data-page-event") == "undefined") {
    console.log("check page event");
    return;
  }
  var dataLayerPageEvent = $(this).attr("dataLayer-page-event");
  var pageEventStr = $(this).attr("data-page-event");
  page_event[$(this).attr("data-page-event")] = true;
  var productMeta = getProductMeta(this);
  //PJTGADL-2
  var dataLayerMeta = getDataLayerMeta(this);
  if (
    pageEventStr == "plp_wish_icon_select" ||
    pageEventStr == "plp_wish_icon_unselect" ||
    pageEventStr == "pdp_wish_icon_select" ||
    pageEventStr == "pdp_wish_icon_unselect"
  ) {
    return;
  }

  adobeTrackEvent(pageEventStr, {
    products: [productMeta],
    page_event: page_event,
  });

  //PJTGADL-2
  if (
    pageEventStr == "pdp_share_copyicon" ||
    pageEventStr == "plp_share_copyicon"
  ) {
    var dataLayerpushData = $.extend(
      {
        event: "share_product_click",
      },
      dataLayerMeta
    );
    dataLayer.push(dataLayerpushData);
  } else if (
    pageEventStr == "mylg_wish_btn_wtb" ||
    pageEventStr == "mywish_btn_wtb" ||
    pageEventStr == "mywish_btn_buynow" ||
    pageEventStr == "mylgWishBtnBuynow"
  ) {
    var dataLayerpushData = $.extend(
      {
        event: dataLayerPageEvent,
      },
      dataLayerMeta
    );
    dataLayer.push(dataLayerpushData);
  }

  //PJTGADL-2
  function getDataLayerMeta(elObj) {
    var dataLayer = {};
    switch (pageEventStr) {
      case "mylg_wish_btn_wtb":
      case "mywish_btn_buynow":
      case "mylgWishBtnBuynow":
      case "mywish_btn_wtb":
        var price = "";
        price = $(elObj).attr("data-price");
        if (
          $(elObj).attr("data-price") == "." ||
          $(elObj).attr("data-price") == ".00" ||
          $(elObj).attr("data-price") == "0.0" ||
          $(elObj).attr("data-price") == "0"
        ) {
          price = "";
        }
        var msrp = "";
        msrp = $(elObj).attr("data-msrp");
        if (
          $(elObj).attr("data-msrp") == "." ||
          $(elObj).attr("data-msrp") == ".00" ||
          $(elObj).attr("data-msrp") == "0.0" ||
          $(elObj).attr("data-msrp") == "0"
        ) {
          msrp = "";
        }
        var cartBtn = "";
        if ($(this).parents(".wish-buy").find(".add-to-cart").length > 0) {
          cartBtn = "Y";
        } else {
          cartBtn = "N";
        }
        var modelYear = nvl($(elObj).attr("data-model-year"), "");
        dataLayer["superCategory"] = $(elObj).attr("data-category-name");
        dataLayer["category"] = $(elObj).attr("data-buname-two");
        dataLayer["subcategory"] = $(elObj).attr("data-buname-three");
        dataLayer["modelYear"] = modelYear;
        dataLayer["modelName"] = $(elObj).attr("data-sku");
        dataLayer["modelCode"] = $(elObj).attr("data-model-id");
        dataLayer["salesModelCode"] = $(elObj).attr(
          "data-model-salesmodelcode"
        );
        dataLayer["sku"] = $(elObj).attr("data-sku");
        dataLayer["suffix"] = $(elObj).attr("data-model-suffixcode");
        dataLayer["bu"] = $(elObj).attr("data-buname-one");
        dataLayer["price"] = price;
        dataLayer["currencyCode"] = $(".currency-code").val();
        dataLayer["dimension185"] = $(".navigation").attr("data-obs-group");
        dataLayer["metric4"] = msrp;
        if (
          pageEventStr == "mylg_wish_btn_wtb" ||
          pageEventStr == "mywish_btn_wtb"
        ) {
          dataLayer["cart_btn"] = cartBtn;
        }
        el_tempData.data({ dataLayer: dataLayer });
        break;
      case "pdp_share_copyicon":
        var price = "";
        price = $(elObj)
          .closest(".GPC0009")
          .find(".js-compare")
          .attr("data-price");
        if (price == "." || price == ".00" || price == "0.0" || price == "0") {
          price = "";
        }
        var msrp = "";
        msrp = $(elObj)
          .closest(".GPC0009")
          .find(".js-compare")
          .attr("data-msrp");
        if (msrp == "." || msrp == ".00" || msrp == "0.0" || msrp == "0") {
          msrp = "";
        }
        var modelYear = $(elObj)
          .closest(".GPC0009")
          .find(".js-compare")
          .attr("data-model-year");
        dataLayer["superCategory"] = $(elObj)
          .closest(".GPC0009")
          .find(".js-compare")
          .attr("data-super-category-name");
        dataLayer["category"] = $(elObj)
          .closest(".GPC0009")
          .find(".js-compare")
          .attr("data-category-name");
        dataLayer["subcategory"] = $(elObj)
          .closest(".GPC0009")
          .find(".js-compare")
          .attr("data-sub-category-name");
        dataLayer["modelYear"] = modelYear;
        dataLayer["modelName"] = $(elObj)
          .closest(".GPC0009")
          .find(".js-compare")
          .attr("data-model-name");
        dataLayer["modelCode"] = $(elObj)
          .closest(".GPC0009")
          .find(".js-compare")
          .attr("data-model-id");
        dataLayer["salesModelCode"] = $(elObj)
          .closest(".GPC0009")
          .find(".js-compare")
          .attr("data-model-salesmodelcode");
        dataLayer["sku"] = $(elObj)
          .closest(".GPC0009")
          .find(".js-compare")
          .attr("data-sku");
        dataLayer["suffix"] = $(elObj)
          .closest(".GPC0009")
          .find(".js-compare")
          .attr("data-model-suffixcode");
        dataLayer["bu"] = $(elObj)
          .closest(".GPC0009")
          .find(".js-compare")
          .attr("data-bu");
        dataLayer["snsType"] = $(elObj).text();
        dataLayer["price"] = price;
        dataLayer["currencyCode"] = $(".currency-code").val();
        dataLayer["dimension185"] = $(".navigation").attr("data-obs-group");
        dataLayer["metric4"] = msrp;
        el_tempData.data({ dataLayer: dataLayer });
        break;
      case "plp_share_copyicon":
        var price = "";
        price = $(elObj)
          .closest(".js-model")
          .find(".js-compare")
          .attr("data-price");
        if (price == "." || price == ".00" || price == "0.0" || price == "0") {
          price = "";
        }
        var msrp = "";
        msrp = $(elObj)
          .closest(".js-model")
          .find(".js-compare")
          .attr("data-msrp");
        if (msrp == "." || msrp == ".00" || msrp == "0.0" || msrp == "0") {
          msrp = "";
        }
        var modelYear = $(elObj)
          .closest(".js-model")
          .find(".js-compare")
          .attr("data-model-year");
        dataLayer["superCategory"] = $(elObj)
          .closest(".js-model")
          .find(".js-compare")
          .attr("data-super-category-name");
        dataLayer["category"] = $(elObj)
          .closest(".js-model")
          .find(".js-compare")
          .attr("data-category-name");
        dataLayer["subcategory"] = $(elObj)
          .closest(".js-model")
          .find(".js-compare")
          .attr("data-sub-category-name");
        dataLayer["modelYear"] = modelYear;
        dataLayer["modelName"] = $(elObj)
          .closest(".js-model")
          .find(".js-compare")
          .attr("data-model-name");
        dataLayer["modelCode"] = $(elObj)
          .closest(".js-model")
          .find(".js-compare")
          .attr("data-model-id");
        dataLayer["salesModelCode"] = $(elObj)
          .closest(".js-model")
          .find(".js-compare")
          .attr("data-model-salesmodelcode");
        dataLayer["sku"] = $(elObj)
          .closest(".js-model")
          .find(".js-compare")
          .attr("data-sku");
        dataLayer["suffix"] = $(elObj)
          .closest(".js-model")
          .find(".js-compare")
          .attr("data-model-suffixcode");
        dataLayer["bu"] = $(elObj)
          .closest(".js-model")
          .find(".js-compare")
          .attr("data-bu");
        dataLayer["snsType"] = $(elObj).text();
        dataLayer["price"] = price;
        dataLayer["currencyCode"] = $(".currency-code").val();
        dataLayer["dimension185"] = $(".navigation").attr("data-obs-group");
        dataLayer["metric4"] = msrp;
        el_tempData.data({ dataLayer: dataLayer });
        break;
      case "mylg_wish_deleted_popup_close":
      case "mylg_wish_deleted_popup_confirm":
      case "mywish_deleted_popup_close":
      case "mywish_deleted_popup_confirm":
      case "plp_wish_signin":
      case "plp_wish_signin_close":
      case "pdp_wish_signin":
      case "pdp_wish_signin_close":
        dataLayer = el_tempData.data();
        break;
      default:
        var modelYear = nvl($(elObj).attr("data-model-year"), "");
        var price = "";
        price = $(elObj).attr("data-price");
        if (price == "." || price == ".00" || price == "0.0" || price == "0") {
          price = "";
        }
        var msrp = "";
        msrp = $(elObj).attr("data-msrp");
        if (msrp == "." || msrp == ".00" || msrp == "0.0" || msrp == "0") {
          msrp = "";
        }
        dataLayer["superCategory"] = $(elObj).attr("data-super-category-name");
        dataLayer["category"] = $(elObj).attr("data-category-name");
        dataLayer["subcategory"] = $(elObj).attr("data-sub-category-name");
        dataLayer["modelYear"] = modelYear;
        dataLayer["modelName"] = $(elObj).attr("data-model-name");
        dataLayer["modelCode"] = $(elObj).attr("data-model-id");
        dataLayer["salesModelCode"] = $(elObj).attr(
          "data-model-salesmodelcode"
        );
        dataLayer["sku"] = $(elObj).attr("data-sku");
        dataLayer["suffix"] = $(elObj).attr("data-model-suffixcode");
        dataLayer["bu"] = $(elObj).attr("data-bu");
        dataLayer["price"] = price;
        dataLayer["currencyCode"] = $(".currency-code").val();
        dataLayer["dimension185"] = $(".navigation").attr("data-obs-group");
        dataLayer["metric4"] = msrp;
        el_tempData.data({ dataLayer: dataLayer });
        break;
    }
    return el_tempData.data("dataLayer");
  }
  //PJTGADL-2

  function getProductMeta(elObj) {
    var $basicInfoEl = $(elObj).closest("[data-wish-basic-info]");
    var product = {};
    switch (pageEventStr) {
      case "mylg_wish_deleted_popup_close":
      case "mylg_wish_deleted_popup_confirm":
      case "mywish_deleted_popup_close":
      case "mywish_deleted_popup_confirm":
      case "plp_wish_signin":
      case "plp_wish_signin_close":
      case "pdp_wish_signin":
      case "pdp_wish_signin_close":
        product = el_tempData.data();
        break;
      default:
        product["sales_model_code"] = findSalesModel($(elObj));
        product["model_name"] = findModelName($(elObj));
        product["bu"] =
          typeof $basicInfoEl.data("adobe-bu") == "undefined"
            ? ""
            : $basicInfoEl.data("adobe-bu").toLowerCase();
        product["super_category"] =
          typeof $basicInfoEl.data("adobe-super-category") == "undefined"
            ? ""
            : $basicInfoEl.data("adobe-super-category");
        product["category"] =
          typeof $basicInfoEl.data("adobe-category") == "undefined"
            ? ""
            : $basicInfoEl.data("adobe-category");
        // product['sub_category'] = typeof $basicInfoEl.data('adobe-sub-category') == 'undefined' ? '' : $basicInfoEl.data('adobe-sub-category');
        if (
          pageEventStr == "plp_share_copyicon" ||
          pageEventStr == "pdp_share_copyicon"
        ) {
          product["copy_icon"] = $(elObj).data("adobe-copy-icon");
        }
        // Mobile일 경우에만 사용하기 위한 추가
        if ($(window).width() < 768) {
          var $btnListChange = $(".btn-listChange");
          if ($btnListChange.length > 0) {
            var listChangeData = "list_change_to_2";
            if ($btnListChange.hasClass("act")) {
              listChangeData = "list_change_to_1";
            }
            product["list_change"] = listChangeData;
          }
        }
        el_tempData.data({ product: product });
        break;
    }
    return el_tempData.data("product");
  }
});

// 20201126 PJTPLP-10 관련 추가
//$('body').on('click', '[data-sc-item="mylg_wish_view_all"],[data-sc-item="mywish_btn_back"],[data-sc-item="mywish_paging_view"]', function () {
$("body").on(
  "click",
  '[data-sc-item="mylg_wish_view_all"],[data-sc-item="mywish_btn_back"],[data-sc-item="mywish_paging_view"],[data-sc-item="plp_btn_list_change_to_1"],[data-sc-item="plp_btn_list_change_to_2"]',
  function () {
    var pageEvent = $(this).attr("data-sc-item");
    var productMeta = {};
    productMeta[pageEvent] = true;
    adobeTrackEvent(pageEvent, {
      products: [{}],
      page_event: productMeta,
    });
  }
);

$("body").on("plp_wish_icon_select", "#tempData", function (e) {
  var page_event = {};
  var pageEventStr = e.type;
  page_event[pageEventStr] = true;
  var productMeta = $(this).data("product");
  //PJTGADL-2
  var dataLayerMeta = $(this).data("dataLayer");
  adobeTrackEvent(pageEventStr, {
    products: [productMeta],
    page_event: page_event,
  });
  //PJTGADL-2
  var dataLayerpushData = $.extend(
    {
      event: "add_to_wishlist_click",
    },
    dataLayerMeta
  );
  dataLayer.push(dataLayerpushData);
});
$("body").on("plp_wish_icon_unselect", "#tempData", function (e) {
  var page_event = {};
  var pageEventStr = e.type;
  page_event[pageEventStr] = true;
  var productMeta = $(this).data("product");
  //PJTGADL-2
  var dataLayerMeta = $(this).data("dataLayer");

  adobeTrackEvent(pageEventStr, {
    products: [productMeta],
    page_event: page_event,
  });
  //PJTGADL-2
  var dataLayerpushData = $.extend(
    {
      event: "remove_from_wishlist_click",
    },
    dataLayerMeta
  );
  dataLayer.push(dataLayerpushData);
});
$("body").on("plp_wish_no_signin", "#tempData", function (e) {
  var page_event = {};
  var pageEventStr = e.type;
  page_event[pageEventStr] = true;
  var productMeta = $(this).data("product");

  adobeTrackEvent(pageEventStr, {
    products: [productMeta],
    page_event: page_event,
  });
});

$("body").on("pdp_wish_icon_select", "#tempData", function (e) {
  var page_event = {};
  var pageEventStr = e.type;
  page_event[pageEventStr] = true;
  var productMeta = $(this).data("product");
  //PJTGADL-2
  var dataLayerMeta = $(this).data("dataLayer");

  adobeTrackEvent(pageEventStr, {
    products: [productMeta],
    page_event: page_event,
  });
  //PJTGADL-2
  var dataLayerpushData = $.extend(
    {
      event: "add_to_wishlist_click",
    },
    dataLayerMeta
  );
  dataLayer.push(dataLayerpushData);
});

$("body").on("pdp_wish_icon_unselect", "#tempData", function (e) {
  var page_event = {};
  var pageEventStr = e.type;
  page_event[pageEventStr] = true;
  var productMeta = $(this).data("product");
  //PJTGADL-2
  var dataLayerMeta = $(this).data("dataLayer");

  adobeTrackEvent(pageEventStr, {
    products: [productMeta],
    page_event: page_event,
  });
  var dataLayerpushData = $.extend(
    {
      event: "remove_from_wishlist_click",
    },
    dataLayerMeta
  );
  dataLayer.push(dataLayerpushData);
});

$("body").on("pdp_wish_no_signin", "#tempData", function (e) {
  var page_event = {};
  var pageEventStr = e.type;
  page_event[pageEventStr] = true;
  var productMeta = $(this).data("product");
  //PJTGADL-2
  var dataLayerMeta = $(this).data("dataLayer");

  adobeTrackEvent(pageEventStr, {
    products: [productMeta],
    page_event: page_event,
  });
});
// PJTPLP-10 GILS

// for responsive
var mql = {
  maxXs: window.matchMedia("(max-width: 575px)"),
  minSm: window.matchMedia("(min-width: 576px)"),
  sm: window.matchMedia("(min-width: 576px) and (max-width: 767px)"),
  maxSm: window.matchMedia("(max-width: 767px)"),
  minMd: window.matchMedia("(min-width: 768px)"),
  md: window.matchMedia("(min-width: 768px) and (max-width: 991px)"),
  maxMd: window.matchMedia("(max-width: 991px)"),
  minLg: window.matchMedia("(min-width: 992px)"),
  maxLg: window.matchMedia("(max-width: 1199px)"),
  lg: window.matchMedia("(min-width: 992px) and (max-width: 1199px)"),
  minXl: window.matchMedia("(min-width: 1200px)"),
};
// Slick arrow html (WA-Common-Slick)
var previousTxt = $(".navigation").data("previous")
  ? $(".navigation").data("previous")
  : "Previous";
var nextTxt = $(".navigation").data("next")
  ? $(".navigation").data("next")
  : "Next";
var carouselOptions = {
  squarePrev:
    '<button type="button" class="slick-prev type-square" aria-label="previousTxt">' +
    previousTxt +
    "</button>",
  squareNext:
    '<button type="button" class="slick-next type-square" aria-label="' +
    nextTxt +
    '">' +
    nextTxt +
    "</button>",
  bigAnglePrev:
    '<button type="button" class="slick-prev" aria-label="' +
    previousTxt +
    '">' +
    previousTxt +
    ' <span class="icon" aria-hidden="true"><svg width="23px" height="40px"><path fill-rule="evenodd" fill="currentColor" d="M21.577,2.477 L3.668,19.984 L21.577,37.491 C22.160,38.061 22.160,38.985 21.577,39.555 C20.994,40.126 20.048,40.126 19.465,39.555 L0.726,21.238 C0.634,21.181 0.534,21.140 0.454,21.061 C0.150,20.764 0.013,20.373 0.025,19.984 C0.013,19.595 0.150,19.204 0.454,18.907 C0.535,18.828 0.635,18.786 0.728,18.729 L19.465,0.412 C20.048,-0.158 20.994,-0.158 21.577,0.412 C22.160,0.983 22.160,1.908 21.577,2.477 Z"/></svg></span></button>',
  bigAngleNext:
    '<button type="button" class="slick-next" aria-label="' +
    nextTxt +
    '">' +
    nextTxt +
    ' <span class="icon" aria-hidden="true"><svg width="23px" height="40px"><path fill-rule="evenodd" fill="currentColor" d="M21.546,21.061 C21.466,21.140 21.366,21.181 21.274,21.238 L2.535,39.555 C1.952,40.126 1.006,40.126 0.423,39.555 C-0.161,38.985 -0.161,38.061 0.423,37.491 L18.332,19.984 L0.423,2.477 C-0.161,1.908 -0.161,0.983 0.423,0.412 C1.006,-0.158 1.952,-0.158 2.535,0.412 L21.272,18.729 C21.365,18.786 21.465,18.828 21.546,18.907 C21.849,19.204 21.987,19.595 21.975,19.984 C21.987,20.373 21.849,20.764 21.546,21.061 Z"/></svg></span></button>',
};
// Scripts that convert svg files to online-svg
var initSVG = function () {
  $("img.inline-svg")
    .not(".lazyload")
    .inlineSVG({
      beforeReplace: function ($img, $svg, next) {
        $svg
          .find("path")
          .removeAttr("class")
          .removeAttr("id")
          .removeAttr("data-name");
        $svg.find("defs").remove();
        next();
      },
    });
};
// Get Cookie
var getCookie = function (name) {
  // 20200611 START 박지영 - IE main 에서 path 추가된 쿠키 잘 안 읽히는 case 예외 처리
  var c = !!$.cookie(name) ? decodeURIComponent($.cookie(name)) : "";
  /* 20201012 SSO domain 추가  */
  if (ISMAIN || ISSSO) {
    if (
      name == "LG5_RecentlyView" ||
      name == "LG5_CompareCart" ||
      name == "LG5_CartID" ||
      name == "LG5_SearchResult"
    ) {
      if (HOMEUSECOOKIELIST[name] !== undefined && c === "") {
        c = HOMEUSECOOKIELIST[name];
      }
    }
  }
  return c;
  // 20200611 END
};
var defaultPath = "/";
if (location.port == "3000") {
  // localhost gulp
  defaultPath = "/html";
} else if (location.href.indexOf("/lg5-common-gp/html/") > 0) {
  // dev html
  defaultPath = "/lg5-common-gp";
} else if (window.location.href.indexOf("/oauth/") >= 0) {
  defaultPath = "/oauth";
} else {
  // dev, stg, www
  defaultPath = "/" + COUNTRY_CODE.toLowerCase();
}
// Save Cookie, LGEKZ-111, LGEVN-678
var setCookie = function (
  name,
  val,
  domainFlag,
  expires,
  secureFlag,
  defaultRootPathFlag
) {
  var lh = location.host;
  var mydomain = ".lg.com";
  if (lh.indexOf("lge.com") >= 0) {
    mydomain = ".lge.com";
  } else if (lh.indexOf("localhost") >= 0) {
    mydomain = "localhost";
  }

  var domain = { path: defaultPath };

  // 20200416 START 박지영 - search b2b
  if (
    name == "LG5_B2B_CompareCart" ||
    name == "LG5_CompareCart" ||
    name == "LG5_RecentlyView" ||
    name == "LG5_SearchResult" ||
    name == "LG5_B2B_SearchResult" ||
    domainFlag == true
  ) {
    domain = {
      path: defaultPath,
      domain: mydomain,
    };
  }

  /* LGEVN-678 Start*/
  if (!!defaultRootPathFlag) {
    domain.path = "/";
  }
  if (!!secureFlag) {
    domain.secure = true;
  }
  /* // LGEVN-678 End*/

  /* LGEKZ-111 Start*/
  if (expires != undefined && expires != "") {
    domain.expires = expires;
  }
  if (name == "LG5_UNIT_OBS_FLAG") {
    domain.path = "/" + COUNTRY_CODE.toLowerCase();
  }
  /* LGEKZ-111 End*/
  // 20200511 START 구유정 || noMoreToday_covid 추가
  if (
    name == "noMoreToday" ||
    name == "noMoreToday_covid" ||
    name == "noMoreToday_notiPop"
  ) {
    /*LGEGMC-279 20200721*/
    if (COUNTRY_CODE != "in" && name != "noMoreToday") {
      domain.expires = 1;
    }
    /*LGEGMC-279 20200721*/
  }
  // 20200511 END 구유정 || noMoreToday_covid 추가
  if (
    name == "LG5_SupportSearch" ||
    name == "LG5_RememberAccount" ||
    name == "LG5_RecentlyView" ||
    name == "LG5_CST_RecentlyView" ||
    name == "LG5_ReviewHelpful" ||
    name == "LG5_SearchResult" ||
    name == "LG5_B2B_SearchResult"
  ) {
    domain.expires = 30;
  }
  // 20200416 END

  //if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
  $.cookie(name, encodeURIComponent(val), domain);
  //} else {
  //	ePrivacyCookies.view('click');
  //	return false;
  //}

  // 20200611 START 박지영 - IE main 에서 path 추가된 쿠키 잘 안 읽히는 case 예외 처리
  if (
    name == "LG5_RecentlyView" ||
    name == "LG5_CompareCart" ||
    name == "LG5_CartID" ||
    name == "LG5_SearchResult"
  ) {
    HOMEUSECOOKIELIST[name] = val;
  }
  // 20200611 END
};
// Remove Cookie
var removeCookie = function (name, domainFlag, defaultRootPathFlag) {
  var lh = location.host;
  var mydomain = ".lg.com";
  if (lh.indexOf("lge.com") >= 0) {
    mydomain = ".lge.com";
  } else if (lh.indexOf("localhost") >= 0) {
    mydomain = "localhost";
  }
  var domain = { path: defaultPath };
  // 20200427 START 박지영 - search b2b 수정
  if (
    name == "LG5_B2B_CompareCart" ||
    name == "LG5_CompareCart" ||
    name == "LG5_RecentlyView" ||
    name == "LG5_SearchResult" ||
    name == "LG5_B2B_SearchResult" ||
    domainFlag == true
  ) {
    // 20200427 END
    domain = {
      path: defaultPath,
      domain: mydomain,
    };
  }
  /* LGEVN-678 Start */
  if (!!defaultRootPathFlag) {
    domain.path = "/";
  }
  /* LGEVN-678 End */
  /*LGEITF-765 s*/
  if (name == "LG5_SearchResult") {
    HOMEUSECOOKIELIST[name] = "";
  }
  /*LGEITF-765 e*/

  $.removeCookie(name, domain);
};

// live chat
var prepareLiveChat = function () {
  if ($(".live-chat > a").length > 0) {
    //var cc = COUNTRY_CODE.toLowerCase();
    /*
		// 15번 컴포넌트 HTML 로 이동
		if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
			// for RU, KZ, UA
			if(cc=='ru' || cc=='kz' || cc=='ua') {
				(function() {
					var lt = document.createElement('script');
						lt.type = 'text/javascript';
						lt.async = true;
						lt.src = '//cs15.livetex.ru/js/client.js';
					var sc = document.getElementsByTagName('script')[0];
					if (sc) sc.parentNode.insertBefore(lt, sc); else document.documentElement.firstChild.appendChild(lt);
				})();
			}
		}
		*/
    $(".live-chat > a")
      .not(".js-popup")
      .on("click", function (e) {
        var cc = COUNTRY_CODE.toLowerCase();
        if (
          cc == "ru" ||
          cc == "kz" ||
          cc == "ua" ||
          cc == "uz" ||
          cc == "uz_ru"
        ) {
          e.preventDefault();
          if (
            typeof ePrivacyCookies == "undefined" ||
            ePrivacyCookies.get("LGCOM_IMPROVEMENTS")
          ) {
            if (LiveTex && typeof LiveTex.showWelcomeWindow == "function") {
              // RU, KZ, UA
              LiveTex.showWelcomeWindow();
            }
          } else {
            ePrivacyCookies.view("click");
          }
          // 20200409 START 박지영 VN livechat
        } else if (cc == "vn") {
          e.preventDefault();
          if (
            typeof ePrivacyCookies == "undefined" ||
            ePrivacyCookies.get("LGCOM_IMPROVEMENTS")
          ) {
            if (typeof $.cookie("VN_open_chat") === "undefined") {
              $.cookie("VN_open_chat", "Y", { path: "/" });
            }
            var pname =
              document.title != ""
                ? document.title
                : document.querySelector("h1").innerHTML;
            var ga = document.createElement("script");
            ga.async = 1;
            ga.src =
              "https://live.vnpgroup.net/js/web_client_box.php?hash=83ed899d26f9aa8bf6979adf7b43bac9&data=eyJzc29faWQiOjQ4NDA1MzUsImhhc2giOiJmOTE5Y2Y1OTdkZDdhMDNhODhiNGFmZmMzMWQ3Y2U2OSJ9&pname=" +
              pname;
            var s = document.getElementsByTagName("script");
            s[0].parentNode.insertBefore(ga, s[0]);
          } else {
            ePrivacyCookies.view("click");
          }
          // 20200409 END
        }
      });
  }
};
prepareLiveChat();
/*LGEGMC-1035 start*/
var energylabelTooltip = function () {
  $(document).on(
    "click",
    ".energy-label-wrap .label-link , .energy-label-wrap .text-tooltip",
    function (e) {
      // LGEGMC-4108 : text-tooltip add
      e.preventDefault();
    }
  );
  $(document).on("keyup , keydown", ".energy-label-wrap", function (e) {
    if (e.type == "keyup") {
      if ($(e.target).length < 0) {
        $(this).removeClass("keyMove");
      } else {
        $(this).addClass("keyMove");
      }
    }
    if (e.type == "keydown") {
      if (e.keyCode == 9) {
        if (e.target.className == "link-text link-text-eu") {
          $(this).removeClass("keyMove");
        }
      }
      if (e.shiftKey && e.keyCode == 9) {
        $(this).removeClass("keyMove");
      }
    }
  });
};
/*LGEGMC-1035 end*/
// pop-up
var win;
var tmp;
var winowPop = function () {
  //var popup = document.getElementsByClassName('js-popup');
  //$(popup).on('click', function (e) {
  $(document).on("click", "a.js-popup", function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var cc = COUNTRY_CODE.toLowerCase();
    /*LGEMS-368 start */
    if ($(this).hasClass("chatbotUseEpromotor")) {
      $(".epromotor-widget").length > 0 &&
      $(".epromotor-widget-area").hasClass("active")
        ? $(".epromotor-widget").trigger("click")
        : "";
      $("#modal_chat").modal("hide");
    } else {
      var target = this.getAttribute("href"),
        popupWidth = parseInt(this.getAttribute("data-width")),
        popupHeight = parseInt(this.getAttribute("data-height")),
        screenWidth = parseInt(screen.width),
        screenHeight = parseInt(screen.height),
        intLeft = Math.floor((screenWidth - popupWidth) / 2),
        intTop = Math.floor((screenHeight - popupHeight) / 2);

      if (intLeft < 0) intLeft = 0;
      if (intTop < 0) intTop = 0;

      // 20200325 START 박지영 : 쿠키 배너 셋팅에 따라 기능 막았던 것 제거
      if (target.indexOf("boldchat.com") > 0) {
        //  && $(this).parent().is('.live-chat')
        /*
				LiveChat 
				- ro 인 경우 (단순 팝업), 나머지 국가는 pageViewer 체크함
				- boldChatFlag 가 Blod-A 인 경우
				- boldChatFlag 가 Blod-B 인 경우
				- 나머지
				*/
        // live chat (de, fr, gr, pt, uk ..)
        var currUrl = document.location.href;
        window.open(
          (
            (window.pageViewer && pageViewer.link) ||
            function (link) {
              return link;
            }
          )(
            target +
              "&vr=&vn=&vi=&ve=&vp=&iq=&curl=" +
              "&url=" +
              escape(currUrl)
          ),
          "Chat893536861983465199",
          "width=" +
            popupWidth +
            ",height=" +
            popupHeight +
            ",left=" +
            intLeft +
            ",top=" +
            intTop +
            ",history=no,resizable=no,status=no,scrollbars=yes,menubar=no"
        );
      } else if (target.indexOf("velaro.com") > 0) {
        //  && $(this).parent().is('.live-chat')
        // ca_en, ca_fr
        window.open(
          target,
          "_blank",
          "width=" +
            popupWidth +
            ",height=" +
            popupHeight +
            ",left=" +
            intLeft +
            ",top=" +
            intTop +
            ",history=no,resizable=no,status=no,scrollbars=yes,menubar=no"
        );
      } else if (
        ($(this).attr("data-link-name") == "live_chat" ||
          $(this).attr("data-link-name") == "online_chat") &&
        cc != "it" &&
        cc != "pl"
      ) {
        //LGETH-499
        if (!tmp) {
          win = window.open(
            target,
            "_blank",
            "width=" +
              popupWidth +
              ",height=" +
              popupHeight +
              ",left=" +
              intLeft +
              ",top=" +
              intTop +
              ",history=no,resizable=no,status=no,scrollbars=yes,menubar=no"
          );
          tmp = true;
        } else {
          if (!win.closed && win) {
            win.focus();
          } else {
            win = window.open(
              target,
              "_blank",
              "width=" +
                popupWidth +
                ",height=" +
                popupHeight +
                ",left=" +
                intLeft +
                ",top=" +
                intTop +
                ",history=no,resizable=no,status=no,scrollbars=yes,menubar=no"
            );
            tmp = true;
          }
        }
      } else {
        //LGEAU-934
        if (!tmp) {
          win = window.open(
            target,
            "_blank",
            "width=" +
              popupWidth +
              ",height=" +
              popupHeight +
              ",left=" +
              intLeft +
              ",top=" +
              intTop +
              ",history=no,resizable=no,status=no,scrollbars=yes,menubar=no"
          );
          tmp = true;
        } else {
          if (!win.closed && win) {
            win.focus();
          } else {
            win = window.open(
              target,
              "_blank",
              "width=" +
                popupWidth +
                ",height=" +
                popupHeight +
                ",left=" +
                intLeft +
                ",top=" +
                intTop +
                ",history=no,resizable=no,status=no,scrollbars=yes,menubar=no"
            );
            tmp = true;
          }
        }
      }
      // 20200325 END
    } /*LGEMS-368 end */
  });
};
var openWin = function (url, target, width, height) {
  var opt = {
    url: url || "#",
    target: target || "_blank",
    width: width || "600",
    height: height || "800",
  };
  var winX = window.screenX || window.screenLeft || 0;
  var winY = window.screenY || window.screenTop || 0;
  var intLeft = Math.max(
    winX + Math.floor((screen.availWidth - opt.width) / 2),
    0
  );
  var intTop = Math.max(
    winY + Math.floor((screen.availHeight - opt.height) / 2),
    0
  );
  //LGCOMITF-28
  //var winObj;
  var winObj = window.open(
    opt.url,
    opt.target,
    "width=" +
      opt.width +
      ",height=" +
      opt.height +
      ",left=" +
      intLeft +
      ",top=" +
      intTop +
      ",history=no,resizable=no,status=no,scrollbars=yes,menubar=no"
  );
  window.addEventListener(
    "message",
    function (event) {
      if ((event.data = "authorizeKey")) {
        winObj.postMessage(
          { message: "authorize", key: getUrlParams().authorizeKey },
          "*"
        );
      } else if ((event.data = "snsDupChk")) {
        window.name = event.data;
      }
    },
    false
  );
  //LGCOMITF-28
};
var getUrlParams = function () {
  var params = {};
  window.location.search.replace(
    /[?&]+([^=&]+)=([^&]*)/gi,
    function (str, key, value) {
      params[key] = value;
    }
  );
  return params;
};

// tooltip
var tooltipActive = function () {
  // LGEIS-745 Start
  // 기존 click 시 toggle 기능과 신규 추가되는 hover 기능의 코드 중복 방지를 위해 show/hide 코드를 object method로 통합 관리
  var tooltip = {
    button: document.getElementsByClassName("js-tooltip"),
    close: document.getElementsByClassName("tooltip-close"),
    showBox: function (activeButton) {
      $(".tooltip-area").removeClass("out").hide();
      var activeBox = activeButton.next(".tooltip-area");
      activeBox.show();
      // 화면 밖으로 나가는 경우 처리
      var offsetLeft = activeBox.offset().left;
      var offsetRight = offsetLeft + activeBox.outerWidth();
      var rightSpace = offsetRight - $(window).width();

      if (offsetLeft < 0) {
        activeBox.css(
          "transform",
          "translateX(" + Math.abs(offsetLeft - 10) + "px)"
        );
      } else if ($(window).width() < offsetRight) {
        activeBox.css(
          "transform",
          "translateX(" + -1 * Math.abs(rightSpace + 10) + "px)"
        );
      }
    },
    hideBox: function (activeButton) {
      activeButton.focus();
      activeButton.next(".tooltip-area").removeAttr("style").hide();
    },
    resizeCheck: function () {
      // hover 기능 적용 분기를 위해 마크업의 data-pc-hover flag 확인 + only PC
      // 추후 기능 on/off 편리성을 위해 data-pc-hover="Y" 값만 hover 기능 구현되도록 개발
      // tooltip을 그룹화한 마크업 패턴이 없기 때문에 개별로 flag 속성값 적용
      if ($(".js-tooltip[data-pc-hover]").length && $(window).width() > 1325) {
        $(this.button).hover(
          function () {
            if ($(this).data("pcHover") == "Y") tooltip.showBox($(this));
          },
          function () {
            if ($(this).data("pcHover") == "Y") tooltip.hideBox($(this));
          }
        );
      } else {
        $(this.button).unbind("mouseenter mouseleave");
      }
    },
  };
  // LGEIS-745 End

  $(tooltip.button)
    .off("click")
    .on("click", function (e) {
      // LGEIS-745
      e.preventDefault();
      if ($(this).next(".tooltip-area").css("display") != "block") {
        tooltip.showBox($(this)); // LGEIS-745
      } else {
        tooltip.hideBox($(this)); // LGEIS-745
      }
    });
  $(tooltip.close)
    .off("click")
    .on("click", function (e) {
      // LGEIS-745
      e.preventDefault();
      $(this).closest(".tooltip-wrap").find(".js-tooltip").focus();
      $(this).closest(".tooltip-area").hide();
    });
  $(window)
    .resize(function () {
      $(".tooltip-area").hide();
      tooltip.resizeCheck(); // LGEIS-745
    })
    .resize();
};
// count the number
var checkTextLength = function (obj, count) {
  var max = parseInt(obj.attr("maxlength"));
  var mathNonByte = obj.siblings(".char-count").attr("data-non-byte"); // LGEKZ-55
  /*
	obj.on('keyup, input', function () {
		var type = obj.val().length;
		var remain = max - type;
		count.text(remain);
		var str1 = obj.val();
		var str2 = "";
		if (remain <= 1) {
			str2 = str1.substr(0, max);
		}
	});
	*/
  obj.off("keyup input").on("keyup input", function (e) {
    var tgField = e.currentTarget;
    var byteTotal = 0;
    var tmpByte = 0;
    var strLen = 0;
    var c;
    for (var i = 0; i < tgField.value.length; i++) {
      c = escape(tgField.value.charAt(i));
      // LGEKZ-55 Start
      if (mathNonByte == "Y") {
        tmpByte++;
      } else {
        if (c.length == 1) {
          tmpByte++;
        } else if (c.indexOf("%u") != -1) {
          // byte 조정
          tmpByte += 3;
        } else {
          tmpByte++;
        }
      }
      // LGEKZ-55 End

      if (tmpByte > max) {
        strLen = i;
        break;
      } else {
        byteTotal = tmpByte;
      }
    }
    if (strLen) {
      tgField.value = tgField.value.substring(0, strLen);
    }
    count.text(Math.max(0, max - byteTotal));
  });
};
// Script to prevent multiple calls of url once called in ajax call
var ajax = {
  cacheParams: [],
  cacheDatas: [],
  // default : cached data
  call: function (paramURL, param, type, callback, sType, progressiveTarget) {
    var dataType = type ? type : "json";
    var sendType = sType ? sType : commonSendType;
    var pTarget = progressiveTarget;
    var isFormData = param instanceof FormData;
    var stringParam = "";
    var paramChk = param && param != null ? true : false;

    if (paramChk) {
      if (typeof param == "string") {
        stringParam = param;
      } else {
        stringParam = jQuery.param(param);
      }
    } else {
      stringParam = "";
    }

    $.ajax({
      type: sendType,
      url: paramURL,
      // async: false,
      dataType: type,
      data: xssfilter(param),
      contentType: isFormData
        ? false
        : "application/x-www-form-urlencoded; charset=UTF-8",
      xhrFields:
        window.location.href.indexOf("/oauth/") !== -1
          ? { withCredentials: true }
          : "",
      processData: isFormData ? false : true,
      beforeSend: function () {
        // caching check;
        var idx =
          sendType == "post"
            ? ajax.cacheParams.indexOf(this.url + "?" + stringParam)
            : ajax.cacheParams.indexOf(this.url);
        if (idx >= 0) {
          data = ajax.cacheDatas[idx];
          callback(data, this);
          return false;
        }
        if (pTarget) {
          // console.log('loading', $(pTarget).attr('class'));
          $(pTarget).trigger("ajaxLoadBefore");
        }
      },
      success: function (d) {
        if (dataType == "json") {
          if (typeof d === "string") {
            d = $.parsejson(d);
          }
        }
        if (d.status != "success" && d.message != null && d.message != "") {
          // error msg
          ajax.popupErrorMsg(d.message);
          d = false;
        } else {
          // pass data
          // check cached data
          if (sendType == "post")
            ajax.cacheParams.push(this.url + "?" + stringParam);
          else ajax.cacheParams.push(this.url);

          // caching data
          ajax.cacheDatas.push(d);
        }
        // finish ajax loading
        if (pTarget) {
          $(pTarget).trigger("ajaxLoadEnd");
        }
        callback(d, this);
      },
      error: function (request, status, error) {
        console.log("status: " + status);
        console.log("error: " + error);
        if (pTarget) {
          $(pTarget).trigger("ajaxLoadEnd");
        }
        callback(false, this);
        ajax.popupErrorMsg(error);
      },
    });
  },
  // Scripts used when caching is disabled
  noCacheCall: function (
    paramURL,
    param,
    type,
    callback,
    sType,
    progressiveTarget,
    async
  ) {
    var dataType = type ? type : "json";
    var sendType = sType ? sType : commonSendType;
    var pTarget = progressiveTarget;
    var isFormData = param instanceof FormData;

    $.ajax({
      type: sendType,
      url: paramURL,
      async: async || true,
      dataType: type,
      data: xssfilter(param),
      cache: false,
      contentType: isFormData
        ? false
        : "application/x-www-form-urlencoded; charset=UTF-8",
      xhrFields:
        window.location.href.indexOf("/oauth/") !== -1
          ? { withCredentials: true }
          : "",
      processData: isFormData ? false : true,
      beforeSend: function () {
        if (pTarget) {
          if (!!pTarget) {
            if (!$(pTarget).hasClass("link-upgrade ajax-call-area")) {
              $(pTarget).trigger("ajaxLoadBefore");
            }
          } else {
            $(pTarget).trigger("ajaxLoadBefore");
          }
        }
      },
      success: function (d) {
        if (dataType == "json") {
          if (typeof d === "string") {
            d = $.parsejson(d);
          }
        }
        // error msg
        if (d.status != "success" && d.message != null && d.message != "") {
          ajax.popupErrorMsg(d.message);
          d = false;
        }

        if (pTarget) {
          $(pTarget).trigger("ajaxLoadEnd");
        }
        callback(d, this);
      },
      error: function (request, status, error) {
        console.log("status: " + status);
        console.log("error: " + error);
        if (pTarget) {
          $(pTarget).trigger("ajaxLoadEnd");
        }
        callback(false, this);
        ajax.popupErrorMsg(error);
      },
    });
  },
  popupErrorMsg: function (msg) {
    if (!$.trim(msg)) return false;
    console.log(msg);
    /*
		if (document.querySelectorAll('meta[name="v-mode"][content="author"]').length == 0) {
			var errorMsg = document.getElementById("serverErrorMsg");
			if (!errorMsg) {
				var html = '<div class="modal modal-simple fade" id="serverErrorMsg" tabindex="-1" role="dialog" data-backdrop="false"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-body"><div class="simple-content-box"><div class="content-paragraph">' + msg + '</div></div></div><div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal">Close</button></div></div></div></div>';
				$('body').append(html);
				errorMsg = document.getElementById("serverErrorMsg");
				$(errorMsg).modal("show");
			} else if (!$(errorMsg).hasClass('show')) {
				errorMsg.querySelector('.content-paragraph').innerHTML = msg;
				$(errorMsg).modal("show");
			}
		}
		*/
  },
};
$("body").on({
  ajaxLoadBefore: function (e) {
    e.stopPropagation();
    $(this).append(
      '<div class="loading-circle"><div class="lds-dual-ring"></div></div>'
    );
  },
  ajaxLoadEnd: function (e) {
    e.stopPropagation();
    $(this).find(".loading-circle").remove();
  },
});
// 20200416 START 박지영 - loading img 추가
$(
  ".GPC0003 .component-inner-box, .GPC0004 .component-inner-box, .GPC0020 .find-a-dealer-wrap, .GPC0064, .GPC0114, .GPC0102 .map-container, .GPC0108 .map-container, .GPC0113 .map-container, .GPC0116 .map-container, .GPC0118 .map-container, .ajax-call-area"
).on({
  ajaxLoadBefore: function (e) {
    e.stopPropagation();
    $(this).append(
      '<div class="loading-circle"><div class="lds-dual-ring"></div></div>'
    );
  },
  ajaxLoadEnd: function (e) {
    e.stopPropagation();
    $(this).find(".loading-circle").remove();
  },
});
// 20200416 END

// Script used to change options of select by calling ajax
(function ($) {
  $.fn.drawAjaxOptions = function (options) {
    var _this = this.get(0);
    var $this = $(this);
    var opt = $.extend(
      {
        setTarget: null,
        url: null,
        dynamicParam: false,
        param: {},
        addParam: [],
        keyName: null,
        keyValue: null,
        empty: function () {},
        notEmpty: function () {},
        callback: function () {},
      },
      options,
      $this.data()
    );

    var category = {
      initialized: false,
      init: function () {
        if (!category.initialized) {
          category.addEvent();
          category.initialized = true;
        }
      },
      creatOptions: function (t, dataObj) {
        var html = "";
        // selectbox placeholder
        html +=
          '<option value="" disabled selected>' +
          t.getAttribute("data-placeholder") +
          "</option>";

        if (opt.dataArray) {
          dataObj = dataObj.data instanceof Array ? dataObj.data[0] : dataObj;
          //console.log(dataObj);
          dataObj = dataObj[opt.dataArray];
        }
        if (
          JSON.stringify(dataObj) == "{}" ||
          dataObj.length == 0 ||
          JSON.stringify(dataObj) == undefined
        ) {
          $(t).html(html);
          t.setAttribute("disabled", "disabled");
          $this.trigger("options.empty");
        } else {
          for (var key in dataObj) {
            var text, val;

            if (typeof dataObj[key] == "object") {
              if (opt.keyName != null && opt.keyValue != null) {
                // has option key names
                var currentKey = dataObj[key];
                text = currentKey[opt.keyName];
                val = currentKey[opt.keyValue];
              } else {
                // default
                for (var k in dataObj[key]) {
                  text = dataObj[key][k];
                  val = k;
                }
              }
            } else {
              (text = dataObj[key]), (val = key); // jshint ignore:line
            }

            if (val == null || val == "") {
              html +=
                '<option value="' + val + '" disabled>' + text + "</option>";
            } else {
              html += '<option value="' + val + '">' + text + "</option>";
            }
          }
          $(t).html(html);
          $this.trigger("options.notEmpty");
          t.removeAttribute("disabled");
          /* PJTERAP-1 Start, 조회 카테고리 영역  show */
          var pageFlag =
            $("#mylgProductPageType").val() != null &&
            $("#mylgProductPageType").val() != undefined &&
            $("#mylgProductPageType").val() == "ocr";
          if (pageFlag) {
            $(t).closest("div").show();
          }
          /* PJTERAP-1 End */
        }
        $(t).trigger("chosen:updated");
      },
      changeEventFnc: function (e, f) {
        if (f == true) return false;
        var check =
          jQuery().checkValidation != undefined &&
          $(e.currentTarget).checkValidation({ onlyBoolean: true });
        if (e.currentTarget.type.indexOf("select") >= 0 || check) {
          var _param = opt.param;
          if (opt.dynamicParam == true) {
            _param = e.currentTarget.getAttribute("data-param");
            _param = _param ? _param : {};
          }

          if (typeof _param != "string") {
            _param = $.param(_param);
          }

          var optionParam = $(e.currentTarget)
            .find("option")
            .eq(e.currentTarget.selectedIndex)
            .data();
          optionParam = optionParam ? jQuery.param(optionParam) : "";

          var param =
            $(e.currentTarget).serialize() + "&" + _param + "&" + optionParam;
          // 추가 카테고리값 필요할시
          if (!!opt.addParam.length) {
            $.each(opt.addParam, function () {
              param += "&" + $(this).serialize();
            });
          }
          var url = opt.url;
          // var data = ajax.call(url, param);
          ajax.noCacheCall(url, param, "json", function (data) {
            if (data) {
              category.creatOptions(opt.setTarget, data);
              opt.callback(data);
            }
          });
          $(opt.setTarget).trigger("chosen:updated");
        }
      },
      addEvent: function () {
        if (_this.type.indexOf("select") >= 0) {
          $this.on({
            "change.base": category.changeEventFnc,
          });
        } else {
          $this.on({
            "blur.base": category.changeEventFnc,
          });
        }
        $this.on({
          "options.empty": opt.empty,
          "options.notEmpty": opt.notEmpty,
        });
      },
    };

    return this.each(function () {
      category.init();
    });
  };
})(jQuery);

// form
var setForm = function () {
  var target = document.getElementsByTagName("form");
  for (var i = 0; i < target.length; i++) {
    var _this = target[i];
    var method = _this.getAttribute("data-ajax-method");
    method = method ? method : commonSendType;
    _this.removeAttribute("data-ajax-method");

    $(_this).data("ajaxMethod", method);
  }
};
// EMP 20220127 START 이상현

// input event - .label-animation-input 이벤트 추가
const labelAnimate = function labelAnimate($input) {
  const $target = $input.closest(".label-animation-input");
  const hasValue = 0 < $input.val().length;
  if (hasValue) return $target.addClass("active");
  $target.removeClass("active");
};
$(function () {
  const $target = $(".label-animation-input input");
  if (0 >= $target.length) return false;
  $target.each(function (i, el) {
    labelAnimate($(el));
  });
});
$("body").on("input change", ".label-animation-input input", function (event) {
  labelAnimate($(event.target));
});
//  EMP 20220127 END 이상현

//LGEGMC-1118 Start
var cesPop = function (e) {
  $(document).on("click", "a.lg_x_ces2021", function (e) {
    e.preventDefault();
    var _this = $(this);
    var redirectUrl = _this.data("url");

    window.open(redirectUrl, "_blank");
  });
};
// LGEGMC-1118 End
// LGENL-123 s
var bvTrackingCookies = function (e) {
  const bvCookieConsent = document.createElement("meta");
  if (
    typeof ePrivacyCookies == "undefined" ||
    ePrivacyCookies.get("LGCOM_ANALYSIS_OF_SITE")
  ) {
    // Create the bv:cookies meta element
    bvCookieConsent.name = "bv:cookies";
    bvCookieConsent.content = "true";
    document.head.appendChild(bvCookieConsent);
  } else {
    bvCookieConsent.name = "bv:cookies";
    bvCookieConsent.content = "false";
    document.head.appendChild(bvCookieConsent);
  }
};
// LGENL-123 e

//LGEITF-376 START
var getAccessToken = function () {
  // LGEITF-916, LGEITF-961 Start
  const AccessFrontDomain = ISSSO ? MAIN_DOMAIN : "";
  const url =
    AccessFrontDomain +
    "/" +
    COUNTRY_CODE.toLowerCase() +
    "/mkt/ajax/commonmodule/getAccessToken";
  // LGEITF-916, LGEITF-961 End
  $.ajax({
    type: "post",
    url: url,
    dataType: "json",
    success: function (data) {
      console.log("getAccessToken call!");

      if (data.authToken != "") {
        sessionStorage.setItem("ACCESS_TOKEN", data.authToken);
        salesForceRunV2 = salesForceUseFlagV2; // LGEGMC-5141
      } else {
        sessionStorage.setItem("ACCESS_TOKEN", "");
      }
      if (salesForceUseFlag || salesForceRunV2)
        setTimeout(salesForce.init, 3000); // LGEGMC-5141 :: V2 여부와 상관없이 로그인 여부 체크 후 salesForce 로직 진입히도록 개선
    },
    error: function (request, status, error) {
      sessionStorage.setItem("ACCESS_TOKEN", "");
      console.log("getAccessToken^^status: " + status);
      console.log("getAccessToken^^error: " + error);
    },
  });
};
getAccessToken();
//LGEITF-376 END

//LGEGMC-2851 START
obsReferrerPop = {
  callobsReferrerPop: function (referrerDomain) {
    $("#modal_open_vip_referrer_coupon").modal("hide");
    $("#modal_vip_referrer_coupon").modal("show");

    $("#modal_open_vip_referrer_coupon").on("shown.bs.modal", function (e) {
      document.body.style.overflowY = "auto";
      $(document.body).removeData("position");
      document.body.style.position = "";
    });

    $("#modal_open_vip_referrer_coupon").on("hidden.bs.modal", function (e) {
      let padding = $(document.body).data("padding-right");
      $(document.body).removeData("padding-right");
      $(document.body).removeData("overflow-y");
      document.body.style.paddingRight = padding ? padding : "";
      document.body.style.overflowY = "";
    });

    $("#todayClose").click(function () {
      obsReferrerPop.todayClosePopup(referrerDomain);
    });
  },
  setCookie: function (cname, cvalue, exdays) {
    let lh = location.host;
    let mydomain = ".lg.com";
    if (lh.indexOf("lge.com") >= 0) {
      mydomain = ".lge.com";
    } else if (lh.indexOf("localhost") >= 0) {
      mydomain = "localhost";
    }

    // 24시간 기준 쿠키 설정하기
    let todayDate = new Date();
    todayDate.setTime(todayDate.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = todayDate; // UTC기준의 시간에 exdays인자로 받은 값에 의해서 cookie가 설정 됩니다.

    let domain = {
      path: defaultPath,
      domain: mydomain,
      expires: expires,
    };

    $.cookie(cname, encodeURIComponent(cvalue), domain);
  },
  todayClosePopup: function (referrerDomain) {
    if ($("input[name='vipReferrerCouponToday']").is(":checked") == true) {
      obsReferrerPop.setCookie("referrerTodayClose", "Y," + referrerDomain, 1); //기간( ex. 1은 하루, 7은 일주일)
    }
    $("#modal_vip_referrer_coupon").hide();

    let refererCookie = getCookie("referrerTodayClose");
    refererCookie = refererCookie.split(",");
    if (refererCookie[0] == "Y") {
      $("#modal_vip_referrer_coupon").modal("hide");
      $("#modal_open_vip_referrer_coupon").modal("hide");
    } else {
      $("#modal_vip_referrer_coupon").modal("show");
    }
  },
  init: function () {
    // localhost 에서 실행하면 getDomainUrl 에서 발생하는 오류로 인해
    // 이후 스크립트 실행이 중단되므로, localhost에서는 실행하지 않도록 수정해 둡니다.
    if (document.domain == "localhost") return false;

    if (
      document.referrer.indexOf("lg.com/" + COUNTRY_CODE.toLowerCase()) < 0 &&
      document.referrer != "" &&
      document.referrer != "undefined" &&
      document.referrer != null &&
      document.referrer.indexOf(SSODOMAIN) < 0
    ) {
      let url =
          "/" + COUNTRY_CODE.toLowerCase() + "/api/popup/retrieveReferrerPopup",
        referrerDomain = getDomainUrl(document.referrer),
        cartId = getCookie("LG5_CartID");

      let refererCookie = getCookie("referrerTodayClose");
      refererCookie = refererCookie.split(",");
      if (refererCookie[0] == "Y") {
        obsReferrerPop.setCookie(
          "referrerTodayClose",
          "Y," + referrerDomain,
          1
        );
      } else {
        obsReferrerPop.setCookie("referrerTodayClose", referrerDomain, 1);
      }

      console.log("Referrer Check : " + referrerDomain);

      $.ajax({
        type: "post",
        url: url,
        dataType: "html",
        data: { cartId: cartId, referrerDomain: referrerDomain },
        success: function (html) {
          sessionStorage.setItem("referrerDomain", referrerDomain);
          $("#modal_open_vip_referrer_coupon").remove();
          $("body").append(html);

          let refererCookie = getCookie("referrerTodayClose");
          refererCookie = refererCookie.split(",");
          if (refererCookie[0] == "Y") {
            $("#modal_open_vip_referrer_coupon").modal("hide");
          } else {
            $("#modal_open_vip_referrer_coupon").modal("show");
          }

          setTimeout(function () {
            $("#modal_open_vip_referrer_coupon").modal("hide");
          }, 5000);

          $("#btn_open_vip_referrer_coupon").on("click", function () {
            obsReferrerPop.callobsReferrerPop(referrerDomain);
          });
        },
        error: function (request, status, error) {
          sessionStorage.setItem("referrerDomain", "");
          console.log("status: " + status);
          console.log("error: " + error);
        },
      });
    }
  },
};
let obsReferrerFlag = $(".navigation").data("obs-referrer-flag");
if (
  (obsReferrerFlag == "Y" && ISMAIN) ||
  $(".GPC0007").length > 0 ||
  $(".GPC0009").length > 0
) {
  obsReferrerPop.init();
}
//LGEGMC-2851 END

// init
$(document).ready(function () {
  initSVG();
  winowPop();
  tooltipActive();
  setForm();
  energylabelTooltip();
  cesPop();
  // LGENL-123 s
  if (COUNTRY_CODE.toLowerCase() == "nl") {
    if (typeof ePrivacyCookies != "undefined") {
      bvTrackingCookies();
    } else {
      setTimeout(function () {
        bvTrackingCookies();
      }, 300);
    }
  }
  // LGENL-123 e

  /* LGEGMC-945 Start */
  if (!!document.getElementById("inquirytoBuyForm")) {
    window.addEventListener("message", sendPostMessage);
  }
  /* LGEGMC-945 End */

  // LGEJP-643 Start
  if (COUNTRY_CODE.toLowerCase() == "jp") {
    if (agent.indexOf("windows") != -1) {
      $(".pc-remote").hide();
    } else {
      $(".pc-remote").show();
    }
  }
  // LGEJP-643 End
});

// search box common script
var searchCommon = [],
  searchInit = function () {
    $(".search-common").each(function (idx) {
      var $searchCommon = $(this);
      if ($searchCommon.data("searchIdx") == undefined) {
        idx = searchCommon.length;

        this.setAttribute("data-search-idx", idx);
        searchCommon[idx] = {
          //$obj : $(document.querySelector('.search-common')),
          $obj: $searchCommon,
          canFocus: 0,
          canSubmit: 0,
          canCookie: 0,
          minLength: 0,
          cookieName: "",
          action: "",
          max: 10,
          functionName: "",
          $layer: null,
          $input: null,
          $recentArea: null,
          $resultArea: null,
          $template: null,
          $btnSubmit: "",
          $btnClose: "",
          $btnClear: "",
          init: function () {
            var el = this.$obj;
            this.canFocus = el.data("canfocus");
            this.canSubmit = el.data("cansubmit");
            this.cookieName = el.data("cookiename");
            this.functionName = el.data("function");
            this.minLength = el.data("minlength") ? el.data("minlength") : 1;
            this.$layer = el.find(".search-layer");
            this.$input = el.find(".search-common-input");
            this.$recentArea = this.$layer.find(".recent-suggested-type");
            this.$resultArea = this.$layer.find(".search-result-list");
            this.$autoArea = this.$layer.find(".autoName-area");
            this.$template = this.$layer.find("template");
            this.action = el.attr("action");
            this.max = el.data("max");
            this.$btnSubmit = el.find("a.submit").length
              ? el.find("a.submit")
              : el.find("input.submit"); // LGECI-379
            this.$btnClose = el.find(".link-close");
            this.$btnClear = el.find(".btn-clear");
            if (this.cookieName) {
              this.canCookie = 1;
            }
            // Recent, Focus and Input must be run when layer exists
            if (this.$layer.length > 0) {
              this.bindInput();
              if (this.canFocus > 0) {
                this.bindFocus();
              } else {
                // hide see more
                this.$resultArea.find(".search-result-seemore").hide();
                this.bindNoFocus();
              }
              // If layer exists in mobile, float to top in focus
              /*
							if ('ontouchstart' in window) {
								this.$input.on('focus', function() {
									//searchCommon[idx].$obj.addClass('fixed');
									$('body').addClass('floating-search');
								});
								// close
								this.$input.on('blur', function() {
									searchCommon[idx].$obj.removeClass('fixed');
									$('body').removeClass('band-scroll');
								});
							}
							*/
              // Find all focusable children

              var focusableElementsString =
                'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

              if (!$(".navigation").hasClass("mobile-device")) {
                // do not remove 'if', because android bug
                // 20200406 START 박지영 || search input에서 키보드 포커스 처리 수정 [redmine #5487]
                /*
								this.$input.on('blur', function(e) {
									e.preventDefault();
									var close = $(this).closest('.search-common').find('.search-layer .predictive-search:visible').find('.search-footer-area a.link-close');
									if(close && close.length>0) {
										close.focus();
									}
								});
								*/
                this.$input.on("keydown", function (e) {
                  if (e.keyCode === 9) {
                    if (e.shiftKey) {
                      $(".search-area .search-layer").removeClass("active");
                      /* LGECI-258 20201221 add */
                      // } else {
                      // var layer = $(this).closest('.search-common').find('.search-layer');
                      // if(layer.hasClass('active')) {
                      // 	e.preventDefault();
                      // 	var close = layer.find('.predictive-search:visible').find('.search-footer-area a.link-close');
                      // 	if(close && close.length>0) {
                      // 		close[0].focus();
                      // 	}
                      // }
                      /* //LGECI-258 20201221 add */
                    }
                  }
                });
                // 20200406 END
              }

              this.$layer.on(
                {
                  keydown: function (e) {
                    // Convert NodeList to Array
                    var focusableElements = e.currentTarget.querySelectorAll(
                      focusableElementsString
                    );
                    focusableElements =
                      Array.prototype.slice.call(focusableElements);
                    var firstTabStop = focusableElements[0];
                    var lastTabStop =
                      focusableElements[focusableElements.length - 1];
                    // Check for TAB key press
                    if (e.keyCode === 9) {
                      // SHIFT + TAB
                      if (e.shiftKey) {
                        if (document.activeElement === firstTabStop) {
                          e.preventDefault();
                          lastTabStop.focus();
                        }
                        // TAB
                      } else {
                        if (document.activeElement === lastTabStop) {
                          e.preventDefault();
                          /* LGECI-258 20201221 add */
                          // Suggested Searches - 1st item.focus() 삭제, close 클릭 기능과 동일하게 focus out + search-common-input으로 focus
                          if (searchCommon[idx].$btnSubmit.length > 0)
                            searchCommon[idx].$input.focus();
                          var thisLayer = searchCommon[idx].$layer;
                          setTimeout(function () {
                            thisLayer.removeClass("active");
                          }, 100);
                          /* //LGECI-258 20201221 add */
                        }
                      }
                    }
                    // ESCAPE
                    if (e.keyCode === 27) {
                      closeModal();
                    }
                  },
                },
                ".predictive-search"
              );
            }
            this.$btnClose.on("click", function (e) {
              e.preventDefault();
              // 20200525 START 박지영 : IE에서 close 클릭시 닫기가 잘 안되는 버그 수정
              // 20200406 START 박지영 || close 버튼 선택시 입력단으로 focus 수정 [redmine #5487]
              if (searchCommon[idx].$btnSubmit.length > 0)
                searchCommon[idx].$input.focus();
              // 20200406 END
              var thisLayer = searchCommon[idx].$layer;
              setTimeout(function () {
                thisLayer.removeClass("active");
              }, 100);
              // 20200525 END
            });

            // input clear
            function inputCheck() {
              if (searchCommon[idx].$input.val.length >= 1) {
                searchCommon[idx].$btnClear.show();
              } else {
                searchCommon[idx].$btnClear.hide();
              }
            }
            inputCheck();
            searchCommon[idx].$input.on("keyup input", function (e) {
              e.preventDefault();
              var txt = $(this).val();
              if (txt.length >= 1) {
                searchCommon[idx].$btnClear.show();
              } else {
                searchCommon[idx].$btnClear.hide();
              }
            });
            this.$btnClear.on("click", function (e) {
              searchCommon[idx].$input.val("");
              $(this).hide();
            });

            // Submit
            this.bindSubmit();

            // Close search layer
            $("body").on("click touchend", function (event) {
              if (!$(event.target).parents(".search-area")[0]) {
                searchCommon[idx].$layer.removeClass("active");
              }
            });
            // Close the search layer when blur event occurs at the end of the search layer
            this.$recentArea
              .find("ul.list:last-child li:last-child a")
              .on("blur", function () {
                searchCommon[idx].$layer.removeClass("active");
              });
            this.$resultArea
              .find(".search-result-seemore a")
              .on("blur", function () {
                searchCommon[idx].$layer.removeClass("active");
              });

            // init
            this.$input.data("oldtext", ""); // for ie11 bug
          },
          bindNoFocus: function () {
            if ($(".search-model-result").length > 0) {
              // manuals and documents, software and drivers page only
              this.$input.on("focus", function (e) {
                e.preventDefault();
                if (!searchCommon[idx].$layer.hasClass("active")) {
                  searchCommon[idx].$layer.addClass("active");
                }
              });
            }
          },
          bindFocus: function () {
            this.$input.on("focus", function (e) {
              e.preventDefault();
              // check the cookie
              var recentCookieTxt;
              var recentCookieArr;
              if (this.canCookie == 1) {
                recentCookieTxt = getCookie(searchCommon[idx].cookieName);
                if (recentCookieTxt == undefined) recentCookieTxt = "";
                recentCookieArr = recentCookieTxt.split("|");
                if (recentCookieTxt == "") {
                  removeCookie(searchCommon[idx].cookieName);
                }
              }
              // open the layer
              if (!searchCommon[idx].$layer.hasClass("active")) {
                searchCommon[idx].$layer.addClass("active");
              }
              searchCommon[idx].doRecent();
            });
          },
          bindInput: function () {
            this.$input.on("input", function (e) {
              // check the cookie
              var recentCookieTxt;
              var recentCookieArr;
              if (this.canCookie == 1) {
                recentCookieTxt = getCookie(searchCommon[idx].cookieName);
                recentCookieArr = recentCookieTxt.split("|");
                if (recentCookieTxt == "") {
                  removeCookie(searchCommon[idx].cookieName);
                }
              }
              // check the input's value
              if (
                searchCommon[idx].$input.val() == "" &&
                searchCommon[idx].$input.data("oldtext") !=
                  searchCommon[idx].$input.val()
              ) {
                searchCommon[idx].doRecent();
                // open the layer
                if (!searchCommon[idx].$layer.hasClass("active")) {
                  searchCommon[idx].$layer.addClass("active");
                }
              } else if (
                searchCommon[idx].minLength <=
                searchCommon[idx].$input.val().length
              ) {
                searchCommon[idx].doResult();
                // open the layer
                if (!searchCommon[idx].$layer.hasClass("active")) {
                  searchCommon[idx].$layer.addClass("active");
                }
              }
              searchCommon[idx].$input.data(
                "oldtext",
                searchCommon[idx].$input.val()
              );
            });
            // REQ-022 : 스크립트 추가 시작
            this.$input.on("focus", function (e) {
              if (searchCommon[idx].$input.closest(".GPC0009").length > 0) {
                searchCommon[idx].doResult();
                // open the layer
                if (!searchCommon[idx].$layer.hasClass("active")) {
                  searchCommon[idx].$layer.addClass("active");
                }
              }
            });
            // REQ-022 : 스크립트 추가 끝
          },
          bindSubmit: function () {
            this.$btnSubmit.on("click", function (e) {
              e.preventDefault();
              if ($(this).closest(".parts-accessories").length > 0) {
                // for parts & accessories
                adobeTrackEvent("parts-accessories-search", {
                  search_keyword: $(this)
                    .siblings(".search-common-input")
                    .val(),
                  search_type: "support:parts_accessories",
                  page_event: { onsite_search: true },
                });
              }
              searchCommon[idx].doSubmit();
            });
          },
          bindClickKeyword: function () {
            searchCommon[idx].$recentArea
              .find("ul.list li a")
              .not(".delete")
              .off("click", "**")
              .on("click", function (e) {
                e.preventDefault();
                // Adding a value to the search input and Submit Form
                var searchTxt = xssfilter(
                  $(this).find(".product-name").text(),
                  "form"
                );
                searchCommon[idx].$input.val(searchTxt);
                searchCommon[idx].doSubmit();
              });
          },
          bindDeleteKeyword: function () {
            searchCommon[idx].$recentArea
              .find("ul.list li a.delete")
              .off("click", "**")
              .on("click", function (e) {
                e.preventDefault();
                var searchTxt = xssfilter(
                    $(this).parent().find(".product-name").text(),
                    "form"
                  ),
                  recentNoResult = searchCommon[idx].$recentArea.find(
                    ".not-result.recent-keyword"
                  ),
                  recentList = searchCommon[idx].$recentArea.find(
                    "ul.list.recent-keyword"
                  );
                //console.log('test1');
                if (searchCommon[idx].canCookie == 1) {
                  //console.log('test2');
                  searchCommon[idx].deleteCookieList(searchTxt);
                }
                // Remove this in the list
                $(this).closest("li").remove();
                if (
                  searchCommon[idx].$recentArea.find(
                    "ul.list.recent-keyword li"
                  ).length <= 0
                ) {
                  recentNoResult.show();
                  recentList.empty().hide();
                }
              });
          },
          //PJTSEARCH-1 START
          doSetAutoCookie: function () {
            this.$autoArea.find("ul li a").on("click", function (e) {
              e.preventDefault();
              var keyword = "";
              if ($(this).find(".product-name").text() != "") {
                keyword = $(this).find(".product-name").text();
              } else {
                keyword = $(e.target).text();
              }
              if ($.trim(keyword) != "") {
                if (searchCommon[idx].canCookie == 1)
                  searchCommon[idx].addCookieList(keyword);
              }

              var linkUrl = $(this).attr("data-keyword-search-url");
              var page = $(this).attr("data-keyword-search");
              var target = $(this).attr("target");
              if (typeof target == "undefined" || target == "") {
                target = "_self";
              }

              aLinkPost(linkUrl, page, target);
              //window.location.href = $(this).attr('href');
            });
          },
          doSetMatchModelClick: function () {
            this.$autoArea
              .find(".success-seacrh-inner a.product-page-linker")
              .on("click", function (e) {
                // 2020.02.18 search input 수정
                e.preventDefault();
                var keyword = $(this).find(".model-display-name").text();
                if ($.trim(keyword) != "") {
                  if (searchCommon[idx].canCookie == 1)
                    searchCommon[idx].addCookieList(keyword);
                }

                var linkUrl = $(this).attr("data-keyword-search-url");
                var page = $(this).attr("data-keyword-search");
                var target = $(this).attr("target");
                if (typeof target == "undefined" || target == "") {
                  target = "_self";
                }

                aLinkPost(linkUrl, page, target);
                //window.location.href = $(this).attr('href');
              });
            // 2022.02.18 불필요한 코드 삭제 start
            // this.$autoArea.find('.success-image a').on("click", function(e){
            // 	e.preventDefault();
            // 	var keyword = $(this).parent().attr('data-adobe-modelname');
            // 	if ($.trim(keyword) != '') {
            // 		if (searchCommon[idx].canCookie == 1) searchCommon[idx].addCookieList(keyword);
            // 	}

            // 	var linkUrl = $(this).attr('data-keyword-search-url');
            // 	var page = $(this).attr('data-keyword-search');
            // 	var target = $(this).attr('target');
            // 	if(typeof target == 'undefined' || target == ''){
            // 		target = '_self';
            // 	}

            // 	aLinkPost(linkUrl, page, target);
            // 	//window.location.href = $(this).attr('href');
            // });
            // 2022.02.18 불필요한 코드 삭제 end
          },
          //PJTSEARCH-1 END
          doSubmit: function (noRefresh) {
            var searchTxt = xssfilter(this.$input.val(), "form");
            this.$input.val(searchTxt);
            //PJTSEARCH-1 START
            if (
              $(".success-seacrh-inner a div.model-display-name").length > 0
            ) {
              if (!this.$obj.is(".auto-validation-form")) {
                if ($.trim(searchTxt) != "") {
                  if (this.canCookie == 1) this.addCookieList(searchTxt);
                }
              }

              var linkUrl = $(
                ".success-seacrh-inner a.product-page-linker"
              ).attr("data-keyword-search-url");
              var page = $(".success-seacrh-inner a.product-page-linker").attr(
                "data-keyword-search"
              );
              var target = $(
                ".success-seacrh-inner a.product-page-linker"
              ).attr("target");
              if (typeof target == "undefined" || target == "") {
                target = "_self";
              }

              aLinkPost(linkUrl, page, target);
              //window.location.href = $('.success-seacrh-inner a.product-page-linker').attr('href');
              return false;
            }

            if (
              $("#searchByKeyword").attr("auto-url") != undefined &&
              $("#searchByKeyword").attr("auto-url") != ""
            ) {
              if (!this.$obj.is(".auto-validation-form")) {
                if ($.trim(searchTxt) != "") {
                  if (this.canCookie == 1) this.addCookieList(searchTxt);
                }
              }

              var linkUrl = $("#searchByKeyword").attr("auto-url");
              var page = $("#keywordSearch").val();
              var target = "_self";

              aLinkPost(linkUrl, page, target);
              //window.location.href = $('#searchByKeyword').attr('auto-url');
              return false;
            }
            //PJTSEARCH-1 END
            if (!this.$obj.is(".auto-validation-form")) {
              if ($.trim(searchTxt) != "") {
                if (this.canCookie == 1) this.addCookieList(searchTxt);
                var noSubmitArea = this.$resultArea.find(".no-submit");
                if (this.canSubmit == 1 && noRefresh != true) {
                  if (
                    $(".resource-search-form-wrap").length > 0 &&
                    $(".results-summary").length > 0
                  ) {
                    // CS Help Library, CS Video Tutorials
                    adobeTrackEvent("cs-onsite-search", {
                      search_keyword: searchCommon[idx].$obj
                        .find(".search-input input[type=text]")
                        .val(),
                      page_event: { onsite_search: true },
                    });
                  }
                  this.$obj.submit();
                } else {
                  noSubmitArea.show();
                  if ($(".search-model-result").length > 0) {
                    // manuals and documents, software and drivers page only
                    if (this.canFocus <= 0) {
                      if (!searchCommon[idx].$layer.hasClass("active")) {
                        searchCommon[idx].$layer.addClass("active");
                      }
                    }
                  }
                  return false;
                }
              } else {
                return false;
              }
            } else {
              this.$obj.submit();
            }
          },
          doResult: function () {
            this.$resultArea.show();
            this.$recentArea.hide();
            var noSubmitArea = this.$resultArea.find(".no-submit"),
              url = this.$input.data("predictive-url"),
              searchTxt = {};

            if (this.$resultArea.closest(".GPC0009").length > 0) {
              searchTxt.searchModel = xssfilter(this.$input.val(), "form");
              searchTxt.modelId = this.$obj.find("input[name=modelId]").val();
            } else {
              searchTxt.search = xssfilter(this.$input.val(), "form");
            }
            // BTOBGLOBAL-567
            if (
              this.$input.data("predictive-super-category-id") !== undefined
            ) {
              searchTxt.superCategoryId = this.$input.data(
                "predictive-super-category-id"
              );
            }
            // BTOBGLOBAL-567 End
            if (
              this.$input.data("predictive-extended-wty-use-flag") !== undefined
            ) {
              searchTxt.extendedWtyUseFlag = this.$input.data(
                "predictive-extended-wty-use-flag"
              );
            }

            noSubmitArea.hide();
            //PJTSEARCH-1 START
            var searchBizType = "B2C";
            if ($(".navigation").attr("class").indexOf("b2c") == -1) {
              searchBizType = "B2B";
            }
            // LGEBR-1013
            if (COUNTRY_CODE.toLowerCase() == "br") {
              if (
                $(".btb-selector")
                  .find("input[name=btbSelector]:checked")
                  .val() == "ForBtb"
              ) {
                searchBizType = "B2B";
              }
              searchTxt.biztype = searchBizType;
            }
            // LGEBR-1013 End
            searchTxt.type = searchBizType;

            if ($(".autoName-box").length) {
              searchTxt.searchResultFlag = "Y";
            }
            //PJTSEARCH-1 END

            // ajax call
            ajax.call(url, searchTxt, "json", function (data, _this) {
              if (data.data) {
                searchCommon[idx].ajaxSuccess(data.data[0], _this);
              } else {
                searchCommon[idx].ajaxSuccess(data, _this);
              }
            });
          },
          doRecent: function () {
            if (this.canFocus == 1) this.$recentArea.show();
            this.$resultArea.hide();
            // check the cookie
            if (
              typeof ePrivacyCookies == "undefined" ||
              ePrivacyCookies.get("LGCOM_IMPROVEMENTS")
            ) {
              var recentCookieTxt;
              var recentCookieArr;
              if (this.canCookie == 1) {
                recentCookieTxt = getCookie(this.cookieName);
                if (recentCookieTxt == undefined) recentCookieTxt = "";
                recentCookieArr = recentCookieTxt.split("|");
                if (recentCookieTxt == "") {
                  removeCookie(this.cookieName);
                }
                var recentNoResult = searchCommon[idx].$recentArea.find(
                    ".not-result.recent-keyword"
                  ),
                  recentList = searchCommon[idx].$recentArea.find(
                    "ul.list.recent-keyword"
                  );
                //console.log(recentCookieArr);
                if (recentCookieTxt == "undefined" || recentCookieTxt == "") {
                  recentNoResult.show();
                  recentList.empty().hide();
                } else {
                  if (recentCookieTxt == "") {
                    recentNoResult.show();
                    recentList.empty().hide();
                  } else {
                    var list = "";
                    for (var i = 0; i < recentCookieArr.length; i++) {
                      list =
                        list +
                        '<li><a href="#"><strong class="product-name">' +
                        recentCookieArr[i] +
                        '</strong></a><a href="#" class="delete"><span class="icon"></span><span class="sr-only">Delete</span></a></li>';
                    }
                    recentNoResult.hide();
                    recentList.html(list).show();
                    this.bindDeleteKeyword();
                  }
                }
                this.bindClickKeyword();
                // show recent head
                this.$recentArea.find(".search-head").eq(0).show();
              } else {
                searchCommon[idx].$recentArea
                  .find(".not-result.recent-keyword")
                  .hide();
                searchCommon[idx].$recentArea
                  .find("ul.list.recent-keyword")
                  .empty()
                  .hide();
                // hide recent head
                this.$recentArea.find(".search-head").eq(0).hide();
              }
            } else {
              var $obj = this.$recentArea.find("ul.list.recent-keyword");
              $obj.siblings(".not-result.recent-keyword").hide();
              ePrivacyCookies.view("load", "small", $obj);
            }
          },
          addCookieList: function (searchTxt) {
            // add searchTxt in cookie list
            var recentCookieTxt = getCookie(this.cookieName);
            if (recentCookieTxt == undefined) recentCookieTxt = "";
            var recentCookieArr = recentCookieTxt.split("|");

            // Clear duplicate values on array
            var isDup = recentCookieArr.indexOf(searchTxt);
            if (isDup > -1) recentCookieArr.splice(isDup, 1);

            // If you have five search terms, delete the oldest one.
            if (recentCookieArr.length >= 5) {
              recentCookieArr.pop();
            }

            // Add new value to the front of the array
            if (recentCookieTxt == "undefined" || recentCookieTxt == "")
              recentCookieArr = [searchTxt];
            else recentCookieArr.unshift(searchTxt);

            // set Cookie
            if (
              typeof ePrivacyCookies == "undefined" ||
              ePrivacyCookies.get("LGCOM_IMPROVEMENTS")
            ) {
              setCookie(this.cookieName, recentCookieArr.join("|"));
            }
          },
          deleteCookieList: function (searchTxt) {
            // delete searchTxt in cookie list
            var recentCookieTxt = getCookie(this.cookieName);
            if (recentCookieTxt == undefined) recentCookieTxt = "";
            var recentCookieArr = recentCookieTxt.split("|");
            // delete searchTxt from array
            var isTxt = recentCookieArr.indexOf(searchTxt);
            if (isTxt > -1) recentCookieArr.splice(isTxt, 1);

            // set Cookie
            if (
              typeof ePrivacyCookies == "undefined" ||
              ePrivacyCookies.get("LGCOM_IMPROVEMENTS")
            ) {
              if (recentCookieArr.length > 0) {
                setCookie(this.cookieName, recentCookieArr.join("|"));
              } else {
                removeCookie(this.cookieName);
              }
            } else {
              removeCookie(this.cookieName);
            }
          },
          ajaxSuccess: function (data, _this) {
            var seemore = searchCommon[idx].$resultArea.find(
              ".search-result-seemore"
            );
            if (!data.link || data.link == "") {
              seemore.hide();
            } else {
              seemore.show().find("a").attr("href", data.link);
            }

            /* PJTERAP-1 Start, ocr 제품등록 페이지 판단(thumbnail 추가) */
            var pageFlag =
              $("#mylgProductPageType").val() != null &&
              $("#mylgProductPageType").val() != undefined &&
              $("#mylgProductPageType").val() == "ocr";
            var recentNoResult =
              searchCommon[idx].$resultArea.find(".not-result");
            if (pageFlag) {
              resultList = searchCommon[idx].$resultArea.find("ul.list-item");
            } else {
              resultList = searchCommon[idx].$resultArea.find("ul.list");
            }
            /* PJTERAP-1 End */
            //LGEJP-396
            var obuCodeList = $('input[name="obuCodeList"]').val();
            if (
              obuCodeList != "undefined" &&
              obuCodeList != null &&
              obuCodeList != ""
            ) {
              obuCodeList = obuCodeList.split(",");
            }

            if (data.Flag == "N") {
              recentNoResult.show();
              resultList.hide();
              //PJTSEARCH-1 START
              var autoLen = data.autoData ? data.autoData.length : "";
              var autoList =
                searchCommon[idx].$resultArea.find(".autoName-list");
              var autoNotReult = searchCommon[idx].$resultArea.find(
                ".not-result.recent-keyword"
              );
              if (autoLen != "" && autoLen > 0) {
                autoList.show();
                autoNotReult.hide();
              } else {
                autoList.hide();
                autoNotReult.show();
              }
              //PJTSEARCH-1 END
            } else {
              recentNoResult.hide();
              resultList.show();
              var len = data.predictive ? data.predictive.length : "";
              //PJTSEARCH-1 Add
              var autoLen = data.autoData ? data.autoData.length : "";
              html = "";
              html2 = "";
              html3 = "";
              if (len > 0 || autoLen > 0) {
                if (len > this.max) len = this.max;

                if (this.$template[0] != undefined) {
                  var template = this.$template;
                  //PJTSEARCH-1 START
                  for (var i = 0; i < this.$template.length; i++) {
                    template = this.$template.get(i);
                    this.$template.find("script").remove();

                    if (template.id == "automaticTemplate" && autoLen != "") {
                      var searchTxt = xssfilter(this.$input.val(), "form");
                      for (var j = 0; j < autoLen; j++) {
                        var _templateMarkup = $(template).clone().html();
                        var target = "";
                        if (data.autoData[j].linkTarget == 0) {
                          target = "_self";
                        } else {
                          target = "_blank";
                        }

                        var sitemapName = data.autoData[j].sitemapName;

                        if (j == 0) {
                          if (
                            sitemapName.toLowerCase() == searchTxt.toLowerCase()
                          ) {
                            $("#searchByKeyword").attr(
                              "auto-url",
                              data.autoData[j].linkPath
                            );
                          } else {
                            $("#searchByKeyword").removeAttr("auto-url");
                          }
                        }

                        sitemapName = data.autoData[j].sitemapName;
                        var matchText = sitemapName.match(
                          new RegExp(searchTxt, "i")
                        );
                        sitemapName = sitemapName.replace(
                          matchText,
                          "<span>" + matchText + "</span>"
                        );

                        _templateMarkup = _templateMarkup
                          .replace("*linkPath*", data.autoData[j].linkPath)
                          .replace("*target*", target)
                          .replace("*sitemapName*", sitemapName);

                        html2 = html2 + _templateMarkup;
                      }
                    } else if (
                      template.id == "searchMatchedProductTemplate" &&
                      data.matchedModelFlag == "Y"
                    ) {
                      var _templateMarkup = $(template).clone().html();

                      // var wtbExterNalCheck = function(data){
                      // 	if(data.wtbExternalLinkUseFlag=="Y" && data.wtbExternalLinkUrl != null && data.wtbExternalLinkUrl != '' && data.wtbExternalLinkName != null && data.wtbExternalLinkName != ''){
                      // 		return "in-buynow";
                      // 	}else{
                      // 		return "where-to-buy";
                      // 	}
                      // };

                      //버튼 area check - 버튼 사용하지 않음
                      // var atcBtnType = data.matchedModelInfo[0].addToCartBtnType;
                      // var wtbBtnType = data.matchedModelInfo[0].wtbBtnType;
                      // var addToCartUrl = "";
                      // var wtbUrl = "";
                      // var atcActive = "";
                      // var wtbActive = "";
                      // var iqActive = "";
                      // var ftdActive = "";

                      // if(data.matchedModelInfo[0].addToCartBtnFlag == 'Y'){
                      // 	atcActive = "active";

                      // 	if(atcBtnType == 'preOrder'){
                      // 		addToCartUrl = data.matchedModelInfo[0].addToCartUrl;
                      // 	}else if(atcBtnType == 'addToCart'){
                      // 		addToCartUrl = data.matchedModelInfo[0].addToCartUrl;
                      // 	}else if(atcBtnType == 'buyNow'){
                      // 		addToCartUrl = data.matchedModelInfo[0].buyNowUrl;
                      // 	}else if(atcBtnType == 'reseller'){
                      // 		addToCartUrl = data.matchedModelInfo[0].resellerLinkUrl;
                      // 	}else if(atcBtnType == 'productSupport'){
                      // 		addToCartUrl = data.matchedModelInfo[0].productSupportUrl;
                      // 	}
                      // }

                      // if(data.matchedModelInfo[0].wtbBtnFlag == 'Y'){
                      // 	wtbActive = "active";

                      // 	if(wtbBtnType == 'wtb'){
                      // 		wtbUrl = data.matchedModelInfo[0].whereToBuyUrl;
                      // 	}else if(wtbBtnType == 'external'){
                      // 		wtbUrl = data.matchedModelInfo[0].wtbExternalLinkUrl;
                      // 	}
                      // }

                      // if(data.matchedModelInfo[0].inquiryBtnFlag == 'Y'){
                      // 	iqActive = "active";
                      // }

                      // if(data.matchedModelInfo[0].findTheDealerBtnFlag == 'Y'){
                      // 	ftdActive = "active";
                      // }

                      var manualTag = "";
                      var softwareTag = "";
                      var requestRepairTag = "";
                      var registerProductTag = "";
                      //PJTSEARCH-1_slick start
                      if (
                        data.matchedModelInfo[0].manualUrl != undefined &&
                        data.matchedModelInfo[0].manualUrl != null &&
                        data.matchedModelInfo[0].manualUrl != ""
                      ) {
                        manualTag =
                          "<li><a href='" +
                          data.matchedModelInfo[0].manualUrl +
                          "'><img src='/lg5-common-gp/images/common/icons/manuals.svg' alt='Manuals' aria-hidden='true'/><p>" +
                          data.matchedModelInfo[0].manualText +
                          "</p></a></li>";
                      }

                      if (
                        data.matchedModelInfo[0].softwareUrl != undefined &&
                        data.matchedModelInfo[0].softwareUrl != null &&
                        data.matchedModelInfo[0].softwareUrl != ""
                      ) {
                        softwareTag =
                          "<li><a href='" +
                          data.matchedModelInfo[0].softwareUrl +
                          "'><img src='/lg5-common-gp/images/common/icons/software.svg' alt='Software Drivers' aria-hidden='true'/><p>" +
                          data.matchedModelInfo[0].softwareText +
                          "</p></a></li>";
                      }

                      if (
                        data.matchedModelInfo[0].requestaRepairUrl !=
                          undefined &&
                        data.matchedModelInfo[0].requestaRepairUrl != null &&
                        data.matchedModelInfo[0].requestaRepairUrl != ""
                      ) {
                        requestRepairTag =
                          "<li><a href='" +
                          data.matchedModelInfo[0].requestaRepairUrl +
                          "'><img src='/lg5-common-gp/images/common/icons/requestrepair.svg' alt='Request Repair' aria-hidden='true'/><p>" +
                          data.matchedModelInfo[0].requestaRepairText +
                          "</p></a></li>";
                      }

                      var registeraProductUrl = "";
                      if (
                        _dl.isLogin == "Y" &&
                        data.matchedModelInfo[0].registeraProductUrl != ""
                      ) {
                        registeraProductUrl =
                          data.matchedModelInfo[0].registeraProductUrl;
                      } else if (
                        _dl.isLogin != "Y" &&
                        data.matchedModelInfo[0].registeraProductUrl != ""
                      ) {
                        registeraProductUrl =
                          "/" +
                          _dl.country_code +
                          "/mylg/login?state=" +
                          data.matchedModelInfo[0].registeraProductUrl;
                      }

                      if (registeraProductUrl != "") {
                        registerProductTag =
                          "<li><a href='" +
                          registeraProductUrl +
                          "'><img src='/lg5-common-gp/images/common/icons/regist-product.svg' alt='Register a Product' aria-hidden='true'/><p>" +
                          data.matchedModelInfo[0].registeraProductText +
                          "</p></a></li>";
                      }
                      //PJTSEARCH-1_slick end
                      _templateMarkup = _templateMarkup
                        .replace(
                          /\*imageAltText\*/g,
                          data.matchedModelInfo[0].imageAltText != null
                            ? data.matchedModelInfo[0].imageAltText
                            : ""
                        )
                        .replace(
                          /\*mediumImageAddr\*/g,
                          data.matchedModelInfo[0].mediumImageAddr
                        )
                        .replace(
                          /\*modelId\*/g,
                          data.matchedModelInfo[0].modelId
                        )
                        .replace(
                          /\*modelUrlPath\*/g,
                          data.matchedModelInfo[0].modelUrlPath
                        )
                        .replace(
                          /\*modelName\*/g,
                          data.matchedModelInfo[0].modelName
                        )
                        .replace(
                          /\*userFriendlyName\*/g,
                          data.matchedModelInfo[0].userFriendlyName == null
                            ? ""
                            : data.matchedModelInfo[0].userFriendlyName.replace(
                                /\"/g,
                                "''"
                              )
                        )
                        // .replace(/\*whereToBuyFlag\*/g, data.matchedModelInfo[0].wtbBtnFlag)
                        // .replace(/\*whereToBuyUrl\*/g, wtbUrl)
                        // .replace(/\*wtbBtnMsg\*/g, data.matchedModelInfo[0].wtbBtnMsg)
                        // .replace(/\*findTheDealerFlag\*/g, data.matchedModelInfo[0].findTheDealerBtnFlag)
                        // .replace(/\*findTheDealerUrl\*/g, data.matchedModelInfo[0].findTheDealerUrl)
                        // .replace(/\*findTheDealerBtnMsg\*/g, data.matchedModelInfo[0].findTheDealerBtnMsg)
                        // .replace(/\*addToCartFlag\*/g, data.matchedModelInfo[0].addToCartBtnFlag)
                        // .replace(/\*addToCartUrl\*/g, addToCartUrl)
                        // .replace(/\*addToCartBtnMsg\*/g, data.matchedModelInfo[0].addToCartBtnMsg)
                        // .replace(/\*inquiryToBuyUrl\*/g, data.matchedModelInfo[0].inquiryToBuyUrl)
                        // .replace(/\*inquiryToBuyFlag\*/g, data.matchedModelInfo[0].inquiryBtnFlag)
                        .replace(
                          /\*salesModelCode\*/g,
                          data.matchedModelInfo[0].salesModelCode
                        )
                        .replace(
                          /\*salesSuffixCode\*/g,
                          data.matchedModelInfo[0].salesSuffixCode
                        )
                        .replace(
                          /\*buName1\*/g,
                          data.matchedModelInfo[0].buName1
                        )
                        .replace(
                          /\*buName2\*/g,
                          data.matchedModelInfo[0].buName2
                        )
                        .replace(
                          /\*buName3\*/g,
                          nvl(data.matchedModelInfo[0].buName3, "")
                        )
                        .replace(
                          /\*superCategoryName\*/g,
                          data.matchedModelInfo[0].superCategoryName
                        )
                        .replace(
                          /\*bizType\*/g,
                          data.matchedModelInfo[0].bizType
                        )
                        // 버튼 사용하지 않음
                        //.replace(/\*wtbClass\*/g, wtbExterNalCheck(data.matchedModelInfo[0]))
                        // .replace(/\*atcActive\*/g, atcActive)
                        // .replace(/\*wtbActive\*/g, wtbActive)
                        // .replace(/\*iqActive\*/g, iqActive)
                        // .replace(/\*ftdActive\*/g, ftdActive)
                        .replace(/\*manualTag\*/g, manualTag)
                        .replace(/\*softwareTag\*/g, softwareTag)
                        .replace(/\*requestRepairTag\*/g, requestRepairTag)
                        .replace(/\*registerProductTag\*/g, registerProductTag)
                        .replace(/\*pspUrl\*/g, data.matchedModelInfo[0].pspUrl)
                        .replace(
                          /\*atcClass\*/g,
                          data.matchedModelInfo[0].obsBuynowFlag == "Y"
                            ? "in-buynow"
                            : "pre-order"
                        );

                      html3 = html3 + _templateMarkup;
                    } else if (template.id == "relatedTemplate") {
                      for (var j = 0; j < len; j++) {
                        var _templateMarkup = $(template).clone().html();

                        _templateMarkup = _templateMarkup
                          .replace("*url*", data.predictive[j].url)
                          .replace("*model*", data.predictive[j].model)
                          .replace("*name*", data.predictive[j].name)
                          .replace("*category*", data.predictive[j].category);

                        html = html + _templateMarkup;
                      }
                    }
                  }

                  var autoListArea =
                    searchCommon[idx].$resultArea.find("ul.autoName-list");
                  if (autoListArea != undefined) {
                    autoListArea.html(html2);
                  }
                  var matchedProductResultArea = searchCommon[
                    idx
                  ].$resultArea.find("div.success-seacrh-inner");
                  if (matchedProductResultArea != undefined) {
                    matchedProductResultArea.html(html3);
                    searchCommon[idx].doSetMatchModelClick();
                    var btnList = matchedProductResultArea.find(".btn-area a");
                    for (var i = 0; i < btnList.length; i++) {
                      if (
                        data.matchedModelInfo[0].wtbExternalLinkUseFlag ==
                          "Y" &&
                        $(btnList[i]).hasClass("in-buynow") &&
                        data.matchedModelInfo[0].wtbExternalLinkUrl != ""
                      ) {
                        $(btnList[i]).attr("data-link-name", "buy_now");
                        $(btnList[i]).removeAttr("data-sc-item");
                        if (
                          data.matchedModelInfo[0].wtbExternalLinkSelfFlag !=
                          "Y"
                        ) {
                          $(btnList[i]).attr("target", "_blank");
                          $(btnList[i]).attr(
                            "title",
                            data.matchedModelInfo[0].btnNewLinkTitle
                          );
                        }
                      }
                      if (data.matchedModelInfo[0].btnColorChange == "Y") {
                        if ($(btnList[i]).hasClass("btn-primary")) {
                          $(btnList[i]).removeClass("btn-primary");
                          $(btnList[i]).addClass("btn-outline-secondary");
                        } else {
                          $(btnList[i]).removeClass("btn-outline-secondary");
                          $(btnList[i]).addClass("btn-primary");
                        }
                      }
                    }
                    //PJTSEARCH-1_slick start
                    // setTimeout(function() {
                    // 	var $obj = $('.success-etc ul');
                    // 	var $slick = null;
                    // 	var slideInit = function() {
                    // 		$slick = $obj.slick({
                    // 			infinite: false,
                    // 			slidesToShow: 3,
                    // 			slidesToScroll: 3,
                    // 			variableWidth: true,
                    // 			arrows : true,
                    // 			dots: false,
                    // 			responsive: [
                    // 				{
                    // 					breakpoint: 1024,
                    // 					settings: {
                    // 						slidesToShow: 1,
                    // 						slidesToScroll: 1
                    // 					}
                    // 				}
                    // 			]
                    // 		});
                    // 	}
                    // 	$obj.filter('.slick-initialized').slick('unslick');
                    // 	slideInit()
                    // }, 100);
                  }
                  //PJTSEARCH-1_slick end
                  var autoList =
                    searchCommon[idx].$resultArea.find(".autoName-list");
                  var autoHead = searchCommon[idx].$resultArea.find(
                    ".autoName-box .search-head"
                  );
                  var autoNotReult = searchCommon[idx].$resultArea.find(
                    ".not-result.recent-keyword"
                  );
                  var matchedSuccess = searchCommon[idx].$resultArea.find(
                    ".autoName-box .success-seacrh"
                  );
                  if (data.matchedModelFlag == "Y") {
                    autoHead.hide();
                    autoList.hide();
                    autoNotReult.hide();
                    matchedSuccess.show();
                    $("#searchByKeyword").removeAttr("auto-url");
                  } else if (data.matchedModelFlag != "Y") {
                    autoHead.show();
                    if (autoLen == "") {
                      autoList.hide();
                      autoNotReult.show();
                      $("#searchByKeyword").removeAttr("auto-url");
                    } else {
                      autoList.show();
                      autoNotReult.hide();
                      if (len == "") {
                        recentNoResult.show();
                        autoNotReult.hide();
                      }
                    }
                    matchedSuccess.hide();
                  }
                  //PJTSEARCH-1
                } else {
                  for (var i = 0; i < len; i++) {
                    var tempCateHTML = "";
                    /*LGEMS-213 add*/
                    if (data.predictive[i].supercate)
                      tempCateHTML =
                        tempCateHTML +
                        " data-supercategory=" +
                        data.predictive[i].supercate;
                    else if (data.predictive[i].cs_super_category_id)
                      tempCateHTML =
                        tempCateHTML +
                        " data-supercategory=" +
                        data.predictive[i].cs_super_category_id;
                    if (data.predictive[i].cate)
                      tempCateHTML =
                        tempCateHTML +
                        " data-category=" +
                        data.predictive[i].cate;
                    else if (data.predictive[i].cs_category_id)
                      tempCateHTML =
                        tempCateHTML +
                        " data-category=" +
                        data.predictive[i].cs_category_id;
                    if (data.predictive[i].subcate)
                      tempCateHTML =
                        tempCateHTML +
                        " data-subcategory=" +
                        data.predictive[i].subcate;
                    else if (data.predictive[i].cs_sub_category_id)
                      tempCateHTML =
                        tempCateHTML +
                        " data-subcategory=" +
                        data.predictive[i].cs_sub_category_id;
                    //LGEJP-396
                    if (
                      obuCodeList != "undefined" &&
                      obuCodeList != null &&
                      obuCodeList != ""
                    ) {
                      var obuFlag = false;
                      for (var j = 0; j < obuCodeList.length; j++) {
                        if (obuCodeList[j] == data.predictive[i].obu_code) {
                          obuFlag = true;
                        }
                      }
                    }

                    var obuName = obuFlag
                      ? data.predictive[i].model
                      : data.predictive[i].model_code;
                    if (obuName == undefined || obuName == "") {
                      obuName = data.predictive[i].model;
                    }
                    if (data.predictive[i].model && !data.helpModelFlag) {
                      // model search
                      //LGEJP-52 ADD
                      if (COUNTRY_CODE.toLowerCase() == "jp") {
                        // <span class="product-name"></span> 제거
                        if (pageFlag) {
                          //PJTERAP-1
                          html =
                            html +
                            '<li><a rel="nofollow" href="' +
                            data.predictive[i].url +
                            '"' +
                            tempCateHTML +
                            '><div class="model-name" style="display:none">' +
                            data.predictive[i].model +
                            '</div><div class="list-box"><div class="pd-img"><img data-src="' +
                            data.predictive[i].cs_model_image_path +
                            '" src="' +
                            data.predictive[i].cs_model_image_path +
                            '" class="mCS_img_loaded lazyloaded" alt="" data-loaded="true"></div><div class="pd-list-info"><p class="pd-list-num">' +
                            obuName +
                            '</p><p class="pd-list-name">' +
                            data.predictive[i].name +
                            "</p></div></div></a></li>";
                        } else {
                          html =
                            html +
                            '<li><a rel="nofollow" href="' +
                            data.predictive[i].url +
                            '"' +
                            tempCateHTML +
                            '><span class="model-name">' +
                            obuName +
                            '</span><span class="category-name">' +
                            data.predictive[i].category +
                            "</span></a></li>";
                        }
                      } else {
                        if (pageFlag) {
                          //PJTERAP-1
                          html =
                            html +
                            '<li><a rel="nofollow" href="' +
                            data.predictive[i].url +
                            '"' +
                            tempCateHTML +
                            '><div class="model-name" style="display:none">' +
                            data.predictive[i].model +
                            '</div><div class="list-box"><div class="pd-img"><img data-src="' +
                            data.predictive[i].cs_model_image_path +
                            '" src="' +
                            data.predictive[i].cs_model_image_path +
                            '" class="mCS_img_loaded lazyloaded" alt="" data-loaded="true"></div><div class="pd-list-info"><p class="pd-list-num">' +
                            obuName +
                            '</p><p class="pd-list-name">' +
                            data.predictive[i].name +
                            "</p></div></div></a></li>";
                        } else {
                          html =
                            html +
                            '<li><a rel="nofollow" href="' +
                            data.predictive[i].url +
                            '"' +
                            tempCateHTML +
                            '><span class="model-name">' +
                            obuName +
                            '</span><span class="product-name">' +
                            data.predictive[i].name +
                            '</span><span class="category-name">' +
                            data.predictive[i].category +
                            "</span></a></li>";
                        }
                      }
                    } else if (data.helpModelFlag) {
                      // <span class="model-name"></span> 제거
                      html =
                        html +
                        '<li><a rel="nofollow" href="' +
                        data.predictive[i].url +
                        '"' +
                        tempCateHTML +
                        '><span class="product-name">' +
                        data.predictive[i].name +
                        '</span><span class="category-name">' +
                        data.predictive[i].category +
                        "</span></a></li>"; //LGEBR-126
                    } else if (data.helpModelFlag) {
                      // <span class="model-name"></span> 제거
                      html =
                        html +
                        '<li><a rel="nofollow" href="' +
                        data.predictive[i].url +
                        '"' +
                        tempCateHTML +
                        '><span class="product-name">' +
                        data.predictive[i].name +
                        '</span><span class="category-name">' +
                        data.predictive[i].category +
                        "</span></a></li>"; //LGEBR-126
                    } else {
                      html =
                        html +
                        '<li><a rel="nofollow" href="' +
                        data.predictive[i].url +
                        '"' +
                        tempCateHTML +
                        '><span class="model-name">' +
                        data.predictive[i].content +
                        '</span><span class="product-name">' +
                        data.predictive[i].name +
                        '</span><span class="category-name">' +
                        data.predictive[i].category +
                        "</span></a></li>";
                    }
                  }
                }
                resultList.html(html);
                //PJTSEARCH-1 add
                searchCommon[idx].doSetAutoCookie();
                if (this.functionName && this.functionName != "") {
                  resultList.find("li a").on("click", function (e) {
                    e.preventDefault();
                    var model = $(this).find(".model-name").text();
                    var category = $(this).data("category");
                    var subcategory = $(this).data("subcategory");
                    var functionNameText = searchCommon[idx].functionName;
                    if (functionNameText) {
                      if (functionNameText == "pickerBox.model") {
                        // CS Software & Drivers, CS Manuals & Documents
                        new Function(
                          functionNameText +
                            '("' +
                            model +
                            '", "' +
                            category +
                            '", "' +
                            subcategory +
                            '")'
                        )(); // jshint ignore:line
                        $(this)
                          .closest("form.search-common")
                          .find(".search-input input[type=text]")
                          .val($(this).find(".model-name").text());
                        // CS Software & Drivers, CS Manuals & Documents : Search
                        adobeTrackEvent("cs-onsite-search", {
                          search_keyword: searchCommon[idx].$obj
                            .find(".search-input input[type=text]")
                            .val(),
                          page_event: { onsite_search: true },
                        });
                      } else {
                        new Function(functionNameText + "()")(); // jshint ignore:line
                      }
                    }
                    searchCommon[idx].$layer.removeClass("active");
                  });
                }
                var $resultValue =
                  searchCommon[idx].$layer.find(".results .value");
                if ($resultValue.length > 0) {
                  $resultValue.text(data.predictive.length);
                }
              } else {
                recentNoResult.show();
                resultList.hide();
                var $resultValue1 =
                  searchCommon[idx].$layer.find(".results .value");
                if ($resultValue1.length > 0) {
                  $resultValue1.text("0");
                }
                var autoList =
                  searchCommon[idx].$resultArea.find(".autoName-list");
                if (autoList.length > 0) {
                  autoList.hide();
                }
              }
            }
          },
        };
        searchCommon[idx].init();
      }
    });
  };
(function ($) {
  if (!document.querySelector(".search-common")) return false;
  searchInit();
})(jQuery);

/*
 **jquery datepicker
 */
// 20200408 START 오샘 || localeOption 추가
var defaultOptions = {
  isRTL: $("[dir=rtl]").length > 0 ? true : false,
  // 20200409 START 박지영 : date picker 옵션 추가
  prevText: previousTxt,
  nextText: nextTxt,
  dayNamesMin: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], // default = 영문
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  // 20200409 END
  showOtherMonths: true,
  // 20200408 START 박지영 : date picker 옵션 수정
  changeYear: true,
  // 20200408 END
  // 20200603 START 박지영 : 현재 년도 +10~-100까지 출력하도록 수정
  yearRange: "c-100:c+10",
  // 20200603 END
  beforeShow: function () {
    if (!("ontouchstart" in window)) {
      $(window).on({
        resize: function () {
          $(".run-datepicker").datepicker("hide").blur();
          $(window).off("resize");
        },
      });
    }
  },
};

// LGEIS-1168
var dateToday = new Date();
var yearRange_it =
  dateToday.getFullYear() - 100 + ":" + (dateToday.getFullYear() + 2);

var localeOptions = {
  ru: {
    monthNames: [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ],
    monthNamesShort: [
      "Янв",
      "Фев",
      "Мар",
      "Апр",
      "Май",
      "Июн",
      "Июл",
      "Авг",
      "Сен",
      "Окт",
      "Ноя",
      "Дек",
    ],
    dayNames: [
      "воскресенье",
      "понедельник",
      "вторник",
      "среда",
      "четверг",
      "пятница",
      "суббота",
    ],
    dayNamesShort: ["вск", "пнд", "втр", "срд", "чтв", "птн", "сбт"],
    dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    firstDay: 1,
  },
  cz: {
    monthNames: [
      "leden",
      "únor",
      "březen",
      "duben",
      "květen",
      "červen",
      "červenec",
      "srpen",
      "září",
      "říjen",
      "listopad",
      "prosinec",
    ],
  },
  sk: {
    monthNames: [
      "január",
      "február",
      "marec",
      "apríl",
      "máj",
      "jún",
      "júl",
      "august",
      "september",
      "october",
      "november",
      "december",
    ],
  },
  br: {
    //	LGEBR-1377 Start
    monthNames: [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ],
    monthNamesShort: [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ],
    dayNames: [
      "Domingo",
      "Segunda-Feira",
      "Terça-Feira",
      "Quarta-feira",
      "Quinta-Feira",
      "Sexta-Feira",
      "Sábado",
    ],
    dayNamesMin: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
  }, //	LGEBR-1377 End
  kz: {
    //LGEKZ-130 START
    monthNames: [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ],
  }, //LGEKZ-130 END
  it: {
    // LGEIS-1168
    changeMonth: true,
    changeYear: true,
    firstDay: 1,
    monthNames: [
      "Gennaio",
      "Febbraio",
      "Marzo",
      "Aprile",
      "Maggio",
      "Giugno",
      "Luglio",
      "Agosto",
      "Settembre",
      "Ottobre",
      "Novembre",
      "Dicembre",
    ],
    monthNamesShort: [
      "Gen",
      "Feb",
      "Mar",
      "Apr",
      "Mag",
      "Giu",
      "Lug",
      "Ago",
      "Set",
      "Ott",
      "Nov",
      "Dic",
    ],
    dayNamesMin: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
    yearRange: yearRange_it,
  },
};

var runDatepicker;
(function ($) {
  runDatepicker = function () {
    var dps = document.querySelectorAll(".datepicker-wrap");

    $(dps).each(function () {
      if (!$(this).find(".run-datepicker").length) {
        return true;
      } else if ($(this).find(".run-datepicker").hasClass("hasDatepicker")) {
        return true;
      } else if ($(this).closest("template").length) {
        return true;
      }

      var el = this; // this
      var $calander = $(el).find(".run-datepicker"); // this
      var dayNames = $calander.get(0).getAttribute("data-day-names");
      // 20200429 START 박지영 : JS lint 수정
      if (dayNames) {
        var split1 = dayNames.match(/,|\/|-|\|/);
        dayNames = dayNames.match(/,|\/|-|\|/) ? dayNames.split(split1) : null;
        defaultOptions.dayNamesMin = dayNames;
      }
      // 20200409 START 박지영 : date picker 옵션 추가
      var monthNames = $calander.get(0).getAttribute("data-month-names");
      if (monthNames) {
        var split2 = monthNames.match(/,|\/|-|\|/);
        monthNames = monthNames.match(/,|\/|-|\|/)
          ? monthNames.split(split2)
          : null;
        defaultOptions.monthNames = monthNames;
      }
      // 20200429 END
      var yearSuffix = $calander.get(0).getAttribute("data-year-suffix");
      if (yearSuffix) {
        defaultOptions.yearSuffix = yearSuffix;
      }
      // 20200409 END
      defaultOptions.dateFormat = $calander
        .get(0)
        .getAttribute("data-date-format");

      $calander.datepicker(
        $.extend(defaultOptions, localeOptions[COUNTRY_CODE] || {})
      );
      // .datepicker("setDate", new Date())
      $(el)
        .find(".datepicker-trigger")
        .on({
          click: function (e) {
            e.preventDefault();
            $calander.datepicker("show");
            $(this).attr("autocomplete", "off");
          },
        });
    });
  };
  runDatepicker();
})(jQuery);
// 20200408 END 오샘 || localeOption 추가

// tab Scripts
(function ($) {
  if (
    !document.querySelector(".tabs-type-liner") &&
    !document.querySelector(".tabs-type-rect") &&
    !document.querySelector(".tabs-type-line-box") &&
    !document.querySelector(".tabs-type-vertical")
  )
    return false;

  var $tabs = $(
    ".tabs-type-liner, .tabs-type-rect, .tabs-type-line-box, .tabs-type-vertical"
  );
  var tabLengthCount = 0;
  var $tabVertical = $(".tab-vertical");
  $tabVertical.length &&
    $(function () {
      $tabVertical.mCustomScrollbar();
    });
  /*
	var fixScrollPos = function($obj) {
		// scroll
		if($obj.closest('.has-scroll').length>0) {
			var cont = $obj.closest('.has-scroll');
			var contBox = cont.find('.mCustomScrollBox');
			var thisLeft = $obj.offset().left;
			var thisRight = $obj.offset().left + $obj.outerWidth();
			var isRTL = ($('[dir=rtl]').length>0) ? true : false;

			if(isRTL) {
				if(thisRight > (contBox.offset().left + contBox.outerWidth())) { // right side
					cont.find('.js-tab-guide-outer').mCustomScrollbar("scrollTo", $obj.offset().left - cont.find('.mCSB_container').offset().left);
				} else if(thisLeft < contBox.offset().left) { // left side
					var d = ($(window).width() < 768) ? 0:30;
					var st = Math.ceil(Math.abs(parseInt(cont.find('.mCSB_container').css('left'))) + $obj.outerWidth() - ($(window).width() - $obj.offset().left - cont.find(".tab-scroll-controller").children().first().innerWidth()));
					cont.find('.js-tab-guide-outer').mCustomScrollbar("scrollTo", st+d);
				}
			} else {
				if(thisLeft < contBox.offset().left) { // left side
					cont.find('.js-tab-guide-outer').mCustomScrollbar("scrollTo", $obj.offset().left - cont.find('.mCSB_container').offset().left);
				} else if(thisRight > (contBox.offset().left + contBox.outerWidth())) { // right side
					var d = ($(window).width() < 768) ? 0:30;
					var st = Math.ceil(Math.abs(parseInt(cont.find('.mCSB_container').css('left'))) + $obj.outerWidth() - ($(window).width() - $obj.offset().left - cont.find(".tab-scroll-controller").children().first().innerWidth()));
					cont.find('.js-tab-guide-outer').mCustomScrollbar("scrollTo", st+d);
				}
			}
		}
	}
	*/
  $tabs.each(function () {
    // 20200406 START 이상현 - tab ui 인터랙션 수정
    if ($(this).hasClass("js-tab")) {
      // pre setting
      $(this).find('[role="tab"]').not(".active").attr("tabindex", -1);
      $(this)
        .closest(".tab-wrap")
        .find(".tab-scroll-controller")
        .children()
        .attr("tabindex", -1);

      // key interaction
      $(this)
        .find('[role="tab"]')
        .on("keydown.test", function (e) {
          var isRTL = $("[dir=rtl]").length > 0 ? true : false;
          var _this = $(this);
          if (e.keyCode === 39 || e.keyCode === 40) {
            // right
            if ($(this).parent().next().find('[role="tab"]').length > 0) {
              //$(this).parent().next().siblings().find('[role="tab"]').attr({'tabindex' : -1});
              $(this)
                .parent()
                .next()
                .find('[role="tab"]')
                .attr({ tabindex: 0 })
                .focus();
              _this.attr({ tabindex: -1 });
            }
          } else if (e.keyCode === 37 || e.keyCode === 38) {
            // left
            if ($(this).parent().prev().find('[role="tab"]').length > 0) {
              //$(this).parent().next().siblings().find('[role="tab"]').attr({'tabindex' : -1});
              $(this)
                .parent()
                .prev()
                .find('[role="tab"]')
                .attr({ tabindex: 0 })
                .focus();
              _this.attr({ tabindex: -1 });
            }
          } else if (e.keyCode === 36) {
            // home
            e.preventDefault();
            $(this)
              .closest('[role="tablist"]')
              .find('[role="tab"]')
              .eq(0)
              .attr({ tabindex: 0 })
              .focus(); //.trigger('click');
            _this.attr({ tabindex: -1 });
            return false;
          } else if (e.keyCode === 35) {
            // end
            e.preventDefault();
            $(this)
              .closest('[role="tablist"]')
              .find('[role="tab"]')
              .eq(
                $(this).closest('[role="tablist"]').find('[role="tab"]')
                  .length - 1
              )
              .attr({ tabindex: 0 })
              .focus(); //.trigger('click');
            _this.attr({ tabindex: -1 });
            return false;
          } else if (e.keyCode === 32) {
            // space
            e.preventDefault();
            $(this).trigger("click");
          }
        });
    }
    // 20200406 END
    $(this)
      .find("a")
      .on("click", function (e) {
        // click tabs

        /* LGEIN-111 20200728 add */
        var $a = $(this);
        if ($a.filter('[data-flag-blank][target="_blank"]').length) {
          return;
        }
        /* //LGEIN-111 20200728 add */

        e.preventDefault();
        if ($a.attr("href").indexOf("/") != -1) {
          location.href = $a.attr("href");
        } else {
          var target = "#" + $a.attr("href").split("#")[1];
          var $parent = $a.closest(
            ".tabs-type-liner, .tabs-type-rect, .tabs-type-line-box, .tabs-type-vertical"
          );
          // change tab design
          $a.addClass("active");
          $parent
            .find("a")
            .not($a)
            .removeClass("active")
            .attr("aria-selected", false);
          $a.addClass("active").attr("aria-selected", true);
          // 20200406 START 이상현 - tab ui 인터랙션 수정
          if ($a.closest(".js-tab").length > 0) {
            $parent.find('[role="tab"]').not($a).attr("tabindex", -1);
            $a.attr("tabindex", 0);
          }
          // 20200406 END
          // toggle selected tab area
          if (target != "#" && $(target).get(0)) {
            var tclass = $(target)
              .attr("class")
              .replace(" active", "")
              .split(" ")[0];
            var target2 =
              $parent.parents().find("." + tclass).length > 0
                ? $parent.parents().find("." + tclass)
                : $parent
                    .parent()
                    .parent()
                    .find("." + tclass);
            if (
              target2.length == 0 &&
              $parent.closest(".tab-wrap").length > 0
            ) {
              var $parent2 = $parent.closest(".tab-wrap");
              target2 =
                $parent2.parent().find("." + tclass).length > 0
                  ? $parent2.parent().find("." + tclass)
                  : $parent2
                      .parent()
                      .parent()
                      .find("." + tclass);
            }
            var parentType = 1;
            if ($parent.closest(".track-repair-signin").length > 0) {
              // track repair signin
              target2 = $parent
                .closest(".track-repair-signin")
                .find("." + tclass);
              parentType = 2;
            } else if ($parent.closest(".component").length > 0) {
              // components (all)
              parentType = 3;
              target2 = $parent.closest(".component").find("." + tclass);
              if ($(target).find(".slick-slider").length > 0) {
                setTimeout(function () {
                  $(target).css({ opacity: 0 });
                  target2.removeClass("active");
                  $(target).addClass("active");
                  setTimeout(function () {
                    $(target)
                      .find(".slick-slider")
                      .css({ width: "100%" })
                      .slick("setPosition");
                    $(target).animate({ opacity: 1 }, 200);
                  }, 200);
                }, 200);
              } else {
                target2.removeClass("active");
                $(target).addClass("active");
              }
              if (typeof runBVStaticPLP != "undefined")
                runBVStaticPLP($(target));
            }
            if (parentType < 3) {
              target2.removeClass("active");
              $(target).addClass("active");
            }
          }

          // scroll
          // 20200511 START 이상현 - 선택한 tab이 늘 정위치에 오도록 수정
          setActiveScroll($a.closest(".tab-outer"));
          // 20200511 END
          //fixScrollPos($a);
        }
      });
  });
})(jQuery);

// Scripts that run on designed input=file
var bindFileUpload;
(function ($) {
  bindFileUpload = function ($el) {
    var $file = $el || $(".delivery-part").not(".available");
    if ($file.length >= 1) {
      $file.each(function () {
        var _this = this;
        $(this).addClass("available");
        var $inputTxt = $(this).find(".file-name-expose"),
          $inputFile = $(this).find(".replace-file-input input[type=file]");

        // Print file name when file is attached
        $(_this).on(
          {
            change: function (e) {
              var fileName;
              var delTarget = e.delegateTarget;
              var _$inputTxt = $(delTarget).find("input.file-name-expose");

              if (e.currentTarget.files[0]) {
                var deleteText = _$inputTxt.attr("data-delete-title")
                  ? _$inputTxt.attr("data-delete-title")
                  : "Delete";
                if (window.FileReader) {
                  fileName = $(e.currentTarget)[0].files[0].name;
                } else {
                  fileName = $(e.currentTarget)
                    .val()
                    .split("/")
                    .pop()
                    .split("\\")
                    .pop();
                }
                _$inputTxt.focus().val(fileName);
                $(delTarget).addClass("attached");

                if (!$(delTarget).find("div.file-name-expose").get(0)) {
                  _$inputTxt.wrap('<div class="file-name-expose"></div>');
                  $(delTarget)
                    .find("div.file-name-expose")
                    .append(
                      '<a class="delete" href="#"><span class="icon"></span><span class="sr-only">' +
                        xssfilter(deleteText) +
                        "</span></a>"
                    );
                }
              } else {
                fileName = $(e.currentTarget)
                  .val()
                  .split("/")
                  .pop()
                  .split("\\")
                  .pop();
                $(e.currentTarget).closest(".field-block").removeClass("error");
                _$inputTxt.focus().val("");
              }
            },
          },
          "input[type=file]"
        );

        $(_this).on(
          {
            click: function (e) {
              e.preventDefault();
              var delTarget = e.delegateTarget;
              $(delTarget).removeClass("attached");
              $(delTarget).find("input").val("");

              /* PJTEXTENDEDWTY-4 Start */
              if (
                $(".extended-warranty").find(".btn.step-complete").length > 0
              ) {
                $(".extended-warranty")
                  .find(".btn.step-complete")
                  .prop("disabled", true);
              }
              /* PJTEXTENDEDWTY-4 End */
              // Remove error class when file is deleted
              $(delTarget).closest(".error").removeClass("error");
            },
          },
          ".delete"
        );

        // Pre-treat capacity limits to prevent arbitrary changes
        if ($inputFile.data("max")) {
          var max = $inputFile.data("max");
          $inputFile.removeAttr("data-max");
          $inputFile.data("max", max);
        }

        // Pre-process file extension limit values to prevent arbitrary changes
        if ($inputFile.data("extension")) {
          var extension = $inputFile.data("extension");
          $inputFile.removeAttr("data-extension");
          $inputFile.data("extension", extension);
        }
      });
    }
  };
  bindFileUpload();
})(jQuery);

// modal
$(function () {
  // fix modal for ie9
  var isIE = window.ActiveXObject || "ActiveXObject" in window;
  if (isIE) {
    $(".modal").removeClass("fade");
  }
});

// print
var runPrint;
(function ($) {
  runPrint = function () {
    if (
      !document.querySelector(".page-print") &&
      !document.querySelector(".page-print")
    )
      return false;
    var $printPage = $(".page-print");
    $printPage.off().on("click", function (e) {
      e.preventDefault();

      if ($(".request-repair-completion").length > 0) {
        // request repair
        adobeTrackEvent("cs-repair-print", {
          page_event: { print_repair_request: true },
        });
      } else if ($(".dispatch-portal-completion").length > 0) {
        // dispatch portal
        adobeTrackEvent("cs-repair-print", {
          page_event: { print_repair_request: true },
        });
      } else if ($(".request-ra-completion").length > 0) {
        // request ra
        adobeTrackEvent("cs-repair-print", {
          page_event: { print_repair_request: true },
        });
      } else if ($(".request-swap-completion").length > 0) {
        // request swap
        adobeTrackEvent("cs-repair-print", {
          page_event: { print_repair_request: true },
        });
      } else if ($(".repair-info-wrap").length > 0) {
        // track repair detail
        adobeTrackEvent("cs-repair-print", {
          page_event: { print_repair_request: true },
        });
      } else if ($(".email-result").length > 0) {
        // email result
        adobeTrackEvent("cs-repair-print", {
          page_event: { print_repair_request: true },
        });
      }

      var modal = $(e.currentTarget).parents(".modal").get(0);
      if (modal) {
        //console.log('1');
        var divToPrint = modal;
        var newWin = window.open("", "Print-Window");
        newWin.document.open();
        newWin.document.write(
          '<html><body onload="window.print()"><link rel="stylesheet" href="/lg5-common-gp/css/modal-print.min.css" type="text/css" /><div class="modal">' +
            divToPrint.innerHTML +
            "</div></body></html>"
        );
        setTimeout(function () {
          newWin.document.close();
          setTimeout(function () {
            newWin.close();
          }, 10);
        }, 200);
      } else {
        window.print();
      }
    });
  };
  runPrint();
})(jQuery);

// scroll tab
// WA-Common-Tab : mobile용 tab scroll guide 삭제
var tabMktControll;
(function ($) {
  // WA-Common-Tab : mobile용 tab scroll guide 삭제
  // tabGuideActive = function () {
  // 	var $guide = $('.js-tab-guide-outer');
  // 	for (var i = 0; i < $guide.length; i++) {
  // 		var $this = $guide.eq(i);
  // 		var arrow = '<div class="arrow"></div>';
  // 		if ($this.outerWidth() < $this.find('.js-tab-guide-inner').outerWidth()) {
  // 			$this.append(arrow);
  // 		}
  // 	}
  // 	$guide.off().on({
  // 		touchend: function () {
  // 			$(this).find('.arrow').addClass('js-fade');
  // 		}
  // 	});
  // };
  // if ('ontouchstart' in window && mql.maxXs.matches) {
  // 	$(window).on({
  // 		'orientationchange.tab': function () {
  // 			tabGuideActive();
  // 		}
  // 	});
  // 	tabGuideActive();
  // }

  tabMktControll = function () {
    // WA-Common-Tab : tab scroll button 추가를 위한 CSS 수정;
    var $mktTab = $(".js-tab-controll, .js-tab-controll-type2");
    $mktTab.on(
      {
        click: function (e) {
          var current = e.currentTarget,
            scroll = e.delegateTarget.querySelector(".js-tab-guide-outer");
          // .mCustomScrollbar('scrollTo','+=300');
          // this.mcs.topPct
          if ($(current).is(".scroll-left")) {
            $(scroll).mCustomScrollbar("scrollTo", "+=300");
          } else if ($(current).is(".scroll-right")) {
            $(scroll).mCustomScrollbar("scrollTo", "-=300");
          }
        },
      },
      "button"
    );

    // 2022.01.21 sticky tab 추가 stat
    var $mktTab = $(".js-tab-controll-type3");
    var scrollLength;
    $mktTab.on(
      {
        click: function (e) {
          var current = e.currentTarget,
            scroll = e.delegateTarget.querySelector(".js-tab-guide-outer"),
            scrollWrap = e.delegateTarget.querySelector(".js-tab-guide-inner");

          var dir = $("html").attr("dir");
          var currentPos = Math.abs($(scroll)[0].mcs.left);
          var result = currentPos;
          var textPadding =
            $(scroll).find("li:nth-child(2)").innerWidth() -
            $(scroll).find("li:nth-child(2)").width();
          var currentNum = 0;
          var textMenuLength = [];
          var buttonSize = $(scroll)
            .closest(".js-tab-controll-type3")
            .find(".tab-scroll-controller button")
            .width();
          var hiddenSize =
            buttonSize -
            ($(scroll).closest(".js-tab-controll-type3").width() -
              $(scroll).width()) /
              2;
          for (var i = 0; i < $(scroll).find(".btn-tab").length; i++) {
            textMenuLength.push(
              Math.ceil(
                $(scroll)
                  .find("li:eq(" + i + ")")
                  .width() + textPadding
              )
            );
          }

          if ($(current).is(".scroll-right"))
            result = $(scroll).width() + result;
          if (mql.maxSm.matches) {
            if ($(scroll).closest(".text-menu"))
              hiddenSize += $(current).find(".gradient").width();

            if ($(current).is(".scroll-left")) result += hiddenSize;
            else result -= hiddenSize;
          }

          if (dir != "rtl") {
            for (var i = 0; i < textMenuLength.length; i++) {
              if (result > textMenuLength[i]) {
                result = result - textMenuLength[i];
                currentNum++;
              } else {
                break;
              }
            }

            if ($(current).is(".scroll-left")) {
              scrollLength = result;
              $(scroll).mCustomScrollbar("scrollTo", "+=" + scrollLength);
            } else if ($(current).is(".scroll-right")) {
              // LGECI-821 Start
              scrollLength = result;
              $(scroll).mCustomScrollbar("scrollTo", "-=" + scrollLength);
              // LGECI-821 End
            }
          } else {
            currentNum = textMenuLength.length - 1;
            for (var i = textMenuLength.length - 1; i > 0; i--) {
              if (result > textMenuLength[i]) {
                result = result - textMenuLength[i];
                currentNum--;
              } else {
                break;
              }
            }

            if ($(current).is(".scroll-left")) {
              scrollLength = result;
              $(scroll).mCustomScrollbar("scrollTo", "+=" + scrollLength);
            } else if ($(current).is(".scroll-right")) {
              scrollLength = textMenuLength[currentNum] - textPadding - result;
              if (scrollLength <= 0)
                scrollLength = textMenuLength[currentNum - 1];
              $(scroll).mCustomScrollbar("scrollTo", "-=" + scrollLength);
            }
          }
        },
      },
      "button"
    );
    // 2022.01.21 sticky tab 추가 end

    // 2022.01.21 sticky tab 수정 start
    $mktTab.find(".js-tab-guide-outer").on({
      scrolled: function () {
        var $wrap = $(this).closest(
          ".js-tab-controll, .js-tab-controll-type2, .js-tab-controll-type3"
        ); // WA-Common-Tab
        $wrap.find(".scroll-left").removeAttr("disabled");
        $wrap.find(".scroll-right").removeAttr("disabled");
      },
      totalScroll: function () {
        var $wrap = $(this).closest(
          ".js-tab-controll, .js-tab-controll-type2, .js-tab-controll-type3"
        ); // WA-Common-Tab
        $wrap.find(".scroll-left").removeAttr("disabled");
        $wrap.find(".scroll-right").attr("disabled", "disabled");
      },
      totalScrollBack: function () {
        var $wrap = $(this).closest(
          ".js-tab-controll, .js-tab-controll-type2, .js-tab-controll-type3"
        ); // WA-Common-Tab
        $wrap.find(".scroll-left").attr("disabled", "disabled");
        $wrap.find(".scroll-right").removeAttr("disabled");
      },
    });

    $mktTab.find(".js-tab-guide-outer").trigger("totalScrollBack");
  };
  // 2022.01.21 sticky tab 수정 end
  // WA-Common-Tab : 모바일에서도 tabMktControll 활성화되도록 수정
  // if (!('ontouchstart' in window && mql.maxXs.matches)) {
  // 	tabMktControll();
  // }
  tabMktControll();
  // //js-tab-controll
})(jQuery);

// ie browser form attribute polyfill
(function () {
  // Via Modernizr
  function formAttributeSupport() {
    var form = document.createElement("form"),
      input = document.createElement("input"),
      div = document.createElement("div"),
      id = "formtest" + new Date().getTime(),
      attr,
      bool = false;

    form.id = id;
    // IE6/7 confuses the form idl attribute and the form content attribute
    if (document.createAttribute) {
      attr = document.createAttribute("form");
      attr.nodeValue = id;
      input.setAttributeNode(attr);
      div.appendChild(form);
      div.appendChild(input);

      document.documentElement.appendChild(div);

      bool = form.elements.length === 1 && input.form == form;

      div.parentNode.removeChild(div);
    }

    return bool;
  }

  if (!formAttributeSupport()) {
    $(document)
      .on("click", "[type=submit][form]", function (event) {
        event.preventDefault();
        var formId = $(this).attr("form"),
          $form = $("#" + formId).submit();
      })
      .on("keypress", "form input", function (event) {
        var $form;
        if (event.keyCode == 13) {
          $form = $(this).parents("form");
          if (
            $form.find("[type=submit]").length == 0 &&
            $("[type=submit][form=" + $(this).attr("form") + "]").length > 0
          ) {
            $form.submit();
          }
        }
      });
  }
})();

// PJTOBS-32 , PJTOBSB2E-3 Start
function getAllPrice() {
  var models = new Array();
  // For products with a total class in price-area, buttons are only displayed on the screen if they have an active class
  // GPC0003, GPC0004, GPC0007, GPC0012, GPC0026, Compare, Search (B2C, B2B, No Result, Single B2C, Single B2B, View All B2C, View All B2B)
  var $productsInfo = $(".products-info");
  for (var i = 0; i < $productsInfo.length; i++) {
    var model = $productsInfo.eq(i).attr("data-model-id")
      ? $productsInfo.eq(i).attr("data-model-id")
      : "";
    if (model != "") models.push(model);
  }
  // GPC0006, GPC0021
  var $bundle = $(".bundle");
  for (var i = 0; i < $bundle.length; i++) {
    var model = $bundle.eq(i).attr("data-model-id")
      ? $bundle.eq(i).attr("data-model-id")
      : "";
    if (model != "") models.push(model);
  }
  // GPC0058
  var $infoArea = $(".info-area");
  for (var i = 0; i < $infoArea.length; i++) {
    var model = $infoArea.eq(i).attr("data-model-id")
      ? $infoArea.eq(i).attr("data-model-id")
      : "";
    if (model != "") models.push(model);
  }
  // GPC0082
  var $modelInfo = $(".model-info");
  for (var i = 0; i < $modelInfo.length; i++) {
    var model = $modelInfo.eq(i).attr("data-model-id")
      ? $modelInfo.eq(i).attr("data-model-id")
      : "";
    if (model != "") models.push(model);
  }
  // GPC0009
  var $pdpInfo = $(".pdp-sideInfo");
  for (var i = 0; i < $pdpInfo.length; i++) {
    var model = $pdpInfo.eq(i).attr("data-wish-model-id")
      ? $pdpInfo.eq(i).attr("data-wish-model-id")
      : "";
    if (model != "") models.push(model);
  }
  //QUICKWIN-4_krchoi START
  // GPC0009 Recommended Products popup
  var $dxArea = $(".dx-price-area");
  for (var i = 0; i < $dxArea.length; i++) {
    var model = $dxArea.eq(i).attr("data-model-id")
      ? $dxArea.eq(i).attr("data-model-id")
      : "";
    if (model != "") models.push(model);
  }
  //QUICKWIN-4_krchoi END
  // LGEPL-697 Start
  // 공통 마크업 미적용된 예외 컴포넌트 (ex. GPC0161)
  var $exceptionComponentInfo = $('[data-lazyload-vip="getAllPrice"]');
  for (var i = 0; i < $exceptionComponentInfo.length; i++) {
    var model = $exceptionComponentInfo.eq(i).attr("data-model-id")
      ? $exceptionComponentInfo.eq(i).attr("data-model-id")
      : "";
    if (model != "") models.push(model);
  }
  // LGEPL-697 End

  // Sorting and deduplication
  var r = models
    .slice()
    .sort(function (a, b) {
      return a - b;
    })
    .reduce(function (a, b) {
      if (a.slice(-1)[0] !== b) a.push(b);
      return a;
    }, []);
  return r.join(",");
}

/* PJTSUMMARY-4 START, PJTPPDPAOB-1 addonBundleUseFlag 추가 */
function setVipPriceImprove(
  items,
  priceOrg,
  pricePromo,
  rDiscountedPrice,
  obsMembershipPrice,
  discountedMembershipPriceRate,
  discountedMembershipPrice,
  retailerPricingFlag,
  limitSaleCondition,
  obsInventoryFlag,
  obsProductCount,
  obsGroup,
  membershipDisplayFlag,
  emiMsg,
  afterPay,
  caculatorUseFlag,
  bizType,
  msrpUseFlag,
  vipPriceText,
  vipPriceFlag,
  discountPDPMsg,
  addOnBundleUseFlag
) {
  // LGEIS-1213, LGCOMMON-54

  if (DEBUG)
    console.log(
      "setVipPrice",
      items.length,
      priceOrg,
      pricePromo,
      discountedMembershipPrice
    );
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (
      !!priceOrg &&
      priceOrg != "0" &&
      priceOrg != null &&
      priceOrg != "" &&
      priceOrg != 0
    ) {
      var priceBox = $(item).find(".price-box");
      var totalPriceBox = $(item).find(".price-total-info");
      var limitArea = $(item).find("#improveLimitedQty");
      var recommendedArea = $(priceBox).find("#improveRecommendedPrice");
      var priceOrgArea = $(item).find("#improvePrice");
      var priceVipArea = $(item).find("#improveVipPrice .price-d");
      var priceDiscountedArea = $(item).find("#improveVipPrice .price-d");
      var membershipTooltipArea = $(item).find("#improveMembershipTooltip");
      var membershipPriceDiscountedArea = $(item).find(
        "#improveMembershipPrice"
      );
      var totalPriceArea = $(item).find(".price-total-box");
      var paymentsArea = $(item).find(".payments");
      var currencyText = $(".GPC0009.improve").find("#currencyText").val();
      var currencyPosition = $(".GPC0009.improve")
        .find("#currencyPosition")
        .val();

      if (retailerPricingFlag == "Y") {
        if (!$(item).hasClass("add-retailer")) {
          $(item).addClass("add-retailer");
        }
      } else {
        $(item).removeClass("add-retailer");

        if (limitSaleCondition == "Y") {
          $(limitArea).find("#price-vip").hide();
          if (!$(limitArea).hasClass("act")) {
            $(limitArea).addClass("act");
          }
          $(limitArea).find("#price-limited").show();
          if (obsInventoryFlag != "Y") {
            if (!$(limitArea).find(".limited-ea").hasClass("zero")) {
              $(limitArea).find(".limited-ea").addClass("zero");
            }
            $(limitArea).find(".limited-ea").text("0");
          } else {
            if ($(limitArea).find(".limited-ea").hasClass("zero")) {
              $(limitArea).find(".limited-ea").removeClass("zero");
            }
            $(limitArea).find(".limited-ea").text(obsProductCount);
          }
        } else {
          if (
            "Y" == vipPriceFlag &&
            "" != vipPriceText &&
            null != vipPriceText
          ) {
            $(limitArea).find("#price-limited").hide();
            if ($(limitArea).hasClass("act")) {
              $(limitArea).removeClass("act");
            }

            // LGCOMMON-54 Start
            // for fetching Omnibus vip price in GPC0011
            if ($(".GPC0011").length && $("#priceSyncTemplateGPC0011").length) {
              $(".discountMessage").val(!!discountPDPMsg ? discountPDPMsg : "");
              $(".component-rPrice").val(!!priceOrg ? priceOrg : "");
              $(".component-rPriceCent").val("");
              $(".component-rPromoPrice").val(!!pricePromo ? pricePromo : "");
              $(".component-rPromoPriceCent").val("");
              $(".vipPriceFlag").val("Y");
            }
            // LGCOMMON-54 End
          } else {
            $(limitArea).removeClass("act");
          }
        }

        if (COUNTRY_CODE.toLowerCase() == "ru") {
          if (!$(recommendedArea).hasClass("d-none")) {
            $(recommendedArea).addClass("d-none");
          }
          if ("L" == currencyPosition) {
            if (
              !pricePromo ||
              pricePromo == "0" ||
              pricePromo == null ||
              pricePromo == "" ||
              pricePromo == 0
            ) {
              $(recommendedArea)
                .find(".price-num")
                .text(currencyText + priceOrg);
            } else {
              $(recommendedArea)
                .find(".price-num")
                .text(currencyText + pricePromo);
            }
          } else {
            if (
              !pricePromo ||
              pricePromo == "0" ||
              pricePromo == null ||
              pricePromo == "" ||
              pricePromo == 0
            ) {
              $(recommendedArea)
                .find(".price-num")
                .text(priceOrg + currencyText);
            } else {
              $(recommendedArea)
                .find(".price-num")
                .text(pricePromo + currencyText);
            }
          }
        }

        if (
          !pricePromo ||
          pricePromo == "0" ||
          pricePromo == null ||
          pricePromo == "" ||
          pricePromo == 0
        ) {
          if (!$(priceVipArea).find(".sub-d").hasClass("d-none")) {
            $(priceVipArea).find(".sub-d").addClass("d-none");
          }
          if (!$(priceVipArea).find(".price-del").hasClass("d-none")) {
            $(priceVipArea).find(".price-del").addClass("d-none");
          }
          if ($(priceVipArea).find(".price-won").hasClass("d-none")) {
            $(priceVipArea).find(".price-won").removeClass("d-none");
          }
          $(priceVipArea).find(".price-won span").text(priceOrg);
          $(totalPriceArea).find(".total-price-num").addClass("msrp");
          if ("L" == currencyPosition) {
            $(totalPriceArea)
              .find(".total-price-num strong")
              .text(currencyText + priceOrg);
            //PJTPPDPAOB-1  start
            if (addOnBundleUseFlag == "Y") {
              $(totalPriceArea)
                .find(".total-del del")
                .text(currencyText + priceOrg);
              $(totalPriceArea)
                .find(".total-save")
                .text(
                  $("#msg_disCount").val() +
                    " " +
                    currencyText +
                    rDiscountedPrice
                );
            }
            //PJTPPDPAOB-1  END
          } else {
            $(totalPriceArea)
              .find(".total-price-num strong")
              .text(priceOrg + currencyText);
            //PJTPPDPAOB-1  start
            if (addOnBundleUseFlag == "Y") {
              $(totalPriceArea)
                .find(".total-del del")
                .text(priceOrg + currencyText);
              $(totalPriceArea)
                .find(".total-save")
                .text(
                  $("#msg_disCount").val() +
                    " " +
                    rDiscountedPrice +
                    currencyText
                );
            }
            //PJTPPDPAOB-1  END
          }
        } else {
          if ($(priceVipArea).find(".sub-d").hasClass("d-none")) {
            $(priceVipArea).find(".sub-d").removeClass("d-none");
          }
          if ($(priceVipArea).find(".price-del").hasClass("d-none")) {
            $(priceVipArea).find(".price-del").removeClass("d-none");
          }
          if ($(priceVipArea).find(".price-won").hasClass("d-none")) {
            $(priceVipArea).find(".price-won").removeClass("d-none");
          }

          // LGEIS-1213 START
          if (discountPDPMsg == null) {
            $(priceVipArea).find(".sub-d span").text("");
          } else {
            $(priceVipArea).find(".sub-d span").html(discountPDPMsg);
          }
          // LGEIS-1213 END
          $(priceVipArea).find(".price-del span").text(priceOrg);
          $(priceVipArea).find(".price-won span").text(pricePromo);
          if ("L" == currencyPosition) {
            $(totalPriceArea)
              .find(".total-price-num strong")
              .text(currencyText + pricePromo);
            //PJTPPDPAOB-1  start
            if (addOnBundleUseFlag == "Y") {
              $(totalPriceArea)
                .find(".total-del del")
                .text(currencyText + priceOrg);
              $(totalPriceArea)
                .find(".total-save")
                .text(
                  $("#msg_disCount").val() +
                    " " +
                    currencyText +
                    rDiscountedPrice
                );
            }
            //PJTPPDPAOB-1  END
          } else {
            $(totalPriceArea)
              .find(".total-price-num strong")
              .text(pricePromo + currencyText);
            //PJTPPDPAOB-1  start
            if (addOnBundleUseFlag == "Y") {
              $(totalPriceArea)
                .find(".total-del del")
                .text(priceOrg + currencyText);
              $(totalPriceArea)
                .find(".total-save")
                .text(
                  $("#msg_disCount").val() +
                    " " +
                    rDiscountedPrice +
                    currencyText
                );
            }
            //PJTPPDPAOB-1  END
          }
        }

        if ("B2C" == obsGroup || "none" == obsGroup) {
          if (
            "Y" == membershipDisplayFlag &&
            !!discountedMembershipPrice &&
            discountedMembershipPrice != "0" &&
            discountedMembershipPrice != null &&
            discountedMembershipPrice != "" &&
            discountedMembershipPrice != 0
          ) {
            if (!$(membershipTooltipArea).hasClass("act")) {
              $(membershipTooltipArea).addClass("act");
            }
            if (!$(membershipPriceDiscountedArea).hasClass("act")) {
              $(membershipPriceDiscountedArea).addClass("act");
            }
            if ("B2C" == obsGroup) {
              if ($(membershipPriceDiscountedArea).hasClass("dis")) {
                $(membershipPriceDiscountedArea).removeClass("dis");
              }
              if (!$(priceDiscountedArea).hasClass("dis")) {
                $(priceDiscountedArea).addClass("dis");
              }
            } else {
              if (!$(membershipPriceDiscountedArea).hasClass("dis")) {
                $(membershipPriceDiscountedArea).addClass("dis");
              }
              if ($(priceDiscountedArea).hasClass("dis")) {
                $(priceDiscountedArea).removeClass("dis");
              }
            }
          } else {
            if ($(membershipTooltipArea).hasClass("act")) {
              $(membershipTooltipArea).removeClass("act");
            }
            if ($(membershipPriceDiscountedArea).hasClass("act")) {
              $(membershipPriceDiscountedArea).removeClass("act");
            }
            if (!$(membershipPriceDiscountedArea).hasClass("dis")) {
              $(membershipPriceDiscountedArea).addClass("dis");
            }
            if ($(priceDiscountedArea).hasClass("dis")) {
              $(priceDiscountedArea).removeClass("dis");
            }
          }
        } else {
          //PJTPPDPAOB-1  start
          if (addOnBundleUseFlag != "Y") {
            //PJTPPDPAOB-1  end
            if ($(item).find(".base-price").hasClass("add-member")) {
              $(item).find(".base-price").removeClass("add-member");
            }
            //PJTPPDPAOB-1  start
          }
          //PJTPPDPAOB-1  end
          $(item).find("#improvePrice").addClass("d-none");

          if ($(item).find("#improveVipPrice").hasClass("d-none")) {
            $(item).find("#improveVipPrice").removeClass("d-none");
          }
        }

        if (
          "B2B" == bizType &&
          "Y" == msrpUseFlag &&
          !(
            !priceOrg ||
            priceOrg == "0" ||
            priceOrg == null ||
            priceOrg == "" ||
            priceOrg == 0
          )
        ) {
          if (!$(totalPriceArea).find(".total-price-num").hasClass("msrp")) {
            $(totalPriceArea).find(".total-price-num").addClass("msrp");
          }
        } else {
          $(totalPriceArea).find(".total-price-num").removeClass("msrp");
        }

        if (emiMsg != null && emiMsg != "") {
          //PJTPPDPAOB-1  start
          if (addOnBundleUseFlag != "Y") {
            //PJTPPDPAOB-1  end
            if (!$(item).hasClass("add-payments")) {
              $(item).addClass("add-payments");
            }
            //PJTPPDPAOB-1  start
          }
          //PJTPPDPAOB-1  end
          if (COUNTRY_CODE.toLowerCase() == "au") {
            $(paymentsArea).find(".price-afterpay").html("");
            $(paymentsArea).find(".price-zippay").html("");
            if (afterPay <= 3000 && afterPay > 0) {
              $(paymentsArea)
                .find(".price-afterpay")
                .prop("href", "#modal-afterPay")
                .addClass("afterpay-installment")
                .removeAttr("style")
                .html(emiMsg);
              $(paymentsArea)
                .find(".price-zippay")
                .prop("href", "#modal-afterPay")
                .addClass("afterpay-installment")
                .removeAttr("style");
            } else if (afterPay > 3000 && afterPay <= 10000) {
              /* OBSLGEAU-749 (5000 -> 10000) */
              $(paymentsArea)
                .find(".price-zippay")
                .prop("href", "#modal-afterPay")
                .addClass("afterpay-installment")
                .removeAttr("style");
            } else {
              $(paymentsArea)
                .find(".price-afterpay")
                .removeAttr("href")
                .removeClass("afterpay-installment")
                .prop("style", "display:none;");
              $(paymentsArea)
                .find(".price-zippay")
                .removeAttr("href")
                .removeClass("afterpay-installment")
                .prop("style", "display:none;");
            }
          } else {
            if ("Y" == caculatorUseFlag) {
              $(paymentsArea).find(".price-installment.calculator").html("");
              $(paymentsArea)
                .find(".price-installment.calculator")
                .html(emiMsg);
            } else {
              $(paymentsArea).find(".price-installment.no-calculator").html("");
              $(paymentsArea)
                .find(".price-installment.no-calculator")
                .html(emiMsg);
            }
            $(".GPC0009.improve")
              .find(
                ".mobile-bottom-info .simple-price-area .payments .price-installment"
              )
              .html(emiMsg);
          }
        } else {
          //PJTPPDPAOB-1  start
          if (addOnBundleUseFlag != "Y") {
            //PJTPPDPAOB-1  end
            if ($(item).hasClass("add-payments")) {
              $(item).removeClass("add-payments");
            }
            //PJTPPDPAOB-1  start
          }
          //PJTPPDPAOB-1  end
        }
      }

      $(".GPC0009.improve").find(".price-pdp-area").removeClass("d-none");
      if (
        $(".GPC0009.improve").find(".button > a").hasClass("add-to-cart") ==
        true
      ) {
        $(".GPC0009.improve").find(".fixed-price").removeClass("d-none");
      }
      //PJTPPDPAOB-1  start
      if (addOnBundleUseFlag == "Y") {
        if (rDiscountedPrice != 0 || rDiscountedPrice != "0") {
          $(totalPriceArea).addClass("add-detail");
          $(totalPriceArea).attr("data-detail", "Y");
        } else {
          $(totalPriceArea).attr("data-detail", "N");
        }
      }
      //PJTPPDPAOB-1  end
    } else {
      //PJTPPDPAOB-1  start
      if (addOnBundleUseFlag == "Y") {
        $(totalPriceArea).removeClass("add-detail");
        $(totalPriceArea).attr("data-detail", "N");
      }
      //PJTPPDPAOB-1  end
      $(".GPC0009.improve")
        .find(".price-pdp-area")
        .removeClass("d-none")
        .addClass("d-none");
      $(".GPC0009.improve")
        .find(".fixed-price")
        .removeClass("d-none")
        .addClass("d-none");
    }
    //PJTPPDPAOB-1  start
    if (addOnBundleUseFlag == "Y") {
      if ($(".add-bundle-area .bundle-list ul li").length == 0) {
        $(".add-bundle-area").addClass("d-none");
      } else {
        $(".add-bundle-area").removeClass("d-none");
      }
    }
    //PJTPPDPAOB-1  end
  }
}
/* PJTSUMMARY-4 END */
//PJTOBSB2E-3 End
function setVipPrice(
  item,
  priceOrg,
  pricePromo,
  legal,
  vipPriceText,
  previousPriceText,
  memo,
  emiMsg,
  afterPay,
  limitSaleCondition,
  limitSaleText
) {
  // LGCOMMON-54

  $(".price-area").addClass("vip-price-area");

  // LGEPL-697 Start
  item.eq(0).closest(".GPC0004").find(".model-buy").addClass("has-topInfo");

  let vipPriceTextFlag = true;
  if (item.eq(0).closest(".component").is(".GPC0161")) vipPriceTextFlag = false;
  // LGEPL-697 End

  //vip price 변경 대상 : 형제에 price-vip-Installment,.price-pdp-Installment 있다
  var vip_change_componentArr = [
    ".GPC0003",
    ".GPC0004",
    ".GPC0007",
    ".GPC0009",
    ".GPC0026",
    ".GPC0082",
    ".GPC0132",
    ".compare-wrap",
    ".search-result-view-all",
    ".search-result-products-wrap",
    ".search-result-business-products-wrap",
  ];

  $(vip_change_componentArr.join(","))
    .find(".price-area")
    .removeClass("vip-price-area");

  for (var i = 0; i < item.length; i++) {
    if (DEBUG)
      console.log(
        "setVipPrice",
        item.length,
        priceOrg,
        pricePromo,
        legal,
        vipPriceText,
        previousPriceText,
        memo
      );
    var priceArea = item.eq(i);
    if (priceArea.hasClass("total")) {
      // price-area has a total class
      // GPC0004, GPC0007, GPC0026, Search (B2C, B2B, No Result, Single B2C, Single B2B, View All B2C, View All B2B)

      if (
        priceArea.hasClass("type-default") ||
        priceArea.hasClass("type-promotion")
      ) {
        // type-default (price), type-promotion (promotion price)
        if (
          !pricePromo ||
          pricePromo == "0" ||
          pricePromo == null ||
          pricePromo == "" ||
          pricePromo == 0
        ) {
          priceArea
            .addClass("type-default")
            .removeClass("type-promotion")
            .find(".purchase-price .price .number")
            .text(priceOrg);
          if (
            priceArea.find(".purchase-price .vip-price").length == 0 &&
            vipPriceTextFlag
          ) {
            // LGEPL-697
            priceArea
              .find(".purchase-price")
              .prepend(
                '<div class="vip-price"><span class="name"></span></div>'
              );
          }
          priceArea.find(".purchase-price .vip-price .name").text(vipPriceText);
        } else {
          priceArea
            .removeClass("type-default")
            .addClass("type-promotion")
            .find(".purchase-price .price .number")
            .text(pricePromo);
          priceArea.find(".product-price .price .number").text(priceOrg);
          if (legal == null) {
            priceArea.find(".product-price .legal").text("");
            //QUICKWIN-4_krchoi ADD
            priceArea.find(".legal").text("");
          } else {
            priceArea.find(".product-price .legal").html(legal); // LGEIS-229 change how discounts are shown
            //QUICKWIN-4_krchoi ADD
            priceArea.find(".legal").html(legal);
          }
          if (
            priceArea.find(".purchase-price .vip-price").length == 0 &&
            vipPriceTextFlag
          ) {
            // LGEPL-697
            priceArea
              .find(".purchase-price")
              .prepend(
                '<div class="vip-price"><span class="name"></span></div>'
              );
          }
          priceArea.find(".purchase-price .vip-price .name").text(vipPriceText);
        }
      } else {
        priceArea.find(".vip-price").remove();
      }
    } else {
      // price-area does not have total class
      // GPC0003, GPC0006, GPC0009, GPC0010, GPC0012, GPC0021, GPC0058, GPC0082, My Product > Accessories, Compare
      if (priceArea.find(".purchase-price").length > 0) {
        // LGEPL-697 Start
        const pricePromoFlag =
          !pricePromo ||
          pricePromo == "0" ||
          pricePromo == null ||
          pricePromo == "" ||
          pricePromo == 0
            ? false
            : true;
        const sellingPrice = pricePromoFlag ? pricePromo : priceOrg;

        if (priceArea.closest(".GPC0082").length > 0) {
          // GPC0082
          priceArea.find(".selling-price .number").text(sellingPrice);
          priceArea.find(".selling-price .vip-price .name").text(vipPriceText);
          priceArea.find(".production-price").remove();

          if (pricePromoFlag) {
            priceArea
              .find(".purchase-price")
              .append(
                '<div class="production-price"><del class="price" aria-label=""></del> <div class="legal"></div></div>'
              );
            priceArea
              .find(".purchase-price .production-price .price")
              .append(priceArea.find(".selling-price").html())
              .attr("aria-label", previousPriceText);
            priceArea
              .find(".purchase-price .production-price .vip-price")
              .remove();
            priceArea
              .find(".purchase-price .production-price .price .number")
              .text(priceOrg);
            priceArea
              .find(".purchase-price .production-price .legal")
              .html(legal); // LGEIS-229 change how discounts are shown
          }

          priceArea
            .find(".price-pdp-Installment, .purchase-price")
            .removeClass("d-none");
        } else {
          priceArea.find(".purchase-price .price .number").text(sellingPrice);
          priceArea.find(".purchase-price .price .num").text(sellingPrice); // for GPC0009

          // LGCOMMON-54 Start
          let vipPriceTextGPC0058 = false;
          let vipPriceTextArea = ".purchase-price .vip-price .name";
          if (
            !priceArea.find(".purchase-price .vip-price").length &&
            vipPriceTextFlag
          ) {
            // LGEPL-697
            if (priceArea.closest(".GPC0058").length) {
              vipPriceTextGPC0058 = true;
              vipPriceTextArea = ".price-vip-Installment .price-vip";
            } else
              priceArea
                .find(".purchase-price")
                .prepend(
                  '<div class="vip-price"><span class="name"></span></div>'
                );
          }
          priceArea.find(vipPriceTextArea).text(vipPriceText);

          if (vipPriceTextGPC0058) {
            if (limitSaleCondition == "Y")
              priceArea.find(".price-vip").remove();
            else priceArea.find(".price-limited").remove();

            priceArea.find(".price-vip-Installment").removeClass("d-none");
          }
          // LGCOMMON-54 End
          priceArea.find(".product-price").remove();

          if (!pricePromoFlag) priceArea.removeClass("type-promotion");
          else {
            priceArea.append(
              '<div class="product-price"><del class="price" aria-label=""></del> <div class="legal"></div></div>'
            );
            priceArea
              .find(".product-price .price")
              .append(priceArea.find(".purchase-price .price").html());
            priceArea
              .find(".product-price .price")
              .attr("aria-label", previousPriceText);
            priceArea.find(".product-price .price .number").text(priceOrg);
            priceArea.find(".product-price .price .num").text(priceOrg); // for GPC0009
            priceArea.find(".product-price .legal").html(legal); // LGEIS-229 change how discounts are shown
            priceArea.addClass("type-promotion");
          }
        }
        // LGEPL-697 End
      }
      if (priceArea.closest(".GPC0009").length > 0) {
        // for GPC0011 in PDP
        if (
          !pricePromo ||
          pricePromo == "0" ||
          pricePromo == null ||
          pricePromo == "" ||
          pricePromo == 0
        ) {
          $(
            ".GPC0011 .product-simple-info .product-selling-price .price .number"
          ).text(priceOrg);
        } else {
          $(
            ".GPC0011 .product-simple-info .product-selling-price .price .number"
          ).text(pricePromo);
        }
      }
    }

    //1차 적용 예외 처리
    if (
      priceArea.siblings(".price-vip-Installment,.price-pdp-Installment")
        .length > 0
    ) {
      priceArea.find(".vip-price").remove();

      // PJTLIMITQTY-5
      if (
        priceArea
          .siblings(".price-vip-Installment,.price-pdp-Installment")
          .find(".price-vip p").length > 0
      ) {
        priceArea
          .siblings(".price-vip-Installment,.price-pdp-Installment")
          .find(".price-vip p")
          .text(vipPriceText);
      } else {
        priceArea
          .siblings(".price-vip-Installment,.price-pdp-Installment")
          .find(".price-vip")
          .text(vipPriceText);
      }
      //LGEAU-378, LGEGMC-3167 START
      if (COUNTRY_CODE.toLowerCase() == "au") {
        priceArea
          .siblings(".price-vip-Installment,.price-pdp-Installment")
          .find(".price-afterpay")
          .html("");
        if (emiMsg != null && emiMsg != "") {
          if (afterPay <= 3000 && afterPay > 0) {
            priceArea
              .siblings(".price-vip-Installment,.price-pdp-Installment")
              .find(".price-afterpay")
              .prop("href", "#modal-afterPay")
              .addClass("afterpay-installment")
              .removeAttr("style")
              .html(emiMsg);
            priceArea
              .siblings(".price-vip-Installment,.price-pdp-Installment")
              .find(".price-zippay")
              .prop("href", "#modal-afterPay")
              .addClass("afterpay-installment")
              .removeAttr("style");
          } else if (afterPay > 3000 && afterPay <= 10000) {
            /* OBSLGEAU-749 (5000 -> 10000) */
            priceArea
              .siblings(".price-vip-Installment,.price-pdp-Installment")
              .find(".price-zippay")
              .prop("href", "#modal-afterPay")
              .addClass("afterpay-installment")
              .removeAttr("style");
          } else {
            priceArea
              .siblings(".price-vip-Installment,.price-pdp-Installment")
              .find(".price-afterpay")
              .removeAttr("href")
              .removeClass("afterpay-installment")
              .prop("style", "display:none;");
            priceArea
              .siblings(".price-vip-Installment,.price-pdp-Installment")
              .find(".price-zippay")
              .removeAttr("href")
              .removeClass("afterpay-installment")
              .prop("style", "display:none;");
          }
        }
      } else {
        // LGEITF-444
        priceArea
          .siblings(".price-vip-Installment,.price-pdp-Installment")
          .find(".price-installment, .price-installment-text")
          .html("");
        priceArea
          .siblings(".price-vip-Installment,.price-pdp-Installment")
          .find(".price-installment, .price-installment-text")
          .html(emiMsg);
        // LGEITF-444 End
      }
      //LGEAU-378, LGEGMC-3167 END
    }
    //GPC0082 예외처리
    if (
      priceArea.find(".price-pdp-Installment").length > 0 &&
      priceArea.closest(".GPC0082").length > 0
    ) {
      priceArea.find(".vip-price").remove();
      priceArea
        .find(".price-pdp-Installment")
        .find(".price-vip")
        .text(vipPriceText);

      //LGEAU-378, LGEGMC-3167 START
      if (COUNTRY_CODE.toLowerCase() == "au") {
        priceArea
          .find(".price-vip-Installment,.price-pdp-Installment")
          .find(".price-afterpay")
          .html("");
        if (emiMsg != null && emiMsg != "") {
          if (afterPay <= 3000 && afterPay > 0) {
            priceArea
              .siblings(".price-vip-Installment,.price-pdp-Installment")
              .find(".price-afterpay")
              .prop("href", "#modal-afterPay")
              .addClass("afterpay-installment")
              .removeAttr("style")
              .html(emiMsg);
            priceArea
              .siblings(".price-vip-Installment,.price-pdp-Installment")
              .find(".price-zippay")
              .prop("href", "#modal-afterPay")
              .addClass("afterpay-installment")
              .removeAttr("style");
          } else if (afterPay > 3000 && afterPay <= 10000) {
            /* OBSLGEAU-749 (5000 -> 10000) */
            priceArea
              .siblings(".price-vip-Installment,.price-pdp-Installment")
              .find(".price-zippay")
              .prop("href", "#modal-afterPay")
              .addClass("afterpay-installment")
              .removeAttr("style");
          } else {
            priceArea
              .siblings(".price-vip-Installment,.price-pdp-Installment")
              .find(".price-afterpay")
              .removeAttr("href")
              .removeClass("afterpay-installment")
              .prop("style", "display:none;");
            priceArea
              .siblings(".price-vip-Installment,.price-pdp-Installment")
              .find(".price-zippay")
              .removeAttr("href")
              .removeClass("afterpay-installment")
              .prop("style", "display:none;");
          }
        }
      } else {
        // LGEITF-444
        priceArea
          .find(".price-pdp-Installment")
          .find(".price-installment, .price-installment-text")
          .html("");
        priceArea
          .find(".price-pdp-Installment")
          .find(".price-installment, .price-installment-text")
          .html(emiMsg);
        // LGEITF-444 End
      }
      //LGEAU-378, LGEGMC-3167 END
    }
    //PJTLIMITQTY_EXTEND
    if (limitSaleCondition == "Y") {
      priceArea.find(".purchase-price .vip-price .name").text(limitSaleText);
      priceArea
        .siblings(".price-vip-Installment,.price-pdp-Installment")
        .find(".price-vip")
        .text(limitSaleText);
    }
    if (
      priceArea.closest(".GPC0006").length > 0 ||
      priceArea.closest(".GPC0021").length > 0
    ) {
      // LGCOMMON-54
      if (limitSaleCondition == "Y") {
        priceArea.find(".vip-price").remove();
      } else {
        priceArea.find(".price-vip-Installment").remove();
      }
    }
  }
}

/* LGEKZ-111 Start*/
function fetchVipPrice(countryUnitObsFlag) {
  var url = $(".navigation").data("vip-url");
  if ((url && ISVIP) || (url && countryUnitObsFlag != undefined)) {
    console.log("fetchVipPrice");
    //<#-- PJTMEMBERSHIP-1 START -->
    //PJTMEMBERSHIP-4 조건변경 VIP로그인시 B2C상품에 대해서도 멤버십 텍스트 노출
    /*if(ISVIP){
        	$('.member-point,.member-price,.pre-member-point').hide();
        }*/
    //<#-- PJTMEMBERSHIP-1 END -->
    var models = getAllPrice();

    //PJTPPDPAOB-1 start
    //gpc0009_b2c에서만 에드온번들 사용
    var addOnBundleTargetYn =
      $(".GPC0009") == null || $(".GPC0009").length == 0 ? "N" : "Y";
    var addOnBizType =
      $(".navigation").attr("class").indexOf("b2c") == -1 ? "B2B" : "B2C";
    var addOnBundleModel = "";
    if (addOnBundleTargetYn == "Y" && addOnBizType == "B2C") {
      addOnBundleTargetYn = "Y";
      addOnBundleModel = $(".GPC0009").attr("data-model-id");
    } else {
      addOnBundleTargetYn = "N";
    }
    //PJTPPDPAOB-1 end

    if (models.length > 0) {
      $("body").trigger("ajaxLoadBefore");
      ajax.call(
        url,
        {
          modelList: models,
          addOnBundleTargetYn: addOnBundleTargetYn,
          addOnBundleModel: addOnBundleModel,
        },
        "json",
        function (data) {
          var vipPriceText = data.data[0].productMessages.vipPriceMessage;
          //LGEMS-432 Start
          if (
            COUNTRY_CODE.toLowerCase() == "mx" &&
            "B2B" == $(".navigation").attr("data-obs-group")
          ) {
            vipPriceText = data.data[0].productMessages.b2bVipPriceMessage;
          }
          //LGEMS-432 End
          var previousPriceText =
            data.data[0].productMessages.previousPriceText;
          //PJTLIMITQTY_EXTEND
          var limitSaleTitle = data.data[0].productMessages.limitSaleTitle;
          //PJTPPDPAOB-1 start
          var addOnBundleListHtm = "";
          //PJTPPDPAOB-1 end
          if (data.data[0].productList.length > 0) {
            for (var i = 0; i < data.data[0].productList.length; i++) {
              var p = data.data[0].productList[i];
              var priceOrg = changeFormatFullPrice(p.rPrice, p.rPriceCent);
              var pricePromo = changeFormatFullPrice(
                p.rPromoPrice,
                p.rPromoPriceCent
              );
              //PJTSUMMARY-4 START
              var rDiscountedPrice = changeFormatFullPrice(
                p.rDiscountedPrice,
                p.rDiscountedPriceCent
              );
              var discountedMembershipPriceRate =
                p.discountedMembershipPriceRate;
              var discountedMembersipPrice = changeFormatFullPrice(
                p.discountedMembershipPrice,
                p.discountedMembershipPriceCent
              );
              var obsMembershipPrice = changeFormatFullPrice(
                p.obsMembershipPrice,
                p.obsMembershipPriceCent
              );
              var membershipDisplayFlag = (p.membershipDisplayFlag =
                "Y" && p.rMembershipPrice != null && p.obsMembershipPrice != ""
                  ? "Y"
                  : "N");
              var vipPriceFlag = p.vipPriceFlag;
              var discountPDPMsg = p.discountPDPMsg;
              //PJTSUMMARY-4 END
              //PJTLIMITQTY_EXTEND
              var limitSaleConditionFlag =
                p.vipPriceFlag == "N" &&
                p.obsLimitSale == "Y" &&
                p.limitSaleUseFlag == "Y"
                  ? "Y"
                  : "N";

              // LGEAU-452 START
              if (p.vipPriceFlag == "Y") {
                //PJTMEMBERSHIP-4 조건변경 VIP로그인시 B2C상품에 대해서도 멤버십 텍스트 노출
                if ($(".GPC0009").length > 0) {
                  $(".member-point,.member-price,.pre-member-point").hide();
                }
                $(".products-info[data-model-id=" + p.modelId + "]")
                  .find(".member-text")
                  .hide();
                //PJTMEMBERSHIP-4 조건변경
                var legal =
                  p.discountMsg == null
                    ? ""
                    : p.discountMsg
                        .replace(/&lt;/gi, "<")
                        .replace(/&gt;/gi, ">"); // LGEIS-229 change how discounts are shown
                var target1 = $(
                  ".add-to-cart[data-model-id=" +
                    p.modelId +
                    "] , .re-stock-alert[data-model-id=" +
                    p.modelId +
                    "]"
                )
                  .closest(".button")
                  .siblings(".price-area:not([data-lazyload-vip])"); // LGEPL-697 :: (not data-lazyload-vip) for GPC0102
                var target2 = $(".price-area[data-model-id=" + p.modelId + "]"); // for GPC0012
                var target3 = $(
                  ".add-to-cart[data-model-id=" +
                    p.modelId +
                    "] , .re-stock-alert[data-model-id=" +
                    p.modelId +
                    "]"
                )
                  .closest(".btn-type-box")
                  .siblings(".price-area"); // for GPC0006, GPC0021
                var target4 = $(
                  ".add-to-cart[data-model-id=" +
                    p.modelId +
                    "] , .re-stock-alert[data-model-id=" +
                    p.modelId +
                    "]"
                )
                  .closest(".btn-area")
                  .siblings(".price-area"); // for GPC0082
                var target5 = $(
                  ".add-to-cart[data-model-id=" +
                    p.modelId +
                    "] , .re-stock-alert[data-model-id=" +
                    p.modelId +
                    "]"
                )
                  .closest(".button")
                  .siblings(".price-wt-box")
                  .find(".price-area");
                //QUICKWIN-4_krchoi ADD
                var target6 = $(
                  ".dx-price-area[data-model-id=" + p.modelId + "]"
                ); // for GPC0009 Recommended products modal
                // PJTSUMMARY-4 START
                var target7 = $(".GPC0009.improve")
                  .find(".pdp-info.desktop-info , .pdp-info.mobile-bottom-info")
                  .find(".price-pdp-area[data-model-id=" + p.modelId + "]");
                var target8 = $(".GPC0009.improve")
                  .find(".fixed-price")
                  .find(".price-pdp-inner[data-model-id=" + p.modelId + "]");
                // PJTSUMMARY-4 END
                var target9 = $(".add-to-cart[data-model-id=" + p.modelId + "]")
                  .closest(".pd-btn")
                  .siblings('.pd-info[data-lazyload-vip="getAllPrice"]'); // LGEPL-697 :: for GPC0161

                // LGCOMMON-54 (vipLowestPrice 삭제) Start
                if (target1.length > 0)
                  setVipPrice(
                    target1,
                    priceOrg,
                    pricePromo,
                    legal,
                    vipPriceText,
                    previousPriceText,
                    p.modelId + "/" + "fetchVipPrice",
                    p.emiMsg,
                    p.afterPay,
                    limitSaleConditionFlag,
                    limitSaleTitle
                  );
                if (target2.length > 0)
                  setVipPrice(
                    target2,
                    priceOrg,
                    pricePromo,
                    legal,
                    vipPriceText,
                    previousPriceText,
                    p.modelId + "/" + "fetchVipPrice",
                    p.emiMsg,
                    p.afterPay,
                    limitSaleConditionFlag,
                    limitSaleTitle
                  );
                if (target3.length > 0)
                  setVipPrice(
                    target3,
                    priceOrg,
                    pricePromo,
                    legal,
                    vipPriceText,
                    previousPriceText,
                    p.modelId + "/" + "fetchVipPrice",
                    p.emiMsg,
                    p.afterPay,
                    limitSaleConditionFlag,
                    limitSaleTitle
                  );
                if (target4.length > 0)
                  setVipPrice(
                    target4,
                    priceOrg,
                    pricePromo,
                    legal,
                    vipPriceText,
                    previousPriceText,
                    p.modelId + "/" + "fetchVipPrice",
                    p.emiMsg,
                    p.afterPay,
                    limitSaleConditionFlag,
                    limitSaleTitle
                  );
                if (target5.length > 0)
                  setVipPrice(
                    target5,
                    priceOrg,
                    pricePromo,
                    legal,
                    vipPriceText,
                    previousPriceText,
                    p.modelId + "/" + "fetchVipPrice",
                    p.emiMsg,
                    p.afterPay,
                    limitSaleConditionFlag,
                    limitSaleTitle
                  );
                //QUICKWIN-4_krchoi ADD
                if (target6.length > 0)
                  setVipPrice(
                    target6,
                    priceOrg,
                    pricePromo,
                    legal,
                    vipPriceText,
                    previousPriceText,
                    p.modelId + "/" + "fetchVipPrice",
                    p.emiMsg,
                    p.afterPay,
                    limitSaleConditionFlag,
                    limitSaleTitle
                  );

                // PJTSUMMARY-4, PJTPPDPAOB-1(addonUseFlag 추가) START
                if (target7.length > 0)
                  setVipPriceImprove(
                    target7,
                    priceOrg,
                    pricePromo,
                    rDiscountedPrice,
                    obsMembershipPrice,
                    discountedMembershipPriceRate,
                    discountedMembersipPrice,
                    p.retailerPricingFlag,
                    limitSaleConditionFlag,
                    p.obsInventoryFlag,
                    p.obsProductCount,
                    p.obsGroup,
                    membershipDisplayFlag,
                    p.emiMsg,
                    p.afterPay,
                    p.obsCalculatorUseFlag,
                    p.bizType,
                    p.msrpUseFlag,
                    vipPriceText,
                    vipPriceFlag,
                    discountPDPMsg,
                    p.addOnBundleUseFlag
                  );
                if (target8.length > 0)
                  setVipPriceImprove(
                    target8,
                    priceOrg,
                    pricePromo,
                    rDiscountedPrice,
                    obsMembershipPrice,
                    discountedMembershipPriceRate,
                    discountedMembersipPrice,
                    p.retailerPricingFlag,
                    limitSaleConditionFlag,
                    p.obsInventoryFlag,
                    p.obsProductCount,
                    p.obsGroup,
                    membershipDisplayFlag,
                    p.emiMsg,
                    p.afterPay,
                    p.obsCalculatorUseFlag,
                    p.bizType,
                    p.msrpUseFlag,
                    vipPriceText,
                    vipPriceFlag,
                    discountPDPMsg,
                    p.addOnBundleUseFlag
                  );
                // PJTSUMMARY-4, PJTPPDPAOB-1 END

                if (target9.length > 0)
                  setVipPrice(
                    target9,
                    priceOrg,
                    pricePromo,
                    legal,
                    vipPriceText,
                    previousPriceText,
                    p.modelId + "/" + "fetchVipPrice",
                    p.emiMsg,
                    p.afterPay,
                    limitSaleConditionFlag,
                    limitSaleTitle
                  );
                // LGCOMMON-54 End
              } else if (
                p.vipPriceFlag == "N" &&
                countryUnitObsFlag != undefined
              ) {
                var legal =
                  p.discountMsg == null
                    ? ""
                    : p.discountMsg
                        .replace(/&lt;/gi, "<")
                        .replace(/&gt;/gi, ">");
                var target1 = $(
                  ".add-to-cart[data-model-id=" +
                    p.modelId +
                    "] , .re-stock-alert[data-model-id=" +
                    p.modelId +
                    "]"
                )
                  .closest(".button")
                  .siblings(".price-area");
                var target2 = $(".price-area[data-model-id=" + p.modelId + "]"); // for GPC0012
                var target3 = $(
                  ".add-to-cart[data-model-id=" +
                    p.modelId +
                    "] , .re-stock-alert[data-model-id=" +
                    p.modelId +
                    "]"
                )
                  .closest(".btn-type-box")
                  .siblings(".price-area"); // for GPC0006, GPC0021
                var target4 = $(
                  ".add-to-cart[data-model-id=" +
                    p.modelId +
                    "] , .re-stock-alert[data-model-id=" +
                    p.modelId +
                    "]"
                )
                  .closest(".btn-area")
                  .siblings(".price-area"); // for GPC0082
                var target5 = $(
                  ".add-to-cart[data-model-id=" +
                    p.modelId +
                    "] , .re-stock-alert[data-model-id=" +
                    p.modelId +
                    "]"
                )
                  .closest(".button")
                  .siblings(".price-wt-box")
                  .find(".price-area");
                var target6 = $(
                  ".re-stock-alert[data-model-id=" + p.modelId + "]"
                )
                  .closest(".button")
                  .siblings(".price-wt-box")
                  .find(".price-area");
                //QUICKWIN-4_krchoi ADD
                var target7 = $(
                  ".dx-price-area[data-model-id=" + p.modelId + "]"
                ); // for GPC0009 Recommended products modal
                // PJTSUMMARY-4 START
                var target8 = $(".GPC0009.improve")
                  .find(".pdp-info.desktop-info , .pdp-info.mobile-bottom-info")
                  .find(".price-pdp-area[data-model-id=" + p.modelId + "]");
                var target9 = $(".GPC0009.improve")
                  .find(".fixed-price")
                  .find(".price-pdp-inner[data-model-id=" + p.modelId + "]");
                // PJTSUMMARY-4 END
                if (countryUnitObsFlag == "N") {
                  if (target1.length > 0)
                    priceOrg == 0 && pricePromo == 0
                      ? target1.hide()
                      : setVipPrice(
                          target1,
                          priceOrg,
                          pricePromo,
                          legal,
                          "",
                          "",
                          p.modelId + "/" + "countryUnitObsFlag",
                          p.emiMsg,
                          p.afterPay,
                          limitSaleConditionFlag,
                          limitSaleTitle
                        );
                  if (target2.length > 0)
                    priceOrg == 0 && pricePromo == 0
                      ? target2.hide()
                      : setVipPrice(
                          target2,
                          priceOrg,
                          pricePromo,
                          legal,
                          "",
                          "",
                          p.modelId + "/" + "countryUnitObsFlag",
                          p.emiMsg,
                          p.afterPay,
                          limitSaleConditionFlag,
                          limitSaleTitle
                        );
                  if (target3.length > 0)
                    priceOrg == 0 && pricePromo == 0
                      ? target3.hide()
                      : setVipPrice(
                          target3,
                          priceOrg,
                          pricePromo,
                          legal,
                          "",
                          "",
                          p.modelId + "/" + "countryUnitObsFlag",
                          p.emiMsg,
                          p.afterPay,
                          limitSaleConditionFlag,
                          limitSaleTitle
                        );
                  if (target4.length > 0)
                    priceOrg == 0 && pricePromo == 0
                      ? target4.hide()
                      : setVipPrice(
                          target4,
                          priceOrg,
                          pricePromo,
                          legal,
                          "",
                          "",
                          p.modelId + "/" + "countryUnitObsFlag",
                          p.emiMsg,
                          p.afterPay,
                          limitSaleConditionFlag,
                          limitSaleTitle
                        );
                  if (target5.length > 0)
                    priceOrg == 0 && pricePromo == 0
                      ? target5.hide()
                      : setVipPrice(
                          target5,
                          priceOrg,
                          pricePromo,
                          legal,
                          "",
                          "",
                          p.modelId + "/" + "countryUnitObsFlag",
                          p.emiMsg,
                          p.afterPay,
                          limitSaleConditionFlag,
                          limitSaleTitle
                        );
                  if (target6.length > 0)
                    priceOrg == 0 && pricePromo == 0
                      ? target6.hide()
                      : setVipPrice(
                          target6,
                          priceOrg,
                          pricePromo,
                          legal,
                          "",
                          "",
                          p.modelId + "/" + "countryUnitObsFlag",
                          p.emiMsg,
                          p.afterPay,
                          limitSaleConditionFlag,
                          limitSaleTitle
                        );
                  //QUICKWIN-4_krchoi ADD
                  if (target7.length > 0)
                    priceOrg == 0 && pricePromo == 0
                      ? target7.hide()
                      : setVipPrice(
                          target7,
                          priceOrg,
                          pricePromo,
                          legal,
                          "",
                          "",
                          p.modelId + "/" + "countryUnitObsFlag",
                          p.emiMsg,
                          p.afterPay,
                          limitSaleConditionFlag,
                          limitSaleTitle
                        );

                  // PJTSUMMARY-4, PJTPPDPAOB-1(addonUseFlag 추가), LGCOMMON-54(vipLowestPrice null 인자값 삭제) START
                  if (target8.length > 0)
                    priceOrg == 0 && pricePromo == 0
                      ? target8.hide()
                      : setVipPriceImprove(
                          target8,
                          priceOrg,
                          pricePromo,
                          rDiscountedPrice,
                          obsMembershipPrice,
                          discountedMembershipPriceRate,
                          discountedMembersipPrice,
                          p.retailerPricingFlag,
                          limitSaleConditionFlag,
                          p.obsInventoryFlag,
                          p.obsProductCount,
                          p.obsGroup,
                          membershipDisplayFlag,
                          p.emiMsg,
                          p.afterPay,
                          p.obsCalculatorUseFlag,
                          p.bizType,
                          p.msrpUseFlag,
                          vipPriceText,
                          vipPriceFlag,
                          discountPDPMsg,
                          p.addOnBundleUseFlag
                        );
                  if (target9.length > 0)
                    priceOrg == 0 && pricePromo == 0
                      ? target9.hide()
                      : setVipPriceImprove(
                          target9,
                          priceOrg,
                          pricePromo,
                          rDiscountedPrice,
                          obsMembershipPrice,
                          discountedMembershipPriceRate,
                          discountedMembersipPrice,
                          p.retailerPricingFlag,
                          limitSaleConditionFlag,
                          p.obsInventoryFlag,
                          p.obsProductCount,
                          p.obsGroup,
                          membershipDisplayFlag,
                          p.emiMsg,
                          p.afterPay,
                          p.obsCalculatorUseFlag,
                          p.bizType,
                          p.msrpUseFlag,
                          vipPriceText,
                          vipPriceFlag,
                          discountPDPMsg,
                          p.addOnBundleUseFlag
                        );
                  // PJTSUMMARY-4, PJTPPDPAOB-1, LGCOMMON-54 END
                } else {
                  if (target1.length > 0)
                    priceOrg == 0 && pricePromo == 0
                      ? target1.hide()
                      : setVipPrice(
                          target1,
                          priceOrg,
                          pricePromo,
                          legal,
                          "",
                          previousPriceText,
                          p.modelId + "/" + "countryUnitObsFlag",
                          p.emiMsg,
                          p.afterPay,
                          limitSaleConditionFlag,
                          limitSaleTitle
                        );
                  if (target2.length > 0)
                    priceOrg == 0 && pricePromo == 0
                      ? target2.hide()
                      : setVipPrice(
                          target2,
                          priceOrg,
                          pricePromo,
                          legal,
                          "",
                          previousPriceText,
                          p.modelId + "/" + "countryUnitObsFlag",
                          p.emiMsg,
                          p.afterPay,
                          limitSaleConditionFlag,
                          limitSaleTitle
                        );
                  if (target3.length > 0)
                    priceOrg == 0 && pricePromo == 0
                      ? target3.hide()
                      : setVipPrice(
                          target3,
                          priceOrg,
                          pricePromo,
                          legal,
                          "",
                          previousPriceText,
                          p.modelId + "/" + "countryUnitObsFlag",
                          p.emiMsg,
                          p.afterPay,
                          limitSaleConditionFlag,
                          limitSaleTitle
                        );
                  if (target4.length > 0)
                    priceOrg == 0 && pricePromo == 0
                      ? target4.hide()
                      : setVipPrice(
                          target4,
                          priceOrg,
                          pricePromo,
                          legal,
                          "",
                          previousPriceText,
                          p.modelId + "/" + "countryUnitObsFlag",
                          p.emiMsg,
                          p.afterPay,
                          limitSaleConditionFlag,
                          limitSaleTitle
                        );
                  if (target5.length > 0)
                    priceOrg == 0 && pricePromo == 0
                      ? target5.hide()
                      : setVipPrice(
                          target5,
                          priceOrg,
                          pricePromo,
                          legal,
                          "",
                          "",
                          p.modelId + "/" + "countryUnitObsFlag",
                          p.emiMsg,
                          p.afterPay,
                          limitSaleConditionFlag,
                          limitSaleTitle
                        );
                  if (target6.length > 0)
                    priceOrg == 0 && pricePromo == 0
                      ? target6.hide()
                      : setVipPrice(
                          target6,
                          priceOrg,
                          pricePromo,
                          legal,
                          "",
                          "",
                          p.modelId + "/" + "countryUnitObsFlag",
                          p.emiMsg,
                          p.afterPay,
                          limitSaleConditionFlag,
                          limitSaleTitle
                        );
                  //QUICKWIN-4_krchoi ADD
                  if (target7.length > 0)
                    priceOrg == 0 && pricePromo == 0
                      ? target7.hide()
                      : setVipPrice(
                          target7,
                          priceOrg,
                          pricePromo,
                          legal,
                          "",
                          "",
                          p.modelId + "/" + "countryUnitObsFlag",
                          p.emiMsg,
                          p.afterPay,
                          limitSaleConditionFlag,
                          limitSaleTitle
                        );

                  // PJTSUMMARY-4, PJTPPDPAOB-1(addonUseFlag 추가), LGCOMMON-54(vipLowestPrice null 인자값 삭제) START
                  if (target8.length > 0)
                    priceOrg == 0 && pricePromo == 0
                      ? target8.hide()
                      : setVipPriceImprove(
                          target8,
                          priceOrg,
                          pricePromo,
                          rDiscountedPrice,
                          obsMembershipPrice,
                          discountedMembershipPriceRate,
                          discountedMembersipPrice,
                          p.retailerPricingFlag,
                          limitSaleConditionFlag,
                          p.obsInventoryFlag,
                          p.obsProductCount,
                          p.obsGroup,
                          membershipDisplayFlag,
                          p.emiMsg,
                          p.afterPay,
                          p.obsCalculatorUseFlag,
                          p.bizType,
                          p.msrpUseFlag,
                          vipPriceText,
                          vipPriceFlag,
                          discountPDPMsg,
                          p.addOnBundleUseFlag
                        );
                  if (target9.length > 0)
                    priceOrg == 0 && pricePromo == 0
                      ? target9.hide()
                      : setVipPriceImprove(
                          target9,
                          priceOrg,
                          pricePromo,
                          rDiscountedPrice,
                          obsMembershipPrice,
                          discountedMembershipPriceRate,
                          discountedMembersipPrice,
                          p.retailerPricingFlag,
                          limitSaleConditionFlag,
                          p.obsInventoryFlag,
                          p.obsProductCount,
                          p.obsGroup,
                          membershipDisplayFlag,
                          p.emiMsg,
                          p.afterPay,
                          p.obsCalculatorUseFlag,
                          p.bizType,
                          p.msrpUseFlag,
                          vipPriceText,
                          vipPriceFlag,
                          discountPDPMsg,
                          p.addOnBundleUseFlag
                        );
                  // PJTSUMMARY-4, PJTPPDPAOB-1, LGCOMMON-54 END
                }
              }
              // LGEAU-452 END

              //PJTOBSB2E-3 Start
              var addToCartText = data.data[0].productMessages.addToCartBtnNm;
              var buyNowText = data.data[0].productMessages.buyNowBtnNm;
              var btnLinkTitleText =
                data.data[0].productMessages.btnNewLinkTitle;
              var resellerText = data.data[0].productMessages.resellerBtnNm;
              var productSupportText =
                data.data[0].productMessages.productSupportBtnNm;
              var whereToBuyText = data.data[0].productMessages.whereToBuyBtnNm;
              var preOrderText = data.data[0].productMessages.preOrderBtnNm;
              var obsBuyNowText = data.data[0].productMessages.buyNowBtnNm2; // PJTB2BOBS-1

              //RED btn
              if (p.obsPreOrderFlag == "Y") {
                if (p.obsBuyNowFlag == "Y") {
                  $(".add-to-cart[data-model-id=" + p.modelId + "]")
                    .addClass("active")
                    .data("model-id", p.modelId)
                    .attr("href", p.modelUrlPath)
                    .text(preOrderText)
                    .removeAttr("target, title");
                } else {
                  $(".add-to-cart[data-model-id=" + p.modelId + "]")
                    .addClass("active")
                    .data("model-id", p.modelId)
                    .attr(
                      "data-obs-pre-order-start-date",
                      p.obsPreOrderStartDate
                    )
                    .attr("data-obs-pre-order-end-date", p.obsPreOrderEndDate)
                    .attr("href", "#")
                    .text(preOrderText)
                    .attr("role", "button")
                    .removeAttr("target, title");
                }
              } else if (p.addToCartFlag != "N") {
                if (p.addToCartFlag == "Y") {
                  if (p.obsBuyNowFlag == "Y") {
                    /* LGEAU-522 Start */
                    var btnText = !!$(
                      ".add-to-cart[data-model-id=" + p.modelId + "]"
                    ).parents(".GPC0009").length
                      ? addToCartText
                      : obsBuyNowText;
                    $(".add-to-cart[data-model-id=" + p.modelId + "]")
                      .addClass("active")
                      .data("model-id", p.modelId)
                      .attr("href", p.modelUrlPath)
                      .text(btnText)
                      .removeAttr("target, title"); // PJTB2BOBS-1
                    /* LGEAU-522 End */
                  } else {
                    $(".add-to-cart[data-model-id=" + p.modelId + "]")
                      .addClass("active")
                      .data("model-id", p.modelId)
                      .attr("data-model-sku", p.modelName)
                      .attr(
                        "data-model-salesmodelcode",
                        p.salesModelCode + "." + p.salesSuffixCode
                      )
                      .attr("data-biztype", p.bizType)
                      .attr("data-buname-one", p.buName1)
                      .attr("data-buname-two", p.buName2)
                      .attr("data-buname-three", nvl(p.buName3, "") || "")
                      .attr("data-category-name", p.superCategoryName)
                      .attr(
                        "data-price",
                        nvl(p.rPrice, "") + "." + nvl(p.rPriceCent, "00") || ""
                      )
                      .attr("href", "#")
                      .text(addToCartText)
                      .attr("role", "button")
                      .removeAttr("target, title");
                  }
                } else if (p.addToCartFlag == "S") {
                  $(".add-to-cart[data-model-id=" + p.modelId + "]")
                    .addClass("active")
                    .data("model-id", p.modelId)
                    .attr("data-model-sku", p.modelName)
                    .attr(
                      "data-model-salesmodelcode",
                      p.salesModelCode + "." + p.salesSuffixCode
                    )
                    .attr("data-biztype", p.bizType)
                    .attr("data-buname-one", p.buName1)
                    .attr("data-buname-two", p.buName2)
                    .attr("data-buname-three", nvl(p.buName3, "") || "")
                    .attr("data-category-name", p.superCategoryName)
                    .attr(
                      "data-price",
                      nvl(p.rPrice, "") + "." + nvl(p.rPriceCent, "00") || ""
                    )
                    .attr("href", "#")
                    .text(addToCartText)
                    .attr("role", "button")
                    .removeAttr("target, title");
                }
              } else if (p.buyNowFlag == "Y" || p.buyNowFlag == "L") {
                if (p.eCommerceTarget == "_blank") {
                  $(".add-to-cart[data-model-id=" + p.modelId + "]")
                    .addClass("active")
                    .data("model-id", p.modelId)
                    .attr("href", p.buyNowUrl)
                    .text(buyNowText)
                    .removeAttr("role")
                    .attr("target", "_blank")
                    .attr("title", btnLinkTitleText);
                } else {
                  $(".add-to-cart[data-model-id=" + p.modelId + "]")
                    .addClass("active")
                    .data("model-id", p.modelId)
                    .attr("href", p.buyNowUrl)
                    .text(buyNowText)
                    .removeAttr("role")
                    .removeAttr("target, title");
                }
              } else if (p.resellerBtnFlag == "Y") {
                $(".add-to-cart[data-model-id=" + p.modelId + "]")
                  .addClass("active")
                  .data("model-id", p.modelId)
                  .attr("href", p.resellerLinkUrl)
                  .text(resellerText)
                  .removeAttr("role")
                  .attr("target", "_blank")
                  .attr("title", newLinkTitleText);
              } else if (p.productSupportFlag == "Y") {
                $(".add-to-cart[data-model-id=" + p.modelId + "]")
                  .addClass("active")
                  .data("model-id", p.modelId)
                  .attr("href", p.productSupportUrl)
                  .text(productSupportText)
                  .removeAttr("role")
                  .removeAttr("target, title");
              } else {
                $(".add-to-cart[data-model-id=" + p.modelId + "]").removeClass(
                  "active"
                );
              }
              if (
                countryUnitObsFlag != undefined &&
                countryUnitObsFlag == "N"
              ) {
                if (!p.reStockAlertFlag || p.reStockAlertFlag != "Y") {
                  $(
                    ".re-stock-alert[data-model-id=" + p.modelId + "]"
                  ).remove();
                  $(".products-info[data-model-id=" + p.modelId + "]")
                    .find(".stock-area")
                    .removeClass("out-of-stock")
                    .empty();
                  //QUICKWIN-4_krchoi ADD
                  $(".dx-price-area[data-model-id=" + p.modelId + "]")
                    .find(".stock-area")
                    .removeClass("out-of-stock")
                    .empty();
                }
                $(".add-to-cart[data-model-id=" + p.modelId + "]")
                  .removeClass("active")
                  .remove();
              }

              //WTB btn
              if (
                p.whereToBuyFlag == "Y" &&
                p.whereToBuyUrl != null &&
                p.whereToBuyUrl != ""
              ) {
                $(".add-to-cart[data-model-id=" + p.modelId + "]")
                  .siblings(".where-to-buy")
                  .addClass("active")
                  .attr("href", p.whereToBuyUrl)
                  .text(whereToBuyText);
                $(".add-to-cart[data-model-id=" + p.modelId + "]")
                  .siblings(".where-to-buy")
                  .removeAttr("target, title");
              } else if (
                p.wtbExternalLinkUseFlag == "Y" &&
                p.wtbExternalLinkUrl != null &&
                p.wtbExternalLinkUrl != "" &&
                p.wtbExternalLinkName != null &&
                p.wtbExternalLinkName != ""
              ) {
                //LGEGMC-2202 START
                $(".add-to-cart[data-model-id=" + p.modelId + "]")
                  .siblings(".in-buynow")
                  .addClass("active")
                  .attr("href", p.wtbExternalLinkUrl)
                  .text(p.wtbExternalLinkName)
                  .attr("data-link-name", "buy_now")
                  .removeAttr("data-sc-item");
                if (p.wtbExternalLinkSelfFlag == "Y") {
                  $(".add-to-cart[data-model-id=" + p.modelId + "]")
                    .siblings(".in-buynow")
                    .removeAttr("target, title");
                } else {
                  $(".add-to-cart[data-model-id=" + p.modelId + "]")
                    .siblings(".in-buynow")
                    .attr("target", "_blank")
                    .attr("title", btnLinkTitleText);
                }
                //LGEGMC-2202 START
              } else {
                $(".add-to-cart[data-model-id=" + p.modelId + "]")
                  .siblings(".where-to-buy")
                  .removeClass("active");
              }
              //PJTOBSB2E-3 End
              // PJTLIMITQTY-4
              if ($(".GPC0009").length > 0 && ISVIP && p.vipPriceFlag == "Y") {
                /*$('.GPC0009 #limitTitleAreaVip').show();
							$('.GPC0009 #limitTitleArea').remove();*/
                //PJTLIMITQTY_EXTEND (GPC0021,GPC0006 추가시 모델아이디 혼용 방지)
                if (
                  $(".pdp-sideInfo[data-wish-model-id=" + p.modelId + "]")
                    .length > 0
                ) {
                  $(".GPC0009 .price-vip").show();
                  $(".GPC0009 .price-limited").hide();
                }
              }
              //PJTLIMITQTY_EXTEND
              if (limitSaleConditionFlag == "Y") {
                $(".products-info[data-model-id=" + p.modelId + "]")
                  .find(".price-vip-Installment .price-vip")
                  .text(limitSaleTitle);
                $(".price-area[data-model-id=" + p.modelId + "]")
                  .find(".price-pdp-Installment .price-vip")
                  .text(limitSaleTitle);
              }
            }

            //PJTPPDPAOB-1 START addon 번들
            if ($(".GPC0009").length > 0) {
              if (null != data.data[0].addOnBundleProductList) {
                if (data.data[0].addOnBundleProductList.length > 0) {
                  for (
                    var i = 0;
                    i < data.data[0].addOnBundleProductList.length;
                    i++
                  ) {
                    var p = data.data[0].addOnBundleProductList[i];
                    if (
                      p.addOnBundleUseFlag == "Y" &&
                      (p.addToCartFlag == "Y" || p.obsPreOrderFlag == "Y")
                    ) {
                      var oriPrice = changeFormatFullPriceSync(
                        p.rPrice,
                        p.rPriceCent
                      );
                      var rPrice = p.rPrice;
                      var rPriceCent = p.rPriceCent;
                      var rPromoPrice = p.rPromoPrice;
                      var rPromoPriceCent = p.rPromoPriceCent;
                      var rDiscountedPrice = p.rDiscountedPrice;
                      var rDiscountedPriceCent = p.rDiscountedPriceCent;
                      var rDiscountPrice = p.rDiscountedPrice;
                      var rDiscountPriceCent = p.rDiscountedPriceCent;
                      var disCountPrice = "";
                      var onlySellPriceFlag = "N";

                      if (null == rPromoPrice && null == rPromoPriceCent) {
                        //할인될 금액이 0 , 원가와 판매가가 같을때
                        rPromoPrice = rPrice;
                        rPromoPriceCent = rPriceCent;
                        rPrice = "0";
                        rPriceCent = "0";
                        rDiscountedPrice = "0";
                        rDiscountedPriceCent = "0";
                        onlySellPriceFlag = "Y";
                      } else {
                        disCountPrice = changeFormatFullPriceSync(
                          rDiscountPrice,
                          rDiscountPriceCent
                        );
                      }
                      var disCountedSellingPrice = changeFormatFullPriceSync(
                        rPromoPrice,
                        rPromoPriceCent
                      );

                      html = $("#addOnBundleTemplate").clone().html();
                      html = html
                        .replace(/\*rPrice\*/g, p.rPrice)
                        .replace(/\*modelId\*/g, p.modelId)
                        .replace(/\*rPriceCent\*/g, rPriceCent)
                        .replace(/\*rPromoPrice\*/g, rPromoPrice)
                        .replace(/\*rPromoPriceCent\*/g, rPromoPriceCent)
                        .replace(/\*rDiscountedPrice\*/g, rDiscountedPrice)
                        .replace(
                          /\*rDiscountedPriceCent\*/g,
                          rDiscountedPriceCent
                        )
                        .replace(/\*imgAddr\*/g, p.pdpMainImageAddr)
                        .replace(/\*modelName\*/g, p.modelName)
                        .replace(/\*userFriendlyName\*/g, p.userFriendlyName)
                        .replace(/\*oriPrice\*/g, oriPrice)
                        .replace(/\*discountedPrice\*/g, disCountedSellingPrice)
                        .replace(/\*discountPrice\*/g, disCountPrice)
                        .replace(/\*onlyPrice\*/g, onlySellPriceFlag);
                      addOnBundleListHtm += html;
                    }
                  }
                  $(".add-bundle-area").removeClass("d-none");
                } else {
                  if ($(".price-box-outer .added-price").length > 0) {
                    $(".price-box-outer .added-price").remove();
                  }
                  $(".add-bundle-area").addClass("d-none");
                }
              }
              //PJTPPDPAOB-1 END addon 번들

              //PJTPPDPAOB-1 START addon 번들
              $(".add-bundle-area .bundle-list ul").empty();
              $(".add-bundle-area .bundle-list ul").append(addOnBundleListHtm);
              $(".add-bundle-area .bundle-list ul li").each(function () {
                if (this.getAttribute("data-onlyPrice") == "Y") {
                  $(this).find(".bundle-del,.bundle-save").empty();
                }
              });
              //$('.add-bundle-area').removeClass('d-none');
            }
            //PJTPPDPAOB-1 END addon 번들
          }
        },
        commonSendType,
        $("body")
      );
    }
  }
}
/* LGEKZ-111 Start*/
// PJTOBS-32 End

//LGCOMSM-51 START
/* 현재 obsMembershipPrice 존재 하는 GPC0007,GPC0009 한정 적용 확산 시 다른 영역 추가 예정  */
function fetchInstallmentMember(loginChek) {
  var url =
    "/" +
    COUNTRY_CODE.toLowerCase() +
    "/mkt/ajax/commonmodule/getInstallmentMemberInfo";
  var models = getAllPrice();

  if (loginChek == true) {
    if (models.length > 0) {
      $.ajax({
        type: "post",
        url: url,
        data: { modelList: models },
        dataType: "json",
        success: function (data) {
          if (data.productList.length > 0) {
            for (var i = 0; i < data.productList.length; i++) {
              var p = data.productList[i];

              if (
                data.obsInstallmentMemberFlag == "Y" &&
                p.obsMembershipPrice != null &&
                p.obsMembershipPrice != "" &&
                p.emiMemberMsgText != null &&
                p.emiMemberMsgText != ""
              ) {
                var target1 = $(".add-to-cart[data-model-id=" + p.modelId + "]")
                  .closest(".button")
                  .siblings(".price-area");
                var target2 = $(
                  ".GPC0007 .price-area[data-model-id=" + p.modelId + "]"
                );

                if (target1.length > 0)
                  setInstallmentMember(target1, p.emiMemberMsgText);
                if (target2.length > 0)
                  setInstallmentMember(target2, p.emiMemberMsgText);
              }
            }
          }
        },
        error: function (request, status, error) {
          console.log("error : " + error);
        },
      });
    }
  }
}

function setInstallmentMember(item, emiMemberMsgText) {
  for (var i = 0; i < item.length; i++) {
    var priceArea = item.eq(i);

    if (
      priceArea.siblings(".price-vip-Installment,.price-pdp-Installment")
        .length > 0
    ) {
      priceArea
        .siblings(".price-vip-Installment,.price-pdp-Installment")
        .find(".price-installment, .price-installment-text")
        .html("");
      priceArea
        .siblings(".price-vip-Installment,.price-pdp-Installment")
        .find(".price-installment, .price-installment-text")
        .html(emiMemberMsgText);
    }

    //GPC0082 예외처리
    if (
      priceArea.find(".price-pdp-Installment").length > 0 &&
      priceArea.closest(".GPC0082").length > 0
    ) {
      priceArea
        .find(".price-pdp-Installment")
        .find(".price-installment, .price-installment-text")
        .html("");
      priceArea
        .find(".price-pdp-Installment")
        .find(".price-installment, .price-installment-text")
        .html(emiMemberMsgText);
    }
  }
}
//LGCOMSM-51 END

/* LGEKZ-111 Start*/
obsSelectCountry = function (flag, logincheck) {
  if (!document.querySelector(".obsSelectCountry")) return false;
  var $obsCountry = $(".obsSelectCountry");
  countryUnitObsFlag = flag;
  var obsUnit = {
    cookieName: "LG5_UNIT_OBS_FLAG",
    defaultCountry: $obsCountry.data("defaultCountry"),
    cookieExpiresName: "LG5_UNIT_OBS_EXPIRES",
  };
  var logoutUrl;
  var stateUrl = location.pathname;
  var accFlag = false;
  if (stateUrl.indexOf("/my-lg") > -1 || stateUrl.indexOf("/mylg") > -1) {
    stateUrl = "/" + COUNTRY_CODE.toLowerCase();
    accFlag = true;
  }
  (init = function () {
    var obsCookie = getCookie(obsUnit.cookieName);
    var obsFlag = flag;
    var obsCountry = obsUnitcountry;
    if (logincheck) {
      $(".after-login")
        .find("li")
        .each(function (i) {
          if (
            $(this).find("a").attr("href") != undefined &&
            $(this).find("a").attr("href").indexOf("/logout") > -1
          ) {
            logout = $(this).find("a").attr("href");
            logoutUrl = logout.substring(0, logout.indexOf("?"));
            return logoutUrl;
          }
        });
    }
    if (countryUnitObsFlag == "N") {
      $(".navigation .right-btm").find(".cart").remove();
      $(".navigation .for-mobile .right").find(".cart").remove();
    } else if (countryUnitObsFlag == "Y") {
      $(".navigation .right-btm").find(".cart").removeClass("hide");
      $(".navigation .for-mobile .right").find(".cart").removeClass("hide");
    }
    if (
      $(".obsSelectCountry").find("li a[data-country=" + obsCountry + "]")
        .length > 0 ||
      obsFlag == "Y"
    ) {
      //if(((obsCookie !=null && obsCookie !="")|| obsFlag=='Y') && $obsCountry.length){
      $obsCountry.find("li").removeClass("active").attr("aria-checked", false);
      $obsCountry
        .find("li a[data-country=" + obsCountry + "]")
        .parent()
        .addClass("active")
        .attr("aria-checked", true);
      $("#countryOptionsArea,#countryOptionSelect")
        .find("img")
        .attr(
          "src",
          $obsCountry
            .find("li a[data-country=" + obsCountry + "] img")
            .attr("src")
        );
      $("#countryOptionsArea,#countryOptionSelect")
        .find("img")
        .attr(
          "alt",
          $obsCountry
            .find("li a[data-country=" + obsCountry + "] img")
            .attr("alt")
        );
      $("#countryOptionSelect")
        .find(".flag")
        .after(
          $obsCountry
            .find("li a[data-country=" + obsCountry + "] img")
            .attr("alt")
        );
      $("#countryOptionsArea,#countryOptionSelect").removeClass("hide");
    } else {
      $("#countryOptionsArea,#countryOptionSelect")
        .find("img")
        .attr("src", $obsCountry.find("li.active").find("a img").attr("src"));
      $("#countryOptionsArea,#countryOptionSelect")
        .find("img")
        .attr("alt", $obsCountry.find("li.active").find("a img").attr("alt"));
      $("#countryOptionSelect")
        .find(".flag")
        .after($obsCountry.find("li.active").find("a img").attr("alt"));
      obsSelectCountryPopup();
    }
    /* LGEKZ-103 s*/
    if (countryUnitObsFlag != undefined && countryUnitObsFlag == "N") {
      $(".product-selling-price .product-price").hide();
      $(".GPC0009 .dot-text").addClass("active");
    }
    if (stateUrl.indexOf("/oauth/") >= 0) {
      $obsCountry.remove();
    }
    /* LGEKZ-103 e*/
    addEvent();
  }),
    (addEvent = function () {
      $obsCountry.find("li a").on({
        click: function (e) {
          var _this = e.currentTarget;
          var selectCountry = $(_this).data("country");

          if (
            typeof ePrivacyCookies == "undefined" ||
            ePrivacyCookies.get("LGCOM_IMPROVEMENTS")
          ) {
            var cookieExpires = getCookie(obsUnit.cookieExpiresName);
            var expireDate = new Date();
            var expiredays = parseInt(obsUnitCookieExpires);
            expireDate = new Date(
              parseInt(expireDate.getTime() / 86400000) * 86400000 + 54000000
            );
            if (expireDate > new Date()) {
              expiredays = expiredays - 1;
            }
            expireDate.setDate(expireDate.getDate() + expiredays);
            if (obsUnit.defaultCountry.indexOf(selectCountry) > -1) {
              setCookie(
                obsUnit.cookieName,
                "Y:" + selectCountry + "",
                true,
                cookieExpires == "Y" ? expireDate : ""
              );
              setTimeout(function () {
                location.reload();
              }, 100);
            } else {
              setCookie(
                obsUnit.cookieName,
                "N:" + selectCountry + "",
                true,
                cookieExpires == "Y" ? expireDate : ""
              );
              setTimeout(function () {
                if (logincheck) {
                  location.href = logoutUrl + "?state=" + stateUrl;
                } else {
                  location.reload();
                }
              }, 100);
            }
          } else {
            ePrivacyCookies.view("click");
          }
        },
      });
    }),
    (obsSelectCountryPopup = function () {
      var url = $obsCountry.data("countryPopUrl");
      $("body").trigger("ajaxLoadBefore");
      $.ajax({
        type: "get",
        url: url,
        xhrFields:
          window.location.href.indexOf("/oauth/") !== -1
            ? { withCredentials: true }
            : "",
        dataType: "html",
        success: function (html) {
          $("body").trigger("ajaxLoadEnd");
          $("#modal_choose_your_country").remove();
          $("body").append(html);
          $("#modal_choose_your_country").modal();
          var modalCountry_el = $(".modal-choose-your-country");
          if ($(modalCountry_el).length > 0) {
            $(modalCountry_el)
              .find(".country-options a")
              .on("click", function (e) {
                e.preventDefault();
                var chkCountryChoose = $(this).parent("li").hasClass("active");
                if (!chkCountryChoose) {
                  $(".country-options li")
                    .removeClass("active")
                    .attr("aria-checked", false);
                  $(this)
                    .parent("li")
                    .addClass("active")
                    .attr("aria-checked", true);
                } else {
                  $(this)
                    .parent("li")
                    .removeClass("active")
                    .attr("aria-checked", false);
                }
              });
            $(modalCountry_el).on(
              "click",
              ".modal-footer button",
              function (e) {
                e.preventDefault();
                if (
                  typeof ePrivacyCookies == "undefined" ||
                  ePrivacyCookies.get("LGCOM_IMPROVEMENTS")
                ) {
                  var selectCountry = $(modalCountry_el)
                    .find(".country-options li.active a")
                    .data("country");
                  if (selectCountry == undefined || selectCountry == "") {
                    $(modalCountry_el)
                      .find(".country-options")
                      .addClass("error");
                    return false;
                  } else {
                    $(modalCountry_el)
                      .find(".country-options")
                      .removeClass("error");
                  }
                  if (
                    typeof selectCountry != "undefined" &&
                    selectCountry !== ""
                  ) {
                    var expireDate = new Date();
                    var expiredays = parseInt(obsUnitCookieExpires);
                    if (
                      $(modalCountry_el)
                        .find("#checkNoShowToday")
                        .prop("checked")
                    ) {
                      expireDate = new Date(
                        parseInt(expireDate.getTime() / 86400000) * 86400000 +
                          54000000
                      );
                      if (expireDate > new Date()) {
                        expiredays = expiredays - 1;
                      }
                      expireDate.setDate(expireDate.getDate() + expiredays);
                      setCookie(
                        obsUnit.cookieExpiresName,
                        "Y",
                        true,
                        expireDate
                      );
                    }
                    if (obsUnit.defaultCountry.indexOf(selectCountry) > -1) {
                      setCookie(
                        obsUnit.cookieName,
                        "Y:" + selectCountry + "",
                        true,
                        $(modalCountry_el)
                          .find("#checkNoShowToday")
                          .prop("checked")
                          ? expireDate
                          : ""
                      );
                      setTimeout(function () {
                        location.reload();
                      }, 100);
                    } else {
                      setCookie(
                        obsUnit.cookieName,
                        "N:" + selectCountry + "",
                        true,
                        $(modalCountry_el)
                          .find("#checkNoShowToday")
                          .prop("checked")
                          ? expireDate
                          : ""
                      );
                      setTimeout(function () {
                        if (logincheck) {
                          location.href = logoutUrl + "?state=" + stateUrl;
                        } else {
                          location.reload();
                        }
                      }, 100);
                    }
                  }
                } else {
                  if (
                    $(modalCountry_el).find("#checkNoShowToday").prop("checked")
                  ) {
                    ePrivacyCookies.view("click");
                  }
                }
              }
            );
          }
        },
        error: function (request, status, error) {
          $("body").trigger("ajaxLoadEnd");
          console.log("status: " + status);
          console.log("error: " + error);
        },
      });
    });
  init();
};
/* LGEKZ-111 Start*/

/* LGEITF-604 Start */
var changeFormatPriceSync = function (num) {
  if (num == 0) return 0;
  var reg = /(^[+-]?\d+)(\d{3})/;
  var n = num + "";
  var cc = COUNTRY_CODE.toLowerCase();
  // LGECH-148
  if (countriesUsingTS_BLANK.includes(cc)) {
    while (reg.test(n)) n = n.replace(reg, "$1" + " " + "$2");
  } else if (countriesUsingTS_DOT.includes(cc)) {
    while (reg.test(n)) n = n.replace(reg, "$1" + "." + "$2");
  } else if (countriesUsingTS_NONE.includes(cc)) {
    // do nothing
  } else {
    // Default
    while (reg.test(n)) n = n.replace(reg, "$1" + "," + "$2");
  }
  // LGECH-148 End
  return n;
};
var changeFormatFullPriceSync = function (price, cent) {
  return changeFormatPriceSync(price) + changeFormatPriceCent(cent);
};

// LGEGMC-4167 Start
// common toast timer
const toastTimer = {
  toastName: null,
  timerCloser: null,
  timerOff: false,
  timerId: null,
  init: function (toastName, timerName, timerCloser) {
    const self = this;

    self.toastName = toastName;
    self.timerCloser = timerCloser;

    $(self.toastName).toast("show");
    self.startCount(timerName);
    self.addEvent();
  },
  startCount: function (timerName) {
    const self = this;

    const timer = document.querySelector(timerName);
    let seconds = parseInt(timer.innerText);
    timer.innerText = --seconds;
    if (!self.timerOff && seconds != 0) {
      self.timerId = setTimeout(function () {
        self.startCount(timerName);
      }, 1000);
    } else $(self.toastName).toast("hide");
  },
  hideToast: function () {
    const self = toastTimer;

    clearTimeout(self.timerId);
    self.timerOff = true;
    $(self.toastName).toast("hide");

    // toast popup CTA click event
    if ($(this).is(":not(.btn-close)")) {
      // ThinQ register case
      const thinqReg = thinqRegisterProduct;
      if (sessionStorage.getItem(THINQ_REGISTER_PRODUCT_FLAG) === "Y") {
        if (thinqReg.thinqPopup.length) {
          // common ThinQ Register popup 존재 시에만
          thinqReg.showThinqRegisterPopup();
        } else {
          // OCR Gate 페이지로 이동 ex. acc - my page (index)
          const gateUrl = $(
            'header .for-desktop .after-login [data-menu-name="register-product"] a'
          ).attr("href");
          //PJTTHINQRO-2 start
          const gateUrl2 = $(
            ".mylg-my-Products [data-link-name=register_a_product]"
          ).attr("href");
          if (gateUrl !== undefined) {
            location.href = gateUrl + "?thinq_popup=Y";
          } else if (gateUrl2 !== undefined) {
            location.href = gateUrl2 + "?thinq_popup=Y";
          } else {
            location.href =
              "/" +
              COUNTRY_CODE.toLowerCase() +
              "/support/register-product-gate?thinq_popup=Y";
          }
          //PJTTHINQRO-2 end
        }
      }
    }
  },
  addEvent: function () {
    const self = this;

    // toast popup 요소들은 DOM elements로 존재해야 웹접근성에 위배되지 않는 aria 속성들이 있어서
    // 요소들을 js에서 동적으로 appned 하면 접근성 위배 리스크가 있음으로 jsp 코드에 속해야함
    // => 동적 요소를 고려(이벤트를 document에 바인딩)할 필요 없음 / ex. $(document).on('click ~)
    $(self.timerCloser).click("click touchend", self.hideToast);
  },
};

// thinQ Register
const THINQ_REGISTER_PRODUCT_FLAG =
  COUNTRY_CODE + "_ThinQ_register_product_flag";
const THINQ_PRODUCT_COUNT = COUNTRY_CODE + "_ThinQ_product_count";
const THINQ_GNB_DOT_SWITCH = COUNTRY_CODE + "_ThinQ_gnb_dot_switch"; // whether check new ThinQ info
const THINQ_B2B_NO_COMPANY = COUNTRY_CODE + "_ThinQ_b2b_no_company";

const thinqRegisterProduct = {
  gnbUserIcon: null, // gnb user(logged in) icon
  gnbRegisterMenu: $('nav [data-menu-name="register-product"]'), // 제품등록 메뉴의 부모 li
  gnbRegisterThinqBox: null, // thinQ info box
  mylgProduct: null, // mylg index product
  thinqPopup: null, // thinQ register popup
  thinqPopupListTmp: null, // thinQ register popup list Template
  COUNT_CLASS: [".issue-contents em", ".total em"], // element class name (0:gnb / 1:popup)
  init: function () {
    const self = this;
    self.gnbUserIcon = $("header > .row .icons .login.logged");
    self.gnbRegisterThinqBox = self.gnbRegisterMenu.find(".info-box");
    self.mylgProduct = $(".mylg-my-Products");
    self.thinqPopup = $(".modal-product-register-with-thinq");
    self.thinqPopupListTmp = self.thinqPopup.find("template").clone();
    self.thinqPopup.find("template").remove();
    self.addEvent();
  },
  showGnbMsg: function (count, dot) {
    const self = this;

    sessionStorage.setItem(THINQ_PRODUCT_COUNT, count);
    self.gnbRegisterThinqBox.find(self.COUNT_CLASS[0]).text(count); // template msg code에 ajax count data 적용
    if (dot === "on") {
      // dot effect
      self.gnbUserIcon.addClass("has-dot");
      self.gnbRegisterThinqBox.addClass("has-dot");
      sessionStorage.setItem(THINQ_PRODUCT_COUNT, count); // new registration Or update session
      sessionStorage.setItem(THINQ_GNB_DOT_SWITCH, "on"); // before check new ThinQ info
    }

    self.gnbRegisterThinqBox.show();
  },
  removeDot: function (href) {
    const self = thinqRegisterProduct;

    self.gnbUserIcon.removeClass("has-dot");
    self.gnbRegisterThinqBox.removeClass("has-dot");
    sessionStorage.setItem(THINQ_GNB_DOT_SWITCH, "off");

    if (href !== undefined) window.location.href = href;
  },
  showToastPopup: function () {
    const self = this;

    // set toast class by case
    const TOAST_CLASS = ".thinq-toast"; // modal toast wrapper
    const TOAST_TIMER = TOAST_CLASS + " .carmine"; // timer counter ( .thinq-toast .carmine )
    const TOAST_CLOSER =
      TOAST_CLASS + " .btn-close, " + TOAST_CLASS + " .toast-footer .btn"; // timer closer ( .thinq-toast .btn-close, .thinq-toast .toast-footer a )

    if ($(TOAST_CLASS).length) {
      // customized Or default(6s) timer delay (element dataset)
      const timerDelay =
        Number($(TOAST_CLASS).find(".toast-count").data("toastDelay")) + 1; // add load delay time
      $(TOAST_TIMER).text(timerDelay);

      toastTimer.init(TOAST_CLASS, TOAST_TIMER, TOAST_CLOSER);
    } else
      console.log(
        "[showToastPopup] ThinQ toast/register popup element not ready."
      );
  },
  ajaxLoad: function () {
    $("body").trigger("ajaxLoadBefore");
    $(".loading-circle").attr("style", "z-index:25002");
  },
  exchangeToEntityCode: function (str, glyph, entityCode) {
    const rx = new RegExp(glyph, "g");
    return str.replace(rx, entityCode);
  },
  openedGnbLoginMenu: function () {
    const self = thinqRegisterProduct;
    if ($(self.gnbRegisterMenu[0].closest(".gnb-login")).is(".active"))
      // desktop or tablet
      return true;
    else if (
      $(self.gnbRegisterMenu[1].closest('.sublayer-m[id^="welcome"]')).is(
        ".active"
      )
    )
      // mobile
      return true;
    else return false;
  },
  showThinqRegisterPopup: function () {
    const self = this;

    self.ajaxLoad();

    // set thinQ register popup - product count
    if (self.thinqPopup.length)
      self.thinqPopup
        .find(self.COUNT_CLASS[1])
        .text(sessionStorage.getItem(THINQ_PRODUCT_COUNT));

    // print thinq product list
    const url =
      "/" + COUNTRY_CODE + "/my-lg/api/retrieveThinqRegisterProduct.lgajax";
    const param = "ACCESS_TOKEN=" + sessionStorage.getItem("ACCESS_TOKEN");
    const $productListTarget = self.thinqPopup.find(".register-product-list");
    let template;

    $productListTarget
      .find("li:not(.no-list)")
      .remove()
      .end()
      .find(".no-list")
      .addClass("d-none");

    ajax.noCacheCall(url, param, "json", function (data) {
      if (data && data.result === "success") {
        const productList = data.dataList;
        for (idx in productList) {
          const p = productList[idx];
          const registerMode = p.addeditflag === "Y" ? "add" : "";

          const userFriendlyName = self.exchangeToEntityCode(
            nvl(p.userFriendlyName, ""),
            '"',
            "&quot;"
          );
          const purchaseChannelName = self.exchangeToEntityCode(
            nvl(p.purchaseChannelName, ""),
            '"',
            "&quot;"
          );
          template = self.thinqPopupListTmp.html();

          template = template
            .replace(/\*csModelImagePath\*/g, nvl(p.csModelImagePath, ""))
            .replace(/\*userFriendlyName\*/g, userFriendlyName)
            .replace(/\*csSalesCode\*/g, nvl(p.csSalesCode, ""))
            .replace(/\*serialNo\*/g, nvl(p.serialNo, ""))
            .replace(/\*purchaseDate\*/g, nvl(p.purchaseDate, ""))
            .replace(/\*purchaseChannelName\*/g, purchaseChannelName)
            .replace(/\*thinqRegDate\*/g, nvl(p.thinqRegDate, ""))
            .replace(/\*deviceId\*/g, nvl(p.deviceId, ""))
            .replace(/\*registerMode\*/g, registerMode);

          $productListTarget.append(template);
        }
      } else if (!data)
        console.log("[showThinqRegisterPopup] empty ThinQ product data.");
      else console.log("[showThinqRegisterPopup] " + data.errMsg);
      $("body").trigger("ajaxLoadEnd");
    });

    self.thinqPopup.modal("show");
  },
  addEvent: function () {
    const self = this;

    // info box click event - Remove GNB DOT
    self.gnbRegisterThinqBox.find("a").on("click touchend", function (e) {
      e.preventDefault();
      const href = $(this).attr("href");
      if (sessionStorage.getItem(THINQ_GNB_DOT_SWITCH) === "on")
        self.removeDot(href);
      else window.location.href = href;
    });

    // mylg index - my product desc
    if (self.mylgProduct.length)
      self.mylgProduct
        .find(".text")
        .addClass("d-none")
        .end()
        .find(".thinq")
        .removeClass("d-none");

    // enter no company page after register popup button click event (empty company info)
    // back button click - clear sessionStorage + go to register gate
    if (
      $(".no-company-ocr").length &&
      sessionStorage.getItem(THINQ_B2B_NO_COMPANY) === "Y"
    ) {
      $(".customer-title .previous a").click(function (e) {
        e.preventDefault();
        sessionStorage.removeItem(THINQ_B2B_NO_COMPANY);
        location.href = document.referrer;
      });
    }
  },
};
// LGEGMC-4167 End

let USER_ID; // LGEGMC-3469
function loginCheck() {
  var $nav = $(".navigation");
  if (
    $nav.length > 0 &&
    (window.location.href.indexOf("/oauth/") == -1 ||
      document.querySelector(".obsSelectCountry"))
  ) {
    var loginURL = $nav.eq(0).data("login-check"); /* LGEKZ-111 */
    //var loginURL = '/lg5-common-gp/data-ajax/mkt/loginInfo.json'
    /* LGEGMC-221 Start */
    var loginState = "N";
    _dl.isLogin = loginState;
    /* LGEGMC-221 End */
    if (loginURL) {
      //var token = getCookie('ACCESS_TOKEN');
      //if(token) {
      var scrollToTop = function ($obj) {
        var t = $obj.closest(".navigation").offset().top;
        //console.log(t);
        $("html, body").stop().animate({ scrollTop: t }, 300);
      };
      ajax.call(
        loginURL,
        {},
        "json",
        function (data) {
          //PJTGADL-2
          /* PJTB2BOBS-1 Start */
          if (!!data.user) {
            USER_ID = !!data.user.emailAddr ? data.user.emailAddr : "guest"; // LGEGMC-3469
            if (!!data.user.group) {
              $nav.attr("data-obs-group", data.user.group);
            } else {
              $nav.attr("data-obs-group", "B2C");
            }
          } else {
            $nav.attr("data-obs-group", "B2C");
          }
          /* PJTB2BOBS-1 End */

          //LGEGMC-2639
          if ($(".vip-upgrade-wrap").length > 0) {
            if (!!data.user.group && data.user.group != "B2C") {
              $(".vip-upgrade-wrap").remove();
            }
          }

          //console.log(data);
          /* LGEKZ-111 Start*/
          if (data.obsUnitcountry != undefined) {
            obsUnitcountry = data.obsUnitcountry;
          }
          if (data.countryUnitObsFlag != undefined) {
            obsSelectCountry(data.countryUnitObsFlag, data.loginCheck);
            obsUnitCookieExpires = data.obsUnitCookieExpires;
          }
          /* LGEKZ-111 End*/
          if (data.loginCheck == true) {
            var name = data.user.name;
            /* LGEBR-746 start */
            if (COUNTRY_CODE.toLowerCase() == "br") {
              var name_no_masking = data.user.name_no_masking;
              var name_initial = data.user.name_initial;
            }
            /* LGEBR-746 end */
            /** LGEIS-1185 Start */
            if (COUNTRY_CODE.toLowerCase() == "it") {
              var itGnbLoginName = data.user.itGnbLoginName;
            }
            /** LGEIS-1185 End */
            var snsType = data.snsType;
            _dl.loginType = snsType;
            /* LGEGMC-221 Start*/
            var userId = data.user.emailAddr;

            if (userId != "") {
              loginState = "Y";
              SIGN_IN_STATUS = "Y"; //LGEDE-354
              _dl.uid = SHA256(userId);
              _dl.isLogin = loginState;
            }
            /* LGEGMC-221 End*/

            // LGEGMC-2434 Start
            // vip price 에서 할당하는 customer group의 정의가 OBS 할부계산기 요건과 달라 신규로 loginInfo의 origin data 정의
            // 로그인 시에만 loginInfo의 실제 user.group값 할당
            $nav.attr("data-obs-origin-group", data.user.group);
            // LGEGMC-2434 End

            // PJTOBS-30 Start
            // grade와 coupon이 늦게 로딩되는 경우를 방지하기 위해 ajax 호출을 분리함.
            if (
              $nav.find(".box-obs").length == 0 ||
              data.obsLoginFlag != "Y" ||
              !data.obsGradeCouponAjaxUrl
            ) {
              $nav.find(".box-obs").remove();
            } else {
              // HTML에 .box-obs 가 존재하고, JSON에 data.obsGradeCouponAjaxUrl가 존재하는 경우
              ajax.call(
                data.obsGradeCouponAjaxUrl,
                {},
                "json",
                function (data) {
                  if (
                    data.obsGradeUseFlag != "Y" &&
                    data.obsCouponUseFlag != "Y"
                  ) {
                    $nav.find(".box-obs").remove();
                  } else {
                    // obsGradeUseFlag와 obsCouponUseFlag 중 하나 이상이 Y인 경우
                    var $obsBox = $nav.find(".box-obs");
                    if (data.obsGradeUseFlag == "Y") {
                      $obsBox.find("> a .rate").text(data.customerGnb.grade);
                      $obsBox
                        .find(".box-point .number")
                        .text(data.customerGnb.available_point);
                      if (data.obsCouponUseFlag == "Y") {
                        $obsBox
                          .find(".box-coupon .number")
                          .text(data.customerGnb.coupon_count);
                      } else {
                        $obsBox.find(".box-coupon").remove();
                      }
                    } else {
                      $obsBox.find("> a").remove();
                      $obsBox.find(".box-point").remove();
                      if (data.obsCouponUseFlag == "Y") {
                        $obsBox
                          .find(".box-coupon .number")
                          .text(data.customerGnb.coupon_count);
                      } else {
                        $obsBox.find(".box-coupon").remove();
                      }
                    }
                    $obsBox.addClass("active");
                  }
                },
                commonSendType
              );
            }
            // PJTOBS-30 End

            // PJTOBS-32 Start

            if (
              data.user.group &&
              data.user.group != "B2C" &&
              data.user.group != "" &&
              data.user.group != null
            ) {
              ISVIP = true;
              var url = data.vipPriceAjaxUrl ? data.vipPriceAjaxUrl : "";
              COUNTRY_UNIT_OBS_FLAG =
                data.countryUnitObsFlag != undefined
                  ? data.countryUnitObsFlag
                  : ""; // LGEPL-697
              $(".navigation").data("vip-url", url);
              fetchVipPrice(COUNTRY_UNIT_OBS_FLAG); /* LGEKZ-111, LGEPL-697 */

              if (
                $(".compare-wrap").length == 0 &&
                !!$(".GPC0007").data("ready-vip-load")
              ) {
                $("#categoryFilterForm").trigger("submit");
              }
            } else if (
              data.loginCheck == true &&
              data.obsLoginFlag == "Y" &&
              data.obsInstallmentMemberFlag == "Y" &&
              $(".GPC0007,.GPC0009").length > 0
            ) {
              //LGCOMSM-51 START
              fetchInstallmentMember(data.loginCheck);
              //LGCOMSM-51 END
            }
            // PJTOBS-32 End

            /* LGEGMC-1415 : 20210524 add */
            if (!ISVIP && $(".GPC0026").data("vip-use-flag") == "Y") {
              if (
                $(".GPC0026").data("promotion-index-url") != "" &&
                $(".GPC0026").data("promotion-index-url") !=
                  "component-promotion-index-url"
              ) {
                window.location.href = $(".GPC0026").data(
                  "promotion-index-url"
                );
              } else {
                window.location.href = "/" + COUNTRY_CODE.toLowerCase();
              }
            }
            /*// LGEGMC-1415 : 20210524 add */

            /* PJTPROMOAF-3 add */
            /*if($('.GPC0026').data('member-type') == 'Y' && $('.GPC0026').data('member-group') != 'N'){
							var groupCheck = false;
							if(groupCheck){
								if($('.GPC0026').data('promotion-index-url') != '' && $('.GPC0026').data('promotion-index-url') != 'component-promotion-index-url'){
									window.location.href = $('.GPC0026').data('promotion-index-url'); 
								}else{
									window.location.href = '/'+COUNTRY_CODE.toLowerCase(); 
								}
							}
						}*/
            /* PJTPROMOAF-3 add */

            // desktop
            /* LGEBR-746 start */
            if (COUNTRY_CODE.toLowerCase() == "br") {
              $nav
                .find(".for-desktop .right-btm .login")
                .addClass("logged")
                .find(".after-login .welcome .name")
                .text(name_no_masking);
              $nav.find(".for-desktop .right-btm .icons").addClass("initials");
              $nav
                .find(".for-desktop .right-btm .login>a")
                .append('<em class="word-initial"></em>');
              $nav
                .find(".for-desktop .right-btm .login")
                .find(".word-initial")
                .text(name_initial);
            } else if (COUNTRY_CODE.toLowerCase() == "it") {
            /** LGEIS-1185 Start */
              $nav
                .find(".for-desktop .right-btm .login")
                .addClass("logged")
                .find(".after-login .welcome .name")
                .text(itGnbLoginName);
            } else {
            /** LGEIS-1185 End */
              $nav
                .find(".for-desktop .right-btm .login")
                .addClass("logged")
                .find(".after-login .welcome .name")
                .text(name);
            }
            /* LGEBR-746 end */
            /* LGEIN-1000 Start*/
            if ($("#nameMasking").length == 0) {
              if (
                data.user.firstName != undefined &&
                data.user.firstName != ""
              ) {
                var firstName = data.user.firstName;
                $nav
                  .find(".for-desktop .right-btm .login")
                  .append(
                    $("<input/>", {
                      type: "hidden",
                      id: "nameMasking",
                      value: firstName,
                    })
                  );
              } else {
                $nav
                  .find(".for-desktop .right-btm .login")
                  .append(
                    $("<input/>", {
                      type: "hidden",
                      id: "nameMasking",
                      value: name,
                    })
                  );
              }
            }
            /* LGEIN-1000 End*/
            // mobile
            /** LGEIS-1185 Start */
            if (COUNTRY_CODE.toLowerCase() == "it") {
              $nav
                .find(".for-mobile .menu .mylg .login")
                .addClass("logged")
                .find(".after-login .name")
                .text(itGnbLoginName);
              $nav
                .find(".for-mobile .menu .mylg ")
                .next()
                .find(".welcome .name")
                .text(itGnbLoginName);
            } else {
              $nav
                .find(".for-mobile .menu .mylg .login")
                .addClass("logged")
                .find(".after-login .name")
                .text(name);
              $nav
                .find(".for-mobile .menu .mylg ")
                .next()
                .find(".welcome .name")
                .text(name);
            }
            $nav.find(".for-mobile .nav-wrap .right .login").addClass("logged"); //LGEGMC-777 add
            /** LGEIS-1185 End */

            /* LGEBR-746 start */
            if (COUNTRY_CODE.toLowerCase() == "br") {
              $nav
                .find(".for-mobile .menu .sublayer-m")
                .find(".welcome .name")
                .text(name_no_masking);
              $nav.find(".for-mobile .right .icons").addClass("initials");
              $nav
                .find(".for-mobile .right .login .after-login")
                .append('<em class="word-initial"></em>');
              $nav
                .find(".for-mobile .right .login")
                .find(".after-login .word-initial")
                .text(name_initial);
              $nav
                .find(".for-mobile .menu .mylg ")
                .find(".after-login .name")
                .text(name_no_masking);
            }
            /* LGEBR-746 end */

            // bind click event
            $nav
              .find(
                ".for-mobile .menu .mylg .login.logged,.for-mobile .nav-wrap .right .login.logged"
              )
              .find(">a.after-login")
              .on("click", function (e) {
                e.preventDefault();
                /*LGEGMC-777*/
                if ($(this).parents(".right").length) {
                  $nav.find(".for-mobile .menu>a").trigger("click");
                }
                /*//LGEGMC-777*/
                var targetID = $(this).attr("href").split("#")[1];
                if (targetID && targetID.length > 0) {
                  var $target = $(this)
                    .closest(".navigation")
                    .find("#" + targetID);
                  var $mobileNav = $nav.find(".for-mobile");
                  var $mobileDepth1 = $mobileNav.find(".depth1-m");
                  var $mobileTopMenu = $mobileNav.find(".top-link");
                  var $mobileMyLG = $mobileNav.find(".mylg");
                  $target.addClass("active");
                  $mobileDepth1.removeClass("active");
                  $mobileDepth1.siblings(".language").removeClass("active");
                  $mobileDepth1.siblings(".country").removeClass("active"); // LGEGMC-1473
                  $mobileTopMenu.removeClass("active");
                  $mobileMyLG.removeClass("active");
                  // PJTOBS 20200701 Start
                  $mobileDepth1.siblings(".box-obs").removeClass("active");
                  // PJTOBS 20200701 End
                  /*LGEGMC-777*/
                  if ($(this).parents(".right").length) {
                    $target.find(".back").hide();
                  } else {
                    $target.find(".back").show();
                  }
                  /*//LGEGMC-777*/
                  scrollToTop($(this));
                }
              });
            // page url ? LoginFlag=Y
            var currentUrl = window.location.href;
            if (currentUrl.indexOf("LoginFlag=Y") != -1) {
              adobeSatellite("set_member_id", { member_id: data.user.userId });
              if (history.replaceState) {
                history.replaceState(
                  { login: "login" },
                  "",
                  currentUrl
                    .replace("?LoginFlag=Y", "")
                    .replace("&LoginFlag=Y", "")
                );
              }
            }
            /* LGEKZ-111 Start*/
            if (data.countryUnitObsFlag != undefined) {
              var url = data.vipPriceAjaxUrl ? data.vipPriceAjaxUrl : "";
              $(".navigation").data("vip-url", url);
              fetchVipPrice(data.countryUnitObsFlag);
            }
            /* LGEKZ-111 Start*/

            //LGEGMC-1415 Start
            if (ISVIP) {
              var vipIconCheck =
                document.getElementsByClassName("login logged");
              for (var i = 0; i < vipIconCheck.length; i++) {
                /* PJTB2BOBS-1 Start */
                if (data.user.group == "B2B") {
                  vipIconCheck[i].className += " is-vip-b2b";
                } else {
                  vipIconCheck[i].className += " is-vip";
                }
                /* PJTB2BOBS-1 End */
              }
              if ($(".GPC0045 .unit-box-wrap .vipUser").length > 0) {
                var iconListcheckText = $(".GPC0045").attr("class");
                var iconListcheckLength =
                  parseInt(
                    iconListcheckText.substr(iconListcheckText.length - 1),
                    10
                  ) + 1;
                var resultText =
                  "icn-img" +
                  iconListcheckLength +
                  "s-txt" +
                  iconListcheckLength;
                $(".GPC0045").attr("class", "component GPC0045 " + resultText);
                $(".GPC0045 .unit-box-wrap .vipUser").attr("style", "");
              }
              /* LGEGMC-1415 Start : VIP Promotion Setting */
            }
            //LGEGMC-1415 End

            /* PJTPROMOAF-3 add */
            //obs그룹일때
            if (
              $(".GPC0026").data("promotion-obsGroup") != "" &&
              $(".GPC0026").data("promotion-obsGroup") != null &&
              $(".GPC0026").data("member-type") == "Y"
            ) {
              if (
                $(".navigation").data("obsGroup") !=
                $(".GPC0026").data("promotion-obsGroup")
              ) {
                //obs그룹이 해당 promotion의 설정 그룹과 다를때 팝업 노출
                $("#modal_promotion_obs_group_check").modal("show");
                //닫힐때 이벤트
                $("#promotionObsCheck, #promotionObsCheckClose").on(
                  "click",
                  function () {
                    if (
                      $(".GPC0026").data("promotion-index-url") != "" &&
                      $(".GPC0026").data("promotion-index-url") !=
                        "component-promotion-index-url"
                    ) {
                      window.location.href = $(".GPC0026").data(
                        "promotion-index-url"
                      );
                    } else {
                      window.location.href = "/" + COUNTRY_CODE.toLowerCase();
                    }
                  }
                );
              }
            }
            //vip일때
            if (
              $(".GPC0026").data("vip-use-flag") == "Y" &&
              $(".GPC0026").data("member-type") == "Y"
            ) {
              if (
                $(".GPC0026").data("vip-use-flag") == "Y" &&
                !$(".navigation").find("li").hasClass("is-vip")
              ) {
                //vip가 아닐때 팝업 노출
                $("#modal_promotion_obs_group_check").modal("show");
                //닫힐때 이벤트
                $("#promotionObsCheck, #promotionObsCheckClose").on(
                  "click",
                  function () {
                    if (
                      $(".GPC0026").data("promotion-index-url") != "" &&
                      $(".GPC0026").data("promotion-index-url") !=
                        "component-promotion-index-url"
                    ) {
                      window.location.href = $(".GPC0026").data(
                        "promotion-index-url"
                      );
                    } else {
                      window.location.href = "/" + COUNTRY_CODE.toLowerCase();
                    }
                  }
                );
              }
            }
            /* PJTPROMOAF-3 add */
          } else {
            /* LGEKZ-111 Start*/
            if (data.countryUnitObsFlag != undefined) {
              var url = data.vipPriceAjaxUrl ? data.vipPriceAjaxUrl : "";
              $(".navigation").data("vip-url", url);
              fetchVipPrice(data.countryUnitObsFlag);
            }
            /* LGEKZ-111 Start*/

            /* PJTPROMOAF-3 add */
            if ($(".GPC0026").data("member-type") == "Y") {
              $("#promotionSignCheck").on("click", function () {
                window.location.href =
                  "https://" +
                  window.location.hostname +
                  "/" +
                  COUNTRY_CODE.toLowerCase() +
                  "/my-lg/login?state=" +
                  window.location.pathname;
              });

              $("#promotionReturn, #promotionReturnClose").on(
                "click",
                function () {
                  if (
                    $(".GPC0026").data("promotion-index-url") != "" &&
                    $(".GPC0026").data("promotion-index-url") !=
                      "component-promotion-index-url"
                  ) {
                    window.location.href = $(".GPC0026").data(
                      "promotion-index-url"
                    );
                  } else {
                    window.location.href = "/" + COUNTRY_CODE.toLowerCase();
                  }
                }
              );
              $("#modal_promotion_member_check").modal("show");
            }
            /* PJTPROMOAF-3 add */

            /* LGEGMC-1415 : 20210524 add */
            if ($(".GPC0026").data("vip-use-flag") == "Y") {
              if (
                $(".GPC0026").data("promotion-index-url") != "" &&
                $(".GPC0026").data("promotion-index-url") !=
                  "component-promotion-index-url"
              ) {
                window.location.href = $(".GPC0026").data(
                  "promotion-index-url"
                );
              } else {
                window.location.href = "/" + COUNTRY_CODE.toLowerCase();
              }
            }
            /*// LGEGMC-1415 : 20210524 add */
          }

          // for obs menu
          if (data.obsLoginFlag != "Y" || data.obsLoginFlag != "S") {
            //console.log($nav.find('.obs-menu'));
            $nav.find(".obs-menu").remove();
          }

          //LGEDE-354 start
          if ($(".GPC0007,.GPC0009,.GPC0003,.GPC0004").length > 0) {
            // LGEIS-800
            $(".GPC0007,.GPC0004")
              .find(".tag-content")
              .find('[data-user-type=""]')
              .removeClass("d-none"); // LGEITF-764
            $(".GPC0009")
              .find(".info-top .flag")
              .find('[data-user-type=""]')
              .removeClass("d-none");

            $(".GPC0007,.GPC0004")
              .find(".tag-content")
              .find("[data-user-type=ALL]")
              .removeClass("d-none"); // LGEITF-764
            $(".GPC0009")
              .find(".info-top .flag")
              .find("[data-user-type=ALL]")
              .removeClass("d-none");

            if (SIGN_IN_STATUS == "Y" && ISVIP) {
              $(".GPC0007,.GPC0003,.GPC0004")
                .find(".tag-content")
                .find("[data-user-type=VIP]")
                .removeClass("d-none"); // LGEIS-800
              $(".GPC0009")
                .find(".info-top .flag")
                .find("[data-user-type=VIP]")
                .removeClass("d-none");
              /* LGEDE-422 Start //Non-vip and Non-login */
            } else {
              $(".GPC0007,.GPC0003,.GPC0004")
                .find(".tag-content")
                .find("[data-user-type=NON_VIP]")
                .removeClass("d-none"); // LGEIS-800
              $(".GPC0009")
                .find(".info-top .flag")
                .find("[data-user-type=NON_VIP]")
                .removeClass("d-none");
            }
            /* LGEDE-422 End */
          }
          //LGEDE-354 end
          /* LGEITF-604, LGCOMSPEED-6, PJTCOMPARE-1 Start */
          $(".GPC0009").attr("data-is-vip", ISVIP);
          $(".GPC0007.plp").attr("data-is-vip", ISVIP);
          $(".GPC0004").attr("data-is-vip", ISVIP);
          $(".GPC0003").attr("data-is-vip", ISVIP);
          $(".GPC0058").attr("data-is-vip", ISVIP);
          $(".GPC0026.plp").attr("data-is-vip", ISVIP);
          $(".GPC0082").attr("data-is-vip", ISVIP);
          /* LGEITF-604, LGCOMSPEED-6 End */
          $(".GPC0161").attr("data-is-vip", ISVIP);
          /* LGEITF-604, LGCOMSPEED-6, PJTCOMPARE-1 End */

          // LGEGMC-4167 Start
          const readyThinqRegisterProduct =
            data.thinqRegisterProductUseFlag !== undefined &&
            data.thinqProductCnt !== undefined
              ? true
              : false;
          if (
            readyThinqRegisterProduct &&
            data.thinqRegisterProductUseFlag === "Y" &&
            data.thinqProductCnt > 0
          ) {
            thinqRegisterProduct.init();
            sessionStorage.setItem(
              THINQ_REGISTER_PRODUCT_FLAG,
              data.thinqRegisterProductUseFlag
            );

            // show gnb thinQ info box
            // dot true :
            // 1. 브라우저 세션 내 첫 번째 로드(세션 내 첫번째 로그인 직후)
            // 2. 등록 가능 제품 수 업데이트 시점
            // 3. checkedThinqDot = N
            // 3-1. 이전 페이지에서 새로운 ThinQ 정보(GNB info box) 미확인
            // 3-2. 브라우저 세션 내 재로그인
            const loadedThinqCount =
              sessionStorage.getItem(THINQ_PRODUCT_COUNT);
            const checkedThinqDot =
              document.referrer.indexOf("https://sso") > -1
                ? "on"
                : sessionStorage.getItem(THINQ_GNB_DOT_SWITCH);
            if (
              loadedThinqCount === null ||
              Number(loadedThinqCount) < data.thinqProductCnt ||
              checkedThinqDot === "on"
            )
              thinqRegisterProduct.showGnbMsg(data.thinqProductCnt, "on");
            else thinqRegisterProduct.showGnbMsg(data.thinqProductCnt);

            // OCR gate 페이지가 아닌 타페이지에서
            // thinQ toast popup CTA로 gate 페이지 접근 시, ThinQ register popup 바로 노출
            // Or 단순 진입 시 ThinQ toast popup 노출
            if (getUrlParams()["thinq_popup"] == "Y")
              thinqRegisterProduct.showThinqRegisterPopup();
            else thinqRegisterProduct.showToastPopup();
          }
          // LGEGMC-4167 End
        },
        commonSendType
      );
      //}
    } else {
      /* LGEITF-532, LGEIS-800 Start */
      if ($(".GPC0007,.GPC0009,.GPC0003,.GPC0004").length > 0) {
        $(".GPC0007,.GPC0003,.GPC0004")
          .find(".tag-content")
          .find(
            '[data-user-type=""], [data-user-type=ALL], [data-user-type=NON_VIP]'
          )
          .removeClass("d-none");
        $(".GPC0009")
          .find(".info-top .flag")
          .find(
            '[data-user-type=""], [data-user-type=ALL], [data-user-type=NON_VIP]'
          )
          .removeClass("d-none");
      }
      /* LGEITF-532, LGEIS-800 End */

      /* LGEITF-604, LGCOMSPEED-6, PJTCOMPARE-1 End */
      $(".GPC0009").attr("data-is-vip", ISVIP);
      $(".GPC0007.plp").attr("data-is-vip", ISVIP);
      $(".GPC0004").attr("data-is-vip", ISVIP);
      $(".GPC0003").attr("data-is-vip", ISVIP);
      $(".GPC0058").attr("data-is-vip", ISVIP);
      $(".GPC0026.plp").attr("data-is-vip", ISVIP);
      $(".GPC0082").attr("data-is-vip", ISVIP);
      /* LGEITF-604, LGCOMSPEED-6 End */
      $(".GPC0161").attr("data-is-vip", ISVIP);
      /* LGEITF-604, LGCOMSPEED-6, PJTCOMPARE-1 End */
    }
  }
}

//LGEGMC-221 Start Sha 256 변환 함수
function SHA256(s) {
  var chrsz = 8;
  var hexcase = 0;

  function safe_add(x, y) {
    var lsw = (x & 0xffff) + (y & 0xffff);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }

  function S(X, n) {
    return (X >>> n) | (X << (32 - n));
  }
  function R(X, n) {
    return X >>> n;
  }
  function Ch(x, y, z) {
    return (x & y) ^ (~x & z);
  }
  function Maj(x, y, z) {
    return (x & y) ^ (x & z) ^ (y & z);
  }
  function Sigma0256(x) {
    return S(x, 2) ^ S(x, 13) ^ S(x, 22);
  }
  function Sigma1256(x) {
    return S(x, 6) ^ S(x, 11) ^ S(x, 25);
  }
  function Gamma0256(x) {
    return S(x, 7) ^ S(x, 18) ^ R(x, 3);
  }
  function Gamma1256(x) {
    return S(x, 17) ^ S(x, 19) ^ R(x, 10);
  }

  function core_sha256(m, l) {
    var K = new Array(
      0x428a2f98,
      0x71374491,
      0xb5c0fbcf,
      0xe9b5dba5,
      0x3956c25b,
      0x59f111f1,
      0x923f82a4,
      0xab1c5ed5,
      0xd807aa98,
      0x12835b01,
      0x243185be,
      0x550c7dc3,
      0x72be5d74,
      0x80deb1fe,
      0x9bdc06a7,
      0xc19bf174,
      0xe49b69c1,
      0xefbe4786,
      0xfc19dc6,
      0x240ca1cc,
      0x2de92c6f,
      0x4a7484aa,
      0x5cb0a9dc,
      0x76f988da,
      0x983e5152,
      0xa831c66d,
      0xb00327c8,
      0xbf597fc7,
      0xc6e00bf3,
      0xd5a79147,
      0x6ca6351,
      0x14292967,
      0x27b70a85,
      0x2e1b2138,
      0x4d2c6dfc,
      0x53380d13,
      0x650a7354,
      0x766a0abb,
      0x81c2c92e,
      0x92722c85,
      0xa2bfe8a1,
      0xa81a664b,
      0xc24b8b70,
      0xc76c51a3,
      0xd192e819,
      0xd6990624,
      0xf40e3585,
      0x106aa070,
      0x19a4c116,
      0x1e376c08,
      0x2748774c,
      0x34b0bcb5,
      0x391c0cb3,
      0x4ed8aa4a,
      0x5b9cca4f,
      0x682e6ff3,
      0x748f82ee,
      0x78a5636f,
      0x84c87814,
      0x8cc70208,
      0x90befffa,
      0xa4506ceb,
      0xbef9a3f7,
      0xc67178f2
    );

    var HASH = new Array(
      0x6a09e667,
      0xbb67ae85,
      0x3c6ef372,
      0xa54ff53a,
      0x510e527f,
      0x9b05688c,
      0x1f83d9ab,
      0x5be0cd19
    );

    var W = new Array(64);
    var a, b, c, d, e, f, g, h, i, j;
    var T1, T2;

    m[l >> 5] |= 0x80 << (24 - (l % 32));
    m[(((l + 64) >> 9) << 4) + 15] = l;

    for (var i = 0; i < m.length; i += 16) {
      a = HASH[0];
      b = HASH[1];
      c = HASH[2];
      d = HASH[3];
      e = HASH[4];
      f = HASH[5];
      g = HASH[6];
      h = HASH[7];

      for (var j = 0; j < 64; j++) {
        if (j < 16) W[j] = m[j + i];
        else
          W[j] = safe_add(
            safe_add(
              safe_add(Gamma1256(W[j - 2]), W[j - 7]),
              Gamma0256(W[j - 15])
            ),
            W[j - 16]
          );

        T1 = safe_add(
          safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]),
          W[j]
        );
        T2 = safe_add(Sigma0256(a), Maj(a, b, c));

        h = g;
        g = f;
        f = e;
        e = safe_add(d, T1);
        d = c;
        c = b;
        b = a;
        a = safe_add(T1, T2);
      }

      HASH[0] = safe_add(a, HASH[0]);
      HASH[1] = safe_add(b, HASH[1]);
      HASH[2] = safe_add(c, HASH[2]);
      HASH[3] = safe_add(d, HASH[3]);
      HASH[4] = safe_add(e, HASH[4]);
      HASH[5] = safe_add(f, HASH[5]);
      HASH[6] = safe_add(g, HASH[6]);
      HASH[7] = safe_add(h, HASH[7]);
    }
    return HASH;
  }

  function str2binb(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz) {
      bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - (i % 32));
    }
    return bin;
  }

  function Utf8Encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }

    return utftext;
  }

  function binb2hex(binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
      str +=
        hex_tab.charAt((binarray[i >> 2] >> ((3 - (i % 4)) * 8 + 4)) & 0xf) +
        hex_tab.charAt((binarray[i >> 2] >> ((3 - (i % 4)) * 8)) & 0xf);
    }
    return str;
  }

  s = Utf8Encode(s);
  return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
}
//LGEGMC-221 End Sha 256 변환 함수

// navigation
(function () {
  if (!document.querySelector(".navigation")) return false;

  // navigation
  var $nav = $(".navigation");
  if ($nav.length > 0) {
    // desktop view
    // gnb
    // 202004069 START 박지영 - 태블릿에서 sublayer 링크 클릭시 페이지 이동 안했던 오류 수정
    var $depthLink = $nav.find(".depth1 > li > a, .depth2 > li > a");
    // 202004069 END
    var $scrollBtn = $nav.find(
      ".depth1 .scroll .scroll-left a, .depth1 .scroll .scroll-right a"
    );
    var $icons = $nav.find(".right-btm .icons, .right .icons");
    var $iconBtn = $icons.find(">div>a, >li>a");
    // 20200527 START 박지영 : 불필요한 코드 삭제
    //var $searchInput = $nav.find('.search .search-input input.input');
    // 20200527 END
    var $searchForms = $nav.find(".gnb-search-form");
    var $mobLanguageSelector = $nav.find(".for-mobile").find(".language");
    var $mobCountrySelector = $nav.find(".for-mobile").find(".country"); // LGEGMC-1473
    var isMouseOver = false;

    $searchForms.on("submit", function (e) {
      var searchTxt = $(this).find(".search-input input[type=text]").val();
      $(this)
        .find(".search-input input[type=text]")
        .val(xssfilter(searchTxt, "form"));
      if (searchTxt != xssfilter(searchTxt)) {
        $(this).submit();
      }
    });
    // bind click event
    $depthLink.on("touch click", function (e) {
      if ("ontouchstart" in document.documentElement) {
        e.preventDefault();
        //console.log('test1');
        $(this).trigger("focus");
      } else {
        //console.log('test2');
        return true;
      }
    });
    $depthLink.on("focus mouseenter", function (e) {
      e.preventDefault();
      if ($(this).is($scrollBtn)) return false;
      var _this = $(this);

      isMouseOver = true;
      //setTimeout(function() {
      // 20200421 START 박지영 - 불필요한 스크립트 삭제
      //if(!isMouseOver) return false;
      // 20200421 END

      var $contain = _this.closest("ul"); // depth1 or depth2
      $contain.find("li a").not(_this).removeClass("active");
      _this.addClass("active");

      // close search lyaer
      $nav.find(".search-result-layer").removeClass("active");

      // control right area
      $icons.find(".gnb-login").removeClass("active");

      var $window = $(window).width();

      if ($contain.hasClass("depth1")) {
        // controlArrow
        controlScrollX(
          window.matchMedia("(min-width: 768px) and (max-width: 1325px)")
        ); // 초기 실행
        controlArrow("none");

        // slick
        var dt = 768;
        if (dt < $window) {
          //var target = '#'+_this.attr('href').split('#')[1];
          var target = "#" + _this.data("id");
          if ($(target).find(".slick-slider").length > 0) {
            _this.parent().find(".feature-box").get(0).slick.setPosition();
          }
          if (_this.hasClass("active")) {
            if (
              _this
                .next()
                .find(".slick-dot-wrap .slide-pause")
                .hasClass("pause")
            ) {
              return;
            } else {
              _this
                .next()
                .find(".slick-dot-wrap .slide-pause")
                .trigger("click");
            }
          }
        }
      }

      function isEmpty(el) {
        return !$.trim(el.html());
      }

      if ($contain.hasClass("depth2")) {
        // menu
        $contain
          .closest(".depth1")
          .find(">li")
          .not($contain.closest("li"))
          .find("> a")
          .removeClass("active");
        $contain.closest("li").find("> a").addClass("active");

        // slick
        if (
          !isEmpty(_this.parent().find(".sublayer .sublayer-inner .columns"))
        ) {
          var dt2 = 768;
          if (dt2 < $window) {
            if (_this.parent().find(".feature-box").length > 0) {
              _this.parent().find(".feature-box").get(0).slick.setPosition();
            }
            $nav.find(".depth2").find(".slick-initialized").slick("slickPause");
            $nav
              .find(".depth2")
              .find(".slick-dot-wrap .slide-pause")
              .removeClass("pause")
              .addClass("play")
              .text(_this.attr("data-title-play"));
            if ($nav.find(".slick-dot-wrap .slide-pause").hasClass("pause")) {
              $nav.find(".slick-dot-wrap .slide-pause.pause").trigger("click");
            }
            if (_this.hasClass("active")) {
              if (
                _this
                  .next()
                  .find(".slick-dot-wrap .slide-pause")
                  .hasClass("pause")
              ) {
                //return;
              } else {
                _this
                  .next()
                  .find(".slick-dot-wrap .slide-pause")
                  .trigger("click");
              }
            }
          }
        }
      }
      //}, 100);
    });
    var get2DepthWidth = function () {
      var $obj = $nav.find(".depth2");
      var sumWidth = 0;
      var len = $obj.find(">li").length;
      for (var i = 0; i < len; i++) {
        var sw = parseInt($obj.find(">li").eq(i).outerWidth()); //+ parseInt($obj.find('>li').eq(i).css('margin-left')) + parseInt($obj.find('>li').eq(i).css('margin-right'));
        sumWidth = sumWidth + parseInt(sw);
      }
      return sumWidth;
    };
    // 2depth x-scroll
    $scrollBtn.on("click", function (e) {
      e.preventDefault();
      var currentLeft = $nav.find(".depth2").data("transform");
      var transformLeft = 0;
      if (!currentLeft) currentLeft = 0;

      // 20200601 START 박지영 - GNB RTL 동작 수정
      if ($(this).parent().hasClass("scroll-left")) {
        if (ISRTL) transformLeft = currentLeft + 300;
        else transformLeft = currentLeft - 300;
      } else {
        if (ISRTL) transformLeft = currentLeft - 300;
        else transformLeft = currentLeft + 300;
      }
      // 20200601 END
      if (transformLeft < 0) transformLeft = 0;
      controlArrow(transformLeft);
    });
    // 2depth x-scroll arrow
    var controlArrow = function (num) {
      var w = parseInt($(window).width());
      var ulWidth = w - 30 - 140;
      var $obj = $nav.find(".depth2");
      var sumWidth = get2DepthWidth();
      if (num == "none" && !$obj.data("transform")) {
        // 20200601 START 박지영 - GNB RTL 동작 수정
        if (ISRTL) {
          $obj.siblings(".scroll-right").hide();
          if (ulWidth < sumWidth) {
            $obj.siblings(".scroll-left").show();
          } else {
            $obj.siblings(".scroll-left").hide();
          }
        } else {
          $obj.siblings(".scroll-left").hide();
          if (ulWidth < sumWidth) {
            $obj.siblings(".scroll-right").show();
          } else {
            $obj.siblings(".scroll-right").hide();
          }
        }
        // 20200601 END
      } else if (num != "none") {
        if (num < 0) num = 0;
        // 20200601 START 박지영 - GNB RTL 동작 수정
        if (num > sumWidth - ulWidth) {
          num = sumWidth - ulWidth;
          if (ISRTL) {
            $obj.siblings(".scroll-left").hide();
          } else {
            $obj.siblings(".scroll-right").hide();
          }
        } else {
          if (ISRTL) {
            $obj.siblings(".scroll-left").show();
          } else {
            $obj.siblings(".scroll-right").show();
          }
        }
        if (ISRTL)
          $obj.find("> li > a").css("transform", "translatex(" + num + "px)");
        else
          $obj
            .find("> li > a")
            .css("transform", "translatex(" + num * -1 + "px)");
        $obj.data("transform", num);

        //console.log(num);
        if (ISRTL) {
          if (num > 0) {
            $obj.siblings(".scroll-right").show();
          } else {
            $obj.siblings(".scroll-right").hide();
          }
        } else {
          if (num > 0) {
            $obj.siblings(".scroll-left").show();
          } else {
            $obj.siblings(".scroll-left").hide();
          }
        }
        // 20200601 END
      }
    };
    var controlScrollX = function (e) {
      if (e.matches) {
        var ulWidth = parseInt($(window).width()) - 30 - 140;
        var sumWidth = get2DepthWidth();
        var $obj = $nav.find(".depth2");
        // 20200601 START 박지영 - GNB RTL 동작 수정
        if (!$obj.data("transform")) {
          if (ISRTL) {
            $obj.siblings(".scroll-right").hide();
            if (ulWidth < sumWidth) {
              $obj.siblings(".scroll-left").show();
            } else {
              $obj.siblings(".scroll-left").hide();
            }
          } else {
            $obj.siblings(".scroll-left").hide();
            if (ulWidth < sumWidth) {
              $obj.siblings(".scroll-right").show();
            } else {
              $obj.siblings(".scroll-right").hide();
            }
          }
        }
        // 20200601 END
      } else {
        $nav.find(".scroll-left, .scroll-right").hide();
        $nav.find(".depth2").data("transform", 0);
        $nav.find(".depth2 > li > a").removeAttr("style");
      }
    };
    window
      .matchMedia("(min-width: 768px) and (max-width: 1325px)")
      .addListener(controlScrollX);
    // mouse out
    $nav.on("mouseleave", function (e) {
      e.preventDefault();
      isMouseOver = false;
      var $target = $(e.target);
      // 20200421 START 박지영 - GNB레이어 간혹 안 닫히던 버그 수정 (redmine 6035)
      if (
        $target.hasClass("scroll") ||
        $target.hasClass("depth2") ||
        $target.hasClass("sublayer-inner") ||
        $target.hasClass("sublayer") ||
        $target.hasClass("navi-top") ||
        $target.closest(".sublayer-inner").length > 0
      ) {
        // 20200421 END
        $depthLink.removeClass("active");
      }
      var $window = $(window).width();
      var dt = 768;
      if (dt <= $window) {
        if ($(this).find(".slick-dot-wrap .slide-pause").hasClass("pause")) {
          $(this).find(".slick-dot-wrap .slide-pause.pause").trigger("click");
        }
      }
      //console.log(e.target);
    });
    $nav.find(".navi-top").on("mouseenter", function (e) {
      e.preventDefault();
      isMouseOver = false;
      $depthLink.removeClass("active");
    });
    // right icons and search
    $iconBtn.on("click focus mouseenter", function (e) {
      e.preventDefault();
      var $others = $(this).closest(".icons").find(">div>a, >li>a");
      $others.not($(this)).next("div").removeClass("active");
      if ($(this).next("div").length > 0) {
        if ($(this).parent().hasClass("search") && e.type != "click") {
          return false;
        } else {
          $(this).next("div").addClass("active");
        }
        if ($(this).parent().hasClass("search")) {
          $(this)
            .next(".gnb-search-layer")
            .find(".search-input input.input")
            .focus();
        }
      } else {
        if (e.type == "click") {
          /*LGEGMC-777*/
          if (
            $(this).hasClass("after-login") &&
            $(this).parents(".for-mobile").length
          ) {
            return true;
          } else {
            location.href = $(this).attr("href");
          }
          /*//LGEGMC-777*/
        }
        return true;
      }
      // close menu layer
      if (
        $nav.find(".depth1 > li > a.active, .depth2 li > a.active").length > 0
      ) {
        $nav
          .find(".depth1 > li > a.active, .depth2 li > a.active")
          .removeClass("active");
      }
      // LGEGMC-1473 start
      if ($(this).parent("li").hasClass("country")) {
        $("#countryOptionsArea").attr("aria-expanded", "true");
      } else {
        $("#countryOptionsArea").attr("aria-expanded", "false");
      }
      // LGEGMC-1473 end
    });
    $icons.on("mouseleave", function (e) {
      e.preventDefault();
      //console.log(e.target);
      // 20200527 START 박지영 : 불필요한 변수 삭제로 인한 조건문 수정
      if (!$(e.target).hasClass("login")) {
        // 20200527 END
        var $others = $(this).find(">div>a+div, >li>a+div");
        $others.removeClass("active");
        if ($(e.target).closest(".login").hasClass("has-dot"))
          thinqRegisterProduct.removeDot(); // LGEGMC-4167 :: Remove User Icons dot
      }
      // LGEGMC-1473 start
      $("#countryOptionsArea").attr("aria-expanded", "false");
      // LGEGMC-1473 end
    });
    // 20200527 START 박지영 : 불필요한 코드 삭제
    /*
		$searchInput.off().on('keyup input', function (e) {
			e.preventDefault();

			// close other layer
			$nav.find('.for-desktop .left-btm ul.depth1>li>a.active').removeClass('active');
			$nav.find('.for-desktop .left-btm ul.depth2 li>a').removeClass('active');

			var $searchForm = $(this).closest('.search').find('.gnb-search-form');
			var txt = $(this).val();
			var url = $(this).data('predictive-url');
			var param = $searchForm.serialize();
			if (txt.length >= 1) {
				ajax.call(url, param, 'html', function (data, _this) {
					if (!data || data == '') {
						$searchForm.find('.search-result-layer').removeClass('active').empty();
					} else {
						$searchForm.find('.search-result-layer').addClass('active').html(data);
						$searchForm.find('.search-result-layer').find('.search-layer .enhanced-products ul li .txt a.product').off('click').on('click', function() {
							adobeTrackEvent('gnb-search-product', {search_keyword : $(this).closest('.gnb-search-form').find('.search-input input').val(), page_event : {predictive_search_click : true}});
						});
					}
				});
			} else {
				$searchForm.find('.search-result-layer').removeClass('active').empty();
			}
		});
		*/
    // 20200527 END
    $("body").on("click touchend", function (e) {
      if (!$(e.target).parents(".navigation")[0]) {
        $nav.find(".gnb-search-layer.active").removeClass("active");
      }
    });
    $searchForms.on("click", ".search-result-layer .close", function (e) {
      //$(this).closest('.search').find('.gnb-search-form .search-result-layer').removeClass('active').empty();
      $searchForms.find(".search-submit input.submit").focus();
    });
    $searchForms.find(".search-submit input.submit").on("focus", function (e) {
      $(this)
        .closest(".search")
        .find(".gnb-search-form .search-result-layer")
        .removeClass("active")
        .empty();
    });
    // close sublayer
    $nav.on("click", ".sublayer .close a", function (e) {
      e.preventDefault();
      $(this).closest(".sublayer").parent().find(">a").removeClass("active");
    });

    // feature box
    var featureSlick = function () {
      var $featureObj = $nav.find(".gnb-feature");
      /* LGEIN-554 Start */
      var countryCode = $("html").data("countrycode"),
        slideDirLtr = countryCode == "in" ? true : false;
      /* //LGEIN-554 End */

      $featureObj.each(function () {
        var _this = $(this);
        // 20200512 START 박지영 - gnb > feature product > 1개 초과일때 dot, arrow 출력되지 않도록 수정
        var slickOption = {
          listStyle: true, // WA-Common-Slick
          autoplay: true,
          autoplaySpeed: 5000,
          infinite: slideDirLtr, // WA-Common-Slick, LGEIN-554
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
          dots: true,
          appendDots: $(this).find(".dot-box"),
        };
        if ($(this).find(".feature-box .item").length <= 1) {
          slickOption.arrows = false;
          slickOption.dots = false;
          $(this).find(".feature-box + .slick-dot-wrap").hide();
        }
        $(this).find(".feature-box").slick(slickOption);
        $(this)
          .find(".slide-pause")
          .on("click", function () {
            if ($(this).hasClass("pause")) {
              $(this).removeClass("pause").addClass("play");
              $(this).text($(this).attr("data-title-play"));
              _this.find(".feature-box").slick("slickPause");
            } else {
              $(this).removeClass("play").addClass("pause");
              $(this).text($(this).attr("data-title-stop"));
              _this.find(".feature-box").slick("slickPlay");
            }
          });
        // $(this).find('.slick-dot-wrap .slide-pause').trigger('click');
        // 20200512 END
      });
    };
    featureSlick();

    // mobile view
    var scrollToTop = function ($obj) {
      var t = $obj.closest(".navigation").offset().top;
      //console.log(t);
      $("html, body").stop().animate({ scrollTop: t }, 300);
    };
    // close search layer in mobile view
    $nav
      .find(".gnb-search-layer .search-close a")
      .off("click")
      .on("click", function (e) {
        e.preventDefault();
        $(this).closest(".gnb-search-layer").removeClass("active");
      });
    // bind click event in mobile view
    var $mobileNav = $nav.find(".for-mobile");
    var $mobileMenu = $mobileNav.find(".menu");
    var $mobileDepth1 = $mobileNav.find(".depth1-m");
    var $mobileTopMenu = $mobileNav.find(".top-link");
    var $mobileMyLG = $mobileNav.find(".mylg");
    var $mobileBack = $mobileNav.find(".back");
    //var $mobileLogged = $mobileNav.find('.mylg .login.logged');
    // PJTOBS 20200701 Start
    var $mobileOBSMenu = $mobileNav.find(".menu-wrap > .box-obs"); // menu-wrap 바로 하위의 box-obs
    // PJTOBS 20200701 End
    var $mobileExpand = $mobileNav.find(".depth2-m .expand");
    /* LGEGMC-2856 Start*/
    $mobileNav.find(".depth2-m").each(function () {
      if ($(this).find(".discover").eq(0).hasClass("type2")) {
        $(this).find(".discover").eq(0).addClass("bd-top");
      }
    });
    /* LGEGMC-2856 End*/
    $mobileMenu.find(">a").on("click", function (e) {
      e.preventDefault();
      $("body").toggleClass("m-menu-open"); // LGEGMC-2101
      $(this)
        .parent()
        .toggleClass("open")
        .find(".menu-wrap")
        .toggleClass("active");
      if ($nav.find(".for-mobile").find(".bg-drop").length == 0) {
        $(this).parent().append('<div class="bg-drop"></div>');
      }
      if (
        sessionStorage.getItem(THINQ_REGISTER_PRODUCT_FLAG) === "Y" &&
        thinqRegisterProduct.openedGnbLoginMenu()
      )
        thinqRegisterProduct.removeDot(); // LGEGMC-4167 :: Remove User Icons dot, LGEITF-849

      // active current page
      if ($nav.find(".for-mobile").find(".current-page").length == 1) {
        var $currMenu = $nav.find(".for-mobile").find(".current-page");
        if (
          $currMenu.is(".type2") ||
          $currMenu.closest(".type3").length > 0 ||
          $currMenu.is(".expand")
        ) {
          $currMenu
            .closest(".sublayer-m")
            .addClass("active")
            .siblings()
            .removeClass("active");
          if ($currMenu.closest(".sub").length > 0) {
            $currMenu
              .closest(".sub")
              .prev()
              .addClass("active")
              .siblings()
              .removeClass("active");
          }
        } else if ($currMenu.parent().parent().is(".type1")) {
        }
      } else {
        $mobileDepth1.addClass("active");
        $mobileTopMenu.addClass("active");
        $mobileMyLG.addClass("active");
        $(this).parent().find(".sublayer-m").removeClass("active");
      }

      // PJTOBS 20200714 Start
      toggleOBSLinker();
      // PJTOBS 20200714 End

      scrollToTop($(this));
    });
    $mobileMenu.on("touch click", ".bg-drop", function (e) {
      e.preventDefault();
      $("body").removeClass("m-menu-open"); // LGEGMC-2101
      $mobileMenu.removeClass("open").find(".menu-wrap").removeClass("active");
      if (
        sessionStorage.getItem(THINQ_REGISTER_PRODUCT_FLAG) === "Y" &&
        thinqRegisterProduct.openedGnbLoginMenu()
      )
        thinqRegisterProduct.removeDot(); // LGEGMC-4167 :: Remove User Icons dot, LGEITF-849
      scrollToTop($(this));
    });
    // laguage DOM toggle
    var toggleLanguageLinker = function () {
      if ($mobLanguageSelector.length > 0) {
        if ($mobileDepth1.hasClass("active")) {
          $mobLanguageSelector.addClass("active");
        } else if ($nav.find(".sublayer-m").hasClass("active")) {
          $mobLanguageSelector.removeClass("active");
        }
      }
    };
    // LGEGMC-1473 start
    // country DOM toggle
    var toggleCountryLinker = function () {
      if ($mobCountrySelector.length > 0) {
        if ($mobileDepth1.hasClass("active")) {
          $mobCountrySelector.addClass("active");
        } else if ($nav.find(".sublayer-m").hasClass("active")) {
          $mobCountrySelector.removeClass("active");
        }
      }
    };
    // LGEGMC-1473 end
    // PJTOBS 20200701 Start
    var toggleOBSLinker = function () {
      if ($mobileOBSMenu.length > 0) {
        if ($mobileDepth1.hasClass("active")) {
          /*LGEITF-771 s*/
          if (_dl.isLogin == "Y") {
            $mobileOBSMenu.addClass("active");
          }
          /*LGEITF-771 e*/
        } else if ($nav.find(".sublayer-m").hasClass("active")) {
          $mobileOBSMenu.removeClass("active");
        }
      }
    };
    // PJTOBS 20200701 End
    $mobileDepth1
      .siblings(".language")
      .children("a")
      .on("click", function (e) {
        e.preventDefault();
        var $target = $("#langOptions");
        $mobileDepth1.removeClass("active");
        $mobileTopMenu.removeClass("active");
        $mobileMyLG.removeClass("active");
        $target.addClass("active");
        toggleLanguageLinker();
        // PJTOBS 20200701 Start
        toggleOBSLinker();
        // PJTOBS 20200701 End
        toggleCountryLinker(); //LGEGMC-1473
        scrollToTop($(this));
      });
    // LGEGMC-1473 start
    $mobileDepth1
      .siblings(".country")
      .find("a")
      .on("click", function (e) {
        e.preventDefault();
        if (window.location.href.indexOf("/oauth/") == -1) {
          var $target = $("#countryOptions");
          $mobileDepth1.removeClass("active");
          $mobileTopMenu.removeClass("active");
          $mobileMyLG.removeClass("active");
          $target.addClass("active");
          toggleLanguageLinker();
          toggleOBSLinker();
          toggleCountryLinker(); //LGEGMC-1473
          scrollToTop($(this));
        }
      });

    // LGEGMC-1473 end
    // category menu toggle
    $mobileDepth1.find(">li>a").on("click", function (e) {
      e.preventDefault();
      var url = $(this).attr("href");
      var targetID = url.split("#")[1];
      if (targetID && targetID.length > 0) {
        var $target = $("#" + targetID);
        if ($target.length > 0) {
          $mobileDepth1.removeClass("active");
          $mobileTopMenu.removeClass("active");
          $mobileMyLG.removeClass("active");
          $target.addClass("active");
          // LGEGMC-2101 Start
          if ($target.find(".slick-slider").length > 0) {
            $target.find(".feature-box").get(0).slick.setPosition();
            if (
              $target.find(".slick-dot-wrap .slide-pause").hasClass("pause")
            ) {
              return;
            } else {
              $target.find(".slick-dot-wrap .slide-pause").trigger("click");
            }

            // mobile depth2-m > featured slick slide > font style - none block bug issue
            var $featuredBox = $target.find(".featured-product");
            $featuredBox.find(".slick-track").attr("style", "width:270px");
            $featuredBox
              .find(".slick-current.slick-active")
              .attr("style", "width:270px");
          }
          // LGEGMC-2101 End
          toggleLanguageLinker();
          // PJTOBS 20200701 Start
          toggleOBSLinker();
          // PJTOBS 20200701 End
          toggleCountryLinker(); //LGEGMC-1473
          scrollToTop($(this));
        } else {
          if ($(this).attr("target") && $(this).attr("target") == "_blank") {
            window.open(url);
          } else {
            window.location.href = url;
          }
        }
      } else {
        if ($(this).attr("target") && $(this).attr("target") == "_blank") {
          window.open(url);
        } else {
          window.location.href = url;
        }
      }
    });
    $mobileBack.find(">a").on("click", function (e) {
      e.preventDefault();
      $mobileDepth1.addClass("active");
      $mobileTopMenu.addClass("active");
      $mobileMyLG.addClass("active");
      if (
        sessionStorage.getItem(THINQ_REGISTER_PRODUCT_FLAG) === "Y" &&
        thinqRegisterProduct.openedGnbLoginMenu()
      )
        thinqRegisterProduct.removeDot(); // LGEGMC-4167 :: Remove User Icons dot, LGEITF-849
      $(this).closest(".sublayer-m").removeClass("active");
      toggleLanguageLinker();
      // PJTOBS 20200701 Start
      toggleOBSLinker();
      // PJTOBS 20200701 End
      toggleCountryLinker(); //LGEGMC-1473
      scrollToTop($(this));
    });
    $mobileExpand.find(">a").on("click", function (e) {
      e.preventDefault();
      $(this).parent().toggleClass("active");
    });
    loginCheck();

    // navSearch
    var navSearch = function () {
      var root_node = document.getElementById("navigation_search");
      if (!root_node) {
        return false;
      }
      var $navSearchWindow = $(root_node);
      var p = navSearch.prototype;
      var bizType = $nav && $nav.hasClass("b2b") ? "B2B" : "B2C"; //PJTGLONEW-1 add

      p.cookieName =
        $nav && $nav.hasClass("b2b")
          ? "LG5_B2B_SearchResult"
          : "LG5_SearchResult";
      p.elements = {
        keeping: function () {
          // static view
          // this.$pre_keyword = $navSearchWindow.find(".pre-keyword");
          this.$navSearchForm = $navSearchWindow.find("#navigationSearchForm");
          this.$searchInputField = this.$navSearchForm.find(".input-field");
          this.$useInputKeyword = this.$navSearchForm.find("#useInputKeyword");
          this.$btnSearchSubmit = this.$navSearchForm.find("#searchByKeyword");
          this.$autoSearchArea = this.$navSearchForm.find(".autoName-area");
          this.$autoNameBox = this.$navSearchForm.find(".autoName-box");
          this.$autoSearchList = this.$autoSearchArea.find(".autoName-list");
          this.$matchedModelArea = this.$navSearchForm.find(".success-seacrh");
          this.$modelBtnArea = this.$matchedModelArea.find(".btn-area");
          // dynamic view
          // primary
          this.$primaryView = $navSearchWindow.find(".keyword-field");
          this.$rollingArea = this.$primaryView.find(".rolling-keyword-area");
          this.$rollingBelt = this.$primaryView.find(".rolling-keyword-group");
          this.$recentlyList = this.$primaryView.find(".recenlty-keyword-list");
          this.$mostSearchedGroup = this.$primaryView.find(
            ".most-searched-board"
          );
          // secondary
          this.$secondaryView = $navSearchWindow.find(".result-area");
          this.$matchProductList = this.$secondaryView.find(
            ".match-product-list"
          );
          this.$categorizedList = this.$secondaryView.find(
            ".categorized-results-list"
          );
          this.$similarMapping = $navSearchWindow.find(".similar-mapping");
          // 2022.02.18 see all results 삭제
          // this.$seeAllResults = this.$secondaryView.find('.match-keyword-count');
        },
      };
      p.searchContents = {
        url: $(root_node).data("child-html"),
        param: { bizType },
        type: "html",
        action: function (response) {
          $navSearchWindow.html(response);
          //p.init();
          p.elements.keeping();
          p.view__preset();
          //p.event__navSearchWindow_open();
          p.event__navSearchWindow_close();
          p.event__inputField();
          p.event__clear();
          p.event__resize();
          p.event__submit();
          p.event__submit_trigger();
          p.event_autoClick_trigger();
          p.floatingWindow(true);
          p.view__active();

          if (typeof scrollDesign == "function") scrollDesign();
          // $navSearchWindow.attr('tabindex', 0).focus();
          /* LGECI-318 s*/
          // if(COUNTRY_CODE.toLowerCase() == 'ca_en'||COUNTRY_CODE.toLowerCase() == 'ca_fr'){
          // 	p.elements.$useInputKeyword.focus();
          // }
          /* LGECI-318 e*/
          //$('#useInputKeyword').focus();

          // PJTQUICKWIN - focus input after ajax call
          // 검색 아이콘 클릭 시, fakeInputFocus를 임의 생성후,
          // focus 하고 있다가 ajax 호출 후 아래 코드로
          // focus를 실제 사용할 검색 input으로 옮겨줍니다.
          // 이렇게 해야 모바일 브라우저에서 키보드가
          // 정상적으로 올라옵니다.
          // 용도가 다한 fakeInputFocus는 지워줍니다.
          $("#useInputKeyword").attr("autofocus", "autofocus").focus();
          $("#fakeInputFocus").remove();
        },
        call: function () {
          $.ajax({
            type: "post",
            //async: false,
            url: this.url,
            dataType: this.type,
            data: xssfilter(this.param),
            xhrFields: {
              withCredentials: true,
            },
            success: function (d) {
              p.searchContents.action(d);
            },
            error: function (request, status, error) {
              console.log("status: " + status);
              console.log("error: " + error);
            },
          });
          /*
					ajax.call(
						this.url,
						this.param,
						this.type,
						this.action,
						'',
						'body'
					);
					*/
        },
      };
      p.searchResults = {
        templetes: {
          matchProduct: "htmlString",
          category: "htmlString",
          autoData: "htmlString", //PJTSEARCH-1 add
          matchedData: "htmlString", //PJTSEARCH-1 add
          typingError: "htmlString", // PJTQUICKWIN add
        },
        url: null,
        param: {},
        type: "json",
        action: function (response) {
          // variable
          var searchValue = xssfilter(p.elements.$useInputKeyword.val());

          //PJTSEARCH-1 start
          // 2022.02.18 search input 수정 start
          var isPartialMatched =
            response.data != null && 0 < Object.keys(response.data).length;
          if (isPartialMatched) {
            var autoList = "";

            var autoDataResult = function () {
              // product
              if (response.data.products !== undefined) {
                var productDataSets = response.data.products;
                var productDataLength = productDataSets.length;

                // if(productDataLength > 2){
                // 	productDataLength = 2;
                // }

                for (var i = 0; i < productDataLength; i++) {
                  var data = productDataSets[i];
                  var autoKeyword = "";
                  if (data.userFriendlyName != null) {
                    autoKeyword = data.userFriendlyName;
                    var matchText = autoKeyword.match(
                      new RegExp(searchValue, "i")
                    );
                    autoKeyword = autoKeyword.replace(
                      matchText,
                      "<span>" + matchText + "</span>"
                    );
                  }
                  var exposeItem = p.searchResults.templetes.autoData
                    .replace(/\*autoDataName\*/g, autoKeyword)
                    .replace(/\*autoDataUrl\*/g, data.modelUrlPath)
                    .replace(/\*target\*/g, "_self")
                    .replace(/\*type\*/g, "product");
                  autoList += exposeItem;
                }
              }

              // support
              if (response.data.support !== undefined) {
                var supArr = response.data.support;
                var supArrLength = supArr.length;
                for (var i = 0; i < supArrLength; i++) {
                  var data = supArr[i];
                  // var supType = "support type-" + data.flag;
                  var autoKeyword;
                  if (
                    data.flag.toLowerCase() == "manual" ||
                    data.flag.toLowerCase() == "software"
                  ) {
                    autoKeyword = data.csSalesCode;
                  } else {
                    autoKeyword = data.itemTitleName;
                  }
                  var supportType = data.flagText;
                  var matchText = autoKeyword.match(
                    new RegExp(searchValue, "i")
                  );
                  autoKeyword = autoKeyword.replace(
                    matchText,
                    "<span>" + matchText + "</span>"
                  );
                  var supResult = p.searchResults.templetes.autoData
                    .replace(
                      /\*autoDataName\*/g,
                      autoKeyword +
                        '<span class="support-type-flag">' +
                        supportType +
                        "</span>"
                    )
                    .replace(/\*autoDataUrl\*/g, data.link)
                    .replace(/\*target\*/g, "_self")
                    .replace(/\*type\*/g, "support");
                  autoList += supResult;
                }
              }

              // page
              if (response.autoData !== undefined) {
                var autoArr = response.autoData.autoArr;
                var autoArrLength = autoArr.length;
                for (var i = 0; i < autoArrLength; i++) {
                  var data = autoArr[i];
                  var target = "";
                  if (data.linkTarget == 0) {
                    target = "_self";
                  } else {
                    target = "_blank";
                  }
                  var autoKeyword = data.sitemapName;
                  // var regex = new RegExp(searchValue,"g");
                  var matchText = autoKeyword.match(
                    new RegExp(searchValue, "i")
                  );
                  autoKeyword = autoKeyword.replace(
                    matchText,
                    "<span>" + matchText + "</span>"
                  );
                  if (i == 0) {
                    var sitemapName = data.sitemapName;
                    if (
                      sitemapName.toLowerCase() == searchValue.toLowerCase()
                    ) {
                      $("#searchByKeyword").attr("auto-url", data.linkPath);
                    } else {
                      if ($("#searchByKeyword").attr("auto-url") != undefined) {
                        $("#searchByKeyword").removeAttr("auto-url");
                      }
                    }
                  }
                  var autoResult = p.searchResults.templetes.autoData
                    .replace(/\*autoDataName\*/g, autoKeyword)
                    .replace(/\*autoDataUrl\*/g, data.linkPath)
                    .replace(/\*target\*/g, target)
                    .replace(/\*type\*/g, "page");
                  autoList += autoResult;
                }
              }

              // category
              if (response.data.categories !== undefined) {
                var categories = response.data.categories;
                var categoryLength = categories.length;

                for (var i = 0; i < categoryLength; i++) {
                  var data = categories[i];
                  var queryFactor = "?";
                  if (data.resultPageUrl.indexOf("?") >= 0) {
                    queryFactor = "&";
                  }
                  var category = p.searchResults.templetes.category
                    .replace(/\*title\*/g, data.categoryName)
                    .replace(/\*count\*/g, data.matchCount)
                    .replace(
                      /\*resultPageUrl\*/g,
                      data.resultPageUrl + queryFactor + "search=" + searchValue
                    );
                  autoList += category;
                }
              }

              // finish off
              p.elements.$autoSearchList.html(autoList);
              // p.elements.$autoNameBox.mCustomScrollbar("update");
            };

            p.elements.$autoSearchArea.addClass("active");
            autoDataResult();
          }

          var isCompletelyMatched =
            response.matchedData != null &&
            0 < Object.keys(response.matchedData).length;
          if (isCompletelyMatched) {
            var data = response.matchedData;
            var recommendedData = response.matchedData.recommendList; //LGEVN-694
            var matchedFlag = data.matchedModelFlag;
            var landingPageFlag = data.landingPageFlag;
            var matchedResult = "";
            var locale = data.locale;
            // var atcActive = "";
            // var wtbActive = "";
            // var iqActive = "";
            // var ftdActive = "";

            // //버튼 area check
            // if(data.addToCartBtnFlag == 'Y'){
            // 	atcActive = "active";
            // }

            // if(data.wtbBtnFlag == 'Y'){
            // 	wtbActive = "active";
            // }

            // if(data.inquiryBtnFlag == 'Y'){
            // 	iqActive = "active";
            // }

            // if(data.findTheDealerBtnFlag == 'Y'){
            // 	//ftdActive = "active";
            // }

            // support 영역 check
            var manualTag = "";
            var softwareTag = "";
            var requestRepairTag = "";
            var registerProductTag = "";
            //LGETW-537 Start
            if (
              data.manualUrl != undefined &&
              data.manualUrl != null &&
              data.manualUrl != ""
            ) {
              manualTag =
                "<li><a href='" +
                data.manualUrl +
                "'><img src='" +
                data.serverName +
                "/lg5-common-gp/images/common/icons/search-manual.svg' alt='Manuals' aria-hidden='true'/><span>" +
                data.manualText +
                "</span></a></li>";
            }

            if (
              data.softwareUrl != undefined &&
              data.softwareUrl != null &&
              data.softwareUrl != ""
            ) {
              softwareTag =
                "<li><a href='" +
                data.softwareUrl +
                "'><img src='" +
                data.serverName +
                "/lg5-common-gp/images/common/icons/search-software.svg' alt='Software Drivers' aria-hidden='true'/><span>" +
                data.softwareText +
                "</span></a></li>";
            }

            if (
              data.requestaRepairUrl != undefined &&
              data.requestaRepairUrl != null &&
              data.requestaRepairUrl != ""
            ) {
              requestRepairTag =
                "<li><a href='" +
                data.requestaRepairUrl +
                "'><img src='" +
                data.serverName +
                "/lg5-common-gp/images/common/icons/search-repair.svg' alt='Request Repair' aria-hidden='true'/><span>" +
                data.requestaRepairText +
                "</span></a></li>";
            }

            var registeraProductUrl = "";
            if (_dl.isLogin == "Y" && data.registeraProductUrl != "") {
              registeraProductUrl = data.registeraProductUrl;
            } else if (_dl.isLogin != "Y" && data.registeraProductUrl != "") {
              registeraProductUrl =
                "/" +
                _dl.country_code +
                "/mylg/login?state=" +
                data.registeraProductUrl;
            }

            if (registeraProductUrl != "") {
              // LGEUA-295
              registerProductTag =
                "<li><a href='" +
                registeraProductUrl +
                "'><img src='" +
                data.serverName +
                "/lg5-common-gp/images/common/icons/search-register.svg' alt='Register a Product' aria-hidden='true'/><span>" +
                data.registeraProductText +
                "</span></a></li>";
            }
            //LGETW-537 End
            if (matchedFlag == "Y") {
              matchedResult = p.searchResults.templetes.matchedData
                .replace(
                  /\*imageAltText\*/g,
                  data.imageAltText != null ? data.imageAltText : ""
                )
                .replace(/\*mediumImageAddr\*/g, data.mediumImageAddr)
                .replace(/\*modelId\*/g, data.modelId)
                .replace(/\*modelUrlPath\*/g, data.modelUrlPath)
                .replace(/\*modelName\*/g, data.modelName)
                .replace(
                  /\*userFriendlyName\*/g,
                  data.userFriendlyName == null
                    ? ""
                    : data.userFriendlyName.replace(/\"/g, "''")
                )
                // .replace(/\*modelYear\*/g, data.modelYear) /* LGEGMC-1279 : 2021.03.12 add */
                // .replace(/\*buName1\*/g, data.buName1)
                // .replace(/\*buName2\*/g, data.buName2)
                // .replace(/\*buName3\*/g, nvl(data.buName3,''))
                // .replace(/\*superCategoryName\*/g, data.superCategoryName)
                // .replace(/\*bizType\*/g, data.bizType)
                // .replace(/\*priceValue\*/g, (nvl(data.obsSellingPrice,'') || ''))
                // .replace(/\*salesModelCode\*/g, data.salesModelCode)
                // .replace(/\*salesSuffixCode\*/g, data.salesSuffixCode)
                // .replace(/\*addToCartBtnFlag\*/g, data.addToCartBtnFlag)
                // .replace(/\*addToCartBtnMsg\*/g, data.addToCartBtnMsg)
                // .replace(/\*wtbBtnFlag\*/g, data.wtbBtnFlag)
                // .replace(/\*wtbBtnMsg\*/g, data.wtbBtnMsg)
                // .replace(/\*findTheDealerBtnFlag\*/g, data.findTheDealerBtnFlag)
                // .replace(/\*findTheDealerBtnMsg\*/g, data.findTheDealerBtnMsg)
                // .replace(/\*inquiryBtnFlag\*/g, data.inquiryBtnFlag)
                // .replace(/\*inquiryBtnMsg\*/g, data.inquiryBtnMsg)
                // .replace(/\*addToCartUrl\*/g, data.addToCartUrl)
                // .replace(/\*inquiryToBuyUrl\*/g, data.inquiryToBuyUrl)
                // .replace(/\*whereToBuyUrl\*/g, data.whereToBuyUrl)
                // .replace(/\*findTheDealerUrl\*/g, data.findTheDealerUrl)
                // .replace(/\*atcActive\*/g, atcActive)
                // .replace(/\*wtbActive\*/g, wtbActive)
                // .replace(/\*iqActive\*/g, iqActive)
                // .replace(/\*ftdActive\*/g, ftdActive)
                .replace(/\*manualTag\*/g, manualTag)
                .replace(/\*softwareTag\*/g, softwareTag)
                .replace(/\*requestRepairTag\*/g, requestRepairTag)
                .replace(/\*registerProductTag\*/g, registerProductTag)
                .replace(/\*pspUrl\*/g, data.pspLink);

              p.elements.$matchedModelArea.html(matchedResult);
              //LGEVN-694
              var recommendHtml = "";
              var bundleListHtml = "";
              var resultType = "";
              var bundleData = "";

              if (locale == "VN") {
                if (0 < recommendedData.length) {
                  for (var i = 0; i < recommendedData.length; i++) {
                    bundleData = recommendedData[i];
                    resultType = bundleData.modelType;
                    bundleListHtml += '<div class="item">';
                    bundleListHtml +=
                      '	<a class="product-recommend" href="' +
                      bundleData.modelUrlPath +
                      '">';
                    bundleListHtml += '		<div class="model-image">';
                    bundleListHtml +=
                      '			<img class=" lazyloaded" data-src="' +
                      bundleData.mediumImageAddr +
                      '" alt="' +
                      bundleData.imageAltText +
                      '" src="' +
                      bundleData.mediumImageAddr +
                      '">';
                    bundleListHtml += "		</div>";
                    bundleListHtml += '		<div class="model-name-box">';
                    bundleListHtml +=
                      '			<div class="model-friendly-name">' +
                      bundleData.userFriendlyName +
                      "</div>";
                    bundleListHtml +=
                      '			<div class="model-display-name">' +
                      bundleData.modelName +
                      "</div>";
                    bundleListHtml += "		</div>";
                    bundleListHtml += "	</a>";
                    bundleListHtml += "</div>";
                  }

                  if (resultType == "O" || resultType == "B") {
                    recommendHtml +=
                      '<div class="title">Bundled products</div>';
                    recommendHtml += '<div class="items">';
                    recommendHtml += bundleListHtml;
                    recommendHtml += "</div>";
                    recommendHtml += "</div>";
                  } else {
                    //상품인경우
                    $(".model-link-etc").remove();
                    recommendHtml +=
                      '<div class="title">Bundled products</div>';
                    recommendHtml += '<div class="items">';
                    recommendHtml += bundleListHtml;
                    recommendHtml += "</div>";
                    recommendHtml += "</div>";
                  }

                  $(".product-recommend-wrap").append(recommendHtml);

                  $(document).ready(function () {
                    // page : Inquiry To Buy slick
                    // pick a topic
                    // BTOBGLOBAL-245 해당 부분에 넣어주세요
                    //if(!document.querySelector('.inquiry-to-buy-contents')) return false;

                    //var $obj = $('.inquiry-to-buy-contents');
                    var $slick = $(".product-recommend-wrap .items");
                    if (recommendedData.length >= 3) $slick.addClass("slider");

                    $(".product-recommend-wrap .slider").slick({
                      infinite: false,
                      slidesToShow: 2,
                      slidesToScroll: 1,
                      arrows: true,
                      dots: false,
                      responsive: [
                        {
                          breakpoint: 992,
                          settings: {
                            slidesToShow: 2,
                            slidesToScroll: 1,
                            arrows: true,
                          },
                        },
                        {
                          breakpoint: 768,
                          settings: {
                            arrows: false,
                            dots: true,
                          },
                        },
                      ],
                      prevArrow: carouselOptions.bigAnglePrev, // common.js variable
                      nextArrow: carouselOptions.bigAngleNext, // common.js variable
                    });
                  });
                }
              }
              //LGEVN-694

              p.event_matchModelClick_trigger();

              // var btnColorChange = data.btnColorChange;
              // var btnList = p.elements.$matchedModelArea.find(".btn-area a");
              // for(var i = 0; i < btnList.length; i++){
              // 	if(btnColorChange == 'Y'){
              // 		if($(btnList[i]).hasClass("btn-primary")){
              // 			$(btnList[i]).removeClass("btn-primary");
              // 			$(btnList[i]).addClass("btn-outline-secondary");
              // 		}else{
              // 			$(btnList[i]).removeClass("btn-outline-secondary");
              // 			$(btnList[i]).addClass("btn-primary");
              // 		}
              // 	}
              // }

              // setTimeout(function() {
              // 	var $obj = $('.success-etc ul');
              // 	var $slick = null;
              // 	var slideInit = function() {
              // 		$slick = $obj.slick({
              // 			infinite: false,
              // 			slidesToShow: 3,
              // 			slidesToScroll: 3,
              // 			variableWidth: true,
              // 			arrows : true,
              // 			dots: false,
              // 			responsive: [
              // 				{
              // 					breakpoint: 1024,
              // 					settings: {
              // 						slidesToShow: 1,
              // 						slidesToScroll: 1
              // 					}
              // 				}
              // 			]
              // 		});
              // 	}
              // 	$obj.filter('.slick-initialized').slick('unslick');
              // 	slideInit()
              // }, 100);

              // $('#autoResult').remove();
              // p.elements.$autoSearchArea.addClass("active");
              // p.elements.$autoNameBox.mCustomScrollbar("destroy");

              if (data.modelName !== searchValue) {
                p.elements.$matchedModelArea.removeClass("result-model-name");
                p.elements.$matchedModelArea.addClass("result-model-title");
              } else {
                p.elements.$matchedModelArea.addClass("result-model-name");
                p.elements.$matchedModelArea.removeClass("result-model-title");
              }
            }

            // LGEDE-982 START : ADMIN landing page url
            if (landingPageFlag == "Y") {
              var landingPageUrl = data.landingPageUrl;
              if (
                landingPageUrl != undefined &&
                landingPageUrl != null &&
                landingPageUrl != ""
              ) {
                p.elements.$navSearchForm.data("landing-url", landingPageUrl);
              }
            }
          }
          // 2022.02.18 search input 수정 end
          // p.elements.$autoSearchArea.find('.link-close').off('click').on('click', function(e) {
          // 	e.preventDefault();
          // 	setTimeout(function() {
          // 		p.elements.$autoSearchArea.removeClass('active');
          // 		p.elements.$autoNameBox.removeClass("gang-success");
          // 		p.elements.$matchedModelArea.removeClass("result-model-name result-model-title");
          // 	}, 100);
          // });
          var isTypingError =
            response.typingError != null &&
            0 < Object.keys(response.typingError).length;
          if (isTypingError) {
            var typingErrorCheck = response.typingError.similarFlag;
            if (typingErrorCheck === "Y") {
              // similar mapping
              var similarWord = response.typingError.similar;
              var similarUrl = response.typingError.url;
              var typingError = p.searchResults.templetes.typingError;
              var typingErrorHTML = typingError
                .replace(/\*similarWord\*/g, similarWord)
                .replace(/\*simlarUrl\*/g, similarUrl);
              p.elements.$similarMapping
                .addClass("active")
                .html(typingErrorHTML);
            } else {
              p.elements.$similarMapping.removeClass("active");
            }
          }

          if (isCompletelyMatched) {
            // matched
            p.elements.$autoSearchArea.addClass("active");
            p.elements.$autoNameBox.addClass("gang-success");
          } else if (isPartialMatched) {
            // non-matched
            p.elements.$autoSearchArea.addClass("active");
            p.elements.$matchedModelArea.removeClass(
              "result-model-name result-model-title"
            );
            p.elements.$autoNameBox.removeClass("gang-success");
          } else {
            // no result
            p.elements.$autoSearchArea.removeClass("active");
            p.elements.$autoNameBox.removeClass("gang-success");
            p.elements.$matchedModelArea.removeClass(
              "result-model-name result-model-title"
            );
          }
          //PJTSEARCH-1 End
          // 2022.02.18 삭제 start
          // 					if(response.data.products !== undefined){
          // 						// match product list
          // 						var productMsg = response.data.productMessages;
          // 						var productDataSets = response.data.products;
          // 						var productDataLength = productDataSets.length;
          // 						var resultList = "";
          // 						var exposeItem = "";
          // 						// categorized list
          // 						var categories = response.data.categories;
          // 						var categoryLength = categories.length;
          // 						var categoryList = "";
          // 						var category = "";

          // 						// 2022.0218 see all results 삭제
          // 						// var seeAllResultsLength = response.data.seeAllResults.cnt;
          // 						// var seeAllResultsURL = response.data.seeAllResults.url;

          // 						var matchProductResult = function(){
          // 							// button code
          // 							var cartBtnFlagCheck = function(data){
          // 								// PJTOBSB2E-3 Start
          // 								if(data.obsPreOrderInventoryDateFlag === 'Y' && data.obsPreOrderFlag === 'Y'){
          // 									return "Y";
          // 								// PJTOBSB2E-3 End
          // 								}else if(data.addToCartFlag !== "N"){
          // 									if(data.addToCartFlag === 'S' || data.addToCartFlag === 'Y'){
          // 										return data.addToCartFlag;
          // 									}
          // 								}else if(data.bookOnlineFlag === "Y"){
          // 									return data.bookOnlineFlag;
          // 								}else if(data.buyNowFlag === 'L' || data.buyNowFlag === "Y" ){
          // 									return data.buyNowFlag;
          // 								// 20200506 START 박지영 - flag 명 변경
          // 								}else if(data.resellerBtnFlag === "Y"){
          // 									return data.resellerBtnFlag;
          // 								// 20200506 END
          // 								}else if(data.productSupportFlag === "Y"){
          // 									return data.productSupportFlag;
          // 								}else{
          // 									return "N";
          // 								}
          // 							};
          // 							var wtbBtnFlagCheck = function(data){
          // 								if(data.whereToBuyFlag=="Y" && data.whereToBuyFlag != null && data.whereToBuyFlag != ''){
          // 									return data.whereToBuyFlag;
          // 								}else if(data.wtbExternalLinkUseFlag=="Y" && data.wtbExternalLinkUseFlag != null && data.wtbExternalLinkUseFlag != ''){
          // 									return data.wtbExternalLinkUseFlag;
          // 								}else{
          // 									return "N";
          // 								}
          // 							};
          // 							// 20200423 START 이상현 - gnb search ui 변경
          // 							var softwareFlagCheck = function(data){
          // 								if(data.softwareLinkFlag !== "Y"){
          // 									return "N";
          // 								}else{
          // 									return "Y";
          // 								}
          // 							};
          // 							var manualFlagCheck = function(data){
          // 								// 20200427 START 이상현 - gnb search - CA manual link 출력 오류 수정
          // 								if(data.manualLinkFlag !== "Y"){
          // 								// 20200427 END
          // 									return "N";
          // 								}else{
          // 									return "Y";
          // 								}
          // 							};
          // 							// 20200423 END

          // 							//LGEGMC-2202 START
          // 							var wtbExterNalCheck = function(data){
          // 								if(data.wtbExternalLinkUseFlag=="Y" && data.wtbExternalLinkUrl != null && data.wtbExternalLinkUrl != '' && data.wtbExternalLinkName != null && data.wtbExternalLinkName != ''){
          // 									return "in-buynow";
          // 								}else{
          // 									return "where-to-buy";
          // 								}
          // 							};
          // 							//LGEGMC-2202 END

          // 							var btnAttributes = {
          // 								addToCart : {
          // 									className : "add-to-cart",
          // 									btnOpt : function(data){
          // 										return {
          // 											"data-model-id" : data.modelId,
          // 											"role" : "button",
          // 											"href" : "#",
          // 										};
          // 									},
          // 									linkOpt : function(data){
          // 										if(data.addToCartFlag === "L"){
          // 											return {
          // 												"data-model-id" : data.modelId,
          // 												"href" : "#",
          // 												"data-keyword-search-url" : data.obsProductUrl,
          // 												"title" : data.btnNewLinkTitle,
          // 												"target" : "_blank",
          // 											};
          // 										}else{
          // 											return {
          // 												"data-model-id" : data.modelId,
          // 												"href" : "#",
          // 												"data-keyword-search-url" : data.obsProductUrl,
          // 												"title" : data.btnNewLinkTitle,
          // 											};
          // 										}
          // 									},
          // 									localLinkOpt : function(data, keyName){
          // 										// 20200506 START 박지영 - flag 명 변경
          // 										if(data.resellerBtnFlag === "Y"){
          // 										// 20200506 END
          // 											// 20200601 START 박지영 : reseller 버튼 사용하는 경우 (il) 스크립트 수정
          // 											return {
          // 												"data-model-id" : data.modelId,
          // 												"href" : "#",
          // 												"data-keyword-search-url" : data[keyName + "LinkUrl"],
          // 												"target" :'_blank',
          // 												"title" : data.btnNewLinkTitle,
          // 											};
          // 											// 20200601 END
          // 										}else if(data.ecommerceTarget === "_blank"){
          // 											return {
          // 												"data-model-id" : data.modelId,
          // 												"href" : "#",
          // 												"data-keyword-search-url" : data[keyName + "Url"],
          // 												"target" : data.ecommerceTarget,
          // 												"title" : data.btnNewLinkTitle,
          // 											};
          // 										}
          // 										return {
          // 											"data-model-id" : data.modelId,
          // 											"href" : "#",
          // 											"data-keyword-search-url" : data[keyName + "Url"],
          // 										};
          // 									},
          // 									inBtnOpt : function(data){
          // 										return {
          // 											"data-model-id" : data.modelId,
          // 											"href" : "#",
          // 											"data-keyword-search-url" : data.modelUrlPath,
          // 										};
          // 									},
          // 									externalBtnKeys : [
          // 										"obsProduct",
          // 										"bookOnline",
          // 										"buyNow",
          // 										"reseller",
          // 										"productSupport"
          // 									],
          // 									// PJTOBSB2E-3 Start
          // 									preOrderOpt : function(data){
          // 										if(data.obsBuynowFlag == 'Y'){
          // 											return {
          // 												"data-model-id" : data.modelId,
          // 												"href" : "#",
          // 												"data-keyword-search-url" : data.modelUrlPath,
          // 												"data-obs-pre-order-start-date" : data.obsPreOrderStartDate,
          // 												"data-obs-pre-order-end-date" : data.obsPreOrderEndDate,
          // 												"data-obs-pre-order-flag" : "Y"
          // 											};
          // 										}else{
          // 											return {
          // 												"data-model-id" : data.modelId,
          // 												"role" : "button",
          // 												"href" : "#",
          // 												"data-obs-pre-order-start-date" : data.obsPreOrderStartDate,
          // 												"data-obs-pre-order-end-date" : data.obsPreOrderEndDate,
          // 												"data-obs-pre-order-flag" : "Y"
          // 											};
          // 										}
          // 									}
          // 									// PJTOBSB2E-3 End
          // 								},
          // 								whereToBuy : {
          // 									className : "where-to-buy",
          // 									pdpOpt : function(data){
          // 										return {
          // 											"href" : "#",
          // 											"data-keyword-search-url" : data.whereToBuyUrl,
          // 										};
          // 									},
          // 									externalBtnKeys : [
          // 										"wtbExternalLink"
          // 									]
          // 								},
          // 								findTheDealer : {
          // 									className : "find-a-dealer",
          // 									linkOpt : function(data){
          // 										return {
          // 											"href" : "#",
          // 											"data-keyword-search-url" : data.findTheDealerUrl,
          // 										};
          // 									}
          // 								},
          // 								inquiryToBuy : {
          // 									className : "inquiry-to-buy",
          // 									linkOpt : function(data){
          // 										return {
          // 											"href" : "#",
          // 											"data-keyword-search-url" : data.inquiryToBuyUrl,
          // 										};
          // 									}
          // 								// 20200423 START 이상현 - gnb search ui 변경
          // 								},
          // 								software : {
          // 									className : "software",
          // 									linkOpt : function(data){
          // 										return {
          // 											"href" : "#",
          // 											"data-keyword-search-url" : data.softwareLinkUrl,
          // 										};
          // 									}
          // 								},
          // 								manual : {
          // 									className : "manual",
          // 									linkOpt : function(data){
          // 										return {
          // 											"href" : "#",
          // 											"data-keyword-search-url" : data.manualLinkUrl,
          // 										};
          // 									}
          // 								},
          // 								// 20200423 END
          // 								//LGEGMC-2202 START
          // 								whereToBuyExt : {
          // 									className : "in-buynow",
          // 									externalOpt : function(data){
          // 										if(data.wtbExternalLinkSelfFlag === "Y"){
          // 											return {
          // 												"href" : "#",
          // 												"data-keyword-search-url" : data.wtbExternalLinkUrl,
          // 												"data-link-name" : "buy_now",
          // 											};
          // 										}else{
          // 											return {
          // 												"href" : "#",
          // 												"data-keyword-search-url" : data.wtbExternalLinkUrl,
          // 												"target" : "_blank",
          // 												"title" : data.btnNewLinkTitle,
          // 												"data-link-name" : "buy_now",
          // 											};
          // 										}
          // 									},
          // 									externalBtnKeys : [
          // 										"wtbExternalLink"
          // 									]
          // 								}
          // 								//LGEGMC-2202 END
          // 							};
          // 							var keyArray = Object.keys(btnAttributes);
          // 							var ButtonConstructor = function Button(name, parent_node){
          // 								this.obj = btnAttributes[name];
          // 								Button.prototype.parent = parent_node;
          // 								Button.prototype.pushData = function(attributes, text){
          // 									var $elem = $(Button.prototype.parent).find("." + this.obj.className);
          // 									$elem.attr(attributes);
          // 									if(text === null || typeof(text) === "string"){
          // 										$elem.text(text);
          // 									}
          // 									return false;
          // 								};
          // 							};
          // 							// push json data to temeplete
          // 							if(productDataLength > 6){
          // 								productDataLength = 6;
          // 							}
          // 							for(var i=0; i<productDataLength; i++){
          // 								var data = productDataSets[i];
          // 								exposeItem = p.searchResults.templetes.matchProduct
          // 											.replace(/\*imageAltText\*/g, (data.imageAltText != null) ? data.imageAltText : '')
          // 											.replace(/\*mediumImageAddr\*/g, data.mediumImageAddr)
          // 											.replace(/\*modelId\*/g, data.modelId)
          // 											.replace(/\*modelUrlPath\*/g, data.modelUrlPath)
          // 											.replace(/\*modelName\*/g, data.modelName)
          // 											// 20200325 START 박지영 - ufn 따옴표 처리
          // 											// 20200512 START 박지영 - ufn null 처리
          // 											.replace(/\*userFriendlyName\*/g, data.userFriendlyName == null ? '' : data.userFriendlyName.replace(/\"/g, "''"))
          // 											// 20200512 END
          // 											// 20200325 END
          // 											.replace(/\*whereToBuyFlag\*/g, wtbBtnFlagCheck(data))
          // 											.replace(/\*findTheDealerFlag\*/g, data.findTheDealerFlag)
          // 											.replace(/\*inquiryToBuyFlag\*/g, data.inquiryToBuyFlag)
          // 											.replace(/\*addToCartFlag\*/g, cartBtnFlagCheck(data))
          // 											// 20200423 START 이상현 - gnb search ui 변경
          // 											.replace(/\*softwareLinkFlag\*/g, softwareFlagCheck(data))
          // 											.replace(/\*manualLinkFlag\*/g, manualFlagCheck(data))
          // 											// 20200423 END
          // 											.replace(/\*salesModelCode\*/g, data.salesModelCode)
          // 											.replace(/\*salesSuffixCode\*/g, data.salesSuffixCode)
          // 											.replace(/\*modelYear\*/g, data.modelYear) /* LGEGMC-1279 : 2021.03.12 add */
          // 											.replace(/\*buName1\*/g, data.buName1)
          // 											.replace(/\*buName2\*/g, data.buName2)
          // 											.replace(/\*buName3\*/g, nvl(data.buName3,''))
          // 											.replace(/\*superCategoryName\*/g, data.superCategoryName)
          // 											.replace(/\*bizType\*/g, data.bizType)
          // 											.replace(/\*priceValue\*/g, (nvl(data.obsSellingPrice,'') || ''))
          // 								            //LGEGMC-712 ADD
          // 											//PJTOBSB2E-3 Start
          // 											.replace(/\*obsPreOrderStartDate\*/g, data.obsPreOrderStartDate)
          // 											.replace(/\*obsPreOrderEndDate\*/g, data.obsPreOrderEndDate)
          // 											//PJTOBSB2E-3 End
          // 											//LGEGMC-2202 START
          // 											.replace(/\*wtbClass\*/g, wtbExterNalCheck(data))
          // 											.replace(/\*msrp\*/g, nvl(data.msrp,'0'));
          // 											//LGEGMC-2202 END
          // 								// to element node
          // 								var $exposeItem = $(exposeItem);

          // 								// button attribute push
          // 								var $btnArea = $exposeItem.find(".btn-area");

          // 								var cart = new ButtonConstructor(keyArray[0], $btnArea);
          // 								var WTBuy = new ButtonConstructor(keyArray[1], $btnArea);
          // 								var dealer = new ButtonConstructor(keyArray[2], $btnArea);
          // 								var ITBuy = new ButtonConstructor(keyArray[3], $btnArea);
          // 								// 20200423 START 이상현 - gnb search ui 변경
          // 								var software = new ButtonConstructor(keyArray[4], $btnArea);
          // 								var manual = new ButtonConstructor(keyArray[5], $btnArea);
          // 								// 20200423 END
          // 								//LGEGMC-2202 START
          // 								var wtbExt = new ButtonConstructor(keyArray[6], $btnArea);
          // 								//LGEGMC-2202 START

          // 								//LGEVN-80
          // 								var obsBuynowFlag = $('#obsBuynowFlag').val();
          // 								// add to cart
          // 								// PJTOBSB2E-3 Start
          // 								if(data.obsPreOrderInventoryDateFlag === 'Y' && data.obsPreOrderFlag === 'Y'){
          // 									cart.pushData(cart.obj.preOrderOpt(data), productMsg.preOrderBtnNm);
          // 								// PJTOBSB2E-3 End
          // 								}else if(data.addToCartFlag !== "N"){
          // 									// 통합 OBS
          // 									if(data.addToCartFlag === 'Y'){
          // 										if(obsBuynowFlag == 'Y'){
          // 											cart.pushData(cart.obj.inBtnOpt(data), productMsg.buyNowBtnNm);
          // 										}else{
          // 											cart.pushData(cart.obj.btnOpt(data), productMsg.addToCartBtnNm);
          // 										}
          // 										// Standalone OBS
          // 									}else if(data.addToCartFlag === 'S'){
          // 										cart.pushData(cart.obj.btnOpt(data), productMsg.addToCartBtnNm);
          // 									}else{
          // 										// not work
          // 									}
          // 								}else if(data.bookOnlineFlag === "Y"){
          // 									cart.pushData(
          // 										cart.obj.localLinkOpt(data, cart.obj.externalBtnKeys[1]),
          // 										productMsg[cart.obj.externalBtnKeys[1] + "BtnNm"]
          // 									);
          // 								}else if(data.buyNowFlag === "Y" || data.buyNowFlag === "L"){
          // 									cart.pushData(
          // 										cart.obj.localLinkOpt(data, cart.obj.externalBtnKeys[2]),
          // 										productMsg[cart.obj.externalBtnKeys[2] + "BtnNm"]
          // 									);
          // 									// Local OBS
          // 								// 20200506 START 박지영 - flag 명 변경
          // 								}else if(data.resellerBtnFlag === "Y"){
          // 								// 20200506 END
          // 									cart.pushData(
          // 										cart.obj.localLinkOpt(data, cart.obj.externalBtnKeys[3]),
          // 										productMsg[cart.obj.externalBtnKeys[3] + "BtnNm"]
          // 									);
          // 								}else if(data.productSupportFlag === "Y"){
          // 									cart.pushData(
          // 										cart.obj.localLinkOpt(data, cart.obj.externalBtnKeys[4]),
          // 										productMsg[cart.obj.externalBtnKeys[4] + "BtnNm"]
          // 									);
          // 								}else{
          // 									// no work;
          // 								}

          // 								// Where to buy
          // 								if(data.whereToBuyFlag=="Y" && data.whereToBuyFlag != null && data.whereToBuyFlag != ''){
          // 									WTBuy.pushData(WTBuy.obj.pdpOpt(data), productMsg.whereToBuyBtnNm);
          // 								// 20200413 START 박지영 - gnb search layer 의 wtb 버튼 스크립트 수정
          // 								}else if(data.wtbExternalLinkUseFlag=="Y" && data.wtbExternalLinkUrl != null && data.wtbExternalLinkUrl != '' && data.wtbExternalLinkName != null && data.wtbExternalLinkName != ''){
          // 									//LGEGMC-2202 START
          // 									$btnArea.find('a.in-buynow').removeAttr('data-sc-item');
          // 									wtbExt.pushData(wtbExt.obj.externalOpt(data), data.wtbExternalLinkName);
          // 									//LGEGMC-2202 END
          // 								// 20200413 END
          // 								}else{
          // 									// no work;
          // 								}

          // 								// Find a dealer
          // 								// dealer.pushData(dealer.obj.linkOpt(data), productMsg.findTheDealerBtnNm);

          // 								// inquiry to buy
          // 								ITBuy.pushData(ITBuy.obj.linkOpt(data), productMsg.inquiryToBuyBtnNm);
          // 								// 20200423 START 이상현 - gnb search ui 변경
          // 								// software
          // 								software.pushData(software.obj.linkOpt(data), productMsg.softwareLinkBtnNm);
          // 								// manual
          // 								manual.pushData(manual.obj.linkOpt(data), productMsg.manualLinkBtnNm);
          // 								// 20200423 END
          // 								// restore HTMLString
          // 								exposeItem = $exposeItem[0].outerHTML;
          // 								resultList += exposeItem;
          // 							}
          // 							// finish off
          // 							p.elements.$matchProductList.find(".list-wrap").html("<ul>" + resultList + "</ul>");
          // 							p.elements.$matchProductList.find("[data-btn-flag='N']").remove();
          // 							// 20200527 START 박지영 : adobe 코드 추가
          // //							p.elements.$matchProductList.find('ul li a.product-page-linker').off('click').on('click', function() {
          // //								adobeTrackEvent('gnb-search-product', {search_keyword : $('#useInputKeyword').val(), page_event : {predictive_search_click : true}});
          // //							});
          // 							p.elements.$matchProductList.find('ul li a.product-page-linker').off('click').on('click', function(e) {
          // 								e.preventDefault();
          // 								adobeTrackEvent('gnb-search-product', {search_keyword : $('#useInputKeyword').val(), page_event : {predictive_search_click : true}});
          // 								var keyword = $(this).find('.model-display-name').text();
          // 								p.searchNavSetCookie(keyword);
          // 								window.location.href = $(this).attr('href');
          // 							});
          // 							// 20200527 END
          // 						};
          // 						var categorizedResult = function(){
          // 							for(var i=0; i<categoryLength; i++){
          // 								var data = categories[i];
          // 								var queryFactor = "?";
          // 								if(data.resultPageUrl.indexOf("?") >= 0){
          // 									queryFactor = "&";
          // 								}
          // 								category = p.searchResults.templetes.category
          // 											.replace(/\*title\*/g, data.categoryName)
          // 											.replace(/\*count\*/g, data.matchCount)
          // 											.replace(/\*resultPageUrl\*/g, data.resultPageUrl + queryFactor + "search=" + searchValue)
          // 											;
          // 								categoryList += category;
          // 							}
          // 							// finish off
          // 							p.elements.$categorizedList.html("<ul>" + categoryList + "</ul>");
          // 						};

          // 						p.elements.$secondaryView.addClass("active");
          // 						p.elements.$similarMapping.removeClass("active");
          // 						p.elements.$primaryView.removeClass("active");
          // 						matchProductResult();
          // 						categorizedResult();

          // 						$('.search-window-wrap .add-to-cart[data-obs-pre-order-flag=Y]').addClass('pre-order'); // PJTOBSB2E-3 add

          // 						// 2022.02.18 see all results 삭제
          // 						// p.elements.$seeAllResults.attr('href', seeAllResultsURL).find('.count').text(seeAllResultsLength);

          // 					}else if(typingErrorCheck === "Y"){
          // 						// similar mapping
          // 						var similarWord = response.typingError.similar;
          // 						var similarUrl = response.typingError.url;

          // 						p.elements.$similarMapping.find(">a").attr('href', similarUrl);
          // 						p.elements.$similarMapping.find(".suggestion").text(similarWord);
          // 						p.elements.$primaryView.removeClass("active");
          // 						p.elements.$secondaryView.removeClass("active");
          // 						p.elements.$similarMapping.addClass("active");
          // 					}else{
          // 						p.elements.$secondaryView.removeClass("active");
          // 						p.elements.$primaryView.addClass("active");
          // 						p.elements.$similarMapping.removeClass("active");
          // 						return false;
          // 					}
          // 2022.02.18 삭제 end
        },
        call: function () {
          this.url = p.elements.$navSearchForm.data("ajax-url");
          // 20200423 START 이상현 - gnb search ui 변경
          this.param = xssfilter(p.elements.$navSearchForm.serialize());
          // 20200423 END
          $.ajax({
            type: "post",
            url: this.url,
            dataType: this.type,
            data: xssfilter(this.param),
            xhrFields: {
              withCredentials: true,
            },
            success: function (d) {
              p.searchResults.action(d);
            },
            error: function (request, status, error) {
              console.log("status: " + status);
              console.log("error: " + error);
            },
          });
          /*
					ajax.call(
						this.url,
						this.param,
						this.type,
						this.action
					);
					*/
        },
      };
      p.recommended = {
        rolling: {
          duration: 3000,
          act: function () {
            var $tg = p.elements.$rollingBelt;
            var currentItem = $tg.find(".hidden-keyword");
            var currentCopy = currentItem
              .clone()
              .attr("class", "rolling-keyword");
            var roll = function (distance) {
              $tg.append(currentCopy);
              setTimeout(function () {
                $tg.css({
                  transform: "translateY(" + -distance + "px)",
                  transition: "transform 400ms ease",
                });
                currentItem.next().removeClass("highlight");
                currentItem.next().next().addClass("highlight");
                setTimeout(function () {
                  $tg.css({
                    transform: "translateY(0)",
                    transition: "",
                  });
                  currentItem.removeClass("hidden-keyword");
                  currentItem.next().addClass("hidden-keyword");
                  currentItem.remove();
                }, 400);
              }, p.recommended.rolling.duration);
            };
            // rolling
            if ($tg.children().length > 1) {
              var distance = parseInt(
                window
                  .getComputedStyle(
                    document.querySelector(".hidden-keyword"),
                    null
                  )
                  .getPropertyValue("height")
              );
              if (currentCopy.text() !== $tg.children().last().text()) {
                roll(distance);
              } else {
                return;
              }
            } else {
              return;
            }
          },
          call: null,
        },
      };
      p.recentlySearched = {
        // 2022.02.18 불필요한 코드 삭제 start
        // toggleBtn : function(){
        // 	var $list = p.elements.$recentlyList;
        // 	var listLength = p.elements.$recentlyList.find("ul").children().length;
        // 	var $tgBtn = $list.find(".btn-clear");
        // 	if(listLength > 0){
        // 		$tgBtn.addClass("active");
        // 	}else{
        // 		$tgBtn.removeClass("active");
        // 	}
        // },
        // 2022.02.18 불필요한 코드 삭제 end
        append: function () {
          var recentList = getCookie(p.cookieName)
            ? getCookie(p.cookieName).split("|")
            : null;
          var tmpHTML = "";
          if (
            typeof ePrivacyCookies == "undefined" ||
            ePrivacyCookies.get("LGCOM_IMPROVEMENTS")
          ) {
            if (recentList && recentList.length > 0) {
              var num = recentList.length;
              // 2022.02.18 recentCookieArr 수정 start
              if (num > 10) num = 10;
              for (var i = 0; i < num; i++) {
                var text = "";
                if (xssfilter(recentList[i]).length >= 20) {
                  text = xssfilter(recentList[i]).substr(0, 18) + "...";
                } else {
                  text = xssfilter(recentList[i]);
                }
                tmpHTML +=
                  '<li><a href="#" data-keyword="true" data-internal-search="your_recent_searches" data-original-text="' +
                  xssfilter(recentList[i]).replace(/"/g, "&#34;") +
                  '">' +
                  text +
                  '</a><button type="button" class="btn-clear-item"><span class="sr-only">clear recent searches ' +
                  xssfilter(recentList[i]) +
                  "</span></button></li>"; //LGEGMC-1430
              }
              p.elements.$recentlyList.addClass("active");
              p.elements.$recentlyList.find("ul").html(tmpHTML);
              p.event__clear();
              // 2022.02.18 recentCookieArr 수정 end
            }
          } else {
            var headTxt = p.elements.$recentlyList.find(".head").clone();
            p.elements.$recentlyList
              .empty()
              .append(headTxt)
              .append('<div class="temp-area"></div>');
            ePrivacyCookies.view(
              "load",
              "small",
              p.elements.$recentlyList.find(".temp-area")
            );
          }
        },
      };
      p.mostSearched = {
        outflowChecker: function () {
          var $container = p.elements.$mostSearchedGroup;
          $container.find(".word-tag").each(function (idx, elem) {
            var containerBottom = $container.offset().top + $container.height();
            var elemBottom = 0;
            $(elem).removeClass("cutoff");
            setTimeout(function () {
              elemBottom = $(elem).offset().top + $(elem).height();
              if (elemBottom >= containerBottom) {
                $(elem).addClass("cutoff");
              }
            }, 300);
          });
        },
      };
      p.view__preset = function () {
        var templetes = this.searchResults.templetes;
        templetes.matchProduct = $navSearchWindow
          .find("#searchProductListTemplate")
          .clone()
          .html();
        templetes.category = $navSearchWindow
          .find("#searchCategoryTemplate")
          .clone()
          .html();
        templetes.autoData = $navSearchWindow
          .find("#autoDataTemplate")
          .clone()
          .html(); //PJTSEARCH-1 add
        templetes.matchedData = $navSearchWindow
          .find("#matchedModelTemplate")
          .clone()
          .html(); //PJTSEARCH-1 add
        templetes.typingError = $navSearchWindow
          .find("#typingErrorTemplate")
          .clone()
          .html(); // PJTQUICKWIN add
        $navSearchWindow.find("template").remove();
      };
      p.view__active = function () {
        this.recentlySearched.append();
        // this.recentlySearched.toggleBtn(); // 2022.02.18 불필요한 코드 삭제
        this.mostSearched.outflowChecker();
        this.recommended.rolling.call = setInterval(
          p.recommended.rolling.act,
          p.recommended.rolling.duration
        );
        // 20200309 START 이상현 - 스크롤 바 제거
        // this.elements.$matchProductList.mCustomScrollbar('update');
        // 20200309 END
      };
      p.view__reset = function () {
        this.elements.$useInputKeyword.val("");
        this.elements.$searchInputField.removeClass("is-typing");
        this.elements.$primaryView.addClass("active");
        this.elements.$secondaryView.removeClass("active");
        this.elements.$similarMapping.removeClass("active");
      };
      p.floatingWindow = function (status) {
        if (status) {
          $navSearchWindow.addClass("active");
          $("body").addClass("band-scroll");
          var naviType = "B2C";
          if ($(".navigation").is(".b2b")) {
            naviType = "B2B";
          }
          navigationSearchForm.type.value = naviType;
        } else {
          $navSearchWindow.removeClass("active");
          $("body").removeClass("band-scroll");
        }
      };
      // p.event__navSearchWindow_open = function(){
      // 	$nav.find('.for-desktop .right-btm .+ a, .for-mobile .nav-wrap .right .search a').off('touch click mousedown').on("click", function(e){
      // 		e.preventDefault();
      // 		p.floatingWindow(true);
      // 		p.view__active();
      // 		if(typeof scrollDesign == 'function') scrollDesign();
      // 	});
      // };
      p.event__navSearchWindow_close = function () {
        var closeAction = function () {
          p.floatingWindow(false);
          p.view__reset();
          clearInterval(p.recommended.rolling.call);
        };
        var keyBinder = function (event, keyValue) {
          if (event.keyCode === keyValue) {
            event.preventDefault();
            closeAction();
          }
          // 20200317 START 박지영 : 세미콜론 추가
        };
        // 20200317 END
        // default ui : close btn's click or focusout
        $navSearchWindow.find(".btn-close-search-window").on({
          click: function (e) {
            e.preventDefault();
            closeAction();
          },
          // 2022-04-01 START 이현경 : blur 일때 팝업 안으로 focus 이동
          // "keydown" : function(e){
          // 	if(e.shiftKey !== true){
          // 		keyBinder(e, 9);
          // 	}
          // },
          blur: function (e) {
            e.preventDefault();
            $("#navigationSearchForm").find("input[name=search]").focus();
          },
          // 2022-04-01 END 이현경 : blur 일때 팝업 안으로 focus 이동
        });
        // key event
        $navSearchWindow.on("keydown.close_navSearch", function (e) {
          keyBinder(e, 27); // esc key close

          if (
            $(this).is(":focus") ||
            $(this).find("#useInputKeyword").is(":focus")
          ) {
            if (e.shiftKey === true) {
              keyBinder(e, 9);
            }
          }
        });

        // $navSearchWindow.on("keydown.close_navSearch", function(e){
        // 	if( $navSearchWindow.is(':focus') || $navSearchWindow.find(".btn-close-search-window").is(':focus') ){
        // 		if(e.keyCode === 9){
        // 			$navSearchWindow.find("input[name=search]").focus();
        // 		}
        // 	}
        // 	if(e.keyCode === 27){
        // 		event.preventDefault();
        // 		closeAction();
        // 	}
        // });
      };
      p.event__inputField = function () {
        var _ = p.elements;
        _.$useInputKeyword.on({
          input: function (e) {
            var searchWord = $.trim(e.target.value);
            if (searchWord.length > 0) {
              _.$primaryView.removeClass("active");
              _.$searchInputField.addClass("is-typing");
              p.searchResults.call();
            } else {
              _.$primaryView.addClass("active");
              _.$secondaryView.removeClass("active");
              _.$similarMapping.removeClass("active");
              _.$searchInputField.removeClass("is-typing");
              //PJTSEARCH-1 add
              _.$autoSearchArea.removeClass("active");
              // 2022.02.18 search input update 추가
              p.elements.$matchedModelArea.removeClass(
                "result-model-name result-model-title"
              );
            }
          },
          // 20200309 START 이상현- console 제거
          // "focus" : function(){
          // 	console.log("have");
          // }
          // 20200309 END
        });
      };
      p.event__clear = function () {
        // clear view
        this.elements.$searchInputField
          .find(".btn-clear-input")
          .on("click", function (e) {
            e.preventDefault();
            p.view__reset();
            p.recommended.rolling.call = setInterval(
              p.recommended.rolling.act,
              p.recommended.rolling.duration
            );
            //PJTSEARCH-1 add
            p.elements.$autoSearchArea.removeClass("active");
            // 2022.02.18 search input update 추가
            p.elements.$matchedModelArea.removeClass(
              "result-model-name result-model-title"
            );
          });
        // clear recently searched
        this.elements.$recentlyList
          .find(".clear-recently-list")
          .on("click", function (e) {
            e.preventDefault();
            p.elements.$recentlyList.find("ul").empty().removeClass("active"); // 2022.02.18 불필요한 코드 삭제, LGEITF-765 주석 제거
            p.elements.$recentlyList.removeClass("active"); // 2022.02.18 수정
            // p.recentlySearched.toggleBtn(); // 2022.02.18 불필요한 코드 삭제
            // cookie
            removeCookie(p.cookieName, true);
          });
        // 2022.02.18 recent searches 개별 삭제 버튼 추가 start
        this.elements.$recentlyList
          .find(".btn-clear-item")
          .on("click", function (e) {
            e.preventDefault();

            $(this).parent("li").remove();

            if (p.elements.$recentlyList.find("li").length <= 0) {
              p.elements.$recentlyList.removeClass("active");
            }

            // cookie
            var target = $(this)
              .parent("li")
              .find("a")
              .data("original-text")
              .replace(/&#34;/g, '"');
            var recentList = getCookie(p.cookieName).split("|");
            for (var i = 0; i < recentList.length; i++) {
              if (recentList[i] == target) recentList.splice(i, 1);
            }
            setCookie(p.cookieName, recentList.join("|"), true);
          });
        // 2022.02.18 recent searches 개별 삭제 버튼 추가 end
      };
      p.event__resize = function () {
        // 20200309 START 이상현 - 스크롤 바 제거
        // match product list - scroll bar
        // var scrollbarDisabled = function(e){
        // 	if(e.matches){
        // 		p.elements.$matchProductList.mCustomScrollbar('update');
        // 		p.elements.$matchProductList.mCustomScrollbar('disable', true);
        // 	}
        // }
        // var scrollbarAble = function(e){
        // 	if(e.matches){
        // 		p.elements.$matchProductList.mCustomScrollbar('update');
        // 	}
        // }
        // mql.minLg.addListener(scrollbarDisabled);
        // mql.md.addListener(scrollbarAble);
        // mql.maxSm.addListener(scrollbarDisabled);
        // 20200309 END
        // most searched - check area size
        $(window).on("resize", function () {
          p.mostSearched.outflowChecker();
        });
      };
      p.event__submit = function () {
        //console.log(this.elements.$navSearchForm);
        this.elements.$navSearchForm.on("doSubmit", function (e) {
          e.preventDefault();
          // add searchTxt in cookie list
          var searchTxt = xssfilter($.trim(p.elements.$useInputKeyword.val()));
          if (searchTxt == "") return false;
          var recentCookieTxt = getCookie(p.cookieName);
          if (recentCookieTxt == undefined) recentCookieTxt = "";
          var recentCookieArr = recentCookieTxt.split("|");
          // Clear duplicate values on array
          var isDup = recentCookieArr.indexOf(searchTxt);
          if (isDup > -1) recentCookieArr.splice(isDup, 1);
          // 2022.02.18 recentCookieArr 저장 개수 삭제
          // If you have five search terms, delete the oldest one.
          // if(recentCookieArr.length>=4) {
          // 	recentCookieArr.pop();
          // }
          // Add new value to the front of the array
          if (recentCookieTxt == "undefined" || recentCookieTxt == "")
            recentCookieArr = [searchTxt];
          else recentCookieArr.unshift(searchTxt);

          // set Cookie
          if (
            typeof ePrivacyCookies == "undefined" ||
            ePrivacyCookies.get("LGCOM_IMPROVEMENTS")
          ) {
            setCookie(p.cookieName, recentCookieArr.join("|"), true);
          }

          //PJTSEARCH-1
          if (
            $(".gang-success .success-seacrh-inner a div.model-display-name")
              .length > 0
          ) {
            var linkUrl = $(".success-seacrh-inner a.product-page-linker").attr(
              "data-keyword-search-url"
            );
            var page = $(".success-seacrh-inner a.product-page-linker").attr(
              "data-keyword-search"
            );
            var target = $(".success-seacrh-inner a.product-page-linker").attr(
              "target"
            );
            if (typeof target == "undefined" || target == "") {
              target = "_self";
            }

            aLinkPost(linkUrl, page, target);
            //window.location.href = $('.success-seacrh-inner a.product-page-linker').attr('href');
            return false;
          }
          if (
            $("#searchByKeyword").attr("auto-url") != undefined &&
            $("#searchByKeyword").attr("auto-url") != ""
          ) {
            var linkUrl = $("#searchByKeyword").attr("auto-url");
            var page = "GNB_Search";
            var target = "_self";
            aLinkPost(linkUrl, page, target);
            //window.location.href = $('#searchByKeyword').attr('auto-url');
            return false;
          }

          // LGEDE-982 START
          if (
            $("#navigationSearchForm").data("landing-url") != undefined &&
            $("#navigationSearchForm").data("landing-url") != ""
          ) {
            var linkUrl = $("#navigationSearchForm").data("landing-url");
            var page = "GNB_Search";
            var target = "_self";
            aLinkPost(linkUrl, page, target);
            return false;
          }
          // LGEDE-982 END
          //PJTSEARCH-1
          p.elements.$navSearchForm.submit();
        });

        this.elements.$btnSearchSubmit.on("click", function (e) {
          e.preventDefault();
          p.elements.$navSearchForm.trigger("doSubmit");
        });
      };
      p.event__submit_trigger = function () {
        $navSearchWindow.on("click", "[data-keyword=true]", function (e) {
          e.preventDefault();
          var keyword = $(this).text();
          if (
            $(e.target).attr("data-original-text") != null &&
            $(e.target).attr("data-original-text") != undefined
          )
            keyword = $(e.target).attr("data-original-text"); // 2022.02.18 추가
          p.elements.$useInputKeyword.val(keyword);
          p.elements.$navSearchForm.trigger("doSubmit");
        });
      };
      //PJTSEARCH-1 START
      p.event_autoClick_trigger = function () {
        p.elements.$autoSearchList.on("click", function (e) {
          if (!$(e.target).parent("li").hasClass("category")) {
            // 2022.02.18 추가
            e.preventDefault();
            var keyword = $(e.target).text();
            // support 항목인 경우, 회색 영역의 텍스트는 쿠키 쿠울 때 제외하기
            if ($(e.target).parent("li").hasClass("support")) {
              keyword = keyword.replace(
                $(e.target).find(".support-type-flag").text(),
                ""
              );
            }
            p.searchNavSetCookie(keyword);

            var linkUrl = $(e.target).attr("data-keyword-search-url");
            var page = $(e.target).attr("data-keyword-search");
            var target = $(e.target).attr("target");
            if (typeof target == "undefined" || target == "") {
              target = "_self";
            }

            // LGEGMC-3469, LGEGMC-5141 Start
            const navSearchKeyword = p.elements.$useInputKeyword.val();
            if (
              (salesForceUseFlag || salesForceRunV2) &&
              navSearchKeyword !== ""
            ) {
              const eventName = salesForceRunV2
                ? "SearchKeyword"
                : "ecrmSearchKeyword";
              console.log(eventName + " insert");
              SalesforceInteractions.sendEvent({
                interaction: {
                  name: eventName,
                  eventType: eventName,
                  ecrmLocaleCode: COUNTRY_CODE,
                  ecrmUserId: USER_ID,
                  ecrmSearchIndex: navSearchKeyword,
                },
              });
            }
            // LGEGMC-3469, LGEGMC-5141 End

            aLinkPost(linkUrl, page, target);
            //window.location.href = $(e.target).attr('href');
          }
        });
      };
      p.event_matchModelClick_trigger = function () {
        p.elements.$matchedModelArea
          .find(".success-seacrh-inner a.product-page-linker")
          .on("click", function (e) {
            // 2022.02.18 수정
            e.preventDefault();
            var keyword = $(this).find(".model-display-name").text();
            p.searchNavSetCookie(keyword);

            var linkUrl = $(this).attr("data-keyword-search-url");
            var page = $(this).attr("data-keyword-search");
            var target = $(this).attr("target");
            if (typeof target == "undefined" || target == "") {
              target = "_self";
            }

            aLinkPost(linkUrl, page, target);
            //window.location.href = $(this).attr('href');
          });
      };
      p.searchNavSetCookie = function (text) {
        if (text == "" || text == undefined) return false;
        var recentCookieTxt = getCookie(p.cookieName);

        if (recentCookieTxt == undefined) recentCookieTxt = "";
        var recentCookieArr = recentCookieTxt.split("|");

        // Clear duplicate values on array
        var isDup = recentCookieArr.indexOf(text);
        if (isDup > -1) recentCookieArr.splice(isDup, 1);
        // If you have five search terms, delete the oldest one.
        if (recentCookieArr.length >= 4) {
          recentCookieArr.pop();
        }
        // Add new value to the front of the array
        if (recentCookieTxt == "undefined" || recentCookieTxt == "")
          recentCookieArr = [text];
        else recentCookieArr.unshift(text);
        // set Cookie
        if (
          typeof ePrivacyCookies == "undefined" ||
          ePrivacyCookies.get("LGCOM_IMPROVEMENTS")
        ) {
          setCookie(p.cookieName, recentCookieArr.join("|"), true);
        }
      };
      //PJTSEARCH-1 END
      /*
			p.event = function(){
				this.event__navSearchWindow_open();
				this.event__navSearchWindow_close();
				this.event__inputField();
				this.event__clear();
				this.event__resize();
				this.event__submit();
				this.event__submit_trigger();
			};
			p.init = function(){
				this.elements.keeping();
				this.view__preset();
				this.event();
			};
			*/
    };
    navSearch();
    $nav
      .find(
        ".for-desktop .right-btm .icons .search > a, .for-mobile .icons .search > a"
      )
      .off("touch click mousedown")
      .on("click", function (e) {
        //LGEGMC-777 add
        e.preventDefault();
        e.stopPropagation();
        // 20200326 START 박지영 gnb search layer에 role 추가
        $("#navigation_search").attr("role", "dialog");
        // 20200326 END

        // PJTQUICKWIN - focus input after ajax call
        // ios 에서 해결해 줄때까지 아래코드 지우지 말아 주세요.
        // Fake 용 input에 focus 해 놓고,
        // 키보드가 나온 상태에서,
        // Ajax 호출 후
        // 추가되는 input에 focus를 옮겨 줘야
        // 모바일 브라우저 (특히 ios) 에서
        // 키보드가 올라옵니다.
        $("body").append(
          '<input type="text" id="fakeInputFocus" style="position:fixed; left: 0; top: 0; width: 100%; opacity: 0; z-index: 99999999999;" />'
        );
        $("#fakeInputFocus").focus();

        navSearch.prototype.searchContents.call();
        return false;
      });
  }
})();

// top btn
(function () {
  if (!document.querySelector(".floating-menu")) return false;

  var floatingMenu = function () {
    var $this = $(".floating-menu"),
      p = floatingMenu.prototype;

    p.init = function () {
      this.elements.$toTop.on("click", function (e) {
        e.preventDefault();
        $("html, body").stop().animate(
          {
            scrollTop: 0,
          },
          600
        );
      });
      $(window).on("scroll", function () {
        var scrollPos = $(window).scrollTop(),
          h = $("header.navigation").outerHeight();
        if (!$this.hasClass("call-yet") && scrollPos <= h) {
          $this.addClass("call-yet");
        } else if ($this.hasClass("call-yet") && scrollPos > h) {
          $this.removeClass("call-yet");
        }
      });
    };
    p.elements = {
      $toTop: $this.find(".back-to-top"),
      $chatbot: $this.find(".chatbot-linker"),
    };
    p.init();
  };
  floatingMenu();
})();

// footer
(function ($) {
  // go to Select Your Region page
  $(".footer-box form.country-information>a").on("click", function (e) {
    e.preventDefault();
    $(this).closest("form").submit();
  });

  // toggle footer menu
  var appFooter = function () {
    var footerObj = $(".footer-main-contents");
    var footerTarget = footerObj.find(".visible-mobile");
    var footerDepth1 = footerTarget.find(".has-category");
    footerDepth1.on("click", function (e) {
      if ($(this).hasClass("on")) {
        return true;
      } else {
        $(this).addClass("on");
        $(this).next().slideDown(200);
        $(this).append('<a href="#" class="button-layer"></a>');
        layerButton();
        return false;
      }
    });
    footerObj
      .find(".footer-bottom .bottom-links .links-right")
      .each(function () {
        if ($(this).find("> a").length > 0) {
          $(this)
            .closest(".footer-bottom")
            .addClass("banner-count" + $(this).find("> a").length);
        }
      });
  };
  var layerButton = function () {
    $(".button-layer")
      .off("click")
      .on("click", function () {
        $(this).parent().removeClass("on");
        $(this).parent().next().slideUp(200);
        $(this).off("click").remove();
        return false;
      });
  };
  appFooter();

  // More buttons - 20220218 PJTQUICKWIN 수정
  const footerMoreCaution = function () {
    const footer = $(".footer-box");
    const btnMore = footer.find(".btn-more");
    btnMore.each(function () {
      // check ths width of .caution-text
      const wrap = $(this).parent(".caution-wrap");
      wrap.addClass("active"); // height를 구하기 위해 펼쳐 둠
      const lineHeight = parseInt(wrap.css("line-height"));
      if (wrap.height() <= lineHeight) {
        // more 삭제
        $(this).remove();
      } else {
        // more 유지
        wrap.removeClass("active");
        $(this).attr("aria-expanded", "false");
        $(this).on("click", function () {
          $(this).parent(".caution-wrap").addClass("active");
          $(this).attr("aria-expanded", "true").hide();
        });
      }
    });
  };
  footerMoreCaution();

  //LGEMS-434 Start
  const b2bObsTargetFooter = function () {
    var $nav = $(".navigation");
    var bizType = $nav && $nav.hasClass("b2b") ? "B2B" : "B2C";
    var showPlag = false;
    if (bizType == "B2B" && COUNTRY_CODE == "mx") {
      if ($("#b2b-footer-show-obs-target-url").length > 0) {
        var curPath = window.location.pathname;
        var arrTarget = $("#b2b-footer-show-obs-target-url").val().split(",");
        arrTarget.forEach(function (item, index) {
          if (curPath.endsWith(item)) showPlag = true;
        });

        if (!showPlag) {
          if ($(" .footer-contents.cs-area").length > 0)
            $(" .footer-contents.cs-area").hide();
          if ($(" .footer-contents-box.contents-top").length > 0)
            $(" .footer-contents-box.contents-top").hide();
        }
      }
    }
  };
  b2bObsTargetFooter();
  //LGEMS-434 End

  // LGEGMC-5364 Start
  if ($("#renewal_info_guid").length) {
    // check ethics popup
    $('a[data-link-area="footer-jeongdo_management"]')
      .off("click")
      .on("click", function (e) {
        if ($(this).attr("href") === "#none") {
          // check none link
          e.preventDefault();
          $("#renewal_info_guid").modal("show");
        }
      });
  }
  // LGEGMC-5364 End
})(jQuery);

// LGEGMC-4249 Start :: share-common 로직 안에 있던 Clipboard 로직 export
const initCopyToClipboard = function () {
  window.Clipboard = (function (window, document, navigator) {
    var textArea, copy;

    // LGEBR-914 Start
    // iOS check bug fixed
    function isOS() {
      var iOS =
        navigator.userAgent.match(/ipad|iphone|mac/i) != null ? true : false;
      return iOS;
    }
    // LGEBR-914 Start

    function createTextArea(text) {
      textArea = document.createElement("textArea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.opacity = "0.0001";
      textArea.style.width = "100%";
      textArea.style.height = "100%";
      textArea.style.padding = "0";
      textArea.style.pointerEvents = "none";
      textArea.style.fontSize = "16px";

      document.body.appendChild(textArea);
    }

    function selectText() {
      var range, selection;

      if (isOS()) {
        range = document.createRange();
        range.selectNodeContents(textArea);
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        textArea.setSelectionRange(0, 999999);
      } else {
        textArea.select();
      }
    }

    function copyToClipboard() {
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }

    copy = function (text) {
      createTextArea(text);
      selectText();
      copyToClipboard();
    };
    return {
      copy: copy,
    };
  })(window, document, navigator);
};
// LGEGMC-4249 End

// Share
(function ($) {
  if (
    !document.querySelector(".share-common") &&
    !document.getElementById("modal_help_library")
  )
    return false;
  initShareCommon = function () {
    var shareObj = $(".share-common");
    var sharePrint = shareObj.find(".article-print");
    var shareEmail = shareObj.find(".article-email");
    var shareLink = shareObj.find(".article-link");
    var shareSms = shareObj.find(".article-sms");
    //share
    var shareFB = shareObj.find(".share-facebook");
    var shareTW = shareObj.find(".share-twitter");
    var sharePI = shareObj.find(".share-pinterest");
    var shareVK = shareObj.find(".share-vk");
    var shareOK = shareObj.find(".share-ok");
    var shareLI = shareObj.find(".share-linkedin");
    var shareWB = shareObj.find(".share-weibo");
    var shareWE = shareObj.find(".share-wechat");
    //question section
    var shareModal = $("#modal_resource_search_copylink");

    // for touch device
    if ("ontouchstart" in document.documentElement) {
      shareObj
        .find(".external-link.mobile-only")
        .css("display", "inline-block");
    }

    // for wechat
    if (shareWE.length > 0) {
      if (
        typeof ePrivacyCookies == "undefined" ||
        ePrivacyCookies.get("LGCOM_SOCIAL_MEDIA")
      ) {
        window._bd_share_config = {
          common: {
            bdSnsKey: {},
            bdText: $(".bdsharebuttonbox").data("text"),
            bdMiniList: !1,
            bdUrl: $(".bdsharebuttonbox").data("url"),
            bdPic: "",
            bdSize: "32",
          },
          share: {},
        };
        with (document)
          (0)[
            ((getElementsByTagName("head")[0] || body).appendChild(
              createElement("script")
            ).src =
              "/cn/baidumap/baiduShare-master/static/api/js/share.js?v=89860593.js")
          ];
      }
    }

    $(document)
      .on("click", "[type=submit][form]", function (event) {
        event.preventDefault();
        var formId = $(this).attr("form"),
          $form = $("#" + formId).submit();
      })
      .on("keypress", "form input", function (event) {
        var $form;
        if (event.keyCode == 13) {
          $form = $(this).parents("form");
          if (
            $form.find("[type=submit]").length == 0 &&
            $("[type=submit][form=" + $(this).attr("form") + "]").length > 0
          ) {
            $form.submit();
          }
        }
      });

    // adobe
    function adobeShare(obj, name) {
      // for PDP
      if ($(".GPC0009").length > 0) {
        adobeTrackEvent("share-print", {
          products: [
            {
              sales_model_code: $(".GPC0009").data("adobe-salesmodelcode"),
              model_name: $(".GPC0009").data("adobe-modelname"),
            },
          ],
          social_service_name: name,
          page_event: { sns_share: true },
        });
      } else {
        adobeTrackEvent("sns-share", {
          social_service_name: name,
          page_event: { sns_share: true },
        });
      }
    }
    sharePrint.off("click").on("click", function (e) {
      e.preventDefault();
      adobeShare($(this), "print");
      window.print();
    });
    shareEmail.off("click").on("click", function (e) {
      e.preventDefault();
      adobeShare($(this), "email");
      var title = encodeURIComponent(document.title),
        hashCheck = new RegExp(/\#$/g);
      if (hashCheck.test(location.href)) {
        url = encodeURIComponent(location.href.replace(/\#$/g, ""));
      } else {
        url = encodeURIComponent(location.href);
      }

      if (
        $(this).closest(".modal").length > 0 &&
        $(this).parent().find(".article-link").length > 0
      ) {
        // help library in modal (ex. symptoms)
        url = $(this).parent().find(".article-link").attr("data-url");
      }

      var mailto = "mailto:?subject=" + title + "&body=" + url;
      location.href = mailto;
    });
    shareLink.off("click").on("click", function (e) {
      e.preventDefault();
      initCopyToClipboard(); // LGEGMC-4249
      adobeShare($(this), "link");
      // copyUrl:pdp/plp, url:support/product-help-detailView
      url =
        $(this).data("copyUrl") != undefined
          ? $(this).data("copyUrl")
          : $(this).data("url"); // LGEBR-914, LGESA-349
      Clipboard.copy(url);
      shareModal.find(".modal-url").text(url);
    });
    shareSms.off("click").on("click", function (e) {
      e.preventDefault();
      adobeShare($(this), "sms");
    });
    shareFB.off("click").on("click", function (e) {
      e.preventDefault();
      adobeShare($(this), "facebook");
      url = $(this).data("url");
      sendShareFb(url);
    });
    shareTW.off("click").on("click", function (e) {
      e.preventDefault();
      adobeShare($(this), "twitter");
      url = $(this).data("url");
      title = $(this).data("title");
      via = $(this).data("via");

      // converting short Url script
      var shortUrl = e.currentTarget.getAttribute("data-short-url");
      if (shortUrl && shortUrl != null) {
        sendShareTw(shortUrl, title, via);
      } else {
        var ajaxData = $(this).closest(".sns-share").data();
        if (ajaxData.paramName) {
          var shortUrlParam = ajaxData.paramName + "=" + url;
          var ajaxUrl = "https://www.lg.com/common/shorturl/getShortUrl.lgajax";
          if (ajaxData.getUrl) {
            ajaxUrl = ajaxData.getUrl;
          }
          $.ajax({
            type: "GET",
            timeout: 5e4,
            url: ajaxUrl,
            data: shortUrlParam,
            dataType: "jsonp",
            jsonp: "callback",
            success: $.proxy(function (data) {
              sendShareTw(data.shortUrl, title, via);
              //console.log(data);
            }, this),
          });
        } else {
          sendShareTw(url, title, via);
        }
      }
    });
    sharePI.off("click").on("click", function (e) {
      e.preventDefault();
      adobeShare($(this), "pinterest");
      url = $(this).data("url");
      title = $(this).data("title");
      image = $(this).data("image");
      sendSharePi(url, title, image);
    });
    shareVK.off("click").on("click", function (e) {
      e.preventDefault();
      adobeShare($(this), "vk");
      url = $(this).data("url");
      title = $(this).data("title");
      sendShareVk(url, title);
    });
    shareOK.off("click").on("click", function (e) {
      e.preventDefault();
      adobeShare($(this), "ok");
      url = $(this).data("url");
      sendShareOk(url);
    });
    shareLI.off("click").on("click", function (e) {
      e.preventDefault();
      adobeShare($(this), "linkedin");
      url = $(this).data("url");
      sendShareLi(url);
    });
    shareObj
      .find(".share-linkdin")
      .off("click")
      .on("click", function (e) {
        e.preventDefault();
        adobeShare($(this), "linkedin");
        url = $(this).data("url");
        sendShareLi(url);
      });
    shareWB.off("click").on("click", function (e) {
      e.preventDefault();
      adobeShare($(this), "weibo");
      url = $(this).data("url");
      title = $(this).data("title");
      image = $(this).data("image");
      sendShareWb(url, title, image);
    });
    var nIntervId;
    shareWE.off("click").on("click", function (e) {
      // Only CN
      e.preventDefault();
      adobeShare($(this), "wechat");

      if (
        typeof ePrivacyCookies == "undefined" ||
        ePrivacyCookies.get("LGCOM_SOCIAL_MEDIA")
      ) {
        url = $(this).data("url");
        text = $(this).data("text");
        $("body").trigger("ajaxLoadBefore");

        // 20200429 START 박지영 - JSLint 수정
        var loadDOM = function () {
          if ($("#bdshare_weixin_qrcode_dialog").length > 0) {
            clearInterval(nIntervId);
            newWindow(true);
          }
        };
        var newWindow = function (isFirst) {
          $("#bdshare_weixin_qrcode_dialog")
            .find(".bd_weixin_popup_close")
            .hide();
          if (isFirst) {
            $("#bdshare_weixin_qrcode_dialog")
              .css({
                position: "static",
                left: 0,
                top: 0,
                width: "auto",
                height: "auto",
              })
              .wrapAll("<div />");
          }
          var myWindow,
            htmlTag = "";
          if ("ontouchstart" in window) {
            myWindow = window.open("", "_blank");
            htmlTag +=
              '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, minimal-ui">';
          } else {
            var popupX = window.screen.width / 2 - 300 / 2;
            var popupY = window.screen.height / 2 - 330 / 2;
            myWindow = window.open(
              "",
              "wechat",
              "directories=no, menubar=no, status=no, location=no, toolbar=no, width=300, height=330, left=" +
                popupX +
                ", top=" +
                popupY
            );
          }
          myWindow.document.getElementsByTagName("html")[0].innerHTML = "";

          htmlTag += "<title>Wechat</title>";
          htmlTag +=
            '<link rel="stylesheet" type="text/css" href="http://bdimg.share.baidu.com/static/api/css/weixin_popup.css"></head>';
          htmlTag += $("#bdshare_weixin_qrcode_dialog").parent("div").html();

          myWindow.document.getElementsByTagName("html")[0].innerHTML = htmlTag;

          setTimeout(function () {
            $("#bdshare_weixin_qrcode_dialog").addClass("hide");
            // LGEITF-757
            if ($("#bdshare_weixin_qrcode_dialog_bg").length > 0) {
              $("#bdshare_weixin_qrcode_dialog_bg").hide();
            }
            $("body").trigger("ajaxLoadEnd");
          }, 300);
        };
        // 20200429 END
        if ($("#bdshare_weixin_qrcode_dialog").length == 0 && !nIntervId) {
          if (typeof window._bd_share_main == "object") {
            nIntervId = setInterval(loadDOM, 1000);
          } else {
            console.log("Error : Failed to load share.js.");
            $("body").trigger("ajaxLoadEnd");
          }
        } else {
          newWindow(false);
        }
      } else {
        ePrivacyCookies.view("click");
      }
    });

    function openSns(url) {
      // 20200309 START 박지영 - sns share 레이어 띄울때 쿠키를 사용하지 않으므로 아래 내용 변경
      //if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_SOCIAL_MEDIA')) {
      // Cookie 사용 가능 시 실행할 스크립트
      var winObj;
      var popupX = window.screen.width / 2 - 600 / 2;
      var popupY = window.screen.height / 2 - 800 / 2;
      winObj = window.open(
        url,
        "New Window",
        "width=600, height=800,scrollbars=yes, left=" +
          popupX +
          ", top=" +
          popupY
      );
      // 20200427 박지영 - SNS 팝업 띄우고 나면 레이어 닫기
      // if($('.sns-area .list').length>0) $('.sns-area .list').removeClass('active'); //PJTPLP-10 SNS툴팁 유지
      // 20200427 END
      //} else {
      // Cookie 사용 불가
      // - click : 고정값
      //	ePrivacyCookies.view('click');
      //}
      // 20200309 END
    }

    function sendShareFb(url) {
      var shareurl = url ? url : document.location.href;
      url = "http://www.facebook.com/sharer/sharer.php?u=" + shareurl;
      openSns(url);
    }

    function sendShareTw(url, title, via) {
      var shareurl = url ? url : document.location.href;
      var text = title ? title : $("head title").text();
      var via2 = via ? via : "LGUS";
      url =
        "https://twitter.com/intent/tweet?url=" +
        shareurl +
        "&text=" +
        encodeURIComponent(text) +
        "&via=" +
        via2;
      openSns(url);
    }

    function sendSharePi(url, title, image) {
      var shareurl = url ? url : document.location.href;
      var text = title ? title : $("head title").text();
      var img = image ? image : $("meta[property='og:image']").attr("content");
      url =
        "http://www.pinterest.com/pin/create/button/?url=" +
        encodeURIComponent(shareurl) +
        "&media=" +
        encodeURIComponent(img) +
        "&description=" +
        encodeURIComponent(text);
      openSns(url);
    }

    function sendShareVk(url, title) {
      var shareurl = url ? url : document.location.href;
      var text = title ? title : $("head title").text();
      url =
        "https://share.yandex.net/go.xml?service=vkontakte&url=" +
        shareurl +
        "&title=" +
        encodeURIComponent(text);
      openSns(url);
    }

    function sendShareOk(url) {
      var shareurl = url ? url : document.location.href;
      url =
        "https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=" +
        shareurl +
        "&feature=share";
      openSns(url);
    }

    function sendShareLi(url) {
      var shareurl = url ? url : document.location.href;
      url = "https://www.linkedin.com/shareArticle?url=" + shareurl;
      openSns(url);
    }

    function sendShareWb(url, title, image) {
      var shareurl = url ? url : document.location.href;
      var text = title ? title : $("head title").text();
      var img = image ? image : $("meta[property='og:image']").attr("content");
      url =
        "http://service.weibo.com/share/share.php?title=" +
        text +
        "&url=" +
        shareurl +
        "&pic=" +
        img;
      openSns(url);
    }

    //PLTPJP-4 개선으로 다르게 이벤트 처리 GPC0007::GPC0026
    if (
      shareObj.find(".sns-inner ul.sns-share").length > 0 &&
      !(
        shareObj.parents(".GPC0007").length > 0 ||
        shareObj.parents(".GPC0026").length > 0 ||
        shareObj.parents(".GPC0009").length > 0 ||
        shareObj.parents(".GPC0132").length > 0 ||
        shareObj.parents(".GPC0134").length > 0 ||
        shareObj.parents(".GPC0142").length > 0
      )
    ) {
      // for layer
      shareObj
        .find(".sns-inner ul.sns-share li:last-child a")
        .on("blur", function () {
          $(this).closest(".list").removeClass("active");
        });
    }
    //PJTPLP-10 GILS GPC0009 SNS툴팁 유지하기 위해 위 소스 GPC0026 추가

    /* LGECN-214 Start */
    if (COUNTRY_CODE.toLowerCase() == "cn") {
      shareObj
        .find(".sns-share a")
        .off("click.shareBtn")
        .on("click.shareBtn", function (e) {
          var social_platform = $(this).text();
          if (!!$(this).closest(".GPC0009").length) {
            baiduTrackEvent("share", $(this).closest(".GPC0009"), "PDP", {
              list_name: $lg_cggroup,
              social_platform: social_platform,
            });
          } else if (!!$(this).parents().find(".GPC0007").length) {
            baiduTrackEvent(
              "share",
              $(this).closest(".sns-share").closest("li"),
              "PLP",
              { list_name: $lg_cggroup, social_platform: social_platform }
            );
          }
        });
    }
    /* LGECN-214 End */
  };
  initShareCommon();
})(jQuery);

// LGEGMC-4249 Start :: copy model name in plp, pdp
(function ($) {
  const isPDP = document.querySelector(".GPC0009") ? true : false;
  const copyModelNameArea =
    isPDP ||
    document.querySelector(".GPC0007") ||
    document.querySelector(".GPC0026")
      ? true
      : false;
  if (!copyModelNameArea) return false;

  initCopyToClipboard();

  // set default msg code text
  $(".copy-model-name").each(function () {
    const defaultTitle = "Copy Model Name";
    if ($("#copyModelNameText").val() === "component-copyModelName")
      $(this).attr("title", defaultTitle).text(defaultTitle);
  });

  // set toast popup
  const $copyToast = $("#copyModelNameToast");
  const toastDelay = $("#copyModelToastDelay").val();
  const toastMsg = $("#copyModelToastMsg").val();
  const defaultToastMsg = "The model name has been copied.";
  if (toastDelay === "component-copyModel-toastDelay")
    $copyToast.attr("data-delay", "3000");
  if (toastMsg === "component-copyModel-toastMsg")
    $copyToast.find(".toast-body").text(defaultToastMsg);

  $(document).on("click", ".copy-model-name", function (e) {
    e.preventDefault();
    const modelName = isPDP
      ? $(this).parents(".model-name").data("modelName")
      : $(this).parents(".sku").data("modelName");
    Clipboard.copy(modelName);
    $copyToast.attr("aria-atomic", "true");
    $copyToast.toast("show");

    /* LGEGMCGA-31 Start */
    if (
      $(this).closest(".GPC0007").length > 0 ||
      $(this).closest(".GPC0009").length > 0
    ) {
      // PLP, PDP 일 경우
      let $item = null;
      if ($(this).closest(".GPC0007").length > 0) {
        $item = $(this).closest(".item");
      } else if ($(this).closest(".GPC0009").length > 0) {
        $item = $(this).closest(".GPC0009");
      }
      if ($item !== null) {
        window.dataLayer.push({
          event: "model_copy_button_click",
          bu: $item.find("[data-bu]").data("bu"),
          superCategory: $item
            .find("[data-super-category-name]")
            .data("super-category-name"),
          category: $item.find("[data-category-name]").data("category-name"),
          subcategory: $item
            .find("[data-sub-category-name]")
            .data("sub-category-name"),
          modelYear: $item.find("[data-model-year]").data("model-year"),
          modelName: $item.find("[data-model-name]").data("model-name"),
          modelCode: $item.find("[data-model-id]").data("model-id"),
          salesModelCode: $item
            .find("[data-model-salesmodelcode]")
            .data("model-salesmodelcode"),
          sku: $item.find("[data-sku]").data("sku"),
          suffix: $item
            .find("[data-model-suffixcode]")
            .data("model-suffixcode"),
          price: $item.find("[data-price]").data("price"),
          currencyCode: $(".currency-code").val(),
        });
      }
    }
    /* LGEGMCGA-31 End */
  });

  $copyToast.find(".btn-close").click(function () {
    $copyToast.attr("aria-atomic", "false");
    $copyToast.toast("hide");
  });
})(jQuery);
// LGEGMC-4249 End

// Script to run before and After Printing
(function () {
  // Script to run before printing
  var beforePrint = function () {
    // lazyload image
    if ($("img.lazyload").length > 0) {
      $("img.lazyload").each(function () {
        $(this)
          .attr("src", $(this).data("src"))
          .removeClass("lazyload")
          .addClass("lazyloaded");
      });
    }
  };
  // Script to run after printing
  var afterPrint = function () {
    // alert('Functionality to run after printing');
  };
  if (window.matchMedia) {
    var mediaQueryList = window.matchMedia("print");
    mediaQueryList.addListener(function (mql) {
      if (mql.matches) {
        beforePrint();
      } else {
        afterPrint();
      }
    });
  }
  window.onbeforeprint = beforePrint;
  window.onafterprint = afterPrint;
})();

// LGEGMC-3436 Start
const personalToastUseFlag =
  $("header").data("personal-toast") !== undefined &&
  $("header").data("personal-toast") === "Y"
    ? true
    : false; // LGEGMC-4874
const personalBannerUseFlag =
  $("header").data("personal") !== undefined &&
  $("header").data("personal") === "Y"
    ? true
    : false;
// LGEGMC-3777 Start
const UTM_SESSION_PARAM = COUNTRY_CODE + "_utmSessionParam";
const ENTRY_UTM = COUNTRY_CODE + "_entryUtm";
const UTM_CTA_ACTION = COUNTRY_CODE + "_utmCtaAction";

let eCrmFlag = false;
let eCrmParam;
if (sessionStorage.getItem(ENTRY_UTM))
  eCrmParam = sessionStorage.getItem(UTM_SESSION_PARAM);
else eCrmParam = getUrlParams().utm_campaign;

const UTM_MOVE_COUNTER = COUNTRY_CODE + "_utmMoveCounter_" + eCrmParam;
let registerButton = false;
// LGEGMC-3777 End

let userPersonal = null;
const PERSONAL_BANNER = COUNTRY_CODE + "_personalBanner";
const PERSONAL_FIRST = COUNTRY_CODE + "_personalFirst";

const gnbPersonal = {
  now: new Date(),
  enteredAjax: false, // 초기 로드시 진입 여부
  init: function () {
    if (personalBannerUseFlag) gnbPersonal.checkExistStorage();
  },
  getPersonal: function () {
    userPersonal = JSON.parse(localStorage.getItem(PERSONAL_BANNER));
  },
  setPersonal: function (personal) {
    localStorage.setItem(PERSONAL_BANNER, JSON.stringify(personal));
  },
  removeFirstSession: function () {
    if (sessionStorage.getItem(PERSONAL_FIRST))
      sessionStorage.removeItem(PERSONAL_FIRST);
  },
  checkExistStorage: function () {
    const self = this;
    if (localStorage.getItem(PERSONAL_BANNER) === null) {
      // first visit or removed storage
      sessionStorage.setItem(PERSONAL_FIRST, true); // 신규 방문 여부
      // LGEITF-732 Start
      if (ISMS || !String.prototype.padStart) {
        String.prototype.padStart = function padStart(targetLength, padString) {
          if (this.length >= targetLength) {
            return String(this);
          } else {
            if (padString == null || padString == " ") {
              padString = " ";
            } else if (padString.length > 1) {
              padString = padString.substring(0, 1);
            }
            targetLength = targetLength - this.length;
            var prefix = "";
            for (var i = 0; i < targetLength; i++) {
              prefix += padString;
            }
            return prefix + String(this);
          }
        };
      }
      // LGEITF-732 End
      const formatDate = [
        self.now.getFullYear() + 1,
        String(self.now.getMonth() + 1).padStart(2, "0"),
        String(self.now.getDate()).padStart(2, "0"),
      ];
      const baseInfo = {
        membership: false, // 회원가입 여부
        usedCoupon: false,
        expiry: self.now.getTime() + 31536000, // + seceonds of 365days
        expired: formatDate.slice(",").join("-"), // for readability
      };
      self.setPersonal(baseInfo);
      return true;
    } else {
      self.getPersonal();
      if (self.now.getTime() > userPersonal.expiry) {
        localStorage.removeItem(PERSONAL_BANNER);
        return false;
      }
      return true;
    }
  },
  update: function (name, val) {
    const self = this;
    if (self.checkExistStorage()) {
      userPersonal[name] = val;
      userPersonal.membership = true;
      self.setPersonal(userPersonal);
    }
  },
};
gnbPersonal.init();

// motion detection : 30초 이상 행동 보이지 않을 시 회원가입 유도 토스트 팝업 노출
const personalToast = {
  holdTimeoutId: null,
  init: function () {
    if (
      location.hostname.indexOf("sso") === -1 &&
      sessionStorage.getItem("ACCESS_TOKEN") === "" &&
      !sessionStorage.getItem("TOAST_SIGNUP")
    ) {
      const self = this;

      const $toastMsg = $(".gnb-personalToast");
      const title = $toastMsg.data("tit");
      const body01 = $toastMsg.data("body01");
      const body02 = $toastMsg.data("body02");
      const btnText = $toastMsg.data("btn");
      const bodySignin = $toastMsg.data("signin");
      const close = $toastMsg.data("close");

      // LGEGMC-4874 Start
      const toastHtml =
        '<div class="toast toast-signup fade" id="toast_signup" role="dialog" aria-live="polite" aria-atomic="true" data-autohide="false">\
				<div class="toast-content">\
					<div class="toast-header">\
						<strong class="tit">' +
        title +
        '</strong>\
					</div>\
					<div class="toast-body">\
						<p>' +
        body01 +
        '</p>\
						<button type="button" class="link-text lg" data-dismiss="toast">' +
        body02 +
        '</button>\
					</div>\
					<div class="toast-footer">\
						<a href="/' +
        COUNTRY_CODE +
        '/my-lg/login?page=signup" class="btn btn-primary">' +
        btnText +
        '</a>\
					</div>\
					<div class="toast-body mt-3">' +
        bodySignin +
        '</div>\
					<button type="button" class="btn-close" data-dismiss="toast" aria-label="Close"><span class="sr-only">' +
        close +
        "</span></button>\
				</div>\
			</div>";
      $(".iw_viewport-wrapper").after(toastHtml);
      // LGEGMC-4874 End

      self.callToast();
      self.addEvent();
    }
  },
  clearToast: function () {
    const self = this;
    if (self.holdTimeoutId) clearTimeout(self.holdTimeoutId);
  },
  callToast: function () {
    const self = this;
    personalToast.clearToast();
    self.holdTimeoutId = setTimeout(function () {
      $("#toast_signup").toast("show");
      dataLayer.push({ event: "signupPopup" }); // LGEGMCGA-18
      sessionStorage.setItem("TOAST_SIGNUP", true);
    }, 30000);
  },
  addEvent: function () {
    // motion detection
    $(document).on(
      "mousemove keyup touchmove touchend touchcancel",
      function () {
        if (!sessionStorage.getItem("TOAST_SIGNUP")) personalToast.callToast();
      }
    );

    // 브라우저를 최소화 or tab 이동 후 재진입하면 timer 리셋
    $(document).on("visibilitychange", function () {
      if (!sessionStorage.getItem("TOAST_SIGNUP")) {
        if (document.hidden) personalToast.clearToast();
        else personalToast.callToast();
      }
    });
  },
};
// LGEGMC-3436 End

//PJTTOPOP-1 START
const welcomeToastUseFlag =
  $("header").data("welcome-toast") !== undefined &&
  $("header").data("welcome-toast") === "Y"
    ? true
    : false;

const welcomeToast = {
  holdTimeoutId: null,
  init: function () {
    if (
      location.hostname.indexOf("sso") === -1 &&
      $(".gnb-welcomeToast").data("toast-id") !== undefined
    ) {
      //기본 값들 세팅인데 확인해보기

      //gnbWelcomeToast.getWelcomeToast();

      var isMember =
        sessionStorage.getItem("ACCESS_TOKEN") === "" ? false : true;
      var $welcomeToastMsg = $(".gnb-welcomeToast");

      let toastIdList = [];
      let storageId = sessionStorage.getItem("TOAST_ID");
      let selected = "";
      if (
        sessionStorage.getItem("TOAST_ID") != null &&
        sessionStorage.getItem("TOAST_ID") !== undefined &&
        sessionStorage.getItem("TOAST_ID") != ""
      ) {
        $('[id^="TP"]').each(function (index, item) {
          toastIdList.push(item.id);
        });

        var k = 0;
        for (var i in toastIdList) {
          if (toastIdList[i] == storageId) {
            var j = parseInt(i) + 1;
            console.log(j);
            selected = toastIdList[j];
            k = parseInt(k) - 1;
            break;
          } else if (toastIdList[i] != storageId) {
            k = parseInt(k) + 1;
          }
        }
        if (parseInt(k) > parseInt(i) && toastIdList.length > 0) {
          $welcomeToastMsg = $(".gnb-welcomeToast");
        } else {
          if (selected === undefined || selected == "") {
            return false;
          } else {
            var $welcomeToastMsg = $("#" + selected);
          }
        }
      }

      if (
        ($welcomeToastMsg.data("member-type") === "member" && !isMember) ||
        ($welcomeToastMsg.data("member-type") !== "member" && isMember)
      ) {
        return false;
      }
      const self = this;
      const toastId = $welcomeToastMsg.data("toast-id");
      const title = $welcomeToastMsg.data("text01");
      const body01 = $welcomeToastMsg.data("text02");
      const btnText = $welcomeToastMsg.data("text03");
      const btnUrl = $welcomeToastMsg.data("btn-url");
      const btnTarget = $welcomeToastMsg.data("window-open");
      const toastElapse = $welcomeToastMsg.data("elapsed-time") * 1000;
      const toastLimit = $welcomeToastMsg.data("timelimit01");
      //PC 버전
      const imgUrlDesktop = $welcomeToastMsg.data("img-url");
      const imgAltTextDesktop = $welcomeToastMsg.data("img-alt");
      const imgUrlMobile = $welcomeToastMsg.data("img-mobile-url");
      const imgAltTextMobile = $welcomeToastMsg.data("img-mobile-alt");
      var isMobile = $("header.navigation").is(".mobile-device");

      var visualType =
        $welcomeToastMsg.data("visual-type") == "Y"
          ? "img-box"
          : "img-box out-img";
      var imgUrl = "";
      var imgUrlAlt = "";
      if (isMobile && $(window).width() < 768) {
        imgUrl = imgUrlMobile;
        imgUrlAlt = imgAltTextMobile;
      } else {
        imgUrl = imgUrlDesktop;
        imgUrlAlt = imgAltTextDesktop;
      }

      // LGEPA-930 start
      var toastCountdownTextFront = "";
      var toastCountdownTextEnd = "";
      if ($welcomeToastMsg.data("toast-countdown-text-front") !== null)
        toastCountdownTextFront = $welcomeToastMsg.data(
          "toast-countdown-text-front"
        );
      if ($welcomeToastMsg.data("toast-countdown-text-end") !== null)
        toastCountdownTextEnd = $welcomeToastMsg.data(
          "toast-countdown-text-end"
        );
      // LGEPA-930 End

      // LGEPA-930 : It closes automatically after -> toastCountdownTextFront, seconds -> toastCountdownTextEnd
      // LGEGMC-4874 Start
      const welcomeToastHtml =
        '<div class="toast toast-coupon fade" id="toast_coupon" role="dialog" aria-live="polite" aria-atomic="true" data-autohide="false">\
				<div class="toast-content">\
					<div class="toast-header">\
						<div class="' +
        visualType +
        '">\
							<img src="' +
        imgUrl +
        '" alt="' +
        imgUrlAlt +
        '" aria-hidden="true" class="baseImg lazyloaded" data-loaded="true">\
							<div class="out-act">\
								<img class="pc lazyloaded" src="' +
        imgUrlDesktop +
        '" aria-hidden="true" alt="' +
        imgAltTextDesktop +
        '" data-loaded="true">\
								<img class="mobile lazyload" src="' +
        imgUrlMobile +
        '" aria-hidden="true" alt="' +
        imgAltTextMobile +
        '" data-loaded="true">\
							</div>\
						</div>\
						<strong class="tit">' +
        title +
        '</strong>\
					</div>\
					<div class="toast-body">\
						<p>' +
        body01 +
        '</p>\
					</div>\
					<div class="toast-footer">\
						<a href="' +
        btnUrl +
        '" target="' +
        btnTarget +
        '" class="btn btn-primary">' +
        btnText +
        '</a>\
					</div>\
					<button type="button" class="btn-close" data-dismiss="toast" aria-label="Close"><span class="sr-only"></span></button>\
					</div>\
					<div class="toast-count">\
						' +
        toastCountdownTextFront +
        ' <span class="carmine count-timer" id="count" role="timer" aria-live="off">' +
        toastLimit +
        "</span> " +
        toastCountdownTextEnd +
        ".\
					</div>\
			</div>";
      $(".iw_viewport-wrapper").after(welcomeToastHtml);
      // LGEGMC-4874 End

      self.callToast(toastId, toastElapse);
      self.addEvent();
    }
  },
  clearToast: function () {
    const self = this;
    if (self.holdTimeoutId) clearTimeout(self.holdTimeoutId);
  },
  startCount: function (timerName) {
    let timer = document.getElementById(timerName);
    let seconds = parseInt(timer.innerText);
    timer.innerText = --seconds;
    if (seconds != 0) {
      setTimeout(function () {
        welcomeToast.startCount(timerName);
      }, 1000);
    } else if (seconds == 0) {
      welcomeToast.clearToast();
      $("#toast_coupon").attr("aria-atomic", false);
      $("#toast_coupon").toast("hide");
    }
  },
  callToast: function (toastId, toastElapse) {
    const self = this;
    welcomeToast.clearToast();
    self.holdTimeoutId = setTimeout(function () {
      $("#toast_coupon").toast("show");
      //dataLayer.push({'event': 'signupPopup'}); // LGEGMCGA-18
      sessionStorage.setItem("TOAST_ID", toastId);
      setTimeout(function () {
        welcomeToast.startCount("count");
      }, 1000);
    }, toastElapse); // 지금 30초 test용 elapse
  },
  addEvent: function () {
    // motion detection
    $(document).on(
      "mousemove keyup touchmove touchend touchcancel",
      function () {
        if (!sessionStorage.getItem("TOAST_ID")) welcomeToast.callToast();
      }
    );
  },
};
// PJTTOPOP-1

// Scripts that dynamically call markup
//LGEPJTEMP-25
(function ($) {
  if (!document.querySelector(".ajax-call-area")) return false;
  // usage
  // <div class="ajax-call-area" data-ajax-url="./mylg-index-partials-myrepair-requests.html" data-ajax-loading="coupon-area">
  // default html
  // </div>
  const ajaxCallDynamically = function () {
    const $obj = $(".ajax-call-area");
    $obj.each(function () {
      const $thisArea = $(this);
      const url = $thisArea.data("ajax-url");
      if (url !== "") {
        ajax.noCacheCall(
          url,
          {},
          "html",
          function (data) {
            if ($('[name="empUseFlag"]').val() == "Y") {
              $thisArea.html(xssfilter(data, "html").replace(/\#39/gi, "'"));
            } else {
              $thisArea.html(xssfilter(data, "html"));
            }
            /* LGEBR-1296 S*/
            if (
              url.indexOf("retrieveMyOrder.lgajax") > -1 &&
              (location.hash == "#my-order" || getCookie("LG5_my_order") == "Y")
            ) {
              var offset = $thisArea.find(".my-orders").offset();
              $("html, body").animate({ scrollTop: offset.top }, 300);
              $.removeCookie("LG5_my_order", { domain: ".lg.com", path: "/" });
            }
            /* LGEBR-1296 E*/
          },
          commonSendType,
          $thisArea.get(0),
          false
        );
        // async: false
      }
    });
  };
  ajaxCallDynamically();
})(jQuery);

// ESC key control
(function () {
  $(document).keyup(function (e) {
    if (e.keyCode == 27) {
      // escape key maps to keycode `27`
      // Close GNB Layer
      $(
        ".navigation .for-desktop ul.depth1 li>a, .navigation .for-desktop ul.depth2 li>a, .navigation .gnb-login, .navigation .gnb-search-layer, .navigation .for-mobile .menu .menu-wrap"
      ).removeClass("active");
      $(".navigation .for-mobile .menu").removeClass("open");
      // Close Search Layer
      $(".search-area .search-layer").removeClass("active");
      // Close Tooltip Layer
      $(".tooltip-area").removeAttr("style");
      // video layer
      $(".video-modal").remove();
      // LGEGMC-4167, LGEITF-849 Start :: Remove User Icons dot
      if (
        sessionStorage.getItem(THINQ_REGISTER_PRODUCT_FLAG) === "Y" &&
        thinqRegisterProduct.openedGnbLoginMenu()
      )
        thinqRegisterProduct.removeDot();
      // LGEGMC-4167, LGEITF-849 End
    }
  });
})();

// HTML Open Error
function htmlOpenError(htmldowntime, htmlopentime) {
  if ($("#htmlOpenError").length > 0) {
    if (htmldowntime)
      $("#htmlOpenError .htmldowntime").html(xssfilter(htmldowntime));
    if (htmlopentime)
      $("#htmlOpenError .htmlopentime").html(xssfilter(htmlopentime));
    $("#htmlOpenError").modal();
  }
}

// pagination branch
var isMobile;
(function ($) {
  isMobile = $("header.navigation").is(".mobile-device");
  var $pagination = $(".pagination"),
    $expander = $(".expander");
  if ($pagination.length > 0 && $expander.length > 0) {
    // 20200429 START 박지영 - 768 미만에서만 expander 사용 (for iPad)
    if (isMobile && $(window).width() < 768) {
      $pagination.hide();
      if ($pagination.find("ul li").length > 1) $expander.show();
    } else {
      $pagination.show();
      $expander.hide();
    }
    // 20200429 END
  }
})(jQuery);

// fbq function - where to buy button
(function ($) {
  var loadFbqJs = function (cookieCheck) {
    /* LGCOMSPEED-6(7th) Start */
    function retrieveEprivacyCookie(url) {
      ajax.call(
        url,
        { pageUrl: window.location.pathname },
        "json",
        function (data) {
          if (data.data[0].pixelUrlFlag.pixelUrlFlag == "Y") {
            USE_FBQ = true;
          } else {
            USE_FBQ = false;
          }
          /*LGEIS-10 20200327, LGEMS-12 20200423 add*/
          if (data.data[0].pixelUrlFlag.pixelUrlType !== "") {
            USE_NEW_FBQ = data.data[0].pixelUrlFlag.pixelUrlType;
          } else {
            USE_NEW_FBQ = "";
          }
          /*//LGEIS-10 20200327 , LGEMS-12 20200423 add*/

          // 20200611 START 박지영 - IE main 에서 path 추가된 쿠키 잘 안 읽히는 case 예외 처리
          if (data.data[0].homeUseCookieList !== undefined) {
            var clist = data.data[0].homeUseCookieList;
            addHomeCookie(clist);
          }
          // 20200611 END

          // LGEITF-182 Start
          if (data.data[0].treasureDataFlag) {
            treasureDataFlag = data.data[0].treasureDataFlag;
          }
          // LGEITF-182 End
        }
      );
    }
    /* LGCOMSPEED-6(7th) End */
    var run = function () {
      // Some pages require you to execute the fbq function when you click the where to buy button.
      if (
        typeof ePrivacyCookies == "undefined" ||
        ePrivacyCookies.get("LGCOM_ADVERTISING")
      ) {
        if (!USE_FBQ) {
          var url = $(".navigation").data("fbq-url");
          if (!!url && url != "") {
            /* 20201012 SSO domain 추가  */
            if (ISSSO) {
              $.ajax({
                type: "post",
                url: url,
                param: { pageUrl: window.location.pathname },
                dataType: "json",
                xhrFields: {
                  withCredentials: true,
                },
                success: function (data) {
                  if (data.data[0].homeUseCookieList !== undefined) {
                    var clist = data.data[0].homeUseCookieList;
                    addHomeCookie(clist);
                  }

                  // LGEITF-182 Start
                  if (data.data[0].treasureDataFlag) {
                    treasureDataFlag = data.data[0].treasureDataFlag;
                  }
                  // LGEITF-182 End
                },
                error: function (request, status, error) {
                  console.log("status: " + status);
                  console.log("error: " + error);
                },
              });
            } else {
              /* LGCOMSPEED-6(7th) Start */
              if ($("input[name=eprivacyCookieLazy]").val() === "Y") {
                let timerEprivacyCookie = null;
                function checkReadyState() {
                  if (document.readyState !== "complete") {
                    timerEprivacyCookie = setTimeout(checkReadyState, 100);
                  } else {
                    if (timerEprivacyCookie !== null)
                      clearTimeout(timerEprivacyCookie);
                    retrieveEprivacyCookie(url);
                  }
                }
                checkReadyState();
              } else {
                retrieveEprivacyCookie(url);
              }
              /* LGCOMSPEED-6(7th) End */
            }
          }
        }
      }
    };
    if (!cookieCheck) {
      // cookieCheck가 false이면 바로 실행
      run();
    } else {
      // cookieCheck가 true이면, eprivacy.js가 로드 된 후에 실행
      if (typeof ePrivacyCookies != "undefined") {
        run();
      } else {
        setTimeout(function () {
          loadFbqJs(true);
        }, 300);
      }
    }
  };
  if (!USE_FBQ) {
    if ($(".cookie-banner").length > 0) {
      var banner = $(".cookie-banner");
      if (
        banner.hasClass("agree-cookie") &&
        banner.data("privacy-type") == "static"
      ) {
        // 암묵적이면서 Static인 경우 쿠키 막지 않음
        loadFbqJs(false);
      } else if (
        banner.hasClass("agree-cookie") &&
        banner.data("privacy-type") == "strict"
      ) {
        // 암묵적이면서 Strict인 경우, eprivacy cookie setting 에 의해 막는 경우가 발생하기 때문에 체크를 위해 ePrivacyCookies가 존재 해야 함.
        if (typeof ePrivacyCookies == "undefined") {
          loadFbqJs(true);
        } else {
          loadFbqJs(false);
        }
      } else {
        // 쿠키 배너가 명시적인 경우는 e-privacy.js 의 controlCookieList 에서 가져온 json 내에 존재함.
      }
    } else {
      loadFbqJs(false);
    }
  }
})(jQuery);

// skip to contents
(function ($) {
  // init
  if ($("#content").length == 0) {
    var $navWrap = $(".navigation").closest(".container-fluid");
    var $navWrap2 = $(".navigation").closest(".iw_component");
    if ($navWrap.siblings(".container-fluid").length > 0) {
      var $target = $navWrap.next().find("div").not("div[id]").eq(0);
      if ($target.hasClass("add-filter")) $target = $target.next();
      $target.attr("id", "content");
    } else if ($navWrap2.siblings(".iw_component").length > 0) {
      var $target2 = $navWrap2.next().find("div").not("div[id]").eq(0);
      if ($target2.hasClass("add-filter")) $target2 = $target2.next();
      $target2.attr("id", "content");
    } else {
      var $target3 = $(".navigation")
        .next()
        .find("div")
        .not("div[id]")
        .not(".breadcrumb")
        .eq(0);
      $target3.attr("id", "content");
    }
  }
  if ($("#lgAccHelp").length == 0) {
    // 개발에서 web accessibility 페이지를 구분할 수 있는 방법이 없어서, 스크립트로 id 처리함.
    var link = $(
      'a[href="https://' +
        document.domain +
        "/" +
        $("html").data("countrycode") +
        '/webaccessibility"]'
    ).eq(0);
    link.attr("id", "lgAccHelp");
  }
  // click
  var $obj = $(".skip_nav a");
  $obj.off("off").on("click", function (e) {
    if ($(this).attr("href").indexOf("#") == -1) return true;
    e.preventDefault();
    if ($(this).closest(".navigation").length > 0) {
      // gnb
      $(this).closest("li").find(">a").removeClass("active");
    } else {
      // top
      var link = $(this).attr("href").split("#")[1];
      if ($("#" + link).length > 0) {
        //$('#'+link).eq(0).attr('tabindex', 0).focus();
        // $('#'+link).trigger('click');

        // LGECI-259 Start
        // if(link=='lgAccHelp') {
        // 	window.location.href = $('#lgAccHelp').attr('href');
        // } else {
        // LGECI-259 End
        $("#" + link)
          .eq(0)
          .attr("tabindex", 0)
          .focus();
        // } // LGECI-259
        /*
				if(link=='lgAccHelp' && $('.GPC0022.active').length>0) {
					$('.GPC0022.active').removeClass('showing');
				}
				*/
        // LGECI-259 Start
      } else if (link == "footer") {
        $(".footer-box").eq(0).attr("tabindex", 0).focus();
        // LGECI-259 End
      }
    }
  });
})(jQuery);

// menu-kebab
// 20220225 PJTQUICKWIN add
(function ($) {
  if ($(".menu-kebab").length === 0) return false;
  $("body").on("click.openKebab", ".menu-kebab", function (event) {
    event.preventDefault();
    $(".kebab-target").removeClass("active");
    $(this).parent().find(".kebab-target").addClass("active");
  });
  $("body").on("click.closeKebab", ".kebab-close", function (event) {
    event.preventDefault();
    $(".kebab-target").removeClass("active");
  });
  $("body").on("mouseleave.closeKebab", ".kebab-target", function () {
    $(".kebab-target").removeClass("active");
  });
})(jQuery);

// bv (apps, es, mx, dk, fi, no, se, br, au, cl) : JS 호출만으로 동작
// bv2 (display, for de, fr, uk, ca_en, ca_fr) : 아래 스크립트 실행 시켜 줘야 함
var bvContainerCount = 0;
var runBVStaticPLP = function ($target) {
  //console.log('runBVStaticPLP');
  if (!$target) return false;
  var run = function ($target) {
    //console.log('run bv...');
    $target.each(function () {
      if (
        typeof ePrivacyCookies == "undefined" ||
        ePrivacyCookies.get("LGCOM_IMPROVEMENTS")
      ) {
        var $obj = $(this);
        if ($obj.find(".rating[data-modelid]").not(".loaded").length > 0) {
          if (typeof $BV == "object") {
            var sctxt = "";
            $obj
              .find(".rating[data-modelid]")
              .not(".loaded")
              .each(function () {
                // 20200406 START 박지영 - 버그 수정
                var pid = $(this).attr("data-modelid");
                var url = $(this).find("a").attr("href"); //.replace('#reviews', '#pdp_review');
                if (sctxt == "") sctxt += "'" + pid + "':{url:'" + url + "'}";
                else sctxt += ",'" + pid + "':{url:'" + url + "'}";
                $(this)
                  .addClass("loaded")
                  .removeAttr("itemprop")
                  .removeAttr("itemscope")
                  .removeAttr("itemtype")
                  .attr(
                    "id",
                    "BVRRInlineRating-" + bvContainerCount + "-" + pid
                  )
                  .empty();
                // 20200406 END
              });
            if (sctxt != "") {
              sctxt =
                "$BV.ui( 'rr', 'inline_ratings', {productIds : {" +
                sctxt +
                "}, containerPrefix:'BVRRInlineRating-" +
                bvContainerCount +
                "'});";
              new Function(sctxt)(); // jshint ignore:line
            }
            bvContainerCount++;
          }
        }
      }
    });
  };
  // 20200325 START 박지영 - BV2 JS 로딩 체크 수정
  var check = function ($obj) {
    setTimeout(function () {
      if (typeof $BV == "object") {
        run($obj);
      } else {
        check($obj);
      }
    }, 300);
  };
  if ($("#bvScript").length > 0) {
    if (typeof $BV == "object") {
      run($target);
    } else {
      check($target);
    }
  }
  // 20200325 END
};

// chatbot Vieeye (for HU,BG,HR,RS) in some pages
(function () {
  if ($("#chatbotVieeye").length > 0) {
    var c = COUNTRY_CODE.toLowerCase();
    var run = function () {
      console.log("run VIECHATBOT");
      if (c == "hu") VIECHATBOT.start();
      else if (c == "bg")
        VIECHATBOT.start({
          host: "https://bg.lgchatbot-bot.vieeye.hu",
          lang: "bg",
        });
      // 20200309 START 박지영 - 챗봇 host 수정
      else if (c == "hr")
        VIECHATBOT.start({
          host: "https://hr.lgchatbot-bot.vieeye.hu",
          lang: "hr",
        });
      else if (c == "rs")
        VIECHATBOT.start({
          host: "https://rs.lgchatbot-bot.vieeye.hu",
          lang: "sr",
        });
      // 20200309 END
    };
    var check = function () {
      if (
        typeof VIECHATBOT != "undefined" &&
        typeof ePrivacyCookies != "undefined"
      ) {
        if (ePrivacyCookies.get("LGCOM_IMPROVEMENTS")) {
          run();
        }
      } else {
        setTimeout(function () {
          check();
        }, 300);
      }
    };
    if ($(".cookie-banner").length > 0) {
      var banner = $(".cookie-banner");
      if (
        banner.hasClass("agree-cookie") &&
        banner.data("privacy-type") == "static"
      ) {
        // 암묵적이면서 Static인 경우 쿠키 막지 않음
        run();
      } else {
        // eprivacy cookie setting 에 의해 막는 경우가 발생하기 때문에 체크를 위해 ePrivacyCookies가 존재 해야 함.
        check();
      }
    } else {
      run();
    }
  }
})();

// Shoppilot Guide (RU)
// https://aplaut.com/docs/developers/api-reference/app_js.html#%D0%B2%D0%B8%D0%B4%D0%B6%D0%B5%D1%82

// ru review (list)
// 20200429 JSLint 수정
var ruProductList = [];
// 20200429 END
var ruProductListIdx = 0;
var getProductsNameRU = function () {
  var $obj = $(".rating-ru-box");
  if ($obj.length > 0) {
    $obj.each(function () {
      // 20200408 START 박지영 : RU review - model name에 공백이 들어있는 경우 처리
      var product = $(this).find("span").attr("data-shoppilot")
        ? $(this)
            .find("span")
            .attr("data-shoppilot")
            .replace(" ", "-")
            .toLowerCase()
        : "";
      if (ruProductList.join(",").indexOf(product) == -1) {
        ruProductList[ruProductListIdx] = product;
        ruProductListIdx++;
      }
      // 20200408 END
    });
    return ruProductList;
  } else {
    return null;
  }
};
var renderListingInlineRatingsRU = function (product_ids) {
  var run = function () {
    if (product_ids != null) {
      if (typeof Shoppilot == "object") {
        var MultiWidget = Shoppilot.require("multi_widget");
        var ProductWidget = Shoppilot.require("product_widget");
        var widgets = product_ids.map(function (product_id) {
          return new ProductWidget({
            name: "listing-inline-rating",
            container: ".rating-ru-box span[data-shoppilot=" + product_id + "]",
            product_id: product_id,
          });
        });
        MultiWidget.render(widgets);
      } else {
        setTimeout(function () {
          run();
        }, 500);
      }
    }
  };
  run();
};

//LGEGMC-712
function nvl(str, defaultStr) {
  var check = str + "";
  var result = "";
  check = check.trim();
  if (check == "" || check == null || check == "null" || check == "undefined") {
    result = defaultStr;
  } else {
    result = check;
  }
  return result;
}

// LGEGMCOBS-61 Start
// call js 	: nvlFtlMsgCode(체크대상영역 selector) - 생략 시 body 전체 대상
// FTL attr : data-msg-nvl="{msgCodeName},{defaultStr}"
function nvlFtlMsgCode(validationArea) {
  validationArea = !!validationArea ? validationArea : "body";
  $("[data-msg-nvl]", validationArea).each(function () {
    let checkArr = $(this).attr("data-msg-nvl").split(",");
    if ($(this).text() === checkArr[0]) $(this).text(checkArr[1]);
  });
}
// LGEGMCOBS-61 End

(function ($) {
  window._shoppilot = window._shoppilot || [];
  _shoppilot.push(["_addStyles", "widgets"]);
  // for pdp (ru)
  if (
    $(".GPC0009").length > 0 &&
    $("#shoppilot-inline-rating-container").length > 0
  ) {
    /* LGERU-235 Start */
    _shoppilot.push([
      "_setProductId",
      $(".GPC0009 .pdp-summary-area .model-name")
        .eq(0)
        .data("model-name")
        .toLowerCase(),
    ]);
    /* LGERU-235 End */
    _shoppilot.push([
      "_addProductWidget",
      "product-reviews",
      "#shoppilot-product-reviews-container",
    ]);
    _shoppilot.push([
      "_addProductWidget",
      "inline-rating",
      "#shoppilot-inline-rating-container",
    ]);
    _shoppilot.push([
      "_addProductWidget",
      "inline-rating",
      "#shoppilot-inline-rating-container2",
    ]);
  }
  // for List
  renderListingInlineRatingsRU(getProductsNameRU());
})(jQuery);

/* LGEGMC-234 20200526 add */ /* BTOBGLOBAL-79 20200602 modify */
$(function () {
  if ($(".container-fluid:has(.navigation)").length && !$("main").length) {
    $(
      ".container-fluid:has(.navigation) ~ div, .container-fluid.iw_section:has(.navigation) ~ section"
    )
      .not(":has(.footer-box)")
      .wrapAll("<main></main>");
  }
});
/* //LGEGMC-234 20200526 add */ /* //BTOBGLOBAL-79 20200602 modify */

/* LGEBR-75 20200604 add */
jQuery.cachedScript = function (url, options) {
  // Allow user to set any option except for dataType, cache, and url
  options = $.extend(options || {}, {
    dataType: "script",
    cache: true,
    url: url,
  });

  // Use $.ajax() since it is more flexible than $.getScript
  // Return the jqXHR object so we can chain callbacks
  return jQuery.ajax(options);
};
/* //LGEBR-75 20200604 add */

/* LGECI-163 20200819 add */
var caenReg =
  /^\/ca_en\/(mobile|cell-phones|cell-phones\/lg-lmg900um2-illusion-sunset)$/;
var cafrReg =
  /^\/ca_fr\/(mobiles|telephones-mobiles|telephones-mobiles\/lg-lmg900um2-illusion-solaire)$/;
if (caenReg.test(location.pathname) || cafrReg.test(location.pathname)) {
  $("head").prepend(
    '<script async src="https://www.googletagmanager.com/gtag/js?id=DC-9878050"></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag("js", new Date());gtag("config", "DC-9878050");</script>'
  );
}

/*LGECI-247 20201217 add*/
if (COUNTRY_CODE == "ca_en" || COUNTRY_CODE == "ca_fr") {
  var caSource = location.pathname;
  var caTarget = [
    "/ca_en/connected-at-home",
    "/ca_en/washing-machines/lg-wm4500hba",
    "/ca_fr/laveuses/lg-wm4500hba",
    "/ca_en/refrigerators/lg-lrmvs3006s",
    "/ca_fr/refrigerateurs/lg-lrmvs3006s",
    "/ca_en/dryers/lg-dlex4500b",
    "/ca_fr/secheuses/lg-dlex4500b",
    "/ca_en/tvs/lg-OLED65CXPUA",
    "/ca_fr/tvs/lg-OLED65CXPUA",
    "/ca_en/wall-ovens-ranges/lg-LREL6325F",
    "/ca_fr/cuisinieres/lg-LREL6325F",
    "/ca_en/dishwashers/lg-LDT7808SS",
    "/ca_fr/lave-vaisselle/lg-LDT7808SS",
  ];
  for (var i = 0; i < caTarget.length; i++) {
    if (caSource == caTarget[i]) {
      $("head").prepend(
        '<script async src="https://www.googletagmanager.com/gtag/js?id=DC-9878050"></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag("js", new Date());gtag("config", "DC-9878050");</script>'
      );
    }
  }
}
/*LGECI-247 20201217 add*/

emiPop = {
  callEmiPop: function (url, model, modelPrice) {
    //LGEGMC-1791
    var emiPopObsGroup = $(".navigation").attr("data-obs-group");
    $.ajax({
      type: "post",
      url: url,
      dataType: "html",
      data: xssfilter({ modelId: model, group: emiPopObsGroup }),
      success: function (html) {
        $("body").trigger("ajaxLoadEnd");
        $("#modal_with_pay,#modal_with_pay_hu,#modal_afterpay").remove(); //LGEGMC-1791,LGEAU-378
        $("body").append(html);
        /*LGEGMC-1791*/
        if (COUNTRY_CODE == "hu") {
          var $obj = $("body").find("#acco-cetlemmel");
          if (modelPrice >= 50000 && modelPrice <= 2000000) {
            if (
              typeof ePrivacyCookies == "undefined" ||
              ePrivacyCookies.get("LGCOM_IMPROVEMENTS")
            ) {
              // OBSLGEHU-138 start
              var baremId = "229";
              if (
                $("#acco-cetlemmel").find("iframe").attr("data-barem") != null
              ) {
                baremId = $("#acco-cetlemmel")
                  .find("iframe")
                  .attr("data-barem");
              }
              $("body")
                .find("#iframeCal")
                .attr(
                  "src",
                  $(html).find("#iframeCal").data("src") +
                    "?modelPrice=" +
                    modelPrice +
                    "&baremId=" +
                    baremId
                );
              // OBSLGEHU-138 end
            } else {
              ePrivacyCookies.view("load", "small", $obj);
            }
          } else {
            $("#modal_with_pay_hu").find(".item-infomation li").eq(0).hide();
          }
        }

        /* LGEGMC-3167 Strat */
        if (COUNTRY_CODE == "au") {
          modelPrice = modelPrice.split(".", 1);
          var emiType = emiPop.getParameterByName("emiType", url);
          var zipPayType =
            modelPrice > 3000 && modelPrice <= 10000
              ? "Y"
              : "N"; /* OBSLGEAU-749 (5000 -> 10000) */
          if (emiType == "afterPay") {
            emiPop.emiTypeChange(
              $("button#after_zip_contTab_0.btn-after-zip-tab"),
              zipPayType,
              "main"
            );
          } else if (emiType == "zipPay") {
            emiPop.emiTypeChange(
              $("button#after_zip_contTab_1.btn-after-zip-tab"),
              zipPayType,
              "main"
            );
          }
          $(".btn_OpenBenefit").on("click", function (e) {
            e.preventDefault();
            emiPop.btnOpenBenefit($(this));
          });
          $(".btn-after-zip-tab").on("click", function (e) {
            e.preventDefault();
            emiPop.emiTypeChange($(this), zipPayType, "main");
          });
          $(".btn-tab").on("click", function (e) {
            e.preventDefault();
            emiPop.emiTypeChange($(this), zipPayType, "sub");
          });
        }
        /* LGEGMC-3167 End */

        $("#modal_with_pay,#modal_with_pay_hu,#modal_afterpay").modal(); //LGEAU-378
        /*LGEGMC-1791*/

        /* LGEGMC-2068 Start */
        if (emiPop.checkUserStatus() == "ie") {
          $(".emi-ie").show();
          $(".emi-non-ie").hide();
        } else {
          $(".emi-ie").hide();
          $(".emi-non-ie").show();
        }
        if (!!$(".iframe-wrap").length) {
          $(".iframe-wrap").each(function () {
            if (
              typeof ePrivacyCookies == "undefined" ||
              ePrivacyCookies.get("LGCOM_IMPROVEMENTS")
            ) {
              $(this)
                .find("[id*=iframeArea]")
                .attr("src", $(this).find("[id*=iframeArea]").data("src"));
            } else {
              ePrivacyCookies.view("load", "small", $(this));
            }
          });
        }
        /* LGEGMC-2068 End */
      },
      error: function (request, status, error) {
        $("body").trigger("ajaxLoadEnd");
        console.log("status: " + status);
        console.log("error: " + error);
      },
    });
  },
  init: function () {
    $("body")
      .off("click.price-installment")
      .on(
        "click.price-installment",
        "a.price-installment,a.afterpay-installment",
        function (e) {
          e.preventDefault();
          var url = $(this).data("emiPopupUrl"); //url admin code/message - > Configuration Code Management emi_popup_url
          var modelId = $(this).data("model-id");
          /*LGEGMC-1791*/
          var modelPrice = 0;
          if (COUNTRY_CODE == "hu" || COUNTRY_CODE == "au") {
            // OBSLGEHU-192, OBSLGEHU-138 start
            if ($(this).parents(".pdp-info").length > 0) {
              if (
                $(this).parents(".pdp-info").find(".total-price-num strong")
                  .length > 1
              ) {
                modelPrice = $(
                  $(this)
                    .parents(".pdp-info")
                    .find(".total-price-num strong")[0]
                )
                  .text()
                  .replace(/[^0-9]/g, "");
              } else {
                modelPrice = $(this)
                  .parents(".pdp-info")
                  .find(".total-price-num strong")
                  .text()
                  .replace(/[^0-9]/g, "");
              }
            } else {
              if (
                $(this)
                  .parents(".products-info")
                  .find(".purchase-price .number").length > 0
              ) {
                modelPrice = $(
                  $(this)
                    .parents(".products-info")
                    .find(".purchase-price .number")[0]
                )
                  .text()
                  .replace(/,/g, "")
                  .replace(/\s/gi, "");
              } else {
                modelPrice = $(this)
                  .parents(".products-info")
                  .find(".purchase-price .number")
                  .text()
                  .replace(/,/g, "")
                  .replace(/\s/gi, "");
              }
            }
            // OBSLGEHU-192, OBSLGEHU-138 end
          }
          /*//LGEGMC-1791*/

          // LGEGMC-2434 Start
          var modalType = $(this).attr("href");
          if (modalType == "#blank_calculator") {
            var groupCheck = $(".navigation").data("obsOriginGroup"),
              sku = $(this).data("calculatorSalesCode"),
              obsGroup = groupCheck ? groupCheck : "",
              url =
                $(this).data("calculatorUrl") +
                "?sku=" +
                sku +
                "&customer_group=" +
                obsGroup,
              isDesktop = $(".navigation .for-desktop").is(":visible");

            if (isDesktop) {
              var popupX = window.screen.width / 2 - 710 / 2,
                popupY = window.screen.height / 2 - 640 / 2,
                popOption =
                  "width=710, height=640,scrollbars=yes, left=" +
                  popupX +
                  ", top=" +
                  popupY;
            }
            window.open(url, "_blank", popOption);
          } else {
            /*
					// adobe
					if($('.GPC0009').length>0) {
						var pid2 = $('.GPC0009').data('product-id');
						if(pid2 != modelId) {
							adobeTrackEvent('re-stock-alert', {
								products: [{
									sales_model_code : findSalesModel($(this)),  LGEGMC-455 20200722 modify 
									model_name: findModelName($(this))
								}], cross_sell_product :pid2, page_event: {re_stock_alert: true}
							});
						} else {
							adobeTrackEvent('re-stock-alert', {
								products: [{
									sales_model_code : findSalesModel($(this)),  LGEGMC-455 20200722 modify 
									model_name: findModelName($(this))
								}], page_event: {re_stock_alert: true}
							});
						}
					} else {
						adobeTrackEvent('re-stock-alert', {
							products: [{
								sales_model_code : findSalesModel($(this)),  LGEGMC-455 20200722 modify 
								model_name: findModelName($(this))
							}], page_event: {re_stock_alert: true}
						});
					}*/
            $("body").trigger("ajaxLoadBefore");
            // OBSLGEHU-138 start
            if (modelId == null || modelId.length <= 0) {
              if (
                $(this).attr("data-model_id") != null &&
                $(this).attr("data-model_id") == ""
              ) {
                modelId = $(this).attr("data-model_id");
              } else if ($(this).parents(".GPC0009").length > 0) {
                modelId = $(this).parents(".GPC0009").attr("data-model-id");
              } else if ($(this).parents(".products-info").length > 0) {
                modelId = $(this)
                  .parents(".products-info")
                  .attr("data-model-id");
              } else if ($(this).parents(".model-info").length > 0) {
                modelId = $(this).parents(".model-info").attr("data-model-id");
              }
            }

            if (modelPrice == null || modelPrice == "") {
              var priceChkCnt = $(this)
                .parents(".model-info")
                .find(".purchase-price .number").length;
              if (priceChkCnt > 1) {
                modelPrice = $(
                  $(this)
                    .parents(".model-info")
                    .find(".purchase-price .number")[0]
                )
                  .text()
                  .replace(/,/g, "")
                  .replace(/\s/gi, "");
              } else if (priceChkCnt > 0) {
                modelPrice = $(this)
                  .parents(".model-info")
                  .find(".purchase-price .number")
                  .text()
                  .replace(/,/g, "")
                  .replace(/\s/gi, "");
              }
            }

            // OBSLGEHU-138 end
            emiPop.callEmiPop(url, modelId, modelPrice); //LGEGMC-1791
          }
          // LGEGMC-2434 End
        }
      );
  },
  /* LGEGMC-2068 Start */
  checkUserStatus: function () {
    //check browser
    var isie = /msie/i.test(navigator.userAgent); //ie
    var isie6 = /msie 6/i.test(navigator.userAgent); //ie 6
    var isie7 = /msie 7/i.test(navigator.userAgent); //ie 7
    var isie8 = /msie 8/i.test(navigator.userAgent); //ie 8
    var isie9 = /msie 9/i.test(navigator.userAgent); //ie 9
    var isfirefox = /firefox/i.test(navigator.userAgent); //firefox
    var isapple = /applewebkit/i.test(navigator.userAgent); //safari,chrome
    var isopera = /opera/i.test(navigator.userAgent); //opera
    var isios = /(ipod|iphone|ipad)/i.test(navigator.userAgent); //ios
    var isipad = /(ipad)/i.test(navigator.userAgent); //ipad
    var isandroid = /android/i.test(navigator.userAgent); //android

    if (isie7 || isie8 || isie9) {
      isie6 = false;
    }
    if (isie9) {
      isie = false;
    }

    var device;
    if (/*isapple || */ isios || isandroid) {
      device = "Mobile";
    } else if (isipad) {
      device = "Tablet";
    } else {
      device = "Pc";
    }

    //check browser
    var a = navigator.userAgent.toLowerCase();
    var b, v;
    if (a.indexOf("safari/") > -1) {
      b = "safari";
      var s = a.indexOf("version/");
      var l = a.indexOf(" ", s);
      v = a.substring(s + 8, l);
    }
    if (a.indexOf("chrome/") > -1) {
      b = "chrome";
      var ver = /[ \/]([\w.]+)/.exec(a) || [];
      v = ver[1];
    }
    if (a.indexOf("firefox/") > -1) {
      b = "firefox";
      var ver = /(?:.*? rv:([\w.]+)|)/.exec(a) || [];
      v = ver[1];
    }
    if (a.indexOf("opera/") > -1) {
      b = "opera";
      var ver = /(?:.*version|)[ \/]([\w.]+)/.exec(a) || [];
      v = ver[1];
    }
    if (a.indexOf("msie") > -1 || a.indexOf(".net") > -1) {
      b = "ie";
      var ver = /(?:.*? rv:([\w.]+))?/.exec(a) || [];
      if (ver[1]) v = ver[1];
      else {
        var s = a.indexOf("msie");
        var l = a.indexOf(".", s);
        v = a.substring(s + 4, l);
      }
    }

    return b;
  },
  /* LGEGMC-2068 End */
  /* LGEGMC-3167 Start */
  getParameterByName: function (name, url) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(url);
    return results == null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  },
  emiTypeChange: function (chageTarget, zipPayType, tabType) {
    var targetId = "#" + chageTarget.attr("aria-controls"),
      target = $("#modal_afterpay").find(targetId);
    if (tabType == "main") {
      var targetTitle = chageTarget.attr("data-title"),
        targetHead = $("#modal_afterpay").find(".modal-title"),
        cont = $("#modal_afterpay").find(".after-zip-tabsCont"),
        tabBtn = $("#modal_afterpay").find(".btn-after-zip-tab");
      console.log(targetTitle);
    } else if (tabType == "sub") {
      var cont = $("#modal_afterpay").find(".zippay-tabsCont"),
        tabBtn = $("#modal_afterpay").find(".btn-tab");
    }
    if (!chageTarget.hasClass("active")) {
      if (zipPayType == "Y") {
        $("#modal_afterpay")
          .find(".after-zip-tab")
          .prop("style", "display:none;");
      }
      tabBtn.removeClass("active").attr("aria-expanded", false);
      chageTarget.addClass("active").attr("aria-expanded", true);
      cont.removeClass("active");
      target.addClass("active");
      if (tabType == "main") {
        targetHead.html(targetTitle);
      }
    }
  },
  btnOpenBenefit: function (btnTarget) {
    var targetId = "#" + btnTarget.attr("aria-controls"),
      target = $(document).find(targetId);
    if (btnTarget.hasClass("is-open")) {
      btnTarget.removeClass("is-open").attr("aria-expanded", false);
      target.removeClass("is-open");
    } else {
      btnTarget.addClass("is-open").attr("aria-expanded", true);
      target.addClass("is-open");
    }
  },
  /* LGEGMC-3167 End */
};
emiPop.init();
/*LGECI-247 20201217 add*/

/* LGEFR-254 : 20210329 add, LGCOMSPEED-6(5th) */
window.addEventListener("load", function () {
  //PJTMEMBERSHIP-1 추가/변경
  var $nav = $(".navigation");
  var bizType = $nav && $nav.hasClass("b2b") ? "B2B" : "B2C";
  var param = {
    bizType: bizType,
    locationPath: window.location.pathname,
  };
  //PJTMEMBERSHIP-1 추가 끝

  // LGEGMC-4202 Start
  // frontDomain : main domain instead of sso domain
  const frontDomain = ISSIGNIN ? MAIN_DOMAIN : ""; // LGEITF-961
  const url =
    frontDomain +
    "/" +
    COUNTRY_CODE.toLowerCase() +
    "/mkt/ajax/retrieveGnbNoticeHtml";
  // LGEGMC-4202 End

  //PJTMEMBERSHIP-1 param 셋팅 (null -> param)
  ajax.call(url, param, "json", function (data) {
    if (!data) return false;

    if (data.data[0].gnbNoticeHtml != undefined && !ISSIGNIN) {
      // LGEGMC-4202
      $("header.navigation").after(data.data[0].gnbNoticeHtml);

      var gnbNotice = {
        $banner: $(".header-notice-popup"),
        $closeBtn: $(".header-notice-popup .btn-hide-section"),
        expiresDate: $(".header-notice-popup").data("expires")
          ? $(".header-notice-popup").data("expires")
          : "12",
        cookieName: COUNTRY_CODE.toUpperCase() + "_gnbNoticeOpenFlag",
        init: function () {
          var self = this;
          self.initBanner();
          self.addEvent();
        },
        initBanner: function () {
          var self = this;
          /* LGECZ-150 : 20210601 add */
          if (
            self.getCookie(self.cookieName) == "true" ||
            $(".navigation").eq(0).find(".logged .after-login").length > 0
          ) {
            /*// LGECZ-150 : 20210601 add */
            self.$banner.removeClass("active");
          } else {
            self.$banner.addClass("active");
          }
        },
        addEvent: function () {
          var self = this;
          self.$closeBtn.on("click", function (e) {
            e.preventDefault();
            if (
              typeof ePrivacyCookies == "undefined" ||
              ePrivacyCookies.get("LGCOM_IMPROVEMENTS")
            ) {
              self.setCookie(gnbNotice.cookieName, true);
              self.$banner.removeClass("active");
            } else {
              console.log("");
              ePrivacyCookies.view("click");
            }
          });
        },
        getCookie: function (name) {
          if ($.cookie(name)) {
            return decodeURIComponent($.cookie(name));
          } else {
            $.cookie(name);
          }
        },
        setCookie: function (name, value) {
          var lh = location.host;
          var mydomain = ".lg.com";
          if (lh.indexOf("lge.com") >= 0) {
            mydomain = ".lge.com";
          } else if (lh.indexOf("localhost") >= 0) {
            mydomain = "localhost";
          }
          var date = new Date();
          date.setTime(date.getTime() + gnbNotice.expiresDate * 60 * 60 * 1000); // 12
          var domain = {
            path: "/",
            domain: mydomain,
            expires: date,
          };

          $.cookie(name, encodeURIComponent(value), domain);
        },
      };
      gnbNotice.init();
    }

    //PJTMEMBERSHIP-1 (멤버십)
    if (data.data[0].gnbLineBannerNoticeHtml != undefined && !ISSIGNIN) {
      // LGEGMC-4202
      if ($(".gnb-bottom-banner").length == 0) {
        $("header.navigation").after(data.data[0].gnbLineBannerNoticeHtml);
        var gnbLineBannerNotice = {
          $banner: $(".gnb-bottom-banner"),
          $closeBtn: $(".gnb-bottom-banner .close-bnr"),
          expiresDate: $(".gnb-bottom-banner").data("expires")
            ? $(".gnb-bottom-banner").data("expires")
            : "12",
          cookieName:
            COUNTRY_CODE.toUpperCase() + "_gnbLineBannerNoticeOpenFlag",
          init: function () {
            var self = this;
            self.initBanner();
            self.addEvent();
          },
          initBanner: function () {
            var self = this;
            if (self.getCookie(self.cookieName) == "true") {
              self.$banner.hide();
            } else {
              self.$banner.show();
            }
          },
          addEvent: function () {
            var self = this;
            self.$closeBtn.on("click", function (e) {
              e.preventDefault();
              if (
                typeof ePrivacyCookies == "undefined" ||
                ePrivacyCookies.get("LGCOM_IMPROVEMENTS")
              ) {
                self.setCookie(gnbLineBannerNotice.cookieName, true);
                self.$banner.hide();
              } else {
                console.log("");
                ePrivacyCookies.view("click");
              }
            });
          },
          getCookie: function (name) {
            if ($.cookie(name)) {
              return decodeURIComponent($.cookie(name));
            } else {
              $.cookie(name);
            }
          },
          setCookie: function (name, value) {
            var lh = location.host;
            var mydomain = ".lg.com";
            if (lh.indexOf("lge.com") >= 0) {
              mydomain = ".lge.com";
            } else if (lh.indexOf("localhost") >= 0) {
              mydomain = "localhost";
            }
            var date = new Date();
            date.setTime(
              date.getTime() + gnbLineBannerNotice.expiresDate * 60 * 60 * 1000
            ); // 12
            var domain = {
              path: "/",
              domain: mydomain,
              expires: date,
            };
            $.cookie(name, encodeURIComponent(value), domain);
          },
        };
        gnbLineBannerNotice.init();
      }
    }
    //PJTMEMBERSHIP-1(멤버십)

    // LGEGMC-2020
    if (data.data[0].gnbStandardBannerTopHtml != undefined && !ISSIGNIN) {
      // LGEGMC-4202
      if ($(".gnb-notice-banner-wrap").length == 0) {
        $("header.navigation").before(data.data[0].gnbStandardBannerTopHtml);

        var gnbStandardBannerTop = {
          $banner: $(".gnb-notice-banner-wrap"),
          $closeBtn: $(".gnb-notice-banner-wrap .btn-banner-close"),
          expiresDate: $(".gnb-notice-banner-wrap").data("expires")
            ? $(".gnb-notice-banner-wrap").data("expires")
            : "12",
          cookieName:
            COUNTRY_CODE.toUpperCase() + "_gnbStandardBannerTopOpenFlag",
          init: function () {
            var self = this;
            self.initBanner();
            self.addEvent();
          },
          initBanner: function () {
            var self = this;
            if (self.getCookie(self.cookieName) == "true") {
              self.$banner.hide();
            } else {
              self.$banner.show();
              $("#eprivacyCookie").data("bannerType", "B"); // LGEUA-262 :: type - badge
              if ($(".gnb-notice-banner-wrap").length > 0) {
                $("#eprivacyCookie").data("bannerType", "F"); // LGEUA-262 :: type - fullbar
                $("#eprivacyCookie").addClass("has-gnb-notice-banner");
                ePrivacyCookies.setCookieEuHeight();
              }
            }
          },
          addEvent: function () {
            var self = this;
            self.$closeBtn.on("click", function (e) {
              e.preventDefault();
              if (
                typeof ePrivacyCookies == "undefined" ||
                ePrivacyCookies.get("LGCOM_IMPROVEMENTS")
              ) {
                self.setCookie(gnbStandardBannerTop.cookieName, true);
                self.$banner.hide();
              } else {
                console.log("");
                ePrivacyCookies.view("click");
              }
            });
          },
          getCookie: function (name) {
            if ($.cookie(name)) {
              return decodeURIComponent($.cookie(name));
            } else {
              $.cookie(name);
            }
          },
          setCookie: function (name, value) {
            var lh = location.host;
            var mydomain = ".lg.com";
            if (lh.indexOf("lge.com") >= 0) {
              mydomain = ".lge.com";
            } else if (lh.indexOf("localhost") >= 0) {
              mydomain = "localhost";
            }
            var date = new Date();
            date.setTime(
              date.getTime() + gnbStandardBannerTop.expiresDate * 60 * 60 * 1000
            ); // 12
            var domain = {
              path: "/",
              domain: mydomain,
              expires: date,
            };

            $.cookie(name, encodeURIComponent(value), domain);
          },
        };
        gnbStandardBannerTop.init();
      }
    }

    if (data.data[0].gnbStandardBannerHtml != undefined) {
      if ($(".gnb-standard-banner-wrap").length == 0) {
        $("header.navigation").after(data.data[0].gnbStandardBannerHtml);
        // LGEAU-1082 Start
        $(".gnb-standard-banner-wrap .banner-box .btn").each(function () {
          if (!!$(this).attr("href")) {
            if ($(this).attr("href").indexOf("http") == -1) {
              $(this).attr("href", frontDomain + $(this).attr("href"));
            }
          }
        });
        // LGEAU-1082 End
        //LGEITF-886,LGETR-426 s
        /*if(COUNTRY_CODE.toLowerCase() == 'tr'){
						$(".gnb-standard-banner-wrap .standard-banner-box .banner-item p.text").html("Kahramanmaraş’ta meydana gelen ve birçok ilimizi etkileyen depremin üzüntüsünü yaşıyoruz.<br> Hayatlarını kaybeden vatandaşlarımıza Allah’tan rahmet, yakınlarını kaybedenlere başsağlığı, yaralılara acil şifalar diliyoruz. Geçmiş Olsun Türkiye.")
					}*/
        //LGEITF-886,LGETR-426 e
        var gnbStandardBanner = {
          $banner: $(".gnb-standard-banner-wrap"),
          $closeBtn: $(".gnb-standard-banner-wrap .btn-banner-close"),
          expiresDate: $(".gnb-standard-banner-wrap").data("expires")
            ? $(".gnb-standard-banner-wrap").data("expires")
            : "12",
          cookieName: COUNTRY_CODE.toUpperCase() + "_gnbStandardBannerOpenFlag",
          couponRemainingDays: null, // LGEGMC-3436
          $commonMsg: $(".gnb-personalBanner"), // LGEGMC-3777
          $eCrmMsg: $(".gnb-standard-banner-wrap").find(".gnb-eCrmBanner"), // LGEGMC-3777
          init: function () {
            var self = this;
            self.initBanner();
            self.addEvent();
          },
          initBanner: function () {
            var self = this;
            if (self.getCookie(self.cookieName) == "true") {
              self.$banner.hide();
            } else {
              // LGEGMC-3436, LGEGMC-3777 Start
              if (sessionStorage.getItem("ACCESS_TOKEN") === "") {
                eCrmButtonAction =
                  sessionStorage.getItem(UTM_CTA_ACTION) !== null &&
                  sessionStorage.getItem(UTM_CTA_ACTION)
                    ? true
                    : false;
                eCrmFlag =
                  (eCrmParam !== undefined ||
                    sessionStorage.getItem(ENTRY_UTM)) &&
                  !eCrmButtonAction &&
                  self.$eCrmMsg.length
                    ? true
                    : false;
              } else {
                // login 후 utm sessionStorage clear
                Object.keys(sessionStorage)
                  .filter(function (k) {
                    return /utm/i.test(k);
                  })
                  .forEach(function (k) {
                    sessionStorage.removeItem(k);
                  });
              }

              if (eCrmFlag) {
                if (getUrlParams().utm_campaign !== undefined) {
                  // first entered
                  sessionStorage.setItem(ENTRY_UTM, true);
                  sessionStorage.setItem(UTM_SESSION_PARAM, eCrmParam);

                  const registerCase =
                    "onboarding_3|support_fup|register_fup|repair_fup|manual_fup";
                  if (registerCase.indexOf(eCrmParam) > -1) {
                    sessionStorage.setItem(UTM_MOVE_COUNTER, 0);
                    registerButton = true;
                  }
                }

                if (sessionStorage.getItem(UTM_MOVE_COUNTER) !== null) {
                  const utmMoveCounter = Number(
                    sessionStorage.getItem(UTM_MOVE_COUNTER)
                  );
                  if (utmMoveCounter > -1 && utmMoveCounter < 4) {
                    sessionStorage.setItem(
                      UTM_MOVE_COUNTER,
                      utmMoveCounter + 1
                    );
                    registerButton = true;
                    self.personalBanner("eCrm");
                  } else {
                    // 3페이지 내 로그인 X(미반응)시 eCrm exit, common 개인화 msg 로직 진입
                    self.personalBanner("common");
                  }
                } else {
                  self.personalBanner("eCrm");
                }

                // LGEGMC-4874 Start
              } else if (
                personalBannerUseFlag &&
                gnbPersonal.checkExistStorage()
              ) {
                // 로그인 + 한 번만 진입 : welcome coupon 사용여부 확인 후 Banner draw
                if (
                  sessionStorage.getItem("ACCESS_TOKEN") !== "" &&
                  !gnbPersonal.enteredAjax
                ) {
                  gnbPersonal.enteredAjax = true;
                  const url =
                    "/" +
                    COUNTRY_CODE +
                    "/mylg/getWelcomeCouponUsedFlag.lgajax";
                  $.ajax({
                    type: "post",
                    url: url,
                    param: null,
                    dataType: "json",
                    success: function (data) {
                      if (data.result) {
                        gnbPersonal.getPersonal();

                        if (data.welcomeCouponUsedFlag === "Y") {
                          gnbPersonal.update("usedCoupon", true);
                        } else {
                          gnbPersonal.update("usedCoupon", false);
                          self.couponRemainingDays =
                            data.couponMap !== undefined &&
                            data.couponMap.remainingDays !== undefined
                              ? data.couponMap.remainingDays
                              : "a few";
                        }

                        self.personalBanner("common");
                      } else {
                        console.log(data.message);
                      }
                    },
                  });
                } else self.personalBanner("common"); // 미로그인
              } else self.createStandardBanner();
              // LGEGMC-3436, LGEGMC-3777 End

              // toast popup - gnb line banner 분기 분리
              if (welcomeToastUseFlag) welcomeToast.init();
              if (personalToastUseFlag) personalToast.init();
              // LGEGMC-4874 End
            }
          },
          // LGEGMC-3436 Start
          personalBanner: function (personalType) {
            // LGEGMC-3777 Start
            const self = this;
            let statusCase, msg;

            if (personalType === "common") {
              statusCase = self.personalBannerCase(userPersonal);
              msg = self.$commonMsg.data("text" + statusCase);
            } else if (personalType === "eCrm") {
              statusCase = registerButton ? "register" : "signin";
              msg = self.$eCrmMsg.attr("data-" + eCrmParam.replace(/_/g, "-"));
            }

            self.createPersonalHtml(statusCase, msg);
            // LGEGMC-3777 End
          },
          personalBannerCase: function (personal) {
            // 01 : 신규 방문
            // 02 : 재방문 & 회원미가입
            // 03 : 재방문 & 회원가입함 & 쿠폰미사용
            // 04 : 재방문 & 회원가입함 & 이미쿠폰사용
            // 05 : 재방문 & 회원가입함 & 미로그인
            if (sessionStorage.getItem(PERSONAL_FIRST)) {
              return "01";
            } else {
              if (personal.membership) {
                if (sessionStorage.getItem("ACCESS_TOKEN") === "") return "05";
                else if (!personal.usedCoupon) return "03";
                else if (personal.usedCoupon) return "04";
              } else {
                return "02";
              }
            }
          },
          // LGEGMC-3777 Start
          createPersonalHtml: function (statusCase, msg) {
            const self = this;
            let utmClass = eCrmFlag ? "btn-utm" : "";
            let btnText;
            // LGEAU-1082 Start
            let url = frontDomain;
            switch (statusCase) {
              case "01":
              case "02":
              case "signup":
                url += "/" + COUNTRY_CODE + "/my-lg/login?page=signup";
                btnText = self.$commonMsg.data("signup");
                break;
              case "03":
                msg = msg
                  .replace("{0}", self.couponRemainingDays)
                  .replace(
                    "{1}",
                    $(".navigation")
                      .find(".for-desktop .right-btm .login.logged")
                      .find("#nameMasking")
                      .val()
                  ); //LGEIN-1000
                url += "/" + COUNTRY_CODE + "/my-lg";
                btnText = self.$commonMsg.data("coupon");
                break;
              case "04":
                url +=
                  self.$commonMsg.data("promotionUrl") !==
                  "gnb-personalBanner-btn-promotion-url"
                    ? self.$commonMsg.data("promotionUrl")
                    : "/" + COUNTRY_CODE + "/my-lg";
                btnText = self.$commonMsg.data("promotion");
                break;
              case "05":
              case "signin":
                url +=
                  "/" +
                  COUNTRY_CODE +
                  "/my-lg/login?state=/" +
                  COUNTRY_CODE +
                  "/my-lg";
                btnText = self.$commonMsg.data("signin");
                break;
              case "register":
                url += "/" + COUNTRY_CODE + "/support/register-product-gate";
                btnText = self.$commonMsg.data("register");
                break;
            }
            // LGEAU-1082 End
            /*LGEIN-1000 S*/
            var personalHtml =
              '\
								<div class="banner-item">\
									<div class="banner-box">';
            if (msg.indexOf('"first-name"') > 0) {
              personalHtml += '<p class="text type-thin">' + msg + "</p>";
            } else {
              personalHtml += '<p class="text">' + msg + "</p>";
            }
            personalHtml +=
              '<div class="btn-area">\
											<a class="btn btn-primary btn-sm ' +
              utmClass +
              '" href="' +
              url +
              '">' +
              btnText +
              "</a>\
										</div>\
									</div>\
								</div>";
            /*LGEIN-1000 E*/
            self.$banner.find(".standard-banner-list").prepend(personalHtml);
            if (eCrmFlag) {
              $("body").on("click", "." + utmClass, function () {
                sessionStorage.setItem(UTM_CTA_ACTION, true);
              });
            }

            self.createStandardBanner();
          },
          // LGEGMC-3777 End
          createStandardBanner: function () {
            var self = this;
            // self.$banner.show();

            // 하단에 기본 실행 함수로 위치했던 로직 object 함수화
            // Standard Banner Carousel Script
            if (document.querySelector(".standard-banner-box")) {
              var $standardBanner = $(
                  ".standard-banner-box .standard-banner-list.opt-fade"
                ),
                $standardBannerBox = $standardBanner.closest(
                  ".standard-banner-box"
                );

              self.$banner.removeClass("d-none"); // show after ajax complete
              $standardBanner.slick({
                infinite: true,
                fade: true,
                adaptiveHeight: true,
                // vertical: true,
                autoplay: true,
                touchMove: false,
                swipe: false,
                speed: 600,
                autoplaySpeed: 5000,
                appendArrows: $standardBanner.next(".carousel-btn-wrap"),
                prevArrow: carouselOptions.squarePrev, // common.js variable
                nextArrow: carouselOptions.squareNext, // common.js variable
                // add custom pause btn
              });

              var currentSlide,
                slidesCount,
                $bannerItem = $standardBannerBox.find(
                  ".banner-item:not(.slick-cloned)"
                ),
                totalCount = $bannerItem.length,
                sliderCounter = $standardBannerBox.find(".banner-count");

              if (totalCount > 1) {
                $(sliderCounter).text("1 / " + totalCount);
                $bannerItem.each(function () {
                  $(this).find(".banner-box").removeClass("no-title");
                });
              } else {
                $bannerItem.find(".banner-box").addClass("no-title");
              }

              var updateSliderCounter = function (slick, currentIndex) {
                currentSlide = slick.slickCurrentSlide() + 1;
                slidesCount = slick.slideCount;

                if (slidesCount > 1) {
                  $(sliderCounter).text(currentSlide + " / " + slidesCount);
                }
              };

              $standardBanner.on("init", function (event, slick) {
                updateSliderCounter(slick);
              });

              $standardBanner.on(
                "afterChange",
                function (event, slick, currentSlide) {
                  updateSliderCounter(slick, currentSlide);
                }
              );

              var $pausePosition = $standardBanner[0].slick.$prevArrow;
              $pausePosition.after(
                '<button class="slick-pause type-square" aria-label="Pause" type="button">Pause</button>'
              );
              $pausePosition.after(
                '<button class="slick-play type-square" aria-label="Play" type="button">Play</button>'
              );

              var $pause = $standardBannerBox.find(".slick-pause"),
                $play = $standardBannerBox.find(".slick-play");

              $standardBannerBox.find(".slick-pause").on({
                click: function () {
                  if (!$standardBannerBox.hasClass("paused")) {
                    $standardBanner.slick("slickPause");
                    $standardBannerBox.addClass("paused");
                    $play.focus();
                  }
                },
              });
              $standardBannerBox.find(".slick-play").on({
                click: function () {
                  if ($standardBannerBox.hasClass("paused")) {
                    $standardBanner.slick("slickPlay");
                    $standardBannerBox.removeClass("paused");
                    $pause.focus();
                  }
                },
              });

              $(".gnb-standard-banner-wrap .btn-banner-close").on({
                click: function () {
                  $(".gnb-standard-banner-wrap").hide();
                },
              });
              $(".gnb-notice-banner-wrap .btn-banner-close").on({
                click: function () {
                  $(".gnb-notice-banner-wrap").hide();
                },
              });
            }
          },
          // LGEGMC-3436 End
          addEvent: function () {
            var self = this;
            self.$closeBtn.on("click", function (e) {
              e.preventDefault();
              if (
                typeof ePrivacyCookies == "undefined" ||
                ePrivacyCookies.get("LGCOM_IMPROVEMENTS")
              ) {
                self.setCookie(gnbStandardBanner.cookieName, true);
                self.$banner.hide();
              } else {
                console.log("");
                ePrivacyCookies.view("click");
              }
            });
          },
          getCookie: function (name) {
            if ($.cookie(name)) {
              return decodeURIComponent($.cookie(name));
            } else {
              $.cookie(name);
            }
          },
          setCookie: function (name, value) {
            var lh = location.host;
            var mydomain = ".lg.com";
            if (lh.indexOf("lge.com") >= 0) {
              mydomain = ".lge.com";
            } else if (lh.indexOf("localhost") >= 0) {
              mydomain = "localhost";
            }
            var date = new Date();
            date.setTime(
              date.getTime() + gnbStandardBanner.expiresDate * 60 * 60 * 1000
            ); // 12
            var domain = {
              path: "/",
              domain: mydomain,
              expires: date,
            };

            $.cookie(name, encodeURIComponent(value), domain);
          },
        };
        gnbStandardBanner.init();
      }
    }
    // LGEGMC-2020 End
  });
});
/*// LGEFR-254 : 20210329 add, LGCOMSPEED-6(5th) */
$("body").on("click", ".find-a-dealer ,.inquiry-to-buy", function () {
  var modelYear = nvl($(this).attr("data-model-year"), "");
  var msrp = nvl($(this).attr("data-msrp"), "");
  if (msrp == "." || msrp == ".00" || msrp == "0.0" || msrp == "0") {
    msrp = "";
  }
  if ($(this).closest(".GPC0011").length > 0) {
    if (modelYear == "") {
      modelYear = $(".js-compare").attr("data-model-year");
    }
    var msrp = nvl($(".js-compare").attr("data-msrp"), "");
    if (msrp == "." || msrp == ".00" || msrp == "0.0" || msrp == "0") {
      msrp = "";
    }
  }
  var category = nvl($(this).attr("data-category-name"), "");
  var subCategory = nvl($(this).attr("data-sub-category-name"), "");
  var className = $(this).attr("class");
  var price = nvl($(this).attr("data-price"), "");
  if (price == "." || price == ".00" || price == "0.0" || price == "0") {
    price = "";
  }
  var eventName = "";
  if (className.indexOf("find-a-dealer") != -1) {
    eventName = "find_dealer_click";
  } else {
    eventName = "inquiry_to_buy_click";
  }
  dataLayer.push({
    event: eventName,
    superCategory: $(this).attr("data-super-category-name"),
    category: category,
    subcategory: subCategory,
    modelYear: modelYear,
    modelName: $(this).attr("data-model-name"),
    modelCode: $(this).attr("data-model-id"),
    salesModelCode: $(this).attr("data-model-salesmodelcode"),
    sku: $(this).attr("data-sku"),
    suffix: $(this).attr("data-model-suffixcode"),
    bu: $(this).attr("data-bu"),
    price: price,
    currencyCode: $(".currency-code").val(),
    dimension185: $(".navigation").attr("data-obs-group"),
    metric4: msrp,
  });
  console.log(eventName);
});
/*// PJTGADL-2 : 20210412 add */
$("body").on("click", ".re-stock-alert", function () {
  var modelYear = nvl($(this).attr("data-model-year"), "");
  if (modelYear == "") {
    modelYear = $(".btn.re-stock-alert").attr("data-model-year");
  }
  var price = nvl($(this).attr("data-price"), "");
  if (price == "." || price == ".00" || price == "0.0" || price == "0") {
    price = "";
  }
  var msrp = nvl($(this).attr("data-msrp"), "");
  if (msrp == "." || msrp == ".00" || msrp == "0.0" || msrp == "0") {
    msrp = "";
  }
  if ($(this).closest(".GPC0011").length > 0) {
    dataLayer.push({
      event: "move_to_stock_request_click",
      superCategory: $(".js-compare").attr("data-super-category-name"),
      category: $(".js-compare").attr("data-category-name"),
      subcategory: $(".js-compare").attr("data-sub-category-name"),
      modelYear: $(".js-compare").attr("data-model-year"),
      modelName: $(".js-compare").attr("data-model-name"),
      modelCode: $(".js-compare").attr("data-model-id"),
      salesModelCode: $(".js-compare").attr("data-model-salesmodelcode"),
      sku: $(".js-compare").attr("data-sku"),
      suffix: $(".js-compare").attr("data-model-suffixcode"),
      bu: $(".js-compare").attr("data-bu"),
      price: $(".js-compare").attr("data-price"),
      currencyCode: $(".currency-code").val(),
      dimension185: $(".navigation").attr("data-obs-group"),
      metric4: $(".js-compare").attr("data-msrp"),
    });
  } else {
    dataLayer.push({
      event: "move_to_stock_request_click",
      superCategory: $(this).attr("data-super-category-name"),
      category: $(this).attr("data-category-name"),
      subcategory: $(this).attr("data-sub-category-name"),
      modelYear: modelYear,
      modelName: $(this).attr("data-model-name"),
      modelCode: $(this).attr("data-model-id"),
      salesModelCode: $(this).attr("data-model-salesmodelcode"),
      sku: $(this).attr("data-sku"),
      suffix: $(this).attr("data-model-suffixcode"),
      bu: $(this).attr("data-bu"),
      price: price,
      currencyCode: $(".currency-code").val(),
      dimension185: $(".navigation").attr("data-obs-group"),
      metric4: msrp,
    });
  }
  console.log("move_to_stock_request_click");
});

/*// PJTGADL-2 : 20210331 add */
$("body").on("click", ".js-compare", function () {
  var modelYear = nvl($(this).attr("data-model-year"), "");
  var className = $(this).attr("class");
  var eventName = "";
  if (className.indexOf("added") != -1) {
    eventName = "remove_to_compare_click";
  } else {
    eventName = "add_to_compare_click";
  }
  var price = nvl($(this).attr("data-price"), "");
  if (price == "." || price == ".00" || price == "0.0" || price == "0") {
    price = "";
  }
  var msrp = nvl($(this).attr("data-msrp"), "");
  if (msrp == "." || msrp == ".00" || msrp == "0.0" || msrp == "0") {
    msrp = "";
  }
  dataLayer.push({
    event: eventName,
    superCategory: $(this).attr("data-super-category-name"),
    category: $(this).attr("data-category-name"),
    subcategory: $(this).attr("data-sub-category-name"),
    modelYear: modelYear,
    modelName: $(this).attr("data-model-name"),
    modelCode: $(this).attr("data-model-id"),
    salesModelCode: $(this).attr("data-model-salesmodelcode"),
    sku: $(this).attr("data-sku"),
    suffix: $(this).attr("data-model-suffixcode"),
    bu: $(this).attr("data-bu"),
    price: price,
    currencyCode: $(".currency-code").val(),
    dimension185: $(".navigation").attr("data-obs-group"),
    metric4: msrp,
  });
  console.log(eventName);
});

$("body").on("click", ".remove", function () {
  var modelYear = nvl($(this).attr("data-model-year"), "");
  var price = nvl($(this).attr("data-price"), "");
  if (price == "." || price == ".00" || price == "0.0" || price == "0") {
    price = "";
  }
  var msrp = nvl($(this).attr("data-msrp"), "");
  if (msrp == "." || msrp == ".00" || msrp == "0.0" || msrp == "0") {
    msrp = "";
  }
  dataLayer.push({
    event: "remove_to_compare_click",
    superCategory: $(this).attr("data-super-category-name"),
    category: $(this).attr("data-category-name"),
    subcategory: $(this).attr("data-sub-category-name"),
    modelYear: modelYear,
    modelName: $(this).attr("data-model-name"),
    modelCode: $(this).attr("data-model-id"),
    salesModelCode: $(this).attr("data-model-salesmodelcode"),
    sku: $(this).attr("data-sku"),
    suffix: $(this).attr("data-model-suffixcode"),
    bu: $(this).attr("data-bu"),
    price: price,
    currencyCode: $(".currency-code").val(),
    dimension185: $(".navigation").attr("data-obs-group"),
    metric4: msrp,
  });
  console.log("remove_to_compare_click");
});

//LGEGMC-1430 start
/*
data-internal-search="direct_searches",
data-internal-search="your_recent_searches",
data-internal-search="most_searched"
data-internal-search="recommend_searches"
*/
$("body").on("click", "[data-internal-search]", function () {
  var searchType = nvl($(this).attr("data-internal-search"), "");
  adobeTrackEvent("interanl-search", {
    sk_location: searchType,
    page_event: { interanl_search_click: true },
  });
});

/*
data-internal-tab-search="consumer_products",
data-internal-tab-search="business_products",
data-internal-tab-search="promotions",
data-internal-tab-search="discover",
data-internal-tab-search="support",
data-internal-tab-search="resources",
data-internal-tab-search="articles",
data-internal-tab-search="related_contents",
data-internal-tab-search="news_blogs",
data-internal-tab-search="resource_download"
*/
$("body").on("click", "[data-internal-tab-search]", function () {
  var tabType = nvl($(this).attr("data-internal-tab-search"), "");
  adobeTrackEvent("interanl-tab-search", {
    search_results_tab_name: tabType,
    page_event: { internal_search_result_tab_click: true },
  });
});
//LGEGMC-1430 end
/*// PJTGADL-2 : 20210416 add */
$("body").on("click", ".spec-menu ,.ico-file-pdf", function () {
  if ($(this).closest(".GPC0013").length > 0) {
    var className = $(this).attr("class");
    var eventName = "";
    if (className.indexOf("spec-menu") != -1) {
      eventName = "print_spec_click";
    } else {
      eventName = "pdf_download_click";
    }
    var price = "";
    price = $(".js-compare").attr("data-price");
    if (price == "." || price == ".00" || price == "0.0" || price == "0") {
      price = "";
    }
    var msrp = nvl($(".js-compare").attr("data-msrp"), "");
    if (msrp == "." || msrp == ".00" || msrp == "0.0" || msrp == "0") {
      msrp = "";
    }
    var suffixCode = $(".js-compare").attr("data-model-suffixcode");
    var modelCode = $(".js-compare").attr("data-model-id");
    if (eventName == "pdf_download_click") {
      dataLayer.push({
        event: eventName,
        superCategory: _dl.page_name.super_category,
        category: standardData.level2,
        subcategory: standardData.level3,
        modelYear: _dl.page_name.model_year,
        modelName: _dl.products[0].model_name,
        modelCode: modelCode,
        salesModelCode: _dl.products[0].sales_model_code,
        sku: _dl.page_name.sku,
        suffix: suffixCode,
        fileName: $(this).attr("data-original"),
        fileType: "Product Detail Sheet",
        bu: standardData.level1,
        price: price,
        currencyCode: $(".currency-code").val(),
        dimension185: $(".navigation").attr("data-obs-group"),
        metric4: msrp,
      });
    } else {
      dataLayer.push({
        event: eventName,
        superCategory: _dl.page_name.super_category,
        category: standardData.level2,
        subcategory: standardData.level3,
        modelYear: _dl.page_name.model_year,
        modelName: _dl.products[0].model_name,
        modelCode: modelCode,
        salesModelCode: _dl.products[0].sales_model_code,
        sku: _dl.page_name.sku,
        suffix: suffixCode,
        bu: standardData.level1,
        price: price,
        currencyCode: $(".currency-code").val(),
        dimension185: $(".navigation").attr("data-obs-group"),
        metric4: msrp,
      });
    }
    console.log(eventName);
  }
});

$("body").on(
  "click",
  ".fiche.type-product , .label.type-none, .link-text-uk , .link-text-eu",
  function () {
    var className = $(this).attr("class");
    var fileType = "";
    var modelYear = "";
    if (className.indexOf("fiche type-product") != -1) {
      fileType = "Product Sheet";
    } else {
      fileType = "Energy Saving";
    }
    var price = "";
    if (
      $(this).closest(".component").hasClass("GPC0058") ||
      $(this).closest(".component").hasClass("GPC0082") ||
      $(this).closest(".compare-wrap").hasClass("compare-wrap")
    ) {
      modelYear = nvl($(this).attr("data-model-year"), "");
      price = nvl($(this).attr("data-price"), "");
      if (price == "." || price == ".00" || price == "0.0" || price == "0") {
        price = "";
      }
      var msrp = nvl($(this).attr("data-msrp"), "");
      if (msrp == "." || msrp == ".00" || msrp == "0.0" || msrp == "0") {
        msrp = "";
      }
      dataLayer.push({
        event: "pdf_download_click",
        superCategory: $(this).attr("data-super-category-name"),
        category: $(this).attr("data-category-name"),
        subcategory: $(this).attr("data-sub-category-name"),
        modelYear: modelYear,
        modelName: $(this).attr("data-model-name"),
        modelCode: $(this).attr("data-model-id"),
        salesModelCode: $(this).attr("data-model-salesmodelcode"),
        sku: $(this).attr("data-sku"),
        suffix: $(this).attr("data-model-suffixcode"),
        fileName: $(this).attr("data-original"),
        fileType: fileType,
        bu: $(this).attr("data-bu"),
        price: price,
        currencyCode: $(".currency-code").val(),
        dimension185: $(".navigation").attr("data-obs-group"),
        metric4: msrp,
      });
    } else if ($(this).closest(".component").hasClass("GPC0009")) {
      modelYear = nvl(
        $(this)
          .closest(".pdp-info")
          .find(".js-compare")
          .attr("data-model-year"),
        ""
      );
      price = nvl(
        $(this).closest(".pdp-info").find(".js-compare").attr("data-price"),
        ""
      );
      if (price == "." || price == ".00" || price == "0.0" || price == "0") {
        price = "";
      }
      var msrp = nvl(
        $(this).closest(".pdp-info").find(".js-compare").attr("data-msrp"),
        ""
      );
      if (msrp == "." || msrp == ".00" || msrp == "0.0" || msrp == "0") {
        msrp = "";
      }
      dataLayer.push({
        event: "pdf_download_click",
        superCategory: $(this)
          .closest(".pdp-info")
          .find(".js-compare")
          .attr("data-super-category-name"),
        category: $(this)
          .closest(".pdp-info")
          .find(".js-compare")
          .attr("data-category-name"),
        subcategory: $(this)
          .closest(".pdp-info")
          .find(".js-compare")
          .attr("data-sub-category-name"),
        modelYear: modelYear,
        modelName: $(this)
          .closest(".pdp-info")
          .find(".js-compare")
          .attr("data-model-name"),
        modelCode: $(this)
          .closest(".pdp-info")
          .find(".js-compare")
          .attr("data-model-id"),
        salesModelCode: $(this)
          .closest(".pdp-info")
          .find(".js-compare")
          .attr("data-model-salesmodelcode"),
        sku: $(this).closest(".pdp-info").find(".js-compare").attr("data-sku"),
        suffix: $(this)
          .closest(".pdp-info")
          .find(".js-compare")
          .attr("data-model-suffixcode"),
        fileName: $(this).closest("a").attr("data-original"),
        fileType: fileType,
        bu: $(this).closest(".pdp-info").find(".js-compare").attr("data-bu"),
        price: price,
        currencyCode: $(".currency-code").val(),
        dimension185: $(".navigation").attr("data-obs-group"),
        metric4: msrp,
      });
    } else if ($(this).closest(".component").hasClass("GPC0011")) {
      modelYear = nvl($(this).closest("a").attr("data-model-year"), "");
      price = nvl($(this).closest("a").attr("data-price"), "");
      if (price == "." || price == ".00" || price == "0.0" || price == "0") {
        price = "";
      }
      var msrp = nvl($(this).closest("a").attr("data-msrp"), "");
      if (msrp == "." || msrp == ".00" || msrp == "0.0" || msrp == "0") {
        msrp = "";
      }
      dataLayer.push({
        event: "pdf_download_click",
        superCategory: $(this).closest("a").attr("data-super-category-name"),
        category: $(this).closest("a").attr("data-category-name"),
        subcategory: $(this).closest("a").attr("data-sub-category-name"),
        modelYear: modelYear,
        modelName: $(this).closest("a").attr("data-model-name"),
        modelCode: $(this).closest("a").attr("data-model-id"),
        salesModelCode: $(this).closest("a").attr("data-model-salesmodelcode"),
        sku: $(this).closest("a").attr("data-sku"),
        suffix: $(this).closest("a").attr("data-model-suffixcode"),
        fileName: $(this).closest("a").attr("data-original"),
        fileType: fileType,
        bu: $(this).closest("a").attr("data-bu"),
        price: price,
        currencyCode: $(".currency-code").val(),
        dimension185: $(".navigation").attr("data-obs-group"),
        metric4: msrp,
      });
    } else {
      var price =
        typeof $(this)
          .closest(".item.js-model")
          .find(".js-compare")
          .attr("data-price") == "undefined"
          ? $(this)
              .closest(".products-info")
              .find(".js-compare")
              .attr("data-price")
          : $(this)
              .closest(".item.js-model")
              .find(".js-compare")
              .attr("data-price");
      var msrp =
        typeof $(this)
          .closest(".item.js-model")
          .find(".js-compare")
          .attr("data-msrp") == "undefined"
          ? $(this)
              .closest(".products-info")
              .find(".js-compare")
              .attr("data-msrp")
          : $(this)
              .closest(".item.js-model")
              .find(".js-compare")
              .attr("data-msrp");
      if (msrp == "." || msrp == ".00" || msrp == "0.0" || msrp == "0") {
        msrp = "";
      }
      if (price == "." || price == ".00" || price == "0.0" || price == "0") {
        price = "";
      }
      dataLayer.push({
        event: "pdf_download_click",
        superCategory:
          typeof $(this)
            .closest(".item.js-model")
            .find(".js-compare")
            .attr("data-super-category-name") == "undefined"
            ? $(this)
                .closest(".products-info")
                .find(".js-compare")
                .attr("data-super-category-name")
            : $(this)
                .closest(".item.js-model")
                .find(".js-compare")
                .attr("data-super-category-name"),
        category:
          typeof $(this)
            .closest(".item.js-model")
            .find(".js-compare")
            .attr("data-category-name") == "undefined"
            ? $(this)
                .closest(".products-info")
                .find(".js-compare")
                .attr("data-category-name")
            : $(this)
                .closest(".item.js-model")
                .find(".js-compare")
                .attr("data-category-name"),
        subcategory:
          typeof $(this)
            .closest(".item.js-model")
            .find(".js-compare")
            .attr("data-sub-category-name") == "undefined"
            ? $(this)
                .closest(".products-info")
                .find(".js-compare")
                .attr("data-sub-category-name")
            : $(this)
                .closest(".item.js-model")
                .find(".js-compare")
                .attr("data-sub-category-name"),
        modelYear:
          typeof $(this)
            .closest(".item.js-model")
            .find(".js-compare")
            .attr("data-model-year") == "undefined"
            ? $(this)
                .closest(".products-info")
                .find(".js-compare")
                .attr("data-model-year")
            : $(this)
                .closest(".item.js-model")
                .find(".js-compare")
                .attr("data-model-year"),
        modelName:
          typeof $(this)
            .closest(".item.js-model")
            .find(".js-compare")
            .attr("data-model-name") == "undefined"
            ? $(this)
                .closest(".products-info")
                .find(".js-compare")
                .attr("data-model-name")
            : $(this)
                .closest(".item.js-model")
                .find(".js-compare")
                .attr("data-model-name"),
        modelCode:
          typeof $(this)
            .closest(".item.js-model")
            .find(".js-compare")
            .attr("data-model-id") == "undefined"
            ? $(this)
                .closest(".products-info")
                .find(".js-compare")
                .attr("data-model-id")
            : $(this)
                .closest(".item.js-model")
                .find(".js-compare")
                .attr("data-model-id"),
        salesModelCode:
          typeof $(this)
            .closest(".item.js-model")
            .find(".js-compare")
            .attr("data-model-salesmodelcode") == "undefined"
            ? $(this)
                .closest(".products-info")
                .find(".js-compare")
                .attr("data-model-salesmodelcode")
            : $(this)
                .closest(".item.js-model")
                .find(".js-compare")
                .attr("data-model-salesmodelcode"),
        sku:
          typeof $(this)
            .closest(".item.js-model")
            .find(".js-compare")
            .attr("data-sku") == "undefined"
            ? $(this)
                .closest(".products-info")
                .find(".js-compare")
                .attr("data-sku")
            : $(this)
                .closest(".item.js-model")
                .find(".js-compare")
                .attr("data-sku"),
        suffix:
          typeof $(this)
            .closest(".item.js-model")
            .find(".js-compare")
            .attr("data-model-suffixcode") == "undefined"
            ? $(this)
                .closest(".products-info")
                .find(".js-compare")
                .attr("data-model-suffixcode")
            : $(this)
                .closest(".item.js-model")
                .find(".js-compare")
                .attr("data-model-suffixcode"),
        fileName: $(this).closest("a").attr("data-original"),
        fileType: fileType,
        bu:
          typeof $(this)
            .closest(".item.js-model")
            .find(".js-compare")
            .attr("data-bu") == "undefined"
            ? $(this)
                .closest(".products-info")
                .find(".js-compare")
                .attr("data-bu")
            : $(this)
                .closest(".item.js-model")
                .find(".js-compare")
                .attr("data-bu"),
        price: price,
        currencyCode: $(".currency-code").val(),
        dimension185: $(".navigation").attr("data-obs-group"),
        metric4: msrp,
      });
    }
    console.log("pdf_download_click");
  }
);
/*// PJTGADL-2 : 20210429 add */
$("body").on(
  "click",
  ".star-area,.write-a-review,.btn-popup-review",
  function () {
    //LGEIL-95
    if ($(".GPC0009").length == 0 && $(".GPC0103").length == 0) {
      var modelYear = nvl($(this).attr("data-model-year"), "");
      var className = $(this).attr("class");
      var eventName = "";
      var price = "";
      price = $(this).attr("data-price");
      if (
        $(this).attr("data-price") == "." ||
        $(this).attr("data-price") == ".00" ||
        $(this).attr("data-price") == "0.0" ||
        $(this).attr("data-price") == "0"
      ) {
        price = "";
      }
      var msrp = $(this).attr("data-msrp");
      if (
        $(this).attr("data-msrp") == "." ||
        $(this).attr("data-msrp") == ".00" ||
        $(this).attr("data-msrp") == "0.0" ||
        $(this).attr("data-msrp") == "0"
      ) {
        msrp = "";
      }
      if (className.indexOf("star-area") != -1) {
        eventName = "move_to_review_click";
      } else {
        eventName = "move_to_write_review_click";
      }
      if (eventName == "move_to_review_click") {
        dataLayer.push({
          event: eventName,
          superCategory: $(this).attr("data-super-category-name"),
          category: $(this).attr("data-category-name"),
          subcategory: $(this).attr("data-sub-category-name"),
          modelYear: modelYear,
          modelName: $(this).attr("data-model-name"),
          modelCode: $(this).attr("data-model-id"),
          salesModelCode: $(this).attr("data-model-salesmodelcode"),
          sku: $(this).attr("data-sku"),
          suffix: $(this).attr("data-model-suffixcode"),
          bu: $(this).attr("data-bu"),
          overallScore: $(this).attr("data-model-overallscore"),
          reviewCnt: $(this).attr("data-model-reviewCnt"),
          price: price,
          currencyCode: $(".currency-code").val(),
          dimension185: $(".navigation").attr("data-obs-group"),
          metric4: msrp,
        });
      } else {
        dataLayer.push({
          event: eventName,
          superCategory: $(this).attr("data-super-category-name"),
          category: $(this).attr("data-category-name"),
          subcategory: $(this).attr("data-sub-category-name"),
          modelYear: modelYear,
          modelName: $(this).attr("data-model-name"),
          modelCode: $(this).attr("data-model-id"),
          salesModelCode: $(this).attr("data-model-salesmodelcode"),
          sku: $(this).attr("data-sku"),
          suffix: $(this).attr("data-model-suffixcode"),
          bu: $(this).attr("data-bu"),
          price: price,
          currencyCode: $(".currency-code").val(),
          dimension185: $(".navigation").attr("data-obs-group"),
          metric4: msrp,
        });
      }
      console.log(eventName);
    }
  }
);

//LGEGMC-1430 start
/*
data-internal-search="direct_searches",
data-internal-search="your_recent_searches",
data-internal-search="most_searched"
data-internal-search="recommend_searches"
*/
$("body").on("click", "[data-internal-search]", function () {
  var searchType = nvl($(this).attr("data-internal-search"), "");
  adobeTrackEvent("interanl-search", {
    sk_location: searchType,
    page_event: { interanl_search_click: true },
  });
});

/*
data-internal-tab-search="consumer_products",
data-internal-tab-search="business_products",
data-internal-tab-search="promotions",
data-internal-tab-search="discover",
data-internal-tab-search="support",
data-internal-tab-search="resources",
data-internal-tab-search="articles",
data-internal-tab-search="related_contents",
data-internal-tab-search="news_blogs",
data-internal-tab-search="resource_download"
*/
$("body").on("click", "[data-internal-tab-search]", function () {
  var tabType = nvl($(this).attr("data-internal-tab-search"), "");
  adobeTrackEvent("interanl-tab-search", {
    search_results_tab_name: tabType,
    page_event: { internal_search_result_tab_click: true },
  });
});
//LGEGMC-1430 end

/* LGEGMC-945 Start */
/* 선택한 카테고리 정보에 따른 bu 정보를 가져와 adobe Tracking */
/* I2B 페이지 Iframe에서 호출함수 */
function sendPostMessage(e) {
  console.log("sendPostMessage() call");
  if (e.data.funType == "change") {
    if (typeof standardData != "undefined") {
      console.log(
        "전달된  categoryId : " +
          e.data.categoryCode +
          ", funcType : " +
          e.data.funType
      );
      /* 전송된 정보 확인 */
      if (e.data.Series) console.log("전달된 Series : " + e.data.Series);
      if (e.data.SeriesCode)
        console.log("전달된 SeriesCode : " + e.data.SeriesCode);
      if (e.data.ModelName)
        console.log("전달된 ModelName : " + e.data.ModelName);
      if (e.data.categoryLEVEL1Code)
        console.log("전달된 categoryLEVEL1Code : " + e.data.categoryLEVEL1Code);
      if (e.data.categoryLEVEL1Name)
        console.log("전달된 categoryLEVEL1Name : " + e.data.categoryLEVEL1Name);
      if (e.data.categoryLEVEL2Code)
        console.log("전달된 categoryLEVEL2Code : " + e.data.categoryLEVEL2Code);
      if (e.data.categoryLEVEL2Name)
        console.log("전달된 categoryLEVEL2Name : " + e.data.categoryLEVEL2Name);
      if (e.data.categoryLEVEL3Code)
        console.log("전달된 categoryLEVEL3Code : " + e.data.categoryLEVEL3Code);
      if (e.data.categoryLEVEL3Name)
        console.log("전달된 categoryLEVEL3Name : " + e.data.categoryLEVEL3Name);

      if (e.data.categoryLEVEL1Name && e.data.categoryLEVEL2Name) {
        standardData.level1 = e.data.categoryLEVEL1Name;
        standardData.level2 = e.data.categoryLEVEL2Name;
        if (e.data.categoryLEVEL3Name)
          standardData.level3 = e.data.categoryLEVEL3Name;
      }

      var paramName = "inquiry_to_buy_product_solution_select";
      var param = {};
      param.page_event = {};

      param.level1 = standardData.level1;
      param.level2 = standardData.level2;
      param.level3 = standardData.level3;

      param[paramName] = e.data.categoryName;
      param.page_event[paramName] = true;
      adobeTrackEvent(paramName, param);
    }
  } else if (e.data.funType == "submit") {
    var trackingClassification = "";

    console.log(
      "submit 전달된 categoryLEVEL1Name : " + e.data.categoryLEVEL1Name
    );
    console.log(
      "submit 전달된 categoryLEVEL2Name : " + e.data.categoryLEVEL2Name
    );
    trackingClassification += e.data.categoryLEVEL1Name;
    trackingClassification += "," + e.data.categoryLEVEL2Name;
    if (e.data.categoryLEVEL3Name) {
      trackingClassification += "," + e.data.categoryLEVEL3Name;
      console.log(
        "submit 전달된 categoryLEVEL3Name : " + e.data.categoryLEVEL3Name
      );
    }

    /* 쿠키에 저장 후 서버에서 사용 */
    setCookie("ADOBE_TRACKING_CLASSIFICATION", trackingClassification, true);
  }
}

// LGEGMC-945 End

/*// PJTGADL-2 , LGEGMC-3202 : 20210525 add */
$("body").on("click", ".add-to-cart:not(.in-buynow)", function () {
  // LGEGMC-1841 add
  var _this = $(this);
  var className = $(this).attr("class");
  var preorderFlag = false;
  var eventName = "";
  var modelYear = "";
  var price = "";
  if (className.indexOf("pre-order") != -1) {
    preorderFlag = true;
  }
  price = $(this).attr("data-price");
  if (_this.closest(".GPC0011").length) {
    _this = $(".GPC0009").find(".button a.add-to-cart");
  }
  if (
    _this.attr("data-price") == "." ||
    _this.attr("data-price") == ".00" ||
    _this.attr("data-price") == "0.0" ||
    _this.attr("data-price") == "0"
  ) {
    price = "";
  }
  var msrpPrice = _this.attr("data-msrp");
  if (
    _this.attr("data-msrp") == "." ||
    _this.attr("data-msrp") == ".00" ||
    _this.attr("data-msrp") == "0.0" ||
    _this.attr("data-msrp") == "0"
  ) {
    msrpPrice = "";
  }
  if (preorderFlag) {
    eventName = "pre_order_click";
  } else {
    eventName = "add_to_cart_click";
  }

  if (
    $(this).closest(".component").hasClass("GPC0058") ||
    $(this).closest(".component").hasClass("GPC0082") ||
    $(this).closest(".compare-wrap").hasClass("compare-wrap")
  ) {
    modelYear = nvl($(this).attr("data-model-year"), "");
    dataLayer.push({
      event: eventName,
      superCategory: $(this).attr("data-category-name"),
      category: $(this).attr("data-buname-two"),
      subcategory: $(this).attr("data-buname-three"),
      modelYear: modelYear,
      modelName: $(this).attr("data-sku"),
      modelCode: $(this).attr("data-model-id"),
      salesModelCode: $(this).attr("data-model-salesmodelcode"),
      sku: $(this).attr("data-sku"),
      suffix: $(this).attr("data-model-suffixcode"),
      price: price,
      currencyCode: $(".currency-code").val(),
      bu: $(this).attr("data-buname-one"),
      dimension185: $(".navigation").attr("data-obs-group"),
      metric4: msrpPrice,
      cart_btn: "Y",
    });
    digitalDataLayer.push({
      event: eventName,
      superCategory: $(this).attr("data-category-name"),
      category: $(this).attr("data-buname-two"),
      subcategory: $(this).attr("data-buname-three"),
      modelYear: modelYear,
      modelName: $(this).attr("data-sku"),
      modelCode: $(this).attr("data-model-id"),
      salesModelCode: $(this).attr("data-model-salesmodelcode"),
      sku: $(this).attr("data-sku"),
      suffix: $(this).attr("data-model-suffixcode"),
      price: price,
      currencyCode: $(".currency-code").val(),
      bu: $(this).attr("data-buname-one"),
      dimension185: $(".navigation").attr("data-obs-group"),
      metric4: msrpPrice,
      cart_btn: "Y",
    });
  } else if ($(this).closest(".component").hasClass("GPC0009")) {
    modelYear = nvl(
      $(this).closest(".pdp-info").find(".js-compare").attr("data-model-year"),
      ""
    );
    dataLayer.push({
      event: eventName,
      superCategory: $(this)
        .closest(".pdp-info")
        .find(".js-compare")
        .attr("data-super-category-name"),
      category: $(this)
        .closest(".pdp-info")
        .find(".js-compare")
        .attr("data-category-name"),
      subcategory: $(this)
        .closest(".pdp-info")
        .find(".js-compare")
        .attr("data-sub-category-name"),
      modelYear: modelYear,
      modelName: $(this)
        .closest(".pdp-info")
        .find(".js-compare")
        .attr("data-model-name"),
      modelCode: $(this)
        .closest(".pdp-info")
        .find(".js-compare")
        .attr("data-model-id"),
      salesModelCode: $(this)
        .closest(".pdp-info")
        .find(".js-compare")
        .attr("data-model-salesmodelcode"),
      sku: $(this).closest(".pdp-info").find(".js-compare").attr("data-sku"),
      suffix: $(this)
        .closest(".pdp-info")
        .find(".js-compare")
        .attr("data-model-suffixcode"),
      price: price,
      currencyCode: $(".currency-code").val(),
      bu: $(this).closest(".pdp-info").find(".js-compare").attr("data-bu"),
      dimension185: $(".navigation").attr("data-obs-group"),
      metric4: msrpPrice,
      cart_btn: "Y",
    });
    digitalDataLayer.push({
      event: eventName,
      superCategory: $(this)
        .closest(".pdp-info")
        .find(".js-compare")
        .attr("data-super-category-name"),
      category: $(this)
        .closest(".pdp-info")
        .find(".js-compare")
        .attr("data-category-name"),
      subcategory: $(this)
        .closest(".pdp-info")
        .find(".js-compare")
        .attr("data-sub-category-name"),
      modelYear: modelYear,
      modelName: $(this)
        .closest(".pdp-info")
        .find(".js-compare")
        .attr("data-model-name"),
      modelCode: $(this)
        .closest(".pdp-info")
        .find(".js-compare")
        .attr("data-model-id"),
      salesModelCode: $(this)
        .closest(".pdp-info")
        .find(".js-compare")
        .attr("data-model-salesmodelcode"),
      sku: $(this).closest(".pdp-info").find(".js-compare").attr("data-sku"),
      suffix: $(this)
        .closest(".pdp-info")
        .find(".js-compare")
        .attr("data-model-suffixcode"),
      price: price,
      currencyCode: $(".currency-code").val(),
      bu: $(this).closest(".pdp-info").find(".js-compare").attr("data-bu"),
      dimension185: $(".navigation").attr("data-obs-group"),
      metric4: msrpPrice,
      cart_btn: "Y",
    });
  } else if ($(this).closest(".component").hasClass("GPC0011")) {
    var modelYear = nvl($(".js-compare").attr("data-model-year"), "");
    if (modelYear == "") {
      modelYear = $(".js-compare").attr("data-model-year");
    }
    dataLayer.push({
      event: eventName,
      superCategory: $(".js-compare").attr("data-category-name"),
      category: $(".js-compare").attr("data-buname-two"),
      subcategory: $(".js-compare").attr("data-buname-three"),
      modelYear: modelYear,
      modelName: $(".js-compare").attr("data-sku"),
      modelCode: $(".js-compare").attr("data-model-id"),
      salesModelCode: $(".js-compare").attr("data-model-salesmodelcode"),
      sku: $(".js-compare").attr("data-sku"),
      suffix: $(".js-compare").attr("data-model-suffixcode"),
      price: price,
      currencyCode: $(".currency-code").val(),
      bu: $(".js-compare").attr("data-buname-one"),
      dimension185: $(".navigation").attr("data-obs-group"),
      metric4: msrpPrice,
      cart_btn: "Y",
    });
    digitalDataLayer.push({
      event: eventName,
      superCategory: $(".js-compare").attr("data-category-name"),
      category: $(".js-compare").attr("data-buname-two"),
      subcategory: $(".js-compare").attr("data-buname-three"),
      modelYear: modelYear,
      modelName: $(".js-compare").attr("data-sku"),
      modelCode: $(".js-compare").attr("data-model-id"),
      salesModelCode: $(".js-compare").attr("data-model-salesmodelcode"),
      sku: $(".js-compare").attr("data-sku"),
      suffix: $(".js-compare").attr("data-model-suffixcode"),
      price: price,
      currencyCode: $(".currency-code").val(),
      bu: $(".js-compare").attr("data-buname-one"),
      dimension185: $(".navigation").attr("data-obs-group"),
      metric4: msrpPrice,
      cart_btn: "Y",
    });
  } else if ($(this).closest(".component").hasClass("GPC0102")) {
    var price = $(".GPC0009").find(".add-to-cart").attr("data-price");
    if (price == "." || price == ".00" || price == "0.0" || price == "0") {
      price = "";
    }
    var msrpPrice = $(".GPC0009").find(".add-to-cart").attr("data-msrp");
    if (
      msrpPrice == "." ||
      msrpPrice == ".00" ||
      msrpPrice == "0.0" ||
      msrpPrice == "0"
    ) {
      msrpPrice = "";
    }
    dataLayer.push({
      event: eventName,
      superCategory: $(".GPC0009")
        .find(".add-to-cart")
        .attr("data-category-name"),
      category: $(".GPC0009").find(".add-to-cart").attr("data-buname-two"),
      subcategory: $(".GPC0009").find(".add-to-cart").attr("data-buname-three"),
      modelYear: $(".GPC0009").find(".add-to-cart").attr("data-model-year"),
      modelName: $(".GPC0009").find(".add-to-cart").attr("data-sku"),
      modelCode: $(".GPC0009").find(".add-to-cart").attr("data-model-id"),
      salesModelCode: $(".GPC0009")
        .find(".add-to-cart")
        .attr("data-model-salesmodelcode"),
      sku: $(".GPC0009").find(".add-to-cart").attr("data-sku"),
      suffix: $(".GPC0009").find(".add-to-cart").attr("data-model-suffixcode"),
      price: price,
      currencyCode: $(".currency-code").val(),
      bu: $(".GPC0009").find(".add-to-cart"),
      dimension185: $(".navigation").attr("data-obs-group"),
      metric4: msrpPrice,
      cart_btn: "Y",
    });
    digitalDataLayer.push({
      event: eventName,
      superCategory: $(".GPC0009")
        .find(".add-to-cart")
        .attr("data-category-name"),
      category: $(".GPC0009").find(".add-to-cart").attr("data-buname-two"),
      subcategory: $(".GPC0009").find(".add-to-cart").attr("data-buname-three"),
      modelYear: $(".GPC0009").find(".add-to-cart").attr("data-model-year"),
      modelName: $(".GPC0009").find(".add-to-cart").attr("data-sku"),
      modelCode: $(".GPC0009").find(".add-to-cart").attr("data-model-id"),
      salesModelCode: $(".GPC0009")
        .find(".add-to-cart")
        .attr("data-model-salesmodelcode"),
      sku: $(".GPC0009").find(".add-to-cart").attr("data-sku"),
      suffix: $(".GPC0009").find(".add-to-cart").attr("data-model-suffixcode"),
      price: price,
      currencyCode: $(".currency-code").val(),
      bu: $(".GPC0009").find(".add-to-cart"),
      dimension185: $(".navigation").attr("data-obs-group"),
      metric4: msrpPrice,
      cart_btn: "Y",
    });
  } else if ($(".match-product-list").length > 0) {
    dataLayer.push({
      event: eventName,
      superCategory: $(this).attr("data-category-name"),
      category: $(this).attr("data-buname-two"),
      subcategory: $(this).attr("data-buname-three"),
      modelYear: $(this).attr("data-model-year"),
      modelName: $(this).attr("data-sku"),
      modelCode: $(this).attr("data-model-id"),
      salesModelCode: $(this).attr("data-model-salesmodelcode"),
      sku: $(this).attr("data-sku"),
      suffix: $(this).attr("data-model-suffixcode"),
      price: price,
      currencyCode: $(".currency-code").val(),
      bu: $(this).attr("data-buname-one"),
      dimension185: $(".navigation").attr("data-obs-group"),
      metric4: msrpPrice,
      cart_btn: "Y",
    });
    digitalDataLayer.push({
      event: eventName,
      superCategory: $(this).attr("data-category-name"),
      category: $(this).attr("data-buname-two"),
      subcategory: $(this).attr("data-buname-three"),
      modelYear: $(this).attr("data-model-year"),
      modelName: $(this).attr("data-sku"),
      modelCode: $(this).attr("data-model-id"),
      salesModelCode: $(this).attr("data-model-salesmodelcode"),
      sku: $(this).attr("data-sku"),
      suffix: $(this).attr("data-model-suffixcode"),
      price: price,
      currencyCode: $(".currency-code").val(),
      bu: $(this).attr("data-buname-one"),
      dimension185: $(".navigation").attr("data-obs-group"),
      metric4: msrpPrice,
      cart_btn: "Y",
    });
  } // LGEGMCGA-35 Start
  else if ($(this).closest(".component").hasClass("GPC0162")) {
    $(".after-item").each(function () {
      var liArea = $(this).closest("li");
      if (!$(this).hasClass("d-none")) {
        dataLayer.push({
          event: eventName,
          bu: liArea.attr("data-bu"),
          superCategory: liArea.attr("data-super-category-name"),
          category: liArea.attr("data-category-name"),
          subcategory: liArea.attr("data-sub-category-name"),
          modelYear: liArea.attr("data-model-year"),
          modelName: liArea.attr("data-model-name"),
          modelCode: liArea.attr("data-model-id"),
          salesModelCode: liArea.attr("data-model-salesmodelcode"),
          sku: liArea.attr("data-sku"),
          suffix: liArea.attr("data-model-suffixcode"),
          price: liArea.attr("data-price"),
          currencyCode: $(".currency-code").val(),
        });
        digitalDataLayer.push({
          event: eventName,
          bu: liArea.attr("data-bu"),
          superCategory: liArea.attr("data-super-category-name"),
          category: liArea.attr("data-category-name"),
          subcategory: liArea.attr("data-sub-category-name"),
          modelYear: liArea.attr("data-model-year"),
          modelName: liArea.attr("data-model-name"),
          modelCode: liArea.attr("data-model-id"),
          salesModelCode: liArea.attr("data-model-salesmodelcode"),
          sku: liArea.attr("data-sku"),
          suffix: liArea.attr("data-model-suffixcode"),
          price: liArea.attr("data-price"),
          currencyCode: $(".currency-code").val(),
        });
      }
    }); // LGEGMCGA-35 End
  } else {
    dataLayer.push({
      event: eventName,
      superCategory:
        typeof $(this)
          .closest(".item.js-model")
          .find(".js-compare")
          .attr("data-super-category-name") == "undefined"
          ? $(this)
              .closest(".products-info")
              .find(".js-compare")
              .attr("data-super-category-name")
          : $(this)
              .closest(".item.js-model")
              .find(".js-compare")
              .attr("data-super-category-name"),
      category:
        typeof $(this)
          .closest(".item.js-model")
          .find(".js-compare")
          .attr("data-category-name") == "undefined"
          ? $(this)
              .closest(".products-info")
              .find(".js-compare")
              .attr("data-category-name")
          : $(this)
              .closest(".item.js-model")
              .find(".js-compare")
              .attr("data-category-name"),
      subcategory:
        typeof $(this)
          .closest(".item.js-model")
          .find(".js-compare")
          .attr("data-sub-category-name") == "undefined"
          ? $(this)
              .closest(".products-info")
              .find(".js-compare")
              .attr("data-sub-category-name")
          : $(this)
              .closest(".item.js-model")
              .find(".js-compare")
              .attr("data-sub-category-name"),
      modelYear:
        typeof $(this)
          .closest(".item.js-model")
          .find(".js-compare")
          .attr("data-model-year") == "undefined"
          ? $(this)
              .closest(".products-info")
              .find(".js-compare")
              .attr("data-model-year")
          : $(this)
              .closest(".item.js-model")
              .find(".js-compare")
              .attr("data-model-year"),
      modelName:
        typeof $(this)
          .closest(".item.js-model")
          .find(".js-compare")
          .attr("data-model-name") == "undefined"
          ? $(this)
              .closest(".products-info")
              .find(".js-compare")
              .attr("data-model-name")
          : $(this)
              .closest(".item.js-model")
              .find(".js-compare")
              .attr("data-model-name"),
      modelCode:
        typeof $(this)
          .closest(".item.js-model")
          .find(".js-compare")
          .attr("data-model-id") == "undefined"
          ? $(this)
              .closest(".products-info")
              .find(".js-compare")
              .attr("data-model-id")
          : $(this)
              .closest(".item.js-model")
              .find(".js-compare")
              .attr("data-model-id"),
      salesModelCode:
        typeof $(this)
          .closest(".item.js-model")
          .find(".js-compare")
          .attr("data-model-salesmodelcode") == "undefined"
          ? $(this)
              .closest(".products-info")
              .find(".js-compare")
              .attr("data-model-salesmodelcode")
          : $(this)
              .closest(".item.js-model")
              .find(".js-compare")
              .attr("data-model-salesmodelcode"),
      sku:
        typeof $(this)
          .closest(".item.js-model")
          .find(".js-compare")
          .attr("data-sku") == "undefined"
          ? $(this)
              .closest(".products-info")
              .find(".js-compare")
              .attr("data-sku")
          : $(this)
              .closest(".item.js-model")
              .find(".js-compare")
              .attr("data-sku"),
      suffix:
        typeof $(this)
          .closest(".item.js-model")
          .find(".js-compare")
          .attr("data-model-suffixcode") == "undefined"
          ? $(this)
              .closest(".products-info")
              .find(".js-compare")
              .attr("data-model-suffixcode")
          : $(this)
              .closest(".item.js-model")
              .find(".js-compare")
              .attr("data-model-suffixcode"),
      bu:
        typeof $(this)
          .closest(".item.js-model")
          .find(".js-compare")
          .attr("data-bu") == "undefined"
          ? $(this)
              .closest(".products-info")
              .find(".js-compare")
              .attr("data-bu")
          : $(this)
              .closest(".item.js-model")
              .find(".js-compare")
              .attr("data-bu"),
      price: price,
      currencyCode: $(".currency-code").val(),
      dimension185: $(".navigation").attr("data-obs-group"),
      metric4: msrpPrice,
      cart_btn: "Y",
    });
    digitalDataLayer.push({
      event: eventName,
      superCategory:
        typeof $(this)
          .closest(".item.js-model")
          .find(".js-compare")
          .attr("data-super-category-name") == "undefined"
          ? $(this)
              .closest(".products-info")
              .find(".js-compare")
              .attr("data-super-category-name")
          : $(this)
              .closest(".item.js-model")
              .find(".js-compare")
              .attr("data-super-category-name"),
      category:
        typeof $(this)
          .closest(".item.js-model")
          .find(".js-compare")
          .attr("data-category-name") == "undefined"
          ? $(this)
              .closest(".products-info")
              .find(".js-compare")
              .attr("data-category-name")
          : $(this)
              .closest(".item.js-model")
              .find(".js-compare")
              .attr("data-category-name"),
      subcategory:
        typeof $(this)
          .closest(".item.js-model")
          .find(".js-compare")
          .attr("data-sub-category-name") == "undefined"
          ? $(this)
              .closest(".products-info")
              .find(".js-compare")
              .attr("data-sub-category-name")
          : $(this)
              .closest(".item.js-model")
              .find(".js-compare")
              .attr("data-sub-category-name"),
      modelYear:
        typeof $(this)
          .closest(".item.js-model")
          .find(".js-compare")
          .attr("data-model-year") == "undefined"
          ? $(this)
              .closest(".products-info")
              .find(".js-compare")
              .attr("data-model-year")
          : $(this)
              .closest(".item.js-model")
              .find(".js-compare")
              .attr("data-model-year"),
      modelName:
        typeof $(this)
          .closest(".item.js-model")
          .find(".js-compare")
          .attr("data-model-name") == "undefined"
          ? $(this)
              .closest(".products-info")
              .find(".js-compare")
              .attr("data-model-name")
          : $(this)
              .closest(".item.js-model")
              .find(".js-compare")
              .attr("data-model-name"),
      modelCode:
        typeof $(this)
          .closest(".item.js-model")
          .find(".js-compare")
          .attr("data-model-id") == "undefined"
          ? $(this)
              .closest(".products-info")
              .find(".js-compare")
              .attr("data-model-id")
          : $(this)
              .closest(".item.js-model")
              .find(".js-compare")
              .attr("data-model-id"),
      salesModelCode:
        typeof $(this)
          .closest(".item.js-model")
          .find(".js-compare")
          .attr("data-model-salesmodelcode") == "undefined"
          ? $(this)
              .closest(".products-info")
              .find(".js-compare")
              .attr("data-model-salesmodelcode")
          : $(this)
              .closest(".item.js-model")
              .find(".js-compare")
              .attr("data-model-salesmodelcode"),
      sku:
        typeof $(this)
          .closest(".item.js-model")
          .find(".js-compare")
          .attr("data-sku") == "undefined"
          ? $(this)
              .closest(".products-info")
              .find(".js-compare")
              .attr("data-sku")
          : $(this)
              .closest(".item.js-model")
              .find(".js-compare")
              .attr("data-sku"),
      suffix:
        typeof $(this)
          .closest(".item.js-model")
          .find(".js-compare")
          .attr("data-model-suffixcode") == "undefined"
          ? $(this)
              .closest(".products-info")
              .find(".js-compare")
              .attr("data-model-suffixcode")
          : $(this)
              .closest(".item.js-model")
              .find(".js-compare")
              .attr("data-model-suffixcode"),
      bu:
        typeof $(this)
          .closest(".item.js-model")
          .find(".js-compare")
          .attr("data-bu") == "undefined"
          ? $(this)
              .closest(".products-info")
              .find(".js-compare")
              .attr("data-bu")
          : $(this)
              .closest(".item.js-model")
              .find(".js-compare")
              .attr("data-bu"),
      price: price,
      currencyCode: $(".currency-code").val(),
      dimension185: $(".navigation").attr("data-obs-group"),
      metric4: msrpPrice,
      cart_btn: "Y",
    });
  }
  console.log(eventName);
});

$("body").on("click", ".product-enquiry", function () {
  var price = "";
  price = $(".js-compare").attr("data-price");
  if (price == "." || price == ".00" || price == "0.0" || price == "0") {
    price = "";
  }
  var msrp = nvl($(".js-compare").attr("data-msrp"), "");
  if (msrp == "." || msrp == ".00" || msrp == "0.0" || msrp == "0") {
    msrp = "";
  }
  var cartBtn = "";
  if ($(this).parent(".button").find(".add-to-cart").length > 0) {
    cartBtn = "Y";
  } else {
    cartBtn = "N";
  }
  var suffixCode = $(".js-compare").attr("data-model-suffixcode");
  var modelCode = $(".js-compare").attr("data-model-id");
  dataLayer.push({
    event: "move_to_cs_enquiry",
    superCategory: _dl.page_name.super_category,
    category: standardData.level2,
    subcategory: standardData.level3,
    modelYear: _dl.page_name.model_year,
    modelName: _dl.products[0].model_name,
    modelCode: modelCode,
    salesModelCode: _dl.products[0].sales_model_code,
    sku: _dl.page_name.sku,
    suffix: suffixCode,
    bu: standardData.level1,
    price: price,
    currencyCode: $(".currency-code").val(),
    dimension185: $(".navigation").attr("data-obs-group"),
    metric4: msrp,
    cart_btn: cartBtn,
  });

  console.log("move_to_cs_enquiry");
});

/*// PJTGADL-2 : 20210331 add */
$("body").on("click", ".add-to-compare, .remove-to-compare", function () {
  var modelYear = nvl($(this).attr("data-model-year"), "");
  var className = $(this).attr("class");
  var eventName = "";
  if (className.indexOf("add-to-compare") != -1) {
    eventName = "add_to_compare_click";
  } else {
    eventName = "remove_to_compare_click";
  }
  var price = nvl($(this).attr("data-price"), "");
  if (price == "." || price == ".00" || price == "0.0" || price == "0") {
    price = "";
  }
  var msrp = nvl($(this).attr("data-msrp"), "");
  if (msrp == "." || msrp == ".00" || msrp == "0.0" || msrp == "0") {
    msrp = "";
  }
  dataLayer.push({
    event: eventName,
    superCategory: $(this).attr("data-super-category-name"),
    category: $(this).attr("data-category-name"),
    subcategory: $(this).attr("data-sub-category-name"),
    modelYear: modelYear,
    modelName: $(this).attr("data-model-name"),
    modelCode: $(this).attr("data-model-id"),
    salesModelCode: $(this).attr("data-model-salesmodelcode"),
    sku: $(this).attr("data-sku"),
    suffix: $(this).attr("data-model-suffixcode"),
    bu: $(this).attr("data-bu"),
    price: price,
    currencyCode: $(".currency-code").val(),
    dimension185: $(".navigation").attr("data-obs-group"),
    metric4: msrp,
  });
  console.log(eventName);
});
/*// PJTGADL-2 : 20210525 add */

/*// PJTGADL-2 : 20210416 add */
$("body").on("click", ".recommended-products", function () {
  var eventName = "recommended_products_click";
  // LGEUK-896
  let plpFlag = autoNvl($(this).attr("data-plpFlag"), "N"); // Y = PLP, N = PDP
  var price = "";
  price =
    plpFlag === "Y"
      ? $(this).attr("data-price")
      : $(".js-compare").attr("data-price");
  if (price == "." || price == ".00" || price == "0.0" || price == "0") {
    price = "";
  }
  var msrp = nvl($(".js-compare").attr("data-msrp"), "");
  if (msrp == "." || msrp == ".00" || msrp == "0.0" || msrp == "0") {
    msrp = "";
  }
  var suffixCode = $(".js-compare").attr("data-model-suffixcode");
  var modelCode = $(".js-compare").attr("data-model-id");
  // LGEUK-896 Start : PLP 페이지 Flag 추가
  dataLayer.push({
    event: eventName,
    superCategory:
      plpFlag === "Y"
        ? $(this).attr("data-super-category-name")
        : _dl.page_name.super_category,
    category:
      plpFlag === "Y" ? $(this).attr("data-buname-two") : standardData.level2,
    subcategory:
      plpFlag === "Y" ? $(this).attr("data-buname-three") : standardData.level3,
    modelYear:
      plpFlag === "Y"
        ? $(this).attr("data-model-year")
        : _dl.page_name.model_year,
    modelName:
      plpFlag === "Y"
        ? $(this).attr("data-model-name")
        : _dl.products[0].model_name,
    modelCode: plpFlag === "Y" ? $(this).attr("data-model-id") : modelCode,
    salesModelCode:
      plpFlag === "Y"
        ? $(this).attr("data-model-salesmodelcode")
        : _dl.products[0].sales_model_code,
    sku: plpFlag === "Y" ? $(this).attr("data-sku") : _dl.page_name.sku,
    suffix:
      plpFlag === "Y" ? $(this).attr("data-model-suffixcode") : suffixCode,
    bu: plpFlag === "Y" ? $(this).attr("data-bu") : standardData.level1,
    price: price,
    currencyCode: $(".currency-code").val(),
  });
  // LGEUK-896 End
  console.log(eventName);
});

/*// PJTGADL-2 */
$("body").on("click", ".product-support", function () {
  var eventName = "move_to_product_support";
  var price = "";
  price = $(".js-compare").attr("data-price");
  if (price == "." || price == ".00" || price == "0.0" || price == "0") {
    price = "";
  }
  var msrp = nvl($(".js-compare").attr("data-msrp"), "");
  if (msrp == "." || msrp == ".00" || msrp == "0.0" || msrp == "0") {
    msrp = "";
  }
  var suffixCode = $(".js-compare").attr("data-model-suffixcode");
  var modelCode = $(".js-compare").attr("data-model-id");
  dataLayer.push({
    event: eventName,
    superCategory: _dl.page_name.super_category,
    category: standardData.level2,
    subcategory: standardData.level3,
    modelYear: _dl.page_name.model_year,
    modelName: _dl.products[0].model_name,
    modelCode: modelCode,
    salesModelCode: _dl.products[0].sales_model_code,
    sku: _dl.page_name.sku,
    suffix: suffixCode,
    bu: standardData.level1,
    price: price,
    currencyCode: $(".currency-code").val(),
  });
  console.log(eventName);
});

//PJTSEARCH-1 start
$("body").on("click", "[data-keyword-search-url]", function () {
  var form = document.createElement("form");
  var param = new Array();
  var input = new Array();

  if ($(this).hasClass("inquiry-to-buy") || $(this).hasClass("inquiry")) {
    var url = $(this).attr("data-keyword-search-url");
    var page = $(this).attr("data-keyword-search");
    if (url.indexOf("?") == -1) {
      url = url + "?srchFlag=Y&srchPage=" + page;
    } else {
      url = url + "&srchFlag=Y&srchPage=" + page;
    }

    window.location.href = url;
  } else {
    var url = $(this).attr("data-keyword-search-url");
    var page = $(this).attr("data-keyword-search");
    var target = $(this).attr("target");

    if (typeof target !== "undefined" && target == "_blank") {
      form.target = "_blank";
    }

    form.action = url;
    form.method = "post";

    param.push(["srchFlag", "Y"]);
    param.push(["srchPage", page]);

    for (var i = 0; i < param.length; i++) {
      input[i] = document.createElement("input");
      input[i].setAttribute("type", "hidden");
      input[i].setAttribute("name", param[i][0]);
      input[i].setAttribute("value", param[i][1]);
      form.appendChild(input[i]);
    }
    document.body.appendChild(form);
    form.submit();
  }
});

function aLinkPost(url, page, target) {
  var form = document.createElement("form");
  var param = new Array();
  var input = new Array();
  var flag = "Y";

  if (typeof url === "undefined" || url == "") {
    url = "";
    page = "";
    flag = "";
  }

  if (typeof target !== "undefined" || target != "") {
    if (target == "_blank") {
      form.action = "_blank";
    }
  }

  form.action = url;
  form.method = "post";

  param.push(["srchFlag", flag]);
  param.push(["srchPage", page]);

  for (var i = 0; i < param.length; i++) {
    input[i] = document.createElement("input");
    input[i].setAttribute("type", "hidden");
    input[i].setAttribute("name", param[i][0]);
    input[i].setAttribute("value", param[i][1]);
    form.appendChild(input[i]);
  }
  document.body.appendChild(form);
  form.submit();
}
//PJTSEARCH-1 end

// 2022.02.25 설치서비스 제공 start
const $modalBtn = $(".js-installration");
$modalBtn.on("click", function () {
  if ($("#modal_installration").length == 0) return;

  $("#modal_installration").addClass("active");
  $("body").addClass("modal-open");

  const $modalLayer = $("#modal_installration");
  const $modalCloseBtn = $modalLayer.find(".close");
  const $firstTabStop = $modalLayer.find(".btn-accodian").first();

  $modalLayer.focus();
  modalMovement();

  function modalMovement() {
    $modalCloseBtn.on("click", function () {
      closeModal();
    });

    $modalLayer.find(".btn-accodian").on("click", function () {
      $(this).next(".accodian-content").stop().slideToggle(300);
      $(this).parent(".item").toggleClass("on").siblings().removeClass("on");
      $(this).parent(".item").siblings().find(".accodian-content").slideUp(300);
    });

    $modalLayer.on("keydown", function (e) {
      if (e.keyCode == 9) {
        // SHIFT + TAB
        if (e.shiftKey) {
          if ($(":focus")[0] === $firstTabStop[0]) {
            e.preventDefault();
            $modalCloseBtn.focus();
          }
          // TAB
        } else {
          if ($(":focus")[0] === $modalCloseBtn[0]) {
            e.preventDefault();
            $firstTabStop.focus();
          }
        }
      }
      // ESCAPE
      if (e.keyCode === 27) {
        closeModal();
      }
    });
  }

  function closeModal() {
    $modalLayer.removeClass("active");
    $("body").removeClass("modal-open");
    $modalBtn.focus();
  }
});
// 2022.02.25 설치서비스 제공 end

/*LGEGMC-2766 start*/
if (
  COUNTRY_CODE == "tw" &&
  typeof getUrlParams().ecid !== "undefined" &&
  typeof standardData !== "undefined" &&
  standardData.pageType !== "CS" &&
  standardData.pageType !== "OTHERS"
) {
  setCookie("ecid", getUrlParams().ecid, false, 1);
}
/*LGEGMC-2766 end*/
/* LGEDE-615 start*/
$(function () {
  var p = getUrlParams();
  if (Object.keys(p).length != 0) {
    var t = p.dataTab;
    if (typeof t !== "undefined") {
      s = t.replace(/[^0-9]/g, "");
      $(".tabs-type-liner a").removeClass("active");
      $(".tabs-type-liner li:eq(" + s + ") a").addClass("active");
      $(".privacyPolicy-tabsCont").removeClass("active");
      $("#privacyPolicy-tabsCont_" + s).addClass("active");
    }
  }
});
/* LGEDE-615 end*/
/* LGEBR-1435 START*/
if (COUNTRY_CODE.toLowerCase() == "br") {
  //define - all pages
  $("head").append(
    '<script type="text/javascript" async src="//534007295.collect.igodigital.com/collect.js"></script>'
  );
  var _etmc = [];
  _etmc.push(["setOrgId", "534007295"]);
  _etmc.push(["trackPageView"]);

  window.addEventListener("load", function () {
    var chkPage =
      typeof _dl.page_name.page_purpose != "undefined"
        ? _dl.page_name.page_purpose
        : "";
    if (
      chkPage == "super-category" ||
      chkPage == "category" ||
      chkPage == "sub-category" ||
      chkPage == "pdp" ||
      chkPage == "search"
    ) {
      var pagePurpose =
        typeof _dl.page_name.page_purpose != "undefined"
          ? _dl.page_name.page_purpose
          : "";

      if (pagePurpose == "super-category") {
        var superCategoryName =
          typeof _dl.page_name.super_category != "undefined"
            ? _dl.page_name.super_category
            : "";
        _etmc.push(["setOrgId", "534007295"]);
        _etmc.push(["trackPageView", { category: superCategoryName }]);
      } else if (pagePurpose == "category") {
        var categoryName =
          typeof _dl.page_name.category != "undefined"
            ? _dl.page_name.category
            : "";
        _etmc.push(["setOrgId", "534007295"]);
        _etmc.push(["trackPageView", { category: categoryName }]);
      } else if (pagePurpose == "sub-category") {
        var subCategoryName =
          typeof _dl.page_name.sub_category != "undefined"
            ? _dl.page_name.sub_category
            : "";
        _etmc.push(["setOrgId", "534007295"]);
        _etmc.push(["trackPageView", { category: subCategoryName }]);
      } else if (pagePurpose == "pdp") {
        var pdpSalesName =
          typeof _dl.products[0].sales_model_code != "undefined"
            ? _dl.products[0].sales_model_code
            : "";
        _etmc.push(["setOrgId", "534007295"]);
        _etmc.push(["trackPageView", { item: pdpSalesName }]);
      } else if (pagePurpose == "search") {
        var searchKeyword =
          typeof _dl.search_keyword != "undefined" ? _dl.search_keyword : "";
        _etmc.push(["setOrgId", "534007295"]);
        _etmc.push(["trackPageView", { search: searchKeyword }]);
      }
    }
  });
}
/* LGEBR-1435 END*/
/* LGERU-225 Start */
if (COUNTRY_CODE.toLowerCase() == "cn" && typeof _hmt != "undefined") {
  var lgCggroupName =
    typeof _dl != "undefined"
      ? _dl.page_name.page_purpose
      : typeof standardData != "undefined"
      ? standardData.pageType
      : "";

  if (
    lgCggroupName == "others" &&
    window.location.href.indexOf("/cn/my-lg/") > -1
  ) {
    lgCggroupName = "mylg";
  } else if (
    lgCggroupName == "" &&
    (window.location.href.indexOf("https://sso.lg.com/") > -1 ||
      window.location.href.indexOf("https://ssodev.lg.com/") > -1)
  ) {
    lgCggroupName = "sso";
  }

  var $lg_cggroup =
    typeof baidu_lg_cggroup != "undefined"
      ? baidu_lg_cggroup[lgCggroupName]
        ? baidu_lg_cggroup[lgCggroupName]
        : lgCggroupName
      : lgCggroupName;

  $("header a, .footer-component > .footer-contents a").on(
    "click",
    function (e) {
      if (!!!$(this).data().linkArea) return false;

      var navigationLevel =
        typeof baidu_navigation_level != "undefined"
          ? baidu_navigation_level[$(this).data().linkArea]
          : "";
      $navigation_level = navigationLevel ? navigationLevel + "_" : "";

      //var $button_name = $(this).data().linkName;
      var $button_name = $(this).text();

      if (!!$(this).find(".banner-head").length) {
        $button_name = $(this).find(".banner-head").text();
      } else if (!!$(this).find(".title").length) {
        $button_name = $(this).find(".title").text();
      } else if ($(this).data().linkArea == "gnb-lg_brand_logo") {
        $button_name = $(this).data("link-name");
      } else if ($(this).data().linkArea == "gnb_brand_identity") {
        $button_name = $(this).find("img").attr("alt");
      }
      var tagName = "Bottom Navigation";
      if (!!$(this).closest("header").length) {
        tagName = "Top Navigation";
      }
      if ($navigation_level == "") {
        if (
          $(this).parent(".footer-title").length ||
          $(this).parent(".depth-1").length
        ) {
          $navigation_level =
            baidu_navigation_level["footer-super_category"] + "_";
        } else if (
          $(this).parent(".footer-sub-title").length ||
          $(this).parent(".depth-title").length
        ) {
          $navigation_level = baidu_navigation_level["footer-category"] + "_";
        }
      }

      console.log(
        "[Baidu trackEvent] [GNB,FOOTER] , tagName : " + tagName,
        ", $lg_cggroup : " + $lg_cggroup,
        ", $navigation_level : " + $navigation_level,
        ", $button_name : " + $button_name,
        ", pageName : " + lgCggroupName,
        ", linkArea : " + $(this).data().linkArea
      );

      _hmt.push([
        "_trackEvent",
        $lg_cggroup,
        "Click " + $navigation_level + $button_name,
        tagName,
      ]);
    }
  );

  if (lgCggroupName == "home") {
    $(".GPC0059")
      .find("a")
      .on("click", function () {
        var $clickContent = $(this).find(".head").text().trim();
        console.log(
          "[Baidu trackEvent] [Homepage_View More]",
          ", $lg_cggroup : " +
            $lg_cggroup +
            ", $clickContent : " +
            $clickContent
        );
        _hmt.push([
          "_trackEvent",
          $lg_cggroup,
          "Click " + $clickContent,
          "Homepage_View More",
        ]);
      });
    $(".GPC0045")
      .find("a")
      .on("click", function () {
        var $clickContent = $(this).find(".title").text().trim();
        console.log(
          "[Baidu trackEvent] [Homepage_Service & Support]",
          ", $lg_cggroup : " +
            $lg_cggroup +
            ", $clickContent : " +
            $clickContent
        );
        _hmt.push([
          "_trackEvent",
          $lg_cggroup,
          "Click " + $clickContent,
          "Homepage_Service & Support",
        ]);
      });
  }

  if (
    lgCggroupName == "pdp" ||
    lgCggroupName == "super-category" ||
    lgCggroupName == "category" ||
    lgCggroupName == "sub-category"
  ) {
    $(".GPC0007").on("click", ".rating.inhouse-review a", function (e) {
      var star_level = $(this).find(".star-area").data("model-overallscore");
      baiduTrackEvent("rating", $(this).closest("li"), "PLP", {
        list_name: $lg_cggroup,
        star_level: star_level,
      });
    });
  }
}

function baiduTrackEvent(tagName, target, area, option) {
  if (!!target.length && typeof _hmt != "undefined") {
    var options = {};
    var product_name = "",
      product_sku = "",
      product_category = "";
    if (area == "PDP") {
      product_name = target.find(".model-title:eq(0)").text();
      product_sku = target.find(".model-name:eq(0)").text();
      product_category = target.find(".sibling-area:eq(0) a.active").text();
    } else if (area == "PLP") {
      product_name = !!target.find(".model-name").length
        ? target.find(".model-name")[0].innerText
        : "";
      product_sku = !!target.find(".sku").length
        ? target.find(".sku")[0].innerText
        : "";
      product_category = target.find(".model-group a.active").text();
    }

    options = {
      product_name: product_name,
      product_category: product_category,
      product_sku: product_sku,
    };

    if (!!option) {
      $.extend(options, option);
    }
    console.log("[Baidu trackEvent] ", tagName, options);
    _hmt.push(["_trackCustomEvent", tagName, options]);
  }
}
/* LGERU-225 End */

//LGEEG-154
$("body").on("click", "a.buyNowUnionBtn", function (e) {
  var url = $(this).attr("data-url");
  var text = $(this).attr("data-modal-text");
  var title = $(this).attr("title");
  var html =
    '<div class="modal modal-simple fade" id="buyNowUnionPopUp" tabindex="-1" role="dialog" data-backdrop="false" aria-label="BuyNow Union Popup" aria-describedby="buyNowUnionPopUpDialog"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-body"><div class="simple-content-box"><div class="content-paragraph" id="buyNowUnionPopUpDialog">' +
    text +
    '</div></div></div><div class="modal-footer"><button type="button" data-url="' +
    url +
    '" id="buyNowUnionPopUpBtn" class="btn btn-primary buyNowUnionModalBtn" title="' +
    title +
    '" data-dismiss="modal">GO</button></div></div></div></div>';

  $("body").append(html);
  $("#buyNowUnionPopUp").modal();
});

/** LGEAU-729 Start */
$("body").on("click", "a.plp-wish-sign", function (e) {
  var html =
    '<div class="modal fade" id="plp-wish-sign" tabindex="-1" role="dialog" data-backdrop="true"><div class="modal-dialog modal-md modal-plp wishSign" role="document"><div class="modal-content"><button type="button" class="modal-close" data-dismiss="modal" data-adobe-tracking-wish="Y" data-page-event="plp_wish_signin_close">Close</button><div class="modal-body"><h2>Sign In to Create Your Wishlist</h2><p>Add items to your wishlist so you can easily find them when you return to LG.com. It\'s an easy way to keep track of that special something You\'ve had your eye on or save gift ideas for friends and family.</p></div><div class="modal-footer"><button type="button" class="btn btn-outline-secondary" id="noThanks" data-dismiss="modal" data-adobe-tracking-wish="Y" data-page-event="plp_wish_no_signin">No thanks, not now</button><button type="button" class="btn btn-primary" id="signIn" data-adobe-tracking-wish="Y" data-page-event="plp_wish_signin">CONTINUE TO SIGN IN</button></div></div></div></div>';
  if ($("#plp-wish-sign").length == 0) {
    $("body").append(html);
  }
  $("#plp-wish-sign").modal();
});

$("body").on("touch click", "a.plp-wish-sign", function (e) {
  e.preventDefault();
  $("body").removeClass("m-menu-open"); // LGEGMC-2101
  $mobileMenu.removeClass("open").find(".menu-wrap").removeClass("active");
  scrollToTop($(this));
});

$(document).on("click", "#signIn", function () {
  var current_location = window.location.href;
  var countrycode = document
    .getElementsByTagName("html")[0]
    .getAttribute("data-countrycode");
  if (current_location.indexOf("sso") > -1) {
    window.location.reload();
  } else {
    location.href =
      "/" + countrycode + "/my-lg/login?state=" + current_location;
  }
});
/** LGEAU-729 End */

//LGEEG-283
$("body").on("click", ".buyNowUnionModalBtn", function (e) {
  var url = $(this).attr("data-url");
  window.open(url);
  $("#buyNowUnionPopUp").remove();
  $("body").removeClass("modal-open");
  if ($(window).width() < 768) {
    $("body").css("cssText", "");
  }
});
//LGEGMC-2851 START
function getDomainUrl(obj) {
  let objVal = obj,
    patt =
      /(http(s)?:\/\/)(([a-zA-Z][-a-zA-Z0-9]*)([.][a-zA-Z][-a-zA-Z0-9]*){0,3}||([0-9]{1,3}([.][0-9]{1,3}){3}))/gi,
    pattResult = /[^(http(s)?:\/\/)]\S+(\.[^(\n|\t|\s|\/))]+)+/gi,
    sResult = objVal.replace(patt, "");

  sResult = objVal.replace(sResult, "");
  sResult = sResult.match(pattResult);
  sResult = sResult[0].substring(
    sResult[0].indexOf(".") + 1,
    sResult[0].length
  );

  return sResult;
}
//LGEGMC-2851 END
//OBSLGECZ-291 START
function getMktDomainUrl(obj) {
  let objVal = obj,
    patt =
      /(http(s)?:\/\/)(([a-zA-Z][-a-zA-Z0-9]*)([.][a-zA-Z][-a-zA-Z0-9]*){0,3}||([0-9]{1,3}([.][0-9]{1,3}){3}))/gi,
    pattResult = /[^(http(s)?:\/\/)]\S+(\.[^(\n|\t|\s|\/))]+)+/gi,
    sResult = objVal.replace(patt, "");

  sResult = objVal.replace(sResult, "");
  sResult = sResult.match(pattResult);
  sResult = sResult[0].substring(
    sResult[0].indexOf(".") + 1,
    sResult[0].length
  );

  if (sResult !== "") {
    let arr = sResult.split(".");
    rResult = arr[0];
  }
  return rResult;
}
//OBSLGECZ-291 END

/* LGEBR-977,LGEBR-1244 */
if (ISMAIN || ISB2BMAIN) {
  $(".btn-whatsapp").click(function (e) {
    var $this = $(this);
    var btnLink = $this.data("float-btn-link");
    var _target = $this.data("target");
    if (_target == "_blank") {
      window.open(btnLink, "_blank");
    } else {
      btnLink &&
        openWin(btnLink, "", $this.data("width"), $this.data("height"));
    }
  });
}
/* LGEBR-977,LGEBR-1244 */

// LGERU-262
var newsletterNotUseFlag = "N";
newsletterNotUseFlag = $('input[name="newsLetterUseFlag"]').val();
if (
  newsletterNotUseFlag != "undefined" &&
  newsletterNotUseFlag == "Y" &&
  $(".GPC0128").length > 0
) {
  $(".GPC0128").remove();
}

// PJTQUICKWIN START 박지영
// - 화면 상단에 Sticky 되는 컴포넌트가 존재하는 경우,
// - 각 컴포넌트 별로 겹치지 않도록 처리 하기 위한 스크립트 (PDP 제외)
// - 스크롤시 position이 fixed 가 되는 시점에서 계산합니다.
// 1순위, Cookie Layer
// 2순위, 아래 element에 순서대로 넣어 주세요.
// 3순위, Filter 입니다. (여러 컴포넌트에서 사용 - 7, 26, 120, 132, 142, 134, 139 )
const controlStickyElements = {
  els: [
    // sticky 가능한 전체 엘리먼트 목록 (쌓아야 하는 순서대로 넣어 주세요)
    ".eprivacy-cookie.cookie-eu",
    ".GPC0151 .sticky-wrap",
    ".GPC0117 .floating-wrap",
    ".filter-open-floating",
  ],
  pos: {
    // 각 컴포넌트에서 위치 fixed 되는 위치  조절시 사용하는 값
    // 또는 클릭시 특정 위치로 스크롤 되어야 하는 경우에도 활용 가능
    // 여기에 초기값을 0 으로 설정해 주시고, 해당 컴포넌트 JS에서
    // controlStickyElements.pos.XXX 값을 가감하여 사용 가능
    // 신규 컴포넌트 추가 시, 퍼블팀은 아래 페이지에 추가하여 테스트 가능
    // /html/customer/plp-sticky-test.html
    // 아래 값은 updatePos 에서 업데이트 됩니다
    GPC0151: 0,
    GPC0117: 0,
    FILTER: 0, // 필터는 통합으로 사용
  },
  $els: [], // 현재 페이지에서 사용되는 엘리먼트 목록
  hasCookie: null, // cookie layer가 사용되는지 여부
  //hasFilter: null, // filter가 사용되는지 여부
  init: function () {
    // PDP는 고려하지 않음
    if ($(".GPC0009").length > 0) return false;
    const self = this;

    // cookie laery, filter 사용여부 확인
    self.hasCookie = $(".eprivacy-cookie.cookie-eu").length > 0;
    //self.hasFilter = $('.filter-open-floating').length > 0;

    // 현재 페이지에서 사용되는 self.$els 구하기
    self.findElement();

    // cookie layer 사용시 sticky 할때 함께 sticky 될 흰색 배경 추가 (for desktop)
    // cookie layer 단독 사용시에는 불필요
    if (self.hasCookie && self.$els.length > 1) {
      const html =
        '<div class="sticky-cookie-bg" style="position: fixed; top: 0; left: 0; width: 100%; background: #fff; height: 29px; z-index: 9999;display:none;"></div>'; // z-index는 gnb보다 하나 적게
      $(".eprivacy-cookie.cookie-eu").parent().append(html);
    }

    // 이벤트 바인딩 (Sticky 되는 엘리먼트가 1개 초과인 경우에만 위치 계산이 필요함)
    self.$els.length > 1 && self.addEvent();

    // 로딩시 해당 컴포넌트들 floating 후 1회 실행
    // 페이지 중간에서 load하는 경우 대비
    setTimeout(function () {
      self.calculateTop();
    }, 100);
  },
  findElement: function () {
    const self = this;
    for (var i = 0; i < self.els.length; i++) {
      if ($(self.els[i]).length > 0) {
        self.$els.push($(self.els[i]));
      }
    }
    // console.log(self.$els);
  },
  addEvent: function () {
    const self = this;
    $(window)
      .off("scroll.stickyElements")
      .on("scroll.stickyElements", function () {
        return self.calculateTop();
      });
  },
  calculateTop: function () {
    const self = this;
    let sumTop = 0;
    for (var j = 0; j < self.$els.length; j++) {
      const $this = self.$els[j];
      let elHeight = $this.outerHeight();

      // cookie layer 예외처리
      if (self.hasCookie && $this.hasClass("cookie-eu")) {
        // desktop 화면에서 Cookie layer 닫혔을 경우 (작게 따라 다니는 경우), 예외처리
        if (elHeight === 1) {
          // 작게 따라 다니는 handle이 보이지 않는 경우, 따라 다니지 않는 것으로 간주함.
          if ($this.find(".default").is(":visible") && $this.is(":visible")) {
            elHeight = $this.find(".default").outerHeight();
          } else {
            elHeight = 0;
          }
        } else {
          if (!$this.is(":visible")) {
            elHeight = 0;
          }
        }
        //  흰색 영역 높이를 cookie layer 의 height 로 수정
        $(".sticky-cookie-bg").css("height", elHeight);
      }

      // console.log($this.css('position'), elHeight);
      if ($this.css("position") === "fixed" && elHeight > 0) {
        $this.css("top", sumTop);
        self.updatePos($this, sumTop);
        // console.log($this.closest('.component').attr('class'), sumTop);
        sumTop = sumTop + elHeight;

        // cookie 외 다른 엘리먼트가 sticky 되면 그때부터 bg 흰색 보여줌
        if (self.hasCookie && j > 0) $(".sticky-cookie-bg").show();
      } else {
        //_explictArgee 일경우 cookie banner 안보이게 수정
        if ($this.hasClass("cookie-banner") && geoIpType == "_explictArgee") {
        } else {
          $this.removeAttr("style");
        }
        // if(self.hasCookie && j == 0) $('.sticky-cookie-bg').hide();
      }
    }
    if (
      self.hasCookie &&
      sumTop > 0 &&
      sumTop === $(".cookie-eu .default").outerHeight()
    ) {
      // cookie 하나만 남았을때는 흰색 배경 불필요함
      $(".sticky-cookie-bg").hide();
    }
  },
  updatePos: function ($obj, pos) {
    const self = this;
    if ($obj.closest(".component").hasClass("GPC0151")) self.pos.GPC0151 = pos;
    else if ($obj.closest(".component").hasClass("GPC0117"))
      self.pos.GPC0117 = pos;
    else if ($obj.hasClass("filter-open-floating")) self.pos.FILTER = pos;
    // console.log(self.pos);
  },
};
controlStickyElements.init();
// PJTQUICKWIN END 박지영

// LGECH-121 Start
// (+ie 호환)
const getUrlParam = function (name) {
  var curr_url = location.search.substr(location.search.indexOf("?") + 1);
  var svalue = "";
  curr_url = curr_url.split("&");
  for (var i = 0; i < curr_url.length; i++) {
    temp = curr_url[i].split("=");
    if ([temp[0]] == name) {
      svalue = temp[1];
    }
  }
  return svalue;
};
// LGECH-121 End

/* LGEVN-678 Start */
const cjUseCountries = ["vn", "tw", "cl"];
if (cjUseCountries.indexOf(COUNTRY_CODE) >= 0) {
  const $cookie_name = "cje";

  if (
    !!document.getElementsByClassName("support-wrap").length ||
    !!document.getElementsByClassName("signin-wrap").length
  ) {
    if (!!getCookie($cookie_name)) {
      removeCookie($cookie_name, true, true);
    }
  } else {
    const $cjevent = getUrlParam("cjevent");
    if (!!$cjevent) {
      setCookie($cookie_name, $cjevent, true, 395, true, true);
    }
  }
}
/* // LGEVN-678 End */

/* LGCOMSPEED-6 Start */
const jsList = {
  countdown: 'src="/lg5-common-gp/library/jquery.countdown.min.js"',
  "video-asset": "src=/lg5-common-gp/js/components/video-asset.min.js",
};
function lazyloadScript(attr) {
  if (!!attr) {
    var d = document,
      s = d.createElement("script"),
      b = d.body || d.getElementsByTagName("body")[0];
    attr
      .replace(/ +/gi, " ")
      .split(" ")
      .forEach(function (item) {
        if (item.indexOf("=") > -1) {
          var test = item.split("=");
          s.setAttribute(test[0], test[1].replace(/\"/gi, ""));
        } else {
          s.setAttribute(item, "");
        }
      });
    b.appendChild(s);
  }
}

let videoJsLoad = false; //LGCOMSPEED-6(4th)
window.addEventListener(
  "load",
  function (event) {
    if (!!$(".countdown-box").length) {
      lazyloadScript(jsList["countdown"]);
    }
    $("[data-lazyload-js]").each(function () {
      /* LGCOMSPEED-6(4th) Start */
      if ($(this).data("video") && videoJsLoad) {
        //not load
      } else {
        lazyloadScript($(this).data("lazyload-attr"));
      }
      /* LGCOMSPEED-6(4th) End */
    });

    /* LGCOMSPEED-6(6th) Start */
    $("[data-component-lazyload-js]").each(function () {
      if (!$(this).hasClass("loaded")) {
        $(this).addClass("loaded");
        lazyloadScript($(this).data("lazyload-attr"));
      }
    });
    /* LGCOMSPEED-6(6th) End */

    /* LGCOMSPEED-6 Start */
    if (typeof lazyloadGTMFirst === "function") {
      lazyloadGTMFirst();
    }
    /*// LGCOMSPEED-6 End */
  },
  true
);
/*// LGCOMSPEED-6 End */

/* LGCOMSPEED-6(4th) Start */
$(".component")
  .find(".see-video")
  .on("click.videoasset", function (e) {
    if (typeof video == "undefined") {
      lazyloadScript(jsList["video-asset"]);
      $(".component").find(".see-video").off("click.videoasset");

      videoJsLoad = true;
      const _this = $(this);
      let timerVideo = null;

      function lazyloadJsVideo() {
        if (typeof video === "undefined") {
          timerVideo = setTimeout(lazyloadJsVideo, 100);
        } else {
          if (timerVideo !== null) clearTimeout(timerVideo);
          _this.trigger("click");
        }
      }
      lazyloadJsVideo();
    } else {
      $(".component").find(".see-video").off("click.videoasset");
    }
  });
/* LGCOMSPEED-6(4th) End */

// LGEGMC-3469 Start
const deviceTypeComm = function () {
  // LGEITF-900
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "Tablet";
  } else if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return "Mobile";
  }
  return "PC";
};

const autoNvl = function (a, b) {
  const isNull = function (v) {
    const temp = v + "";
    return temp === "" || temp === null || temp === "null" ? true : false;
  };

  const isUndefined = function (v) {
    return typeof v === undefined ||
      typeof v === "undefined" ||
      v === "undefined" ||
      v === undefined
      ? true
      : false;
  };

  b = isNull(b) || isUndefined(b) ? "" : b;

  return isNull(a) || isUndefined(a) ? b : a;
};

const checkActive = function ($element) {
  return $element !== undefined && $element.length ? true : false;
};

// LGEGMC-5141 Start
const salesForceCountry = ["au", "sg", "tw", "vn"];
let salesForceUseFlag = salesForceCountry.indexOf(COUNTRY_CODE) > -1;

const salesForceCountryV2 = ["eg_ar", "eg_en", "sa", "sa_en", "in"];
// salesForceUseFlagV2 = 대상국가 체크
// salesForceRunV2 = 로그인 페이지 or 로그인한 사용자 여부 체크( in getAccessToken() )
let salesForceUseFlagV2 = salesForceCountryV2.indexOf(COUNTRY_CODE) > -1;
let salesForceRunV2 = salesForceUseFlagV2 && ISSSO;

let salesForceCDN = "";
// LGCOMMON-715 start
if (salesForceUseFlag)
  salesForceCDN =
    "https://cdn.c360a.salesforce.com/beacon/c360a/20de8543-bbdc-4ede-8d14-6ef32a4aabb6/scripts/c360a.min.js";
else if (salesForceUseFlagV2) {
  if (COUNTRY_CODE == "in") {
    salesForceCDN =
      "https://cdn.c360a.salesforce.com/beacon/c360a/6479db0e-aa27-45dd-a2ba-e8404552ac1c/scripts/c360a.min.js ";
  } else {
    salesForceCDN =
      "https://cdn.c360a.salesforce.com/beacon/c360a/8831b5a5-64ef-4048-aad7-2ba526afd298/scripts/c360a.min.js";
  }
}
// LGCOMMON-715 end

if (salesForceUseFlag || salesForceUseFlagV2) {
  $(function () {
    // (= window.onload)
    $("head").append(
      '<script type="application/javascript" src="' +
        salesForceCDN +
        '"></script><script type="application/javascript"> window.addEventListener("load", (event) => { SalesforceInteractions.init({ cookieDomain: "' +
        location.host +
        '", consents: [{ provider: "Web Provider", purpose: "Tracking", status: SalesforceInteractions.ConsentStatus.OptIn }] }); SalesforceInteractions.setLoggingLevel(5); }); </script>'
    ); // LGEGMC-5141
    console.log("c360a SDK loaded");
  });
}

const salesForce = {
  data: {
    id: null,
    category: null,
    subcategory: null,
    price: null,
    currency: nvl($(".currency-code").val()),
  },
  dataKey: {
    category: "ecrmProductCategory",
    subCategory: "ecrmProductSubcategory",
  },
  eventName: {
    isMain: "ecrmMainPageEntered",
    plp: "ecrmPlpEntered",
    pdp: "ecrmPdpEntered",
    wishList: "ecrmWishlistClicked",
    addToCart: "ecrmAddToCartClicked",
    wtb: "ecrmWhereToBuyClicked",
    addToCompare: "ecrmAddToCompClicked",
    supportHome: "ecrmCsSupportEntered",
    registerProduct: "ecrmCsRegisterProductEntered",
    supportRequestRepair: "ecrmCsRequestRepairEntered",
    supportRepairCenterClick: "",
    supportManual: "ecrmCsManualEntered",
    supportManualClick: "ecrmCsManualClicked",
    stockCheck: "ecrmStockAvailability", //LGCOMMON-2165(IN)
  },
  init: function () {
    console.log("salesForce init Start");
    console.log("salesForceUseFlag", salesForceUseFlag);
    console.log("salesForceRunV2", salesForceRunV2);

    const _this = salesForce;

    const PLP = checkActive($(".GPC0007"));
    const PDP = checkActive($(".GPC0009"));
    const SUPPORT_HOME = checkActive($(".support-search-area.home"));

    const REGISTER_PRODUCT =
      checkActive($(".my-product-register")) ||
      checkActive($(".product-register-ocr"));
    const REQUEST_REPAIR_CLASS = ".step-in-form.request-repair";
    const SUPPORT_REQUEST_REPAIR =
      checkActive($(REQUEST_REPAIR_CLASS)) &&
      $(REQUEST_REPAIR_CLASS).data("pageType") !== undefined &&
      $(REQUEST_REPAIR_CLASS).data("pageType") !== "install";
    const REPAIR_CENTER_CLASS = '.find-service-center[data-country="sa"]';
    const SUPPORT_REPAIR_CENTER = checkActive($(REPAIR_CENTER_CLASS));

    // SUPPORT_MANUAL :
    // Manual Download page (ex. /au/support/manuals) or Product Support page (ex. /au/support/product/lg-NP8340)
    const MANUAL_CLASS = ".search-model-result";
    const PRODUCT_SUPPORT_CLASS = ".support-product-area";
    const SUPPORT_MANUAL =
      (checkActive($(MANUAL_CLASS)) &&
        $(MANUAL_CLASS).data("menu") === "ManualsDocuments") ||
      checkActive($(PRODUCT_SUPPORT_CLASS));

    if (salesForceUseFlagV2) {
      _this.eventName.isMain = "MainPageEntered";
      _this.eventName.plp = "PlpEntered";
      _this.eventName.pdp = "PdpEntered";
      _this.eventName.wishList = "WishlistClicked";
      _this.eventName.addToCart = "AddToCartClicked";
      _this.eventName.wtb = "WhereToBuyClicked";
      _this.eventName.addToCompare = "AddToCompClicked";
      _this.eventName.supportHome = "CsSupportEntered";
      _this.eventName.registerProduct = "CsRegProductEntered";
      _this.eventName.supportRequestRepair = "CsRepairEntered";
      _this.eventName.supportRepairCenterClick = "CsRepairClicked"; // sa, sa_en
      _this.eventName.supportManual = "CsManualEntered";
      _this.eventName.supportManualClick = "CsManualClicked";
      _this.eventName.stockCheck = "ecrmStockAvailability"; //LGCOMMON-2165(IN)

      _this.dataKey.category = "ecrmProductCat";
      _this.dataKey.subCategory = "ecrmProductSubCat";
    }

    if (ISMAIN) _this.defaultPageSendEvent(_this.eventName.isMain);
    else if (PLP) _this.ecrmPlpEntered();
    else if (PDP) _this.ecrmPdpEntered();
    else if (SUPPORT_HOME)
      _this.defaultPageSendEvent(_this.eventName.supportHome);
    else if (REGISTER_PRODUCT)
      _this.defaultPageSendEvent(_this.eventName.registerProduct);
    else if (SUPPORT_REQUEST_REPAIR)
      _this.defaultPageSendEvent(_this.eventName.supportRequestRepair);
    else if (SUPPORT_MANUAL)
      _this.defaultPageSendEvent(_this.eventName.supportManual);
    else if (SUPPORT_REPAIR_CENTER) {
      // only salesForceUseFlag V2 - sa, sa_en
      _this.defaultPageSendEvent(_this.eventName.supportRequestRepair);

      // click find center button
      $(document).on(
        "click",
        ".search-area #serviceCenterSubmit",
        REPAIR_CENTER_CLASS,
        function () {
          _this.defaultPageSendEvent(_this.eventName.supportRepairCenterClick);
        }
      );
    }
  },
  defaultPageSendEvent: function (eventName) {
    const _this = salesForce;

    const sendData = {
      interaction: {
        name: eventName,
        eventType: eventName,
        ecrmUserId: USER_ID,
        ecrmLocaleCode: COUNTRY_CODE,
      },
    };

    if (eventName.indexOf("PlpEntered") > -1) {
      sendData.interaction[_this.dataKey.category] = autoNvl(
        standardData.level2
      );
      sendData.interaction[_this.dataKey.subCategory] = autoNvl(
        standardData.level3
      );
    } else if (eventName === "ecrmCsSupportEntered") {
      // only salesForceUseFlag V1
      sendData.interaction["ecrmPageType"] = "csSupportHome";
      sendData.interaction["ecrmPageCategory"] = null;
    } else if (eventName.indexOf("CsManualEntered") > -1)
      $(document).on(
        "click",
        ".support-downloads .manuals .name a, .file-list .name a",
        _this.ecrmCsManualClicked
      );

    console.log(eventName + " insert");
    SalesforceInteractions.sendEvent(sendData);
  },
  ecrmPlpEntered: function () {
    const _this = salesForce;

    _this.defaultPageSendEvent(_this.eventName.plp);
    _this.productPageAddEvent("plp");
  },
  ecrmPdpEntered: function () {
    const _this = salesForce;

    _this.productPageSendEvent($(".ico-fav"), "pdp", _this.eventName.pdp);
    _this.productPageAddEvent("pdp");
  },
  productPageAddEvent: function (pageType) {
    const _this = salesForce;

    $(".ico-fav").click(function () {
      if (USER_ID !== "guest")
        _this.productPageSendEvent($(this), pageType, _this.eventName.wishList);
    });

    if (pageType === "pdp" && COUNTRY_CODE !== "sg") {
      $(".add-to-cart:not(.in-buynow)").click(function () {
        _this.productPageSendEvent(
          $(this),
          pageType,
          _this.eventName.addToCart
        );
      });
    }

    const wtbClass =
      pageType === "pdp" ? ".linker.where-to-buy" : ".where-to-buy";
    $(wtbClass).click(function () {
      _this.productPageSendEvent($(this), pageType, _this.eventName.wtb);
    });

    $(".js-compare").click(function () {
      _this.productPageSendEvent(
        $(this),
        pageType,
        _this.eventName.addToCompare
      );
    });
  },
  dataEntries: function ($this, pageType) {
    const _this = salesForce;

    _this.data.id = autoNvl($this.data("modelId"));
    _this.data.category = autoNvl($this.data("categoryName"));
    _this.data.subcategory = autoNvl($this.data("subCategoryName"));

    const PRICE_CLASS = ".purchase-price .price .number";
    let $price;
    if (pageType === "plp") {
      $price = $this.closest(".js-model").find(PRICE_CLASS);
    } else if (pageType === "pdp") {
      $price = $(PRICE_CLASS + ":first");
    }
    _this.data.price = checkActive($price) ? $price.text() : "";
  },
  productPageSendEvent: function ($this, pageType, eventName) {
    const _this = salesForce;
    if (eventName != "ecrmStockAvailability") {
      _this.dataEntries($this, pageType);
    }
    const sendData = {
      interaction: {
        name: eventName,
        eventType: eventName,
        ecrmUserId: USER_ID,
        ecrmLocaleCode: COUNTRY_CODE,
        ecrmCurrency: _this.data.currency,
        ecrmPrice: _this.data.price,
        ecrmProductId: _this.data.id,
      },
    };

    sendData.interaction[_this.dataKey.category] = _this.data.category;
    sendData.interaction[_this.dataKey.subCategory] = _this.data.subcategory;

    // only salesForceUseFlag V1
    if (eventName === "ecrmPdpEntered") {
      sendData.interaction["ecrmPageType"] = "pdp";
      sendData.interaction["ecrmPageCategory"] = null;
    } else if (eventName.indexOf("AddToCartClicked") > -1)
      sendData.interaction["ecrmCartId"] = autoNvl(getCookie("LG5_CartID"));
    else if (eventName.indexOf("ecrmStockAvailability") > -1) {
      //LGCOMMON-2165 Start
      var cartThis = $(".add-to-cart:not(.in-buynow)");
      _this.data.id = "IN." + autoNvl(cartThis.data("modelSalesmodelcode"));
      _this.data.category = autoNvl(cartThis.data("categoryName"));
      _this.data.subcategory = autoNvl(cartThis.data("subCategoryName"));
      var ecrmAvailability = autoNvl($this.deliveryLeadTime) != "" ? "Y" : "N";
      sendData.interaction["ecrmProductId"] = _this.data.id;
      sendData.interaction[_this.dataKey.category] = _this.data.category;
      sendData.interaction[_this.dataKey.subCategory] = _this.data.subcategory;
      sendData.interaction["ecrmAvailability"] = ecrmAvailability;
      sendData.interaction["ecrmCheckComment"] =
        ecrmAvailability == "N" ? autoNvl($this.message) : $("#pinOK").val();
      sendData.interaction["ecrmEnteredPin"] = autoNvl($this.pinCode);
      //LGCOMMON-2165 End
    }
    console.log(eventName + " insert");
    SalesforceInteractions.sendEvent(sendData);
  },
  ecrmCsManualClicked: function () {
    const _this = salesForce;

    const manualProductId = checkActive($(".select-product-model"))
      ? $('input[name="modelCsSalesCode"]').val()
      : $(".support-wrap").data("productId");

    console.log(_this.eventName.supportManualClick + " insert");
    SalesforceInteractions.sendEvent({
      interaction: {
        name: _this.eventName.supportManualClick,
        eventType: _this.eventName.supportManualClick,
        ecrmUserId: USER_ID,
        ecrmLocaleCode: COUNTRY_CODE,
        ecrmProductId: autoNvl(manualProductId),
      },
    });
  },
};
// LGEGMC-3469, LGEGMC-5141 End

// LGCOMSPEED-6 Start
function lazyloadVideo(target) {
  for (var source in target.children) {
    var videoSource = target.children[source];
    if (
      typeof videoSource.tagName === "string" &&
      videoSource.tagName === "SOURCE"
    ) {
      if (videoSource.dataset.src) {
        videoSource.src = videoSource.dataset.src;
      }
    }
  }
}

window.addEventListener("load", function () {
  var lazyVideoEls = [].slice.call(document.querySelectorAll("video.lazy"));

  if ("IntersectionObserver" in window) {
    var lazyloadVideoObserver = new IntersectionObserver(function (
      entries,
      observer
    ) {
      entries.forEach(function (video) {
        if (video.isIntersecting) {
          lazyloadVideo(video.target);

          video.target.load();
          video.target.oncanplay = function () {
            video.target.play();
          };

          lazyloadVideoObserver.unobserve(video.target);
        }
      });
    });

    lazyVideoEls.forEach(function (videoEl) {
      lazyloadVideoObserver.observe(videoEl);
    });
  } else {
    lazyVideoEls.forEach(function (videoEl) {
      lazyloadVideo(videoEl);

      videoEl.load();
      videoEl.oncanplay = function () {
        videoEl.play();
      };
    });
  }
});
// LGCOMSPEED-6 End

//PJTCHATBOT-4 Start
var chatbotInfo = [];
if ($(".gnb-newChatbotInfo").length > 0) {
  var newChatbotUi = {
    showMessage: false,
    timeCheck: false,
    scrollCheck: false,
    lastViewChatIds: "",
    tagetIndex: "",
    load: function () {
      newChatbotUi.tagetIndex = "";
      newChatbotUi.showMessage = false;
      if (!chatbotInfo.length > 0) {
        newChatbotUi.init();
      }

      newChatbotUi.getTargetPageData();

      if ("" != getCookie("lastViewChatIds")) {
        var idArr = JSON.parse(getCookie("lastViewChatIds"));
        if (idArr.includes(newChatbotUi.lastViewChatIds)) {
          newChatbotUi.showMessage = false;
          return;
        }
      }

      if (newChatbotUi.showMessage) {
        var showFlag = newChatbotUi.chatFlagCheck();
        var checkTime =
          chatbotInfo[newChatbotUi.tagetIndex]["exposureElapsedTime"];
        var checkScroll = chatbotInfo[newChatbotUi.tagetIndex]["scrollPercent"];

        if (checkTime) newChatbotUi.exposureElapsedTimeCheck(checkTime);
        else newChatbotUi.timeCheck = true;

        if (checkScroll) newChatbotUi.isScrollPercentCheck(checkScroll);
        else newChatbotUi.scrollCheck = true;
      }
    },
    init: function () {
      $(".gnb-newChatbotInfo li").each(function (index, item) {
        var cData = {};
        cData["proactiveMessageId"] = $(item).data("proactiveMessageId");
        cData["proactiveMessage"] = $(item).data("proactiveMessage");
        cData["svcType"] = $(item).data("svcType");
        cData["scenario"] = $(item).data("scenario");
        cData["cate2"] = $(item).data("cate2");
        cData["cate3"] = $(item).data("cate3");
        cData["model"] = $(item).data("chatModel");
        cData["recommType"] = $(item).data("recommType");
        cData["targetType"] = $(item).data("targetType");
        cData["targetValue"] = $(item).data("targetValue");
        cData["linearType"] = $(item).data("linearType");
        cData["nonLinearType"] = $(item).data("nonLinearType");
        cData["promotionCheckFlag"] = $(item).data("promotionCheck");
        cData["compareCheckFlag"] = $(item).data("compareCheck");
        cData["visitorCheckFlag"] = $(item).data("visitorCheck");
        cData["exposureElapsedTime"] = $(item).data("exposureElapsedTime");
        cData["scrollPercent"] = $(item).data("scrollPercent");
        cData["surveyPopupCheck"] = $(item).data("surveyPopupCheck");
        cData["liveChatTimeCheck"] = $(item).data("liveChatTimeCheck");
        cData["linearityValue"] = $(item).data("linearityValue");
        cData["linearityRule"] = $(item).data("linearityRule");
        chatbotInfo.push(cData);
      });
    },
    getTargetPageData: function () {
      var chatViewCookie =
        "" != getCookie("CHATBOT_VIEW")
          ? JSON.parse(getCookie("CHATBOT_VIEW"))
          : null;
      var setCookieFlag = false;
      var setPageFlag = false;
      var item;
      for (var x = 0; x < chatbotInfo.length; x++) {
        item = chatbotInfo[x];
        if (
          (item["targetType"] == "url" &&
            window.location.pathname.startsWith(item["targetValue"])) ||
          (item["targetType"] == "element" &&
            checkActive($("." + item["targetValue"])))
        ) {
          setCookieFlag = true;
        }

        if (setCookieFlag) {
          if (chatViewCookie == null) {
            (chatViewCookie = []).length = 10;
            chatViewCookie.fill("0");
          }
          chatViewCookie.unshift(item["linearityValue"]);
          chatViewCookie.pop();
          setCookie("CHATBOT_VIEW", JSON.stringify(chatViewCookie), true);
          break;
        }
      }

      for (var i = 0; i < chatbotInfo.length; i++) {
        item = chatbotInfo[i];
        if (
          (item["targetType"] == "url" &&
            window.location.pathname.startsWith(item["targetValue"])) ||
          (item["targetType"] == "element" &&
            checkActive($("." + item["targetValue"])))
        ) {
          if (newChatbotUi.linearCheck(item)) {
            if (
              (item["promotionCheckFlag"] == "Y" &&
                item["promotionCheckFlag"] == $("#chatPromotionFlag").val()) ||
              item["promotionCheckFlag"] == "N"
            ) {
              setPageFlag = true;
            }

            if (
              item["linearityValue"] == "HM" &&
              !window.location.pathname.endsWith(item["targetValue"])
            ) {
              setPageFlag = false;
            }
          }
        }

        if (setPageFlag) {
          newChatbotUi.showMessage = setPageFlag;
          newChatbotUi.tagetIndex = i;
          newChatbotUi.lastViewChatIds = item["proactiveMessageId"];
          break;
        }
      }
    },
    linearCheck: function (targetData) {
      var checkLinearReturn = true;
      if (
        targetData["linearType"] &&
        targetData["linearType"] == "Y" &&
        targetData["linearityRule"]
      ) {
        var linearArr =
          "" != getCookie("CHATBOT_VIEW")
            ? JSON.parse(getCookie("CHATBOT_VIEW"))
            : null;
        var checkChatLinear = targetData["linearityRule"];
        if (linearArr != null) {
          var checkSum = 0;
          if (
            targetData["linearityValue"] == "PDP" ||
            targetData["linearityValue"] == "PLP"
          ) {
            linearArr = linearArr.slice(0, 3);
          }

          for (var i = 0; i < linearArr.length; i++) {
            if (checkChatLinear == linearArr[i]) checkSum++;
            else checkSum = 0;

            if (checkSum == 3) break;
          }

          if (checkSum < 3) checkLinearReturn = false;
        }
        return checkLinearReturn;
      }
      if (
        targetData["nonLinearType"] &&
        targetData["nonLinearType"] == "Y" &&
        targetData["linearityRule"]
      ) {
        var productCheck = false;
        var csCheck = false;
        var chatLineString =
          "" != getCookie("CHATBOT_VIEW")
            ? JSON.parse(getCookie("CHATBOT_VIEW")).slice(0, 3).toString()
            : "";
        var checkNonLinear = targetData["linearityRule"].split(",");
        var checkArr = [];
        var countMax = 0;

        if (
          targetData["linearityValue"] == "PDP" ||
          targetData["linearityValue"] == "PLP"
        )
          productCheck = true;
        else if (targetData["linearityValue"] == "CS") csCheck = true;

        if (checkNonLinear != null) {
          checkNonLinear.forEach(function (item, index) {
            var regE = RegExp(item, "g");
            if ((chatLineString.match(regE) || []).length > 0) {
              checkArr.push((chatLineString.match(regE) || []).length);
            }
          });
        }

        if (checkArr.length > 0) {
          for (var i = 0; i < checkArr.length; i++) {
            countMax += parseInt(checkArr[i]);
          }
          if (countMax < 3) checkLinearReturn = false;

          if (productCheck && checkArr.length != checkNonLinear.length)
            checkLinearReturn = false;
          else if (
            csCheck &&
            !(chatLineString.split(",")[0] == targetData["linearityValue"])
          )
            checkLinearReturn = false;
        } else {
          checkLinearReturn = false;
        }

        return checkLinearReturn;
      }

      return checkLinearReturn;
    },
    chatFlagCheck: function () {
      var targetData = chatbotInfo[newChatbotUi.tagetIndex];
      if (
        targetData["visitorCheckFlag"] &&
        targetData["visitorCheckFlag"] == "Y"
      ) {
        if (_dl.isLogin == "Y") {
          return false;
        }
      }
      if (
        targetData["surveyPopupCheck"] &&
        targetData["surveyPopupCheck"] == "Y"
      ) {
        if (
          $(".feedback-floating-banner").length &&
          !$(".feedback-floating-banner").hasClass("waiting")
        ) {
          return false;
        }
      }
      if (
        targetData["liveChatTimeCheck"] &&
        targetData["liveChatTimeCheck"] == "Y"
      ) {
        if ($(".gnb-newChatbotInfo").data("chatStatus") != "online") {
          return false;
        }
      }
      if (
        targetData["compareCheckFlag"] &&
        targetData["compareCheckFlag"] == "Y"
      ) {
        if (
          $(".GPC0022").hasClass("active showing") &&
          !$(".GPC0022").hasClass("compare-min")
        ) {
          return false;
        }
      }

      return true;
    },
    exposureElapsedTimeCheck: function (time) {
      var timeInterval = setInterval(function () {
        if (newChatbotUi.chatFlagCheck()) {
          newChatbotUi.timeCheck = true;
          newChatbotUi.openMessageCheck(
            newChatbotUi.timeCheck,
            newChatbotUi.scrollCheck
          );
        }
        clearInterval(timeInterval);
      }, parseInt(time) * 1000);
    },
    isScrollPercentCheck: function (scroll) {
      var per = parseInt(scroll);
      window.addEventListener("scroll", function () {
        if (
          ($(window).scrollTop() /
            ($(document).height() - $(window).height())) *
            100 >
          per
        ) {
          if (newChatbotUi.chatFlagCheck()) {
            newChatbotUi.scrollCheck = true;
            newChatbotUi.openMessageCheck(
              newChatbotUi.timeCheck,
              newChatbotUi.scrollCheck
            );
          }
        } else {
          newChatbotUi.scrollCheck = false;
        }
      });
    },
    openMessageCheck: function (check1, check2) {
      var openChat = chatbotInfo[newChatbotUi.tagetIndex];
      var chatMsgArea = $(".chat-msg");
      if (check1 && check2 && !chatMsgArea.length > 0) {
        newChatbotUi.messageHtml(
          openChat["proactiveMessage"],
          openChat["svcType"],
          openChat["scenario"],
          openChat["proactiveMessageId"],
          openChat["cate2"],
          openChat["cate3"],
          openChat["model"],
          openChat["recommType"]
        );
        return;
      }
    },
    messageHtml: function (
      message,
      type,
      scenario,
      id,
      cate2,
      cate3,
      model,
      recommType
    ) {
      var chatMsghtml =
        "<div class='chat-msg'><div id='chat-msg1' class='chat-msg-area' role='alert' aria-live='assertive' data-svc-type='" +
        type +
        "'";
      if (scenario) chatMsghtml += " data-scenario='" + scenario + "'";
      if (recommType) chatMsghtml += " data-recomm-type='" + recommType + "'";
      if (cate2 && cate2 == "Y" && checkActive($(".GPC0007"))) {
        chatMsghtml +=
          " data-cate2='" + $(".GPC0007").find("#chatCate2").val() + "'";
      }
      if (cate3 && cate3 == "Y" && checkActive($(".GPC0007"))) {
        chatMsghtml +=
          " data-cate3='" + $(".GPC0007").find("#chatCate3").val() + "'";
      }
      if (model && model == "Y" && checkActive($(".GPC0009"))) {
        chatMsghtml +=
          " data-model='" + $(".GPC0009").data("adobeModelname") + "'";
      }
      chatMsghtml +=
        "><button class='msg-close'>close</button><div class='chat-msg-box'><a href='javascript:;'>" +
        message +
        "</a></div></div></div>";

      $(".epromotor-chat-area").before(chatMsghtml);

      $(".msg-close").on("click", function (e) {
        $(".chat-msg, .chat-msg-area").removeClass("ready active");
      });

      $(".chat-msg-box a").on("click", function () {
        $(".epromotor-widget").trigger("click");
      });

      $(".epromotor-widget-area").on("classChanged", function () {
        var has_11 = $(this).hasClass("cp11");
        var has_22 = $(this).hasClass("cp22");
        var chatbot_msg = $(".chat-msg");
        if (chatbot_msg.length > 0) {
          chatbot_msg.addClass("ready");
          if (has_11 == true) {
            chatbot_msg.addClass("cp11");
          } else {
            chatbot_msg.removeClass("cp11");
          }
          if (has_22 == true) {
            chatbot_msg.addClass("cp22");
          } else {
            chatbot_msg.removeClass("cp22");
          }
        }
      });

      $("#chat-msg1").addClass("active");
      $(".epromotor-widget-area").trigger("classChanged");

      var chatIdarr =
        "" != getCookie("lastViewChatIds")
          ? JSON.parse(getCookie("lastViewChatIds"))
          : null;
      if (chatIdarr != null) {
        if (!chatIdarr.includes(id)) {
          chatIdarr.push(id);
        }
      } else {
        chatIdarr = [];
        chatIdarr.push(id);
      }
      setCookie("lastViewChatIds", JSON.stringify(chatIdarr), true);

      setTimeout(function () {
        $(".chat-msg .msg-close").trigger("click");
      }, 4500);
    },
  };

  var checkLoad = function () {
    if (typeof ePrivacyCookies != "undefined") {
      if (ePrivacyCookies.get("LGCOM_IMPROVEMENTS")) {
        newChatbotUi.load();
      }
    } else {
      setTimeout(function () {
        checkLoad();
      }, 300);
    }
  };
  checkLoad();
}
//PJTCHATBOT-4 END

//PJTJOINMEMBER-1 add
const dateScopeLocaleOptions = {
  defaultLang: {
    monthNames: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  },
  de: {
    monthNames: [
      "Januar",
      "Februar",
      "März",
      "April",
      "Mai",
      "Juni",
      "Juli",
      "August",
      "September",
      "Oktober",
      "November",
      "Dezember",
    ],
  },
  it: {
    monthNames: [
      "Gennaio",
      "Febbraio",
      "Marzo",
      "Aprile",
      "Maggio",
      "Giugno",
      "Luglio",
      "Agosto",
      "Settembre",
      "Ottobre",
      "Novembre",
      "Dicembre",
    ],
  },
  fr: {
    monthNames: [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ],
  },
  es: {
    monthNames: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
  },
  vn: {
    monthNames: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
  },
  br: {
    monthNames: [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ],
  },
  mx: {
    monthNames: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
  },
  cl: {
    monthNames: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
  },
  th: {
    monthNames: [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ],
  },
  pt: {
    monthNames: [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ],
  },
  kz: {
    monthNames: [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ],
  },
  co: {
    monthNames: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
  },
  cn: {
    monthNames: [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月",
    ],
  },
  ca_fr: {
    monthNames: [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ],
  },
  sa: {
    monthNames: [
      "يناير",
      "فبراير",
      "مارس",
      "أبريل",
      "مايو",
      "يونيو",
      "يوليو",
      "أغسطس",
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر",
    ],
  },
  hk: {
    monthNames: [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月",
    ],
  },
  id: {
    monthNames: [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ],
  },
  tr: {
    monthNames: [
      "Ocak",
      "Şubat",
      "Mart",
      "Nisan",
      "Mayıs",
      "Haziran",
      "Temmuz",
      "Ağustos",
      "Eylül",
      "Ekim",
      "Kasım",
      "Aralık",
    ],
  },
  jp: {
    monthNames: [
      "1 月",
      "2 月",
      "3 月",
      "4 月",
      "5 月",
      "6 月",
      "7 月",
      "8 月",
      "9 月",
      "10 月",
      "11 月",
      "12 月",
    ],
  },
};

const dateScope = {
  maxDayInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  lastDay: 31,
  birthDateRegex: "^((19|20)\\d\\d)?(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$",
  birthdateNumber: /^[0-9]{1,4}$/,
  dateValidation: function (param) {
    if (isNaN(param) || param.length != 8) {
      return false;
    }
    let year = Number(param.substring(0, 4));
    let month = Number(param.substring(4, 6));
    let day = Number(param.substring(6, 8));
    let dd = day / 0;
    if (year < 1903) {
      return false;
    }
    if (month < 1 || month > 12) {
      return false;
    }
    var maxDay = dateScope.maxDayInMonth[month - 1];
    if (month == 2 && ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)) {
      maxDay = 29;
    }
    if (day <= 0 || day > maxDay) {
      return false;
    }
    return true;
  },
  limitAgeCheck: function (pYear, pMonth, pDay, pAge) {
    let year = pYear;
    let month = pMonth;
    let day = pDay;
    let age = parseInt(pAge);
    var mydate = new Date();
    mydate.setFullYear(year, month - 1, day);

    var currdate = new Date();
    currdate.setFullYear(currdate.getFullYear() - age);

    if (currdate - mydate < 0) {
      return false;
    }

    return true;
  },
};

if (
  $("#txtBoxBirthM").length > 0 &&
  $("input[name=birthCheckFlag]").length > 0
) {
  const localLangCountry = [
    "br",
    "cl",
    "de",
    "es",
    "fr",
    "it",
    "mx",
    "vn",
    "pt",
    "th",
    "ca_fr",
    "cn",
    "co",
    "hk",
    "id",
    "jp",
    "kz",
    "sa",
    "tr",
  ];

  $("#txtBoxBirthM option").each(function (index, item) {
    if ($(item).val() != "00") {
      if (localLangCountry.indexOf(COUNTRY_CODE) >= 0) {
        $(item).text(
          dateScopeLocaleOptions[COUNTRY_CODE].monthNames[
            parseInt($(item).val()) - 1
          ]
        );
      } else {
        $(item).text(
          dateScopeLocaleOptions["defaultLang"].monthNames[
            parseInt($(item).val()) - 1
          ]
        );
      }
    }
  });
  $("#txtBoxBirthM").trigger("chosen:updated");

  $("#txtBoxBirthY").on("propertychange change keyup paste input", function () {
    $("#txtBoxBirthY").val($("#txtBoxBirthY").val().slice(0, 4));
  });

  $("#txtBoxBirthD").on("propertychange change keyup paste input", function () {
    $("#txtBoxBirthD").val($("#txtBoxBirthD").val().slice(0, 2));
  });
}
//PJTJOINMEMBER-1 add

//LGEGMC-4064(TreasureDataTableInsert 호출로직 공통기능으로 적용)
function treasureDataInsertTable(treasureParam) {
  var tdInsertUrl =
    "/" + COUNTRY_CODE.toLowerCase() + "/my-lg/api/insertTreasureData.lgajax";
  var domainUrl = $("a[data-link-area='gnb_brand_identity']").attr("href");

  if (window.location.href.indexOf("/oauth/") >= 0) {
    var actionURL = domainUrl;
    if (actionURL.indexOf("wdev50.lg.com") >= 0) {
      tdInsertUrl = "https://wdev50.lg.com" + tdInsertUrl;
    } else if (actionURL.indexOf("wwwstg.lg.com") >= 0) {
      tdInsertUrl = "https://wwwstg.lg.com" + tdInsertUrl;
    } else if (actionURL.indexOf("www.lg.com") >= 0) {
      tdInsertUrl = "https://www.lg.com" + tdInsertUrl;
    } else {
      tdInsertUrl = "https://" + window.location.host + tdInsertUrl;
    }
  }

  console.log("#### return success treasureParam : " + treasureParam);

  $.ajax({
    type: "post",
    url: tdInsertUrl,
    data: treasureParam,
    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    xhrFields: {
      withCredentials: true,
    },
    success: function (data) {
      console.log("#### return success data : " + data);
      console.log("insert treasure data SUCCESS");
    },
    error: function (e) {
      console.log("#### return error e : " + e);
      console.log("insert treasure data error");
    },
  });
}

//page count
window.addEventListener("load", function () {
  //LGCOMSPEED-6(7th)
  // usage
  // <div class="js-page-count" data-count-url="/data-ajax/mkt/pageCount.json" data-param="modelId=testmodelId"></div>
  var $el = $(".js-page-count");
  if ($el.length > 0) {
    $el.each(function () {
      var url = $(this).data("count-url");
      var param = $(this).data("param");
      if (url && param) {
        ajax.call(url, param, "json", function (data) {
          // do nothing
        });
      }
    });
  }
});

// LGERU-349 Start
$(document).on("click", ".error-common .go-footer", function () {
  $("html, body").animate(
    {
      scrollTop: $(".footer-box").offset().top,
    },
    500
  );
});
// LGERU-349 End
