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
					callback();
					this.toggle();
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

const messages = {
	nodsus:`
	<div>You have no DSU's set up yet. Please add at least one DSU before adding a site</div>
	`,
	refresh:`
	<div>
		<div>Are you sure you want to reset the page?</div>
		<div>All unsaved data will be lost.</div>
		<div class="buttons">
			<div class = "button cancel">cancel</div>
			<div class= "button proceed">proceed</div>
		</div>
	</div>
	`,
};