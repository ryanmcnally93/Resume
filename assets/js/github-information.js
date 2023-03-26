function userInformationHTML(user) {
    // THIS IS THE INFORMATION FORMAT WHEN CORRECT INPUT
    // (USER) IS A URL IN THE API
    // NOTE THAT THE USERS AVATAR AND FOLLOWERS ARE ALSO LOCATED
    return `
        <h2>${user.name}
            <span class="small-name">
                (@<a href="${user.html_url}" target="_blank">${user.login}</a>)
            </span>
        </h2>
        <div class="gh-content">
            <div class="gh-avatar">
                <a href="${user.html_url}" target="_blank">
                    <img src="${user.avatar_url}" width="80" height="80" alt="${user.login}" />
                </a>
            </div>
            <p>Followers: ${user.followers} - Following ${user.following} <br> Repos: ${user.public_repos}</p>
        </div>`;
}

function repoInformationHTML(repos) {
    // MESSAGE FOR NO REPOS
    if (repos.length == 0) {
        return `<div class="clearfix repo-list">No repos!</div>`
    }

    var listItemsHTML = repos.map(function(repo) {
        // REPONSE FOR ANY REPOSITORY, ADDED AS LIST ITEMS
        return `<li>
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                </li>`
    });

    // FORMAT FOR WHICH ANSWER IS SHOWN
    return `<div class="clearfix repo-list">
                <p>
                    <strong>Repo List:</strong>
                </p>
                <ul>
                    ${listItemsHTML.join("\n")}
                </ul>
            </div>`;
}

function fetchGitHubInformation(event) {
    // MAKES DISPLAY EMPTY WHEN NO INPUT
    $("#gh-user-data").html("");
    $("#gh-repo-data").html("");

    var username = $("#gh-username").val();
    // THIS MESSAGE DISPLAYS IF FIELD IS EMPTY
    if (!username) {
        $("#gh-user-data").html(`<h2>Please enter a GitHub username</h2>`);
        return;
    }
    //DISPLAYS LOADING GIF
    $("#gh-user-data").html(
        `<div id="loader">
            <img src="assets/css/loader.gif" alt="loading..." />
        </div>`);

    // PROMISE STATEMENT TO SEARCH GITHUB API
    $.when(
        // API URL'S
        $.getJSON(`https://api.github.com/users/${username}`),
        $.getJSON(`https://api.github.com/users/${username}/repos`)
    ).then(
    function(firstResponse, secondResponse) {
        // PROMISES SEND BACK ARRAYS WHEN MULTIPLE, SELECT [0]
        var userData = firstResponse[0];
        var repoData = secondResponse[0];
        $("#gh-user-data").html(userInformationHTML(userData));
        $("#gh-repo-data").html(repoInformationHTML(repoData));
    },
    // ERROR MESSAGE FOR WHEN THE FUNCTION DOES NOT WORK
    function(errorResponse) {
        // 404 IS PAGE NOT FOUND
        if (errorResponse.status === 404) {
            $("#gh-user-data").html(
                `<h2>No info found for user ${username}</h2>`);
        } else if (errorResponse.status === 403) {
            // LETS USER KNOW API RESTRICT TIME PERIOD
            var resetTime = new Date(errorResponse.getResponseHeader('X-RateLimit-Reset')*1000);
            $("#gh-user-data").html(`<h4>Too many requests, please wait until ${resetTime.toLocaleTimeString()}`);
        } else {
            // NOT SURE WHAT THE ERROR IS, SO JUST DISPLAYING JAVASCRIPT ERROR MESSAGE
            console.log(errorResponse);
            $("#gh-user-data").html(
                `<h2>Error: ${errorResponse.responseJSON.message}</h2>`);
        }
    });
}

// DISPLAYS OCTOCATS INFORMATION BY TRIGGERING THE INPUT'S FUNCTION
$(document).ready(fetchGitHubInformation);