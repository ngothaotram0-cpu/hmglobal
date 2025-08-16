$(document).ready(function () {
  if (!document.querySelector(".animation-box")) return false;

  var ani = {
    el: document.querySelectorAll(".animation-box"),
    init: function () {
      ani.addEvent();
    },
    videoEvent: function (e) {
      var video = e.currentTarget,
        $ctrl = $(video).siblings(".controller-wrap");
      if (e.type == "ended" || e.type == "pause") {
        $ctrl.find(".play").addClass("active").siblings().removeClass("active");
      } else if (e.type == "play" || e.type == "playing") {
        $ctrl
          .find(".pause")
          .addClass("active")
          .siblings()
          .removeClass("active");
      }
    },
    addEvent: function () {
      var anibox = ani.el;
      $(anibox).each(function () {
        var target = $(this).get(0);
        if ($(this).closest(".carousel-wrap").length > 0) {
          target = $(this).closest(".carousel-wrap");
        }
        /*
				if(document.querySelectorAll('.carousel-wrap')[0]) {
					target = document.querySelectorAll('.carousel-wrap');
				}*/
        // 20200311 START 이상현 - FR-WA 요청 : animation stop/play 키보드 제어 시 focus 유지
        $(target).on(
          {
            click: function (e) {
              e.preventDefault();
              var button = e.currentTarget;
              var box = $(button)
                .closest(".animation-box")
                .find("video:visible")[0];
              if (button.name == "pause") {
                box.pause();
              } else if (button.name == "play") {
                box.play();
              }
              setTimeout(function () {
                $(button.parentElement).find("button:visible").focus();
              });
            },
          },
          ".controller-wrap button"
        );
        // 20200311 END
        $(target).find("video").on({
          "play playing pause ended": ani.videoEvent,
        });
        if (target != ani.el) {
          $(target).on({
            init: function () {
              $(target).find("video").on({
                "play playing pause ended": ani.videoEvent,
              });
            },
          });
        }
      });
    },
  };
  ani.init();
});
var compareCookie = {
  name:
    $(".navigation") && $(".navigation").hasClass("b2b")
      ? "LG5_B2B_CompareCart"
      : "LG5_CompareCart",
  cookie: null,
  add: function (productId) {
    this.cookie = getCookie(this.name);
    if (this.cookie) {
      this.cookie =
        this.cookie.indexOf("|") >= 0 ? this.cookie.split("|") : [this.cookie];

      if (this.cookie.indexOf(productId) < 0) {
        this.cookie.unshift(productId);
      }
      this.cookie = this.cookie.join("|");
    } else {
      this.cookie = productId;
    }

    if (
      typeof ePrivacyCookies == "undefined" ||
      ePrivacyCookies.get("LGCOM_IMPROVEMENTS") ||
      COUNTRY_CODE.toLowerCase() == "de" ||
      COUNTRY_CODE.toLowerCase() == "it"
    ) {
      //LGEDE-926,LGEIS-1124
      setCookie(this.name, this.cookie, true);
    }
  },
  remove: function (productId) {
    if (productId) {
      this.cookie = getCookie(this.name);
      if (this.cookie) {
        var idx;
        this.cookie =
          this.cookie.indexOf("|") >= 0
            ? this.cookie.split("|")
            : [this.cookie];
        idx = this.cookie.indexOf(productId);
        if (idx >= 0) {
          this.cookie.splice(idx, 1);
        }
        this.cookie = this.cookie.join("|");
      }
    } else {
      this.cookie = "";
    }
    if (this.cookie == "" || !this.cookie) {
      removeCookie(this.name, true);
    } else {
      if (
        typeof ePrivacyCookies == "undefined" ||
        ePrivacyCookies.get("LGCOM_IMPROVEMENTS") ||
        COUNTRY_CODE.toLowerCase() == "de" ||
        COUNTRY_CODE.toLowerCase() == "it"
      ) {
        //LGEDE-926,LGEIS-1124
        setCookie(this.name, this.cookie, true);
      }
    }
  },
};

// 20200316 START 박지영  : 불필요한 코드 제거
/*
var countrybox = (function () {
	// 열기 기능 : Mouse over / Focus
	var open = function ( $container ){
		$(document).on('mouseenter focus', $container, function(e) {
			$(this).siblings('.flag-box')
			.show()
			.attr('aria-hidden', false)
			.attr('aria-describedby', 'countryTitle')
			.attr('id','countryTitle');
		});
	};
	// 닫기 기능 : Click
	var close = function ( $container ){
		$(document).on('click', $container + ' > .close-box', function(e) {
			$(this).parent()
			.hide()
			.attr('aria-hidden', true)
			.attr('aria-describedby', '')
			.attr('id','');
		});
		$(document).on('focusout mouseleave', $container, function(e) {
			$(this).find('.close-box').trigger('click');
		});
	};

	return { open : open, close : close};
}());
*/
// 20200316 END

$(document).ready(function () {
  // 20200316 START 박지영 : 불필요한 코드 제거
  //tinyLayer.initModule('.swatch, .flag-icon .flag-item');
  tinyLayer.initModule(".swatch");

  //countrybox.open('.flag.overcount > a');
  //countrybox.close('.flag-box');
  // 20200316 END

  // PJTQUICKWIN 20220225 START add
  var productType = $(".cardlist-box").length > 0 ? "card" : "default";
  // PJTQUICKWIN 20220225 END add

  if (!document.querySelector(".js-model-switcher")) return false;
  var modelSwicher = {
    el: document.querySelectorAll(".js-model-switcher"),
    currentEl: null,
    formId: "sendSiblingModelForm",
    subModelId: "subModelId",
    itemSelector: ".js-model",
    $items: null,
    ajaxUrl: null,
    paramName: null,
    bizType: "B2C",
    init: function () {
      if ($(".navigation").length > 0) {
        if ($(".navigation").hasClass("b2b")) this.bizType = "B2B";
      }
      //console.log(this.bizType);
      for (var i = 0; i < modelSwicher.el.length; i++) {
        modelSwicher.currentEl = modelSwicher.el[i];
        modelSwicher.$items = $(modelSwicher.currentEl).find(
          modelSwicher.itemSelector
        );
        modelSwicher.ajaxUrl =
          modelSwicher.currentEl.getAttribute("data-model-url");
        modelSwicher.paramName =
          modelSwicher.currentEl.getAttribute("data-name");
        modelSwicher.addEvent();
      }
    },
    addEvent: function () {
      $(modelSwicher.currentEl).on(
        {
          click: function (e) {
            e.preventDefault();
            var modelNumber =
                e.currentTarget.getAttribute("href").indexOf("#") > -1
                  ? e.currentTarget.getAttribute("data-href")
                  : e.currentTarget.getAttribute("href"),
              categoryId = e.currentTarget.getAttribute("data-category"),
              groupIndex = $(e.currentTarget).index(),
              methodType = $(modelSwicher.currentEl).data("ajaxMethod"),
              param = {},
              ajaxUrl = $(e.currentTarget)
                .closest(".js-model-switcher")
                .attr("data-model-url");

            param[modelSwicher.paramName] = modelNumber;
            param["bizType"] = modelSwicher.bizType;
            //data-categoryid

            // for search result
            if ($(".search-contents-area").length > 0) {
              if (
                $(e.currentTarget).closest(".business-product-list").length > 0
              ) {
                param["bizType"] = "B2B";
              } else {
                param["bizType"] = "B2C";
              }
            }

            if ($(e.currentTarget).closest(".GPC0007").length > 0) {
              param["categoryId"] = $(e.currentTarget)
                .closest(".GPC0007")
                .find("form input[name=categoryId]")
                .val();
            }
            if (!!categoryId) {
              param["categoryId"] = categoryId;
            }
            param["v"] = $("#v").val(); // PJTPLP-10 GILS 캐쉬 정보 입력

            /* LGETR-228 Start */
            if (!!$(e.currentTarget).closest(".GPC0004").length) {
              param["componentId"] = $(e.currentTarget)
                .closest(".GPC0004")
                .data("component-id");
            }
            /* LGETR-228 End */
            ajax.call(
              ajaxUrl,
              param,
              "json",
              function (data) {
                if (data && data != "") {
                  var $item = $(e.currentTarget).closest(
                    modelSwicher.itemSelector
                  );
                  if (data.status == "success") {
                    var d = data.data[0];
                    //PJTPLP-10 SETTING $basicInfo
                    //PJTGADL-2
                    var priceValue = "";
                    if (
                      d.rPromoPrice != null &&
                      d.rPromoPrice != "" &&
                      d.rPromoPrice != "null"
                    ) {
                      priceValue =
                        d.rPromoPrice + "." + nvl(d.rPromoPriceCent, "00");
                    } else {
                      priceValue =
                        nvl(d.rPrice, "") + "." + nvl(d.rPriceCent, "00");
                    }
                    var $basicInfo = $item.closest("[data-wish-basic-info]");
                    $basicInfo.data("adobe-salesmodelcode", d.salesModelCode);
                    $basicInfo.data("adobe-salessuffixcode", d.salesSuffixCode);
                    $basicInfo.data("adobe-modelname", d.modelName);
                    //PJTPLP-10 SETTING $basicInfo
                    // change tag
                    $item.find(".tag-content").empty();
                    // 2020.10.12. PJTPLPT 수정으로 인한 주석
                    // if(d.productTag1 != null && d.productTag1 != '') $item.find('.tag-content').append('<span>'+d.productTag1+'</span>');
                    // if(d.productTag2 != null && d.productTag2 != '') $item.find('.tag-content').append('<span>'+d.productTag2+'</span>');
                    if (
                      $(e.currentTarget).closest(".GPC0007,.GPC0026,.GPC0003")
                        .length > 0
                    ) {
                      // LGEIS-800
                      if (
                        $(e.currentTarget).closest(".GPC0007,.GPC0003").length >
                        0
                      ) {
                        // LGEIS-800
                        if (d.obsComTagShowFlag == "Y") {
                          // LGEDE-865 : OBS,.COM 태그 동시 노출 추가
                          if (d.productTag1Type == "OBS") {
                            // OBS
                            if (d.productTag1 != null && d.productTag1 != "")
                              $item
                                .find(".tag-content")
                                .append(
                                  '<p class="tag-imp d-none" data-user-type="' +
                                    d.productTag1UserType +
                                    '"><span>' +
                                    d.productTag1 +
                                    "</span></p>"
                                );
                          } else if (d.productTag1Type == "COM") {
                            // .COM
                            if (d.productTag1 != null && d.productTag1 != "")
                              $item
                                .find(".tag-content")
                                .append(
                                  '<p class="d-none" data-user-type="' +
                                    d.productTag1UserType +
                                    '"><span>' +
                                    d.productTag1 +
                                    "</span></p>"
                                );
                          }
                          if (d.productTag2Type == "OBS") {
                            if (d.productTag2 != null && d.productTag2 != "")
                              $item
                                .find(".tag-content")
                                .append(
                                  '<p class="tag-imp d-none" data-user-type="' +
                                    d.productTag2UserType +
                                    '"><span>' +
                                    d.productTag2 +
                                    "</span></p>"
                                );
                          } else if (d.productTag2Type == "COM") {
                            if (d.productTag2 != null && d.productTag2 != "")
                              $item
                                .find(".tag-content")
                                .append(
                                  '<p class="d-none" data-user-type="' +
                                    d.productTag2UserType +
                                    '"><span>' +
                                    d.productTag2 +
                                    "</span></p>"
                                );
                          }
                        } else {
                          // 기존 로직
                          if (
                            d.obsPreOrderFlag == "Y" ||
                            d.obsPreOrderRSAFlag == "Y"
                          ) {
                            if (d.productTag1 != null && d.productTag1 != "")
                              $item
                                .find(".tag-content")
                                .append(
                                  '<p class="tag-imp d-none" data-user-type="' +
                                    d.productTag1UserType +
                                    '"><span>' +
                                    d.productTag1 +
                                    "</span></p>"
                                );
                          } else {
                            if (d.productTag1 != null && d.productTag1 != "")
                              $item
                                .find(".tag-content")
                                .append(
                                  '<p class="d-none" data-user-type="' +
                                    d.productTag1UserType +
                                    '"><span>' +
                                    d.productTag1 +
                                    "</span></p>"
                                );
                          }
                          if (d.productTag2 != null && d.productTag2 != "")
                            $item
                              .find(".tag-content")
                              .append(
                                '<p class="d-none" data-user-type="' +
                                  d.productTag2UserType +
                                  '"><span>' +
                                  d.productTag2 +
                                  "</span></p>"
                              );
                        }
                      } else {
                        if (d.productTag1 != null && d.productTag1 != "")
                          $item
                            .find(".tag-content")
                            .append(
                              "<p><span>" + d.productTag1 + "</span></p>"
                            );
                        if (d.productTag2 != null && d.productTag2 != "")
                          $item
                            .find(".tag-content")
                            .append(
                              "<p><span>" + d.productTag2 + "</span></p>"
                            );
                      }
                      // LGEVN-819 Start
                      switch ($item.find(".tag-content p").length) {
                        case 1:
                          if (
                            d.productTag1 != null &&
                            d.productTag1ColorFlag == "Y"
                          ) {
                            $($item.find(".tag-content p")[0]).addClass(
                              "tag-gold"
                            );
                          }
                          if (
                            d.productTag2 != null &&
                            d.productTag2ColorFlag == "Y"
                          ) {
                            $($item.find(".tag-content p")[0]).addClass(
                              "tag-gold"
                            );
                          }
                          break;

                        case 2:
                          if (
                            d.productTag1 != null &&
                            d.productTag1ColorFlag == "Y"
                          ) {
                            $($item.find(".tag-content p")[0]).addClass(
                              "tag-gold"
                            );
                          }
                          if (
                            d.productTag2 != null &&
                            d.productTag2ColorFlag == "Y"
                          ) {
                            $($item.find(".tag-content p")[1]).addClass(
                              "tag-gold"
                            );
                          }
                          break;

                        default:
                          break;
                      }
                      // LGEVN-819 End
                    } else {
                      // LGEIS-800 Start
                      if (
                        $(e.currentTarget).closest(".GPC0009,.GPC0004").length >
                        0
                      ) {
                        if (d.obsComTagShowFlag == "Y") {
                          // LGEDE-865 : OBS,.COM 태그 동시 노출 추가
                          if (d.productTag1Type == "OBS") {
                            // OBS
                            if (d.productTag1 != null && d.productTag1 != "")
                              $item
                                .find(".tag-content")
                                .append(
                                  '<span class="flag-imp d-none" data-user-type="' +
                                    d.productTag1UserType +
                                    '">' +
                                    d.productTag1 +
                                    "</span>"
                                );
                          } else if (d.productTag1Type == "COM") {
                            // .COM
                            if (d.productTag1 != null && d.productTag1 != "")
                              $item
                                .find(".tag-content")
                                .append(
                                  '<span class="d-none" data-user-type="' +
                                    d.productTag1UserType +
                                    '">' +
                                    d.productTag1 +
                                    "</span>"
                                );
                          }
                          if (d.productTag2Type == "OBS") {
                            if (d.productTag2 != null && d.productTag2 != "")
                              $item
                                .find(".tag-content")
                                .append(
                                  '<span class="flag-imp d-none" data-user-type="' +
                                    d.productTag2UserType +
                                    '">' +
                                    d.productTag2 +
                                    "</span>"
                                );
                          } else if (d.productTag2Type == "COM") {
                            if (d.productTag2 != null && d.productTag2 != "")
                              $item
                                .find(".tag-content")
                                .append(
                                  '<span class="d-none" data-user-type="' +
                                    d.productTag2UserType +
                                    '">' +
                                    d.productTag2 +
                                    "</span>"
                                );
                          }
                        } else {
                          // 기존 로직
                          if (
                            d.obsPreOrderFlag == "Y" ||
                            d.obsPreOrderRSAFlag == "Y"
                          ) {
                            if (d.productTag1 != null && d.productTag1 != "")
                              $item
                                .find(".tag-content")
                                .append(
                                  '<span class="flag-imp d-none" data-user-type="' +
                                    d.productTag1UserType +
                                    '">' +
                                    d.productTag1 +
                                    "</span>"
                                );
                          } else {
                            if (d.productTag1 != null && d.productTag1 != "")
                              $item
                                .find(".tag-content")
                                .append(
                                  '<span class="d-none" data-user-type="' +
                                    d.productTag1UserType +
                                    '">' +
                                    d.productTag1 +
                                    "</span>"
                                );
                          }
                          if (d.productTag2 != null && d.productTag2 != "")
                            $item
                              .find(".tag-content")
                              .append(
                                '<span class="d-none" data-user-type="' +
                                  d.productTag2UserType +
                                  '">' +
                                  d.productTag2 +
                                  "</span>"
                              );
                        }
                        // LGEIS-800 End
                      } else {
                        //LGEDE-907 Start
                        if (
                          d.obsComTagShowFlag == "Y" &&
                          $(e.currentTarget).closest(
                            ".search-result-products-wrap"
                          ).length > 0
                        ) {
                          // LGEDE-865 : OBS,.COM 태그 동시 노출 추가
                          if (d.productTag1Type == "OBS") {
                            // OBS
                            if (d.productTag1 != null && d.productTag1 != "")
                              $item
                                .find(".tag-content")
                                .append(
                                  '<span class="flag-imp">' +
                                    d.productTag1 +
                                    "</span>"
                                );
                          } else if (d.productTag1Type == "COM") {
                            // .COM
                            if (d.productTag1 != null && d.productTag1 != "")
                              $item
                                .find(".tag-content")
                                .append("<span>" + d.productTag1 + "</span>");
                          }
                          if (d.productTag2Type == "OBS") {
                            if (d.productTag2 != null && d.productTag2 != "")
                              $item
                                .find(".tag-content")
                                .append(
                                  '<span class="flag-imp">' +
                                    d.productTag2 +
                                    "</span>"
                                );
                          } else if (d.productTag2Type == "COM") {
                            if (d.productTag2 != null && d.productTag2 != "")
                              $item
                                .find(".tag-content")
                                .append("<span>" + d.productTag2 + "</span>");
                          }
                        } else {
                          //기존 로직
                          if (d.productTag1 != null && d.productTag1 != "")
                            $item
                              .find(".tag-content")
                              .append("<span>" + d.productTag1 + "</span>");
                          if (d.productTag2 != null && d.productTag2 != "")
                            $item
                              .find(".tag-content")
                              .append("<span>" + d.productTag2 + "</span>");
                        }
                        //LGEDE-907 End
                        // LGEVN-819 Start
                        switch ($item.find(".tag-content span").length) {
                          case 1:
                            if (
                              d.productTag1 != null &&
                              d.productTag1ColorFlag == "Y"
                            ) {
                              $($item.find(".tag-content span")[0]).addClass(
                                "flag-gold"
                              );
                            }
                            if (
                              d.productTag2 != null &&
                              d.productTag2ColorFlag == "Y"
                            ) {
                              $($item.find(".tag-content span")[0]).addClass(
                                "flag-gold"
                              );
                            }
                            break;

                          case 2:
                            if (
                              d.productTag1 != null &&
                              d.productTag1ColorFlag == "Y"
                            ) {
                              $($item.find(".tag-content span")[0]).addClass(
                                "flag-gold"
                              );
                            }
                            if (
                              d.productTag2 != null &&
                              d.productTag2ColorFlag == "Y"
                            ) {
                              $($item.find(".tag-content span")[1]).addClass(
                                "flag-gold"
                              );
                            }
                            break;

                          default:
                            break;
                        }
                        // LGEVN-819 End
                      }
                      // LGEVN-819 Start
                      if ($(e.currentTarget).closest(".GPC0004").length > 0) {
                        switch ($item.find(".tag-content span").length) {
                          case 1:
                            if (
                              d.productTag1 != null &&
                              d.productTag1ColorFlag == "Y"
                            ) {
                              $($item.find(".tag-content span")[0]).addClass(
                                "flag-gold"
                              );
                            }
                            if (
                              d.productTag2 != null &&
                              d.productTag2ColorFlag == "Y"
                            ) {
                              $($item.find(".tag-content span")[0]).addClass(
                                "flag-gold"
                              );
                            }
                            break;

                          case 2:
                            if (
                              d.productTag1 != null &&
                              d.productTag1ColorFlag == "Y"
                            ) {
                              $($item.find(".tag-content span")[0]).addClass(
                                "flag-gold"
                              );
                            }
                            if (
                              d.productTag2 != null &&
                              d.productTag2ColorFlag == "Y"
                            ) {
                              $($item.find(".tag-content span")[1]).addClass(
                                "flag-gold"
                              );
                            }
                            break;

                          default:
                            break;
                        }
                      }
                      if ($(e.currentTarget).closest(".GPC0009").length > 0) {
                        switch ($item.find(".flag span").length) {
                          case 1:
                            if (
                              d.productTag1 != null &&
                              d.productTag1ColorFlag == "Y"
                            ) {
                              $($item.find(".flag span")[0]).addClass(
                                "flag-gold"
                              );
                            }
                            if (
                              d.productTag2 != null &&
                              d.productTag2ColorFlag == "Y"
                            ) {
                              $($item.find(".flag span")[0]).addClass(
                                "flag-gold"
                              );
                            }
                            break;

                          case 2:
                            if (
                              d.productTag1 != null &&
                              d.productTag1ColorFlag == "Y"
                            ) {
                              $($item.find(".flag span")[0]).addClass(
                                "flag-gold"
                              );
                            }
                            if (
                              d.productTag2 != null &&
                              d.productTag2ColorFlag == "Y"
                            ) {
                              $($item.find(".flag span")[1]).addClass(
                                "flag-gold"
                              );
                            }
                            break;

                          default:
                            break;
                        }
                      }

                      // LGEVN-819 End
                    }
                    // change image and link
                    // PJTSEARCH-1 modify
                    if (
                      $item.find("a.visual").is("[data-keyword-search-url]")
                    ) {
                      $item.find("a.visual").attr("href", "#");
                      $item
                        .find("a.visual")
                        .attr("data-keyword-search-url", d.modelUrlPath);
                    } else {
                      $item.find("a.visual").attr("href", d.modelUrlPath);
                    }
                    if (d.imageAltText != null && d.imageAltText != "") {
                      $item.find("a.visual img").attr("alt", d.imageAltText);
                    } else {
                      $item.find("a.visual img").attr("alt", "");
                    }
                    // PJTSEARCH-1 modify
                    bindImgError();

                    $item
                      .find("a.visual img.pc")
                      .attr("src", d.mediumImageAddr)
                      .attr("data-src", d.mediumImageAddr);
                    $item
                      .find("a.visual img.mobile")
                      .attr("src", d.smallImageAddr)
                      .attr("data-src", d.smallImageAddr);

                    if (productType != "card") {
                      // card type에서는 이미지 롤링 사용하지 않음
                      if (
                        d.modelRollingImgList != null &&
                        d.modelRollingImgList != ""
                      ) {
                        $item
                          .find("a.visual img.pc")
                          .addClass("js-thumbnail-loop")
                          .attr("data-img-list", d.modelRollingImgList);
                      } else {
                        $item
                          .find("a.visual img.pc")
                          .removeClass("js-thumbnail-loop")
                          .removeAttr("data-img-list");
                      }
                      // remove
                      $item.find(".thumbnail-carousel").remove();
                      if (thumbnailLoop)
                        thumbnailLoop.mobileThumbnailCarouselSingle(
                          $item.find("a.visual img[data-img-list]").eq(0),
                          true
                        );
                    }

                    // card type 일 경우, .products-info  가 없으므로, 스크립트에서 제외했습니다.

                    // change sibling link
                    $item
                      .find(".model-group a")
                      .removeClass("active")
                      .eq(groupIndex)
                      .addClass("active");
                    // change model name and link
                    // 20200325 START 박지영 - ufn 따옴표 처리
                    // 20200512 START 박지영 - ufn null 처리
                    // PJTSEARCH-1 modify
                    if (
                      $item
                        .find(".model-name a")
                        .is("[data-keyword-search-url]")
                    ) {
                      $item
                        .find(".model-name a")
                        .attr("href", "#")
                        .html(
                          d.userFriendlyName == null
                            ? ""
                            : d.userFriendlyName.replace(/\"/g, "''")
                        );
                      $item
                        .find(".model-name a")
                        .attr("data-keyword-search-url", d.modelUrlPath);
                    } else {
                      $item
                        .find(".model-name a")
                        .attr("href", d.modelUrlPath)
                        .html(
                          d.userFriendlyName == null
                            ? ""
                            : d.userFriendlyName.replace(/\"/g, "''")
                        );
                    }
                    // PJTSEARCH-1 modify
                    // 20200512 END
                    // 20200325 END
                    // PJTSEARCH-1 modify
                    if (d.modelUrlPath == null) {
                      if (
                        $item
                          .find(".model-name a")
                          .is("[data-keyword-search-url]")
                      ) {
                        $item
                          .find(".model-name a")
                          .removeAttr("data-keyword-search-url");
                      }
                      if (
                        $item.find("a.visual").is("[data-keyword-search-url]")
                      ) {
                        $item
                          .find("a.visual")
                          .removeAttr("data-keyword-search-url");
                      }
                      $item.find("a.visual").removeAttr("href");
                      $item.find(".model-name a").removeAttr("href");
                    }
                    if (d.userFriendlyName == null) {
                      // 20200325 START 박지영
                      $item.find(".model-name a").html("");
                      // 20200325 END
                    }

                    // LGEGMC-4249 Start
                    // change sku
                    const skuModelName =
                      d.modelName == null
                        ? ""
                        : d.modelName.replace(/\"/g, "''");
                    $item.find(".sku").data("modelName", skuModelName);

                    if (
                      $item
                        .find(".sku a:not(.copy-model-name)")
                        .is("[data-keyword-search-url]")
                    ) {
                      $item
                        .find(".sku a:not(.copy-model-name)")
                        .attr("href", "#")
                        .html(
                          d.modelName == null
                            ? ""
                            : d.modelName.replace(/\"/g, "''")
                        );
                      $item
                        .find(".sku a:not(.copy-model-name)")
                        .attr("data-keyword-search-url", d.modelUrlPath);
                    } else {
                      $item
                        .find(".sku a:not(.copy-model-name)")
                        .attr("href", d.modelUrlPath)
                        .html(
                          d.modelName == null
                            ? ""
                            : d.modelName.replace(/\"/g, "''")
                        );
                    }

                    const defaultTitle = "Copy Model Name";
                    const copyModelNameText = $("#copyModelNameText").val();
                    const copyModelNameTitle =
                      copyModelNameText === "component-copyModelName"
                        ? defaultTitle
                        : copyModelNameText;
                    $item
                      .find(".sku .copy-model-name")
                      .attr("title", copyModelNameTitle)
                      .text(copyModelNameTitle);
                    // LGEGMC-4249 End

                    // change rebate
                    $item
                      .find(".ecorebates-div")
                      .attr("data-modelId", d.modelId);
                    // PJTSEARCH-1 modify
                    //LGEGMC-1430 start
                    if ($("#search-keyword").length > 0) {
                      var salesModelSuffixCode = "";
                      var tempSalesModelCode = nvl(d.salesModelCode, "");
                      var tempSalesSuffixCode = nvl(d.salesSuffixCode, "");
                      if (tempSalesSuffixCode != "") {
                        salesModelSuffixCode =
                          tempSalesModelCode + "." + tempSalesSuffixCode;
                      }
                      $item
                        .find("a.visual")
                        .attr("data-model-name", nvl(d.modelName));
                      $item
                        .find("a.visual")
                        .attr(
                          "data-sales-model-code",
                          nvl(salesModelSuffixCode)
                        );

                      $item
                        .find(".model-name a")
                        .attr("data-model-name", nvl(d.modelName));
                      $item
                        .find(".model-name a")
                        .attr(
                          "data-sales-model-code",
                          nvl(salesModelSuffixCode, "")
                        );

                      $item
                        .find(".sku a")
                        .attr("data-model-name", nvl(d.modelName));
                      $item
                        .find(".sku a")
                        .attr(
                          "data-sales-model-code",
                          nvl(salesModelSuffixCode, "")
                        );
                    }
                    //LGEGMC-1430 end
                    //LGEGMC-1406
                    var specMsg = $("#specMsg").val();
                    $item
                      .find(".box-impInfo")
                      .html(
                        d.specMsgFlag == "Y" ? "<p>" + specMsg + "</p>" : ""
                      );

                    //LGEGMC-177
                    $item.find(".file-list").html("");
                    var pdfDownloadFile = $("#pdfDownloadFile").val();
                    var productFicheDownload = $("#productFicheDownload").val();
                    var rsProductFicheDownload = $(
                      "#rsProductFicheDownload"
                    ).val();
                    var rsUseFlag = d.rsUseFlag;
                    if (rsUseFlag == "Y") {
                      productFicheDownload = rsProductFicheDownload;
                    }
                    //LGEGMC-5315
                    var docTypeCodeFlag = d.docTypeCodeFlag;
                    if (
                      docTypeCodeFlag == "N" ||
                      ((docTypeCodeFlag == "N" || docTypeCodeFlag == "O") &&
                        d.washTowerFlag == "Y")
                    ) {
                      var productFicheDownload = $(
                        "#productNewFicheDownload"
                      ).val();
                    } else if (docTypeCodeFlag == "O") {
                      var productFicheDownload = $(
                        "#productOldFicheDownload"
                      ).val();
                    }
                    //LGEGMC-5315
                    //LGEGMC-3921
                    var productFichehtml = "";
                    if (d.washTowerFlag == "Y") {
                      if (
                        d.productFicheFileName != "" &&
                        d.productFicheOriginalName != "" &&
                        d.productFicheFileName != null &&
                        d.productFicheOriginalName != null &&
                        d.productFicheDocId != null &&
                        d.productFicheDocId != "" &&
                        d.secondProductFicheFileName != "" &&
                        d.secondProductFicheOriginalName != "" &&
                        d.secondProductFicheFileName != null &&
                        d.secondProductFicheOriginalName != null &&
                        d.secondProductFicheDocId != null &&
                        d.secondProductFicheDocId != ""
                      ) {
                        productFichehtml +=
                          "<div class='energy-label-wrap'><a href='#' adobe-click='pdp-file-down-click' data-doc='" +
                          d.productFicheDocId +
                          "' data-file='" +
                          d.productFicheFileName +
                          "' data-original='" +
                          d.productFicheOriginalName +
                          "' data-category='' class='link-text text-tooltip' title='" +
                          pdfDownloadFile +
                          "'>" +
                          "<span class='fiche type-product'>" +
                          productFicheDownload +
                          "</span>" +
                          "</a>" +
                          "<div class='tooltip-link'><div class='tolltip-inner'>";
                        productFichehtml +=
                          "<a href='#' adobe-click='pdp-file-down-click' data-doc='" +
                          d.productFicheDocId +
                          "' data-sku= '" +
                          d.modelName +
                          "' data-model-id= '" +
                          d.modelId +
                          "'  data-file='" +
                          d.productFicheFileName +
                          "' data-original='" +
                          d.productFicheOriginalName +
                          "' data-category='' class='link-text link-text-uk' title='" +
                          pdfDownloadFile +
                          "(" +
                          d.productFicheproductLeve1Code +
                          ")" +
                          "'>" +
                          d.productFicheproductLeve1Code +
                          "</a>";
                        productFichehtml +=
                          "<a href='#' adobe-click='pdp-file-down-click' data-doc='" +
                          d.secondProductFicheDocId +
                          "' data-file='" +
                          d.secondProductFicheFileName +
                          "' data-original='" +
                          d.secondProductFicheOriginalName +
                          "'  data-category='' class='link-text link-text-eu' title='" +
                          pdfDownloadFile +
                          "(" +
                          d.secondProductFicheproductLeve1Code +
                          ")" +
                          "'>" +
                          d.secondProductFicheproductLeve1Code +
                          "</a>" +
                          "</div></div></div>";
                      } else {
                        if (
                          d.productFicheFileName != "" &&
                          d.productFicheOriginalName != "" &&
                          d.productFicheFileName != null &&
                          d.productFicheOriginalName != null &&
                          d.productFicheDocId != null &&
                          d.productFicheDocId != ""
                        ) {
                          productFichehtml +=
                            "<a href='#' adobe-click='pdp-file-down-click' data-doc='" +
                            d.productFicheDocId +
                            "' data-file='" +
                            d.productFicheFileName +
                            "' data-original='" +
                            d.productFicheOriginalName +
                            "' data-category='' class='link-text' title='" +
                            pdfDownloadFile +
                            "(" +
                            d.productFicheproductLeve1Code +
                            ")" +
                            "'>" +
                            "<span class='fiche type-product'>" +
                            productFicheDownload +
                            "</span>" +
                            "</a>";
                        } // LGEITF-877 :: d.productFicheFileName bug fix
                      }
                    } else {
                      if (
                        d.productFicheFileName != "" &&
                        d.productFicheOriginalName != "" &&
                        d.productFicheFileName != null &&
                        d.productFicheOriginalName != null &&
                        d.productFicheDocId != null &&
                        d.productFicheDocId != ""
                      ) {
                        productFichehtml +=
                          "<a href='#' adobe-click='pdp-file-down-click' data-doc='" +
                          d.productFicheDocId +
                          "' data-file='" +
                          d.productFicheFileName +
                          "' data-original='" +
                          d.productFicheOriginalName +
                          "' data-category='' class='link-text' title='" +
                          pdfDownloadFile +
                          "(" +
                          d.productFicheproductLeve1Code +
                          ")" +
                          "'>" +
                          "<span class='fiche type-product'>" +
                          productFicheDownload +
                          "</span>" +
                          "</a>";
                      }
                    }
                    //LGEGMC-3921
                    /*LGEGMC-1035 start*/
                    if ($("html").attr("data-countrycode") == "uk") {
                      if (
                        d.energyLabel != "" &&
                        d.energyLabel != "N" &&
                        d.energyLabel != null &&
                        d.energyLabelDocId != null &&
                        d.energyLabelDocId != "" &&
                        d.energyLabelFileName != null &&
                        d.energyLabelFileName != "" &&
                        d.energyLabelOriginalName != null &&
                        d.energyLabelOriginalName != "" &&
                        d.energyLabelImageAddr != null &&
                        d.energyLabelImageAddr != "" &&
                        d.energyLabelName != null &&
                        d.energyLabelName != "" &&
                        d.fEnergyLabelFileName != null &&
                        d.fEnergyLabelDocId != null &&
                        d.fEnergyLabelDocId != "" &&
                        d.fEnergyLabelFileName != "" &&
                        d.fEnergyLabelOriginalName != null &&
                        d.fEnergyLabelOriginalName != ""
                      ) {
                        var energyLabelhtml =
                          "<div class='energy-label-wrap'><a href='#' class='label-link'><span class='label'><img src='" +
                          d.energyLabelImageAddr +
                          "' alt='" +
                          d.energyLabelName +
                          "'></span></a><div class='tooltip-link'><div class='tolltip-inner'>";
                        if (
                          d.fEnergyLabelFileName != null &&
                          d.fEnergyLabelDocId != null &&
                          d.fEnergyLabelDocId != "" &&
                          d.fEnergyLabelFileName != "" &&
                          d.fEnergyLabelOriginalName != null &&
                          d.fEnergyLabelOriginalName != ""
                        ) {
                          energyLabelhtml +=
                            "<a href='#' class='link-text link-text-uk' adobe-click='pdp-file-down-click' data-doc='" +
                            d.fEnergyLabelDocId +
                            "' data-file='" +
                            d.fEnergyLabelFileName +
                            "' data-original='" +
                            d.fEnergyLabelOriginalName +
                            "'  data-category='' title='" +
                            pdfDownloadFile +
                            "(" +
                            d.fenergyLabelproductLeve1Code +
                            ")" +
                            "'>" +
                            $("#pdfDownloadFileUk").val() +
                            "</a>";
                        }
                        energyLabelhtml +=
                          "<a href='#' class='link-text link-text-eu' adobe-click='pdp-file-down-click' data-doc='" +
                          d.energyLabelDocId +
                          "' data-file='" +
                          d.energyLabelFileName +
                          "' data-original='" +
                          d.energyLabelOriginalName +
                          "'  data-category='' title='" +
                          pdfDownloadFile +
                          "(" +
                          d.energyLabelproductLeve1Code +
                          ")" +
                          "'>" +
                          $("#pdfDownloadFileEu").val() +
                          "</a></div></div></div>";
                      } else {
                        var energyLabelhtml =
                          "<a href='#' adobe-click='pdp-file-down-click' data-doc='" +
                          d.energyLabelDocId +
                          "' data-file='" +
                          d.energyLabelFileName +
                          "' data-original='" +
                          d.energyLabelOriginalName +
                          "'  data-category='' class='link-text' title='" +
                          pdfDownloadFile +
                          "(" +
                          d.energyLabelproductLeve1Code +
                          ")" +
                          "'>" +
                          "<span class='label type-none'><img src='" +
                          d.energyLabelImageAddr +
                          "' alt='" +
                          d.energyLabelName +
                          "'></span></a>";
                      }
                    } else {
                      var energyLabelhtml =
                        "<a href='#' adobe-click='pdp-file-down-click' data-doc='" +
                        d.energyLabelDocId +
                        "' data-file='" +
                        d.energyLabelFileName +
                        "' data-original='" +
                        d.energyLabelOriginalName +
                        "'  data-category='' class='link-text' title='" +
                        pdfDownloadFile +
                        "(" +
                        d.energyLabelproductLeve1Code +
                        ")" +
                        "'>" +
                        "<span class='label type-none'><img src='" +
                        d.energyLabelImageAddr +
                        "' alt='" +
                        d.energyLabelName +
                        "'></span></a>";
                    }

                    /*LGEGMC-1035 end*/
                    //LGEGMC-3921
                    if (d.washTowerFlag == "Y") {
                      if ($("html").attr("data-countrycode") == "uk") {
                        if (
                          d.secondEnergyLabel != "" &&
                          d.secondEnergyLabel != "N" &&
                          d.secondEnergyLabel != null &&
                          d.secondEnergyLabelDocId != null &&
                          d.secondEnergyLabelDocId != "" &&
                          d.secondEnergyLabelFileName != null &&
                          d.secondEnergyLabelFileName != "" &&
                          d.secondEnergyLabelOriginalName != null &&
                          d.secondEnergyLabelOriginalName != "" &&
                          d.secondEnergyLabelImageAddr != null &&
                          d.secondEnergyLabelImageAddr != "" &&
                          d.secondEnergyLabelName != null &&
                          d.secondEnergyLabelName != "" &&
                          d.secondFEnergyLabelFileName != null &&
                          d.secondFEnergyLabelDocId != null &&
                          d.secondFEnergyLabelDocId != "" &&
                          d.secondFEnergyLabelFileName != "" &&
                          d.secondFEnergyLabelOriginalName != null &&
                          d.secondFEnergyLabelOriginalName != ""
                        ) {
                          var secondEnergyLabelhtml =
                            "<div class='energy-label-wrap'><a href='#' class='label-link'><span class='label'><img src='" +
                            d.secondEnergyLabelImageAddr +
                            "' alt='" +
                            d.secondEnergyLabelName +
                            "'></span></a>";
                          secondEnergyLabelhtml +=
                            "<div class='tooltip-link'><div class='tolltip-inner'>";
                          secondEnergyLabelhtml +=
                            "<a href='#' class='link-text link-text-uk' adobe-click='pdp-file-down-click' data-doc='" +
                            d.secondFEnergyLabelDocId +
                            "' data-file='" +
                            d.secondFEnergyLabelFileName +
                            "' data-original='" +
                            d.secondFEnergyLabelOriginalName +
                            "'  data-category='' title='" +
                            pdfDownloadFile +
                            "(" +
                            d.secondFEnergyLabelproductLeve1Code +
                            ")" +
                            "'>" +
                            $("#pdfDownloadFileUk").val() +
                            "</a>";
                          secondEnergyLabelhtml +=
                            "<a href='#' class='link-text link-text-eu' adobe-click='pdp-file-down-click' data-doc='" +
                            d.secondEnergyLabelDocId +
                            "' data-file='" +
                            d.secondEnergyLabelFileName +
                            "' data-original='" +
                            d.secondEnergyLabelOriginalName +
                            "'  data-category='' title='" +
                            pdfDownloadFile +
                            "(" +
                            d.secondEnergyLabelproductLeve1Code +
                            ")" +
                            "'>" +
                            $("#pdfDownloadFileEu").val() +
                            "</a></div></div></div>";
                        } else {
                          var secondEnergyLabelhtml =
                            "<a href='#' adobe-click='pdp-file-down-click' data-doc='" +
                            d.secondEnergyLabelDocId +
                            "' data-file='" +
                            d.secondEnergyLabelFileName +
                            "' data-original='" +
                            d.secondEnergyLabelOriginalName +
                            "'  data-category='' class='link-text' title='" +
                            pdfDownloadFile +
                            "(" +
                            d.secondEnergyLabelproductLeve1Code +
                            ")" +
                            "'>" +
                            "<span class='label type-none'><img src='" +
                            d.secondEnergyLabelImageAddr +
                            "' alt='" +
                            d.secondEnergyLabelName +
                            "'></span></a>";
                        }
                      } else {
                        var secondEnergyLabelhtml =
                          "<a href='#' adobe-click='pdp-file-down-click' data-doc='" +
                          d.secondEnergyLabelDocId +
                          "' data-file='" +
                          d.secondEnergyLabelFileName +
                          "' data-original='" +
                          d.secondEnergyLabelOriginalName +
                          "'  data-category='' class='link-text' title='" +
                          pdfDownloadFile +
                          "(" +
                          d.secondEnergyLabelproductLeve1Code +
                          ")" +
                          "'>" +
                          "<span class='label type-none'><img src='" +
                          d.secondEnergyLabelImageAddr +
                          "' alt='" +
                          d.secondEnergyLabelName +
                          "'></span></a>";
                      }
                    }
                    //LGEGMC-3921
                    //LGEGMC-5315
                    if (docTypeCodeFlag == "N" || docTypeCodeFlag == "O") {
                      if (
                        d.energyLabel != "" &&
                        d.energyLabel != "N" &&
                        d.energyLabel != null &&
                        d.energyLabelDocId != null &&
                        d.energyLabelDocId != "" &&
                        d.energyLabelFileName != null &&
                        d.energyLabelFileName != "" &&
                        d.energyLabelOriginalName != null &&
                        d.energyLabelOriginalName != "" &&
                        d.energyLabelImageAddr != null &&
                        d.energyLabelImageAddr != "" &&
                        d.energyLabelName != null &&
                        d.energyLabelName != ""
                      ) {
                        $item.find(".file-list").append($(energyLabelhtml));
                      }
                      if (
                        d.productFicheFileName != "" &&
                        d.productFicheOriginalName != "" &&
                        d.productFicheFileName != null &&
                        d.productFicheOriginalName != null &&
                        d.productFicheDocId != null &&
                        d.productFicheDocId != ""
                      ) {
                        $item.find(".file-list").append($(productFichehtml));
                      }
                    } else {
                      if (
                        d.productFicheFileName != "" &&
                        d.productFicheOriginalName != "" &&
                        d.productFicheFileName != null &&
                        d.productFicheOriginalName != null &&
                        d.productFicheDocId != null &&
                        d.productFicheDocId != ""
                      ) {
                        $item.find(".file-list").append($(productFichehtml));
                      }
                      if (
                        d.energyLabel != "" &&
                        d.energyLabel != "N" &&
                        d.energyLabel != null &&
                        d.energyLabelDocId != null &&
                        d.energyLabelDocId != "" &&
                        d.energyLabelFileName != null &&
                        d.energyLabelFileName != "" &&
                        d.energyLabelOriginalName != null &&
                        d.energyLabelOriginalName != "" &&
                        d.energyLabelImageAddr != null &&
                        d.energyLabelImageAddr != "" &&
                        d.energyLabelName != null &&
                        d.energyLabelName != ""
                      ) {
                        $item.find(".file-list").append($(energyLabelhtml));
                      }
                    }
                    //LGEGMC-5315
                    if (
                      d.secondEnergyLabel != "" &&
                      d.secondEnergyLabel != "N" &&
                      d.secondEnergyLabel != null &&
                      d.secondEnergyLabelDocId != null &&
                      d.secondEnergyLabelDocId != "" &&
                      d.secondEnergyLabelFileName != null &&
                      d.secondEnergyLabelFileName != "" &&
                      d.secondEnergyLabelOriginalName != null &&
                      d.secondEnergyLabelOriginalName != "" &&
                      d.secondEnergyLabelImageAddr != null &&
                      d.secondEnergyLabelImageAddr != "" &&
                      d.secondEnergyLabelName != null &&
                      d.secondEnergyLabelName != "" &&
                      d.secondFEnergyLabelFileName != null &&
                      d.secondFEnergyLabelDocId != null &&
                      d.secondFEnergyLabelDocId != "" &&
                      d.secondFEnergyLabelFileName != "" &&
                      d.secondFEnergyLabelOriginalName != null &&
                      d.secondFEnergyLabelOriginalName != ""
                    ) {
                      $item.find(".file-list").append($(secondEnergyLabelhtml));
                    }

                    // rating

                    //PJTPDR-1, LGEGMC-4343 START
                    var pdrCompareUseFlag = d.pdrCompareUseFlag;
                    if (pdrCompareUseFlag == "N") {
                      $item.find("a.js-compare").css("display", "none");
                    }
                    //PJTPDR-1, LGEGMC-4343 END

                    // 20200421 START 박지영 SELF인 경우에는 리뷰 변경하지 않음.
                    // 20200512 START 박지영 - target이 없는 경우 제외
                    if (
                      $item.find(".rating").hasClass("inhouse-review") &&
                      d.target &&
                      d.target.toUpperCase() == "NEW"
                    ) {
                      // 20200512 END
                      // 20200421 END
                      var labelTxt = $item
                        .find(".rating.inhouse-review")
                        .data("pattern");
                      if (!labelTxt)
                        labelTxt = "#1 out of 5 stars. #2 reviews.";
                      labelTxt = labelTxt
                        .replace(/\#1/g, d.reviewRatingStar2)
                        .replace(/\#2/g, d.reviewRating);
                      //PJTGADL-2
                      $item
                        .find(".star-area")
                        .attr("data-model-id", d.modelId)
                        .attr("data-sku", d.modelName)
                        .attr("data-model-name", d.modelName)
                        .attr(
                          "data-model-salesmodelcode",
                          d.salesModelCode + "." + d.salesSuffixCode
                        )
                        .attr("data-category-name", d.buName2)
                        .attr(
                          "data-sub-category-name",
                          nvl(d.buName3, "") || ""
                        )
                        .attr("data-super-category-name", d.superCategoryName)
                        .attr("data-model-year", d.modelYear)
                        .attr("data-model-suffixcode", d.salesSuffixCode)
                        .attr("data-bu", d.buName1)
                        .attr("data-model-overallscore", d.reviewRatingStar2)
                        .attr("data-model-reviewCnt", d.reviewRating)
                        .attr("data-price");
                      //LGECZ-196 s
                      var modelUrlPath = "*modelUrlPath*#pdp_review";
                      modelUrlPath = modelUrlPath.replace(
                        /\*modelUrlPath\*/g,
                        d.modelUrlPath
                      );
                      $item
                        .find(".rating.inhouse-review > a")
                        .attr("href", modelUrlPath);
                      //LGECZ-196 e
                      $item
                        .find(".rating.inhouse-review > a")
                        .attr("aria-label", labelTxt)
                        .find(".review-number")
                        .text("(" + d.reviewRating + ")")
                        .siblings(".star")
                        .find(".bg-star .carmine-star")
                        .css("width", d.reviewRatingPercent + "%");
                    } else {
                      if (
                        d.reviewType == "BV" &&
                        modelSwicher.bizType == "B2C" &&
                        d.target &&
                        d.target.toUpperCase() == "NEW"
                      ) {
                        $item
                          .find(".rating")
                          .replaceWith(
                            '<div class="rating" data-bv-show="inline_rating" data-bv-product-id="' +
                              d.modelId +
                              '" data-bv-redirect-url="' +
                              d.modelUrlPath +
                              '#pdp_review"></div>'
                          );
                      }
                      // 20200406 START 박지영 : BV2 스크립트 수정
                      if (
                        d.reviewType == "BV2" &&
                        modelSwicher.bizType == "B2C"
                      ) {
                        $item
                          .find(".rating")
                          .removeClass("loaded")
                          .attr("data-modelid", d.modelId)
                          .removeAttr("id")
                          .find("a")
                          .attr("href", d.modelUrlPath + "#pdp_review");
                        runBVStaticPLP($item);
                      }
                      // 20200406 END
                      if (d.reviewType == "SP") {
                        // Shoppilot (ru)
                        $item
                          .find(".rating span[data-shoppilot]")
                          .attr("data-shoppilot", d.modelName.toLowerCase())
                          .empty();
                        if (typeof renderListingInlineRatingsRU != "undefined")
                          renderListingInlineRatingsRU(getProductsNameRU());
                      }
                    }
                    // 20201013 라벨아이콘 PJTPLP-1 최선길
                    var countryCode =
                      $("[data-countrycode]").attr("data-countrycode");
                    var $elLabel = $item.find(".label-inner ul");
                    var $elModelBrand = $item.find(".model-brand");
                    $elLabel.empty();

                    //if((countryCode == 'ru' || countryCode == 'uk' || countryCode == 'in') && ($('.GPC0007').length>0 ||$('.GPC0026').length>0)) {
                    if ($(".GPC0007").length > 0 || $(".GPC0026").length > 0) {
                      var labelIconMap = d.labelIconMap;
                      var installmessage = $(
                        "[data-component-installmessage]"
                      ).attr("data-component-installmessage");
                      var warrantyMessage = $(
                        "[data-component-warrantyMessage]"
                      ).attr("data-component-warrantyMessage");
                      var deliveryMessage = $(
                        "[data-component-deliveryMessage]"
                      ).attr("data-component-deliveryMessage"); //LGEVN-619 add

                      var labelIconCount = 1; //OBSLEGIN-564

                      for (var cnt = 0; cnt < labelIconMap.length; cnt++) {
                        var labelIcon = labelIconMap[cnt];
                        var shortDescType = labelIcon.shortDescType;
                        var htm = "";
                        var tmpType1 =
                          '<li data-adobe-tracking-wish="Y" data-page-event="plp_labelicon"><img src="{{imagePathAddr}}" alt="{{altText}}" aria-hidden="true"><p>{{shortDesc}}</p></li>';
                        var tmpType2 =
                          '<li data-adobe-tracking-wish="Y" data-page-event="plp_labelicon"><p>{{shortDesc}}</p></li>';
                        //LGEAU-644 START
                        var tmpType3 =
                          '<li class="free-delivery d-none" data-adobe-tracking-wish="Y" data-page-event="plp_labelicon"><img src="{{imagePathAddr}}" alt="{{altText}}" aria-hidden="true"><p>{{shortDesc}}</p></li>';
                        //LGEAU-644 END
                        var tmpText = "";
                        if (
                          shortDescType == "AWARD" ||
                          shortDescType == "FEATURE"
                        ) {
                          if (
                            labelIcon.cssFontBold == "Y" &&
                            labelIcon.cssFontItalic == "Y"
                          ) {
                            tmpText =
                              "<li data-adobe-tracking-wish='Y' data-page-event='plp_labelicon' class='text-all'>";
                          } else if (labelIcon.cssFontBold == "Y") {
                            tmpText =
                              "<li data-adobe-tracking-wish='Y' data-page-event='plp_labelicon' class='text-bold'>";
                          } else if (labelIcon.cssFontItalic == "Y") {
                            tmpText =
                              "<li data-adobe-tracking-wish='Y' data-page-event='plp_labelicon' class='text-italic'>";
                          } else {
                            tmpText =
                              "<li data-adobe-tracking-wish='Y' data-page-event='plp_labelicon'>";
                          }
                          if (
                            labelIcon.linkUrl != null &&
                            labelIcon.linkUrl != ""
                          ) {
                            tmpText =
                              tmpText + "<a href='" + labelIcon.linkUrl + "' ";
                            if (labelIcon.linkOpt == "S") {
                              tmpText =
                                tmpText +
                                "target='_self' data-adobe-tracking-wish='Y' data-page-event='plp-labelicon'>";
                            } else if (labelIcon.linkOpt == "B") {
                              tmpText =
                                tmpText +
                                "target='_blank' data-adobe-tracking-wish='Y' data-page-event='plp-labelicon'>";
                            }
                          }
                          if (
                            labelIcon.imagePathAddr != "" &&
                            labelIcon.imagePathAddr != null
                          ) {
                            tmpText =
                              tmpText +
                              "<img src='" +
                              labelIcon.imagePathAddr +
                              "' alt='" +
                              labelIcon.altText +
                              "' aria-hidden='true'>" +
                              "<p>" +
                              labelIcon.shortDesc +
                              "</p>";
                            if (
                              labelIcon.linkUrl != null &&
                              labelIcon.linkUrl != ""
                            ) {
                              tmpText = tmpText + "</a>";
                            }
                            tmpText = tmpText + "</li>";
                          } else {
                            tmpText =
                              tmpText + "<p>" + labelIcon.shortDesc + "</p>";
                            if (
                              labelIcon.linkUrl != null &&
                              labelIcon.linkUrl != ""
                            ) {
                              tmpText = tmpText + "</a>";
                            }
                            tmpText = tmpText + "</li>";
                          }
                          htm = tmpText;
                        } else if (shortDescType == "DELIVERY") {
                          /* LGEAU-372 */
                          var iconName = $item
                            .closest(".result-box")
                            .data("deliveryIcon");

                          //LGEVN-619 START
                          if ($("html").attr("data-countrycode") == "vn") {
                            var msg = "";
                            if (
                              "Y" == d.obsLeadTimeFlag &&
                              "" != d.obsLeadTimeMin &&
                              "" != d.obsLeadTimeMax
                            ) {
                              msg = deliveryMessage
                                .replace("{{obsLeadTimeMin}}", d.obsLeadTimeMin)
                                .replace(
                                  "{{obsLeadTimeMax}}",
                                  d.obsLeadTimeMax
                                );
                            } else {
                              msg = installmessage;
                            }
                            htm = tmpType1
                              .replace(
                                "{{imagePathAddr}}",
                                "/lg5-common-gp/images/common/icons/" +
                                  iconName +
                                  ".svg"
                              )
                              .replace("{{altText}}", "")
                              .replace("{{shortDesc}}", msg); //labelIcon.shortDesc
                            //LGEAU-644 START
                          } else if (
                            $("html").attr("data-countrycode") == "au"
                          ) {
                            htm = tmpType3
                              .replace(
                                "{{imagePathAddr}}",
                                "/lg5-common-gp/images/common/icons/" +
                                  iconName +
                                  ".svg"
                              )
                              .replace("{{altText}}", "")
                              .replace("{{shortDesc}}", installmessage); //labelIcon.shortDesc

                            //LGEAU-644 END

                            //LGEITF-832 START
                          } else if (
                            $("html").attr("data-countrycode") == "in" &&
                            d.userGroup == "B2C" &&
                            d.obsInstallmentMemberCashback1 != null &&
                            d.obsInstallmentMemberCashback1 != ""
                          ) {
                            htm = tmpType2.replace(
                              "{{shortDesc}}",
                              d.obsInstallmentMemberCashback1
                            );
                          } else if (
                            $("html").attr("data-countrycode") == "in" &&
                            d.userGroup != "B2C" &&
                            d.obsInstallmentCashback1 != null &&
                            d.obsInstallmentCashback1 != ""
                          ) {
                            htm = tmpType2.replace(
                              "{{shortDesc}}",
                              d.obsInstallmentCashback1
                            );
                            //LGEITF-832 END
                          } else {
                            // OBSLGEMX-255 Start
                            if (
                              ("Y" == d.hideInstallationMessageFlag &&
                                "N" != d.obsInsatllationDisplayFlag) ||
                              "N" == d.hideInstallationMessageFlag
                            ) {
                              htm = tmpType1
                                .replace(
                                  "{{imagePathAddr}}",
                                  "/lg5-common-gp/images/common/icons/" +
                                    iconName +
                                    ".svg"
                                )
                                .replace("{{altText}}", "")
                                .replace("{{shortDesc}}", installmessage); //labelIcon.shortDesc
                            }
                            // OBSLGEMX-255 End
                          }
                          //LGEVN-619 END

                          /*//LGEAU-372 */
                        } else if (shortDescType == "WARRANTY") {
                          //LGEITF-832 START
                          if (
                            $("html").attr("data-countrycode") == "in" &&
                            d.userGroup == "B2C" &&
                            d.obsInstallmentMemberCashback2 != null &&
                            d.obsInstallmentMemberCashback2 != ""
                          ) {
                            htm = tmpType2.replace(
                              "{{shortDesc}}",
                              d.obsInstallmentMemberCashback2
                            );
                          } else if (
                            $("html").attr("data-countrycode") == "in" &&
                            d.userGroup != "B2C" &&
                            d.obsInstallmentCashback2 != null &&
                            d.obsInstallmentCashback2 != ""
                          ) {
                            htm = tmpType2.replace(
                              "{{shortDesc}}",
                              d.obsInstallmentCashback2
                            );
                          } else {
                            htm = tmpType1
                              .replace(
                                "{{imagePathAddr}}",
                                "/lg5-common-gp/images/common/icons/warranty.svg"
                              )
                              .replace("{{altText}}", "")
                              .replace("{{shortDesc}}", warrantyMessage); // labelIcon.shortDesc
                          }
                          //LGEITF-832 END
                        } //LGEDE-220
                        else if (shortDescType == "SHIPPINGFLAG") {
                          htm = tmpType1
                            .replace(
                              "{{imagePathAddr}}",
                              "/lg5-common-gp/images/common/icons/free-shipping_de.svg"
                            )
                            .replace(
                              "{{altText}}",
                              nvl(labelIcon.shortDesc, "")
                            )
                            .replace(
                              "{{shortDesc}}",
                              nvl(labelIcon.shortDesc, "")
                            ); // labelIcon.shortDesc
                        } else if (shortDescType == "DELIVERYFLAG") {
                          htm = tmpType1
                            .replace(
                              "{{imagePathAddr}}",
                              "/lg5-common-gp/images/common/icons/delievery_de.svg"
                            )
                            .replace(
                              "{{altText}}",
                              nvl(labelIcon.shortDesc, "")
                            )
                            .replace(
                              "{{shortDesc}}",
                              nvl(labelIcon.shortDesc, "")
                            ); // labelIcon.shortDesc
                        } else if (shortDescType == "INSTALLATIONFLAG") {
                          htm = tmpType1
                            .replace(
                              "{{imagePathAddr}}",
                              "/lg5-common-gp/images/common/icons/installation_de.svg"
                            )
                            .replace(
                              "{{altText}}",
                              nvl(labelIcon.shortDesc, "")
                            )
                            .replace(
                              "{{shortDesc}}",
                              nvl(labelIcon.shortDesc, "")
                            ); // labelIcon.shortDesc
                          /* LGEIN-399 : 20210607 add */
                        } else if (shortDescType == "KEYFEATUREFLAG") {
                          if (
                            labelIcon.cssFontBold == "Y" &&
                            labelIcon.cssFontItalic == "Y"
                          ) {
                            tmpText =
                              "<li data-adobe-tracking-wish='Y' data-page-event='plp_labelicon' class='text-all'><p>" +
                              nvl(labelIcon.shortDesc, "") +
                              "</p></li>";
                          } else if (labelIcon.cssFontBold == "Y") {
                            tmpText =
                              "<li data-adobe-tracking-wish='Y' data-page-event='plp_labelicon' class='text-bold'><p>" +
                              nvl(labelIcon.shortDesc, "") +
                              "</p></li>";
                          } else if (labelIcon.cssFontItalic == "Y") {
                            tmpText =
                              "<li data-adobe-tracking-wish='Y' data-page-event='plp_labelicon' class='text-italic'><p>" +
                              nvl(labelIcon.shortDesc, "") +
                              "</p></li>";
                          } else {
                            tmpText =
                              "<li data-adobe-tracking-wish='Y' data-page-event='plp_labelicon'><p>" +
                              nvl(labelIcon.shortDesc, "") +
                              "</p></li>";
                          }
                          htm = tmpText;
                        }
                        /*// LGEIN-399 : 20210607 add */
                        //LGEDE-220
                        else {
                          /*//LGEFR-640*/
                          if (shortDescType != "REPAIRABILITY INDEX") {
                            htm = tmpType2.replace(
                              "{{shortDesc}}",
                              labelIcon.shortDesc
                            );
                          }
                          /*//LGEFR-640*/
                        }
                        //OBSLGEIN-564 START
                        if (
                          $("html").attr("data-countrycode") == "in" &&
                          modelSwicher.bizType == "B2C" &&
                          (d.addToCartFlag == "Y" || d.addToCartFlag == "S") &&
                          d.exchanageOfferFlag == "Y"
                        ) {
                          labelIconCount = labelIconCount + 1;

                          var tempExchangeMsg = $(
                            "[data-component-exchange-Message]"
                          ).attr("data-component-exchange-Message");
                          tempExchangeMsg =
                            tempExchangeMsg +
                            $("[data-component-exchange-price-Message]").attr(
                              "data-component-exchange-price-Message"
                            );
                          var tempExchangeText =
                            "<li data-adobe-tracking-wish='Y' data-page-event='plp_labelicon' class='key-list'><img src='/lg5-common-gp/images/common/icons/icon-exchange.svg' alt='" +
                            tempExchangeMsg +
                            "' aria-hidden='true'><p>" +
                            tempExchangeMsg +
                            "</p></li>";

                          if (labelIconMap.length < 3) {
                            if (labelIconMap.length + 1 == labelIconCount) {
                              htm = htm + tempExchangeText;
                            }
                          } else {
                            if (labelIconCount == 3) {
                              htm = htm + tempExchangeText;
                            }
                          }
                        }
                        //OBSLGEIN-564 End

                        $elLabel.append(htm);
                        //LGEAU-644 START
                        if (shortDescType == "DELIVERY") {
                          if ($("html").attr("data-countrycode") == "au") {
                            var obsGroupCheck = "";
                            obsGroupCheck =
                              $(".navigation").attr("data-obs-group");
                            if (obsGroupCheck == "B2E") {
                              $(".free-delivery").addClass("d-none");
                            } else {
                              $(".free-delivery").removeClass("d-none");
                            }
                          }
                        }
                        //LGEAU-644 END

                        /*//LGEFR-640*/
                        var repairabilityArea = $item.find(
                          ".repairability-index"
                        );
                        if (d.labelRepairMap.length > 0) {
                          var repairMapData = d.labelRepairMap[0];
                          var repairabilityMsg = repairabilityArea.attr(
                            "data-repairability-msg"
                          );
                          var targetBlankMsg = repairabilityArea.attr(
                            "data-target-blank-msg"
                          );
                          var repairAbilityHtml = "<div class='score'>";
                          repairAbilityHtml +=
                            "<span class='txt'>" + repairabilityMsg + "</span>";
                          if (
                            repairMapData.linkUrl != "null" &&
                            repairMapData.linkUrl != ""
                          ) {
                            repairAbilityHtml +=
                              "<a href='" + repairMapData.linkUrl + "'";
                            if (repairMapData.linkOpt == "S") {
                              repairAbilityHtml += " target='_self'";
                            } else if (repairMapData.linkOpt == "B") {
                              repairAbilityHtml += " target='_blank'";
                            }
                            repairAbilityHtml +=
                              " title='" +
                              targetBlankMsg +
                              "' class='link-pdf'>";
                          } else {
                            repairAbilityHtml += "<span class='link-pdf'>";
                          }
                          if (
                            repairMapData.imagePathAddr != "null" &&
                            repairMapData.imagePathAddr != ""
                          ) {
                            repairAbilityHtml +=
                              "<img src='" +
                              repairMapData.imagePathAddr +
                              "' alt='" +
                              repairMapData.altText +
                              "' area-hidden='true' />";
                          }
                          if (
                            repairMapData.linkUrl != "null" &&
                            repairMapData.linkUrl != ""
                          ) {
                            repairAbilityHtml += "</a></div>";
                          } else {
                            repairAbilityHtml += "</span></div>";
                          }
                          repairabilityArea.html(repairAbilityHtml);
                        } else {
                          repairabilityArea.html("");
                        }
                        /*//LGEFR-640*/
                      }
                      //modelBrandArea signatureFlag thinqFlag

                      // PJTQUICKWIN 20220225
                      if (productType == "card") {
                        $elModelBrand = $item.find(".model-brand-area");
                        if (d.bizType == "B2C" && d.signatureFlag == "Y") {
                          var tmp =
                            '<span class="brand-signature"><img src="/lg5-common-gp/images/products/brand-label/brand-sg.svg" alt="LG Signature"></span>';
                          $elModelBrand.append(tmp);
                        }
                        if (d.thinqFlag == "Y") {
                          var tmp =
                            '<span class="brand-thinq"><img src="/lg5-common-gp/images/products/brand-label/brand-thinq.svg" alt="LG ThinQ"></span>';
                          $elModelBrand.append(tmp);
                        }
                      }

                      if ($elModelBrand.length > 0) {
                        $elModelBrand.empty();

                        // PJTQUICKWIN 20220225
                        if (productType == "card") {
                        } else {
                          if (d.bizType == "B2C" && d.signatureFlag == "Y") {
                            var tmp =
                              '<a rel="nofollow" href="' +
                              d.modelUrlPath +
                              '"aria-hidden="true" tabindex="-1" data-link-area="product_list-model_list" data-link-name="' +
                              d.modelName +
                              '" data-adobe-modelname=" ' +
                              d.modelName +
                              '" data-adobe-salesmodelcode="' +
                              d.salesModelCode +
                              '" data-adobe-salessuffixcode="' +
                              d.salesSuffixCode +
                              ' data-adobe-tracking-wish="Y" data-page-event="plp-brand-flag">';
                            tmp =
                              tmp +
                              '<span><img src="/lg5-common-gp/images/products/brand-label/brand-sg.svg" alt="LG Signature"></span> ' +
                              "</a>";
                            $elModelBrand.append(tmp);
                          }
                          if (d.thinqFlag == "Y") {
                            var tmp =
                              '<a rel="nofollow" href="' +
                              d.modelUrlPath +
                              '"aria-hidden="true" tabindex="-1" data-link-area="product_list-model_list" data-link-name="' +
                              d.modelName +
                              '" data-adobe-modelname=" ' +
                              d.modelName +
                              '" data-adobe-salesmodelcode="' +
                              d.salesModelCode +
                              '" data-adobe-salessuffixcode="' +
                              d.salesSuffixCode +
                              '">';
                            tmp =
                              tmp +
                              '<span><img src="/lg5-common-gp/images/products/brand-label/brand-thinq.svg" alt="LG ThinQ"></span>' +
                              "</a>";
                            $elModelBrand.append(tmp);
                          }
                        }
                      }
                    }

                    /*//LGEFR-640*/
                    var repairabilityArea = $item.find(".repairability-index");
                    if (repairabilityArea.length > 0) {
                      if (d.labelRepairMap.length > 0) {
                        var repairMapData = d.labelRepairMap[0];
                        var repairabilityMsg = repairabilityArea.attr(
                          "data-repairability-msg"
                        );
                        var targetBlankMsg = repairabilityArea.attr(
                          "data-target-blank-msg"
                        );
                        var repairAbilityHtml = "<div class='score'>";
                        repairAbilityHtml +=
                          "<span class='txt'>" + repairabilityMsg + "</span>";
                        if (
                          repairMapData.linkUrl != "null" &&
                          repairMapData.linkUrl != ""
                        ) {
                          repairAbilityHtml +=
                            "<a href='" + repairMapData.linkUrl + "'";
                          if (repairMapData.linkOpt == "S") {
                            repairAbilityHtml += " target='_self'";
                          } else if (repairMapData.linkOpt == "B") {
                            repairAbilityHtml += " target='_blank'";
                          }
                          repairAbilityHtml +=
                            " title='" + targetBlankMsg + "' class='link-pdf'>";
                        } else {
                          repairAbilityHtml += "<span class='link-pdf'>";
                        }
                        if (
                          repairMapData.imagePathAddr != "null" &&
                          repairMapData.imagePathAddr != ""
                        ) {
                          repairAbilityHtml +=
                            "<img src='" +
                            repairMapData.imagePathAddr +
                            "' alt='" +
                            repairMapData.altText +
                            "' area-hidden='true' />";
                        }
                        if (
                          repairMapData.linkUrl != "null" &&
                          repairMapData.linkUrl != ""
                        ) {
                          repairAbilityHtml += "</a></div>";
                        } else {
                          repairAbilityHtml += "</span></div>";
                        }
                        repairabilityArea.html(repairAbilityHtml);
                      } else {
                        repairabilityArea.html("");
                      }
                    }
                    /*//LGEFR-640*/

                    // 20200226 PJTOBSEMI-4
                    if (d.obsEmiMsgFlag != "Y") {
                      d.emiMsg = "";
                    }
                    $item.find(".price-vip-Installment .price-vip").text("");

                    //LGEAU-378, LGEGMC-3167 START
                    if (COUNTRY_CODE.toLowerCase() == "au") {
                      $emiMsgArea = $item.find(".price-afterpay");
                      $emiZipPayMsgArea = $item.find(".price-zippay");
                      $emiZipPayMsgArea.text("");
                    } else {
                      $emiMsgArea = $item.find(
                        ".price-installment, .price-installment-text"
                      ); // LGEITF-444
                    }

                    $emiMsgArea.text("");
                    if (
                      d.emiMsg != null &&
                      d.emiMsg != "" &&
                      d.obsEmiMsgFlag == "Y"
                    ) {
                      if (COUNTRY_CODE == "au") {
                        if (d.afterPay <= 3000 && d.afterPay > 0) {
                          $emiMsgArea
                            .prop("href", "#modal-afterPay")
                            .addClass("afterpay-installment")
                            .removeAttr("style")
                            .html(d.emiMsg);
                          $emiZipPayMsgArea
                            .prop("href", "#modal-afterPay")
                            .addClass("afterpay-installment")
                            .removeAttr("style")
                            .html("or " + d.obsZipPayMsg);
                        } else if (d.afterPay > 3000 && d.afterPay <= 10000) {
                          /* OBSLGEAU-749 (5000 -> 10000) */
                          $emiZipPayMsgArea
                            .prop("href", "#modal-afterPay")
                            .addClass("afterpay-installment")
                            .removeAttr("style")
                            .html(d.obsZipPayMsg);
                        } else {
                          $emiMsgArea
                            .removeAttr("href")
                            .removeClass("afterpay-installment")
                            .prop("style", "display:none;");
                          $emiZipPayMsgArea
                            .removeAttr("href")
                            .removeClass("afterpay-installment")
                            .prop("style", "display:none;");
                        }
                      } else {
                        $emiMsgArea.text(d.emiMsg);
                        // OBSLGEHU-138 start
                        $emiMsgArea.attr("data-model-id", d.modelId);
                        if (
                          $emiMsgArea.attr("data-emi-popup-url") == null ||
                          $emiMsgArea.attr("data-emi-popup-url").length <= 0
                        ) {
                          $emiMsgArea.attr("data-emi-popup-url", d.emiPopupUrl);
                        }
                        // OBSLGEHU-138 end
                      }
                    }
                    //LGEAU-378, LGEGMC-3167 END

                    // 20201013 라벨아이콘 PJTPLP-1 최선길

                    /* LGECZ-421 Start */
                    const alignSiblingItem = function (component, priceType) {
                      let areaClass, modelBuyClass;
                      switch (priceType) {
                        case "lowest":
                          areaClass = "lowest-price";
                          modelBuyClass = "has-lowPrice";
                          break;
                        case "membership":
                          areaClass = "member-text";
                          modelBuyClass = "has-member";
                          break;
                      }
                      const checkType = component + " ." + areaClass;
                      if ($(checkType).length)
                        $(component + " .model-buy").addClass(modelBuyClass);
                    };
                    /* LGECZ-421 End */

                    /* PJTMEMBERSHIP-4 */
                    $membershipArea = $item.find(
                      "[data-sibling-membership-template]"
                    );
                    $membershipArea.html("");
                    //LGEPL-538
                    var title = $("#openTarget").val();
                    d.obsMembershipLinkTarget == "_blank"
                      ? title
                      : (title = "");
                    var obsMemberShipLinkStartHtml = "";
                    var obsMemberShipLinkEndHtml = "";
                    //LGEPL-538
                    if (
                      d.membershipDisplayFlag == "Y" &&
                      $membershipArea.length > 0
                    ) {
                      if (
                        d.obsMembershipLinkUrl != "" &&
                        d.obsMembershipLinkUrl != null
                      ) {
                        obsMemberShipLinkStartHtml =
                          "<a href='" +
                          d.obsMembershipLinkUrl +
                          "' target='" +
                          d.obsMembershipLinkTarget +
                          "' title='" +
                          title +
                          "'>";
                        obsMemberShipLinkEndHtml = "</a>";
                      }
                      var membershipTemplate = $membershipArea.attr(
                        "data-sibling-membership-template"
                      );
                      var membershipHtml = membershipTemplate
                        .replace(
                          "*siblingMembershipPrice*",
                          changeFormatFullPrice(
                            d.rMembershipPrice,
                            d.rMembershipPriceCent
                          )
                        )
                        .replace(
                          "*obsMemberShipLinkStart*",
                          obsMemberShipLinkStartHtml
                        )
                        .replace(
                          "*obsMemberShipLinkEnd*",
                          obsMemberShipLinkEndHtml
                        );
                      $membershipArea.html(membershipHtml);
                    }
                    /* PJTMEMBERSHIP-4 */

                    /* PJTMEMBERSHIP-11 */
                    $membershipTemplateArea = $item.find(".member-text");
                    $membershipTemplateArea.html("");
                    if ($item.find(".model-buy").hasClass("has-member")) {
                      $item.find(".model-buy").removeClass("has-member");
                    }
                    if (
                      d.membershipDisplayFlag == "Y" &&
                      $membershipTemplateArea.length > 0
                    ) {
                      if (
                        d.obsMembershipLinkUrl != "" &&
                        d.obsMembershipLinkUrl != null
                      ) {
                        obsMemberShipLinkStartHtml =
                          "<a href='" +
                          d.obsMembershipLinkUrl +
                          "' target='" +
                          d.obsMembershipLinkTarget +
                          "' title='" +
                          title +
                          "'>";
                        obsMemberShipLinkEndHtml = "</a>";
                      }
                      var membershipPriceTemplate = $(
                        "template.product-member-price"
                      )
                        .clone()
                        .html();
                      var membershipPriceHtml = "";
                      if (!!membershipPriceTemplate) {
                        //	LGCOMPA-44 add - GPC0004 has no template.product-member-price
                        membershipPriceHtml = membershipPriceTemplate
                          .replace(
                            "*siblingMembershipPrice*",
                            changeFormatFullPrice(
                              d.rMembershipPrice,
                              d.rMembershipPriceCent
                            )
                          )
                          .replace(
                            "*obsMemberShipLinkStart*",
                            obsMemberShipLinkStartHtml
                          )
                          .replace(
                            "*obsMemberShipLinkEnd*",
                            obsMemberShipLinkEndHtml
                          );
                      }
                      /* LGCOMPA-44 start */
                      if (
                        SIGN_IN_STATUS == "N" &&
                        !!d.guestPriceMessageUseFlag &&
                        d.guestPriceMessageUseFlag == "Y" &&
                        !!d.guestPriceMessage
                      ) {
                        membershipPriceHtml = d.guestPriceMessage;
                      }
                      /* LGCOMPA-44 end */
                      $membershipTemplateArea.html(membershipPriceHtml);

                      if (!$item.find(".model-buy").hasClass("has-member")) {
                        $item.find(".model-buy").addClass("has-member");
                      }
                    }
                    /* PJTMEMBERSHIP-11 */

                    alignSiblingItem(".GPC0007", "membership"); // LGECZ-421

                    /* LGEGMC-1973 */
                    $cheaperPriceArea = $item.find(
                      "[data-sibling-cheaperPrice-template]"
                    );
                    $cheaperPriceArea.html("");
                    if (
                      d.cheaperPriceFlag == "Y" &&
                      $cheaperPriceArea.length > 0
                    ) {
                      var cheaperPriceTemplate = $cheaperPriceArea.attr(
                        "data-sibling-cheaperPrice-template"
                      );
                      //cheaper
                      var cheaperPriceHtml = cheaperPriceTemplate.replace(
                        "*siblingCheaperPrice*",
                        changeFormatFullPrice(
                          d.cheaperPrice,
                          d.cheaperPriceCent
                        )
                      );
                      $cheaperPriceArea.html(cheaperPriceHtml);
                    }
                    /* LGEGMC-1973 */

                    /* LGCOMMON-54 Start */
                    $lowestPriceArea = $item.find(".lowest-price");
                    if (
                      d.obsLowestPriceFlag == "Y" &&
                      !!d.rPromoPrice &&
                      $lowestPriceArea.length
                    )
                      $lowestPriceArea.removeClass("d-none");
                    else if ($lowestPriceArea.length)
                      $lowestPriceArea.addClass("d-none");

                    alignSiblingItem(".GPC0007", "lowest");
                    /* LGCOMMON-54 End */

                    // Price
                    $priceArea = $item.find(".price-area.total");
                    if ($priceArea.length != 0) {
                      $priceArea.removeClass(
                        "type-none type-default type-msrp type-promotion type-text"
                      );
                      if (d.modelStatusCode == "DISCONTINUED") {
                        // do nothing
                      } else if (d.retailerPricingFlag == "Y") {
                        // type text
                        $priceArea.addClass("type-text");
                        $priceArea.find(".text").text(d.retailerPricingText);
                      } else if (
                        d.rPromoPrice != null &&
                        d.rPrice != null &&
                        d.rPromoPrice != "" &&
                        d.rPrice != ""
                      ) {
                        // type promotion
                        $priceArea.addClass("type-promotion");
                        $priceArea
                          .find(".purchase-price .price .number")
                          .text(
                            changeFormatFullPrice(
                              d.rPromoPrice,
                              d.rPromoPriceCent
                            )
                          );
                        $priceArea
                          .find(".product-price .price .number")
                          .text(changeFormatFullPrice(d.rPrice, d.rPriceCent));
                        //[Start] LGEDE-1151 "has-uvp" 추가
                        if (
                          $priceArea.find(".product-price .price.has-uvp")
                            .length > 0
                        )
                          $priceArea
                            .find(".product-price .price.has-uvp .number")
                            .text(pricePromo);
                        //[End] LGEDE-1151
                        $priceArea
                          .find(".product-price .legal")
                          .html(
                            d.discountMsg == null
                              ? ""
                              : d.discountMsg
                                  .replace(/&lt;/gi, "<")
                                  .replace(/&gt;/gi, ">")
                          ); // LGEIS-229 change how discounts are shown
                      } else {
                        if (
                          modelSwicher.bizType == "B2B" &&
                          d.obsLoginFlag != "Y"
                        ) {
                          // PJTB2BOBS-1
                          if (d.rPrice != null && d.rPrice != "") {
                            // type b2b
                            $priceArea.addClass("type-msrp");
                            $priceArea
                              .find(".purchase-price .price .number")
                              .text(
                                changeFormatFullPrice(d.rPrice, d.rPriceCent)
                              );
                          } else {
                            $priceArea.addClass("type-none");
                          }
                        } else {
                          if (d.rPrice != null && d.rPrice != "") {
                            // type default
                            $priceArea.addClass("type-default");

                            /* LGEIS-87 : 20200717 modify */
                            var fixSiblingPrice = $("#_fixSiblingPrice").val();
                            if (fixSiblingPrice == "Y") {
                              var currencyPosition =
                                $("#_currencyPosition").val();
                              var currnecySymbol = $("#_currnecySymbol").val();

                              if (
                                !!$priceArea.find(
                                  ".purchase-price .price .number"
                                ).length
                              ) {
                                $priceArea
                                  .find(".purchase-price .price .number")
                                  .text(
                                    changeFormatFullPrice(
                                      d.rPrice,
                                      d.rPriceCent
                                    )
                                  );
                              } else {
                                var tempHTML =
                                  '<div class="purchase-price"><div class="price">';

                                tempHTML +=
                                  currencyPosition == "L"
                                    ? '<span class="unit">' +
                                      currnecySymbol +
                                      '</span><span class="number"></span>'
                                    : '<span class="number"></span><span class="unit">' +
                                      currnecySymbol +
                                      "</span>";
                                tempHTML += "</div></div>";

                                $priceArea.append(tempHTML);
                                $priceArea
                                  .find(".purchase-price .price .number")
                                  .text(
                                    changeFormatFullPrice(
                                      d.rPrice,
                                      d.rPriceCent
                                    )
                                  );
                              }
                            } else {
                              $priceArea
                                .find(".purchase-price .price .number")
                                .text(
                                  changeFormatFullPrice(d.rPrice, d.rPriceCent)
                                );
                            }
                            /*// LGEIS-87 : 20200717 modify */
                          } else {
                            $priceArea.addClass("type-none");
                          }
                        }
                      }
                      // PJTOBS-32 Start
                      if (ISVIP) $priceArea.addClass("vip-price-area");
                      //PJTLIMITQTY_EXTEND
                      var limitSaleConditionFlag =
                        d.vipPriceFlag == "N" &&
                        d.obsLimitSale == "Y" &&
                        d.limitSaleUseFlag == "Y"
                          ? "Y"
                          : "N";
                      if (d.vipPriceFlag == "Y") {
                        var priceOrg = changeFormatFullPrice(
                          d.rPrice,
                          d.rPriceCent
                        );
                        var pricePromo = changeFormatFullPrice(
                          d.rPromoPrice,
                          d.rPromoPriceCent
                        );
                        var legal =
                          d.discountMsg == null
                            ? ""
                            : d.discountMsg
                                .replace(/&lt;/gi, "<")
                                .replace(/&gt;/gi, ">"); // LGEIS-229 change how discounts are shown
                        var vipPriceText = d.productMessages.vipPriceMessage
                          ? d.productMessages.vipPriceMessage
                          : "";
                        //LGEMS-432 Start
                        if (
                          COUNTRY_CODE.toLowerCase() == "mx" &&
                          "B2B" == $(".navigation").attr("data-obs-group")
                        ) {
                          vipPriceText = d.productMessages.b2bVipPriceMessage
                            ? d.productMessages.b2bVipPriceMessage
                            : "";
                        }
                        //LGEMS-432 End
                        var previousPriceText = d.productMessages
                          .previousPriceText
                          ? d.productMessages.previousPriceText
                          : "";
                        var emiMsgText =
                          d.obsEmiMsgFlag == "Y" && d.emiMsg != null
                            ? d.emiMsg
                            : "";

                        // LGEPL-697 Start
                        setVipPrice(
                          $priceArea,
                          priceOrg,
                          pricePromo,
                          legal,
                          vipPriceText,
                          previousPriceText,
                          d.modelId + "/" + "model-switcher.js",
                          emiMsgText,
                          d.afterPay,
                          limitSaleConditionFlag,
                          d.limitSaleTitle
                        );
                        // LGEPL-697 End
                      } else if (
                        SIGN_IN_STATUS == "Y" &&
                        d.emiMemberMsg != null &&
                        d.emiMemberMsg != "" &&
                        $(".GPC0007,.GPC0009").length > 0
                      ) {
                        //LGCOMSM-51 START
                        setInstallmentMember($priceArea, d.emiMemberMsg);
                        //LGCOMSM-51 END
                      }
                      // PJTOBS-32 End
                      if ($(".GPC0007,.GPC0026,.GPC0132,.GPC0009").length > 0) {
                        if (
                          $priceArea.siblings(
                            ".price-vip-Installment,.price-pdp-Installment"
                          ).length > 0
                        ) {
                          $priceArea.removeClass("vip-price-area");
                        }
                      }
                    }
                    // Promotion text
                    // LGEDE-933 Start
                    if (d.promotionText != null && d.promotionText != "") {
                      $item
                        .find(".promotion-text")
                        .html(
                          "<p class='info-txt'><span>" +
                            d.promotionText +
                            "</span></p>"
                        );
                    } else {
                      $item.find(".promotion-text").html("");
                    }
                    $item.find(".promotion-text").addClass("box-type");
                    // LGEDE-933 End

                    // LGEPL-80 START
                    // LGEGMC-2592
                    var externalLinkTarget = "";
                    if (
                      d.externalLinkTarget != null &&
                      d.externalLinkTarget != "" &&
                      $("html").attr("data-countrycode") == "it"
                    ) {
                      externalLinkTarget = d.externalLinkTarget.toLowerCase();
                      if (externalLinkTarget == "self") {
                        externalLinkTarget = "_self";
                      } else {
                        externalLinkTarget = "_blank";
                      }
                    }
                    // LGEDE-933 Start
                    var promotionLinkHtml =
                      "<p class='info-txt'><a href='" +
                      d.promotionLinkUrl +
                      "' target = '" +
                      externalLinkTarget +
                      "' >" +
                      d.promotionText +
                      "</a></p>";
                    // LGEDE-933 End
                    if (
                      d.promotionLinkUrl != null &&
                      d.promotionLinkUrl != ""
                    ) {
                      $item.find(".promotion-text").empty();
                      $item
                        .find(".promotion-text")
                        .append($(promotionLinkHtml));
                    }

                    var opensTarget = $("#opensTarget").val();
                    if (d.externalLinkTarget && d.externalLinkTarget == "New") {
                      $item
                        .find(".promotion-text a")
                        .attr("target", "_blank")
                        .attr("title", opensTarget);
                    }
                    // LGEPL-80 END

                    // PJTOBS 20200707 Start
                    var $stockArea = $item.find(".stock-area");
                    if ($stockArea.length > 0) {
                      //PJTLIMITQTY_EXTEND
                      if (d.reStockAlertFlag == "Y") {
                        if (
                          /*$('.GPC0007,.GPC0009').length>0 &&*/ d.limitSaleUseFlag ==
                            "Y" &&
                          d.obsLimitSale == "Y" &&
                          d.obsInventoryFlag != "Y"
                        ) {
                          $stockArea
                            .addClass("out-of-stock")
                            .html(
                              ' <span class="icon" aria-hidden="true"></span> <span class="text">' +
                                d.productMessages.limitSaleSoldOutText +
                                "</span>"
                            );
                        } else {
                          $stockArea
                            .addClass("out-of-stock")
                            .html(
                              ' <span class="icon" aria-hidden="true"></span> <span class="text">' +
                                d.productMessages.outOfStockText +
                                "</span>"
                            );
                        }
                      } else {
                        if (
                          /*$('.GPC0007,.GPC0009').length>0 &&*/ d.limitSaleUseFlag ==
                            "Y" &&
                          d.obsLimitSale == "Y" &&
                          d.obsInventoryFlag != "Y"
                        ) {
                          $stockArea
                            .addClass("out-of-stock")
                            .html(
                              ' <span class="icon" aria-hidden="true"></span> <span class="text">' +
                                d.productMessages.limitSaleSoldOutText +
                                "</span>"
                            );
                        } else {
                          $stockArea.removeClass("out-of-stock").empty();
                        }
                      }
                    }
                    // PJTOBS 20200707 End

                    //PJTLIMITQTY-1 START
                    //PJTLIMITQTY_EXTEND
                    // LGEDE-865 Start : OBS, .COM 태그 동시 출력 플래그 추가
                    if (d.obsComTagShowFlag == "Y") {
                      // LGEDE-865
                      if (
                        /*$('.GPC0007,.GPC0009').length>0 &&*/ ((d.limitSaleUseFlag ==
                          "Y" &&
                          d.obsLimitSale == "Y") ||
                          d.obsPreOrderFlag == "Y" ||
                          d.obsPreOrderRSAFlag == "Y") &&
                        $item.find(".tag-content p").length > 0
                      ) {
                        if (d.vipPriceFlag != "Y") {
                          $item
                            .find(".price-vip-Installment .price-vip")
                            .text(d.limitSaleTitle);
                        }
                      }
                      //PJTLIMITQTY_EXTEND
                      if (
                        ((d.limitSaleUseFlag == "Y" && d.obsLimitSale == "Y") ||
                          d.obsPreOrderFlag == "Y" ||
                          d.obsPreOrderRSAFlag == "Y") &&
                        $item.find(".tag-content span").length > 0 &&
                        $item.find(".tag-content p").length == 0
                      ) {
                        if (d.vipPriceFlag != "Y") {
                          $item
                            .find(".price-vip-Installment .price-vip")
                            .text(d.limitSaleTitle);
                        }
                      }
                      //PJTLIMITQTY-1 END
                    } else {
                      // 기존 로직
                      if (
                        /*$('.GPC0007,.GPC0009').length>0 &&*/ ((d.limitSaleUseFlag ==
                          "Y" &&
                          d.obsLimitSale == "Y") ||
                          d.obsPreOrderFlag == "Y" ||
                          d.obsPreOrderRSAFlag == "Y") &&
                        $item.find(".tag-content p").length > 0
                      ) {
                        $item.find(".tag-content p").addClass("tag-imp");
                        if (d.vipPriceFlag != "Y") {
                          $item
                            .find(".price-vip-Installment .price-vip")
                            .text(d.limitSaleTitle);
                        }
                      }
                      //PJTLIMITQTY_EXTEND
                      if (
                        ((d.limitSaleUseFlag == "Y" && d.obsLimitSale == "Y") ||
                          d.obsPreOrderFlag == "Y" ||
                          d.obsPreOrderRSAFlag == "Y") &&
                        $item.find(".tag-content span").length > 0 &&
                        $item.find(".tag-content p").length == 0
                      ) {
                        $item.find(".tag-content span").addClass("flag-imp");
                        if (d.vipPriceFlag != "Y") {
                          $item
                            .find(".price-vip-Installment .price-vip")
                            .text(d.limitSaleTitle);
                        }
                      }
                      //PJTLIMITQTY-1 END
                      //LGEDE-865 End
                    }

                    // PJTQUICKWIN
                    if (productType == "card") {
                      $item
                        .find(".area-top .tag-box")
                        .find('[data-user-type=""]')
                        .removeClass("d-none");
                      $item
                        .find(".area-top .tag-box")
                        .find("[data-user-type=ALL]")
                        .removeClass("d-none");
                      if (SIGN_IN_STATUS == "Y" && ISVIP) {
                        $item
                          .find(".area-top .tag-box")
                          .find("[data-user-type=VIP]")
                          .removeClass("d-none");
                      } else {
                        $item
                          .find(".area-top .tag-box")
                          .find("[data-user-type=NON_VIP]")
                          .removeClass("d-none");
                      }
                    } else {
                      //LGEDE-354 start
                      $item
                        .find(".tag-content")
                        .find('[data-user-type=""]')
                        .removeClass("d-none");
                      $item
                        .find(".tag-content")
                        .find("[data-user-type=ALL]")
                        .removeClass("d-none");
                      if (SIGN_IN_STATUS == "Y" && ISVIP) {
                        $item
                          .find(".tag-content")
                          .find("[data-user-type=VIP]")
                          .removeClass("d-none");
                        /* LGEDE-422 Start //Non-vip and Non-login */
                      } else {
                        $item
                          .find(".tag-content")
                          .find("[data-user-type=NON_VIP]")
                          .removeClass("d-none");
                      }
                      /* LGEDE-422 End */
                      //LGEDE-354 end
                    }

                    //LGEAU-787 START
                    if (d.preOrderTagEnableFlag == "Y") {
                      $item.find(".tag-content").empty();
                    }
                    //LGEAU-787 END

                    // PJTQUICKWIN 20220225 START - add
                    if (productType == "card") {
                      // card type (아래 정의한 버튼 외에는 PLP에서 사용하지 않음)
                      // hidden 클래스가 들어가면 해당 버튼 보이지 않음.

                      // Get Stock Alert  (bottom area - 미출력시 해당 버튼을 지워야 함)
                      if ($item.find("a.re-stock-alert").length > 0) {
                        if (!d.reStockAlertFlag || d.reStockAlertFlag != "Y") {
                          $item.find("a.re-stock-alert").addClass("hidden");
                        } else {
                          $item.find("a.re-stock-alert").removeClass("hidden");
                        }
                      }

                      // Add to Cart (bottom area - 미출력시 해당 버튼을 지워야 함)
                      if (d.addToCartFlag == "Y") {
                        // LGEIN-125, LGEIN-155, LGEVN-80
                        if (d.obsBuynowFlag == "Y") {
                          // Buy now 버튼 사용하지 않음
                          // 통합 OBS
                          // var buynow = $('#buynow').val();
                          // $item.find('a.add-to-cart').removeClass('hidden').data('model-id', d.modelId).attr('href', d.modelUrlPath).text(buynow).removeAttr('target, title');
                          $item.find("a.add-to-cart").addClass("hidden");
                        } else {
                          // 통합 OBS
                          $item
                            .find("a.add-to-cart")
                            .removeClass("hidden")
                            .attr("data-model-id", d.modelId)
                            .attr("href", "#")
                            .text(d.productMessages.addToCartBtnNm)
                            .attr("role", "button")
                            .removeAttr("target title");
                        }
                      } else if (d.addToCartFlag == "S") {
                        // Standalone OBS
                        $item
                          .find("a.add-to-cart")
                          .removeClass("hidden")
                          .attr("data-model-id", d.modelId)
                          .attr("href", "#")
                          .text(d.productMessages.addToCartBtnNm)
                          .attr("role", "button")
                          .removeAttr("target title");
                      } else {
                        $item.find("a.add-to-cart").addClass("hidden");
                      }

                      // Delivery & Installation  (bottom area - 미출력시 해당 버튼을 지워야 함)
                      if (
                        d.installationFlag == "Y" &&
                        d.installationFlag != null &&
                        d.installationFlag != ""
                      ) {
                        $item.find("js-installration").removeClass("hidden");
                      } else {
                        $item.find("js-installration").addClass("hidden");
                      }

                      // Book online (bottom area - 미출력시 해당 버튼을 지워야 함)

                      // Inquiry to buy (bottom area - 미출력시 해당 버튼을 지워야 함)
                      if (
                        d.inquiryToBuyFlag == "Y" &&
                        d.inquiryToBuyUrl != null &&
                        d.inquiryToBuyUrl != ""
                      ) {
                        $item
                          .find("a.inquiry-to-buy")
                          .removeClass("hidden")
                          .attr("href", d.inquiryToBuyUrl)
                          .text(d.productMessages.inquiryToBuyBtnNm);
                      } else {
                        $item.find("a.inquiry-to-buy").addClass("hidden");
                      }

                      // Where to buy (top area - 미출력시 상위 li를 지워야 함)
                      if (
                        d.whereToBuyFlag == "Y" &&
                        d.whereToBuyUrl != null &&
                        d.whereToBuyUrl != ""
                      ) {
                        // go to pdp page
                        $item
                          .find("a.where-to-buy")
                          .attr("href", d.whereToBuyUrl)
                          .text(d.productMessages.whereToBuyBtnNm)
                          .parent()
                          .removeClass("hidden");
                        $item
                          .find("a.where-to-buy")
                          .parent()
                          .removeAttr("target title");
                      } else if (
                        d.wtbExternalLinkUseFlag == "Y" &&
                        d.wtbExternalLinkUrl != null &&
                        d.wtbExternalLinkUrl != "" &&
                        d.wtbExternalLinkName != null &&
                        d.wtbExternalLinkName != ""
                      ) {
                        // go to external link
                        $item
                          .find("a.in-buynow:not(.add-to-cart)")
                          .attr("href", d.wtbExternalLinkUrl)
                          .text(d.wtbExternalLinkName)
                          .attr("data-link-name", "buy_now")
                          .removeAttr("data-sc-item")
                          .parent()
                          .removeClass("hidden");
                        if (d.wtbExternalLinkSelfFlag == "Y") {
                          $item
                            .find("a.in-buynow:not(.add-to-cart)")
                            .removeAttr("target title");
                        } else {
                          $item
                            .find("a.in-buynow:not(.add-to-cart)")
                            .attr("target", "_blank")
                            .attr("title", productMessages.btnNewLinkTitle);
                        }
                      } else {
                        $item
                          .find("a.where-to-buy")
                          .parent()
                          .addClass("hidden");
                      }

                      // Find a dealer  (top area - 미출력시 상위 li를 지워야 함)
                      if (
                        d.findTheDealerFlag == "Y" &&
                        d.findTheDealerUrl != null &&
                        d.findTheDealerUrl != ""
                      ) {
                        $item
                          .find("a.find-a-dealer")
                          .attr("href", d.findTheDealerUrl)
                          .text(d.productMessages.findTheDealerBtnNm)
                          .parent()
                          .removeClass("hidden");
                      } else {
                        $item
                          .find("a.find-a-dealer")
                          .parent()
                          .addClass("hidden");
                      }

                      // LGEPL-799 Start PLP(GPC0007) OBS subscribe 박스 추가
                      // LGCOMPL-46 Start
                      var obsConvertSubscriptionEmAreaHtml = "";
                      if (
                        d.obsSubscriptionEnableFlag != null &&
                        d.obsSubscriptionEnableFlag == "Y"
                      ) {
                        var subscriptionCompSize = $(
                          "input[name='obsSubscriptionCtaCostText1']"
                        ).length;
                        var currencyPosition = "";
                        var currencySymbol = "";
                        var obsSubscriptionText1 = "";
                        var obsSubscriptionText2 = "";
                        if (subscriptionCompSize > 0) {
                          // 컴포넌트 1개 이상 있을 경우
                          currencyPosition = $("input[name=currencyPosition]")
                            .eq(0)
                            .val();
                          currencySymbol = $("input[name=currencySymbol]")
                            .eq(0)
                            .val();
                          obsSubscriptionText1 = $(
                            "input[name=obsSubscriptionCtaCostText1]"
                          )
                            .eq(0)
                            .val();
                          obsSubscriptionText2 = $(
                            "input[name=obsSubscriptionCtaCostText2]"
                          )
                            .eq(0)
                            .val();
                        }
                        var obsConvertSubscriptionMonthlyCostArea = "";
                        var obsConvertSubscriptionMonthlyCost =
                          changeFormatFullPrice(
                            d.obsConvertSubscriptionMonthlyCost,
                            d.obsConvertSubscriptionMonthlyCostCent
                          );
                        if (
                          d.obsConvertSubscriptionMonthlyCost != null &&
                          obsConvertSubscriptionMonthlyCost != "0"
                        ) {
                          if (currencyPosition != null) {
                            obsConvertSubscriptionMonthlyCostArea =
                              currencyPosition == "R"
                                ? obsConvertSubscriptionMonthlyCost +
                                  "" +
                                  currencySymbol
                                : currencyPosition == "L"
                                ? currencySymbol +
                                  "" +
                                  obsConvertSubscriptionMonthlyCost
                                : "";
                          }
                        }
                        if (d.obsSubscriptionDisclaimer != null)
                          obsConvertSubscriptionEmAreaHtml +=
                            d.obsSubscriptionDisclaimer;
                        obsConvertSubscriptionEmAreaHtml += "<em>";
                        obsConvertSubscriptionEmAreaHtml +=
                          obsConvertSubscriptionMonthlyCostArea;
                        obsConvertSubscriptionEmAreaHtml +=
                          obsSubscriptionText1;
                        obsConvertSubscriptionEmAreaHtml += " ";
                        obsConvertSubscriptionEmAreaHtml +=
                          d.obsSubscriptionMaxMonth != null
                            ? d.obsSubscriptionMaxMonth
                            : "";
                        obsConvertSubscriptionEmAreaHtml += " ";
                        obsConvertSubscriptionEmAreaHtml +=
                          obsSubscriptionText2;
                        obsConvertSubscriptionEmAreaHtml += "</em>";
                        $item
                          .find("a.subscribe-box")
                          .removeClass("d-none")
                          .attr("href", d.obsSubscriptionLandingPageUrl)
                          .attr("target", d.obsSubscriptionCtaLinkTarget);
                        $item
                          .find("a.subscribe-box span.sub-desc")
                          .html(obsConvertSubscriptionEmAreaHtml);
                      } else {
                        $item.find("a.subscribe-box").addClass("d-none");
                        $item
                          .find("a.subscribe-box span.sub-desc")
                          .html(obsConvertSubscriptionEmAreaHtml);
                      }
                      // LGCOMPL-46 End
                      // LGEPL-799 End
                    } else {
                      // default type

                      // Red button
                      // PJTOBS 20200706 Start
                      if (d.reStockAlertFlag == "Y") {
                        // re stock alert
                        /* LGEITF-217 : 20201215 modify */
                        $item
                          .find(".button a.re-stock-alert")
                          .addClass("active")
                          .attr("data-model-id", d.modelId)
                          .attr("href", "#modal_re_stock_alert")
                          .attr("data-sku", d.modelName)
                          .attr("data-model-name", d.modelName)
                          .attr(
                            "data-model-salesmodelcode",
                            d.salesModelCode + "." + d.salesSuffixCode
                          )
                          .attr("data-category-name", d.buName2)
                          .attr(
                            "data-sub-category-name",
                            nvl(d.buName3, "") || ""
                          )
                          .attr("data-super-category-name", d.superCategoryName)
                          .attr("data-model-year", d.modelYear)
                          .attr("data-model-suffixcode", d.salesSuffixCode)
                          .attr("data-bu", d.buName1);
                        /*// LGEITF-217 : 20201215 modify */
                        $item
                          .find(".button a.add-to-cart")
                          .removeClass("active");
                      } else {
                        $item
                          .find(".button a.re-stock-alert")
                          .removeClass("active");
                      }

                      // PJTOBS 20200706 End
                      // PJTSEARCH-1 modify
                      // LGEAU-787
                      if (d.obsPreOrderFlag == "Y") {
                        //PJTOBS/2020/PJTOBSB2E-6 GILS
                        if (d.obsBuynowFlag == "Y") {
                          if (d.preOrderTagEnableFlag == "Y") {
                            if (
                              $item
                                .find(".button a.add-to-cart")
                                .is("[data-keyword-search-url]")
                            ) {
                              $item
                                .find(".button a.add-to-cart")
                                .addClass("active")
                                .attr("data-model-id", d.modelId)
                                .attr("href", "#")
                                .attr("data-keyword-search-url", d.modelUrlPath)
                                .text(d.productMessages.customOrderBtnNm)
                                .removeAttr("target title role")
                                .addClass("pre-order in-buynow")
                                .attr(
                                  "data-obs-pre-order-start-date",
                                  d.obsPreOrderStartDate
                                )
                                .attr(
                                  "data-obs-pre-order-end-date",
                                  d.obsPreOrderEndDate
                                );
                            } else {
                              $item
                                .find(".button a.add-to-cart")
                                .addClass("active")
                                .attr("data-model-id", d.modelId)
                                .attr("href", d.modelUrlPath)
                                .text(d.productMessages.customOrderBtnNm)
                                .removeAttr("target title role")
                                .addClass("pre-order in-buynow")
                                .attr(
                                  "data-obs-pre-order-start-date",
                                  d.obsPreOrderStartDate
                                )
                                .attr(
                                  "data-obs-pre-order-end-date",
                                  d.obsPreOrderEndDate
                                );
                            }
                          } else {
                            if (
                              $item
                                .find(".button a.add-to-cart")
                                .is("[data-keyword-search-url]")
                            ) {
                              $item
                                .find(".button a.add-to-cart")
                                .addClass("active")
                                .attr("data-model-id", d.modelId)
                                .attr("href", "#")
                                .attr("data-keyword-search-url", d.modelUrlPath)
                                .text(d.productMessages.preOrderBtnNm)
                                .removeAttr("target title role")
                                .addClass("pre-order in-buynow")
                                .attr(
                                  "data-obs-pre-order-start-date",
                                  d.obsPreOrderStartDate
                                )
                                .attr(
                                  "data-obs-pre-order-end-date",
                                  d.obsPreOrderEndDate
                                );
                            } else {
                              $item
                                .find(".button a.add-to-cart")
                                .addClass("active")
                                .attr("data-model-id", d.modelId)
                                .attr("href", d.modelUrlPath)
                                .text(d.productMessages.preOrderBtnNm)
                                .removeAttr("target title role")
                                .addClass("pre-order in-buynow")
                                .attr(
                                  "data-obs-pre-order-start-date",
                                  d.obsPreOrderStartDate
                                )
                                .attr(
                                  "data-obs-pre-order-end-date",
                                  d.obsPreOrderEndDate
                                );
                            }
                          }
                        } else {
                          if (d.preOrderTagEnableFlag == "Y") {
                            $item
                              .find(".button a.add-to-cart")
                              .addClass("active")
                              .attr("data-model-id", d.modelId)
                              .attr("href", "#")
                              .text(d.productMessages.customOrderBtnNm)
                              .attr("role", "button")
                              .removeAttr("target title")
                              .addClass("pre-order")
                              .attr(
                                "data-obs-pre-order-start-date",
                                d.obsPreOrderStartDate
                              )
                              .attr(
                                "data-obs-pre-order-end-date",
                                d.obsPreOrderEndDate
                              );
                          } else {
                            $item
                              .find(".button a.add-to-cart")
                              .addClass("active")
                              .attr("data-model-id", d.modelId)
                              .attr("href", "#")
                              .text(d.productMessages.preOrderBtnNm)
                              .attr("role", "button")
                              .removeAttr("target title")
                              .addClass("pre-order")
                              .attr(
                                "data-obs-pre-order-start-date",
                                d.obsPreOrderStartDate
                              )
                              .attr(
                                "data-obs-pre-order-end-date",
                                d.obsPreOrderEndDate
                              );
                          }
                        }
                      } else if (d.addToCartFlag != "N") {
                        if (d.addToCartFlag == "Y") {
                          // LGEIN-125, LGEIN-155, LGEVN-80
                          if (d.obsBuynowFlag == "Y") {
                            // 통합 OBS
                            var buynow = $("#buynow").val();
                            //LGEGMC-1279 2021.03.12 LGEAU-424 start
                            //$item.find('.button a.add-to-cart').addClass('active').data('model-id', d.modelId).attr('href', d.modelUrlPath).text(buynow).removeAttr('target, title');
                            if ($item.find(".button a.in-buynow").length > 0) {
                              if (
                                $item
                                  .find(".button a.in-buynow")
                                  .is("[data-keyword-search-url]")
                              ) {
                                $item
                                  .find(".button a.in-buynow")
                                  .addClass("active")
                                  .attr("href", "#")
                                  .attr(
                                    "data-keyword-search-url",
                                    d.modelUrlPath
                                  )
                                  .text(buynow)
                                  .removeAttr("target title");
                              } else {
                                $item
                                  .find(".button a.in-buynow")
                                  .addClass("active")
                                  .attr("href", d.modelUrlPath)
                                  .text(buynow)
                                  .removeAttr("target title");
                              }
                              $item
                                .find(".button a.in-buynow")
                                .attr("data-model-id", d.modelId)
                                .attr("data-sku", d.modelName)
                                .attr(
                                  "data-model-salesmodelcode",
                                  d.salesModelCode + "." + d.salesSuffixCode
                                )
                                .attr("data-buname-one", d.buName1)
                                .attr("data-buname-two", d.buName2)
                                .attr(
                                  "data-buname-three",
                                  nvl(d.buName3, "") || ""
                                )
                                .attr("data-category-name", d.superCategoryName)
                                .attr("data-model-year", d.modelYear)
                                .attr("data-bu", d.buName1)
                                .attr("data-price", d.priceValue)
                                .attr("data-msrp", d.msrp);
                              //LGEGMC-1279 LGEAU-424 2021.03.12 end
                            } else {
                              if (
                                $item
                                  .find(".button a.add-to-cart")
                                  .is("[data-keyword-search-url]")
                              ) {
                                $item
                                  .find(".button a.add-to-cart")
                                  .addClass("in-buynow")
                                  .addClass("active")
                                  .attr("href", "#")
                                  .attr(
                                    "data-keyword-search-url",
                                    d.modelUrlPath
                                  )
                                  .text(buynow);
                              } else {
                                $item
                                  .find(".button a.add-to-cart")
                                  .addClass("in-buynow")
                                  .addClass("active")
                                  .attr("href", d.modelUrlPath)
                                  .text(buynow);
                              }
                              $item
                                .find(".button a.in-buynow")
                                .attr("data-model-id", d.modelId)
                                .attr("data-sku", d.modelName)
                                .removeAttr("role")
                                .attr(
                                  "data-model-salesmodelcode",
                                  d.salesModelCode + "." + d.salesSuffixCode
                                )
                                .attr("data-buname-one", d.buName1)
                                .attr("data-buname-two", d.buName2)
                                .attr(
                                  "data-buname-three",
                                  nvl(d.buName3, "") || ""
                                )
                                .attr("data-category-name", d.superCategoryName)
                                .attr("data-model-year", d.modelYear)
                                .attr("data-bu", d.buName1)
                                .attr("data-price", d.priceValue)
                                .attr("data-msrp", d.msrp)
                                .text(d.productMessages.buyNowBtnNm2);
                            }
                          } else {
                            // 통합 OBS
                            // LGEITF-231 ADD
                            $item
                              .find(".button a.add-to-cart")
                              .addClass("active")
                              .attr("data-model-id", d.modelId)
                              .attr("data-sku", d.modelName)
                              .attr(
                                "data-model-salesmodelcode",
                                d.salesModelCode + "." + d.salesSuffixCode
                              )
                              .attr("data-biztype", d.bizType)
                              .attr("data-buname-one", d.buName1)
                              .attr("data-buname-two", d.buName2)
                              .attr(
                                "data-buname-three",
                                nvl(d.buName3, "") || ""
                              )
                              .attr("data-category-name", d.superCategoryName)
                              .attr("data-price", priceValue)
                              .attr("data-msrp", d.msrp)
                              .attr("href", "#")
                              .text(d.productMessages.addToCartBtnNm)
                              .attr("role", "button")
                              .removeAttr("target title");
                          }
                        } else if (d.addToCartFlag == "S") {
                          // Standalone OBS
                          $item
                            .find(".button a.add-to-cart")
                            .addClass("active")
                            .attr("data-model-id", d.modelId)
                            .attr("data-sku", d.modelName)
                            .attr(
                              "data-model-salesmodelcode",
                              d.salesModelCode + "." + d.salesSuffixCode
                            )
                            .attr("data-biztype", d.bizType)
                            .attr("data-buname-one", d.buName1)
                            .attr("data-buname-two", d.buName2)
                            .attr("data-buname-three", nvl(d.buName3, "") || "")
                            .attr("data-category-name", d.superCategoryName)
                            .attr("data-price", priceValue)
                            .attr("data-msrp", d.msrp)
                            .attr("href", "#")
                            .text(d.productMessages.addToCartBtnNm)
                            .attr("role", "button")
                            .removeAttr("target title");
                        }
                      } else if (d.buyNowFlag == "Y" || d.buyNowFlag == "L") {
                        if (d.ecommerceTarget == "_blank") {
                          $item
                            .find(".button a.add-to-cart")
                            .addClass("active")
                            .attr("data-model-id", d.modelId)
                            .attr("href", d.buyNowUrl)
                            .text(d.productMessages.buyNowBtnNm)
                            .removeAttr("role")
                            .attr("target", "_blank")
                            .attr("title", d.productMessages.btnNewLinkTitle);
                        } else {
                          $item
                            .find(".button a.add-to-cart")
                            .addClass("active")
                            .attr("data-model-id", d.modelId)
                            .attr("href", d.buyNowUrl)
                            .text(d.productMessages.buyNowBtnNm)
                            .removeAttr("role")
                            .removeAttr("target title");
                        }
                        if (
                          $item
                            .find(".button a.add-to-cart")
                            .is("[data-keyword-search-url]")
                        ) {
                          $item
                            .find(".button a.add-to-cart")
                            .attr("href", "#")
                            .attr("data-keyword-search-url", d.buyNowUrl);
                        }
                        // 20200506 START 박지영 - flag 명 변경
                      } else if (d.resellerBtnFlag == "Y") {
                        // 20200506 END
                        if (
                          $item
                            .find(".button a.add-to-cart")
                            .is("[data-keyword-search-url]")
                        ) {
                          $item
                            .find(".button a.add-to-cart")
                            .addClass("active")
                            .attr("data-model-id", d.modelId)
                            .attr("href", "#")
                            .attr("data-keyword-search-url", d.resellerLinkUrl)
                            .text(d.productMessages.resellerBtnNm)
                            .removeAttr("role")
                            .attr("target", "_blank")
                            .attr("title", d.productMessages.btnNewLinkTitle);
                        } else {
                          $item
                            .find(".button a.add-to-cart")
                            .addClass("active")
                            .attr("data-model-id", d.modelId)
                            .attr("href", d.resellerLinkUrl)
                            .text(d.productMessages.resellerBtnNm)
                            .removeAttr("role")
                            .attr("target", "_blank")
                            .attr("title", d.productMessages.btnNewLinkTitle);
                        }
                      } else if (d.productSupportFlag == "Y") {
                        if (
                          $item
                            .find(".button a.add-to-cart")
                            .is("[data-keyword-search-url]")
                        ) {
                          $item
                            .find(".button a.add-to-cart")
                            .addClass("active")
                            .attr("data-model-id", d.modelId)
                            .attr("href", "#")
                            .attr(
                              "data-keyword-search-url",
                              d.productSupportUrl
                            )
                            .text(d.productMessages.productSupportBtnNm)
                            .removeAttr("role")
                            .removeAttr("target title");
                        } else {
                          $item
                            .find(".button a.add-to-cart")
                            .addClass("active")
                            .attr("data-model-id", d.modelId)
                            .attr("href", d.productSupportUrl)
                            .text(d.productMessages.productSupportBtnNm)
                            .removeAttr("role")
                            .removeAttr("target title");
                        }
                        //2021-09-29 LGEAU-424 Start
                      } else if (d.obsBuynowFlag == "N") {
                        $item
                          .find(".button a.add-to-cart")
                          .removeClass("in-buynow");
                        //2021-09-29 LGEAU-424 END
                      } else {
                        $item
                          .find(".button a.add-to-cart")
                          .removeClass("active");
                      }
                      // LGEUK-896 Start
                      if (
                        $item.find(".button a.recommended-products").length > 0
                      ) {
                        if (d.obsSellFlag != "Y") {
                          $item
                            .find(".button a.recommended-products")
                            .addClass("active")
                            .attr("data-model-id", d.modelId)
                            .attr("data-sku", d.modelName)
                            .attr("data-model-name", d.modelName)
                            .attr(
                              "data-model-salesmodelcode",
                              d.salesModelCode + "." + d.salesSuffixCode
                            )
                            .attr("data-category-name", d.superCategoryName)
                            .attr(
                              "data-sub-category-name",
                              nvl(d.buName3, "") || ""
                            )
                            .attr(
                              "data-super-category-name",
                              d.superCategoryName
                            )
                            .attr("data-buname-one", d.buName1)
                            .attr("data-buname-two", d.buName2)
                            .attr("data-buname-three", nvl(d.buName3, "") || "")
                            .attr("data-model-year", d.modelYear)
                            .attr("data-model-suffixcode", d.salesSuffixCode)
                            .attr("data-bu", d.buName1)
                            .attr("data-price", priceValue)
                            .attr("data-msrp", d.msrp);
                          $item
                            .find(".button a.recommended-products")
                            .addClass("active");
                        } else {
                          $item
                            .find(".button a.recommended-products")
                            .removeClass("active");
                        }
                      }
                      // LGEUK-896 End
                      // WTB btn
                      //LGEGMC-2202 START
                      var $wtbArea = "";
                      if ($item.find(".button a.where-to-buy").length > 0) {
                        if (d.obsBuynowFlag == "Y") {
                          $wtbArea = $item.find(
                            ".button .btn-outline-secondary.where-to-buy"
                          );
                        } else {
                          $wtbArea = $item.find(".button a.where-to-buy");
                        }
                      } else {
                        if (d.obsBuynowFlag == "Y") {
                          $wtbArea = $item.find(
                            ".button .btn-outline-secondary.in-buynow"
                          );
                        } else {
                          $wtbArea = $item.find(".button a.in-buynow");
                        }
                      }
                      if (
                        d.whereToBuyFlag == "Y" &&
                        d.whereToBuyUrl != null &&
                        d.whereToBuyUrl != ""
                      ) {
                        // go to pdp page
                        if ($wtbArea.is("[data-keyword-search-url]")) {
                          $wtbArea
                            .addClass("active")
                            .addClass("where-to-buy")
                            .attr("href", "#")
                            .attr("data-keyword-search-url", d.whereToBuyUrl)
                            .text(d.productMessages.whereToBuyBtnNm)
                            .attr("data-link-name", "where-to-buy")
                            .attr("data-sc-item", "where-to-buy")
                            .removeClass("in-buynow");
                        } else {
                          $wtbArea
                            .addClass("active")
                            .addClass("where-to-buy")
                            .attr("href", d.whereToBuyUrl)
                            .text(d.productMessages.whereToBuyBtnNm)
                            .attr("data-link-name", "where-to-buy")
                            .attr("data-sc-item", "where-to-buy")
                            .removeClass("in-buynow");
                        }
                        $wtbArea.removeAttr("target title");
                        //LGEGMC-1279 2021.03.12 start
                        $wtbArea
                          .attr("data-model-id", d.modelId)
                          .attr("data-sku", d.modelName)
                          .attr(
                            "data-model-salesmodelcode",
                            d.salesModelCode + "." + d.salesSuffixCode
                          )
                          .attr("data-buname-one", d.buName1)
                          .attr("data-buname-two", d.buName2)
                          .attr("data-buname-three", nvl(d.buName3, "") || "")
                          .attr("data-category-name", d.superCategoryName)
                          .attr("data-model-year", d.modelYear)
                          .attr("data-bu", d.buName1)
                          .attr("data-price", priceValue)
                          .attr("data-msrp", d.msrp);
                        //LGEGMC-1279 2021.03.12 end
                        // 20200410 START 박지영 - wtb external link 변경
                      } else if (
                        d.wtbExternalLinkUseFlag == "Y" &&
                        d.wtbExternalLinkUrl != null &&
                        d.wtbExternalLinkUrl != "" &&
                        d.wtbExternalLinkName != null &&
                        d.wtbExternalLinkName != ""
                      ) {
                        // go to external link
                        if ($wtbArea.is("[data-keyword-search-url]")) {
                          $wtbArea
                            .addClass("active")
                            .addClass("in-buynow")
                            .attr("href", "#")
                            .attr(
                              "data-keyword-search-url",
                              d.wtbExternalLinkUrl
                            )
                            .text(d.wtbExternalLinkName)
                            .attr("data-link-name", "buy_now")
                            .removeAttr("data-sc-item")
                            .removeClass("where-to-buy");
                        } else {
                          $wtbArea
                            .addClass("active")
                            .addClass("in-buynow")
                            .attr("href", d.wtbExternalLinkUrl)
                            .text(d.wtbExternalLinkName)
                            .attr("data-link-name", "buy_now")
                            .removeAttr("data-sc-item")
                            .removeClass("where-to-buy");
                        }
                        if (d.wtbExternalLinkSelfFlag == "Y") {
                          $wtbArea.removeAttr("target title");
                        } else {
                          $wtbArea
                            .attr("target", "_blank")
                            .attr("title", d.productMessages.btnNewLinkTitle);
                        }
                        // 20200410 END
                      } else {
                        $wtbArea.removeClass("active");
                      }
                      //LGEGMC-2202 END

                      //LGEEG-154
                      $buyNowUnionStoreBtn = "";
                      if (d.buyNowUnionStoreBtnFlag == "Y") {
                        $buyNowUnionStoreBtn = $item.find(
                          ".button a.buyNowUnionBtn"
                        );
                        $buyNowUnionStoreBtn.addClass("active");
                        $buyNowUnionStoreBtn.attr("data-url", d.obsPartnerUrl);
                      } else {
                        $item
                          .find(".button a.buyNowUnionBtn")
                          .removeClass("active");
                      }
                      // Find a dealer btn
                      if (
                        d.findTheDealerFlag == "Y" &&
                        d.findTheDealerUrl != null &&
                        d.findTheDealerUrl != ""
                      ) {
                        if (
                          $item
                            .find(".button a.find-a-dealer")
                            .is("[data-keyword-search-url]")
                        ) {
                          $item
                            .find(".button a.find-a-dealer")
                            .addClass("active")
                            .attr("href", "#")
                            .attr("data-keyword-search-url", d.findTheDealerUrl)
                            .text(d.productMessages.findTheDealerBtnNm)
                            .attr("data-model-id", d.modelId)
                            .attr("data-sku", d.modelName)
                            .attr("data-model-name", d.modelName)
                            .attr(
                              "data-model-salesmodelcode",
                              d.salesModelCode + "." + d.salesSuffixCode
                            )
                            .attr("data-category-name", d.buName2)
                            .attr(
                              "data-sub-category-name",
                              nvl(d.buName3, "") || ""
                            )
                            .attr(
                              "data-super-category-name",
                              d.superCategoryName
                            )
                            .attr("data-model-year", d.modelYear)
                            .attr("data-model-suffixcode", d.salesSuffixCode)
                            .attr("data-bu", d.buName1)
                            .attr("data-price", priceValue)
                            .attr("data-msrp", d.msrp);
                        } else {
                          $item
                            .find(".button a.find-a-dealer")
                            .addClass("active")
                            .attr("href", d.findTheDealerUrl)
                            .text(d.productMessages.findTheDealerBtnNm)
                            .attr("data-model-id", d.modelId)
                            .attr("data-sku", d.modelName)
                            .attr("data-model-name", d.modelName)
                            .attr(
                              "data-model-salesmodelcode",
                              d.salesModelCode + "." + d.salesSuffixCode
                            )
                            .attr("data-category-name", d.buName2)
                            .attr(
                              "data-sub-category-name",
                              nvl(d.buName3, "") || ""
                            )
                            .attr(
                              "data-super-category-name",
                              d.superCategoryName
                            )
                            .attr("data-model-year", d.modelYear)
                            .attr("data-model-suffixcode", d.salesSuffixCode)
                            .attr("data-bu", d.buName1)
                            .attr("data-price", priceValue)
                            .attr("data-msrp", d.msrp);
                        }
                      } else {
                        $item
                          .find(".button a.find-a-dealer")
                          .removeClass("active");
                      }
                      // inquiry to buy btn
                      if (
                        d.inquiryToBuyFlag == "Y" &&
                        d.inquiryToBuyUrl != null &&
                        d.inquiryToBuyUrl != ""
                      ) {
                        if (
                          $item
                            .find(".button a.inquiry-to-buy")
                            .is("[data-keyword-search-url]")
                        ) {
                          $item
                            .find(".button a.inquiry-to-buy")
                            .addClass("active")
                            .attr("href", "#")
                            .attr("data-keyword-search-url", d.inquiryToBuyUrl)
                            .text(d.productMessages.inquiryToBuyBtnNm)
                            .attr("data-model-id", d.modelId)
                            .attr("data-sku", d.modelName)
                            .attr("data-model-name", d.modelName)
                            .attr(
                              "data-model-salesmodelcode",
                              d.salesModelCode + "." + d.salesSuffixCode
                            )
                            .attr("data-category-name", d.buName2)
                            .attr(
                              "data-sub-category-name",
                              nvl(d.buName3, "") || ""
                            )
                            .attr(
                              "data-super-category-name",
                              d.superCategoryName
                            )
                            .attr("data-model-year", d.modelYear)
                            .attr("data-model-suffixcode", d.salesSuffixCode)
                            .attr("data-bu", d.buName1)
                            .attr("data-price", priceValue)
                            .attr("data-msrp", d.msrp);
                        } else {
                          $item
                            .find(".button a.inquiry-to-buy")
                            .addClass("active")
                            .attr("href", d.inquiryToBuyUrl)
                            .text(d.productMessages.inquiryToBuyBtnNm)
                            .attr("data-model-id", d.modelId)
                            .attr("data-sku", d.modelName)
                            .attr("data-model-name", d.modelName)
                            .attr(
                              "data-model-salesmodelcode",
                              d.salesModelCode + "." + d.salesSuffixCode
                            )
                            .attr("data-category-name", d.buName2)
                            .attr(
                              "data-sub-category-name",
                              nvl(d.buName3, "") || ""
                            )
                            .attr(
                              "data-super-category-name",
                              d.superCategoryName
                            )
                            .attr("data-model-year", d.modelYear)
                            .attr("data-model-suffixcode", d.salesSuffixCode)
                            .attr("data-bu", d.buName1)
                            .attr("data-price", priceValue)
                            .attr("data-msrp", d.msrp);
                        }
                      } else {
                        $item
                          .find(".button a.inquiry-to-buy")
                          .removeClass("active");
                      }
                    }

                    // compare
                    if ($item.find(".wishlist-compare").length) {
                      //PJTGADL-2
                      $item
                        .find(".wishlist-compare .js-compare")
                        .attr("data-model-id", d.modelId)
                        .attr("data-sku", d.modelName)
                        .attr("data-model-name", d.modelName)
                        .attr(
                          "data-model-salesmodelcode",
                          d.salesModelCode + "." + d.salesSuffixCode
                        )
                        .attr("data-category-name", d.buName2)
                        .attr(
                          "data-sub-category-name",
                          nvl(d.buName3, "") || ""
                        )
                        .attr("data-super-category-name", d.superCategoryName)
                        .attr("data-model-year", d.modelYear)
                        .attr("data-model-suffixcode", d.salesSuffixCode)
                        .attr("data-bu", d.buName1)
                        .attr("data-price", priceValue)
                        .attr("data-msrp", d.msrp);
                      if (getCookie(compareCookie.name) != undefined) {
                        if (
                          (d.modelId,
                          getCookie(compareCookie.name).indexOf(d.modelId) !=
                            -1)
                        ) {
                          // If compare cookie has this product
                          $item
                            .find(".wishlist-compare .js-compare")
                            .addClass("added");
                        } else {
                          $item
                            .find(".wishlist-compare .js-compare")
                            .removeClass("added");
                        }
                      } else {
                        $item
                          .find(".wishlist-compare .js-compare")
                          .removeClass("added");
                      }
                    }
                    // sibling target check
                    if (d.target && d.target.toUpperCase() == "SELF") {
                      $item.addClass("self");
                    } else {
                      $item.removeClass("self");
                    }
                    // adobe
                    if (
                      d.modelName != null &&
                      d.modelName != "" &&
                      d.modelName != "undefined"
                    ) {
                      $item
                        .find("a.visual")
                        .data("adobe-modelname", d.modelName);
                    } else {
                      $item.find("a.visual").data("adobe-modelname", "");
                    }
                    if (
                      d.salesModelCode != null &&
                      d.salesModelCode != "" &&
                      d.salesModelCode != "undefined"
                    ) {
                      $item
                        .find("a.visual")
                        .data("adobe-salesmodelcode", d.salesModelCode);
                    } else {
                      $item.find("a.visual").data("adobe-salesmodelcode", "");
                    }

                    $item
                      .find("a.visual")
                      .data(
                        "adobe-salessuffixcode",
                        d.salesSuffixCode || ""
                      ); /* LGEGMC-455 20200717 add */
                    // PJTSEARCH-1 modify
                    // ecorebate
                    //if($item.find('.rebate-box').length>0) {
                    //$item.find('.rebate-box').empty().html('<div class="product-rebate"><div class="ecorebates-div" data-modelId="'+d.modelId+'"></div></div>');
                    //if($.isFunction(runEcorebates)) runEcorebates();
                    //}
                    // for compare product page

                    // 20200326 START 박지영 : compare 처리
                    if (
                      $(".compare-wrap").length > 0 &&
                      $(".compare-sticky").length > 0
                    ) {
                      $item.find(".button").attr("data-model-id", modelNumber);
                      $("#categoryFilterForm").trigger("appended");
                    }
                    // 20200326 END
                    // PJTPLP-10 (황규하) wish 기능 추가 START
                    var $pdFav = $item.find(".pd-fav");
                    var $icoFav = $item.find(".ico-fav");
                    var $wishNum = $item.find(".wish-num");
                    $wishNum.text(d.wishTotalCnt);

                    //PJTGADL-2
                    $item
                      .find(".ico-fav")
                      .attr("data-model-id", d.modelId)
                      .attr("data-sku", d.modelName)
                      .attr("data-model-name", d.modelName)
                      .attr(
                        "data-model-salesmodelcode",
                        d.salesModelCode + "." + d.salesSuffixCode
                      )
                      .attr("data-category-name", d.buName2)
                      .attr("data-sub-category-name", nvl(d.buName3, "") || "")
                      .attr("data-super-category-name", d.superCategoryName)
                      .attr("data-model-year", d.modelYear)
                      .attr("data-model-suffixcode", d.salesSuffixCode)
                      .attr("data-bu", d.buName1)
                      .attr("data-price", priceValue)
                      .attr("data-msrp", d.msrp);

                    //sns
                    var domain = location.host;
                    var p = location.protocol + "//";
                    var linkUrl = p + domain + d.modelUrlPath;
                    var imageUrl = p + domain + d.mediumImageAddr;

                    $item.find("[data-url]").attr("data-url", linkUrl);
                    /* LGEITF-217 : 20201215 add */
                    $item
                      .find("a.re-stock-alert")
                      .attr("data-url", $("#reStockAlertUrl").val());
                    /*// LGEITF-217 : 20201215 add */
                    $item.find("[data-image]").attr("data-image", imageUrl);
                    $item
                      .find("[data-copy-url]")
                      .attr("data-copy-url", linkUrl);

                    var $dataProductId = $item.find("[data-product-id]");
                    $dataProductId.attr("data-product-id", d.modelId);
                    var $dataWishModelId = $item.find("[data-wish-model-id]");
                    $dataWishModelId.attr("data-wish-model-id", d.modelId);
                    $pdFav.removeClass("on");
                    $icoFav.removeClass("on");
                    if (d.myWishCnt == "Y") {
                      $pdFav.addClass("on");
                      $icoFav.addClass("on");
                      $icoFav.attr("aria-checked", "true");
                    } else {
                      $icoFav.attr("aria-checked", "false");
                      $icoFav.removeClass("on");
                      $pdFav.removeClass("on");
                    }

                    //LGEEG-154
                    $buyNowUnionStoreBtn = "";
                    if (d.buyNowUnionStoreBtnFlag == "Y") {
                      $buyNowUnionStoreBtn = $item.find(
                        ".button a.buyNowUnionBtn"
                      );
                      $buyNowUnionStoreBtn.addClass("active");
                      $buyNowUnionStoreBtn.attr("data-url", d.obsPartnerUrl);
                    } else {
                      $item
                        .find(".button a.buyNowUnionBtn")
                        .removeClass("active");
                    }

                    // LGEPL-799 Start PLP(GPC0007) OBS subscribe 박스 추가
                    // LGCOMPL-46
                    var obsConvertSubscriptionEmAreaHtml = "";
                    if (
                      d.obsSubscriptionEnableFlag != null &&
                      d.obsSubscriptionEnableFlag == "Y"
                    ) {
                      var subscriptionCompSize = $(
                        "input[name='obsSubscriptionCtaCostText1']"
                      ).length;
                      var currencyPosition = "";
                      var currencySymbol = "";
                      var obsSubscriptionText1 = "";
                      var obsSubscriptionText2 = "";
                      if (subscriptionCompSize > 0) {
                        // 컴포넌트 1개 이상 있을 경우
                        currencyPosition = $("input[name=currencyPosition]")
                          .eq(0)
                          .val();
                        currencySymbol = $("input[name=currencySymbol]")
                          .eq(0)
                          .val();
                        obsSubscriptionText1 = $(
                          "input[name=obsSubscriptionCtaCostText1]"
                        )
                          .eq(0)
                          .val();
                        obsSubscriptionText2 = $(
                          "input[name=obsSubscriptionCtaCostText2]"
                        )
                          .eq(0)
                          .val();
                      }
                      var obsConvertSubscriptionMonthlyCostArea = "";
                      var obsConvertSubscriptionMonthlyCost =
                        changeFormatFullPrice(
                          d.obsConvertSubscriptionMonthlyCost,
                          d.obsConvertSubscriptionMonthlyCostCent
                        );
                      if (
                        d.obsConvertSubscriptionMonthlyCost != null &&
                        obsConvertSubscriptionMonthlyCost != "0"
                      ) {
                        if (currencyPosition != null) {
                          obsConvertSubscriptionMonthlyCostArea =
                            currencyPosition == "R"
                              ? obsConvertSubscriptionMonthlyCost +
                                "" +
                                currencySymbol
                              : currencyPosition == "L"
                              ? currencySymbol +
                                "" +
                                obsConvertSubscriptionMonthlyCost
                              : "";
                        }
                      }
                      if (d.obsSubscriptionDisclaimer != null)
                        obsConvertSubscriptionEmAreaHtml +=
                          d.obsSubscriptionDisclaimer;
                      obsConvertSubscriptionEmAreaHtml += "<em>";
                      obsConvertSubscriptionEmAreaHtml +=
                        obsConvertSubscriptionMonthlyCostArea;
                      obsConvertSubscriptionEmAreaHtml += obsSubscriptionText1;
                      obsConvertSubscriptionEmAreaHtml += " ";
                      obsConvertSubscriptionEmAreaHtml +=
                        d.obsSubscriptionMaxMonth != null
                          ? d.obsSubscriptionMaxMonth
                          : "";
                      obsConvertSubscriptionEmAreaHtml += " ";
                      obsConvertSubscriptionEmAreaHtml += obsSubscriptionText2;
                      obsConvertSubscriptionEmAreaHtml += "</em>";
                      $item
                        .find("a.subscribe-box")
                        .removeClass("d-none")
                        .attr("href", d.obsSubscriptionLandingPageUrl)
                        .attr("target", d.obsSubscriptionCtaLinkTarget);
                      $item
                        .find("a.subscribe-box span.sub-desc")
                        .html(obsConvertSubscriptionEmAreaHtml);
                    } else {
                      $item.find("a.subscribe-box").addClass("d-none");
                      $item
                        .find("a.subscribe-box span.sub-desc")
                        .html(obsConvertSubscriptionEmAreaHtml);
                    }
                    // LGCOMPL-46
                    // LGEPL-799 End

                    /* LGETR-228 Start */
                    if (
                      d.recommendedRetailRriceInfo == "Y" &&
                      (!!d.rPromoPrice || !!d.rPrice)
                    ) {
                      $item.find(".recommended-retail-price").show();
                    } else {
                      $item.find(".recommended-retail-price").hide();
                    }
                    /* LGETR-228 End */

                    // PJTPLP-10 (황규하) wish 기능 추가 END

                    // LGENL-276, LGEITF-737, LGEDE-933
                    // promotion tag text
                    if (
                      $(e.currentTarget).closest(".GPC0007").length > 0 &&
                      $(".GPC0007.plp").attr("data-is-vip") != "true" &&
                      ($item.find(".button a.add-to-cart").hasClass("active") ||
                        $item
                          .find(".button a.re-stock-alert")
                          .hasClass("active")) &&
                      d.promotionTagTextFlag == "Y"
                    ) {
                      $item.find(".promotionTagText").removeClass("d-none");
                      $item.find(".promotionText").addClass("d-none");
                      $item
                        .find(".promotionTagText")
                        .find(".info-txt")
                        .removeClass("d-none");
                      $item
                        .find(".promotionText")
                        .find(".info-txt")
                        .addClass("d-none");
                    } else if (
                      $(e.currentTarget).closest(".GPC0007").length > 0
                    ) {
                      $item.find(".promotionTagText").addClass("d-none");
                      $item.find(".promotionText").removeClass("d-none");
                      $item
                        .find(".promotionTagText")
                        .find(".info-txt")
                        .addClass("d-none");
                      $item
                        .find(".promotionText")
                        .find(".info-txt")
                        .removeClass("d-none");
                    }
                  }
                }

                var $modelButtonEl = $(".GPC0007 .model-button .button");
                $modelButtonEl.addClass("only-button");
                $modelButtonEl.each(function () {
                  if ($(this).find("a.active").length > 1) {
                    $modelButtonEl.removeClass("only-button");
                    return;
                  }
                });
              },
              methodType
            );
          },
        },
        modelSwicher.itemSelector + " .model-group a"
      );

      var anchorList = [
        modelSwicher.itemSelector + ".self .model-name a",
        modelSwicher.itemSelector + ".self a.visual",
        modelSwicher.itemSelector + ".self a.btn.where-to-buy",
      ];
      $(modelSwicher.currentEl).on(
        {
          click: function (e) {
            e.preventDefault();
            var form = document.getElementById(modelSwicher.formId),
              id =
                $(e.currentTarget)
                  .closest(modelSwicher.itemSelector)
                  .find(".model-group .active")
                  .attr("href") != "#"
                  ? $(e.currentTarget)
                      .closest(modelSwicher.itemSelector)
                      .find(".model-group .active")
                      .attr("href")
                  : $(e.currentTarget)
                      .closest(modelSwicher.itemSelector)
                      .find(".model-group .active")
                      .attr("data-href");
            if (!form) {
              $("body").append(
                "<form action='' id='" +
                  modelSwicher.formId +
                  "' method='post'><input type='hidden' name='" +
                  modelSwicher.subModelId +
                  "'></form>"
              );
              form = document.getElementById(modelSwicher.formId);
            }
            form.action = e.currentTarget.href;
            form[modelSwicher.subModelId].value = id;
            if (e.ctrlKey || e.metaKey || e.shiftKey) form.target = "_blank";
            else form.target = "_self";
            form.submit();
          },
        },
        anchorList.join(",")
      );

      //LGEITF-231
      function nvl(str, defaultStr) {
        var check = str + "";
        var result = "";
        check = check.trim();
        if (
          check == "" ||
          check == null ||
          check == "null" ||
          check == "undefined"
        ) {
          result = defaultStr;
        } else {
          result = check;
        }
        return result;
      }
      //LGEITF-231

      $(".js-model-switcher").on(
        "click",
        ".js-model.self .rating a.bv_main_container",
        function (e) {
          e.preventDefault();
          var form = document.getElementById(modelSwicher.formId),
            id =
              $(e.currentTarget)
                .closest(modelSwicher.itemSelector)
                .find(".model-group .active")
                .attr("href") != "#"
                ? $(e.currentTarget)
                    .closest(modelSwicher.itemSelector)
                    .find(".model-group .active")
                    .attr("href")
                : $(e.currentTarget)
                    .closest(modelSwicher.itemSelector)
                    .find(".model-group .active")
                    .attr("data-href");
          if (!form) {
            $("body").append(
              "<form action='' id='" +
                modelSwicher.formId +
                "' method='post'><input type='hidden' name='" +
                modelSwicher.subModelId +
                "'></form>"
            );
            form = document.getElementById(modelSwicher.formId);
          }
          form.action = e.currentTarget.href;
          form[modelSwicher.subModelId].value = id;
          if (e.ctrlKey || e.metaKey || e.shiftKey) form.target = "_blank";
          else form.target = "_self";
          form.submit();
        }
      );
    },
  };
  modelSwicher.init();
});
var thumbnailLoop;
$(document).ready(function () {
  // 초기 로드 되는 페이지에는 js-thumbnail-loop이 없더라도,
  // filter나 plp-model-switcher.js에 의해 발생할 수 있기 때문에
  // 아래 1줄은 제거 함.
  //if(!document.querySelector('.js-thumbnail-loop')) return false;

  thumbnailLoop = {
    // 데스크탑용 스크립트는 제품 이미지가 들어가는 모든 화면에서 사용 가능함.
    // 데스크탑용 스크립트는 필터 및 페이징 등 ajax 호출 후 다시 실행하지 않아도 됨.
    // GPC0003, GPC0004, GPC0007 GPC0026, myLG>My Products
    // search result, search result all
    desktopList:
      "#resultProductList, .products-list-wrap, #resultAppendTarget, .search-result-products-wrap, .product-list-box, .business-product-list, .products-list-group, .products-list-group2, .products-box",
    // 모바일용 스크립트는 Carousel 하위에 Carousel을 생성할 수 없기 때문에, 사용 대상이 좀더 명확 해야 함.
    // 모바일용 스크립트는 필터 및 페이징 등 ajax 호출 후 다시 실행 해야 함.
    // 따라서 아래 mobileList는 ajax 호출시 변경되는 id값으로 넣고,
    // 호출 후 .visual안에 있는 .thumbnail-carousel를 제거하고, .trigger('thumbnailCarousel'); 실행 할 것.
    // 또한, 해당 스크립트가 추가될 .visual에는 position:relative;을 추가해 주어야 함.
    // GPC0007 (.GPC0007 #resultAppendTarget),
    // GPC0026 (.GPC0026 #resultAppendTarget),
    // myLG>My Products(.accessories-product #resultAppendTarget),
    // search result all - consumer (.search-result-view-all .product-list-box)
    // search result all - business (.search-result-view-all .business-product-list)
    // search result all (1 product) (.search-result-view-all .products-box)
    // search result - consumer (.search-result-products-wrap)
    // search result - business (.search-result-business-products-wrap)
    mobileList:
      ".GPC0007 #resultAppendTarget, .GPC0026 #resultAppendTarget, .accessories-product #resultAppendTarget, .search-result-view-all .product-list-box, .search-result-view-all .business-product-list, .search-result-view-all .products-box, .search-result-products-wrap, .search-result-business-products-wrap, .GPC0162 .product-list-box",
    interval: null,
    idx: 1,
    loop: function (img, imgList) {
      var src = imgList[thumbnailLoop.idx];
      if (imgList.length - 1 > thumbnailLoop.idx) {
        thumbnailLoop.idx++;
      } else {
        thumbnailLoop.idx = 1;
      }
      img.src = src;
    },
    hover: function (e) {
      var _img = e.currentTarget,
        imgList = _img.getAttribute("data-img-list").split(",");
      clearInterval(thumbnailLoop.interval);
      if (imgList.length > 1) {
        thumbnailLoop.interval = setInterval(function () {
          thumbnailLoop.loop(_img, imgList);
        }, 500); //LGEGMC-368 modify
      } else {
        //_img.src=imgList[0];
        _img.src = _img.getAttribute("data-src");
      }
    },
    blur: function (e) {
      var _img = e.currentTarget,
        imgList = _img.getAttribute("data-img-list").split(",");
      clearInterval(thumbnailLoop.interval);
      thumbnailLoop.idx = 1;
      //_img.src = imgList[0];
      _img.src = _img.getAttribute("data-src");
    },
    init: function () {
      if (
        $(".navigation").length > 0 &&
        $(".navigation").hasClass("mobile-device")
      ) {
        this.addEventForMobile();
      } else {
        this.addEventForDesktop();
      }
    },
    addEventForDesktop: function () {
      var _this = this;
      $(_this.desktopList).on(
        {
          "mouseenter focus": _this.hover,
          "mouseleave focusout": _this.blur,
        },
        ".js-thumbnail-loop"
      );
    },
    addEventForMobile: function () {
      var _this = this;
      $(_this.mobileList).each(function () {
        $(this).on({
          thumbnailCarousel: _this.mobileThumbnailCarousel,
        });
        $(this).trigger("thumbnailCarousel");
      });
    },
    mobileThumbnailCarousel: function (e) {
      var targetEl = $(e.currentTarget);
      setTimeout(function () {
        var imgs = targetEl.find("img[data-img-list]");
        imgs.each(function () {
          thumbnailLoop.mobileThumbnailCarouselSingle($(this), false);
        });
      }, 600); // Don't reduce this number.
    },
    mobileThumbnailCarouselSingle: function ($el, isModelSwitcher) {
      if (
        $(".navigation").length == 0 ||
        !$(".navigation").hasClass("mobile-device")
      ) {
        return false;
      }
      if (
        $el.closest(".slick-slider").length > 0 ||
        $el.closest(".visual").length == 0 ||
        $el.closest(".visual").find(".thumbnail-carousel").length > 0
      ) {
        return false;
      }
      if (isModelSwitcher) {
        // When clicking 'siblings' in the product list,
        // check if the changed image is a child element of this.mobileList
        var tmpList = thumbnailLoop.mobileList.split(",");
        var isPassed = false;
        for (i = 0; i < tmpList.length; i++) {
          if ($el.parents($.trim(tmpList[i])).length > 0) {
            isPassed = true;
          }
        }
        if (!isPassed) {
          return false;
        }
      }
      var imgEl = $el.attr("data-img-list")
        ? $el.attr("data-img-list")
        : $el.siblings("img.pc").attr("data-img-list");
      var imgList = imgEl.split(",");
      if (imgList.length > 1) {
        var defaultImg = $el.attr("data-src")
          ? $el.attr("data-src")
          : $el.attr("src");
        var html =
          '<div class="thumbnail-carousel"><div class="imglist"><img src="' +
          defaultImg +
          '" alt="" /></div>';
        var max = 5;
        if (defaultImg == imgList[0]) max = 6;
        var len = imgList.length <= max ? imgList.length : max;
        for (var i = 0; i < len; i++) {
          if (defaultImg != imgList[i]) {
            html +=
              '<div class="imglist"><img src="' +
              imgList[i] +
              '" alt="" /></div>';
          }
        }
        html += "</div>";
        if ($el.closest(".visual").find(".thumbnail-carousel").length == 0) {
          // append
          $(".visual").addClass("hasThumbnail");
          $el
            .closest(".visual")
            .append(html)
            .find(".thumbnail-carousel")
            .slick({
              arrows: false,
              dots: true,
            });
          if ($(".btn-listChange").hasClass("act")) {
            console.log("slick refresh");
            $(".thumbnail-carousel").slick("refresh");
          }
        } else {
        }
      }
    },
  };
  thumbnailLoop.init();
});
