"use strict";

export function append(content){
	this.root.append(content);
}
export function prepend(content){
	this.root.prepend(content);
}
export function set(content){
	this.root.html(content);
}
export function show(state){
	state?this.root.show():this.root.hide();
}
export function setActive(state){
	state?this.root.addClass("active"):this.root.removeClass("active");
}
export function setAction(callback){
	this.root.off("click");
	if(callback) this.root.click(callback);
}