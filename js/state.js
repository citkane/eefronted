"use strict";

export const virtualDom = new Dom();
import {page,app} from "./builder.js";



function Dom(){
	this.actionButtons = {};
	this.pages={};
	this.activePage = null;
}
Dom.prototype.addPage = function(data){
	const Page = this.pages[data.id] = new page(data);
	Page.title = data.title;
	Page.menu = data.menu;
	Page.actions = data.actions;
	app.append(this.pages[data.id].root);
};
Dom.prototype.getPage = function(key){
	return this.pages[key];
};
import {makeModal} from "./modals.js";
virtualDom.modal = new makeModal(virtualDom);



