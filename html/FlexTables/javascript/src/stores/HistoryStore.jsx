var Reflux = require('reflux');
var Actions = require('../actions/Actions.jsx');
var jQuery = require('jquery');


var _history = [""];

var DataStore = Reflux.createStore({
  init: function(){
    this.listenTo(Actions.rowClick, this.onRowClick);
  },
  getHistory: function(){
    return _history;
  },
  popRecent: function(){
    return (_history.splice(_history.length -2, 2))[0];
    //return _history[_history.length -2];
  },
  onRowClick: function(url, params){
    var self = this;
    console.log(params);
    _history.push(params);
    //Trigger update
  }
})

module.exports = DataStore;

