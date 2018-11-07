"use strict";

import * as common from "./common.js";
import {changePage,resetActions} from "./actions.js";
import * as form from "./forms.js";
import {addDsu,addSite} from "./actions.js";
import {api} from "./api.js";
import {makeTable} from "./table.js";

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
		this.extra = data.html?$(data.html):noWidgets(data.id);
	},
	title:function(){
		this.root = $("#header h2");
	}
};
function noWidgets(type){
	const word = type === "dsus"?"DSU":"Site";
	const html = $(`
	<div class="noWidgets ${type} widget">
		There is nothing to show yet, please add a ${word}.
		<div class = "addWidget">Add a ${word}</div>
	</div>
	`);
	html.find(".addWidget").click(()=>{
		type === "dsus"?addDsu():addSite();
	});
	return html;
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
frame.page.prototype.isEmpty = function(skip){
	if(!skip){
		if(!this.widgets.length){
			if(!this.root.find(".noWidgets").length) this.append(this.id === "dsus"||this.id === "sites"?noWidgets(this.id):this.extra);
		}else{
			this.root.find(".noWidgets").remove();
		}
	}
	return this.widgets.length?false:true;
};
frame.page.prototype.isSomeNotSaved = function(){
	if(!this.widgets.length) return false;
	return this.widgets.some((widget)=>{
		return (!widget.saved)||widget.changed;
	});
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
	this.isActive = state;
	state?this.root.addClass("ready"):this.root.removeClass("ready");
};

let widgetId = 0;
function getWidgetId(){
	widgetId++;
	return widgetId;
}

//Widget
export function widget(type,data){
	this.type = type;
	this.wid = getWidgetId();
	this.page = null;
	if(data){
		this.saved = true;
		for (let key of Object.keys(data)){
			this[key] = data[key];
		}
	}
	if(type === "site"){
		this.siteName = new form.text("Site Name","name",10,this);
		if(data) this.siteName.input.val(data.name).prop("disabled", true);
		this.siteDescription= new form.text("Site Description","description",10,this);
		if(data) this.siteDescription.input.val(data.description).prop("disabled", true);
		this.dsu = new form.dropDown("DSU","dsuId",this);
		if(data){
			this.dsu.input.val(data.dsuId);
			this.dsu.savedId = data.dsuId;
		}
		this.inputs = [this.siteName,this.siteDescription,this.dsu];
		if(data) this.id = data.id;
	}
	if(type === "dsu"){
		this.dsuName = new form.text("DSU Name","name",10,this);
		if(data) this.dsuName.input.val(data.name).prop("disabled", true);
		this.dsuDescription = new form.text("DSU Description","description",20,this);
		if(data) this.dsuDescription.input.val(data.description).prop("disabled", true);
		this.operationsCert = new form.number("Operations Cert","cert",{
			min:0,
			decimalPlaces:4
		},this);
		if(data) this.operationsCert.input.val(data.cert).prop("disabled", true);
		this.inputs = [this.dsuName,this.dsuDescription,this.operationsCert];
	}
}
widget.prototype.render = function(){
	const html = $(`
<div id = "wid_${this.wid}" class="widget ${this.type}${this.saved?"":" new"}">
		<div class = "actions">
			<div class="action save" ><i class="fas fa-save"></i></div>
			<div class="action delete" ><i class="fas fa-times-circle"></i></div>
		</div>
		<form class="bigform">
			<h1>New ${this.type}</h1>
		</form>
</div>
	`);
	this.deleteButton = html.find(".delete");
	this.saveButton = html.find(".save");
	this.deleteButton.click(()=>{this.delete();});
	this.saveButton.click(()=>{this.save();});
	if(this.saved){
		this.deleteButton.remove();
		this.type === "dsu"?this.saveButton.remove():this.saveButton.hide();
	}
	const form = html.find("form");
	if(this.siteName) form.append(this.siteName.root);
	if(this.siteDescription) form.append(this.siteDescription.root);
	if(this.dsu) form.append(this.dsu.root);
	if(this.dsuName) form.append(this.dsuName.root);
	if(this.dsuDescription) form.append(this.dsuDescription.root);
	if(this.operationsCert) form.append(this.operationsCert.root);
	this.root = html;
	if(this.name){
		this.title(this.name);
		this.root.addClass("saved");
	}
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
	valid?this.root.removeClass("noValid"):this.root.addClass("noValid");
	return valid;
};
widget.prototype.save = function(callback){
	if(this.isValid()){
		api.put(this,(response)=>{
			if(response.status){
				const status = response.status;
				response.text().then((response)=>{
					console.error(status,response);
					if(callback) callback();
				});
			}else{
				this.id = response.id;
				this.saved = true;
				this.deleteButton.remove();
				this.type === "dsu"?this.saveButton.remove():this.saveButton.hide();
				this.root.addClass("saved");
				if(this.type === "site"){
					this.dsu.savedId = this.dsu.input.val();
				}
				for(let item of this.inputs){
					if(item.input.attr("placeholder") !== "DSU") item.input.prop("disabled", true);
				}
				callback?callback():resetActions();
				if(!callback) makeTable(true);
			}
		});
	}
};
widget.prototype.reset = function(){
	if(!this.saved){
		this.delete();
	}else if(this.changed){
		this.dsu.input.val(this.dsu.savedId);
		this.dsuId = this.dsu.savedId;
		this.changed = false;
		this.root.removeClass("changed");
	}
};


