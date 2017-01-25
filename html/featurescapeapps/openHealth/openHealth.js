/**
 * openHealth
 */
openHealth = function () {};

openHealth.ini = function () {
    this.buildUI = function () {};
    this.data = {}; // <-- put your data here
    this.getScript = function (src, fun) {
        if (Array.isArray(src)) { // multiple scripts are being loaded
            if (src.length == 1) {
                openHealth.getScript(src[0], fun);
            } else {
                openHealth.getScript(src[0], function () {
                    src.shift(); // remove [0]
                    openHealth.getScript(src, fun);
                });
            }
        } else {
            // check for the possibility that this is a css sheet
            if (src.match(/\.css/)) {
                var lk = document.createElement('link');
                lk.rel = 'stylesheet';
                lk.href = src;
                if (!!fun) {
                    lk.onload = fun;
                } // if there is a callback run it
                document.head.appendChild(lk);
                return src;
            } else { // it's javascript
                var s = document.createElement('script');
                s.src = src;
                if (!!fun) {
                    s.onload = fun;
                } // if there is a callback run it
                document.head.appendChild(s);
                return src; // I never know what to do about returns in asynchronous calls ...
            }
        }
    };

    this.require = function (libs, fun) { // load dependencies / extension libraries
        if (typeof(libs) == "string") {
            libs = [libs];
        }
        libs = libs.map(function (libi) {
            if (!libi.match(/\//)) {
                libi = libi + '/' + libi + '.js';
            } // say if ei is "tcga" it is converted into "tcga/tcga.js"
            return libi;
        });
        openHealth.getScript(libs, fun);
        return this;
    };

    this.docs2tab = function (docs) { // convert array of docs into table
        var F = Object.getOwnPropertyNames(docs[0]);
        var m = F.length; // number of fields
        var n = docs.length; // number of docs
        var tab = {};
        for (var j = 0; j < m; j++) {
            var Fj = F[j];
            tab[Fj] = []; // initialize array for jth field
            for (var i = 0; i < n; i++) {
                tab[Fj][i] = docs[i][Fj];
            }
            // recognize numeric types
            if (!tab[Fj].join('').match(/[^\d\.\s]/g)) {
                tab[Fj] = tab[Fj].map(function (xi) {
                    return parseFloat(xi);
                });
            }
        }
        return tab;
    };

    this.tab2docs = function (tab) {
        var docs = [];
        var F = Object.getOwnPropertyNames(tab);
        var n = tab[F[0]].length; // # rows
        var m = F.length; // # fields
        for (var i = 0; i < n; i++) {
            docs[i] = {};
            for (var j = 0; j < m; j++) {
                docs[i][F[j]] = tab[F[j]][i];
            }
        }
        return docs;
    };

    this.unique = function (x) { // x should be an Array
        if (typeof(x) == 'string') {
            x = x.split('');
        } // if it is a string, break it into an array of its characters
        var u = []; // store unique here
        u[0] = x[0];
        for (var i = 1; i < x.length; i++) {
            // check if x[i] is new
            if (u.map(function (ui) {
                    return ui === x[i]
                }).reduce(function (a, b) {
                    return a + b;
                }) == 0) {
                u[u.length] = x[i];
            }
        }
        return u;
    };

    this.transpose = function (x) { // transposes 2D array
        if (!Array.isArray(x[0])) {
            y = [x]
        } // in case x is a 1D Array
        else {
            var y = [],
                n = x.length,
                m = x[0].length;
            for (var j = 0; j < m; j++) {
                y[j] = [];
                for (var i = 0; i < n; i++) {
                    y[j][i] = x[i][j];
                }
            }
        }
        return y;
    };

    this.sort = function (x) { // [y,I]=sort(x), where y is the sorted array and I contains the indexes
        x = x.map(function (xi, i) {
            return [xi, i]
        });
        x.sort(function (a, b) {
            return a[0] - b[0]
        });
        return this.transpose(x);
    };

    this.createLog = function (h) { // create log div, if possible, within an existing openHealth div
        var div0 = document.getElementById("openHealth");
        if (!div0) {
            div0 = document.createElement('div');
            document.body.appendChild(div0);
        }
        var divLog = document.createElement('div');
        divLog.id = "openHealthJob";
        if (h) {
            divLog.innerHTML = h
        }
        div0.appendChild(divLog);
        return divLog;
    };

    this.startJobMsgURL = function () { // post URL of job into the div.id="msg" if it exists
        var divMsg = document.getElementById("msg");
        if (divMsg) {
            var sUrl = window.location.search.slice(1);
            if (sUrl.slice(-1) == "/") {
                sUrl = sUrl.slice(0, -1);
            }
            divMsg.innerHTML = 'Processing ... : <a href="' + sUrl + '" target=_blank>' + sUrl + '</a>';
            divMsg.style.color = "red";
        }
        this.createLog('<p style="color:red">Executing job, please wait ...</p>');
    };

    this.endJobMsgURL = function () { // post URL of job into the div.id="msg" if it exists
        var divMsg = document.getElementById("msg");
        if (divMsg) {
            divMsg.textContent = '';
            /*
             //document.getElementById("openHealthJob").innerHTML="";
             divMsg.style.color = "blue";
             var sUrl = window.location.search.slice(1);
             if (sUrl.slice(-1) == "/") {
             sUrl = sUrl.slice(0, -1)
             }
             divMsg.innerHTML = 'Processing ... done : <a href="' + sUrl + '" target=_blank>' + sUrl + '</a>';
             setTimeout(function() {
             var sUrl = window.location.search.slice(1);
             if (sUrl.slice(-1) == "/") {
             sUrl = sUrl.slice(0, -1)
             }
             divMsg.innerHTML = 'Script (<a href="' + sUrl + '" target=_blank>' + sUrl + '</a>) processed <i>' + new Date(Date.now()) + '</i>:';
             divMsg.style.color = "green";
             }, 1000)
             */

        }
    };

};

// initialize openHealth object
openHealth.ini();

// run external analysis if called with a search argument
window.onload = function () {
    if (window.location.search.length > 0) {
        var sUrl = window.location.search.slice(1);
        console.log("sUrl", sUrl);
        if (sUrl.indexOf("_ijt=") > -1)
        {
            // IDE stuff; just reload it.
            window.location.search = "";
        }

        openHealth.startJobMsgURL();
        openHealth.getScript(window.location.search.slice(1).replace(/\/$/, ''), function () {
            openHealth.endJobMsgURL();
        });
    }
};
