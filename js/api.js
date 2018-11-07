"use strict";

export const api = new Api();

function Api(){
	this.server = "http://localhost:3000/";
	this.endpoint = this.server+"v1/api/";
}
Api.prototype.get = function(type,callback){
	const endpoint = this.endpoint+type;
	fetch(endpoint).then(function(response){
		if(!response.ok) callback(response);
		return response.json();
	}).then((response)=>{
		callback(response);
	});
};
Api.prototype.put = function(widget,callback){
	const type = widget.type === "dsu"?"dsus":"sites";
	const endpoint = this.endpoint + type;
	const data = {};
	if (type === "dsus"){
		data.name = widget.name;
		data.description = widget.description;
		data.cert = widget.cert;
	}else{
		data.dsuId = widget.dsuId;
		data.name = widget.name;
		data.description = widget.description;
	}
	console.log(data);
	fetch(endpoint, {
		method: "PUT",
		
		headers: {
			"Accept": "text/html; charset=utf-8",
			"Content-Type": "application/json"
		},
		
		body: JSON.stringify(data)
	}).then((response)=>{
		if(!response.ok) callback(response);
		return response.json();
	}).then((response)=>{
		callback(response);
	});
};