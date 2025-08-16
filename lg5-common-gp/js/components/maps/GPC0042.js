$(document).ready(function () {
  if (!document.querySelector(".GPC0042")) return false;
  $(".GPC0042").find("picture source").remove();
  $(".GPC0042")
    .find(".inside-component .component-wrap")
    .wrap('<div class="inside-inner"></div>');
  var countryCode = document
    .getElementsByTagName("html")[0]
    .getAttribute("data-countrycode"); // LGEAE-221
  var component_01 = function () {
    var p = component_01.prototype;

    p.init = function () {
      this.eventOn();
      this.addAriaDescribedby();
      //LGEAE-221 add
      if (countryCode == "ae" || countryCode == "ae_ar") {
        this.addAACode();
      }
    };

    p.eventOn = function () {
      // accordian open event
      this.binderElem.$open.on("click", function (e) {
        e.preventDefault();

        // open
        $(this).closest(".component").children(".desc").addClass("bg-gray");
        $(this)
          .closest(".list-btn-area")
          .parents()
          .find(".more-content")
          .addClass("open")
          .slideDown(400);

        // find scroll line
        var tg = $(this).closest(".component"),
          adjustOption =
            $(".GPC0011").length > 0
              ? Math.round($(".GPC0011").outerHeight())
              : 0,
          contTop = tg.find(".more-content").offset().top,
          contAdjustTop = Math.round(contTop - adjustOption);

        // scrolling
        p.scrolling(contAdjustTop);
      });

      // accordian close event
      this.binderElem.$close.on("click", function (e) {
        e.preventDefault();
        // close
        $(this).closest(".component").children(".desc").removeClass("bg-gray");
        $(this).closest(".more-content").removeClass("open").slideUp(400);
        // find scroll line
        var tg = $(this).closest(".component");
        if (tg.find(".folding-slider").length > 0) {
          var sl = $(tg).find(".folding-slider");
          p.unSlider(sl);
          sl.parents(".GPC0042")
            .find(".list-btn-area a.toggle")
            .removeClass("show")
            .focus();
        } else {
          tg.find(".list-btn-area .toggle").removeClass("show").focus();
        }
      });

      // accordian toggle event
      this.binderElem.$toggle.on("click", function (e) {
        e.preventDefault();
        $(this).toggleClass("show");
        if ($(this).hasClass("show")) {
          $(this).closest(".component").children(".desc").addClass("bg-gray");
          $(this)
            .closest(".list-btn-area")
            .parents(".cont-wrap")
            .find(".more-content")
            .addClass("open")
            .slideDown(400);
          var tg = $(this).closest(".component");
          var sl = $(tg).find(".folding-slider");
          setTimeout(function () {
            p.slider(sl);
          }, 400);
        } else {
          $(this)
            .closest(".component")
            .children(".desc")
            .removeClass("bg-gray");
          $(this)
            .closest(".list-btn-area")
            .parents(".cont-wrap")
            .find(".more-content")
            .removeClass("open")
            .slideUp(400);
          var tg = $(this).closest(".component");
          var sl = $(tg).find(".folding-slider");
          p.unSlider(sl);
        }
      });

      // scroll event
      $(window).on("scroll", function () {
        var scrollPos = $(window).scrollTop(),
          lineCheck = 1200; // temporary

        p.gnbStickToLine(scrollPos > lineCheck);
      });
    };

    p.theElem = $('div[class*="GPC0042"]');

    p.binderElem = {
      $open: p.theElem.find(".list-btn-area").children(".more"),
      $close: p.theElem.find(".in-list-btn-area").children(".in-close"),
      $toggle: p.theElem.find(".list-btn-area").children(".toggle"),
    };

    p.scrolling = function (st) {
      $("html, body").stop().animate(
        {
          scrollTop: st,
        },
        400
      );
    };

    p.gnbStickToLine = function (condition) {
      if (condition) {
        $(".temp-gnb").addClass("fixed");
      } else {
        $(".temp-gnb").removeClass("fixed");
      }
    };

    p.addAriaDescribedby = function () {
      var waNumber = 0;
      $(".GPC0042").each(function () {
        var $target;
        if (
          $(this).find(".cont-head .title") &&
          !$(this).find(".cont-head .title").is(":empty")
        ) {
          $target = $(this).find(".cont-head .title");
        }
        if ($target) {
          $target.attr("id", "waGPC0042_" + waNumber);
          $(this)
            .find(".cont-head .btn-area-wrap a.btn")
            .attr("aria-describedby", "waGPC0042_" + waNumber);
          $(this)
            .find(".cont-head .btn-area-wrap a.link-text")
            .attr("aria-describedby", "waGPC0042_" + waNumber);
          waNumber++;
        }

        $(this)
          .find(".list-container .list")
          .each(function () {
            var $target;
            if (
              $(this).find(".title") &&
              !$(this).find(".title").is(":empty")
            ) {
              $target = $(this).find(".title");
            }
            if ($target) {
              $target.attr("id", "waGPC0042_" + waNumber);
              $(this)
                .find("a.btn")
                .attr("aria-describedby", "waGPC0042_" + waNumber);
              waNumber++;
            }
          });
      });
    };
    //LGEAE-221 START
    p.addAACode = function () {
      var aaTagUseLocation = window.location.href;
      if (aaTagUseLocation.indexOf("promotion-offers-uae/sign-up") > -1) {
        $(" .cont-wrap .visual-area a").attr(
          "adobe-click",
          "uae-sign-up-campaign_start"
        );

        _dl.page_name.promotion_name = "GF_sign-up_campaign";
        _dl.page_name.microsite_name = "GF_sign-up_campaign";
        _dl.language_code = "ar";
      }
    };
    //LGEAE-221 ENDD
    //	}
    //}
    //LGEAE-221 END

    p.slider = function (sl) {
      sl.slick({
        dots: true,
        arrows: true,
        adaptiveHeight: true,
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: carouselOptions.squarePrev,
        nextArrow: carouselOptions.squareNext,
        responsive: [
          {
            breakpoint: 640,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              arrows: false,
            },
          },
        ],
      });
    };

    p.unSlider = function (sl) {
      sl.slick("unslick");
    };

    p.init();
  };
  component_01();
  $(".GPC0042").each(function () {
    var $iconblock = $(this).find(".GPC0088");
    if ($iconblock.length) {
      var componentCarouselSimple = {
        $el: null,
        init: function () {
          this.$el = $iconblock;
          this.$el
            .find(".spec-list")
            .not(".none-slide")
            .not(".slick-initialized")
            .each(function () {
              if ($(this).find(".item").length > 1) {
                componentCarouselSimple.runSlick($(this));
                $(this).parents(".GPC0088").addClass("bindSlick");
              }
            });
          this.$el.find(".spec-list.none-slide").each(function () {
            if ($(this).find(".item").length > 2) {
              $(this).removeClass("none-slide");
              componentCarouselSimple.runSlick($(this));
              $(this).parents(".GPC0088").addClass("bindSlick");
            } else {
              $(this).addClass("none-slide");
            }
          });
        },
        runSlick: function ($obj) {
          $obj.slick({
            appendDots: $obj
              .siblings(".slick-indicator")
              .find(".slick-dot-wrap"),
            responsive: [
              {
                breakpoint: 9999,
                settings: "unslick",
              },
              {
                breakpoint: 767,
                settings: {
                  infinite: false,
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  arrows: false,
                  dots: true,
                },
              },
            ],
          });
          $obj.on("afterChange", function (event, slick, currentSlide) {
            //console.log('..');
          });
          $obj.on("breakpoint", function (event, slick, breakpoint) {
            // console.log('breakpoint ' +  breakpoint);
            if (breakpoint === 767) {
              eventStopOn();
            }
            if (breakpoint === 9999) {
              $obj.off("mousedown.stop touchstart.stop");
            }
          });
          $(window)
            .on("resize", function () {
              $obj.slick("resize");
              if (!mql.maxSm.matches) {
                $obj
                  .find(".item")
                  .removeAttr("role id tabindex aria-describedby aria-hidden");
              }
            })
            .resize();
          function eventStopOn() {
            $obj.on("mousedown.stop touchstart.stop", function (e) {
              e.stopPropagation();
            });
          }
          if (mql.maxSm.matches) {
            eventStopOn();
          }
        },
      };
      componentCarouselSimple.init();
    }
  });

  /* LGEGMC-2177 End */
  $(".GPC0042")
    .find(".btn-area-wrap a")
    .on("click", function (e) {
      var $this = $(this);
      target = "_blank";
      if (
        !$this.attr("href").startsWith("#") ||
        $this.attr("target") == "_blank"
      )
        return;

      e.preventDefault();

      var screenWidth = $(window).width();
      var $tgTabPanel = $($this.attr("href"));
      var imgLoader = null;
      var loadCount = 0;
      var loaded = 0;
      var targetImgCount = 0;
      var checkImgNum = 0;
      var imgConuntChecker = function () {
        var cntLoad = 0,
          cntLoaded = 0;
        $(".component").each(function () {
          if ($(this).find(".slick-initialized ").length == 0) {
            cntLoad = cntLoad + $(this).find("img.lazyloaded").length;
            cntLoaded =
              cntLoaded + $(this).find("img[data-loaded=true]").length;
          } else {
            cntLoad = cntLoad + parseInt($(this).find(".slick-active").length);
            cntLoaded =
              cntLoaded + parseInt($(this).find(".slick-active").length);
          }
        });
        checkImgNum++;
        if (cntLoad <= cntLoaded || checkImgNum >= 20) {
          // Maximum of 2 seconds
          return true;
        } else {
          return false;
        }
      };

      var getScrollPostion = function (tg) {
        var GPC0117height = $(".floating-wrap")
          .closest(".component-wrap")
          .outerHeight(true)
          ? $(".floating-wrap").closest(".component-wrap").outerHeight(true)
          : 0;
        var offsetTop = Math.round(tg.offset().top - GPC0117height);
        if (
          tg.hasClass("iw_placeholder") ||
          tg.find(".iw_placeholder").length > 0 ||
          tg.closest(".iw_placeholder").length > 0
        ) {
          offsetTop = offsetTop + 1;
        }
        return offsetTop;
      };

      var pre_event = function () {
        $("img.lazyload:visible").each(function () {
          var srcStr = $(this).attr("data-src");
          if ($.trim(srcStr) !== "") {
            $(this)
              .attr("src", srcStr)
              .removeClass("lazyload")
              .addClass("lazyloaded");
          }
        });
      };

      var excute_event = function (destination) {
        setTimeout(function () {
          scrolling(destination);
        }, 100);
      };

      if ($("img.lazyload:visible").not('[data-src=""]').length > 0) {
        // lazyload unlock
        pre_event();
        imgLoader = setInterval(function () {
          var loadComplete = imgConuntChecker();
          console.log("loadComplete : " + loadComplete);
          if (loadComplete) {
            clearInterval(imgLoader);
            excute_event(getScrollPostion($tgTabPanel));
          }
        }, 100);
      } else {
        excute_event(getScrollPostion($tgTabPanel));
      }
    });

  // desktop event
  function scrolling(pos) {
    $("html, body").animate(
      {
        scrollTop: pos,
      },
      { duration: 500 }
    );
  }
  /* LGEGMC-2177 Start */
});

//PJTFF42-5 Start
window.onload = function () {
  $(".GPC0042").each(function (index, el) {
    var obj = $(el);
    var defaultStat = obj.attr("default-folding-status");
    if (defaultStat == "open") {
      if (obj.find(".toggle").length > 0) obj.find(".toggle").click();
      if (obj.find(".more").length > 0) obj.find(".more").click();
    }
  });
};
//PJTFF42-5 End
