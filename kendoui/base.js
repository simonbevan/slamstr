

var baseHTML = module.exports = {

	    getBase: function() {
	    	base = "";
	        baseHTML.base = 
	        '<html>'+
	        '<head>'+
	        '<meta http-equiv="Content-Type" content="text/html; '+
	        'charset=UTF-8" />'+
	        '</head>'+
	        '<body>'+
	        '<form action="/upload" method="post">'+
	        '<textarea name="text" rows="20" cols="60"></textarea>'+
	        '<input type="submit" value="Submit text" />'+
	        '</form>'+
	        '</body>'+
	        '</html>';	
	        
	    },

};
	






/*	        '<!DOCTYPE html>'+
	        '<html>'+
	        '<head>'+
	        '<title>Selection</title>'+

	        '<link href="examples/content/shared/styles/examples-offline.css"'+
	        '	rel="stylesheet">'+
	        '<link href="styles/kendo.common.min.css" rel="stylesheet">'+
	        '<link href="styles/kendo.default.min.css" rel="stylesheet">'+
	        '<script src="js/kendo.all.min.js"></script>'+
	        '<link href="bbb.css" rel="stylesheet">'+
	        '<link href="http://vjs.zencdn.net/4.2/video-js.css" rel="stylesheet">'+

	        '<script src="js/jquery.min.js"></script>'+
	        '<script src="js/kendo.web.min.js"></script>'+
	        '<script src="examples/content/shared/js/console.js"></script>'+
	        '<script src="bbb.js"></script>'+


	        '<script src="http://vjs.zencdn.net/4.2/video.js"></script>'+

	        '<script>'+
	        	
	        '</script>'+

	
	        
	        '</head>'+
	        
	        
	        
	        

	        '<body>'+

	        '	<a class="offline-button" href="../index.html">Back</a>'+

	        '	<div id="login" class="k-content">'+

	        '		<div id="forecast">'+
	        '			<div id="tabstrip">'+

	        '				<ul>'+

	        '					<li class="k-state-active">Register</li>'+

	        '					<li>Battle</li>'+

	        '					<li>Winners</li>'+
	        
	        '					<li>My BBB</li>'+

	        '				</ul>'+

	        '				<div>'+

	        '					<div id="registration" class="k-content">'+

	        '						<div class="registration">'+
	        '							<form>'+
	        '								<ul>'+
	        '									<input placeholder="First Name..." id="fname"'+
	        '										data-bind="value: firstName" />'+
	        '									<br>'+
	        '									<input placeholder="Last Name ..." id="lname"'+
	        '										data-bind="value: lastName" />'+
	        '									<br>'+
	        '									<input placeholder="Country..." id="cname"'+
	        '										data-bind="value: country" />'+
	        '									<br>'+
	        '									<select placeholder="Gender..." id="gender"'+
	        '										data-bind="value: gender">'+

'	        										<option value=\'\' disabled selected style=\'display: none;\'>Please'+
'	        											Choose</option>'+
'	        										<option>Male</option>'+
'	        										<option>Female</option>'+
'	        									</select>'+

'	        									<select id="required" multiple="multiple"'+
'	        										data-placeholder="Select preferences..."'+
'	        										data-bind="value: Preference" style="width: 153px">'+

'	        										<option>Rock</option>'+
'	        										<option>Dub Step</option>'+
'	        										<option>Blue Grass</option>'+
'	        										<option>Swing</option>'+
'	        										<option>Hip Hop</option>'+
'	        										<option>Classical</option>'+

'	        									</select>'+



'	        									<input placeholder="Age..." id="age"'+
'	        										data-bind="source: age, value: age">'+
'	        									</select>'+

'	        									<br />'+
'	        									<br />'+
'	        									<input type="checkbox" id="agree" data-bind="checked: agreed" />'+
'	        									<label for="agree">I have read the licence agreement</label>'+
'	        									<br />'+
'	        									<br />'+
'	        									<button data-bind="enabled: agreed, click: register"'+
'	        										style="display: block">Register</button>'+

'	        								</ul>'+
'	        							</form>'+



'	        						</div>'+


'	        						<div class="confirmation" data-bind="visible: confirmed">'+
'	        							Thank you for your registration, <span'+
'	        								data-bind="text: firstName"></span> <span'+
'	        								data-bind="text: lastName"></span>'+

'	        						</div>'+

'	        						<script>'+
'	        							$(document).ready('+
'	        									function() {'+
'	        										var viewModel = kendo.observable({'+
'	        											firstName : "",'+
'	        											lastName : "",'+
'	        											country : "",'+
'	        											age : "",'+
'	        											gender : "",'+
'	        											agreed : false,'+
'	        											confirmed : false,'+
'	        											register : function(e) {'+
'	        												e.preventDefault();'+

'	        												this.set("confirmed", true);'+
'	        											},'+

'	        										});'+
'	        										var required = $("#required")'+
'	        												.kendoMultiSelect().data('+
'	        														"kendoMultiSelect");'+
'	        										kendo.bind($("#registration"),'+
'	        												viewModel, required);'+

'	        									});'+
'	        						</script>'+


'	        					</div>'+
'	        				</div>'+


'	        				<div>'+

'	        					<div class="demo-section">'+

'	        						<div id="example" class="k-content">'+

'	        							<img src="examples/content/web/foods/dummy.jpg" id="selectImage" />'+

'	        							<div id="productName"></div>'+
'	        						</div>'+



'	        					<div id="splitter class="k-content">'+
'	        						<div id="vertical">'+
'	        							<div id="top-pane">'+
'	        								<div id="horizontal" style="height: 100%; width: 100%;">'+
'	        									<div id="left-pane">'+
'	        										<div class="pane-content">'+

'	        										<div id="player" class="k-content">'+
'	        											<video id="my_video_1" class="video-js vjs-default-skin"'+
'	        												controls preload="auto" width="99%" height="364"'+
'	        												poster="my_video_poster.png" data-setup="{}">'+
'	        												<source src="my_video.mp4" type="video/mp4">'+
'	         												<source src="my_video.webm" type="video/webm">'+

'	        											</video>'+
'	        											</div>'+

'	        										</div>'+
'	        									</div>'+

'	        									<div id="right-pane">'+

'	        										<div id="vertical2">'+
'	        											<div id="top-pane2">'+
'	        												<div class="pane-content">'+
'	        													<h3>Login Form</h3>'+

'	        												</div>'+
'	        											</div>'+

'	        											<div id="bottom-pane2">'+
'	        												<div class="pane-content">'+
'	        													<h3>Name</h3>'+
'	        													<p>Country:</p>'+
'	        													<p>Signed:</p>'+
'	        													<p>Maybe some nice visulisation</p>'+
'	        													<p>to fill the rest of the pane?</p>'+
'	        													<p>or advert?</p>'+
'	        												</div>'+
'	        											</div>'+


'	        										</div>'+





'	        									</div>'+
'	        								</div>'+

'	        							</div>'+

'	        						</div>'+
'	        					</div>'+

'	        					<script>'+
'	                        $(document).ready(function() {'+
'	                            $("#vertical").kendoSplitter({'+
'	                                orientation: "vertical",'+
'	                                panes: ['+
'	                                    { collapsible: false },'+
	              
'	                                ]'+
'	                            });'+

'	                            $("#horizontal").kendoSplitter({'+
'	                                panes: ['+
'	                                    { collapsible: false, size: "70%" },'+
'	                                    { collapsible: true },'+
	                                   
'	                                ]'+
'	                            });'+
	                            
'	                            $("#vertical2").kendoSplitter({'+
'	                                orientation: "vertical",'+
'	                                panes: ['+
'	                                    { collapsible: true,size:"31%" },'+
'	                                    { collapsible: false },'+
	              
'	                                ]'+
'	                            });'+
	                            
'	                        });'+
'	                    </script>'+

'	        					<style scoped>'+
'	        #vertical {'+
'	        	height: 501px;'+
'	        	width: 90%;'+
'	        	margin: 0 auto;'+
'	        }'+

'	        #vertical2 {'+
'	        	height: 501px;'+
'	        	width: 100%;'+
'	        	margin: 0 auto;'+
'	        }'+

'	        #middle-pane {'+
'	        	background-color: rgba(60, 70, 80, 0.10);'+
'	        }'+

'	        #bottom-pane {'+
'	        	background-color: rgba(60, 70, 80, 0.15);'+
'	        }'+

'	        #left-pane,#center-pane,#right-pane {'+
'	        	background-color: rgba(60, 70, 80, 0.05);'+
'	        }'+

'	        .pane-content {'+
'	        	padding: 0 10px;'+
'	        }'+
'	        </style>'+


'	        					</div>'+

'	        					<div class="demo-section">'+
'	        						<h2>Choose their destiny:</h2>'+
'	        						<div id="listView"></div>'+


'	        						<!-- <div id="pager" class="k-pager-wrap"></div> -->'+



'	        					</div>'+

'	        				</div>'+

'	        				<div class="demo-section">'+


'	        					<h2>Console Log</h2>'+
'	        					<div class="console"></div>'+
'	        				</div>'+

'	        				<div>'+

'	        				</div>'+


'	        				<script type="text/x-kendo-template" id="template">'+
	               	                  

'	        		<li#= typeof done != "undefined" && done ? " class=\'done\'" : "" #>'+
'	                    <img src="examples/content/web/foods/${ProductID}.jpg" alt="${ProductName} image"> '+   

'	        </li>'+

'	            </script>'+

'	        				<script>'+
'	        					$(document)'+
'	        							.ready('+
'	        									function() {'+
'	        										var dataSource = new kendo.data.DataSource('+
'	        												{'+
'	        													transport : {'+
'	        														read : {'+
'	        															url : "http://demos.kendoui.com/service/Products",'+
'	        															dataType : "jsonp"'+
'	        														}'+
'	        													},'+
'	        													pageSize : 100'+
'	        												});'+

'	        										$("#tabstrip").kendoTabStrip({'+
'	        											animation : {'+
'	        												open : {'+
'	        													effects : "fadeIn"'+
'	        												}'+
'	        											}'+
'	        										});'+

'	        										$("#pager").kendoPager({'+
'	        											dataSource : dataSource'+
'	        										});'+

'	        										$("#listView")'+
'	        												.kendoListView('+
'	        														{'+
'	        															dataSource : dataSource,'+
'	        															selectable : "single",'+
'	        															dataBound : onDataBound,'+
'	        															change : onChange,'+
'	        															template : kendo'+
'	        																	.template($('+
'	        																			"#template")'+
'	        																			.html())'+
'	        														});'+

'	        										$("#listView")'+
'	        												.on('+
'	        														"click",'+
'	        														"img",'+
'	        														function(e) {'+
'	        															var el = $('+
'	        																	e.currentTarget)'+
'	        																	.closest('+
'	        																			"li"), effect = kendo'+
'	        																	.fx(el)'+
'	        																	.fadeOut()'+
'	        																	.duration('+
'	        																			700);'+

'	        															effect'+
'	        																	.play()'+
'	        																	.then('+
'	        																			function() {'+
'	        																				dataSource'+
'	        																						.getByUid('+
'	        																								$('+
'	        																										this)'+
'	        																										.attr('+
'	        																												"data-uid"))'+
'	        																						.set('+
'	        																								"done",'+
'	        																								true);'+
'	        																			});'+
'	        														});'+

'	        										function onDataBound() {'+
'	        											kendoConsole'+
'	        													.log("ListView data bound");'+
'	        										}'+

'	        										function onChange() {'+
'	        											var data = dataSource.view(), selected = $'+
'	        													.map('+
'	        															this.select(),'+
'	        															function(item) {'+

'	        																return data[$('+
'	        																		item)'+
'	        																		.index()].ProductName;'+
'	        															});'+

'	        											selectedIndex = $'+
'	        													.map('+
'	        															this.select(),'+
'	        															function(item) {'+

'	        																return $(item)'+
'	        																		.index() + 1;'+
'	        															});'+

'	        											$("#selectImage").attr('+
'	        													\'src\','+
'	        													"examples/content/web/foods/"'+
'	        															+ selectedIndex'+
'	        															+ ".jpg");'+
'	        											//$(\'#productName\').html(function(i, val) { return val*1+1 });'+
'	        											$(\'#productName\').html(selected)'+
'	        											kendoConsole'+
'	        													.log("Selected: "'+
'	        															+ selected.length'+
'	        															+ " item(s), ["'+
'	        															+ selected'+
'	        																	.join(", ")'+
'	        															+ "]");'+
'	        										}'+
'	        									});'+
'	        				</script>'+

'	        			</div>'+
'	        		</div>'+


'	        		<style scoped>'+
'	        #registration {'+
'	        	width: 250px;'+
'	        	margin: 30px auto;'+
'	        	padding: 10px 10px 10px 10px;'+
'	        }'+

'	        #player {'+

'	        	margin: 30px auto;'+
'	        	padding: 10px 10px 10px 10px;'+
'	        }'+

'	        .demo-section2 {'+
'	        	padding: 30px;'+
'	        	width: 577px;'+
'	        	height: 377px;'+
'	        }'+

'	        #listView {'+
'	        	padding: 10px;'+
'	        	margin-bottom: -1px;'+
'	        	min-width: 555px;'+
'	        	min-height: 110px;'+
'	        }'+

'	        #listView img {'+
'	        	overflow: hidden;'+
'	        	width: 30px;'+
'	        	height: 30px;'+
'	        	cursor: pointer;'+
'	        }'+

'	        #listView .done {'+
'	        	display: none;'+
'	        }'+

'	        #listView li {'+
'	        	display: inline-block;'+
'	        	width: 30px;'+
'	        	height: 30px;'+
'	        }'+

'	        .product {'+
'	        	float: left;'+
'	        	position: relative;'+
'	        	width: 111px;'+
'	        	height: 170px;'+
'	        	margin: 0;'+
'	        	padding: 0;'+
'	        }'+

'	        .product img {'+
'	        	width: 11px;'+
'	        	height: 110px;'+
'	        	overflow: hidden;'+
'	        }'+

'	        .product h3 {'+
'	        	margin: 0;'+
'	        	padding: 3px 5px 0 0;'+
'	        	max-width: 96px;'+
'	        	overflow: hidden;'+
'	        	line-height: 1.1em;'+
'	        	font-size: .9em;'+
'	        	font-weight: normal;'+
'	        	text-transform: uppercase;'+
'	        	color: #999;'+
'	        }'+

'	        .product p {'+
'	        	visibility: hidden;'+
'	        }'+

'	        .product-description {'+
'	        	position: absolute;'+
'	        	top: 0;'+
'	        	width: 110px;'+
'	        	height: 0;'+
'	        	overflow: hidden;'+
'	        	background-color: rgba(0, 0, 0, 0.8)'+
'	        }'+

'	        .product:hover p {'+
'	        	visibility: visible;'+
'	        	position: absolute;'+
'	        	width: 110px;'+
'	        	height: 110px;'+
'	        	top: 0;'+
'	        	margin: 0;'+
'	        	padding: 0;'+
'	        	line-height: 110px;'+
'	        	vertical-align: middle;'+
'	        	text-align: center;'+
'	        	color: #fff;'+
'	        	background-color: rgba(0, 0, 0, 0.75);'+
'	        	transition: background .2s linear, color .2s linear;'+
'	        	-moz-transition: background .2s linear, color .2s linear;'+
'	        	-webkit-transition: background .2s linear, color .2s linear;'+
'	        	-o-transition: background .2s linear, color .2s linear;'+
'	        }'+

'	        .k-listview:after {'+
'	        	content: ".";'+
'	        	display: block;'+
'	        	height: 0;'+
'	        	clear: both;'+
'	        	visibility: hidden;'+
'	        }'+

*/

//	        ::-webkit-input-placeholder { /* WebKit browsers */'+
/*'	        	color: #000;'+
'	        }'+
'	        </style>'+
'	        	</div>'+

'	        </body>'+*/

	        
	        
	        
//	        '</html>';
	        
	        
	        
	        
