var selection = {};
var url = '';
var docs = [];
var findhost = "";
var findport = "";

$(function () {

    var db = '',
        c = '',
        exec = '';

    // HASH = From TCGAScope
    if (location.hash.length > 1) {

        console.log("HASH");
        url = location.hash.slice(1);
        if (findhost == "" && findport == "")
        {
            var arr = url.split(":");
            findhost = arr[0] + ":" + arr[1];
            findport = arr[2].substring(0, arr[2].indexOf("?"));
            console.log("findhost", findhost);
            console.log("findport", findport);
        }

        db = abcUtil.getQueryVariable('db', url);
        c = abcUtil.getQueryVariable('c', url);
        exec = abcUtil.getFindParm('analysis_id', abcUtil.getQueryVariable('find', url));
        setvars(db, exec, c);

    }
    else {

        console.log("SEARCH");
        // Search = Cohort characters
        if (location.search.length > 1) {

            var q = location.search.slice(1);
            if (q.indexOf("_ijt=") > -1)
            {
                // IDE stuff; just reload it.
                location.search = "";
            }
            else {
                // Cohort characters
                db = abcUtil.getQueryVariable('db', q);
                c = abcUtil.getQueryVariable('c', q);
                exec = abcUtil.getQueryVariable('exec', q);

                findhost = abcUtil.getQueryVariable('h', q);
                findport = abcUtil.getQueryVariable('p', q);

                console.log("findhost", findhost);
                console.log("findport", findport);

                setvars(db, exec, c);

            }
        }
        else {
            // Default
            console.log("DEFAULT");
            findhost = findAPIConfig.findAPI;
            findport = findAPIConfig.port;
            db = config.default_db;
            setvars(db, config.default_execution_id, db.substring(4));
        }

        url = findhost + ':' + findport + '?collection=patients&limit=1000&find={"analysis_id":"' + selection.execution_id + '"}&db=' + selection.db;
        console.log("url", url);

    }

    select = document.getElementById('select');
    select.innerHTML = abcUtil.selectBox({}, selection);
    /**
     * SELECT ONCLICK.
     * @param evt
     */
    tumorChanged = function (evt) {
        var opt = evt.selectedOptions[0].value;
        var partsOfStr = opt.split(',');

        setvars(partsOfStr[1], partsOfStr[2], partsOfStr[0]);

        url = findhost + ':' + findport + '?collection=patients&limit=1000&find={"analysis_id":"' + selection.execution_id + '"}&db=' + selection.db;

        if (location.search.length > 1) {
            var currentState = {foo: "bar"}; // just clear it without reloading
            history.pushState(currentState, "FeatureExplorer", "fig4.html");
        }

        if (location.hash.length > 1) {
            location.hash = '';
        }

        console.log('tumor changed', selection);
        getData(url);
    };
    getData(url);
});

function setvars(db, exec, c) {
    selection.db = db;
    selection.execution_id = exec;
    selection.cancer_type = c;
    if (!selection.findhost)
    {
        selection.findhost = findhost;
        selection.findport = findport;
    }

}

function getData(url) {

    //console.log(url);
    document.getElementById('msg').textContent = '';

    $.getJSON(url).then(function (data) {

        if (data.length == 0) {
            abcUtil.noDataJoy(url);
        }
        else {
            doFigure4(data);
            abcUtil.doPatients(data, 'bcr_patient_barcode', url);
            survivalPlot();
        }

    })
}

function doFigure4(data) {

    data = flatten(data);

    data = wrangle(data);

    showInfo(data);

    // unpack data into table, tab
    tab = {};
    var parms = Object.getOwnPropertyNames(data[0]);
    parms.forEach(function (p) {
        tab[p] = []
    });
    data.forEach(function (xi, i) {
        data[i].i = i;
        parms.forEach(function (p) {
            tab[p][i] = xi[p]
        })
    });

    docs = data;
    abcUtil.featureArrays(selection);
    var genomic = abcUtil.genomic;
    var features = abcUtil.features;

    // build table
    var h = '<table>';
    h += '<tr><td id="fig4_1" style="vertical-align:top">';
    h += '<h3 style="color:maroon">Cohorts</h3>';
    h += '<p style="color:maroon">Click on bars to select cohorts,<br>x-axis: # patients; y-axis: status<br>[<b style="color:blue">blue</b><b style="color:YellowGreen">-</b><b style="color:red">red</b>] color range indicates fraction of total.</p>';

    genomic.forEach(function (gen) {
        h += '<h4 style="color:navy" id="fig4_1_' + gen + '">' + gen + '</h4>';
    });

    h += '</td>';
    h += '<td id="fig4_2" style="vertical-align:top">';
    h += '<h3 style="color:maroon" data-toggle="tooltip" title="eg. nuclear morphology, features, patient demographics"><span class="lightup">Cohort character</span></h3>';
    h += '<p style="color:maroon">';
    h += 'Var 1: <select id="morphParm1"></select><br>';
    h += 'Var 2: <select id="morphParm2"></select><br>';
    h += 'Click and drag to select ranges<br>x-axis: parameter value, y-axis: # patients';
    h += '</p>';
    h += '<div id="fig4_2_1"><span style="color:blue">Var 1: </span></div>';
    h += '<div id="fig4_2_2"><span style="color:blue">Var 2: </span></div>';
    h += '</td>';
    h += '<td id="fig4_3" style="vertical-align:top">';
    h += '<h3 style="color:maroon">Survival<h3>';
    h += '<div id="survival"></div>';
    h += '<p style="font-size:small">Zoomable KM estimator (i.e. select ranges, each dot is a patient)</p>';
    h += '<div id="dcSurvival"></div>';
    h += '<div id="dcStatus"></div>';

    h += '</td>';
    h += '</tr></table>';
    section.innerHTML = h;

    // Parameterization
    features.sort(function (a, b) {
        var val = (a.toUpperCase() > b.toUpperCase());
        if (val) {
            return 1
        } else {
            return -1
        }
    });

    searchParms = {};

    location.search.slice(1).split('&').forEach(function (pp) {
        pp = pp.split('=');
        searchParms[pp[0]] = pp[1]
    });

    // add search parms to list if they are not there
    if (searchParms.morph1) {
        if (features.indexOf(searchParms.morph1) == -1) {
            features.push(searchParms.morph1)
        }
    }
    if (searchParms.morph2) {
        if (features.indexOf(searchParms.morph2) == -1) {
            features.push(searchParms.morph2)
        }
    }

    features.forEach(function (p) {
        var op1 = document.createElement('option');
        op1.value = op1.textContent = p;
        morphParm1.appendChild(op1);
        var op2 = document.createElement('option');
        op2.value = op2.textContent = p;
        morphParm2.appendChild(op2)
    });
    morphParm1.style.width = morphParm2.style.width = 200;

    // harvest search parameters if any
    if (searchParms.morph1) {
        morphParm1.value = searchParms.morph1
    } else {
        morphParm1.value = features[0]; //"Roundness_median"
    }
    if (searchParms.morph2) {
        morphParm2.value = searchParms.morph2
    } else {
        morphParm2.value = features[1]; //"stdR_median"
    }

    /**
     * morphParm.onchange
     */
    morphParm1.onchange = morphParm2.onchange = function () {

        // Because you're going to lose everything upon page reload.
        location.search = '?morph1=' + morphParm1.value + '&morph2=' + morphParm2.value
            + '&db=' + selection.db
            + '&c=' + selection.cancer_type
            + '&exec=' + selection.execution_id
            + '&h=' + selection.findhost
            + '&p=' + selection.findport;

    };

    /**
     * Add survival information
     * Convert status into survival
     */
    survivalPlot = function () {

        // Setting up the first "trace" (x,y) for the Plotly graph
        // Status vs Months Followup
        trace0 = {
            x: tab.months_followup,
            y: tab.status,
            mode: 'lines'
        };

        // First, sift through the arrays and keep only the numeric values.
        var x = [], y = [], ind = [];
        trace0.x.forEach(function (value, index) {
            var xi = trace0.x[index]; // months_followup
            var yi = trace0.y[index]; // status
            if ((typeof(xi) == 'number') && (typeof(yi) == 'number')) {
                x.push(xi);
                y.push(yi);
                ind.push(index)
            }

        });

        // Sort months_followup and get array of indices.
        var indexArray = jmat.sort(x)[1];

        surv0 = {
            time: [],
            status: [],
            ind: []
        };

        // Sorted array
        indexArray.map(function (idxArrVal, index) {
            surv0.time[index] = x[idxArrVal];
            surv0.status[index] = y[idxArrVal];
            surv0.ind[index] = ind[idxArrVal];
        });

        /**
         * KM estimator
         * See: https://en.wikipedia.org/wiki/Kaplan%E2%80%93Meier_estimator#Formulation
         * Calculating survival for unique times
         *
         * @param status
         * @returns {number[]}
         */
        survCalc = function (status) { // status, ordered chronologically
            var currentObj = [status[0]];
            var numEl = status.length;
            var surv = [1];

            for (var i = 1; i < numEl; i++) {
                currentObj[i] = currentObj[i - 1] + status[i];
                surv[i] = surv[i - 1] * (1 - status[i] / (numEl - i));
            }
            return surv
        };

        surv0.yy = survCalc(surv0.status);
        trace0.x = surv0.time;
        trace0.y = surv0.yy;

        surv0.yy.forEach(function (yi, i) {
            data[surv0.ind[i]].KM = yi; // recording Kaplan Meier in the original docs
        });

        // now only for the selected patients
        if (typeof(dcSurv) != "undefined") {
            // Setting up the second "trace" (x,y) for the Plotly graph
            // Status vs Months Followup
            trace1 = (function () {

                /*
                // Copy dcStatus.G.all() into xy.
                // Each element looks something like this:
                {
                    "key": [ 0, 1 ],
                    "value": 1
                }
                */
                var xy = dcStatus.G.all().filter(function (xyi) {
                    return xyi.value
                });

                var x = [], y = [];
                xy.map(function (xyi, i) {
                    x[i] = xyi.key[0];
                    y[i] = xyi.key[1]
                });

                var indexArray = jmat.sort(x)[1];
                x = [];
                y = [];
                indexArray.forEach(function (idxArrVal, index) {
                    // typeof(xy[i].key[0]) is usually a number.
                    // There might have been (maybe still potential for) a scenario where the value was empty.
                    // So we are protecting the next two lines from that situation.
                    if (xy[idxArrVal].key[0] !== "") {
                        x.push(xy[idxArrVal].key[0]);
                        y.push(xy[idxArrVal].key[1])
                    }

                });

                var numEl = x.length;
                var surv = [1];
                for (var i = 1; i < numEl; i++) {
                    surv[i] = surv[i - 1] * (1 - y[i] / (numEl - i));
                }

                return {
                    x: x,
                    y: surv
                }
            })()
        }


        var layout = {
            title: 'Blue - whole population; Orange - selected cohort',
            showlegend: false,
            xaxis: {
                range: [0, 250],
                type: "linear",
                title: "months followup"
            },
            yaxis: {
                range: [0, 1],
                type: "linear",
                title: "Survival (Kaplan Meier estimator)"
            }
        };

        survival.style.width = '600px';
        survival.style.height = '500px';


        var plotData = [];
        if (typeof(trace1) !== 'undefined') {
            plotData = [trace0, trace1]
        } else {
            plotData = [trace0]
        }

        // Draw main Survival graph
        Plotly.newPlot('survival', plotData, layout);

    };

    // Calculate "Zoomable KM estimator" graph data
    survivalPlot();

    docs = data;

    /**
     * Cross filter
     * When subset of cohort graph is selected, survival graphs change
     * @param parm = the variable name of the cohort graph that was selected.
     */
    var onFiltered = function (parm) {
        // If we turn off survival plot here, only 1st KM graph is affected.
        survivalPlot(parm);

        var ind = [];
        var bcr = [];

        // For Diagnostic Images:
        dcStatus.G.all().forEach(function (d, i) {
            // If the value > 0, we selected it.
            if (d.value > 0) {
                ind.push(i)
            }

        });
        ind.forEach(function (i) {
            bcr.push(docs[i])
        });
        abcUtil.doPatients(bcr, 'bcr_patient_barcode');

    };

    var cf = crossfilter(data);

    gene = {};

    /**
     * Gene Plot, AKA "Cohorts", 1st column on page.
     *
     * @param gn
     * @returns {{}|*}
     */
    genePlot = function (gn) { // gene name
        gene[gn] = {};
        gene[gn].R = {
            absent: 0, // aka "low"
            present: 0, // aka "high"
            NA: 0
        };

        // The chart for 'this' gene
        gene[gn].C = dc.rowChart("#fig4_1_" + gn);

        // Map gene value to bar label
        gene[gn].D = cf.dimension(function (d) {
            if (d[gn] === 0) {
                return 'absent'
            } else if (d[gn] === 1) {
                return 'present'
            } else {
                return 'NA'
            }
        });

        // Tally number of elements for each bar
        gene[gn].G = gene[gn].D.group().reduce(
            // reduce in
            function (p, v) {
                if (v[gn] === 0) {
                    gene[gn].R.absent += 1;
                    return gene[gn].R.absent
                } else if (v[gn] === 1) {
                    gene[gn].R.present += 1;
                    return gene[gn].R.present
                } else {
                    gene[gn].R.NA += 1;
                    return gene[gn].R.NA
                }
            },
            // reduce out
            function (p, v) {
                if (v[gn] === 0) {
                    gene[gn].R.absent -= 1;
                    return gene[gn].R.absent
                } else if (v[gn] === 1) {
                    gene[gn].R.present -= 1;
                    return gene[gn].R.present
                } else {
                    gene[gn].R.NA -= 1;
                    return gene[gn].R.NA
                }
            },
            //ini
            function () {
                return 0
            }
        );

        try {
            // Render the chart
            gene[gn].C
                .width(500)
                .height(100)
                .margins({top: 10, right: 50, bottom: 30, left: 40})
                .dimension(gene[gn].D)
                .group(gene[gn].G)
                .elasticX(true)
                .colors(d3.scale.linear().domain([0, 0.5, 1]).range(["blue", "yellow", "red"]))
                .colorAccessor(function (d, i) {
                    if (typeof gene[gn] != 'undefined') {
                        var na = gene[gn].R.NA;
                        var present = gene[gn].R.present;
                        var absent = gene[gn].R.absent;
                        return d.value / (na + present + absent);
                    }
                })
                .on('filtered', function () {
                    onFiltered(gn)
                });

        }
        catch (err) {
            console.log('gn', gn);
            console.log(err.message);
        }

        return gene
    };


    genomic.forEach(function (gen) {
        genePlot(gen);
    });

    // morphPlot
    morph = {};

    /**
     * Cohort graphs (middle column on page)
     *
     * @param divId
     * @param p
     * @returns {{}|*}
     */
    morphPlot = function (divId, p) {
        var div = document.getElementById(divId);
        div.innerHTML = p + '<br>';
        div.style.color = 'navy';
        div.style.fontWeight = 'bold';
        morph[p] = {};
        morph[p].R = {}; // RANGE values
        morph[p].C = dc.barChart('#' + divId); // CHART
        morph[p].D = cf.dimension(function (d) { // DIMENSION
            var v = d[p];
            if (v !== "") {
                return v
            } else {
                // nada
            }

        });

        morph[p].G = morph[p].D.group(); // GROUP

        var xx = tab[p].filter(function (v) {
            return typeof(v) == 'number'
        });

        var Xmin = xx.reduce(function (a, b) {
            return Math.min(a, b)
        });

        var Xmax = xx.reduce(function (a, b) {
            return Math.max(a, b)
        });

        var Xn = xx.length;

        morph[p].C
            .width(300)
            .height(280)
            //.x(d3.scale.linear())
            //.xUnitCount(function(){return 10})
            .xUnits(function () {
                return 50
            })
            .renderHorizontalGridLines(true)
            .renderVerticalGridLines(true)
            //.y(d3.scale.log().domain([1,100]).range([0,280]))
            .x(d3.scale.linear().domain([Xmin, Xmax]).range([0, 300]))
            .y(d3.scale.linear())
            //.y(d3.scale.log().domain([1,100]).range([1,100]))
            .elasticY(true)
            //.elasticX(true)
            .dimension(morph[p].D)
            .group(morph[p].G)
            .on('filtered', function () {
                onFiltered(p)
            });

        return morph

    };

    // Cohort graphs (middle column on page)
    morphPlot("fig4_2_1", morphParm1.value);
    morphPlot("fig4_2_2", morphParm2.value);

    /**
     * SURVIVAL
     */
    
    dcSurv = {
        R: []
    };

    dcSurv.C = dc.scatterPlot('#' + 'dcSurvival');
    dcSurv.D = cf.dimension(function (d) {
        return [d.months_followup, d.KM]
    });

    dcSurv.G = dcSurv.D.group();

    // "Zoomable KM estimator" graph
    dcSurv.C
        .width(500)
        .height(300)
        .x(d3.scale.linear().domain([0, 250])) //.domain([0, 20])
        .y(d3.scale.linear().domain([0, 1]))
        //.yAxisLabel("Survival (KM estimator)")
        //.xAxisLabel("months followup")
        //.symbolSize(8)
        //.clipPadding(10)
        .dimension(dcSurv.D)
        .group(dcSurv.G);

    dcStatus = {
        R: []
    };

    dcStatus.C = dc.scatterPlot('#' + 'dcStatus');
    dcStatus.D = cf.dimension(function (d) {
        return [d.months_followup, d.status]
    });

    dcStatus.G = dcStatus.D.group();

    // Small graph
    dcStatus.C
        .width(500)
        .height(100)
        .x(d3.scale.linear().domain([0, 250])) //.domain([0, 20])
        .y(d3.scale.linear().domain([-1, 2]))
        //.yAxisLabel("Survival (KM estimator)")
        //.xAxisLabel("months followup")
        //.symbolSize(8)
        //.clipPadding(10)
        .dimension(dcStatus.D)
        .group(dcStatus.G);

    // Renders "Zoomable KM estimator" and the small graph below it
    dc.renderAll();
    $('.dc-chart g.row text').css('fill', 'black');

}

function flatten(data) {

    var newArray = [];
    data.forEach(function (item) {
        var newObject = {};

        // clinical_features
        var feat = item.clinical_features;
        feat.forEach(function (f) {
            newObject[f.name] = f.value;
        });

        // genomic_features
        feat = item.genomic_features;
        feat.forEach(function (f) {
            newObject[f.name] = f.value;
        });

        // imaging_features
        feat = item.imaging_features;
        feat.forEach(function (f) {
            newObject[f.name] = f.value;
        });

        newArray.push(newObject);

    });

    return newArray;

}

function wrangle(oldArr) {
    return oldArr.map(function (item) {

        // Alive = 0
        // Dead = 1
        if ((item.vital_status != undefined) && isNaN(item.vital_status)) {

            if (item.vital_status === 'Alive') {
                item.vital_status = 0;
            }
            else if (item.vital_status === 'Dead') {
                item.vital_status = 1;
            }
            else {
                console.log('undead', item.vital_status);
                item.vital_status = 1;
            }

        }

        if (item.status == undefined) {
            item.status = item.vital_status;
        }

        // Convert days to last followup => months followup
        if (item.months_followup == undefined) {

            if (item.days_to_last_followup != undefined) {
                if (!isNaN(item.days_to_last_followup)) {
                    item.months_followup = (item.days_to_last_followup / 30);
                }
                else {
                    //NotAvailable
                    item.months_followup = 0;
                }

            }

            if ((item.months_followup == 0) && (item.days_to_death != undefined && !isNaN(item.days_to_death))) {
                item.months_followup = item.days_to_death / 30
            }

        }

        // Female = 1
        // Male = 0
        if ((item.gender != undefined) && isNaN(item.gender)) {
            if (item.gender === "FEMALE") {
                item.gender = 0;
            }
            else {
                item.gender = 1;
            }
        }

        return item;
    });

}

function showInfo(data) {

    var tt = '', tumor = '', tumor1 = '';
    if (data[0].Study) {
        tt = data[0].Study;
    }
    else {
        if (data[0].tumor) {
            tt = data[0].tumor;
        }
    }

    if (tt === '') {
        tt = selection.cancer_type;
    }

    if (tt === '') {
        console.log('Unknown tumor');
        document.getElementById('msg').textContent = "Unknown tumor.";
    }
    else {
        if (isNaN(tt)) {
            tumor = tt;
            tumor1 = tt.toLowerCase();
        }
        else {

            if (tt == 2) {
                tumor = 'Lung Adenocarcinoma';
                tumor1 = 'luad';
            }
            else {
                console.log('Unknown tumor type ', tt);
            }
        }
    }

    var infoDiv;
    var name = 'info2';
    if (!document.getElementById(name)) {
        // Element does not exist. Let's create it.
        infoDiv = document.createElement("div");
        infoDiv.id = name;
        document.body.appendChild(infoDiv);
    } else {
        // Element exists. Lets get it by ID.
        infoDiv = document.getElementById(name);
    }
    infoDiv.innerHTML = 'Morphology features extracted from image analysis of histology whole slide images for '
        + '<strong>' + data.length + ' ' + tumor + '</strong> Patients of The Cancer Genome Atlas.<br>'
        + 'Genomic data compiled with <a href="http://www.cbioportal.org/" target="_blank">MSKCC cBioPortal</a> tool, demographic and clinical data from '
        + 'the <a href="https://tcga-data.nci.nih.gov/tcgafiles/ftp_auth/distro_ftpusers/anonymous/tumor/' + tumor1 + '/bcr/biotab/clin/" target="_blank">TCGA repository</a>.';


}
