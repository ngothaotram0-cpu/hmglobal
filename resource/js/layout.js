$(function () {
  //gnb
  $(".gnb .inner > ul > li").bind({
    mouseenter: function () {
      if ($(window).width() > 767) {
        $(this).addClass("on").siblings().removeClass("on");
        $(".nav-bg, .depth2, .btn-faq").stop().fadeIn();
        $(".gnb").stop().animate({ height: "360px" }).addClass("active");
      }
    },
    focusin: function () {
      $(this).mouseenter();
    },
  });
  $(".gnb").bind({
    mouseleave: function () {
      if ($(window).width() > 767) {
        $(".nav-bg, .gnb .depth2, .btn-faq").stop().fadeOut();
        $(".gnb").stop().animate({ height: "74px" }).removeClass("active");
        $(".gnb .inner > ul > li").removeClass("on");
      }
    },
  });
  $(".gnb .btn-faq").on("focusout", function () {
    $(".nav-bg, .gnb .depth2, .btn-faq").stop().fadeOut();
    $(".gnb").stop().animate({ height: "74px" }).removeClass("active");
  });
  $(".btn-nav").on("click", function () {
    if ($(".gnb").is(":hidden")) {
      $("body").addClass("lock");
      $(this).addClass("active").find("span").text("CLOSE");
      $(".gnb").removeAttr("style").slideDown();
      $(".nav-bg").fadeIn();
    } else {
      $("body").removeClass("lock");
      $(this).removeClass("active").find("span").text("OPEN");
      $(".gnb").slideUp();
      $(".nav-bg").fadeOut();
    }
  });
  $(window).resize(function () {
    if ($(window).width() > 767) {
      $("body").removeClass("lock");
      $(".btn-nav").removeClass("active").find("span").text("OPEN");
      $(".gnb").removeAttr("style");
    }
  });
  $(".gnb .depth1 > a:not(.except)").on("click", function (e) {
    if ($(window).width() <= 1366) {
      e.preventDefault();
    }
  });

  $(".skip-contents").on("click", function () {
    $(".gnb").stop().animate({ height: "74px" }).removeClass("active");
  });

  //select
  var select = $(".select .btn-select");
  select.on("click", function () {
    if ($(this).next().is(":hidden")) {
      $(this).addClass("open").next(".option").slideDown(200);
      $(this).attr("aria-expanded", "true");
    } else {
      $(this).removeClass("open").next(".option").slideUp(200);
      $(this).attr("aria-expanded", "false");
    }
    return false;
  });
  $("body").on("click", function () {
    if ($(".option").is(":visible")) {
      select.removeClass("open");
      $(".option").slideUp("fast");
      select.attr("aria-expanded", "false");
    }
  });
  $(".option a").on("click", function () {
    var val = $(this).text();
    $(".select > .btn-select").text(val);
  });
  $(".option li:last a").on("focusout", function () {
    select.removeClass("open");
    $(".option").slideUp("fast");
    select.attr("aria-expanded", "false");
  });

  //top
  $(".btn-top").on("click", function (e) {
    e.preventDefault();
    $("html, body")
      .stop()
      .animate(
        {
          scrollTop: 0,
        },
        function () {
          $(".wrap").focus();
        }
      );
  });
  //how-to-apply
  $(".btn-howtoapply").on("click", function (e) {
    e.preventDefault();
    $("html, body")
      .stop()
      .animate(
        {
          scrollTop: 1790,
        },
        function () {
          $(".wrap").focus();
        }
      );
  });

  $(window).scroll(function () {
    scrollValue = $(this).scrollTop();
    //console.log(scrollValue);
    bottomValue =
      $(document).height() - $(window).height() - $(".footer").height();
    if (scrollValue > 500) {
      $(".btn-top").fadeIn();
    } else {
      $(".btn-top").fadeOut();
    }

    if ($(window).width() >= 768) {
      if (scrollValue > bottomValue) {
        $(".btn-top").css({
          bottom: scrollValue - bottomValue + 20,
        });
      } else {
        $(".btn-top").css({
          bottom: 20,
        });
      }
    }
  });
  $(window).resize(function () {
    if ($(window).width() >= 768) {
      $(".btn-top").removeAttr("style");
    }
  });

  //kv
  setTimeout(function () {
    $(".kv li > div").stop().animate({
      opacity: 1,
    });
    $(".kv .obj02 .kv-con")
      .stop()
      .animate(
        {
          /*left: '84px'*/
        },
        function () {
          kv.startAuto();
        }
      );
  });
  var size = $(window).width();
  var kv = $(".kv ul").bxSlider({
    mode: "fade",
    controls: false,
    pause: 6000,
    pager: false,
    onSliderLoad: function (currentIndex) {
      var num = $(".kv li").length;
      $(".kv li").each(function (index) {
        var idx = index + 1;
        $(".kv-pager").append(
          '<button class="kv-pager-link" aria-pressed="false" title="' +
            idx +
            " of " +
            num +
            '"><span>Main Banner slide</span>' +
            idx +
            "</button>"
        );
      });
      $(".kv .kv-pager-link")
        .eq(0)
        .addClass("active")
        .attr("aria-pressed", "true");

      $(".kv-pager-link").on("click", function (e) {
        e.preventDefault();
        var kvIdx = $(this).index();
        $(this).addClass("active").siblings().removeClass("active");
        kv.goToSlide(kvIdx);
      });

      /*$('.kv .obj01').css({width:'45%'});
			$('.kv .obj02').css({width:'55%'});
			$('.kv .obj03').css({width:'36%'});
			$('.kv .obj04').css({width:'64%'});*/
    },
    onSlideBefore: function ($slideElement, oldIndex, newIndex) {
      var nowIdx = $(".kv-pager-link").eq(newIndex);
      nowIdx.addClass("active").siblings().removeClass("active");

      $(".kv .kv-pager-link").attr("aria-pressed", "false");
      $(".kv .kv-pager-link").eq(newIndex).attr("aria-pressed", "true");

      if (newIndex % 2 == 0) {
        $(".kv .bar .top").css({ left: "44.69%" });
        $(".kv .bar .bottom").css({ left: "35.55%" });
        /*$('.kv .obj01').stop().animate({width:'45%'});
				$('.kv .obj02').stop().animate({width:'55%'});
				$('.kv .obj03').stop().animate({width:'36%'});
				$('.kv .obj04').stop().animate({width:'64%'});
				$('.kv .obj02 .kv-con').stop().animate({left:'84px'});
				$('.kv .obj03 .kv-con').stop().animate({right:'-300px'});*/
        if (size >= 1284) {
        }
      } else {
        $(".kv .bar .top").css({ left: "54%" });
        $(".kv .bar .bottom").css({ left: "50%" });
        /*$('.kv .obj01').stop().animate({width:'54%'});
				$('.kv .obj02').stop().animate({width:'46%'});
				$('.kv .obj03').stop().animate({width:'50%'});
				$('.kv .obj04').stop().animate({width:'50%'});
				$('.kv .obj02 .kv-con').stop().animate({left:'-200px'});
				$('.kv .obj03 .kv-con').stop().animate({right:'50px'});*/
        if (size >= 1284) {
        }
      }
    },
    onSlideAfter: function ($slideElement, oldIndex, newIndex) {
      /*if(newIndex%2 == 0){
				if(size >= 1284){
					
				}
				$('.kv .obj03 .kv-con').css({right:'-300px'});
			} else{
				$('.kv .obj02 .kv-con').css({left:'150px'});
			}*/
    },
  });

  var autoPlay = true;
  $(".kv .btn-control").on("click", function () {
    if (autoPlay) {
      kv.stopAuto();
      $(this).addClass("play").text("PLAY");
      autoPlay = false;
    } else {
      kv.startAuto();
      $(this).removeClass("play").text("STOP");
      autoPlay = true;
    }
  });

  //pop-up
  /*
	var video;
	$('.panel > a').click(function(){
		var content = $(this).data('content');
		if($('.overlay .vod-wrap').length){
			video = $('.overlay .'+content).find('video').get(0);
		}
		$('.'+content).show().siblings('.pop-content').hide();
		$('.overlay').fadeIn();
		$('body').css({overflowY:'hidden'});
		$('.overlay').scrollTop(0);
		$('.overlay .btn-close').attr('href','#'+content);
	});
	$('.close').click(function(){
		//e.preventDefault();
		$('.overlay').fadeOut(function(){
			$('body').css({overflowY:"scroll"});
		});
		if($('.vod-wrap').length){
			//console.log(typeof(video)=="undefined");
			if(typeof(video)!="undefined"){
				video.pause();
			}			
			$('.btn-play').fadeIn();
			$('.cover').hide();
		}
		//return false;
	});
	*/
  $(document).on("click", ".panel a", function (e) {
    //e.preventDefault();
    var content = $(this).data("content");
    //alert(content);
    $.ajax({
      url: "/main/ajax/popup-video-get" /*/global/careers/main/ajax/popup-video-get*/,
      type: "post",
      dataType: "html",
      async: true,
      data: { content: content },
      success: function (dom) {
        $("#id_popup_video").html(dom);
        $("." + content)
          .show()
          .siblings(".pop-content")
          .hide();
        $(".overlay").fadeIn().attr("tabindex", "0").focus();
        $("body").css({ overflowY: "hidden" });
        $(".overlay").scrollTop(0);
        $(".overlay .btn-close").attr("href", "#" + content);
      },
      error: function () {},
    });
  });
  $(".close").click(function () {
    //e.preventDefault();
    $(".overlay").removeAttr("tabindex");
    $(".overlay").fadeOut(function () {
      $("body").css({ overflowY: "scroll" });
    });
    //alert($('.vod-wrap').length);
    if ($(".vod-wrap").length) {
      //$('#id_popup_video').html('')
      for (i = 0; i < $("video").length; i++) {
        $("video")[i].pause();
      }

      //console.log(typeof(video)=="undefined");
      //if(typeof(video)!="undefined"){
      //	video.pause();
      //}
      $(".btn-play").fadeIn();
      $(".cover").hide();
    }
    //return false;
  });
  //Fixed Menu
  if ($(".tab-content").length) {
    var navPos = $(".tab-menu").offset().top;
    function fixedNav() {
      var Top = $(window).scrollTop();
      if (Top > navPos) {
        $(".tab-menu").addClass("fixed");
      } else {
        $(".tab-menu").removeClass("fixed");
      }
    }
    fixedNav();
    var collision_obj = $(".tab-menu").collision(".tab-content div");
    if (typeof collision_obj[0] != "undefined") {
      var tabid = collision_obj[0].id;
      $(".tab-menu a").removeClass("active");
      $("a[href='#" + tabid + "']").addClass("active");
    } else {
      $(".tab-menu a").removeClass("active");
    }
    $(window).scroll(function () {
      fixedNav();

      var collision_obj = $(".tab-menu").collision(".tab-content div");
      //console.log(collision_obj);
      if (typeof collision_obj[0] != "undefined") {
        var tabid = collision_obj[0].id;
        $(".tab-menu a").removeClass("active").attr("aria-selected", "false");
        $("a[href='#" + tabid + "']")
          .addClass("active")
          .attr("aria-selected", "true");
      } else {
        $(".tab-menu a").removeClass("active");
      }
    });
  }
  var navHeight = $(".tab-menu").height();
  $(".tab-menu li a").on("click", function (e) {
    //e.stopPropagation();
    e.preventDefault();
    if ($(".tab-content").length) {
      //console.log(this.hash);
      var target = Math.ceil($(this.hash).offset().top);
      var targetIdx = $(this).parent().index();
      var targetEle = $(this).attr("href").split("#").pop();

      //console.log(target,targetIdx,targetEle);

      if (targetIdx == 0 && $(window).width() >= 768) {
        target = target - navHeight;
      }
      $("html,body")
        .stop()
        .animate({ scrollTop: target }, 1000, "easeInOutQuart", function () {
          $("." + targetEle).focus();
          //fixedNav();
        });
    }
  });

  //video
  var video;
  $(".btn-play").on("click", function () {
    video = $(this).siblings("video").get(0);
    video.play();
    $(this).fadeOut();
    $(".cover").show();
  });
  $(".cover").on("click", function () {
    video.pause();
    $(".btn-play").fadeIn();
    $(".cover").hide();
  });

  //overlay
  $(document).keyup(function (e) {
    if (e.keyCode == 27) {
      $(".overlay").fadeOut();
      $("body").css({ overflowY: "scroll" });
      var focusCon = $(".overlay a.close").attr("href");
      //alert(focusCon)
      $(focusCon).find("a").focus();
      if ($(".vod-wrap").length) {
        video.pause();
        $(".play-btn").show();
      }
      //return false;
    }
  });

  var history_str = [
    "Goldstar first company of what will later become LG Electronics",
    "Produces Korea’s first TV",
    "Establishes first overseas production base in the US",
    "Rebrands as LG Electronics",
    "Introduces world’s first refrigerator powered by Inverter Linear Compressor",
    "Launches Vehicle  Components  Company",
    "Introduces world’s first 4K OLED TV",
    "Launches premium LG SIGNATURE brand",
    "Introduces world’s first rollable OLED TV",
  ];
  //alert(history_str[0]);
  //intro-history-slider

  //faq
  $(document).on("click", ".faq-list dt button", function (e) {
    e.preventDefault();
    var faq = $(this).parents("dl");
    if (faq.hasClass("active")) {
      faq.removeClass("active");
      $(this).attr("aria-expanded", "false");
    } else {
      $(".faq-list dl").removeClass("active");
      faq.addClass("active");
      $(".faq-list dt button").attr("aria-expanded", "false");
      $(this).attr("aria-expanded", "true");
    }
  });

  //location
  $(".location-lg .tab-menu a").on("click", function (e) {
    e.preventDefault();
    var value = $(window).scrollTop();
    var tabPos = $(".tab-wrap").offset().top;
    var target = $(this).attr("data-loc");
    $(".location-lg .tab-menu a").removeClass("active");
    $(".kv-locations .inner > div").removeClass();
    $(this)
      .addClass("active")
      .attr("aria-selected", "true")
      .parent()
      .siblings()
      .find("a")
      .attr("aria-selected", "false");
    if (target == "all") {
      $(".kv-sub dl").removeClass("active");
    } else {
      $(".kv-sub dl." + target)
        .addClass("active")
        .siblings()
        .removeClass("active");
      $(".kv-locations .inner > div").addClass(target);
    }
    if (tabPos > value && $(window).width() < 768) {
      $("html, body").stop().animate({
        scrollTop: tabPos,
      });
    }
  });
  $(".kv-locations dl").on("click", function () {
    var idx = $(this).index() + 1;
    $(".location-lg .tab-menu li").eq(idx).find("a").click();
  });
  $(document).on("click", ".area-list .link button", function () {
    $(".area-list .link ul").slideUp();
    if ($(this).next("ul").is(":visible")) {
      $(this).removeClass("active");
      $(this).attr("aria-expanded", "false").next("ul").slideUp();
    } else {
      $(".area-list .link button").removeClass("active");
      $(this).addClass("active");
      $(this).attr("aria-expanded", "true").next("ul").slideDown();
    }

    if ($(this).hasClass("new-link")) {
      $(this).removeAttr("aria-expanded");
    }
    return false;
  });
  $("body").on("click", function () {
    if ($(".area-list .link ul").is(":visible")) {
      $(".area-list .link button").removeClass("active");
      $(".area-list .link ul").slideUp();
    }

    if ($(".area-list .link button").hasClass("new-link")) {
      $(this).removeAttr("aria-expanded");
    } else {
      $(this).attr("aria-expanded", "false");
    }
  });

  //accessibility
  $(".accessibility-detail .tab-menu a").on("click", function (e) {
    e.preventDefault();
    var target = $(this.hash);
    $(this)
      .addClass("active")
      .attr("aria-selected", "true")
      .parent()
      .siblings()
      .find("a")
      .removeClass("active")
      .attr("aria-selected", "false");
    $(target).show().siblings("div").hide();
  });
});
