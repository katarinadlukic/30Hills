let url = 'https://api.myjson.com/bins/1fe04i';
let exploreResult = getData(url); //results of api request
function getData(url) { //sending request to get data 
	try {
		let result;
		let xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
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
	console.log("Friends: " + friendsNames);
}

function showFoF(data, id) { // show friends of friends
	let fof = loopFof(data, id);
	let filteredFof = new Set(); // filter duplicates
	for (let i = 0; i < fof.length; i++) {
		filteredFof.add(fof[i]);
	}
	console.log("Friends of friends: " + Array.from(filteredFof));
}

function showSuggested(data, id) { // show suggested friends
	let fof = loopFof(data, id);
	let suggested = []; // array of suggested friends
	let obj = {}; // object helper
	for (let i = 0; i < fof.length; i++) {
		obj[fof[i]] = (obj[fof[i]] + 1) || 1;
	};
	for (let x in obj) {
		if (obj[x] >= 2) {
			suggested.push(x);
		}
	}
	(suggested.length !== 0) ? console.log("Suggested friends: " + suggested): console.log("No friends suggestions");
}

function addListeners() { // adding listeners to buttons
	document.body.addEventListener('click', function(evt) {
		if (evt.target.className === 'myBtn') {
			showFriends(exploreResult, evt.target.id);
			showFoF(exploreResult, evt.target.id);
			showSuggested(exploreResult, evt.target.id);
		}
	}, false);
}

function loopFof(data, id) { // returns unfiltered array of friends of friends
	let friendsOfFriends = [];
	for (let i = 0; i < data[id].friends.length; i++) {
		for (let j = 0; j < data[data[id].friends[i] - 1].friends.length; j++) {
			if (data[data[id].friends[i] - 1].friends[j] !== data[id].id) {
				friendsOfFriends.push(data[[data[data[id].friends[i] - 1].friends[j]] - 1].firstName + " " + data[[data[data[id].friends[i] - 1].friends[j]] - 1].surname);
			}
		}
	}
	return friendsOfFriends;
}

function display(data) { // display contact names
	for (let i = 0; i < data.length; i++) {
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
              <p class="subtitle is-6"><button id="${data[i].id - 1}" class="myBtn">Friends</button></p>
              </div>
            </div>
          </div>
            `;
	}
}
addListeners();
display(exploreResult);