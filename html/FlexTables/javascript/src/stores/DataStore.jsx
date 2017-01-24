var Reflux = require('reflux');
var Actions = require('../actions/Actions.jsx');
var jQuery = require('jquery');
var _tableData;
var _pagingData;
var DataStore = Reflux.createStore({
  init: function(){
    this.listenTo(Actions.getDataFromURL, this.onRowClick);
  },
  getData: function(){
    return _tableData;
  },
  onRowClick: function(url){
    var self = this;
//    console.log(url)

    jQuery.get(url, function(data){
//        console.log(data)
        if(data == "Error"){
          _tableData = {"error": "error"};

        } else {
          data = JSON.parse(data);
          _tableData = data["data"];
          _pagingData = {
            "pageId": data["pageId"],
            "perPage": data["perPage"],
            "endPageId": data["endPageId"]

          };
        }
      self.trigger(_tableData);
    })
    //Trigger update
  },
  getPagingData: function(){
    return _pagingData;
  }

})

module.exports = DataStore;

