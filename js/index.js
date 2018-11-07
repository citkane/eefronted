"use strict";
import * as build from "./builder.js";
import * as actions from "./actions.js";
import {virtualDom} from "./state.js";
import {logo} from "../resources/logo.js";
import {api} from "./api.js";
import {makeTable} from "./table.js";

//Add the site logo
$("#branding .inner").html(logo).click(()=>{
	actions.changePage("home");
});

//prepare the action buttons
$("#header .buttons .button").each(function(){
	virtualDom.actionButtons[this.id.replace("b_","")] = new build.actionButton($(this));
});

//Define the pages
const page ={
	home:{
		title:"Electricity Exchange Portal",
		menu:"home",
		actions:{
			save:false,
			refresh:false,
			add:false
		},
		html:$("#homeWrapper").clone()
	},
	dsus:{
		title:"EE client DSUs",
		menu:"Add DSU",
		actions:{
			save:actions.save,
			refresh:actions.refresh,
			add:actions.addDsu
		}
	},
	sites:{
		title:"EE client sites",
		menu:"Add Site",
		actions:{
			save:actions.save,
			refresh:actions.refresh,
			add:actions.addSite
		}
	},

	table:{
		title:"EE client network",
		menu:"View Sites",
		actions:{
			save:false,
			refresh:false,
			add:false
		},
		html:$("#tableWrapper").clone()
	}
};
$("#homeWrapper").remove();
$("#tableWrapper").remove();
//Create the pages
for(let key of Object.keys(page)){
	page[key].id = key;
	virtualDom.addPage(page[key]); //add the page to the virtual DOM
	const thisPage = virtualDom.getPage(key);
	thisPage.menuButton = new build.menuButton(page[key]); //add a menu button to the page
	build.menu.append(thisPage.menuButton.root); //render the menu button
}
actions.changePage("home");

//Load the existing DSUs and Sites
api.get("dsus",(response)=>{
	if(response.status){
		console.error(response.status,response.statusText);
		alert("Could not connect to the API server, please check the console for logs.");
		$("#app").css("opacity",1);
	}else{
		for (let key in response){
			const widget = new build.widget("dsu",response[key]);
			widget.page = virtualDom.pages.dsus;
			virtualDom.pages.dsus.prepend(widget.render());
			virtualDom.pages.dsus.widgets.push(widget);
		}
		virtualDom.pages.dsus.isEmpty();

		api.get("sites",(response)=>{
			if(response.status){
				console.error(response.status,response.statusText);
			}else{
				for (let key in response){
					const widget = new build.widget("site",response[key]);
					widget.page = virtualDom.pages.sites;
					virtualDom.pages.sites.prepend(widget.render());
					virtualDom.pages.sites.widgets.push(widget);
				}
				virtualDom.pages.sites.isEmpty();
				makeTable();
				makeTable(true);
				$("#app").css("opacity",1);
			}
		});
	}
});

$(window).bind("beforeunload", function(){	
	if(virtualDom.activePage.isSomeNotSaved()){
		return "You have unsaved changes!";
	}
});