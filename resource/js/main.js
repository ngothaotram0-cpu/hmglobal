var g;
var timer;
var isPlay = false;
var cid = "";
var no_arr;
var cnt = 0;
var play_arr = [
  "410,korea",
  "840,northAmerica",
  "380,europe",
  "604,latinAmerica",
  "736,middleEastAfrica",
  "608,asiaPacific",
  "643,cis",
];
var delay = 3500;
var global_no = 0;

function draw() {
  var str = "<svg id='earth-js'></svg>";
  str += "<canvas id='three-js'></canvas>";
  str += "<canvas class='ej-canvas' style='opacity:0.0'></canvas>";
  $("#id_area").html(str);

  // console.log(d3.select('#id_area').node());
  // const {offsetWidth, offsetHeight} = d3.select('#id_area').node();
  // 	console.log(offsetWidth, offsetHeight);
  var node = d3.select("#id_area").node();

  var offsetWidth = node.offsetWidth;
  var offsetHeight = node.offsetHeight;

  g = earthjs({ width: offsetWidth, height: offsetHeight, padding: 0 })
    .register(earthjs.plugins.inertiaPlugin())
    .register(earthjs.plugins.hoverCanvas())
    .register(earthjs.plugins.clickCanvas())
    .register(earthjs.plugins.centerCanvas())
    .register(earthjs.plugins.canvasPlugin())
    .register(earthjs.plugins.dropShadowSvg())
    .register(earthjs.plugins.countryCanvas())
    .register(earthjs.plugins.autorotatePlugin())
    .register(earthjs.plugins.worldCanvas("/resource/json/world-110m.json"))
    .register(earthjs.plugins.threejsPlugin())
    .register(earthjs.plugins.globeThreejs());
  g.canvasPlugin.selectAll(".ej-canvas");
  g._.options.showSelectedCountry = true;
  g._.options.showLakes = false;
  g._.options.showLand = false;
  g._.options.showGlobe = false;
  //g._.options.showBorder = true;

  g.autorotatePlugin.stop();
  //g.autorotatePlugin.speed(10);

  g.ready(function () {
    const data = g.worldCanvas.data();
    g.countryCanvas.data(data);
    g.hoverCanvas.data(data);
    g.clickCanvas.data(data);

    g.create();
    //$('.paging a').eq(cnt).addClass('active').siblings().removeClass('active');
    $(".paging li").eq(cnt).addClass("active").siblings().removeClass("active");
    $(".area-info > div").eq(cnt).addClass("active");
    //setPlay(840,'northAmerica');
    var korea = [410];
    var arr = g.worldCanvas.countries().filter(function (x) {
      return korea.indexOf(x.id) > -1;
    });
    $(".ej-canvas").css({ opacity: "1" });
    g.worldCanvas.style({ selected: "rgba(0, 0, 0, 0.3)" });
    g.worldCanvas.selectedCountries(arr);
  });
}

$(function () {
  var str = "";
  var number = "";
  var ismobile = false;

  d3.select("#korea").on("click", function (e) {
    event.preventDefault();
    if (cid != "korea") {
      setPlay(410, "korea");
    }
  });
  d3.select(".korea").on("click", function (e) {
    event.preventDefault();
    if (cid != "korea") {
      setPlay(410, "korea");
    }
  });
  d3.select("#northAmerica").on("click", function (e) {
    event.preventDefault();
    if (cid != "northAmerica") {
      setPlay(840, "northAmerica");
    }
  });
  d3.select(".northAmerica").on("click", function (e) {
    event.preventDefault();
    if (cid != "northAmerica") {
      setPlay(840, "northAmerica");
    }
  });
  d3.select("#latinAmerica").on("click", function (e) {
    event.preventDefault();
    if (cid != "latinAmerica") {
      setPlay(604, "latinAmerica");
    }
  });
  d3.select(".latinAmerica").on("click", function (e) {
    event.preventDefault();
    if (cid != "latinAmerica") {
      setPlay(604, "latinAmerica");
    }
  });
  d3.select("#cis").on("click", function (e) {
    event.preventDefault();
    if (cid != "cis") {
      setPlay(643, "cis");
    }
  });
  d3.select(".cis").on("click", function (e) {
    event.preventDefault();
    if (cid != "cis") {
      setPlay(643, "cis");
    }
  });
  d3.select("#asiaPacific").on("click", function (e) {
    event.preventDefault();
    if (cid != "asiaPacific") {
      setPlay(608, "asiaPacific");
    }
  });
  d3.select(".asiaPacific").on("click", function (e) {
    event.preventDefault();
    if (cid != "asiaPacific") {
      setPlay(608, "asiaPacific");
    }
  });
  d3.select("#middleEastAfrica").on("click", function (e) {
    event.preventDefault();
    if (cid != "middleEastAfrica") {
      setPlay(736, "middleEastAfrica");
    }
  });
  d3.select(".middleEastAfrica").on("click", function (e) {
    event.preventDefault();
    if (cid != "middleEastAfrica") {
      setPlay(736, "middleEastAfrica");
    }
  });
  d3.select("#centralAmericaCaribbean").on("click", function (e) {
    event.preventDefault();
    if (cid != "centralAmericaCaribbean") {
      setPlay(591, "europe");
    }
  });
  d3.select(".centralAmericaCaribbean").on("click", function (e) {
    event.preventDefault();
    if (cid != "centralAmericaCaribbean") {
      setPlay(591, "europe");
    }
  });
  d3.select("#europe").on("click", function (e) {
    event.preventDefault();
    if (cid != "europe") {
      setPlay(380, "europe");
    }
  });
  d3.select(".europe").on("click", function (e) {
    event.preventDefault();
    if (cid != "europe") {
      setPlay(380, "europe");
    }
  });
  if ($(window).width() < 758) {
    ismobile = true;
  } else {
    ismobile = false;
  }
  $(window).resize(function () {
    if ($(window).width() < 758) {
      ismobile = true;
    } else {
      ismobile = false;
    }

    if (this.resizeTO) clearTimeout(this.resizeTO);
    this.resizeTO = setTimeout(function () {
      $(this).trigger("resizeEnd");
    }, 500);
  });
  $(window).on("resizeEnd", function () {
    cnt = 0;
    draw();
  });
  $(document).on("click", "#pause", function (e) {
    e.preventDefault();
    if ($(this).hasClass("pause")) {
      $(this).removeClass("pause").addClass("play").text("[ play ]");

      isPlay = false;
    } else {
      if (cnt == play_arr.length - 1) {
        cnt = -1;
      }
      $(this).removeClass("play").addClass("pause").text("[ pause ]");
      isPlay = true;
    }
  });

  //draw();

  $(".paging li:not(#pause)").on("click", function () {
    cnt = $(this).index();
    $(this).addClass("active").siblings().removeClass("active");
    cid = $(this).attr("id");
    isPlay = false;
    $("#pause").removeClass("pause").addClass("play");
  });
  $(".area-info > div").on("click", function () {
    cnt = $(this).index();
    $(".paging li").eq(cnt).addClass("active").siblings().removeClass("active");
    cid = $(this).attr("class");
    isPlay = false;
    $("#pause").removeClass("pause").addClass("play");

    if (ismobile) {
      location.href = $(this).find("a").attr("href");
    }
  });
  $(".area-info a").on("click", function () {
    location.href = $(this).attr("href");
  });
  $(document).on("click", ".btn-search", function () {
    /*location.href="/global/careers/workplaces/"+encodeURIComponent($('#nation').val());*/
    location.href = "/workplaces/" + encodeURIComponent($("#nation").val());
  });
  $(document).on("click", ".kv a", function () {
    location.href = $(this).attr("href");
  });
  $(document).on("keyup", "#nation", function (e) {
    if (e.keyCode == 13) {
      if ($("#nation").val() != "") {
        /*location.href="/global/careers/workplaces/"+encodeURIComponent($('#nation').val());*/
        location.href = "/workplaces/" + encodeURIComponent($("#nation").val());
      }
    }
  });
  if (
    $(window).scrollTop() >=
    $(".locations-overview").offset().top - $(".locations-overview").height()
  ) {
    if (typeof g == "undefined") {
      draw();
    }
    g.ready(function () {
      isPlay = true;
    });
  }
  $(window).scroll(function () {
    if (global_no == 0) {
      var pos = $(this).scrollTop();
      if (pos > 0) {
        if (typeof g == "undefined") {
          draw();
        }
      }
      if (
        pos >=
        $(".locations-overview").offset().top -
          $(".locations-overview").height()
      ) {
        g.ready(function () {
          isPlay = true;
        });
      }
    }
  });

  setInterval(function () {
    if (isPlay) {
      cnt++;

      //$('.paging a').eq(cnt).addClass('active').siblings().removeClass('active');
      $(".paging li")
        .eq(cnt)
        .addClass("active")
        .find("a")
        .attr("aria-selected", "true")
        .parent()
        .siblings()
        .removeClass("active")
        .find("a")
        .attr("aria-selected", "false");
      var play_arrs = play_arr[cnt].split(",");
      var id = play_arrs[0];
      var id_arr = play_arrs[1];
      setPlay(id, id_arr);
      //console.log(cnt);
      if (cnt == play_arr.length - 1) {
        cnt = -1;
      }
      global_no++;
    }
  }, delay);

  //getContinentalCnt();
});
function setPlay(id, id_arr) {
  var korea = [410];
  var northAmerica = [840, 124];
  var latinAmerica = [
    32, 76, 170, 152, 604, 68, 600, 858, 484, 591, 188, 192, 214, 222, 320, 340,
    388, 558, 630,
  ];
  var cis = [643, 804, 398, 417, 762, 860];
  var asiaPacific = [36, 554, 360, 458, 608, 764, 704, 158, 156, 356, 392];
  var middleEastAfrica = [
    566, 24, 686, 204, 120, 180, 266, 270, 288, 324, 430, 466, 768, 404, 108,
    262, 231, 454, 646, -99, 728, 736, 834, 800, 894, 232, 682, 792, 376, 364,
    818, 788, 12, 504, 710,
  ];
  var centralAmericaCaribbean = [
    591, 188, 192, 214, 222, 320, 340, 388, 558, 630,
  ];
  var europe = [
    276, 756, 40, 528, 56, 442, 826, 372, 752, 246, 208, 578, 724, 620, 250,
    380, 300, 616, 203, 428, 233, 440, 191, 688, 100, 642,
  ];
  no_arr = eval(id_arr);
  //$('.ej-canvas').css('opacity','0');
  g.autorotatePlugin.stop();
  g.centerCanvas.go(id);
}
function setDisplay(id) {
  //$('.ej-canvas').animate({opacity:"0"},200);
  var arr = g.worldCanvas.countries().filter(function (x) {
    return no_arr.indexOf(x.id) > -1;
  });
  if (id == 410) {
    g.worldCanvas.style({ selected: "rgba(0, 0, 0, .3)" });
  } else {
    g.worldCanvas.style({ selected: "rgba(0, 0, 0, .3)" });
  }

  g.worldCanvas.selectedCountries(arr);

  $(".ej-canvas").stop().animate({ opacity: "1" }, 200);

  //$('.area-info dl').removeClass('active');
  $(".area-info > div").eq(cnt).addClass("active");
  //$('.paging a').eq(cnt).addClass('active').siblings().removeClass('active');
}
function closeDisplay(id) {
  $(".ej-canvas").stop().animate({ opacity: "0" }, 200);
  $(".area-info > div").removeClass("active");
}
function getContinentalCnt() {
  $.ajax({
    url: "/workplaces/json/continental" /*/global/careers/workplaces/json/continental*/,
    type: "post",
    dataType: "json",
    async: true,
    data: {},
    success: function (res) {
      $(".northAmerica dd").html(res["NA"]);
      $(".europe dd").html(res["EU"]);
      $(".latinAmerica dd").html(res["LA"]);
      $(".middleEastAfrica dd").html(res["MA"]);
      $(".asiaPacific dd").html(res["AP"]);
      $(".cis dd").html(res["CI"]);
      //alert(res['AP']);
      //document.location.hash = "#" + page;
    },
    complete: function () {
      //$(list('1'));
    },
    error: function (e) {
      alert(e.responseText);
    },
  });
}
