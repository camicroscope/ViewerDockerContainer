var React = require('react');


var FixedDataTable = require('fixed-data-table');

var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var jQuery = require('jquery');
var ColumnGroup = FixedDataTable.ColumnGroup;
var Reflux = require('reflux')

var ReactDOM = require('react-dom');

var mui = require("material-ui");
var AppBar  = mui.AppBar;
//var Paper = mui.Paper;
var RaisedButton = mui.RaisedButton;
var Toolbar = mui.Toolbar;
var ToolbarGroup = mui.ToolbarGroup;
var TextField = mui.TextField;
var FlatButton = mui.FlatButton;
var CircularProgress = mui.CircularProgress;
var IconButton = mui.IconButton;
var ThemeManager = new mui.Styles.ThemeManager();
var Colors  = mui.Styles.Colors;
//ThemeManager.
//
//console.log(ThemeManager.getMuiTheme())
var Actions = require('./actions/Actions.jsx')

var ConfigStore = require('./stores/ConfigStore.jsx');
var DataStore = require('./stores/DataStore.jsx');
var HistoryStore = require('./stores/HistoryStore.jsx');

var injectTapEventPlugin = require("react-tap-event-plugin");

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();



var PAGEID=0;
var PERPAGE=100;
var isColumnResizing;
var COLUMNWIDTHS={};

var init = function(){
    Actions.init();

}

var WIDTH = 1156;


var PaginationPanel = React.createClass({
  render: function(){
    var self = this;
    var pageId = this.props.pagingData.pageId;
    var endPageId = this.props.pagingData.endPageId;
    var pagesArray = Array.apply(null, Array(endPageId)).map(Number.prototype.valueOf,0);
    var Pages = pagesArray.map(function(o,i){
      var className="pageNumber";
      if(pageId == i){
        className += " activePage";

      }
      return(
        <div className={className} key={i} onClick={function(){
          self.props.handlePaging(i);
        }}>{i}</div>
      )
    });
    for(var i=0; i<endPageId; i++){
           
    }
    return(
      <div>{Pages}</div>
    );
  }
});

var BackButton = React.createClass({
  render: function(){
    if(this.props.pathState){
        return(
         <RaisedButton label="<< Back" />
 
        )
    } else {
      return(
        <div />
      )
    }
  }
});

var SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};

var ErrorPanel = React.createClass({

    render: function(){
        //console.log(IconButton);
        return(
            <div className="center" id="errorMsg">
                               
                Error Fetching data :(
            </div>
        )
    }
})

var TabHeaderPanel = React.createClass({
    
    render: function(){

    return(
        <div />
    )
    }

});

var InitTable = React.createClass({
  listenables: Actions,

  getInitialState: function(){
    pagingParams = "&perPage="+PERPAGE +"&pageId="+0;
  
    return {
      pathState: 0, 
      sortDir: null, 
      sortBy: null, 
      pageId:0, 
      perPage: PERPAGE,
      pagingParams: pagingParams

    };
  },
  onData: function(){
    var self = this;
    var data = DataStore.getData();
    //console.log(data);
    
    if(data && !data.error){
      //console.log("ddfd");
      self.setState({data: data, error: false});

    }
    else
      self.setState({error: true});
  },
  componentDidMount: function(){
    var self = this;
    self.unsubscribe = DataStore.listen(self.onData)

  },
  getPage: function(i, index){
    var self  = this;
    var pathState  = self.state.pathState;
    var config = ConfigStore.getConfig()["path"];
    self.setState({data: null});
    params = "";
    var history = HistoryStore.getHistory();
    //console.log(history);
   
    params = history[history.length - 1];
    if(!params){
      params = "";
    }
    var pagingParams = "&perPage="+PERPAGE +"&pageId="+i;
  
    var reqParams = config[pathState]["params"];
    var url = "index.php/getData?pathState="+ pathState+ "&" + reqParams + "="+ params[reqParams]+pagingParams, params; 
    Actions.getDataFromURL(url);
    //self.setState({pageId: i});
  },
  rowGetter: function(i){
    //console.log(this.state.data[i])
    var maxWidth = {};
    var row  = this.state.data[i];
    for(var j in row){
      var cell = row[j];
      var len = cell.length;
      maxWidth[j] = len;

    }
    //console.log(maxWidth);
    return (this.state.data[i]);
  },
  onFilter: function(e){
    var filterString = this.state.filterString || "";
    var pathState = this.state.pathState || 0;
    var urlParams = this.state.urlParams || "";
    var pagingParams = this.state.pagingParams || "" ;
    var self = this;
    //console.log(pagingParams);
    var filterParam = "";
    filterString = e.target.value;
    if(filterString.length > 0){
      self.setState({data: {}});
      filterParam = "&filterBy="+filterString; 
    }
    self.setState({data: null});    
    
    var url = "index.php/getData?pathState="+pathState + urlParams + pagingParams  + filterParam;
    //console.log(url);
    Actions.getDataFromURL(url);
  },
  nextPath: function(event, index){

    var self  = this; 
    var pathState  = self.state.pathState;
    pathState++;  //Move to next path state

    var config = ConfigStore.getConfig()["path"];

    var row = self.state.data[index];
    var urlParams=  "";
    //Handle links
    //console.log(row);
    if(config[pathState].type == "link"){
      //console.log('redirecting');
      var params = config[pathState].params;
      var paramCount = 0;  
      //urlParams = "";
      for(var i in params){
        //console.log(params[i].name);
        if(paramCount == 0)
          urlParams += params[i].name + "="+row[params[i].value];   
        else
          urlParams += "&"+ params[i].name + "="+row[params[i].value];   
 
        paramCount++;
      }
      window.location = config[pathState].url+"?"+urlParams;
      return;
    }
    self.setState({data: null, pageId:0, pagingParams: "", sortBy: "", sortDir: "", filterString: ""}); //Back to page 0 and show loading... panel while fetching data.



    var pathStateParams = "pathState="+pathState;

    
    var row = self.state.data[index];
    var pagingParams = "&perPage="+PERPAGE +"&pageId="+0;
  
    var configParams = config[pathState]["params"];
    var urlParams = "";    
    for(var i in configParams){
      var param = configParams[i];
      var urlParam = "&" + param+"="+row[param];
      urlParams+=urlParam;
    }
    //console.log(config[pathState]); 

    var url = "index.php/getData?"+ pathStateParams + urlParams + pagingParams;
    //console.log(url);
    Actions.getDataFromURL(url, row);
    Actions.rowClick(url, row);
    this.setState({pathState: pathState, urlParams: urlParams, pagingParams: pagingParams});
  },
  _onBack: function(){
    var params = (HistoryStore.popRecent());
    var pathState = this.state.pathState -1;
    var urlparams = "";
    if(params){
      for(var i in params){
        urlparams = "&" + i + "=" + params[i];
      }
    }
    var pagingParams = "&perPage="+PERPAGE +"&pageId="+0;
    this.setState({data: null});
    var url = "index.php/getData?pathState="+ pathState + urlparams + pagingParams;
    Actions.getDataFromURL(url);

    this.setState({pathState: pathState, urlParams: urlparams, pagingParams: pagingParams});
  },
  _sortRowsBy: function(cellDataKey){
    /*
    var self = this;
    var data = self.state.data;
    */
    var sortBy = cellDataKey;
    
    if(sortBy == this.state.sortBy){
        sortDir = this.state.sortDir === SortTypes.ASC ? SortTypes.DESC : SortTypes.ASC;
        
    } else {
        sortDir = SortTypes.DESC;
    }

  /*
    data.sort(function(a,b){
        var sortVal = 0;
        if(a[sortBy] > b[sortBy]){
            sortVal = 1;
        }
        if(a[sortBy] < b[sortBy]){
            sortVal = -1;
        }
    
        if(sortDir === SortTypes.DESC){
            sortVal =  sortVal * -1;
        }


        return sortVal;

    });
    */
    var pathState = this.state.pathState || "";
    var urlParams = this.state.urlParams || "";
    var pagingParams = this.state.pagingParams || "" ;
    //console.log(pagingParams);
    this.setState({data: null});
    var url = "index.php/getData?pathState="+pathState + urlParams + pagingParams + "&sortBy="+cellDataKey + "&sortDir="+sortDir;
    //console.log(url);
    Actions.getDataFromURL(url);
    this.setState({sortBy: sortBy, sortDir: sortDir}  );
  },
   
  renderHeader: function(label, cellDataKey){
    //console.log(label);
    return(
        <div>
        <a onClick={this._sortRowsBy.bind(null,cellDataKey)}>{label}</a>
        </div>
    );
  },
  _onColumnResizeEndCallback(newColumnWidth, dataKey) {
    //console.log(newColumnWidth);
    //console.log(dataKey);
    COLUMNWIDTHS[dataKey] = newColumnWidth;
    //console.log(COLUMNWIDTHS);
    isColumnResizing = false;
    this.forceUpdate(); // don't do this, use a store and put into this.state!
  },

  render: function(){


    var self = this;
    var config = ConfigStore.getConfig();  
    var sortDirArrow = '';
    
    if (this.state.sortDir !== null){
      sortDirArrow = this.state.sortDir === SortTypes.DESC ? ' ↓' : ' ↑';
    }
    //console.log(self.state.error); 
    if(self.state.error){
      return(
        <div className="center">
            <ErrorPanel />
        </div>  
      )
    }
    
    if(self.state.data && !self.state.error){
      var pagingData = DataStore.getPagingData();
      //console.log(pagingData);
      var data = self.state.data;
      var keys = [];
      for(var i in data[0]){
        keys.push(i)
      }
      var nColumns = keys.length;
      var id = 0;
      var Columns = keys.map(function(column){
        //console.log(column);
        //console.log(column.length);
        id++;
        return(
          <Column
            label={column + " "+(self.state.sortBy === column ? sortDirArrow : '')}
            width={COLUMNWIDTHS[column] || column.length*10 + 40}
            dataKey={column }
            className="tabCols"
            flexGrow={2}
            isResizable={true}
            headerRenderer={self.renderHeader}     
            key={id}
          />
        )
      });
    }
    console.log(self.state.data);
    return(

      <div className="container">
            <div>
          <ToolbarGroup key={0} float="left">

            { self.state.pathState > 0 ? 
            <div onClick={self._onBack} className="backLink" title="Go Back">  
                <BackButton pathState={self.state.pathState} />
            </div>  
            :
            <div />
            }
            <h4 id="tableHeading">{config["path"][self.state.pathState]["name"]}</h4>   

          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
              <TextField
                hintText="Filter" 
                onChange={self.onFilter}
                />
          </ToolbarGroup>
            </div>

        {
        self.state.data ? 
            <div className="row">   
              <Table
              rowHeight={50}
              rowGetter={self.rowGetter}
              rowsCount={self.state.data.length}
              width={WIDTH}
              height={400}
              headerHeight={50}
              isColumnResizing={isColumnResizing}
              onColumnResizeEndCallback={this._onColumnResizeEndCallback}
              overflowX={"auto"}
              onRowClick={self.nextPath}>
                {Columns}
              </Table>
              <PaginationPanel handlePaging={self.getPage.bind(this)}pagingData={pagingData} />
            </div>
        :
             <div className="row center" id="loading">        
                <CircularProgress mode="indeterminate" size={1.5} />
             </div>
         }        
      </div>

    )
    
  }
});

var App = React.createClass({
  listenables: Actions,

  // Important!
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  // Important!
  getChildContext: function() { 
        console.log(this.state.muiTheme);
        ThemeManager.setPalette({
            primary1Color: "#1976D2"
        });     
        console.log(ThemeManager.getCurrentTheme());
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },
  getInitialState: function(){
    return {config: null};
  },
  componentDidMount: function(){
    var self = this;
    self.unsubscribe = ConfigStore.listen(self.onConfig);
    init();
 
  },
  onConfig: function(){
    var config = ConfigStore.getConfig();
    var pagingParams = "&perPage="+PERPAGE +"&pageId="+PAGEID;
    var url = "index.php/getData?pathState=0"+pagingParams;
    console.log(url);
    Actions.getDataFromURL(url);

    this.setState({config: config});
  },
  render: function(){

    var config = this.state.config;
    //console.log(config);
    //console.log(config);
    
    if(config){
    //console.log(config);
    return(
    <div> 
        <AppBar
          title={config.title}
          iconElementLeft={<div /> 
          }
        iconElementRight={<FlatButton label="Help" />}
        />
      <div id="whoosh">

        <div id="whooshTable">
            <div className="center description">
                <p>         {config.description || ""}</p>
            </div>

          <InitTable/>
        </div>
      </div>
    </div>
    )
    } else {
      return <div />
    }

  }
})

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
