var data = require("sdk/self").data;
var self = require("sdk/self");
var contextMenu = require("sdk/context-menu");
var tabs = require('sdk/tabs');
var rison = require('rison');
var url = require('sdk/url');
var moment = require('moment');
var panel = require('sdk/panel');

var timeSelection = panel.Panel({
  contentURL: data.url("timeSelection.html"),
  contentScriptFile: [data.url('moment.js'), data.url('jquery.js'), data.url("getTimeSelection.js")]
});

timeSelection.port.on("timeEntered", function(o){
    var urlObj = url.URL(tabs.activeTab.url);
    var new_url = ConstructURL(urlObj, o.from, o.to, o.unit);
    timeSelection.hide();
    tabs.open(new_url);
});

var menuItem = contextMenu.Item({
  label: "Fetch adjacent documents...",
  context: contextMenu.URLContext(/.*\/app\/kibana#\/.*/),
  contentScriptFile: [data.url('contextMenuContentScript.js'), data.url('moment.js')],
  onMessage: function(date){
    timeSelection.show();
    timeSelection.port.emit("date", date);
  }
});

function ConstructURL(baseUrl, dateFrom, dateTo, timeUnit)
{
  var hashStrParts = baseUrl.hash.split('&');
  var gStr = hashStrParts[0].replace("#/discover?_g=", "").replace(/%27/g,"'");
  var aStr = hashStrParts[1].replace("_a=", "").replace(/%27/g, "'");
  var gObj = rison.decode(gStr);
  var aObj = rison.decode(aStr);
  
  gObj.time.from = moment(dateFrom, "YYYY-MM-DD HH:mm:ss:SSS").format("YYYY-MM-DDTHH:mm:ss.SSS");
  gObj.time.to = moment(dateTo, "YYYY-MM-DD HH:mm:ss:SSS").format("YYYY-MM-DDTHH:mm:ss.SSS");
  gObj.time.mode = "absolute";

  aObj.query.query_string.query = "*";

  var finalUrl = baseUrl.href.replace(baseUrl.hash, "") + "#/discover?_g=" + rison.encode(gObj) + "&_a=" + rison.encode(aObj);

  return finalUrl;
}

//for starting jpm with nightly ff and correct url: 
/*
jpm run -b "C:\Program Files\Nightly\firefox.exe" --binary-args "http://192.168.1.138:5601/app/kibana#/discover?_g=(refreshInterval:(display:Off,pause:!f,value:0),time:(from:now-15m,mode:quick,to:now))&_a=(columns:!(_source),index:car_index,interval:auto,query:(query_string:(analyze_wildcard:!t,query:%27*%27)),sort:!(timestamp,desc))"

2016-09-28T19:05:15.748Z
YYYY-MM-DDTHH:mm:ss.SSS[Z]

{"refreshInterval":{"display":"Off","pause":false,"value":0},"time":{"from":"now-15m","mode":"quick","to":"now"}}

[
  "#/discover?_g=(refreshInterval:(display:Off,pause:!f,value:0),time:(from:now-15m,mode:quick,to:now))",
  "_a=(columns:!(_source),index:car_index,interval:auto,query:(query_string:(analyze_wildcard:!t,query:%27*%27)),sort:!(timestamp,desc))"]

http://192.168.1.138:5601/app/kibana#/discover?_g=(refreshInterval:(display:Off,pause:!f,value:0),time:(from:%272016-09-28T19:05:15.748Z%27,mode:absolute,to:%272016-09-28T19:12:57.786Z%27))&_a=(columns:!(_source),index:car_index,interval:auto,query:(query_string:(analyze_wildcard:!t,query:%27*%27)),sort:!(timestamp,desc))*/