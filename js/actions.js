"use strict";

import {virtualDom} from "./state.js";
import * as build from "./builder.js";

/*************************** Change between pages */
export function changePage(id){
	resetActions(id);
	for(let key of Object.keys(virtualDom.pages)){
		let page = virtualDom.pages[key];
		if(key !== id){
			page.hide(); //hide inactive pages
		}else{
			//Set action buttons for the new page and show page.
			for(let action of Object.keys(page.actions)){
				const button = virtualDom.actionButtons[action];
				button.setAction(page.actions[action]);
				button.show(page.actions[action]?true:false);
			}
			virtualDom.activePage = page;
			page.isEmpty();
			page.show();
		}
	}
}


/*************************** Add a site or Dsu */
function add(type){
	const widget = new build.widget(type);
	widget.page = virtualDom.activePage;
	for(let w of widget.page.widgets){
		for(let i of w.inputs){
			i.init = true;
		}
	}
	widget.page.widgets.push(widget);
	resetActions(widget.page.id);
	const wi = $(widget.render());	
	widget.page.prepend(wi);
	widget.page.isValid();
	widget.page.isEmpty();
	setTimeout(()=>{
		wi.removeClass("new");
	},100);
}

/*************************** Control the header action buttons */
export function resetActions(id){
	const actionPage = id==="sites"||id==="dsus";
	for (let action of Object.keys(virtualDom.actionButtons)){
		const button = virtualDom.actionButtons[action];
		button.active(false);
		if(id === "dsus" && action === "add") button.active(true);
		if(id === "sites" && action === "add" && hasValidDsus()) button.active(true);
		if(actionPage && action === "refresh" && !areAllSaved(id)) button.active(true);
	}
}
function hasValidDsus(){
	const page = virtualDom.pages.dsus;
	return page.widgets.filter((dsu)=>{
		return true; //dsu.saved
	}).length > 0;
}
function areAllSaved(id){
	const page = virtualDom.pages[id];
	return page.widgets.filter((widget)=>{
		return !widget.saved;
	}).length === 0;
}


/*************************** Export the action API */
export function saveSites(){
	alert("saveSites");
}
export function addSite(){
	add("site");
}
export function refreshSites(){
	alert("refreshSites");
}
export function saveDsus(){
	alert("saveDsus");
}
export function addDsu(){
	add("dsu");
}
export function refreshDsus(){
	alert("refreshDsus");
}