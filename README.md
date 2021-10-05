<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://i.imgur.com/LK7P7yy.png">
    <img src="https://i.imgur.com/LK7P7yy.png" alt="Logo" height="220">
  </a>

  <h2 align="center">Dumonbot</h2>

  <p align="center">
   A bot that creates threads on the most diverse areas of knowledge.
</a>
    <br />
    <br />
    ·
     <a href="https://twitter.com/DumonBot">Twitter</a>
    ·
  </p>
</p>

<p align="center">
<a href="https://github.com/juniorklawa/dumonbot/actions"><img src="https://github.com/juniorklawa/dumonbot/workflows/Tests/badge.svg"></a>
   <a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
</p>
<br />


<p align="center">
  <img src="https://i.imgur.com/1e73Wxw.gif" >
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
 * [Built With](#built-with)
* [Getting Started](#getting-started)
* [Installation](#installation)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)




<!-- ABOUT THE PROJECT -->
## About The Project


Dumonbot is a twitter bot that generates threads about all knowledge areas.

## Why dumont?
Santos Dumont is considered a polymath (a person who knows many sciences) since he was a great Brazilian inventor, having inventions such as: the airplane and the airship. The bot's intention is, as Santos Dumont did, to show and spread the most diverse areas of human knowledge.


### Built With

* [NodeJS](https://nodejs.org/en/)
* [MongoDB](https://www.mongodb.com/)
* [IBM Watson](https://www.ibm.com/br-pt/watson)
* [wtf_wikipedia](https://github.com/spencermountain/wtf_wikipedia)
* [Heroku](https://www.heroku.com/)


<!-- GETTING STARTED -->
## Getting Started

### Installation

1. Clone the repo
```sh
git clone git@github.com:juniorklawa/dumonbot.git
```
3. Install packages
```sh
yarn or npm install
```
4. Enter your api keys in `.env.example`
```JS
ALGORITHMIA_KEY= 'YOUR_ALGORITHMIA_KEY_KEY'
WATSON_KEY= 'YOUR_WATSON_KEY_KEY'
CUSTOM_SEARCH_AUTH= 'YOUR_CUSTOM_SEARCH_AUTH_KEY'
CUSTOM_SEARCH_CX= 'YOUR_CUSTOM_SEARCH_CX_KEY'
NLU_URL= 'YOUR_NLU_URL_KEY'
MONGO_URL= 'YOUR_MONGO_URL_KEY'
TWIT_CONSUMER_KEY= 'YOUR_TWIT_CONSUMER_KEY_KEY'
TWIT_CONSUMER_SECRET= 'YOUR_TWIT_CONSUMER_SECRET_KEY'
TWIT_ACCESS_TOKEN_SECRET= 'YOUR_TWIT_ACCESS_TOKEN_SECRET_KEY'
TWIT_ACCESS_TOKEN= 'YOUR_TWIT_ACCESS_TOKEN_KEY'
```
5. Run
```sh
yarn dev:server
```


<!-- ROADMAP -->
## Known issues

 - Images unrelated to the subject


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Everaldo Junior - [Linkedin](https://www.linkedin.com/in/everaldojuniorklawa/)


