var category = "front"; //사용자 화면일때는 front로
if (typeof ip == "undefined") {
  var this_ip = "";
} else {
  var this_ip = ip();
}
var scripts = document.getElementsByTagName("script"),
  myScript = scripts[scripts.length - 1],
  queryString = myScript.src.replace(/^[^\?]+\??/, ""),
  params = parseQuery(queryString),
  id = params.id;
function parseQuery(e) {
  var t = new Object();
  if (!e) return t;
  for (var a = e.split(/[;&]/), r = 0; r < a.length; r++) {
    var n = a[r].split("=");
    if (n && 2 == n.length) {
      var s = unescape(n[0]),
        i = unescape(n[1]);
      (i = i.replace(/\+/g, " ")), (t[s] = i);
    }
  }
  return t;
}
var analytics = function (e, t) {
  "pageView" == e &&
    "/" == (t = (t = location.pathname).substr(1)).slice(-1) &&
    (t = t.substr(0, t.length - 1));
  var a = t.split("::");
  var referrer = document.referrer;
  $.ajax({
    url: "/common/json/analytics",
    type: "post",
    dataType: "json",
    async: true,
    data: {
      category: category,
      item1: a[0],
      item2: a[1],
      item3: a[2],
      event: e,
      ip: this_ip,
      referrer: referrer,
      id: id,
    },
    success: function (e) {
      /*console.log(e)*/
    },
    complete: function () {},
    error: function (e) {
      /*alert(e.responseText)*/
    },
  });
};
analytics("pageView");
