let network = null;
let edges;
let nodes;
let data;
let container;
let options;

const DIR = "./assets/images/";

function Settings() {
    this.isStabilized = false
}

const settings = new Settings();

const domElements = {
    exportArea: document.getElementById("input_output"),
    container: document.getElementById('mynetwork'),
    exportButton: document.getElementById("export_button")
};

let nodesDataset, edgesDataset;
let highlightActive = false;
let networkCanvas;

// console.log(domElements);

exportArea = domElements.exportArea;
container = domElements.container;
exportButton = domElements.exportButton;

let groups = ["framework", "stack", "lib", "service", "software", "CLI", "company"];

let taxonomy = ["language", "os", "freemium", "tried"];
// Paid, subscription, FOSS, freemium
// for OS, could use % modulo to determine which platform -> 2 for Windows, 3 for Mac and 5 for Linux.
// Then 15 means Linux and Mac

let itemList = [];


// var options = {};
options = {
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
};

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
    }
})

function displayPopupInfo(idx){
    let item = listContainer.itemList.find(x => x.id === idx);
    // console.log(idx);
    console.log(item);
    let networkNode = network.body.nodes[idx];
    extraProps = {x: networkNode.x, y: networkNode.y};
    itemDetail.content = {
        ...item,
        ...extraProps
    };
    itemDetail.show = true;
}

function draw() {
  // destroy();
  console.log("draw()", container, data, options);
  network = new vis.Network(container, data, options);

    // get a JSON object
    // Used for neighbourhoodHighlight()
    allNodes = nodesDataset.get({ returnType: "Object" });

    networkCanvas = document.getElementById("mynetwork").getElementsByTagName("canvas")[0];

    network.once("beforeDrawing", function() {
        network.focus(5, { // NodeID
            scale: 4
        });
    });
    network.once("afterDrawing", function() {
        network.fit({
            animation: {
                duration: 1200,
                easingFunction: "easeOutQuart"
            }
        });
    });

    network.on("stabilized", function(){
        console.log("Stabilized");
        if(!settings.isStabilized){
            network.fit({
                animation: {
                    duration: 1200,
                    easingFunction: "easeOutQuart"
                }
            });
            settings.isStabilized = true;
            let loaderScreen = document.getElementById('loader');
            if (loaderScreen) {
                let parentNode = loaderScreen.parentNode;
                parentNode.removeChild(loaderScreen);
            }
        }
    })


    network.on("stabilizationProgress", function(params) {
      console.log(params);
    });
    network.on("hoverNode", function() {
      networkCanvas.style.cursor = "pointer";
    });

    network.on("blurNode", function() {
        networkCanvas.style.cursor = "default";
      //
    });
    network.on("hoverEdge", function() {
      //
    });
    network.on("blurEdge", function() {
        networkCanvas.style.cursor = "default";
    });
    network.on("dragStart", function() {
      //
    });
    network.on("dragging", function() {
        networkCanvas.style.cursor = "move";
      //
    });
    network.on("dragEnd", function() {
      networkCanvas.style.cursor = "cursor";
    });
    network.on("click", function(e){
        // console.log(e);
        // console.log(network.body.nodes);
        console.log(data);
        if(e.nodes[0] && e.nodes[0] != undefined){
            // console.log(getNodeById(network.body.nodes, e.nodes[0]));
            console.log( network.body.nodes[e.nodes[0]] );
            displayPopupInfo(e.nodes[0]);
            neighbourhoodHighlight(e);
        }
    });
}

function destroy() {
    if (network !== null) {
        network.destroy();
        network = null;
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

  return new vis.DataSet(networkNodes);
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

  return new vis.DataSet(networkEdges);
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
  draw();
  // init();
  // networkCanvas = document.getElementById("mynetwork").getElementsByTagName("canvas")[0];
});


// readTextFile("assets/js/networkDataTest.json", function(text){
readTextFile("assets/js/networkData.json", function(text){
  var dataJson = JSON.parse(text);
  // console.log("dataJson.itemList: ",dataJson.itemList);
  listContainer.itemList = listContainer.itemList.concat(dataJson.itemList);
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
    // create an array with edges
    // nodes = new vis.DataSet(filteredForVis);
    // edges = new vis.DataSet(dataJson.edges);

    // console.log("filteredForVis", filteredForVis)

    nodesDataset = new vis.DataSet(filteredForVis);
    edgesDataset = new vis.DataSet(dataJson.edges);
    data = {
        // nodes: nodes,
        // edges: edges
        nodes: nodesDataset,
        edges: edgesDataset
    };
    draw();
});

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function neighbourhoodHighlight(params) {
  // if something is selected:
  if (params.nodes.length > 0) {
    highlightActive = true;
    var i, j;
    var selectedNode = params.nodes[0];
    var degrees = 2;

    // mark all nodes as hard to read.
    for (var nodeId in allNodes) {
      allNodes[nodeId].color = "rgba(130,130,130,1)";
    }
    var connectedNodes = network.getConnectedNodes(selectedNode);
    var allConnectedNodes = [];

    // get the second degree nodes
    for (i = 1; i < degrees; i++) {
      for (j = 0; j < connectedNodes.length; j++) {
        allConnectedNodes = allConnectedNodes.concat(
          network.getConnectedNodes(connectedNodes[j])
        );
      }
    }

    // all second degree nodes get a different color and their label back
    for (i = 0; i < allConnectedNodes.length; i++) {
      allNodes[allConnectedNodes[i]].color.color = "#58FFFE";
      allNodes[allConnectedNodes[i]].border = "#58FFFE";
      allNodes[allConnectedNodes[i]].color.background = '#285352';
            
      // if (allNodes[allConnectedNodes[i]].hiddenLabel !== undefined) {
      //   allNodes[allConnectedNodes[i]].label =
      //     allNodes[allConnectedNodes[i]].hiddenLabel;
      //   allNodes[allConnectedNodes[i]].hiddenLabel = undefined;
      // }
    }

    // all first degree nodes get their own color and their label back
    for (i = 0; i < connectedNodes.length; i++) {
      allNodes[connectedNodes[i]].color = undefined;
      // if (allNodes[connectedNodes[i]].hiddenLabel !== undefined) {
      //   allNodes[connectedNodes[i]].label =
      //     allNodes[connectedNodes[i]].hiddenLabel;
      //   allNodes[connectedNodes[i]].hiddenLabel = undefined;
      // }
    }

    // the main node gets its own color and its label back.
    allNodes[selectedNode].color = undefined;
    // if (allNodes[selectedNode].hiddenLabel !== undefined) {
    //   allNodes[selectedNode].label = allNodes[selectedNode].hiddenLabel;
    //   allNodes[selectedNode].hiddenLabel = undefined;
    // }
  } else if (highlightActive === true) {
    // reset all nodes
    for (var nodeId in allNodes) {
      // allNodes[nodeId].color = undefined;
      allNodes[nodeId].color = "#58FFFE";
      allNodes[nodeId].font.color = "#58FFFE";
      allNodes[nodeId].color.background = '#285352';
      allNodes[nodeId].border = "#58FFFE";
      // if (allNodes[nodeId].hiddenLabel !== undefined) {
      //   allNodes[nodeId].label = allNodes[nodeId].hiddenLabel;
      //   allNodes[nodeId].hiddenLabel = undefined;
      // }
    }
    highlightActive = false;
  }

  // transform the object into an array
  var updateArray = [];
  for (nodeId in allNodes) {
    if (allNodes.hasOwnProperty(nodeId)) {
      updateArray.push(allNodes[nodeId]);
    }
  }
  nodesDataset.update(updateArray);
}