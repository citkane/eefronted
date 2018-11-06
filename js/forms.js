"use strict";

import {virtualDom} from "./state.js";

export function text(name,length){
	this.root = $(`
	<input type="text" placeholder = "${name}" maxlength="${length} required">
	`);
}
export function number(name,spec){
	this.spec = spec;
	this.root = $(`
	<input type="number" placeholder = "${name}" min = "${spec.min}">
	`);
}
export function dropDown(name){
	let options = "";
	for(let widget of virtualDom.pages.dsus.widgets){
		options += `<option value="${widget.dsuName.root.val()}">${widget.dsuName.root.val()}</option>`;
	}
	this.root = $(`
		<select name="${name}" required>
			${options}
		</select> 
	`);
}

export function valid(e){
	console.log(e);
	alert("is it valid");
}