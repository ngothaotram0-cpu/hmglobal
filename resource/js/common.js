
function ajax_html(url, param, id, method, before, after) {
  $.ajax({
    url: url,
    type: method,
    dataType: "html",
    async: true,
    data: param,
    beforeSend: before,
    success: function (dom) {
      $("#+id+").html(dom);
    },
    complete: function () {
      after;
    },
    error: function (e) {
      alert(e.responseText);
    },
  });
}
function setCookie(name, value, expiredays) {
  var todayDate = new Date();
  todayDate.setDate(todayDate.getDate() + expiredays);
  document.cookie = name + "=" + escape(value) + "; path=/; ";
}
function getCookie(name) {
  var nameOfCookie = name + "=";
  var x = 0;
  while (x <= document.cookie.length) {
    var y = x + nameOfCookie.length;
    if (document.cookie.substring(x, y) == nameOfCookie) {
      if ((endOfCookie = document.cookie.indexOf(";", y)) == -1)
        endOfCookie = document.cookie.length;
      return unescape(document.cookie.substring(y, endOfCookie));
    }
    x = document.cookie.indexOf(" ", x) + 1;
    if (x == 0) break;
  }
  return "";
}
function checkForHash(fn) {
  var fn = eval(fn);
  if (document.location.hash) {
    var HashLocationName = document.location.hash;
    HashLocationName = HashLocationName.replace("#", "");

    $(fn(HashLocationName));
  } else {
    $(fn("1"));
  }
}
String.prototype.replaceAll = function (org, dest) {
  return this.split(org).join(dest);
};
function sectionMove(section_id) {
  if ($(".tab-content").length) {
    setTimeout(function () {
      var hashval = section_id;
      if (hashval != "") {
        var numm = 0;
        if (hashval == "overview" || hashval == "lg-way" || hashval == "why") {
          numm = $(".tab-menu").height();
        }
        var target = $("#" + hashval).offset().top - numm;

        if (hashval == "growth" || hashval == "diversity") {
          target += 5;
        }
        $("html,body")
          .stop()
          .animate({ scrollTop: target }, 1000, "easeInOutQuart", function () {
            $("." + hashval).focus();
          });
      }
    }, 100);
  }
}
