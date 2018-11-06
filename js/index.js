"use strict";
import * as build from "./builder.js";
import * as actions from "./actions.js";
import {virtualDom} from "./state.js";
import {logo} from "../resources/logo.js";

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
		}
	},
	sites:{
		title:"EE client sites",
		menu:"Manage Sites",
		actions:{
			save:actions.saveSites,
			refresh:actions.refreshSites,
			add:actions.addSite
		}
	},
	dsus:{
		title:"EE client DSUs",
		menu:"Manage DSUs",
		actions:{
			save:actions.saveDsus,
			refresh:actions.refreshDsus,
			add:actions.addDsu
		}
	},
	table:{
		title:"EE client network",
		menu:"Network Overview",
		actions:{
			save:false,
			refresh:false,
			add:false
		}
	}
};
//Create the pages
for(let key of Object.keys(page)){
	page[key].id = key;
	virtualDom.addPage(page[key]); //add the page to the virtual DOM
	const thisPage = virtualDom.getPage(key);
	thisPage.menuButton = new build.menuButton(page[key]); //add a menu button to the page
	build.menu.append(thisPage.menuButton.root); //render the menu button
}
actions.changePage("home");
