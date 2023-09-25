
function navSlide() {
    var burger = document.querySelector(".burger");
    var nav = document.querySelector(".nav-links");

    burger.addEventListener("click", function () {
        nav.classList.toggle("nav-active");
        burger.classList.toggle("toggle");
    });
}
navSlide();






function getTeamCardsData() {
    var cardContainer = document.getElementById("card-container");

    $.get("https://mocki.io/v1/8cb8410d-0756-4d7c-b509-1bfe9747d3a0", function (data) {
        var responseData = JSON.stringify(data);
        localStorage.setItem('teamCard', responseData);

        var parsedData = data;

        for (var i = 0; i < parsedData.length; i++) {
            cardContainer.innerHTML += `<div class="card" onclick="showPlayers('${parsedData[i].short_name.toUpperCase()}')">
                <a href="#">
                    <img src="${parsedData[i].logo}" alt="">
                    <p>${parsedData[i].name}</p>
                    <div class="trophy">
                        <span class="material-symbols-outlined">
                            rewarded_ads
                        </span>
                        <span class="count"> - ${parsedData[i].trophy}</span>
                    </div>
                </a>
            </div>`;
        }
    });
}

getTeamCardsData();

function showPlayers(teamShortName) {
    var teamData = JSON.parse(localStorage.getItem('teamCard'));
    var playerData = JSON.parse(localStorage.getItem('playerCard'));

    var team = teamData.find(function (team) {
        return team.short_name.toUpperCase() === teamShortName;
    });

    if (team) {
        var teamPlayers = playerData.filter(function (player) {
            return player.from.toLowerCase() === team.short_name.toLowerCase();
        });

        localStorage.setItem('selectedTeam', JSON.stringify(team));
        localStorage.setItem('selectedTeamPlayers', JSON.stringify(teamPlayers));

        window.location.href = 'teams.html';
    }
}




 function displayTeamDetails() {
    var selectedTeam = JSON.parse(localStorage.getItem('selectedTeam'));
    if (selectedTeam) {
        var teamDetailsContainer = document.getElementById('team-details-container');
        teamDetailsContainer.innerHTML = `
            <div class="team-details">
                <img src="${selectedTeam.logo}" alt="Team Logo">
                <h1>${selectedTeam.name}</h1>
                <p>Trophies: ${selectedTeam.trophy}</p>
            </div>
        `;
        var playersContainer = document.getElementById('players-container');
        var selectedTeamPlayers = JSON.parse(localStorage.getItem('selectedTeamPlayers'));

    if (selectedTeamPlayers && selectedTeamPlayers.length > 0) {
        selectedTeamPlayers.forEach(function (player, index) {
            var status = player.isPlaying ? 'Playing' : 'Bench';
            playersContainer.innerHTML += `
                <div class="card" onclick="showPlayerDetails(${index})">
                    <h2>Player Name: ${player.playerName}</h2>
                    <p>Team: ${player.from}</p>
                    <p>Price: $${player.price}</p>
                    <p>Player Status: ${status}</p>
                    <p>Description: ${player.description}</p>
                </div>
            `;
        });
    } else {
        playersContainer.innerHTML = 'No players available for this team.';
    }
    
}
 }

 displayTeamDetails();


//searching

function searchTeams() {
    var searchTerm = document.getElementById('teamSearch').value.toLowerCase();
    var teamData = JSON.parse(localStorage.getItem('teamCard'));

    var filteredTeams = teamData.filter(function (team) {
        return team.name.toLowerCase().includes(searchTerm);
    });

    displaySearchResults(filteredTeams);
}

function displaySearchResults(teams) {
    var cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = '';

    if (teams.length > 0) {
        teams.forEach(function (team) {
            cardContainer.innerHTML += `
                <div class="card" onclick="showPlayers('${team.short_name.toUpperCase()}')">
                    <a href="#">
                        <img src="${team.logo}" alt="">
                        <p>${team.name}</p>
                        <div class="trophy">
                            <span class="material-symbols-outlined">
                                rewarded_ads
                            </span>
                            <span class="count"> - ${team.trophy}</span>
                        </div>
                    </a>
                </div>
            `;
        });
    } else {
        cardContainer.innerHTML = 'No teams found.';
    }
}



//  form for adding a team
function createTeamForm() {
    var formContainer = document.getElementById('form-container');
    formContainer.innerHTML = `
        <div id="team-form">
            <label for="teamName">Team Name:</label>
            <input type="text" id="teamName" placeholder="Enter team name" required>
            <label for="teamShortName">Short Name:</label>
            <input type="text" id="teamShortName" placeholder="Enter short name" required>
            <label for="teamLogo">Logo URL:</label>
            <input type="text" id="teamLogo" placeholder="Enter logo URL" required>
            <label for="teamTrophy">Trophies:</label>
            <input type="number" id="teamTrophy" placeholder="Enter number of trophies" required>
            <button id="submitTeam" onclick="addTeamFromForm()">Add Team</button>
        </div>
    `;
}

// Function to add a team from the form
function addTeamFromForm() {
    var team = {
        name: document.getElementById('teamName').value,
        short_name: document.getElementById('teamShortName').value,
        logo: document.getElementById('teamLogo').value,
        trophy: parseInt(document.getElementById('teamTrophy').value)
    };

    
    var existingTeams = JSON.parse(localStorage.getItem('teamCard')) || [];

    // Add the new team to the existing teams
    existingTeams.push(team);

    // Update localStorage with the updated teams
    localStorage.setItem('teamCard', JSON.stringify(existingTeams));

    // Refresh the team cards display
    getTeamCardsData();

    // Clear the form and hide it
    var formContainer = document.getElementById('form-container');
    formContainer.innerHTML = '';
}


document.getElementById('addTeam').addEventListener('click', createTeamForm);



// form for adding a player
function createPlayerForm() {
    var formContainer = document.getElementById('form-container');
    formContainer.innerHTML = `
        <div id="player-form">
            <label for="playerName">Player Name:</label>
            <input type="text" id="playerName" placeholder="Enter player name" required>
            <label for="playerFrom">From (Team):</label>
            <input type="text" id="playerFrom" placeholder="Enter team short name" required>
            <label for="playerPrice">Price:</label>
            <input type="number" id="playerPrice" placeholder="Enter player price" required>
            <label for="playerStatus">Player Status:</label>
            <select id="playerStatus">
                <option value="playing">Playing</option>
                <option value="bench">Bench</option>
            </select>
            <label for="playerDescription">Description:</label>
            <textarea id="playerDescription" placeholder="Enter player description" required></textarea>
            <button id="submitPlayer" onclick="addPlayerFromForm()">Add Player</button>
        </div>
    `;
}

//  add a player from the form
function addPlayerFromForm() {
    var player = {
        playerName: document.getElementById('playerName').value,
        from: document.getElementById('playerFrom').value,
        price: parseInt(document.getElementById('playerPrice').value),
        isPlaying: document.getElementById('playerStatus').value === 'playing',
        description: document.getElementById('playerDescription').value
    };

    // Retrieve existing players from localStorage
    var existingPlayers = JSON.parse(localStorage.getItem('playerCard')) || [];

    // Add the new player to the existing players
    existingPlayers.push(player);

    // Update localStorage with the updated players
    localStorage.setItem('playerCard', JSON.stringify(existingPlayers));

    // Clear the form and hide it
    var formContainer = document.getElementById('form-container');
    formContainer.innerHTML = '';

   
    alert('Player added successfully!');
}

// ... (existing code)


function showPlayerDetails(playerIndex) {
    var selectedTeamPlayers = JSON.parse(localStorage.getItem('selectedTeamPlayers'));

    if (selectedTeamPlayers && selectedTeamPlayers.length > playerIndex) {
        var selectedPlayer = selectedTeamPlayers[playerIndex];
        localStorage.setItem('selectedPlayer', JSON.stringify(selectedPlayer));

        // Navigate to playerDetails page
        window.location.href = 'players.html';
    } else {
        console.error('Invalid player index.');
    }
}





