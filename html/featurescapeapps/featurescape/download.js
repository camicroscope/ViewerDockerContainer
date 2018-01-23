console.log('download.js loaded')

downloadData=function(div){
    console.log('downloading ...')
    downloadData.getParms()
    // extract limit from url if provided
    if(downloadData.parms.url.match(/limit=\d+/)){
        downloadData.parms.limit=parseInt(downloadData.parms.url.match(/limit=(\d+)/)[1])
    }
    //div.innerHTML='<p id="downloadDataLimitMsg"></p>Maximum number of features to download: <input id="downloadDataLimitInput" size=6> <button class="btn btn-primary" id="downloadButton">Download</button>'
    //downloadDataLimitInput.value=100000
    //downloadData.parms.url=downloadData.parms.url.replace(/limit=\d+&/,'').replace(/"\$gte"\:[0123456789\.]+/,'"$gte":0')
    //downloadData.parms.url=downloadData.parms.url.replace('"randval":{"$gte":0},','')
    // 'properties.scalar_features.nv':
    
    downloadData.parms.url=downloadData.parms.url.replace(/limit=\d+&/,'').replace(/"\$gte"\:[0123456789\.]+/,'"$gte":0')
    div.innerHTML='<p id="downloadDataLimitMsg"></p>Maximum number of features to download: <input style="color:blue" id="downloadDataLimitInput" size=6> <button class="btn btn-primary" id="downloadButton" disabled>Start download</button><hr><!--<button id="saveFileJsonBt" class="btn btn-success" disabled>Save (partial) File as JSON</button>--> <button id="saveFileCsvBt" class="btn btn-success" disabled>Save (partial) File as CSV</button> (Chrome browser)'
    downloadDataLimitInput.value=100000
    downloadData.msg=function(m,c){
        downloadDataLimitMsg.style.color=c||'blue'
        downloadDataLimitMsg.innerHTML=m
    }

    var findQuery = function(pre){ //assemble find string where "randval":{"$gte":0} is
        pre=pre||''
        return downloadData.parms.url.replace('"randval":{"$gte":0},',pre+'"$and":[{"properties.scalar_features":{"$elemMatch":{"nv":{"$elemMatch":{"name" : "'+downloadData.parms.xTitle+'", "value" : {"$gte" : '+downloadData.parms.xmin+'}}}}}},{"properties.scalar_features":{"$elemMatch":{"nv":{"$elemMatch":{"name" : "'+downloadData.parms.xTitle+'", "value" : {"$lte" : '+downloadData.parms.xmax+'}}}}}},{"properties.scalar_features":{"$elemMatch":{"nv":{"$elemMatch":{"name" : "'+downloadData.parms.yTitle+'", "value" : {"$gte" : '+downloadData.parms.ymin+'}}}}}},{"properties.scalar_features":{"$elemMatch":{"nv":{"$elemMatch":{"name" : "'+downloadData.parms.yTitle+'", "value" : {"$lte" : '+downloadData.parms.ymax+'}}}}}}],')
    }

    downloadData.msg('estimating size of dataset ...','blue')
    //$.getJSON(downloadData.parms.url.replace('"$gte":0','"$gte":0.999')+'&limit=1000') // sample 1/1000th of the features
    $.getJSON(findQuery('"randval":{"$gte":0.999},')+'&limit=1000')
     .then(function(x){
         var n=x.length
         if(n>100){
             downloadData.msg('About '+n+',000 expected. That will take a while, for something faster maybe go back to the plot and select a smaller area','red')
         }else if(n>10){
             downloadData.msg('About '+n+',000 expected. It will take a few seconds to retrieve them','orange')
         }else{
             downloadData.msg('Fewer than 10,000 features expected, it woudn\'t take long to retrieve them all','green')
         }
         downloadData.parms.pn=n*1000 // predicted n
         downloadData.parms.x=x
         downloadButton.disabled=false
     })
     //downloadData.parms.urlFind=downloadData.parms.url.replace('"randval":{"$gte":0},','"$and":[{"properties.scalar_features":{"$elemMatch":{"nv":{"$elemMatch":{"name" : "'+downloadData.parms.xTitle+'", "value" : {"$gte" : '+downloadData.parms.xmin+'}}}}}},{"properties.scalar_features":{"$elemMatch":{"nv":{"$elemMatch":{"name" : "'+downloadData.parms.xTitle+'", "value" : {"$lte" : '+downloadData.parms.xmax+'}}}}}},{"properties.scalar_features":{"$elemMatch":{"nv":{"$elemMatch":{"name" : "'+downloadData.parms.yTitle+'", "value" : {"$gte" : '+downloadData.parms.ymin+'}}}}}},{"properties.scalar_features":{"$elemMatch":{"nv":{"$elemMatch":{"name" : "'+downloadData.parms.yTitle+'", "value" : {"$lte" : '+downloadData.parms.ymax+'}}}}}}],')
     downloadData.parms.urlFind=findQuery()

     downloadButton.onclick=function(){
         downloadButton.disabled=true
         downloadButton.textContent='Downloading ...'
         downloadData.msg('preparing download ...','red')
         // first find out what fields are there to retrieve
         /*
         var getFields=function(){
             var x = downloadData.propertiesArray(downloadData.parms.x)
         }
         getFields()
         */
         downloadData.getData()
         
     }
	 /*
     saveFileJsonBt.onclick=function(){
         
         jmat.saveFile(JSON.stringify(downloadData.dt),'features.json')
     }
	 */

     saveFileCsvBt.onclick=function(){
         var ff = Object.getOwnPropertyNames(downloadData.dt[0]).sort()
         var csv=ff.join(',')+'\n' // header
         downloadData.dt.forEach(function(r){
             var x = []
             ff.forEach(function(f){
                 x.push(r[f])
             })
             csv+=x.join(',')+'\n'
         })
         jmat.saveFile(csv.slice(0,-1),'features.csv')
         
     }

}

downloadData.propertiesArray=function(x){ // convert ns in an awway into an arra of ns
    return x.map(function(xi){
        var y = {}
        xi = xi.properties.scalar_features[0].nv.forEach(function(z){
            y[z.name]=z.value
        })
        return y
    })
}

downloadData.getParms=function(){ // extract parameters from url search
    downloadData.parms=downloadData.parms||{}
    location.search.slice(1).split('&')
     .forEach(function(pp){
         pp = pp.split('=')
         downloadData.parms[pp[0]]=decodeURIComponent(decodeURIComponent(pp[1]))
     })
    //var pp = decodeURIComponent(decodeURIComponent(location.search)).slice(1)
}

/*
downloadData.dataTabling=function(){
    //saveFileJsonBt.textContent='Save File as JSON'
    saveFileCsvBt.textContent='Save File as CSV'
    var div = document.getElementById('dataTabling')|| document.createElement('div')
    div.id='dataTabling'
    div.innerHTML='<hr>Variables:<div id="tableVars"></div><hr><button class="btn btn-success" id="showhideData">Tabulate Data</button><div id="tableData"></div>'
    downloadDataDiv.appendChild(div)
    downloadData.fieldsChecked=[]
    if(downloadData.dt.length>0){
        downloadData.fields=Object.getOwnPropertyNames(downloadData.dt[0]).sort()
        downloadData.fields.forEach(function(p,i){
            var sp = document.createElement('span')
            var ip = document.createElement('input')
            ip.type='radio'
            ip.value=p
            if(i<3){
                ip.checked=true
                ip.nocheck=false
                downloadData.fieldsChecked.push(p)
            } else {
                ip.checked=false
                ip.nocheck=true
            }
            var h = ' '+p
            sp.innerHTML = h
            sp.appendChild(ip)
            sp.style.color='navy'
            tableVars.appendChild(sp)
            ip.onclick=function(){
                this.nocheck=!this.nocheck
                this.checked=!this.nocheck
                if(this.nocheck){
                    downloadData.fieldsChecked.pop(downloadData.fieldsChecked.indexOf(this.value))
                } else {
                    downloadData.fieldsChecked.push(this.value) // add to list of selected fields
                }
                console.log(downloadData.fieldsChecked)
            }         
        })
    }
    showhideData.onclick=function(){
        var div = document.getElementById('tableData')
        div.innerHTML='' // clear if something is there
        div.appendChild(downloadData.docs2html(downloadData.dt,downloadData.fieldsChecked))
    }


        
    4
}
*/

// get the data

downloadData.dataTabling=function(){
    //saveFileJsonBt.textContent='Save File as JSON'
    saveFileCsvBt.textContent='Save File as CSV'
    var div = document.getElementById('dataTabling')|| document.createElement('div')
    div.id='dataTabling'
    div.innerHTML='<hr>Variables:<span><button class="btn btn-link" id="select_all_button">Select All</button><button class="btn btn-link" id="clear_all_button">Clear All</button></span><div id="tableVars"></div><hr><button class="btn btn-success" id="showhideData">Tabulate Data</button><div id="tableData"></div>'
    downloadDataDiv.appendChild(div)
    downloadData.fieldsChecked=[]
    if(downloadData.dt.length>0){
        downloadData.fields=Object.getOwnPropertyNames(downloadData.dt[0]).sort()
        downloadData.fields.forEach(function(p,i){
            var sp = document.createElement('span')
            var ip = document.createElement('input')
            ip.type='radio'
            ip.value=p
            
            ip.checked=false
            ip.nocheck=true
            
            
            if(i<3){
                ip.checked=true
                ip.nocheck=false
                downloadData.fieldsChecked.push(p)
            } else {
                ip.checked=false
                ip.nocheck=true
            }
            
            var h = ' '+p
            sp.innerHTML = h
            sp.appendChild(ip)
            sp.style.color='navy'
            tableVars.appendChild(sp)
            ip.onclick=function(){
                this.nocheck=!this.nocheck
                this.checked=!this.nocheck
                if(this.nocheck){
                    downloadData.fieldsChecked.pop(downloadData.fieldsChecked.indexOf(this.value))
                } else {
                    downloadData.fieldsChecked.push(this.value) // add to list of selected fields
                }
                console.log(downloadData.fieldsChecked)
            }
            
        })
        
        //start select all and clear all
        select_all_button.onclick = function(){
            var vrs = $('input',tableVars);vrs.map(i=>{vrs[i].checked=true});
            downloadData.fieldsChecked = Object.getOwnPropertyNames(downloadData.dt[0]).sort();
        }
        
        clear_all_button.onclick = function(){
            var vrs = $('input',tableVars);vrs.map(i=>{vrs[i].checked=false});
            downloadData.fieldsChecked.length = 0;
        }
        //end end select all and clear all
    }
    showhideData.onclick=function(){
        var div = document.getElementById('tableData')
        div.innerHTML='' // clear if something is there
        div.appendChild(downloadData.docs2html(downloadData.dt,downloadData.fieldsChecked))
    }


        
    4
}

downloadData.docs2html=function(docs,parms){
    parms = parms || Object.getOwnPropertyNames(docs[0])
    var tb = document.createElement('table')
    tb.cellSpacing='5px'
    var th = document.createElement('thead')
    tb.appendChild(th)
    var trh = document.createElement('tr')
    trh.style.fontSize='10px'
    trh.style.color='navy'
    th.appendChild(trh)
    parms.forEach(function(p){
        var td = document.createElement('td')
        td.textContent=p
        td.style.padding='3px'
        trh.appendChild(td)
    })
    var tbd = document.createElement('tbody')
    tb.appendChild(tbd)

    docs.forEach(function(d){
        var tr = document.createElement('tr')
        tr.style.fontSize='10px'
        tbd.appendChild(tr)
        parms.forEach(function(p){
            var td = document.createElement('td')
            td.style.padding='3px'
            td.textContent=d[p]
            tr.appendChild(td)
            4
        })
    })
    return tb
}

downloadData.getData=function(){
    var n =  1000 // at a time
    if(!downloadData.dt){downloadData.dt=[]}
    //if(!downloadData.parms.n){downloadData.parms.n=0}
    if(!downloadData.parms.lastId){
        var url= downloadData.parms.urlFind+'&limit='+n
    }else{
        //var url=downloadData.parms.urlFind.replace('find={','find={"_id":{"$gt":"'+downloadData.parms.lastId+'"},')+'&limit='+n
        var url= downloadData.parms.urlFind+'&limit='+n+'&offset="'+downloadData.parms.lastId+'"'
    }
    //url = url.replace('http://quip1.uhmc.sunysb.edu','http://129.49.249.191')
    $.getJSON(url)
     .then(function(x){         
         try{
             if(!Array.isArray(x)){x=[]}
             //downloadData.parms.n+=x.length
             if(x.length>0){
                 downloadData.parms.lastId=x.slice(-1)[0]._id
                 downloadData.dt=downloadData.dt.concat(downloadData.propertiesArray(x))
                 console.log(Date()+' n = '+downloadData.dt.length+', last _id = '+downloadData.parms.lastId)
             }
             downloadData.msg('features retrieved so far: '+downloadData.dt.length+' out of an estimated total of '+downloadData.parms.pn+' ...','orange')
             if((x.length==n)&(x.length<parseInt(downloadDataLimitInput.value))){
                 setTimeout(function(){
                    //downloadData.parms.urlFind = downloadData.parms.urlFind.replace('http://quip1.uhmc.sunysb.edu','http://129.49.249.191')
                    downloadData.getData()
                 },1000)
             }else{
                 downloadData.dt=downloadData.dt.slice(0,Math.min(downloadData.dt.length,parseInt(downloadDataLimitInput.value)))
                 var N=downloadData.dt.length
                 var M=Object.getOwnPropertyNames(downloadData.dt[0]).length
                 downloadData.msg('Data retrieval ended, '+N+' x '+M+' = '+(N*M)+' values retrieved','green') //, it can be resumed by clicking on Download','green')
                 downloadButton.disabled=false
                 downloadButton.textContent='New Download'
                 downloadButton.style.backgroundColor='orange'
                 downloadButton.style.color='green'
                 downloadButton.onclick=function(){
                     window.open(location.href)
                 }
                 // make data tables available
                 downloadData.dataTabling()
             }
             //saveFileJsonBt.disabled=false
             saveFileCsvBt.disabled=false
         }
         catch(err){
             console.log(Date()+' error:',x)
             setTimeout(function(){
                 downloadData.getData()
             },1000)
             
         }
             
     })
     .fail(function(err){
         downloadData.msg('Connection Error :-( ','red')
     })

    4
}



// Run
if(document.getElementById('downloadDataDiv')){
    downloadData(downloadDataDiv)
}
window.onload=function(){
    if(document.getElementById('downloadDataDiv')){
        downloadData(downloadDataDiv)
    }
}


/*
example
http://quip1.uhmc.sunysb.edu:3000/?limit=1000&find={%22randval%22:{%22$gte%22:0.17426561033975674},%22provenance.analysis.execution_id%22:%22luad:bg:20160520%22,%22provenance.image.case_id%22:%22TCGA-55-6543-01Z-00-DX1%22}&db=u24_luad


*/