export default function (elementName, handleName = undefined) {
	// Make the DIV element draggable:
	dragElement(document.getElementById(elementName), handleName);

	function dragElement(elmnt, handleName) {
		if (elmnt === null || elmnt === undefined) return
		var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

		if (handleName !== undefined){
			document.getElementById(handleName).onmousedown = dragMouseDown;
		} else if (document.getElementById(elmnt.id + "Handle")) {
			// if present, the header is where you move the DIV from:
			document.getElementById(elmnt.id + "Handle").onmousedown = dragMouseDown;
		} else {
			// otherwise, move the DIV from anywhere inside the DIV:
			elmnt.onmousedown = dragMouseDown;
		}

		function dragMouseDown(e){
			e = e || window.event;
			e.preventDefault();
			// get the mouse cursor position at startup:
			pos3 = e.clientX;
			pos4 = e.clientY;
			document.onmouseup = closeDragElement;
			// call a function whenever the cursor moves:
			document.onmousemove = elementDrag;
		}

		function elementDrag(e){
			e = e || window.event;
			e.preventDefault();
			// calculate the new cursor position:
			pos1 = pos3 - e.clientX;
			pos2 = pos4 - e.clientY;
			pos3 = e.clientX;
			pos4 = e.clientY;
			// set the element's new position:
			elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
			elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
		}

		function closeDragElement(){
			// stop moving when mouse button is released:
			document.onmouseup = null;
			document.onmousemove = null;
		}
	}
}
