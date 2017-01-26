var Reflux = require('reflux');
var jQuery = require('jquery');
var Actions = require('../actions/Actions.jsx');

var _config = {};
var ConfigStore = Reflux.createStore({
  init: function(){
    this.listenTo(Actions.init, this.onInit);
  },
  onInit: function(){
    var self = this;
    jQuery.get("index.php/getConfig", function(data){
      _config = JSON.parse(data);
      console.log(_config);
      self.trigger(data);
    })
  },
  getConfig: function(){
    return _config;
  }
});

module.exports = ConfigStore;
