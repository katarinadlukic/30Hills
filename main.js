let url = 'https://api.myjson.com/bins/1fe04i';
let exploreResult = getData(url); //results of api request
let contactNames = []; // Array with names

function getData(url) { //sending request to get data 
	try {
		let result;
		let xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200) {
					result = JSON.parse(xmlhttp.response);
				} else {
					return false;
				}
			}
		}
		xmlhttp.open("GET", url, false);
		xmlhttp.send();
		return result;
	} catch (err) {
		return err;
	}
}

function showFriends(data, id) { // show direct friends
	let friendsNames = [];
	for (let i = 0; i < data[id].friends.length; i++) { // 1,3
		friendsNames.push(data[data[id].friends[i] - 1].firstName + " " + data[data[id].friends[i] - 1].surname)
	}
	return friendsNames;
}

function showFoF(data, id) { // show friends of friends
	let filtered = loopFof(data, id);
	let fof = [];
	let obj = {};
	for (let i = 0; i < filtered.length; i++) { //finding duplicates
		obj[filtered[i]] = (obj[filtered[i]] + 1) || 1;
	};
	for (let x in obj) { //removing duplicates
		if (obj[x] < 2) {
			fof.push(data[x-1].firstName + " " + data[x-1].surname);
		}
	}
	return fof;
}

function showSuggested(data, id) { // show suggested friends
	let suggested = []; 
	let fof = loopFof(data, id);
	let obj = {}; // object helper
	for (let i = 0; i < fof.length; i++) { // finding duplicates
		obj[fof[i]] = (obj[fof[i]] + 1) || 1;
	};
	for (let x in obj) { // taking duplicates(suggested friends)
		if (obj[x] >= 2) {
			suggested.push(data[x-1].firstName + " " + data[x-1].surname);
		}
	}
	return suggested;
}

function loopFof(data, id) { // filters chosen user and direct friends from friendsOfFriends
	let filtered = [];
	let f = data[id].friends;
	for (let i = 0; i < f.length; i++) {
		for (let j = 0; j < data[f[i] - 1].friends.length; j++) {
					if(data[data[id].friends[i] - 1].friends[j] !== data[id].id){
						filtered.push(data[f[i] - 1].friends[j]) ;
					}		
			}			
	}
	filtered = filtered.filter(function(item){
		return !f.includes(item)
	})
	return filtered;
}

function showInfo() { // adding listeners to buttons and displaying friends
	document.body.addEventListener('click', function (evt) {
		let suggested = showSuggested(exploreResult, evt.target.id);
		let yes = "<b>Suggested friends: </b>" + suggested;
		let no = "<b>No friends suggestions</b>";
		if (evt.target.className === 'myBtn') {
			document.getElementById("info").innerHTML = `<article class="message">
			<div class="message-body">
			  <div class="message-header">
			        <p>${contactNames[evt.target.id]}<p>
				</div>
				<br>
			  <p><b>Friends: </b>${showFriends(exploreResult, evt.target.id)}</p>
			  <p><b>Friends of friends: </b>${showFoF(exploreResult, evt.target.id)}</p>
			  <p>${suggested.length != 0 ? yes : no}</p>
			</div>
		  </article>	`
		}
	}, false);
}

function display(data) { // display contact names
	showInfo();
	for (let i = 0; i < data.length; i++) {
		contactNames.push(data[i].firstName + " " + data[i].surname);
		document.getElementById("display").innerHTML += `
            <div class="card"> 
            <div class="card-content">
              <div class="media">
                <div class="media-left">
                  <figure class="image is-48x48">
                    <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
                  </figure>
                </div>
                <div class="media-content">
                  <p class="title is-6">${data[i].firstName} ${data[i].surname}</p>
                  <p class="subtitle is-6">${data[i].age} ${data[i].gender}</p>
                </div>
              </div>
              <div class="content">       
              <p class="subtitle is-6"><a id="${data[i].id - 1}" class="myBtn">Friends</a></p>
              </div>
            </div>
          </div>
            `;
	}
}
{
display(exploreResult);
}