"use strict";

export function makeModal(){
	this.root = $("#modal");
	this.root.find(".message .close").click(()=>{this.toggle();});
	this.message = this.root.find(".message .inner");
}
makeModal.prototype.toggle = function(message,callback){
	if(this.root.hasClass("show")){
		this.open = false;
		this.root.removeClass("show");
		if(this.callback) this.callback();
		this.callback = false;
	}else{
		this.open = true;
		this.callback = callback;
		const html = $(messages[message]||"No message found for the modal");
		const buttons = html.find(".buttons");
		if(buttons.length){
			const proceed = buttons.find(".proceed");
			if(proceed.length){
				proceed.click(()=>{
					this.toggle();
					callback();
				});
				this.callback = false;
			}
			const cancel = buttons.find(".cancel");
			if (cancel) cancel.click(()=>{this.toggle();});
		}
		this.message.html(html);
		this.root.addClass("show");
	}
};

const buttons = `
<div class="buttons">
	<div class = "button cancel">cancel</div>
	<div class= "button proceed">proceed</div>
</div>
`;
const messages = {
	nodsus:`
	<div>You have no DSUs set up yet. Please add at least one DSU before adding a site</div>
	`,
	refresh:`
	<div>
		<div>Are you sure you want to reset the page?</div>
		<div>All unsaved data will be lost.</div>
		${buttons}
	</div>
	`,
	save:`
	<div>
		<div>Are you sure you want to save the page?</div>
		<div>All unsaved data will be committed.</div>
		${buttons}
	</div>
	`,
	incomplete:`
	<div>
		<div>You have unsaved forms on the page</div>
		<div>Please save or remove them before proceeding.</div>
	</div>
	`
};