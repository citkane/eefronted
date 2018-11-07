"use strict";
import {virtualDom} from "./state.js";

let table;
const dsus = {};
const sortState = {
	1:"asc",
	3:"asc"
};
export function makeTable(update){
	table = virtualDom.pages.table.extra.find("tbody");
	if(update){
		table.find("tr").slice(1).remove();
	}else{
		const headers = table.find("th");
		headers[1].onclick = function(){
			const newDir = sortState[1] === "asc"?"desc":"asc";
			$(headers[1]).removeClass(sortState[1]).addClass(newDir);
			sorter(1);
		};
		headers[3].onclick = function(){
			sorter(3);
		};
	}
	for(const dsu of virtualDom.pages.dsus.widgets){
		dsus[dsu.id] = dsu;
	}
	for(const site of virtualDom.pages.sites.widgets){
		table.append(makeRow(site));
	}
	sortTable(1,"desc",table);
}

function sorter(column){
	const dir = sortState[column];
	sortTable(column,dir);
	sortState[column] = sortState[column] === "asc"?"desc":"asc";
}

let zebra = "odd";
function makeRow(site){
	zebra = zebra === "odd"?"even":"odd";
	return `
	<tr class = "${zebra}">
		<td>${site.id}</td>
		<td>${site.description}</td>
		<td>${site.dsuId}</td>
		<td>${dsus[site.dsuId].description}</td>
		<td>${dsus[site.dsuId].cert.toString()}</td>
	</tr>
	`;
}

//Adapted from https://www.w3schools.com/howto/howto_js_sort_table.asp
function sortTable(n,dir) {
	let rows, switching, i, x, y, shouldSwitch, switchcount = 0;
	switching = true;

	/* Make a loop that will continue until
	no switching has been done: */
	while (switching) {
		// Start by saying: no switching is done:
		switching = false;
		rows = table.find("tr");
		/* Loop through all table rows (except the
		first, which contains table headers): */
		for (i = 1; i < (rows.length - 1); i++) {
			// Start by saying there should be no switching:
			shouldSwitch = false;
			/* Get the two elements you want to compare,
			one from current row and one from the next: */
			x = rows[i].getElementsByTagName("td")[n];
			y = rows[i + 1].getElementsByTagName("td")[n];
			/* Check if the two rows should switch place,
			based on the direction, asc or desc: */
			if (dir == "asc") {
				if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
					// If so, mark as a switch and break the loop:
					shouldSwitch = true;
					break;
				}
			} else if (dir == "desc") {
				if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
					// If so, mark as a switch and break the loop:
					shouldSwitch = true;
					break;
				}
			}
		}
		if (shouldSwitch) {
			/* If a switch has been marked, make the switch
			and mark that a switch has been done: */
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			switching = true;
			// Each time a switch is done, increase this count by 1:
			switchcount ++;
		} else {
			/* If no switching has been done AND the direction is "asc",
			set the direction to "desc" and run the while loop again. */
			if (switchcount == 0 && dir == "asc") {
				dir = "desc";
				switching = true;
			}
		}
	}
}