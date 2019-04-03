var main;
var indexmain=-1;
var arrmax=5;
function main_menu_co(){
	
var text_data="";
document.body.style.background = "#ffffff";

 document.getElementById("search").placeholder = "Author name , Group";
 
document.getElementById("bt_reset_graph").style.display = "block";
document.getElementById("bt_co").style.display = "block";
document.getElementById("bt_ex").style.display = "none";
document.getElementById("bt_venue").style.display = "none";

document.getElementById("top_text").innerHTML = "Graph Co-author : expresses the co-authors relationship.";

document.getElementById("more_w").style.display = "block";
document.getElementById("more_q").style.display = "block";
document.getElementById("image1_more").style.display = "block";

document.getElementById("group_author").style.display = "block";
document.getElementById("Expertise_type").style.display = "none";
document.getElementById("venue_type").style.display = "none";

document.getElementById("howto").style.display = "none";
document.getElementById("apDiv2").style.display = "none";
document.getElementById("group_author").style.display = "block";
var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var myObj = JSON.parse(this.responseText);
			main=myObj	
		}
	};
	xmlhttp.open("GET", "nodetestid2big.json", true);
	xmlhttp.send();
	
	d3.json("nodetestid2big.json", function(error, graph) {
		newgraphCo(graph,0)
		});
}

function newgraphCo(json,rounds){
	d3.selectAll("svg").remove();

var w = window.innerWidth;
var h = window.innerHeight;

var key1 = true, key2 = true, key3 = true, key0 = true

var focus_node = null, highlight_node = null;

var text_center = false;
var outline = false;

var min_score = 0;
var max_score = 1;

var color = d3.scale.linear()
  .domain([min_score, (min_score+max_score)/2, max_score])
  .range(["lime", "yellow", "red"]);

var highlight_color = "blue";
var highlight_trans = 0.1;
  
var size = d3.scale.pow().exponent(1)
  .domain([1,100])
  .range([8,24]);
	
var force = d3.layout.force()
  .linkDistance(60)
  .charge(-300)
  .size([w,h]);

var default_node_color = "#ccc";
//var default_node_color = "rgb(3,190,100)";
var default_link_color = "#888";
var nominal_base_node_size = 8;
var nominal_text_size = 10;
var max_text_size = 24;
var nominal_stroke = 1.5;
var max_stroke = 4.5;
var max_base_node_size = 36;
var min_zoom = 0.1;
var max_zoom = 7;
var svg = d3.select("body").append("svg");
var zoom = d3.behavior.zoom().scaleExtent([min_zoom,max_zoom])
var g = svg.append("g");
svg.style("cursor","move");



var linkedByIndex = {};
    json.links.forEach(function(d) {
	linkedByIndex[d.source + "," + d.target] = true;
    });

	function isConnected(a, b) {
        return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
    }

	function hasConnections(a) {
		for (var property in linkedByIndex) {
				s = property.split(",");
				if ((s[0] == a.index || s[1] == a.index) && linkedByIndex[property]) 					return true;
		}
	return false;
	}
	
  force
    .nodes(json.nodes)
    .links(json.links)
    .start();

  var link = g.selectAll(".link")
    .data(json.links)
    .enter().append("line")
    .attr("class", "link")
	.style("stroke-width",nominal_stroke)
	.style("stroke", function(d) { 
	if (isNumber(d.score) && d.score>=0) return color(d.score);
	else return default_link_color; })


  var node = g.selectAll(".node")
    .data(json.nodes)
    .enter().append("g")
    .attr("class", "node")
	
    .call(force.drag)

	
	node.on("dblclick.zoom", function(d) { d3.event.stopPropagation();
	var dcx = (window.innerWidth/2-d.x*zoom.scale());
	var dcy = (window.innerHeight/2-d.y*zoom.scale());
	zoom.translate([dcx,dcy]);
	 g.attr("transform", "translate("+ dcx + "," + dcy  + ")scale(" + zoom.scale() + ")");
	 
	 
	});
	


	
	var tocolor = "fill";
	var towhite = "stroke";
	if (outline) {
		tocolor = "stroke"
		towhite = "fill"
	}
		
	
	
  var circle = node.append("path")
  
  
      .attr("d", d3.svg.symbol()
        .size(function(d) { return Math.PI*Math.pow(size(d.size)||nominal_base_node_size,2); })
        .type(function(d) { return d.type; }))
  
	.style(tocolor, function(d) { 
	if (isNumber(d.score) && d.score>=0) return color(d.score);
	else return default_node_color; })
    //.attr("r", function(d) { return size(d.size)||nominal_base_node_size; })
	.style("stroke-width", nominal_stroke)
	.style(towhite, "white");
  	
				
  var text = g.selectAll(".text")
    .data(json.nodes)
    .enter().append("text")
    .attr("dy", ".35em")
	.style("font-size", nominal_text_size + "px")

	if (text_center)
	 text.text(function(d) { return d.id; })
	.style("text-anchor", "middle");
	else 
	text.attr("dx", function(d) {return (size(d.size)||nominal_base_node_size);})
    .text(function(d) { return '\u2002'+d.id; });

	node.on("mouseover", function(d) {
		//console.log(d);
		mouseover_show_paper(d);
	set_highlight(d);
	})
  .on("click", function(d) { d3.event.stopPropagation(); //************************mousedown ->> click
	document.getElementById("popup").style.display = "none";
	focus_node = d;
	set_focus(d)
	if (highlight_node === null) set_highlight(d)
	
}	).on("mouseout", function(d) {
		exit_highlight();
		document.getElementById("popup").style.display = "none";
}	);

		d3.select(window).on("mouseup",  
		function() {
		if (focus_node!==null)
		{
			focus_node = null;
			if (highlight_trans<1)
			{
	
		circle.style("opacity", 1);
	  text.style("opacity", 1);
	  link.style("opacity", 1);
	}
		}
	
	if (highlight_node === null) exit_highlight();
		});

function exit_highlight()
{
		highlight_node = null;
	if (focus_node===null)
	{
		svg.style("cursor","move");
		if (highlight_color!="white")
	{
  	  circle.style(towhite, "white");
	  text.style("font-weight", "normal");
	  link.style("stroke", function(o) {return (isNumber(o.score) && o.score>=0)?color(o.score):default_link_color});
 }
			
	}
}
var datacount;
var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var myObj = JSON.parse(this.responseText);
			datacount=myObj	
		}
	};
	xmlhttp.open("GET", "nodetestid2big.json", true);
	xmlhttp.send();
var datanode;
var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var myObj = JSON.parse(this.responseText);
			datanode=myObj	
		}
	};
	xmlhttp.open("GET", "nodetestid2big.json", true);
	xmlhttp.send();
var data;
var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var myObj = JSON.parse(this.responseText);
			data=myObj
			
			//document.getElementById("demo").innerHTML=text_data;
			//console.log(text_data);
			
		}
	};
	xmlhttp.open("GET", "clearbig.json", true);
	xmlhttp.send();
//**********************************************************************************
var indexnext=-1;

function set_focus(d)
{	
d3.selectAll(".node , .link , text")
		.style("opacity", 1);
	
	circle.style("opacity", 1);
	  text.style("opacity", 1);
	  link.style("opacity", 1);
if (highlight_trans<1)  {
    circle.style("opacity", function(o) {
                return isConnected(d, o) ? 1 : highlight_trans;
            });

			text.style("opacity", function(o) {
                return isConnected(d, o) ? 1 : highlight_trans;
            });
			
            link.style("opacity", function(o) {
			 //document.getElementById("demo").innerHTML=d.index;

                return o.source.index == d.index || o.target.index == d.index ? 1 : highlight_trans;
            });		

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var myObj = JSON.parse(this.responseText);
			
			var countnodes=sizeee(datacount.venue);
			if(rounds==0){
			json={
  "graph": [],
  "nodes":
  [],
	"links":
  [
    ], "directed": false, "multigraph": false
	}
	var text = '{"graph": [],' ;
	var indeD=d.index
	var maxnode=datanode.links.length;
	var arr=[indeD]
	var source=[]
	var target=[]
	indexmain=indeD
	for (var i=0;i<maxnode;i++){
		var c=0
		if(arr.length>arrmax){
					   break;
					   }
		if(datanode.links[i].source===indeD){
			for (var m=0;m<arr.length;m++){
				if(datanode.links[i].target===arr[m]){
					c=1
					}
				}
				if(c==0){
				arr.push(datanode.links[i].target)
					}
			}
		else if(datanode.links[i].target===indeD){
			for (var m=0;m<arr.length;m++){
				if(datanode.links[i].source===arr[m]){
					c=1
					}
				}
				if(c==0){arr.push(datanode.links[i].source)
					}
			}
		}
		
	for (var i=0;i<maxnode;i++){
		var c=0
		for(var no=0;no<arr.length;no++){
		if(datanode.links[i].source===arr[no]){
			for (var m=0;m<arr.length;m++){
				if(datanode.links[i].target===arr[m]){
					source.push(no)
					target.push(m)
					}
				}
			
			}
		else if(datanode.links[i].target===arr[no]){
			for (var m=0;m<arr.length;m++){
				if(datanode.links[i].source===arr[m]){
					target.push(no)
				source.push(m)
					}
				}
			}
			}
		}
		//console.log("arr:"+arr)
		text+='"nodes":['

		for(var i=0;i<arr.length;i++){
			//for(var i=0;i<arrmax;i++){
			if(i==0){
			text+='{"size":'+datanode.nodes[arr[i]].size+',"score":'+datanode.nodes[arr[i]].score+',"id":"'+datanode.nodes[arr[i]].id+'","type": "'+datanode.nodes[arr[i]].type+'","ids":"'+datanode.nodes[arr[i]].ids+'"}' 
			}
			else {
				text+=',{"size":'+datanode.nodes[arr[i]].size+',"score":'+datanode.nodes[arr[i]].score+',"id":"'+datanode.nodes[arr[i]].id+'","type": "'+datanode.nodes[arr[i]].type+'","ids":"'+datanode.nodes[arr[i]].ids+'"}'
				}
			}
//console.log("source:"+source)
//console.log("target:"+target)
text+='],"links":['
for (var i=0;i<source.length;i++){
	//for(var i=0;i<arrmax-1;i++){
	if(i==0){
		text+='{"source":'+source[i]+',"target":'+target[i]+'}'
		}
	else{
		text+=',{"source":'+source[i]+',"target":'+target[i]+'}'
		}
	}

text+='], "directed": false, "multigraph": false}';

obj = JSON.parse(text);
json=obj
newgraphCo(json,1)

				}
					else{var myObj = JSON.parse(this.responseText);
			document.getElementById("pls").innerHTML="";
			number=0
			//number=d.index
				for(var j=0;j<myObj.all.length;j++){
					if(json.nodes[d.index].ids===myObj.all[j].ids && json.nodes[d.index].size!=100 ){
						number=j
						//console.log("myobj:"+myObj.all[j].name);
						}
						if(json.nodes[d.index].id=== "Medline"){
							number=0
							break;
							}
							if(json.nodes[d.index].id=== "DBLP"){
							number=1
							break;
							}
					}
			var text_data ="";
			var countnodes=sizeee(datacount.nodes);
			var color_Bio=-1;
			var color_com=-1;
			
			var count_author_bio=0;
			var count_author_com=0;
			var text_bio ="";
			var text_com ="";
			text_data+="<U>Author List</U><br>";
			text_data+="_______________________________________<br>";
			for(var i =0 ;i<countnodes;i++){
				if(datacount.nodes[i].type==="circle"){
					color_Bio++;
					count_author_bio++;
					if(i>1 && datacount.nodes[i].type==="circle" )text_bio+="<br>Author "+(count_author_bio-1)+" : "+datacount.nodes[i].id;
				 }
				 else if(datacount.nodes[i].type==="square"){
					color_com++; 
					count_author_com++;
					if(i>1 && datacount.nodes[i].type==="square" )text_com+="<br>Author "+(count_author_com-1)+" : "+datacount.nodes[i].id;
				 }
			}
			document.getElementById("pls").innerHTML="";
			console.log(number)
			if(d.id=="Medline"){  ///number==0
			document.getElementById("demo").innerHTML="<font color=red>&ensp;Group: Biomedical<br>Total author: "+color_Bio+""+text_bio+"</font><br><br>";
			}
			else if(d.id=="DBLP"){ ///number==1
				 document.getElementById("demo").innerHTML="<font color=#66FF00>&ensp;Group: Computer Science<br>Total author: "+color_com +""+text_com+"</font><br><br>";
			}
			else{
		console.log(myObj.all[number-2].name);
			
			if(d.score==0){ //green
				text_data=" Author name: <font color=#66FF00>"+myObj.all[number].name+"<br></font>";
			}
			else if(d.score==1){ //red
				text_data=" Author name:<font color=red> "+myObj.all[number].name+"<br></font>";
			}
			
			text_data+="_______________________________________<br>";
			 //var myObject = (myObj.all[number-2].paper)
			 //var count = Object.keys(myObject).length; 

			text_data+="<U>Paper List</U><br>";
			var count = sizeee(myObj.all[number].paper);
			var countdata=sizeee(data.all);
			for(var i=0;i<count;i++){
				for (var c=0;c<countdata;c++){
					if(data.all[c].id===myObj.all[number].paper[i].id){
						if(data.all[c].sources[0]==="DBLP" )
						{
						text_data+="<font color=#66FF00>"+(i+1)+") Paper : "+"<a target ="+"_blank"+" href="+data.all[c].s2Url+">" +data.all[c].title+"</a></font><br>";
						text_data+="Year of paper : "+data.all[c].year+"<br>";
						var count_author_ofpaper=sizeee(data.all[c].authors);
						var number_coauthor=1;
							for(var k=0;k<count_author_ofpaper;k++)
							{
								if(data.all[c].authors[k].name!=d.id)
								{
									for(var g=0;g<countnodes;g++)
									{
										var texttemp="['"+data.all[c].authors[k].ids+"']";
										if(datacount.nodes[g].ids==texttemp){
											if(datacount.nodes[g].score==0)
											{
											text_data+="<font color=#66FF00>&ensp;"+number_coauthor+") Co-author : "+data.all[c].authors[k].name+"</font><br>";
											}
											if(datacount.nodes[g].score==1)
											{
											text_data+="<font color=red>&ensp;"+number_coauthor+") Co-author : "+data.all[c].authors[k].name+"</font><br>";
											}
											number_coauthor++;
										}
									}
								}
							}	
						}
						else if(data.all[c].sources[0]==="Medline")
						{
						text_data+="<font color=red>"+(i+1)+") Paper : "+"<a target ="+"_blank"+" href="+data.all[c].s2Url+">" +data.all[c].title+"</a></font><br>";
						text_data+="Year of paper : "+data.all[c].year+"<br>";
						var count_author_ofpaper=sizeee(data.all[c].authors);
						var number_coauthor=1;
							for(var k=0;k<count_author_ofpaper;k++)
							{
								if(data.all[c].authors[k].name!=d.id)
								{
									for(var g=0;g<countnodes;g++)
									{
										var texttemp="['"+data.all[c].authors[k].ids+"']";
										if(datacount.nodes[g].ids==texttemp){
											if(datacount.nodes[g].score==0)
											{
											text_data+="<font color=#66FF00>"+"&ensp;Co-author "+number_coauthor+": "+data.all[c].authors[k].name+"</font><br>";
											}
											if(datacount.nodes[g].score==1)
											{
											text_data+="<font color=red>"+"&ensp;Co-author "+number_coauthor+": "+data.all[c].authors[k].name+"</font><br>";
											}
											number_coauthor++;
										}
									}
								}
							}
						}
					}
						
				}text_data+="_______________________________________<br>";
			}
			

			text_data+="<br>";
			//text_data+="Expertise: "+myObj.all[number-2].expertise+"<br>";
			document.getElementById("demo").innerHTML=text_data;
			//console.log(text_data);"<br>";
			
			}
			if(indexnext==d.index){
				
					var rindex=0
					//console.log("sreach:"+json.nodes[d.index].size)
					if(json.nodes[d.index].size==100){
						var sreach=json.nodes[d.index].id
						//console.log("sreach:"+json.nodes[d.index].size)
						for(var i=0;i<datanode.nodes.length;i++){
						if(datanode.nodes[i].id===sreach){
							rindex=i;
						//	console.log("sreach:"+sreach)
							}
						}
						}else{
							var sreach=json.nodes[d.index].ids
							for(var i=0;i<datanode.nodes.length;i++){
						if(datanode.nodes[i].ids===sreach){
							rindex=i;
							}
						}
							}
					
	json={
  "graph": [],
  "nodes":
  [],
	"links":
  [
    ], "directed": false, "multigraph": false
	}
	var text = '{"graph": [],' ;
	var indeD=rindex
	var maxnode=datanode.links.length;
	var arr=[indeD]
	var source=[]
	var target=[]
	indexmain=indeD
	for (var i=0;i<maxnode;i++){
		var c=0
		if(arr.length>arrmax){
					   break;
					   }
		if(datanode.links[i].source===indeD){
			for (var m=0;m<arr.length;m++){
				if(datanode.links[i].target===arr[m]){
					c=1
					}
				}
				if(c==0){
				arr.push(datanode.links[i].target)
					}
			}
		else if(datanode.links[i].target===indeD){
			for (var m=0;m<arr.length;m++){
				if(datanode.links[i].source===arr[m]){
					c=1
					}
				}
				if(c==0){arr.push(datanode.links[i].source)
					}
			}
		}
		
	for (var i=0;i<maxnode;i++){
		var c=0
		for(var no=0;no<arr.length;no++){
		if(datanode.links[i].source===arr[no]){
			for (var m=0;m<arr.length;m++){
				if(datanode.links[i].target===arr[m]){
					source.push(no)
					target.push(m)
					}
				}
			
			}
		else if(datanode.links[i].target===arr[no]){
			for (var m=0;m<arr.length;m++){
				if(datanode.links[i].source===arr[m]){
					target.push(no)
				source.push(m)
					}
				}
			}
			}
		}
		//console.log("arr:"+arr)
		text+='"nodes":['

		for(var i=0;i<arr.length;i++){
			//for(var i=0;i<arrmax;i++){
			if(i==0){
			text+='{"size":'+datanode.nodes[arr[i]].size+',"score":'+datanode.nodes[arr[i]].score+',"id":"'+datanode.nodes[arr[i]].id+'","type": "'+datanode.nodes[arr[i]].type+'","ids":"'+datanode.nodes[arr[i]].ids+'"}' 
			}
			else {
				text+=',{"size":'+datanode.nodes[arr[i]].size+',"score":'+datanode.nodes[arr[i]].score+',"id":"'+datanode.nodes[arr[i]].id+'","type": "'+datanode.nodes[arr[i]].type+'","ids":"'+datanode.nodes[arr[i]].ids+'"}'
				}
			}
//console.log("source:"+source)
//console.log("target:"+target)
text+='],"links":['
for (var i=0;i<source.length;i++){
	//for(var i=0;i<arrmax-1;i++){
	if(i==0){
		text+='{"source":'+source[i]+',"target":'+target[i]+'}'
		}
	else{
		text+=',{"source":'+source[i]+',"target":'+target[i]+'}'
		}
	}

text+='], "directed": false, "multigraph": false}';

obj = JSON.parse(text);
json=obj
newgraphCo(json,1)
				}else{
				
					indexnext=d.index;
						
					}
				
			}
		}
	};
	xmlhttp.open("GET", "clearidtoidsbig.json", true);
	xmlhttp.send();
	}
}

function sizeee(myObj) {
   var size = 0, key;
   for (key in myObj) {
    if (myObj.hasOwnProperty(key)) size++;
   }
   return size;
  };
  ///***************************************************************************************
function set_highlight(d)
{
	svg.style("cursor","pointer");
	if (focus_node!==null) d = focus_node;
	highlight_node = d;

	if (highlight_color!="white")
	{
		  circle.style(towhite, function(o) {
                return isConnected(d, o) ? highlight_color : "white";});
			text.style("font-weight", function(o) {
                return isConnected(d, o) ? "bold" : "normal";});
            link.style("stroke", function(o) {
		      return o.source.index == d.index || o.target.index == d.index ? highlight_color : ((isNumber(o.score) && o.score>=0)?color(o.score):default_link_color);

            });
	}
}
 	
 	
  zoom.on("zoom", function() {
  
    var stroke = nominal_stroke;
    if (nominal_stroke*zoom.scale()>max_stroke) stroke = max_stroke/zoom.scale();
    link.style("stroke-width",stroke);
    circle.style("stroke-width",stroke);
	   
	var base_radius = nominal_base_node_size;
    if (nominal_base_node_size*zoom.scale()>max_base_node_size) base_radius = max_base_node_size/zoom.scale();
        circle.attr("d", d3.svg.symbol()
        .size(function(d) { return Math.PI*Math.pow(size(d.size)*base_radius/nominal_base_node_size||base_radius,2); })
        .type(function(d) { return d.type; }))
		
	//circle.attr("r", function(d) { return (size(d.size)*base_radius/nominal_base_node_size||base_radius); })
	if (!text_center) text.attr("dx", function(d) { return (size(d.size)*base_radius/nominal_base_node_size||base_radius); });
	
	var text_size = nominal_text_size;
    if (nominal_text_size*zoom.scale()>max_text_size) text_size = max_text_size/zoom.scale();
    text.style("font-size",text_size + "px");

	g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	});
	 
  svg.call(zoom);	  
	
  resize();
  //window.focus();
  d3.select(window).on("resize", resize).on("keydown", keydown);
	  
  force.on("tick", function() {
  	
    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    text.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  
    link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
		
    node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
	});
  
  function resize() {
    var width = window.innerWidth, height = window.innerHeight;
	svg.attr("width", width).attr("height", height);
    
	force.size([force.size()[0]+(width-w)/zoom.scale(),force.size()[1]+(height-h)/zoom.scale()]).resume();
    w = width;
	h = height;
	}
	
	function keydown() {
	if (d3.event.keyCode==32) {  force.stop();}
	else if (d3.event.keyCode>=48 && d3.event.keyCode<=90 && !d3.event.ctrlKey && !d3.event.altKey && !d3.event.metaKey)
	{
  switch (String.fromCharCode(d3.event.keyCode)) {
    case "C": keyc = !keyc; break;
    case "S": keys = !keys; break;
	case "T": keyt = !keyt; break;
	case "R": keyr = !keyr; break;
    case "X": keyx = !keyx; break;
	case "D": keyd = !keyd; break;
	case "L": keyl = !keyl; break;
	case "M": keym = !keym; break;
	case "H": keyh = !keyh; break;
	case "1": key1 = !key1; break;
	case "2": key2 = !key2; break;
	case "3": key3 = !key3; break;
	case "0": key0 = !key0; break;
  }
  	
  link.style("display", function(d) {
				var flag  = vis_by_type(d.source.type)&&vis_by_type(d.target.type)&&vis_by_node_score(d.source.score)&&vis_by_node_score(d.target.score)&&vis_by_link_score(d.score);
				linkedByIndex[d.source.index + "," + d.target.index] = flag;
              return flag?"inline":"none";});
  node.style("display", function(d) {
				return (key0||hasConnections(d))&&vis_by_type(d.type)&&vis_by_node_score(d.score)?"inline":"none";});
  text.style("display", function(d) {
                return (key0||hasConnections(d))&&vis_by_type(d.type)&&vis_by_node_score(d.score)?"inline":"none";});
				
				if (highlight_node !== null)
				{
					if ((key0||hasConnections(highlight_node))&&vis_by_type(highlight_node.type)&&vis_by_node_score(highlight_node.score)) { 
					if (focus_node!==null) set_focus(focus_node);
					set_highlight(highlight_node);
					}
					else {exit_highlight();}
				}

}	
}
 

function vis_by_type(type)
{
	switch (type) {
	  case "circle": return keyc;
	  case "square": return keys;
	  case "triangle-up": return keyt;
	  case "diamond": return keyr;
	  case "cross": return keyx;
	  case "triangle-down": return keyd;
	  default: return true;
}
}
function vis_by_node_score(score)
{
	if (isNumber(score))
	{
	if (score>=0.666) return keyh;
	else if (score>=0.333) return keym;
	else if (score>=0) return keyl;
	}
	return true;
}

function vis_by_link_score(score)
{
	if (isNumber(score))
	{
	if (score>=0.666) return key3;
	else if (score>=0.333) return key2;
	else if (score>=0) return key1;
}
	return true;
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
	
	
/////////////////////////////////////////////ฟังชั้น popup
var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var myObj = JSON.parse(this.responseText);
			popup_data=myObj	
		}
	};
	xmlhttp.open("GET", "clearidtoidsbig.json", true);
	xmlhttp.send();
	
function mouseover_show_paper(d){
	document.getElementById("popup").style.display = "block";
	showCoords(event);
			var text_data="";
			number=0
			//number=d.index
				for(var j=0;j<popup_data.all.length;j++){
					if(json.nodes[d.index].ids===popup_data.all[j].ids && json.nodes[d.index].size!=100 ){
						number=j
						//console.log("myobj:"+myObj.all[j].name);
						}
						if(json.nodes[d.index].id=== "Medline"){
							number=0
							break;
							}
							if(json.nodes[d.index].id=== "DBLP"){
							number=1
							break;
							}
					}
			if(d.id=="DBLP" || d.id=="Medline")
			{	
				document.getElementById("popup").style.display = "none";
				
			}else{
			text_data="Paper of <U>"+popup_data.all[number].name+"</U><br>";
			var count = sizeee(popup_data.all[number].paper);
			var countdata=sizeee(data.all)
			var count_paper=1;
			for(var i=0;i<count;i++){
				for (var c=0;c<countdata;c++){
					if(data.all[c].id===popup_data.all[number].paper[i].id){
						text_data+=count_paper+") Paper : "+data.all[c].title+"<br>";
						count_paper++;
					}
				}
			}
			}
			//console.log(text_data);
			document.getElementById("popup").innerHTML=text_data;
}

function showCoords(mouseover) {
  var x = mouseover.clientX;
  var y = mouseover.clientY;
  x=x+13;
  y=y+13;
  var coords = "X coords: " + x + ", Y coords: " + y;
  document.getElementById("popup").style.left=x+"px";
  document.getElementById("popup").style.top=y+"px";
}
/////////////////////////////////////////////จบฟังชั้น popup
	
}//end main_coauthor


/////////////////////////// NODE SEARCH BAR FUNCTIONALITY////////////////////////////////
function searchNode() {		

 var svg = d3.select("body").append("svg");
  	var g = svg.append("g");
    var selectedVal = document.getElementById('search').value;
	//selectedVal="Ro"
		var link = g.selectAll(".link");
		 link.style("opacity", function(o) {
			 
   			return o.source.index == selectedVal || o.target.index == selectedVal ? "1" : "0.1";
            });	
			//console.log("test")
		var text = g.selectAll(".text");
     	text.style("opacity", "0.1");
      	var linktext = g.selectAll("text");
      	linktext.style("opacity", "0.1");
      	d3.selectAll(".node , .link , text")
      	.style("opacity", function(d) {
			var str=""+d.id;
			str=str.toLowerCase();
			selectedVal=selectedVal.toLowerCase();
			if(str.search(selectedVal)!=-1)console.log(str+"=="+selectedVal);
        	return str.search(selectedVal)!=-1 ? "1" : "0.1";
      })
	
}
