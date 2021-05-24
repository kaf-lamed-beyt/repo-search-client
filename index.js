const searchResults = document.querySelector(".search-result");
const form = document.querySelector("#form-wrapper");

// constructing the grphql query function
// that'd be called in the 'fetch results` function
const getUserRepo = (queryString) => `
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
`;

const displayRepos = ({ data }) => {
  // destructuring the "data" argument
  const { user = [] } = data;

  data.map((repo, index) => {
    return `
        <div class="repos-wrapper">
          <div class="repository">
            <div class="repo-desc">
              <p class="repo-name">
                <a
                  class="repo-name"
                  target="__blank"
                  href="https://github.com/ireade/tictactoe"
                  >tictactoe</a
                >
              </p>
              <p class="repo-description">
                A simple JS and jQuery game of tic tac toe
              </p>
              <div class="repo-details">
                <ul>
                  <li class="primary-lang">
                    <span class="circle" style="color: orange"></span>HTML
                  </li>
                  <li class="stars"><i class="far fa-star"></i> 22</li>
                  <li class="forks"><i class="fas fa-code-branch"></i> 9</li>
                  <li class="updated-at">Updated on Sep 30</li>
                </ul>
              </div>
            </div>
            <button class="star-button">
              <i class="far fa-star"></i> star
            </button>
          </div>
        </div>
        `;
  });
};

// the function below prevents the browser from reloading
// upon the invocation of the click event
const fetchResults = (e) => {
  e.preventDefault();

  const queryString = form.elements["search"].value;

  // determines which type of request to send
  // could be a POST or GET request
  const queryMethod = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: getUserRepo(queryString),
    }),
  };

  fetch("https://api.github.com/graphql", queryMethod)
    .then((res) => res.json())
    .then(displayRepos);

  form.reset();
};

form.addEventListener("click", fetchResults);
