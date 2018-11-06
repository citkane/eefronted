"use strict";

import * as common from "./common.js";
import {changePage,resetActions} from "./actions.js";
import * as form from "./forms.js";
/**
 * Constructors for top level layout
 */
const frame = {
	menu:function(){
		this.root = $("#menu .inner");
	},
	actions:function(){
		this.root = $("#actions .inner");
	},
	branding:function(){
		this.root = $("#branding .inner");
	},
	app:function(){
		this.root = $("#viewport .inner");
	},
	page:function(data){
		this.id = data.id;
		this.widgets = [];
		this.root = $(`<div class = "page" id="${data.id}"></div>`);
		this.extra = data.html?$(data.html):$(noWidgets(data.id));
	},
	title:function(){
		this.root = $("#header h2");
	}
};
function noWidgets(type){
	return `
	<div class="noWidgets ${type}">
		There is nothing to show yet, please add a ${type}.
	</div>
	`;
}
for(let key of Object.keys(frame)){
	frame[key].prototype.append = common.append;
	frame[key].prototype.prepend = common.prepend;
	frame[key].prototype.set = common.set;
}
frame.page.prototype.show = function(){
	this.root.show();
	title.set(this.title);
	this.menuButton.setActive(true);
};
frame.page.prototype.hide = function(){
	this.root.hide();
	this.menuButton.setActive(false);
};
frame.page.prototype.isValid = function(){
	let valid = true;
	for (let widget of this.widgets){
		if(!widget.isValid()) valid = false;
	}
	return valid;
};
frame.page.prototype.isEmpty = function(){
	if(!this.widgets.length){
		this.append(this.extra);
	}else{
		this.root.find(".noWidgets").remove();
	}
};

export const menu = new frame.menu();
export const actions = new frame.actions();
export const branding = new frame.branding();
export const app = new frame.app();
export const title = new frame.title();
export const page = frame.page;

/**
 * Constructors for menu items
 */
export const menuButton = function(page){
	this.active = false;
	this.target = page.id;
	this.root = $(`<div class = "menuButton" id="menu_${page.id}">${page.menu}</div>`);
	this.root.click(()=>{
		changePage(this.target);
	});
};
menuButton.prototype.setActive = function(state){
	this.active = state;
	state?this.root.addClass("active"):this.root.removeClass("active");
};

/**
 * Constructors for widgets and buttons
 */

//Button
export function actionButton(button){
	this.root = button;
}
actionButton.prototype.show = common.show;
actionButton.prototype.setActive = common.setActive;
actionButton.prototype.setAction = common.setAction;
actionButton.prototype.active = function(state){
	state?this.root.addClass("ready"):this.root.removeClass("ready");
};

let widgetId = 0;
function getWidgetId(){
	widgetId++;
	return widgetId;
}

//Widget
export function widget(type){
	this.type = type;
	this.wid = getWidgetId();
	this.page = null;
	
	if(type === "site"){
		this.siteName = new form.text("Site Name",10,this);
		this.siteDescription= new form.text("Site Description",10,this);
		this.dsu = new form.dropDown("DSU");
		this.inputs = [this.siteName,this.siteDescription,this.dsu];
	}
	if(type === "dsu"){
		this.dsuName = new form.text("DSU Name",10,this);
		this.dsuDescription = new form.text("DSU Description",20,this);
		this.operationsCert = new form.number("Operations Cert",{
			min:0,
			decimalPlaces:4
		},this);
		this.inputs = [this.dsuName,this.dsuDescription,this.operationsCert];
	}
}
widget.prototype.render = function(){
	const html = $(`
<div id = "wid_${this.wid}" class="widget ${this.type} new">
		<div class = "actions">
			<div class="action save" ><i class="fas fa-save"></i></div>
			<div class="action delete" ><i class="fas fa-times-circle"></i></div>
		</div>
		<form class="bigform">
			<h1>New ${this.type}</h1>
		</form>
</div>
	`);
	html.find(".delete").click(()=>{this.delete();});
	const form = html.find("form");
	if(this.siteName) form.append(this.siteName.root);
	if(this.siteDescription) form.append(this.siteDescription.root);
	if(this.dsu) form.append(this.dsu.root);
	if(this.dsuName) form.append(this.dsuName.root);
	if(this.dsuDescription) form.append(this.dsuDescription.root);
	if(this.operationsCert) form.append(this.operationsCert.root);
	this.root = html;
	return html;
};
widget.prototype.delete = function(){
	this.page.widgets = this.page.widgets.filter((widget)=>{
		return this.wid !== widget.wid;
	});
	this.root.addClass("new");
	resetActions(this.page.id);
	setTimeout(()=>{
		this.root.remove();
		this.page.isEmpty();
	},500);
	
};
widget.prototype.title = function(text){
	this.root.find("h1").html(text?text:`New ${this.type}`);
};
widget.prototype.isValid = function(){
	let valid = true;
	for(let input of this.inputs){
		if (!input.isValid()) valid = false;
	}
	return valid;
};

