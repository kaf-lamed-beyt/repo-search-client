const searchResults = document.querySelector("#results");
const form = document.querySelector("#form-wrapper");

// loading element that comes up during the
// data fetching process.

// constructing the graphql query function
// that'd be called in the 'fetch results
const getUserRepo = (queryString) => `
  query {
      user(login: "${queryString}") {
        avatarUrl
        name
        bio
        login
        repositories (first: 20) {
            totalCount
            nodes {
                name
                url 
                createdAt
                stargazerCount
                forkCount
                description
                primaryLanguage {
                    name
                    color
                }
            }
        }
    }
  }
`;

const fetchResults = (e) => {
  // the function below prevents the browser from reloading
  // upon the invocation of the click event
  e.preventDefault();

  const searchTerm = form.elements["search"].value;

  // determines which type of request to send
  // could be a POST or GET request
  const queryMethod = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: "bearer " + "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",
      "User-Agent": "repo-search-client",
    },
    body: JSON.stringify({
      query: getUserRepo(searchTerm),
    }),
  };

  fetch("https://api.github.com/graphql", queryMethod)
    .then((res) => res.json())
    .then((data) => {
      // destructuring the key value pairs from the
      // API response
      const { avatarUrl, name, bio, login, repositories } = data.data.user;

      if (searchTerm !== login) {
        alert("please enter a valid username");
      }

      let results = `
        <header class="result_header">
          <ul>
            <li>Repositories <span class="repo_count">${
              repositories.totalCount
            }</span></li>
          </ul>
        </header>
        <div class="results_container">
          <div class="user_profile">
            <img
              src=${avatarUrl}
              alt="user profile image"
            />
            <div class="user_bio">
              <p class="display_name">${name}</p>
              <p class="username">${login}</p>
              <p class="bio_details">
                ${bio} 
              </p>
            </div>
          </div>
          ${repositories.nodes
            .map((item) => {
              return `
                <div class="repos_wrapper">
                  <div class="repository">
                    <div class="repo_desc_container">
                      <p class="repo_name">
                        <a
                          class="repo_name"target="__blank"
                          href=${item.url}
                        > 
                          ${item.name}
                        </a>
                      </p>
                      <p class="repo_description">
                        ${item.description}
                      </p>
                      <div class="repo_details">
                        <ul>
                          <li class="primary_lang">
                            <div class="circle" style="background: ${item.primaryLanguage.color}"></div> 
                            <span>${item.primaryLanguage.name}</span>
                          </li>
                          <li class="stars"><i class="far fa-star"></i> ${item.stargazerCount}</li>
                          <li class="forks"><i class="fas fa-code-branch"></i> ${item.forkCount}</li>
                          <li class="updated_at">Updated on Sep 30</li>
                        </ul>
                      </div>
                    </div>
                    <button class="star_button">
                      <i class="far fa-star"></i> Star
                    </button>
                  </div>
                </div>
              </div>
            `;
            })
            .join("")}
        </div>
      `;
      form.style.display = "none";
      searchResults.innerHTML = results;
    })
    .catch((err) => console.log(JSON.stringify(err)));
};

form.addEventListener("submit", fetchResults);
