const searchResults = document.querySelector("#results");
const form = document.querySelector("#form-wrapper");

// constructing the graphql query function
// that'd be called in the 'fetch results` function
const getUserRepo = (queryString) => `
    query userRepos(${queryString}: String!) {
        user(login: ${queryString}) {
            avatarUrl
            name
            bio
            login
            repositories(first: 20) {
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

const displayRepos = ({ data }) => {
  // destructuring "data" to the user assignnment
  // with a typeof array.
  const { user = [] } = data;

  // the variable "resultStyle" hold the css
  // style of the search results that will be populated
  // on the DOM.
  const resulStyle = `
  .result_header {
    background: var(--base-color);
    height: 55px;
    border-bottom: 1px solid var(--muted-strong);
    position: fixed;
    z-index: 1;
    width: 100%;
  }
  
  .result_header ul {
    padding: 20px 360px;getUserRepo(searchTerm)
    list-style-type: none;
  }
  
  .result_header ul li {
    border-bottom: 2px solid var(--active-link);
    width: 150px;
    text-align: center;
    padding: 0 0 12px 0;
    font-weight: bolder;
  }
  
  .result_header ul li span {
    width: 100%;
    background: var(--muted-strong);
    border-radius: 7px;
    font-size: 11px;
    margin: 0 0 0 2px;
    padding: 0 5px;
    font-weight: normal;
  }
  
  .results_container {
    display: flex;
  }
  
  .results_container .repos_wrapper {
    margin-top: 5%;
  }
  
  .results_container .user_profile {
    padding: 0 45px;
    margin-top: 2%;
    z-index: 2;
  }
  
  .user_profile img {
    height: 250px;
    width: 250px;
    border-radius: 50%;
  }
  
  .user_bio .display_name {
    font-weight: 700;
    font-size: 20px;
  }
  
  .user_bio .username {
    margin-top: -2%;
    font-size: 16px;
    color: var(--muted-text);
  }
  
  .user_bio .bio_details {
    padding: 20px 0;
  }
  
  .repos_wrapper {
    height: 100%;
    padding: 0 30px;
    width: 100%;
  }
  
  .repos_wrapper .repository {
    height: 120px;
    border-bottom: 1px solid var(--muted-strong);
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
  }
  
  .repository .repo_name {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 18px;
    padding: 0 0 12px 0;
  }
  
  .repo_name:hover {
    text-decoration: underline;
    cursor: pointer;
  }
  
  .repository .repo_desc_container {
    width: 100%;
  }
  
  .repository .repo_description {
    padding: 0 0 12px 0;
    width: 650px;
  }
  
  .repository .repo_details ul {
    display: flex;
    list-style: none;
    font-size: 12px;
  }
  
  .repository .repo_details ul li {
    padding: 0 30px 0 0;
  }
  
  .repository .star_button {
    height: 30px;
    width: 70px;
    background: var(--secondary);
    border: 1px solid var(--muted-strong);
    border-radius: 4px;
    outline: none;
    margin-top: 35px;
  }
  
  .repository .star_button:hover {
    cursor: pointer;
  }  

  @media only screen and (max-width: 576px) {
    header {
      display: none;
    }
    
    .result_header {
      display: block;
    }
    
    .search_result {
      flex-direction: column;
    }

    .results_container {
      flex-direction: column;
    }
    
    .result_header ul {
      padding: 20px 0;
    }
    
    .repos_wrapper {
      padding: 0 10px;
    }
    
    .repo_desc_container .repo_description {
      width: 100%;
    }
    
    .results_container .user_profile {
      display: flex;
    }
    
    .search_result .user_profile {
      padding: 0 10px;
      margin-top: 65px;
      z-index: -1;
    }
    
    .user_profile img {
      height: 65px;
      width: 65px;
    }
    
    .user_profile .user_bio {
      padding: 0 0 0 15px;
    }
    
    .user_bio .display_name {
      font-size: 26px;
    }
    
    .user_bio .username {
      font-size: 20px;
    }
  }
  `;

  user &&
    user.map((repo, index) => {
      return `
      <header class=${result_header}>
        <ul>
          <li>Repositories <span class=${repo_count}>${repo.repositories.totalCount}</span></li>
        </ul>
      </header>
      <div class=${results_container}>
      <div class=${user_profile}>
        <img
          src=${repo.avatarUrl}
          alt="user profile image"
        />
        <div class=${user_bio}>
          <p class=${display_name}>${repo.name}</p>
          <p class=${username}>${repo.login}</p>
          <p class=${bio_details}>
            ${repo.bio}
          </p>
        </div>
      </div>
      <div class=${repos_wrapper}>
        <div class=${repository} key=${index}>
          <div class=${repo_desc_container}>
            <p class=${repo_name}>
              <a
                class=${repo_name}
                target="__blank"
                href=${repo.repositories.nodes.url}
                >${repo.repositories.nodes.name}</a
              >
            </p>
            <p class=${repo_description}>
                ${repo.repositories.nodes.description}
            </p>
            <div class=${repo_details}>
              <ul>
                <li class=${primary_lang}>
                  <span class=${circle} style="color: ${repo.repositories.nodes.primaryLanguage.color}"></span> ${repo.repositories.nodes.primaryLanguage.name}
                </li>
                <li class=${stars}><i class="far fa-star"></i> ${repo.repositories.nodes.stargazerCount}</li>
                <li class=${forks}><i class="fas fa-code-branch"></i> ${repo.repositories.nodes.forkCount}</li>
                <li class=${updated_at}>Updated on Sep 30</li>
              </ul>}
            </div>
          </div>
          <button class=${star_button}>
            <i class="far fa-star"></i> Star
          </button>
        </div>
      </div>
    </div>
    `;
    });
};

// the function below prevents the browser from reloading
// upon the invocation of the click event
const fetchResults = (e) => {
  e.preventDefault();

  //   const searchTerm = form.elements["search"].value;

  // using the formData API to retrieve the text
  // entered into the form field in JSON format.
  const searchTerm = new FormData(event.target);
  const keyword = Object.fromEntries(searchTerm.entries());
  JSON.stringify(keyword);
  // determines which type of request to send
  // could be a POST or GET request
  const queryMethod = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "bearer " + "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",
      "User-Agent": "repo-search-client",
    },
    body: {
      query: getUserRepo(keyword),
    },
  };

  fetch("https://api.github.com/graphql", queryMethod)
    .then((res) => res.json())
    .then((data) => console.log(data))
    // .then(displayRepos);
    .catch((err) => console.log(JSON.stringify(err)));

  form.reset();
};

form.addEventListener("submit", fetchResults);
