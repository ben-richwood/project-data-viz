<!DOCTYPE html>
<html lang="en">
<head>
	<title>Tool explorer</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<link rel="stylesheet" href="./css/style.css">

	<!-- <script type="text/javascript" src="https://unpkg.com/vis-network@6.4.7/dist/vis-network.min.js"></script> -->
	<!-- <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script> -->
	<!-- <link href="https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min.css" rel="stylesheet" type="text/css" /> -->

	<!-- <script src="./assets/js/jquery.js"></script>
	<script src="./assets/js/jquery-ui.js"></script> -->

	<!-- <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css"> -->
	<!-- <link rel="stylesheet" href="/resources/demos/style.css"> -->

	<style type="text/css">
		body {
		  color: #d3d3d3;
		  font-size: 12px;
		  font-family: 'Ubuntu', 'Open Sans', 'Segoe UI', 'Helvetica Neue', 'Droid Sans Serif', 'Roboto', Arial, sans-serif;
		  background-color: #222222;
		  margin: 0;
		  padding: 0;
		  min-height: 100vh;
		}
		#networkCanvas {
			width: 100%;
			height: 100vh;
			/*border: 1px solid lightgray;*/
		}
		#loader{
			display:  none;
			position:absolute;
			top: 0;left:0;
			width: 100%;
			height:100vh;
			background-color: rgba(0,0,0,1);
			z-index: 200;
		}
		.loader__container{
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 100%;
		}
		.loader__bar-code{
			/*width: 80%;*/
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 400px;
			position:relative;
			border: 6px solid white;
			padding: .3rem;
		}
		.loader__bar-code--container{
			position: relative;
			height: 60px;
			width: 100%;
		}
		.bar{
			position: absolute;
			top: 5%;
			left: 0;
			width: 10px;
			height: calc(90% - .7rem);
			background: white;

			animation-iteration-count: infinite;
			animation-direction: alternate;
			animation-name: backNforth;
			animation-timing-function: linear;
		}
		.bar.bar-01{
			animation-duration: 1.5s;
			animation-delay: 0s;
			width: 4px;
		}
		.bar.bar-02{
			animation-duration: 1.8s;
			animation-delay: 1s;
		}
		.bar.bar-03{
			animation-duration: .8s;
			animation-delay: .3s;
		}
		.bar.bar-04{
			animation-duration: 1.9s;
			animation-delay: .3s;
			animation-timing-function: ease;
		}
		.bar.bar-05{
			animation-duration: 1.7s;
			animation-delay: 0s;
		}
		.bar.bar-06{
			animation-duration: 1.65s;
			animation-delay: .5s;
		}
		.bar:nth-of-type(1n+4){
					animation-duration: .8s !important;
		}
		.bar:nth-of-type(1n+7){
					width: 2px;
		}
		.bar:nth-of-type(1n+8){
					width: 4px;
		}
		.bar:nth-of-type(1n+9){
					width: 2px;
					animation-duration: 1.9s;
					animation-delay: 1s;
		}
		.bar:nth-of-type(1n+10){
					animation-duration: 1.6s;
					animation-delay: .2;
		}
		.bar:nth-of-type(1n+11){
					animation-duration: 1.6s;
					animation-delay: 2;
		}
		@keyframes backNforth {
		  from { transform: translateX(10px); }
		  to { transform: translateX(390px); }
		}
		.code-ID{
			color: white;
			font-family: "fira Code";
			/*position: absolute;*/
			/*bottom: 0;*/
			text-align: center;
			width: 100%;
			letter-spacing: 0.3rem;
		}
	</style>
</head>
<body>
	<?php include './loader.php'; ?>
	<div id="networkCanvas"></div>
	<div>
	  <textarea id="input_output"></textarea>
	  <input
		type="button"
		id="import_button"
		onclick="importNetwork()"
		value="import"
	  />
	  <input
		type="button"
		id="export_button"
		onclick="exportNetwork()"
		value="export"
	  />
	  <!-- <input
		type="button"
		id="destroy_button"
		onclick="destroyNetwork()"
		value="destroy"
	  /> -->
	</div>
	<div> <a href="https://almende.github.io/vis/docs/network/#methodCanvas">visjs website</a> </div>
	<div>
		<h3>Inspiration</h3>
		<ul>
			<li><a href="https://starcitizen.center/route-planner">Star Citizen - mapping & routes</a></li>
		</ul>
	</div>

	<div v-show="show" id="itemDetail" class="ui-widget ui-widget-content">
		<div class="content">
			<button class="closeButton" @click="close">Close</button>
			<p id="nodeTitle">{{ content.label }}</p>
			<div>{{ content.description }}</div>
			<div><a target="_blank" :href="content.link">{{ content.link }}</a></div>
			{{content.x}}<br/>
			{{content.y}}<br/>
			{{content.price}}<br/>
			{{content.pricing}}<br/>
		</div>
		<div id="cartouche">
			<div id="nodeID">{{ content.id }}</div>
			<div id="barcode">
				<img src="./images/barcode.svg" alt="bar code">
			</div>
		</div>
	</div>

	<div id="listContainer" class="ui-widget-content">
		<ul>
			<li><input class="search-bar" type="text" v-model="keyword" placeholder="Search anything"/></li>
			<li class="item" v-for="it in itemsComputed" @click="moveTo(it.id)" :key="it.id">{{ it.label }}{{it.group | group }}</li>
		</ul>
		<button @click="move">Move node</button>
	</div>

	<div id="node-popUp">
	  <span id="node-operation">node</span> <br />
	  <table style="margin:auto;">
		<tbody>
		  <tr>
			<td>label</td>
			<td><input id="node-label" value="new value" /></td>
		  </tr>
		  <tr>
			<td>Description</td>
			<td><input id="node-description" value="" /></td>
		  </tr>
		  <tr>
			<td>tags</td>
			<td><input id="node-tags" value="" /></td>
		  </tr>
		  <tr>
			<td>Group</td>
			<td>
				<select name="node-group" id="node-group">
					<option value="">Empty</option>
					<option value="language">language</option>
					<option value="service">service</option>
				</select>
			</td>
		  </tr>
		  <tr>
			  <td>Level</td>
			  <td>
				  <select name="node-level" id="node-level">
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
					<option value="4">4</option>
				</select>
			  </td>
		  </tr>
		</tbody>
	  </table>
	  <input type="button" value="save" id="node-saveButton" />
	  <input type="button" value="cancel" id="node-cancelButton" />
	</div>

	<div id="edge-popUp">
	  <span id="edge-operation">edge</span> <br />
	  <table style="margin:auto;">
		<tbody>
		  <tr>
			<td>label</td>
			<td><input id="edge-label" value="new value"/></td>
		  </tr>
		  <tr>
			<td>title</td>
			<td><input id="edge-title" value="new value"/></td>
		  </tr>
		</tbody>
	  </table>
	  <input type="button" value="save" id="edge-saveButton" />
	  <input type="button" value="cancel" id="edge-cancelButton" />
	</div>

<!-- <script src="./assets/js/app.js"></script> -->
<script src="/js/app.js"></script>
<script>

	// const height = window.innerHeight * 0.8;

	// $( function() {
	// 	$( "#listContainer" ).resizable({
	// 		minWidth: 150,
	// 		maxWidth: 600,
	// 		minHeight: height,
	// 		maxHeight: height,
	// 	});
	//   } );


</script>

</body>
</html>
