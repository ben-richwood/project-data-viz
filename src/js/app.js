import { DataSet, Network } from "vis-network/standalone";

import { Network } from './Network'
import Vue from 'vue'
import { default as Dragable } from './Dragable'
import { readTextFile } from './utilis'

let network = null;
let edges;
let nodes;
let data;
let container;

let ntw = null;

function Settings() {
	this.isStabilized = false
}

const settings = new Settings();

const domElements = {
	exportArea: document.getElementById("input_output"),
	container: document.getElementById('networkCanvas'),
	exportButton: document.getElementById("export_button")
};


exportArea = domElements.exportArea;
container = domElements.container;
exportButton = domElements.exportButton;

let groups = ["framework", "stack", "lib", "service", "software", "CLI", "company"];

let taxonomy = ["language", "os", "freemium", "tried"];
// Paid, subscription, FOSS, freemium
// for OS, could use % modulo to determine which platform -> 2 for Windows, 3 for Mac and 5 for Linux.
// Then 15 means Linux and Mac


init()

let itemList = [];

	//////////////////////////////////////////////
	// Vue components
	//////////////////////////////////////////////
	const listContainer = new Vue({
		el: "#listContainer",
		data: {
			itemList: [...itemList],
			keyword: "",
		},
		methods: {
			moveTo: function (idx) {
				displayPopupInfo(idx);
				network.focus(idx, {
					scale: 2,
					locked: true,
					animation: {
						duration: 1200,
						easingFunction: "easeOutQuart"
					}
				})
			},
			move: function(){
				console.log("itemList", this.itemList);
				this.itemList.forEach(function(e){
					network.moveNode(e.id, Math.floor(Math.random() * 600), Math.floor(Math.random() * 800));
				})
			}
		},
		computed: {
			itemsComputed: function () {
				var filterKey = this.keyword && this.keyword.toLowerCase()
				var items = this.itemList
				if (filterKey != '') {
					items = items.filter(function (row) {
						return Object.keys(row).some(function (key) {
							return String(row[key]).toLowerCase().indexOf(filterKey) > -1
						})
					})
				}
				return items
			}
		},
		filters: {
			group: function (e) {
				if (e === undefined) return ""
					return " - " + e;
			}
		}
	});


	const itemDetail = new Vue({
		el: "#itemDetail",
		data: {
			content: {},
			show: false
		},
		methods: {
			close: function () {
				this.show = false;
			}
		},
		mounted(){
			Dragable("itemDetail", "cartouche");
		}
	})
	//////////////////////////////////////////////


	function displayPopupInfo(idx){
		let item = listContainer.itemList.find(x => x.id === idx);
		// console.log(idx);
		console.log(item);
		let networkNode = ntw.network.body.nodes[idx];
		extraProps = {x: networkNode.x, y: networkNode.y};
		itemDetail.content = {
			...item,
			...extraProps
		};
		itemDetail.show = true;
	}



	function destroy() {
		if (ntw !== null) {
			ntw.network.destroy();
			ntw.network = null;
		}
	}


// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// EXPORT FUNCTIONS
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function clearOutputArea() {
	exportArea.value = "";
}


function exportNetwork() {
	clearOutputArea();

	var nodes = objectToArray(network.body.nodes);
	const edgesList = [];
	for(edge in network.body.edges){
		ed = network.body.edges[edge]
		edgesList.push({
			from: ed.from.id, to: ed.to.id,
			title: ed.title ? ed.title : undefined
		})
	}
	// var nodes = objectToArray(network.getPositions());

	// nodes.forEach(addConnections);
	// edges.forEach(addConnections);

	// pretty print node data
	// var exportValue = JSON.stringify(nodes, undefined, 2);
	var exportValue = JSON.stringify(listContainer.itemList, undefined, 2);
	var exportValue02 = JSON.stringify(edgesList, undefined, 2);

	// exportArea.value = exportValue;
	exportArea.value = "{\n\t\"itemList\": " + exportValue + ",\n\t\"edges\": " + exportValue02 + "\n}";

	// resizeExportArea();
}

function getNodeData(data) {
	var networkNodes = [];

	data.forEach(function(elem, index, array) {
		networkNodes.push({
			id: elem.id, label: elem.label,
			group: elem.group ? elem.group : undefined,
			x: elem.x, y: elem.y
		});
	});

	return new DataSet(networkNodes);
}


// function addConnections(elem, index) {
//   // need to replace this with a tree of the network, then get child direct children of the element
//   elem.connections = network.getConnectedNodes(index);
// }
function addConnections(elem, index) {
	elem.connections = network.getConnectedEdges(index);
}

function getNodeById(data, id) {
	for (var n = 0; n < data.length; n++) {
		if (data[n].id == id) {
			// double equals since id can be numeric or string
			return data[n];
		}
	}

	throw "Can not find id '" + id + "' in data";
}

function getEdgeData(data) {
	var networkEdges = [];

	data.forEach(function(node) {
		// add the connection
		node.connections.forEach(function(connId, cIndex, conns) {
			networkEdges.push({ from: node.id, to: connId });
			let cNode = getNodeById(data, connId);

			var elementConnections = cNode.connections;

			// remove the connection from the other node to prevent duplicate connections
			var duplicateIndex = elementConnections.findIndex(function(connection) {
				return connection == node.id; // double equals since id can be numeric or string
			});

			if (duplicateIndex != -1) {
				elementConnections.splice(duplicateIndex, 1);
			}
		});
	});

	return new DataSet(networkEdges);
}

function objectToArray(obj) {
	return Object.keys(obj).map(function(key) {
		console.log(obj[key])
		return {
			id: obj[key].id,
			label: obj[key].labelModule.elementOptions.label,
			level: obj[key].labelModule.elementOptions.level,
			group: obj[key].labelModule.elementOptions.group ? obj[key].labelModule.elementOptions.group : undefined,
				// description: obj[key].labelModule.elementOptions.description ? obj[key].labelModule.elementOptions.description : undefined,
			}
		});
}


function editNode(data, cancelAction, callback) {
	document.getElementById("node-label").value = data.label;
	document.getElementById("node-description").value = data.description;
	document.getElementById("node-tags").value = data.tags;
	document.getElementById("node-saveButton").onclick = saveNodeData.bind(
		this,
		data,
		callback
		);
	document.getElementById("node-cancelButton").onclick = cancelAction.bind(
		this,
		callback
		);
	document.getElementById("node-popUp").style.display = "block";
}

// Callback passed as parameter is ignored
function clearNodePopUp() {
	document.getElementById("node-saveButton").onclick = null;
	document.getElementById("node-cancelButton").onclick = null;
	document.getElementById("node-popUp").style.display = "none";
}

function cancelNodeEdit(callback) {
	clearNodePopUp();
	callback(null);
}

function saveNodeData(data, callback) {
	data.label = document.getElementById("node-label").value;
	if (document.getElementById("node-group").value != undefined) data.group = document.getElementById("node-group").value;
	data.level = document.getElementById("node-level").value;
	data.description = document.getElementById("node-description").value;
	data.tags = document.getElementById("node-tags").value;
	listContainer.itemList.push(data);
	// console.log(itemList);
	clearNodePopUp();
	callback(data);
}

function editEdgeWithoutDrag(data, callback) {
	// filling in the popup DOM elements
	document.getElementById("edge-label").value = data.label;
	document.getElementById("edge-title").value = data.title;
	document.getElementById("edge-saveButton").onclick = saveEdgeData.bind(
		this,
		data,
		callback
		);
	document.getElementById("edge-cancelButton").onclick = cancelEdgeEdit.bind(
		this,
		callback
		);
	document.getElementById("edge-popUp").style.display = "block";
}

function clearEdgePopUp() {
	document.getElementById("edge-saveButton").onclick = null;
	document.getElementById("edge-cancelButton").onclick = null;
	document.getElementById("edge-popUp").style.display = "none";
}

function cancelEdgeEdit(callback) {
	clearEdgePopUp();
	callback(null);
}

function saveEdgeData(data, callback) {
	if (typeof data.to === "object") data.to = data.to.id;
	if (typeof data.from === "object") data.from = data.from.id;
	data.label = document.getElementById("edge-label").value;
	clearEdgePopUp();
	callback(data);
}



window.addEventListener("load", () => {
	// draw();
	// init();
});

function init() {
	ntw = new Network(domElements, settings);

	// assets/js/networkDataTest.json
	readTextFile("../data/networkData.json", callBackInit)
}


function callBackInit (text){
	var dataJson = JSON.parse(text);
	listContainer.itemList = listContainer.itemList.concat(dataJson.itemList);
	// console.log("dataJson.itemList: ",dataJson.itemList);
	// console.log("listContainer.itemList: ", listContainer.itemList);

	const filteredForVis = dataJson.itemList.map(function(item) {
		let obj = {}
		if (item.label != undefined) obj.label = item.label;
		if (item.group != undefined) obj.group = item.group;
		obj.level = item.hasOwnProperty("level") ? item.level : 3;
		if (item.title != undefined) obj.title = item.title;
		if (item.mass != undefined) obj.mas = item.mass;
		if ("x" in item) obj.x = item.x;
		if ("y" in item) obj.y = item.y;
		return {
			...obj,
			id: item.id,
		};
	});

	data = ntw.setDataSet(filteredForVis, dataJson.edges)

	ntw.draw(data);

	ntw.network.on("click", (e) => {
		// console.log(e);
		// console.log(network.body.nodes);
		// console.log(this.data);
		if(e.nodes[0] && e.nodes[0] != undefined){
			// console.log(getNodeById(network.body.nodes, e.nodes[0]));
			// console.log( this.network.body.nodes[e.nodes[0]] );
			displayPopupInfo(e.nodes[0]);
			ntw.neighbourhoodHighlight(e);
		}
	});
};
