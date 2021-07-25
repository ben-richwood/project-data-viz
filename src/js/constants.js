export const DIR = "/assets/images/";

export const options = {
	// manipulation: false,
	height: '100%',
	width: '100%',
	locale: 'en',
	layout: {
		improvedLayout:true,
			// hierarchical: {
			//   enabled: true,
			//   direction: 'LR',
			//   sortMethod: "directed",
			//   levelSeparation: 120,
			//   nodeSpacing: 50,
			//   treeSpacing: 30
			// }
		},
		nodes: {
			shape: "box",
			shapeProperties:{
				borderRadius: 0
			},
			// shape: "image",
			// image: DIR + "3.png",
			// imagePadding: { left: 2, top: 10, right: 8, bottom: 20 },
			color:{
				border: '#58FFFE',
				background: '#285352',
				highlight: {
					border: '#58FFFE',
					background: '#58FFFE'
						// color: '#222'
					},
					hover: {
						border: '#58FFFE',
						background: '#389895'
					}
				},
				font: {
					face: 'monospace',
					color: '#58FFFE',
					align: 'left'
				},
			// margin: {
			//     top: 10,
			//     left: 15,
			//     bottom: 10,
			//     right: 15
			// },
			widthConstraint: {
				maximum: 300
			},
			physics: true,
			chosen: {
				label: function(values, id, selected, hovering) {
					if (selected) {
						values.color = '#222';
					} else {
						values.color = '#58FFFE';
					}
				}
			}
		},
		edges: {
			// arrows: { to: true },
			// arrows: {
			//     to: {
			//         enabled: true,
			//         scaleFactor: 1,
			//         type: "image",
			//         imageHeight: 12,
			//         imageWidth: 12,
			//         src: "https://visjs.org/images/visjs_logo.png",
			//     }
			// },
			color: {
				color:'#FFF',
				highlight:'#58FFFE',
				hover: '#58FFFE',
				inherit: 'from',
				opacity:1.0
			},
			font: {
				size: 12
			},
			widthConstraint: {
				maximum: 90
			},
			width: 2,
			chosen: {
				edge: function (values, id, selected, hovering) {
					values.toArrow = true;
				}
			},
			smooth: {
				// type: "cubicBezier",
				// roundness: 0.85
				type: "discrete",
				roundness: 0
			}
		},
		groups: {
			language: {
				color: { background: "#182026", border: "white" },
				shape: "diamond"
			},
			framework: {
				color: { background: "#293742", border: "white" },
				// shape: "diamond"
			},
			software: {
				color: { background: "#394B59", border: "white" },
				// shape: "diamond"
			},
			stack: {
				color: { background: "#738694", border: "white" },
				// shape: "diamond"
			},
			service: {
				color: { background: "#A7B6C2", border: "white" },
				// shape: "diamond"
			},
			CLI: {
				color: { background: "#738694", border: "white" },
				// shape: "diamond"
			},
			lib: {
				shape: "box",
				shapeProperties:{
					borderRadius: 12
				},
				color: { background: "#A7B6C2", border: "white" }
			},
			folder: {
				shape: "image",
				image: DIR + "folder.svg",
				brokenImage: DIR + "folder.png",
				color: { background: "#BFCCD6", border: "white" },
				font: {
					color: '#58FFFE'
				}
			}
		},
		physics: {
			enabled: true,
			barnesHut: {
				gravitationalConstant: -500,
				centralGravity: 0.01,
				springLength: 95,
				springConstant: 0.6,
				damping: 0.1,
				avoidOverlap: 0.8
			},
			hierarchicalRepulsion: {
				centralGravity: 0.0,
				springLength: 100,
				springConstant: 0.01,
				nodeDistance: 200,
				damping: 0.09,
				avoidOverlap: .5
			},
			repulsion: {
				centralGravity: 0.2,
				springLength: 200,
				springConstant: 0.05,
				nodeDistance: 200,
				damping: 0.09
			},
			solver: "repulsion",
			stabilization: {
				enabled: true,
				iterations: 20,
				updateInterval: 50,
				onlyDynamicEdges: false,
				fit: true
			},
			maxVelocity: 10
		},
		interaction: {
			hover: true,
			dragNodes: true,
			hideEdgesOnDrag: false, // turn to true to improve performance
			hoverConnectedEdges: true,
			multiselect: true,
			tooltipDelay: 100,
			keyboard: {
				enabled: true,
				speed: {x: 10, y: 10, zoom: 0.02},
				bindToWindow: true
			}
		},
		manipulation: {}
		/*
		manipulation: {
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
	*/
};
