var selection = {};
var url = '';
var docs = [];
var findhost = "";
var findport = "";
var fscapeDiv;
var fscapeData;

$(function () {
    fscapeDiv = document.getElementById("section");

    //  check for data URL
    var q = '';
    if (location.search.length > 1) {
        var ss = location.search.slice(1).split(';');
        q = ss[0];

        if (q.indexOf("_ijt=") > -1) {
            // IDE stuff; just reload it.
            location.search = "";
        }
        else {
            // Query from url
            var arr = q.split(":");
            findhost = arr[0] + ":" + arr[1];
            findport = arr[2].substring(0, arr[2].indexOf("?"));
            if (findport.length == 5) {
                // sometimes it have trailing slash
                findport = findport.substring(0, 4);
            }
            console.log("findhost", findhost);
            console.log("findport", findport);
            // We just gonna pass q along to getData(), below.

        }

    }
    else {
        // Default
        selection.cancer_type = 'luad';
		findhost = findAPIConfig.findAPI;
        findport = findAPIConfig.port;
        console.log("findhost", findhost);
        console.log("findport", findport);

        q = createQuery(config.default_db, config.default_execution_id);
    }
    getData(q);
});

function getData(url) {
    console.log("*** getJSON ***");
    console.log(url);
    //document.getElementById('msg').textContent = "Fetching data, please wait ...";

    document.getElementById('msg').innerHTML = '<p>Processing...</p><br><img src="' + config.domain + '/img/ajax-loader.gif" border="0" alt=" photo ajax-loader.gif"/>';

    /*
    // Do like fig4.
    $.getJSON(url).then(function (data) {

        if (data.length == 0) {
            document.getElementById('msg').textContent = "Data not available";
        }
        else {
            document.getElementById('msg').textContent = "OK! Loading ...";
            doFeaturescape(data, url);
        }

    });
    */

    try {
        $.getJSON(url,
            function (data) {
                console.log("Success!");
                doFeaturescape(data, url);
            })
            .done(function () {
                console.log('getJSON request succeeded!');
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.log('getJSON request failed! ' + errorThrown);
                //console.log("error " + textStatus);
                //console.log("incoming Text " + JSON.stringify(jqXHR, null, 3));

                if (errorThrown) {
                    document.getElementById("msg").innerHTML = "getJSON request failed<br><pre>" + errorThrown + "</pre>";
                }
                else {
                    document.getElementById("msg").innerHTML = "getJSON request failed<br><pre>" + JSON.stringify(jqXHR, null, 3) + "</pre>That's all we know.";
                }

            });
    }
    catch (err) {
        // Control never gets passed here; just want to show we did indeed try it.
        document.getElementById("msg").innerHTML = err.message;
    }

}

function log(divID, txt, color) {
    var d = document.getElementById(divID);
    d.innerHTML = txt;
    d.style.color = ((!color) ? 'navy' : color);
}

function cleanUI() { // and create fscapeAnalysisDiv

    if (!document.getElementById('fscapeAnalysisDiv')) {
        $('<div id="fscapeAnalysisDiv"></div>').appendTo(fscapeDiv);
        fscapeAnalysisDiv.hidden = true;
        $(fscapeAnalysisDiv).show(1000)
    } else {
        fscapeAnalysisDiv.textContent = ''
    }
}

function doFeaturescape(data, url) {

    if (data.length == 0) {

        document.getElementById('section').innerHTML = '<span style="color:red">Data not available for patient:</span><br>'
            + getPatient(url);
        document.getElementById('msg').textContent = 'No data';

    }
    else {

        document.getElementById('msg').textContent = "Processing data";

        if (selection.cancer_type == null) {

            if (location.search.length > 1) {
                var hash = location.search.slice(1);
                selection.db = abcUtil.getQueryVariable('db', hash);
                selection.cancer_type = abcUtil.getQueryVariable('c', hash);
            }
            else {
                selection.cancer_type = 'unknown';
            }
        }

        // "VERSION 3"
        data = data.map(function (xi) {
            return xi.properties.scalar_features;
        });

        var nv = [];
        data.forEach(function (item) {
            var JSONArray = item[0]["nv"];

            var features = {};
            JSONArray.forEach(function (item) {
                features[item.name] = item.value;
            });

            nv.push(features);
        });

        var xx = nv;
        var p = getPatient(url);

        if (!selection.cancer_type) {
            selection.cancer_type = (selection.db).substring(4);
        }
        console.log(selection);

        var text = ' Displaying <strong>' + xx.length + '</strong> sets of features from '
            //+ (selection.cancer_type == 'unknown' ? '' : (selection.cancer_type).toUpperCase())
            //+ (p.length > 12 ? 'image ' : 'patient ')
            + (p.length > 12 ? 'image ' : 'image ')
            + '<strong>' + p + '</strong>';

        log('info1', text, 'black');

        cleanUI();

        plot(xx);
    }

}
function clust2html(cl) {
    var ind = cl[0];
    var T = cl[1];
    var cmap = jmat.colormap().map(function (ci) {
        return ci.map(function (cij) {
            return Math.round(cij * 255)
        })
    });

    var h = '<h4 style="color:maroon">Cross-tabulated feature correlations</h4>'
        + '<table id="featurecrossTB">';

    // header
    h += '<thead>';
    h += '<tr style="height:100px;vertical-align:bottom">';
    h += '<td style="color:navy">Variable</td>';
    ind.forEach(function (i, j) {
        h += '<td><span><div class="textColVertical" style="width:12px;transform:rotate(-90deg);font-size:12px">' + fscapeData.parmNum[i] + '</div></span></td>'

    });
    h += '</tr>';
    h += '</thead>';

    // body
    h += '<tbody>';
    ind.forEach(function (i, j) {
        h += '<tr><td>' + fscapeData.parmNum[i] + '</td>';
        T.forEach(function (c, k) {
            var x = Math.pow(c[j], 2); // E[0,1]
            if (isNaN(x)) {
                x = 1
            }
            var v = Math.round((1 - x) * 50);
            v = Math.min(v, 50);
            v = Math.max(v, 0);
            var cm = 'rgb(' + cmap[v].toString() + ')';
            h += '<td id="' + i + ',' + ind[k] + '" style="color:' + cm + ';background-color:'+cm+';font-size:' + (14 - 4 * c[j]) + '">O</td>';

        });
        h += '</tr>'
    });
    h += '</tbody>';
    h += '<tr><td colspan="' + T.length + '" align="right"><em>(click on symbols for densities)</em></td></tr>';
    h += '</table><p id="featuremoreTD"></p>';

    return h
}

// do it
function plot(x) { // when ready to do it
    fscapeAnalysisDiv.innerHTML = '<table id="fscapeAnalysisTab">'
        + '<tr><td id="featurecrossTD" style="vertical-align:top"></td>'
        + '<td id="featuremapTD" style="vertical-align:top"></td></tr>'
        + '<tr><td id="featureElseTD" style="vertical-align:top"></td>'
        + '<td id="featurecompTD" style="vertical-align:top"></td></tr></table>'
        + '<div id="featurecomputeDIV"></div>';
    //fscapeAnalysisDiv
    if (x) { // otherwise expect the data already packed in fscapeData
        fscapeData = {
            docs: x,
            tab: {}
        };

        Object.getOwnPropertyNames(x[0]).forEach(function (p) {
            fscapeData.tab[p] = x.map(function (xi) {
                return xi[p]
            })
        })
    }

    // featurecrossTD

    // numeric parameters
    var parmNum = Object.getOwnPropertyNames(fscapeData.tab).filter(function (p) {
        return typeof(fscapeData.docs[0][p]) == "number"
    });

    // cluster numeric parameters
    var xx = parmNum.map(function (p) {
        return fscapeData.tab[p]
    });

    // make sure they're all numbers
    ij2remove = [];
    xx.forEach(function (xi, i) {
        xi.forEach(function (xij, j) {
            if (typeof(xij) != 'number') {
                console.log('non-numeric value at (' + i + ',' + j + '), ' + xij); //+' - the whole row will be removed:',xi)
                ij2remove.push(j)
            }

        })
    });

    ij2remove = jmat.unique(ij2remove).sort().reverse();

    ij2remove.forEach(function (i) {
        xx = xx.map(function (xi) {
            xi.splice(i, 1);
            return xi; // remove row i
        })
    });

    var cc = jmat.arrayfun(jmat.crosstab(xx), function (cij) {
        return 1 - Math.abs(cij)
    });

    cc.forEach(function (ci, i) {
        ci[i] = 0; // diagonal by definition
    });

    var cl = jmat.cluster(cc);  // remember this has three output arguments
    fscapeData.cl = cl; // this may be better kept as a structure
    fscapeData.parmNum = parmNum;

    /*
    featurecrossTD.innerHTML = "<label>Click to choose a different cancer type &amp; tissue slide image:&nbsp;"
        + '<input type="button" class="btn btn-secondary" onclick="window.open(\''+location.href.slice(0,location.href.indexOf('?'))+'u24Preview.html#' + findhost + ':' + findport + '\')" name="btnSelect" id="btnSelect" value="Go!" />'
        + "</label><br><br>" + clust2html(cl);
    */
	
	featurecrossTD.innerHTML = "<label>Click to choose a different analysis &amp; tissue slide image:&nbsp;"
        + '<input type="button" class="btn btn-secondary" onclick="window.location.href=\'u24Preview.html#' + findhost + ':' + findport + '\'" name="btnSelect" id="btnSelect" value="Go!" />'
        + "</label><br><br>" + clust2html(cl);

    setTimeout(function () {

        var tdfun = function () {
            var ij = JSON.parse('[' + this.id + ']');
            if (ij.length > 0) {
                var i = ij[1], j = ij[0];
                var fi = fscapeData.parmNum[i];
                var fj = fscapeData.parmNum[j];
                if ($('#featuremapTD > table').length == 0) {
                    featuremapTD.innerHTML = 'zooming into <br>'
                        + '<li style="color:blue">' + fi + '</li>'
                        + '<li style="color:blue">' + fj + '</li>'
                        + '<span style="color:red">processing ...</red>'
                }
                // place an X on selection td, after clearing it all to "O"
                for (var tri = 0; tri < this.parentElement.parentElement.children.length; tri++) {
                    for (var tdj = 1; tdj < this.parentElement.parentElement.children[tri].children.length; tdj++) {
                        var txtC = this.parentElement.parentElement.children[tri].children[tdj];
                        if (txtC.textContent.length == 1) {
                            txtC.textContent = 'O'
                            txtC.style.border=''
                            txtC.align="center"
                            txtC.style.color=txtC.style.backgroundColor
                        }
                    }
                }

                this.textContent = "X";
                this.style.color='rgb('+this.style.backgroundColor.match(/[0123456789]+/g).map(function(x){return 255-parseInt(x)}).join(',')+')'
                this.style.border='solid'
                setTimeout(function () {
                    scatterPlot("featuremapTD", i, j);
                }, 0)
            }
        };

        var tdover = function (cut) {
            var ij = JSON.parse('[' + this.id + ']');
            if (ij.length > 0) {
                var i = ij[1], j = ij[0];
                var ind = fscapeData.cl[0];
                var ii = ind.indexOf(i), jj = ind.indexOf(j);
                var fi = fscapeData.parmNum[i];
                var fj = fscapeData.parmNum[j];
                var cBack = JSON.parse('[' + this.style.color.slice(4, -1).split(', ') + ']').map(function (c) {
                    return 255 - c
                }).toString();

                featuremoreTD.innerHTML = '<p style="background-color: ' + this.style.color + '; font-size: 3px">'
                    + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>'
                    + '<p style="color:navy">Pearson correlation between '
                    + '<li style="color:navy">' + fi + ' </li>'
                    + '<li style="color:navy">' + fj + '</li> '
                    + '|corr(' + ii + ',' + jj + ')|= '
                    + jmat.toPrecision(1 - fscapeData.cl[1][ii][jj])
                    + '</p><p style="background-color: ' + this.style.color + '; font-size: 3px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>';

                $(this).tooltip()[0].title = '< ' + fi + ' , ' + fj + ' >';
                this.parentElement.children[0].style.backgroundColor="yellow"
                this.parentElement.parentElement.parentElement.tHead.children[0].children[ii+1].style.backgroundColor="yellow"

            }
        };

        var tdleave = function(){
            this.parentElement.children[0].style.backgroundColor=""
            var jj = parseInt(this.id.split(',')[1])
            var ind=fscapeData.cl[0]
            var j = ind.indexOf(jj)
            this.parentElement.parentElement.parentElement.tHead.children[0].children[j+1].style.backgroundColor=""
        }

        $('td', featurecrossTB).click(tdfun);
        $('td', featurecrossTB).mouseover(tdover);
        $('td', featurecrossTB).mouseleave(tdleave);

        document.getElementById('msg').textContent = '';

    }, 0);

}

function scatterPlot(div0, i, j) {
    // feature names
    if (typeof(div0) == 'string') {
        div0 = document.getElementById(div0)
    }

    div0.innerHTML = '';
    var div = document.createElement('div');
    div0.appendChild(div);
    var fi = fscapeData.parmNum[i];
    var fj = fscapeData.parmNum[j];
    var x = fscapeData.tab[fi];
    var y = fscapeData.tab[fj];
    div.style.width = '600px';
    div.style.height = '500px';

    var trace0 = {
        mode: 'markers',
        type: 'scatter',
        symbol: 'cross-thin',
        marker: {
            size: 3
        },
        x: x,
        y: y
    };

    var layout = {
        xaxis: {
            title: fi,
            showline: false,
            showgrid: true
        },
        yaxis: {
            title: fj,
            showline: false,
            showgrid: true
        }
    };

    Plotly.newPlot(div, [trace0], layout);
    window.scrollTo(window.innerWidth, window.scrollY);

    console.log(div._fullLayout.xaxis._tmin, div._fullLayout.xaxis._tmax, div._fullLayout.yaxis._tmin, div._fullLayout.yaxis._tmax);

    //Click nuclear mugshots button to view the nuclei of interest.
    document.getElementById('lalainfo').textContent = 'Select region from scatterplot. Then click nuclear mugshots button to view the nuclei of interest.';
    var divZ = document.createElement('div');
    divZ.setAttribute('align', 'center');
    divZ.innerHTML = '<p><button id="resampleBt" class="btn btn-secondary" style="color:red">Nuclear mugshots from selection region</button></p>'
        + '<p id="resampleMsg"></p>';
    div.appendChild(divZ);
    $.getScript('zoomin.js')

    resampleBt.onclick = function () {

        // Plotly will attach the plot information to the div that you specify.
        var xmin = div._fullLayout.xaxis._tmin;
        var xmax = div._fullLayout.xaxis._tmax;
        var ymin = div._fullLayout.yaxis._tmin;
        var ymax = div._fullLayout.yaxis._tmax;

        var h = '<h4 style="color:maroon">resampling (x, y ranges)</h4>';
        h += '<p style="color:blue">' + fi + ': ' + xmin + ' , ' + xmax + '</p>';
        h += '<p style="color:blue">' + fj + ': ' + ymin + ' , ' + ymax + '</p>';
        resampleMsg.innerHTML = h;

        if (location.search.length > 1) {
            var f = abcUtil.getQueryVariable('find', location.search.slice(1));
            var str = decodeURI(f);
            str = JSON.parse(str);
            var s = 'provenance.image.subject_id';
            var patient = str[s];

            if (!patient) {
                s = 'provenance.image.case_id';
                patient = str[s];
            }

            var parm = (s.split('.'))[2];
            var m = location.search.match(findhost + '[^\;]+')[0];
            window.open(config.domain + "/nuclei-mugshots/#" + parm + "=" + patient + "&fx=" + fi + '&xmin=' + xmin + '&xmax=' + xmax + "&fy=" + fj + '&ymin=' + ymin + '&ymax=' + ymax + '&url=' + m);

        }
        else {
            window.open(config.domain + "/nuclei-mugshots/#case_id=" + case_id + "&fx=" + fi + '&xmin=' + xmin + '&xmax=' + xmax + "&fy=" + fj + '&ymin=' + ymin + '&ymax=' + ymax + '&url=' + query + '&c=' + selection.cancer_type);
        }

    };

}
function createQuery(db, exec) {
    document.getElementById('msg').textContent = "Creating query...";
    case_id = config.default_case_id;
    query = findhost + ':' + findport
        + '?limit=1000&find={"randval":{"$gte":' + abcUtil.randval() + '},'
        + '"provenance.analysis.execution_id":"' + exec + '","provenance.analysis.source":"computer",'
        + '"provenance.image.case_id":"' + case_id + '"}'
        + '&db=' + db;

    console.log("query", query);

    return query;
}

function getPatient(q) {
    if (!q) {
        return '';
    }
    else {
        var f = abcUtil.getQueryVariable('find', q);

        var p = abcUtil.getFindParm('provenance.image.subject_id', f);

        if (!p) {
            // Look for case_id
            p = abcUtil.getFindParm('provenance.image.case_id', f);
        }

        if (typeof p == 'undefined')
            p = '';

        return p;

    }

}
