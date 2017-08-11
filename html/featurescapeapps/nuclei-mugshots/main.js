/**
 * Nuclear Mugshots.
 * Displays m by n matrix of tiles containing nuclear segmentations from diagnostic images.
 * Program can be called by itself; in which case, it gives a random selection of tiles of tumor type LUAD.
 * Or one can pass parameters indicating what to display.
 */
var mugshots, selection, thisisrandom, slides_not_found;
var findhost = "";
// var findport = "";

function buildQueryStr() {
    abcUtil.selectBox({}, selection);
    return (mugshots.findApi
        + '?collection=objects&limit=12&find={"provenance.analysis.execution_id":"'
        + selection.execution_id
        + '","provenance.analysis.source":"computer","randval":{"$gte":'
        + abcUtil.randval() + '}}&db='
        + selection.db);
}

function buildQueryString(q) {

    var fx = abcUtil.getQueryVariable('fx', q),
        xmin = abcUtil.getQueryVariable('xmin', q),
        xmax = abcUtil.getQueryVariable('xmax', q),
        fy = abcUtil.getQueryVariable('fy', q),
        ymin = abcUtil.getQueryVariable('ymin', q),
        ymax = abcUtil.getQueryVariable('ymax', q),
        db = abcUtil.getQueryVariable('db', q),
        c = abcUtil.getQueryVariable('c', q),
        base,
        find,
        myUrl,
        range_a,
        range_b;

    // Remember it stops at '='
    base = abcUtil.getQueryVariable('url', q);

    /*
    var arr = base.split(":");
    findhost = arr[0] + ":" + arr[1];
    findport = arr[2].substring(0, arr[2].indexOf("?"));
    console.log("findhost", findhost);

    if (findport.length == 5)
    {
        // sometimes it have trailing slash
        findport = findport.substring(0, 4);
    }
    console.log("findport", findport);
    */
    //mugshots.findApi = findhost + ':' + findport + '/';
    findApiEndpointUrl = base.substring(0, base.indexOf("?"));
    console.log("findApiEndpointUrl for mugshots " + findApiEndpointUrl);
    mugshots.findApi = findApiEndpointUrl;

    // Resample 50 (performance reasons); we're only rendering 12.
    base = base + '=50';

    // "find: {"randval":{"$gte":0.399},"provenance.analysis.execution_id":"luad:20160215","provenance.image.case_id":"TCGA-05-4244-01Z-00-DX1"}"
    find = abcUtil.getQueryVariable('find', q);
    // remove the last '}'
    find = find.substring(0, find.length - 1);

    selection.db = db;
    selection.cancer_type = c;
    selection.selected = selection.cancer_type;

    // Build our "find"
    range_a = '"$and":[{' + '"properties.scalar_features":{' + '"$elemMatch":{' + '"nv":{' + '"$elemMatch":{' + '"name":"' + fx + '",' + '"value":{' + '"$gte":' + xmin + '}}}}}},{' + '"properties.scalar_features":{' + '"$elemMatch":{' + '"nv":{' + '"$elemMatch":{' + '"name":"' + fx + '",' + '"value":{' + '"$lte":' + xmax + '}}}}}}]';
    range_b = '"$and":[{' + '"properties.scalar_features":{' + '"$elemMatch":{' + '"nv":{' + '"$elemMatch":{' + '"name":"' + fy + '",' + '"value":{' + '"$gte":' + ymin + '}}}}}},{' + '"properties.scalar_features":{' + '"$elemMatch":{' + '"nv":{' + '"$elemMatch":{' + '"name":"' + fy + '",' + '"value":{' + '"$lte":' + ymax + '}}}}}}]';

    myUrl = base + '&find=' + find + ',"$and":[{' + range_a + '},{' + range_b + '}]}';

    if (db) {
        myUrl = myUrl + '&db=' + db;
    }

    return myUrl;

}

function doMessage(name, location, text, color) {

    if (!document.getElementById(name)) {
        // Element does not exist. Let's create it.
        var div = document.createElement("div");
        div.id = name;
        div.innerHTML = text;
        div.style.color = color;
        location.appendChild(div);

    } else {
        // Element exists. Lets get it by ID.
        var div = document.getElementById(name);
        div.innerHTML = text;
        div.style.color = color;
    }

}

function doInfo(newData, query) {
    var fx, xmin, xmax,
        fy, ymin, ymax,
        id, parm, l,
        text = 'Displaying <strong>' + newData.length + '</strong> tiles containing nuclear segmentations';

    if (thisisrandom) {

        document.getElementById('info1').innerHTML = text + ' from random <strong>'
            + selection.cancer_type.toUpperCase()
            + ' <a href="#anchor">diagnostic images</a></strong>.'
            + ' May represent either a single or multiple patients.';

        abcUtil.doPatients(newData, 'case_id', query);

    } else {
        l = location.hash.slice(1);
        fx = abcUtil.getQueryVariable('fx', l);
        xmin = abcUtil.getQueryVariable('xmin', l);
        xmax = abcUtil.getQueryVariable('xmax', l);
        fy = abcUtil.getQueryVariable('fy', l);
        ymin = abcUtil.getQueryVariable('ymin', l);
        ymax = abcUtil.getQueryVariable('ymax', l);
        id = abcUtil.getQueryVariable('case_id', l);
        parm = 'case_id';

        if (!id) {
            id = abcUtil.getQueryVariable('subject_id', l);
            parm = 'subject_id';
        }

        if (!selection.cancer_type) {
            selection.cancer_type = (selection.db).substring(4);
            selection.selected = selection.cancer_type;
        }
        console.log("selection", selection);

        document.getElementById('info1').innerHTML = text + ' having morphologic ranges selected from '
            //+ selection.cancer_type.toUpperCase()
            //+ '</strong> '
            //+ (parm == 'case_id' ? 'diagnostic image' : 'patient') + ' <strong>' + id + '</strong>:';
            + (parm === 'case_id' ? ' image' : ' image') + ' <strong>' + id + '</strong>:';

        document.getElementById('info2').innerHTML =
            fx + ' between ' + xmin + ' and ' + xmax + '<br>' +
            fy + ' between ' + ymin + ' and ' + ymax;

    }
}

function parseData(data, size, query) {
    var newData = [],
        randomMembers,
        sameCaseId = true,
        prevCaseId = "",
        identifier = "",
        slideWidth = 0,
        slideHeight = 0,
        i;

    if (data.length > 12) {
        randomMembers = abcUtil.getRandomSubarrayPartialShuffle(data, size);
    } else {
        randomMembers = data;
    }

    // Determine whether we have multiple case ids or just one.
    for (i = 0; i < randomMembers.length; i++) {

        if (prevCaseId !== "" && prevCaseId !== randomMembers[i].provenance.image.case_id) {
            sameCaseId = false;
            break;
        }

        prevCaseId = randomMembers[i].provenance.image.case_id;

    }

    if (sameCaseId) {
        // Get info about the slide, once.
        //console.log("THUMBNAIL A " + mugshots.findApi + '?collection=' + config.imgcoll + '&limit=1&find={"case_id":"' + prevCaseId + '"}&db=' + selection.db);
        $.ajax({
            url: mugshots.findApi + '?collection=' + config.imgcoll + '&limit=1&find={"case_id":"' + prevCaseId + '"}&db=' + selection.db,
            async: false,
            dataType: 'json',
            success: function (json) {
                if (json.length > 0) {
                    identifier = json[0].filename;
                    slideWidth = json[0].width;
                    slideHeight = json[0].height;

                } else {
                    slides_not_found = true;

                }
            }
        });

    }

    // Reformat our data
    randomMembers.forEach(function (doc) {

        if (!sameCaseId) {
            // Get info about each slide.
            //console.log("THUMBNAIL B " + mugshots.findApi + '?collection=' + config.imgcoll + '&limit=1&find={"case_id":"' + doc.provenance.image.case_id + '"}&db=' + selection.db);
            $.ajax({
                url: mugshots.findApi + '?collection=' + config.imgcoll + '&limit=1&find={"case_id":"' + doc.provenance.image.case_id + '"}&db=' + selection.db,
                async: false,
                dataType: 'json',
                success: function (json) {
                    if (json.length > 0) {
                        identifier = json[0].filename;
                        slideWidth = json[0].width;
                        slideHeight = json[0].height;

                    } else {
                        slides_not_found = true;
                    }
                }
            });

        }

        newData.push({
            markup: doc.bbox,
            normalized: doc.normalized,
            case_id: doc.provenance.image.case_id,
            identifier: identifier,
            slideWidth: slideWidth,
            slideHeight: slideHeight
        });
    });


    if (slides_not_found) {
        newData = null;
    }
    else {
        doInfo(newData, query);
    }

    return newData;

}

function drawLines(canvas, context, obj) {
    var x = (canvas.width / 2),
        y = (canvas.height / 2),
        new_x = (x - (obj.w / 2)),
        new_y = (y - (obj.h / 2));

    // yellow rectangle
    context.beginPath();
    context.lineWidth = "2";
    context.strokeStyle = "yellow";
    context.rect(new_x, new_y, obj.w, obj.h);
    context.stroke();
}

function drawBackground(canvas, context, imgSrc, obj) {

    var imagePaper = new Image();

    imagePaper.onload = function () {
        context.drawImage(imagePaper, 0, 0);
        drawLines(canvas, context, obj);
    };
    imagePaper.src = imgSrc;
}

function draw(targetDiv, data, query, layout) {

    if (!layout) {
        layout = {
            title: 'Nuclear Mugshots',
            rows: 3,
            columns: 4
        };
    }

    //m rows and n columns
    if (!mugshots.m) {
        mugshots.m = layout.rows;
    }
    if (!mugshots.n) {
        mugshots.n = layout.columns;
    }

    if (!document.getElementById(targetDiv)) {
        $('<hr><div id="' + targetDiv + '"></div>').appendTo(document.body);
    }

    data = parseData(data, (mugshots.m * mugshots.n), query);

    if (slides_not_found) {
        abcUtil.clrMsg('');
        doMessage('msg', document.body, 'We have no slides for ' + selection.cancer_type + ' now. Please check back later. Thank you! :)', 'red');
    }
    else {
        var fragment = document.createDocumentFragment(),
            tbl = document.createElement('table'),
            idx = 0, i, j, row, col,
            scheme = 'http',
            region = '',
            iSize = 'full',
            rotation = '0',
            quality = 'default',
            format = 'jpg',
            obj, normalized, canvas, w, h, new_x, new_y, uri, link, context, imgSrc;

        var server = findhost.substring(7);
        if (!server) {
            server = config.iiifServer;
        }

        var prefix = config.iiifPrefix;
        console.log("build:", prefix, server);

        fragment.appendChild(tbl);

        // m rows
        for (i = 0; i < data.length; i++) {
            // for (i = 0; i < mugshots.m; i++) {
            if (i % mugshots.n === 0) {
                row = document.createElement('tr');
                tbl.appendChild(row);
            }

            // n columns
            // for (j = 0; j < mugshots.n; j++) {

            obj = {
                x: data[idx].markup[0],
                y: data[idx].markup[1],
                w: (data[idx].markup[2] - data[idx].markup[0]),
                h: (data[idx].markup[3] - data[idx].markup[1])
            };

            normalized = data[idx].normalized;
            if (normalized === 'true') {
                obj.x = obj.x * data[idx].slideWidth;
                obj.y = obj.y * data[idx].slideHeight;
                obj.w = obj.w * data[idx].slideWidth;
                obj.h = obj.h * data[idx].slideHeight;
            }

            // IIIF wants whole numbers.
            obj.x = Math.round(obj.x);
            obj.y = Math.round(obj.y);
            obj.w = Math.round(obj.w);
            obj.h = Math.round(obj.h);

            canvas = document.createElement('canvas');
            canvas.width = 150;
            canvas.height = 150;

            // Expand bounding box, with nucleus in center
            w = (canvas.width / 2);
            h = (canvas.height / 2);

            new_x = ((obj.x + (obj.w / 2)) - w);
            new_y = ((obj.y + (obj.h / 2)) - h);

            region = new_x + "," + new_y + "," + canvas.width + "," + canvas.height;

            uri = scheme + "://" + server + "/" + prefix + data[idx].identifier + "/" + region + "/" + iSize + "/" + rotation + "/" + quality + "." + format;

            link = document.createElement('a');


            link.setAttribute("href",
                abcUtil.caMicroLink(data[idx].case_id, selection.cancer_type, obj.x, obj.y, findhost));

            link.setAttribute("target", "_blank");
            col = document.createElement('td');

            // canvas.setAttribute('id', 'canvas' + j);
            canvas.setAttribute('id', 'canvas' + i);
            link.appendChild(canvas);
            col.appendChild(link);
            context = canvas.getContext("2d");

            imgSrc = uri;

            context.clearRect(0, 0, canvas.width, canvas.height);
            drawBackground(canvas, context, imgSrc, obj);
            row.appendChild(col);

            idx = idx + 1;
            // }
        }


        // Write the table to the html div.
        document.getElementById(targetDiv).appendChild(fragment);

        // Clear hash.
        //location.hash = '';

        // And finally...
        doMessage('msg', document.body, '', 'red');

    }
}

function getData(url) {

    abcUtil.clrMsg('');
    //doMessage('msg', document.body, 'loading, please wait ...', 'red');
    document.getElementById('msg').innerHTML = '<p>Processing...</p><br><img src="' + config.domain + '/img/ajax-loader.gif" border="0" alt=" photo ajax-loader.gif"/>';
    slides_not_found = false;

    try {
        $.getJSON(url).then(function (data) {

            // Object (nuclei) data
            if (data.length === 0) {
                abcUtil.noDataJoy(url);
            } else {
                draw('section', data, url);
            }

        });
    }
    catch (err) {
        slides_not_found = true;
        document.getElementById("info1").innerHTML = err.message;
    }


}

$(function () {

    selection = {};
    mugshots = {};
    var url, hash;

    if (location.hash.length > 1) {
        hash = location.hash.slice(1);
        thisisrandom = false;
        mugshots.n = abcUtil.getQueryVariable('n', hash);
        mugshots.m = abcUtil.getQueryVariable('m', hash);
        url = buildQueryString(hash);
    } else {
        // Default
        thisisrandom = true;
        //mugshots.findApi = findAPIConfig.findAPI + ':' + findAPIConfig.port + '/';
        mugshots.findApi = findAPIConfig.findAPI;
        url = buildQueryStr();
    }

    getData(url);

});
