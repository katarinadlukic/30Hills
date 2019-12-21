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

function showFriends(data, id) { // show direct friends
	let friendsNames = [];
	for (let i = 0; i < data.length; i++) {
		names.push(data[i].firstName + " " + data[i].surname);
		for (let j = 0; j < data[id].friends.length; j++) {
			if (data[i].id == data[id].friends[j]) {
				friendsNames.push(data[i].firstName + " " + data[i].surname)
			}
		}
	}
	//  console.log(friendsNames);
}

function showFoF(data, id) { // show friends of friends
	let friendsOfFriends = [];
	for (let i = 0; i < data[id].friends.length; i++) { //data[id].friends[i]
		for (let j = 0; j < data[data[id].friends[i] - 1].friends.length; j++) {
			if (data[data[id].friends[i] - 1].friends[j] !== data[id].id) {
				friendsOfFriends.push(data[data[id].friends[i] - 1].friends[j])
			}
		}
	}
	// console.log(friendsOfFriends);
}

function addListeners() { // adding listeners to buttons
	document.body.addEventListener('click', function(evt) {
		if (evt.target.className === 'myBtn') {
			showFriends(exploreResult, evt.target.id);
			showFoF(exploreResult, evt.target.id);
		}
	}, false);
}
addListeners();
display(exploreResult);