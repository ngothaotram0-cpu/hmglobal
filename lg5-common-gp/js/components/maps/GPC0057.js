$(document).ready(function () {
  if (!document.querySelector(".GPC0057")) return false;

  var modal = {
    wrappers: document.querySelectorAll(".GPC0057 .modal-layers"),
    wrapper: null,
    init: function () {
      var _this = this;
      for (var i = 0; i < _this.wrappers.length; i++) {
        _this.wrapper = _this.wrappers[i];
        _this.addEvent();
      }
    },
    initSlick: function (e) {
      var _modal = e.currentTarget,
        _el = {
          _visual: _modal.querySelector(".visual-box-belt"),
          _text: _modal.querySelector(".text-box-belt"),
        };

      if (!$(_el._visual).hasClass("slick-initialized")) {
        _el._visual.id = _modal.id + "_visual";
        _el._text.id = _modal.id + "_text";

        $(_el._visual).slick({
          asNavFor: "#" + _el._text.id, // sync
          infinite: false,
          fade: true,
          responsive: [
            {
              breakpoint: 768,
              settings: {
                dots: true,
                arrows: false,
              },
            },
          ],
        });
        $(_el._text).slick({
          asNavFor: "#" + _el._visual.id, // sync
          arrows: false,
          infinite: false,
          adaptiveHeight: true,
        });

        // LGECI-259 Start
        if ($(this).has(".visual-area") && $(this).has(".text-area")) {
          var $textArea = $(this).find(".text-area");

          $(this)
            .find(".see-video")
            .each(function () {
              var connectIdx = $(this)
                .closest(".visual-box")
                .attr("data-slick-index");
              var textHead = $textArea
                .find(
                  ".text-box[data-slick-index=" +
                    connectIdx +
                    "] .text-box-head > *"
                )
                .text();
              $(this).attr("aria-describedby", textHead);
            });
        }
        // LGECI-259 End
      } else {
        $(_el._visual).slick("setPosition");
        $(_el._text).slick("setPosition");
      }
    },
    hideVideo: function (e) {
      var _modal = e.currentTarget;
      $(_modal).find(".video-asset").remove();
    },
    addEvent: function () {
      var _this = modal;
      $(_this.wrapper).on(
        {
          "shown.bs.modal": _this.initSlick,
          // 'hide.bs.modal': ,
          "hide.bs.modal": function (e) {
            _this.hideVideo(e);
            $("body").removeAttr("style").removeClass("modal-open");
          },
        },
        ".banner-layer"
      );
      $(_this.wrapper).on(
        {
          beforeChange: _this.hideVideo,
        },
        ".slick-initialized"
      );
    },
  };

  modal.init();
});
