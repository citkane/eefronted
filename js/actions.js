"use strict";

import {virtualDom} from "./state.js";
import * as build from "./builder.js";

//Change between pages
export function changePage(id){
	for(let key of Object.keys(virtualDom.pages)){
		let page = virtualDom.pages[key];
		if(key !== id){
			page.hide(); //hide inactive pages
		}else{
			//Set action buttons for the new page and show page.
			for(let action of Object.keys(page.actions)){
				virtualDom.actionButtons[action].setAction(page.actions[action]);
				virtualDom.actionButtons[action].show(page.actions[action]?true:false);				
			}
			virtualDom.activePage = page;
			page.show();
		}
	}
}

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

function add(type){
	const widget = new build.widget(type);
	widget.page = virtualDom.activePage;
	widget.page.widgets.push(widget);
	const wi = $(widget.render());
	widget.page.prepend(wi);	
	setTimeout(()=>{
		wi.removeClass("new");
	},100);
	
}