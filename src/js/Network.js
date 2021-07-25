import { DataSet, Network } from "vis-network/standalone";
import { DIR, options } from './constants'

export class Network {
	constructor (domElements, settings){
		this.container = domElements.container;
		this.networkCanvas = undefined;
		this._settings = settings;
		this._highlightActive = false;

		this.newtork = {}
		this.data = {}
		this.nodesDataset = {};
		this.allNodes = [];
		this.edgesDataset = {};
		this.options = options;
		this.options.manipulation = {
			addNode: function(data, callback) {
				// filling in the popup DOM elements
				document.getElementById("node-operation").innerHTML = "Add Node";

				editNode(data, clearNodePopUp, callback);
			},
			editNode: function(data, callback) {
				// filling in the popup DOM elements
				document.getElementById("node-operation").innerHTML = "Edit Node";
				editNode(data, cancelNodeEdit, callback);
			},
			addEdge: function(data, callback) {
				if (data.from == data.to) {
					// var r = confirm("Do you want to connect the node to itself?");
					// if (r != true) {
						callback(null);
						return;
					// }
				}
				document.getElementById("edge-operation").innerHTML = "Add Edge";
				editEdgeWithoutDrag(data, callback);
			},
			editEdge: {
				editWithoutDrag: function(data, callback) {
					document.getElementById("edge-operation").innerHTML = "Edit Edge";
					editEdgeWithoutDrag(data, callback);
				}
			}
		}
	}

	setDataSet(filteredForVis, edges){
		this.nodesDataset = new DataSet(filteredForVis);
		this.edgesDataset = new DataSet(edges);
		const data = {
			// nodes: nodes,
			// edges: edges
			nodes: this.nodesDataset,
			edges: this.edgesDataset
		};

		return data;
	}

	draw(data) {
		// console.log("draw()", this.container, data, this.options);
		this.data = data
		this.network = new Network(this.container, data, this.options);

		// console.log("this.network", this.network)

		// get a JSON object
		// Used for neighbourhoodHighlight()
		this.allNodes = this.nodesDataset.get({ returnType: "Object" });

		// this.networkCanvas = this.container.getElementsByTagName("canvas")[0];

		this.network.once("beforeDrawing", () => {
				this.network.focus(5, { // NodeID
					scale: 4
				});
			});
		this.network.once("afterDrawing", () => {
			this.network.fit({
				animation: {
					duration: 1200,
					easingFunction: "easeOutQuart"
				}
			});
		});

		this.network.on("stabilized", () => {
			console.log("Stabilized");
			if(!this._settings.isStabilized){
				this.network.fit({
					animation: {
						duration: 1200,
						easingFunction: "easeOutQuart"
					}
				});
				this._settings.isStabilized = true;
				let loaderScreen = document.getElementById('loader');
				if (loaderScreen) {
					let parentNode = loaderScreen.parentNode;
					parentNode.removeChild(loaderScreen);
				}
			}
		})


		this.network.on("stabilizationProgress", function(params) {
			console.log(params);
		});
		this.network.on("hoverNode", () => {
			this.container.style.cursor = "pointer";
		});

		this.network.on("blurNode", () => {
			this.container.style.cursor = "default";
			//
		});
		this.network.on("hoverEdge", function() {
			//
		});
		this.network.on("blurEdge", () => {
			this.container.style.cursor = "default";
		});
		this.network.on("dragStart", () => {
			//
		});
		this.network.on("dragging", () => {
			this.container.style.cursor = "move";
		});
		this.network.on("dragEnd", () => {
			this.container.style.cursor = "cursor";
		});
		/*
		this.network.on("click", (e) => {
			// console.log(e);
			// console.log(network.body.nodes);
			console.log(this.data);
			if(e.nodes[0] && e.nodes[0] != undefined){
				// console.log(getNodeById(network.body.nodes, e.nodes[0]));
				// console.log( this.network.body.nodes[e.nodes[0]] );
				displayPopupInfo(e.nodes[0]);
				this._neighbourhoodHighlight(e);
			}
		});
		*/
	}

	neighbourhoodHighlight(params) {
		// if something is selected:
		if (params.nodes.length > 0) {
			this._highlightActive = true;
			var i, j;
			var selectedNode = params.nodes[0];
			var degrees = 2;

			// mark all nodes as hard to read.
			for (var nodeId in this.allNodes) {
				this.allNodes[nodeId].color = "rgba(130,130,130,1)";
			}
			var connectedNodes = this.network.getConnectedNodes(selectedNode);
			var allConnectedNodes = [];

			// get the second degree nodes
			for (i = 1; i < degrees; i++) {
				for (j = 0; j < connectedNodes.length; j++) {
					allConnectedNodes = allConnectedNodes.concat(
						this.network.getConnectedNodes(connectedNodes[j])
						);
				}
			}

			// all second degree nodes get a different color and their label back
			for (i = 0; i < allConnectedNodes.length; i++) {
				this.allNodes[allConnectedNodes[i]].color = "#58FFFE";
				this.allNodes[allConnectedNodes[i]].border = "#58FFFE";
				this.allNodes[allConnectedNodes[i]].background = '#285352';

				// if (allNodes[allConnectedNodes[i]].hiddenLabel !== undefined) {
				//   allNodes[allConnectedNodes[i]].label =
				//     allNodes[allConnectedNodes[i]].hiddenLabel;
				//   allNodes[allConnectedNodes[i]].hiddenLabel = undefined;
				// }
			}

			// all first degree nodes get their own color and their label back
			for (i = 0; i < connectedNodes.length; i++) {
				this.allNodes[connectedNodes[i]].color = undefined;
				// if (allNodes[connectedNodes[i]].hiddenLabel !== undefined) {
				//   allNodes[connectedNodes[i]].label =
				//     allNodes[connectedNodes[i]].hiddenLabel;
				//   allNodes[connectedNodes[i]].hiddenLabel = undefined;
				// }
			}

			// the main node gets its own color and its label back.
			this.allNodes[selectedNode].color = undefined;
			// if (allNodes[selectedNode].hiddenLabel !== undefined) {
			//   allNodes[selectedNode].label = allNodes[selectedNode].hiddenLabel;
			//   allNodes[selectedNode].hiddenLabel = undefined;
			// }
		} else if (this._highlightActive === true) {
			// reset all nodes
			for (var nodeId in this.allNodes) {
				// allNodes[nodeId].color = undefined;
				this.allNodes[nodeId].color = "#58FFFE";
				this.allNodes[nodeId].font.color = "#58FFFE";
				this.allNodes[nodeId].color.background = '#285352';
				this.allNodes[nodeId].border = "#58FFFE";
				// if (allNodes[nodeId].hiddenLabel !== undefined) {
				//   allNodes[nodeId].label = allNodes[nodeId].hiddenLabel;
				//   allNodes[nodeId].hiddenLabel = undefined;
				// }
			}
			this._highlightActive = false;
		}

		// transform the object into an array
		var updateArray = [];
		for (nodeId in this.allNodes) {
			if (this.allNodes.hasOwnProperty(nodeId)) {
				updateArray.push(this.allNodes[nodeId]);
			}
		}
		this.nodesDataset.update(updateArray);
	}


}
