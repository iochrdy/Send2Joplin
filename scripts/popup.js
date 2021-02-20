window.addEventListener("load", onLoad);

async function onLoad() {
	//Check to see if the web clipper service is up
	let url = 'http://127.0.0.1:41184/ping';
    let response = await fetch(url);

    console.log(response.status); // 200
    console.log(response.statusText); // OK

	//If the service is up, update the popup and continue
    if (response.status === 200) {
        let data = await response.text();
        // Show the user that the status is OK
		var srvStat = document.getElementById("clipperNote");
		srvStat.innerHTML = "Server Status: " + response.statusText;
		
		
		//Tell the world what we're doing
		console.log('This is the Joplin web clipper for Thunderbird! - from popup.js');
		//Get the tabId
		const tabs = await browser.tabs.query({
		active: true,
		currentWindow: true,
		})
		const tabId = tabs[0].id;
		//With the tab id, get the message details
		const message = await browser.messageDisplay.getDisplayedMessage(tabId);
		console.log(message);
		console.log(message.id);
		const messageBody = await browser.messages.getFull(message.id);
		console.log(messageBody.parts.length);
		let thePart = messageBody.parts[0];
		console.log(messageBody.parts[0]);
		//console.log(messageBody.parts[0].parts[0]);
		//console.log(messageBody.parts[0].parts[0].parts[0]);
		//console.log(messageBody.parts[0].parts[0].parts[0].parts[0].body);
		// todo: look up the array length and get appropriate message part
		
		//Update the popup with the message summary
		var msgInfo = document.getElementById("msgInfo");
				msgInfo.innerHTML = "Date: " + message.date + "<BR>" + "Sender: " + message.author + "<BR>" + "Subject: " + message.subject + "<BR>" + messageBody.parts[0].body;
		
		//Now, let's see if we can send this to joplin through the API
		//This is the joplin token - hardcoded for now...
		let token = '<Insert the token from your Joplin WebClipper>';
		//Hardcoding the notebook id for now.
		let notebookId = 'bb29b391bc454f5d92977b089a5da25a';
		//Get the list of notebooks and populate a dropdown
		//or: check for the existing "Thunderbird Clips" notebook and create it if it doesn't exist
		//to-be coded...
		//quick and dirty send to Joplin
		let clipUrl = 'http://127.0.0.1:41184/notes' + "?&token=" + token;
		console.log(clipUrl);
				let clipMethod = 'POST';
				let clipPath = 'notes';
		console.log(`Popup: ${clipMethod} ${clipPath}`);
		//setup the JSON payload
		let payload = { 
		parent_id: notebookId,
		title: message.subject,
		body: "**Date:** " + message.date + "<BR>" + "**Sender:** " + message.author + "<BR>" + "**Message:** " + messageBody.parts[0].body,
		author: 'Mike Roper',
		source_application: 'Thunderbird-Extension',
		};
		
		const fetchOptions = {
			method: clipMethod,
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		};
		let clipResponse = await fetch(clipUrl, fetchOptions);
		console.log(clipResponse);
		
		
		//End of Joplin code
	}else{
		//Something went wrong and we cant reach the clipper service
		var srvStat = document.getElementById("clipperNote");
			srvStat.innerHTML = "Server Status: NOT OK";
	}

}