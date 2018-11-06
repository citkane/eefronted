"use strict";

import {virtualDom} from "./state.js";

export function text(name,length,parent){
	this.init = false;
	this.root = $(`
	<div class="formGroup">
		<div class="label"><label>${name}</label></div>
		<input type="text" placeholder = "${name}" maxlength="${length}">
		<div class = "info">Required, text with a maximum length of ${length} characters.</div>
	</div>
	`);
	this.input = $(this.root).find("input");
	this.input.prop("required",true);
	const react = ()=>{
		if(name === "DSU Name" || name === "Site Name") parent.title(this.input.val());
		const pageValid = virtualDom.activePage.isValid();
		virtualDom.actionButtons.save.active(pageValid);
	};
	this.isValid = function(){
		const valid =  this.input.val() && this.input.val().length <= length;
		valid?this.input[0].setCustomValidity(""):this.input[0].setCustomValidity(this.init?"Invalid input":"");
		return valid;
	};
	this.input.on("keyup focusout",(e)=>{
		if(e.type === "keyup") react();
		if(e.type === "focusout") {
			this.init = true;
			this.isValid();
		}
	});
}

export function number(name,spec){
	this.spec = spec;
	let step = ".";
	let amount = spec.decimalPlaces;
	while (amount > 0){
		amount --;
		amount?step += "0":step += "1";	
	}
	this.root = $(`
	<div class="formGroup">
		<div class="label"><label>${name}</label></div>
		<input type="number" placeholder = "${name}" min = "${spec.min}" step="${step}">
		<div class = "info">Required, number with a min of ${spec.min} and 0.[max ${spec.decimalPlaces} decimal places].</div>
	</div>
	`);
	this.input = $(this.root).find("input");
	this.input.prop("required",true);
	this.input.on("keyup focusout",(e)=>{
		if(e.type === "keyup"){
			const pageValid = virtualDom.activePage.isValid();
			virtualDom.actionButtons.save.active(pageValid);
		}
		if(e.type === "focusout"){
			this.init = true;
			this.isValid();
		}
	});
	this.isValid = function(){
		const number  = this.input.prop("valueAsNumber");
		const decimal = this.input.val().split(".")[1];
		const valid = !Number.isNaN(number) && (!decimal || decimal.length <= this.spec.decimalPlaces);
		valid?this.input[0].setCustomValidity(""):this.input[0].setCustomValidity(this.init?"Invalid field":""); 
		return valid;
	};
}
export function dropDown(name){
	let options = "";
	for(let widget of virtualDom.pages.dsus.widgets){
		const name = widget.dsuName.input.val();
		options += `<option value="${name}">${name}</option>`;
	}
	this.root = $(`
	<div class="formGroup">
		<div class="label"><label>${name}</label></div>
		<select name="${name}">
			${options}
		</select> 
	</div>
	`);
	this.input = $(this.root).find("select");
	this.input.on("focusout input",(e)=>{
		if(e.type === "focusout"){
			this.init = true;
			this.isValid();
		}
		if(e.type === "input"){
			const pageValid = virtualDom.activePage.isValid();
			virtualDom.actionButtons.save.active(pageValid);			
		}
	});
	this.isValid = function(){
		const valid = this.input.val() && dsuExistsSaved(this.input.val());
		valid?this.input[0].setCustomValidity(""):this.input[0].setCustomValidity(this.init?"Invalid field":"");
		return valid;
	};
}

function dsuExistsSaved(name){
	const dsus = virtualDom.pages.dsus.widgets;
	return dsus.some((dsu)=>{
		return dsu.dsuName === name && dsu.saved;
	});
}

export function valid(e){
	console.log(e);
	alert("is it valid");
}