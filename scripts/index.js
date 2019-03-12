
// const URL = "https://my-little-cors-proxy.herokuapp.com/https://anapioficeandfire.com/api/characters/?page=1&pageSize=50";

let allCharactersArray = [];

function urlForPage(pageNumber=0) {
    return `https://my-little-cors-proxy.herokuapp.com/https://anapioficeandfire.com/api/characters/?page=${pageNumber}&pageSize=50`;
}

function accumulateCharacters(theActualData) { // #3 Receive the actual data and do something useful.
    // console.log(theActualData) 
    // theActualData.forEach(function (oneCharacter) {
    //     allCharactersArray.push(oneCharacter);
    // });
    allCharactersArray = [
        ...allCharactersArray,
        ...theActualData
    ];
    storeCharacters(allCharactersArray);
}

const storageKey = 'game-of-thrones';
function storeCharacters(arrayOfCharacters) {
    // convert the array to a JSON string
    const jsonCharacters = JSON.stringify(arrayOfCharacters);
    console.log(`saving ${arrayOfCharacters.length} characters`);
    // set that string in localStorage
    localStorage.setItem(storageKey, jsonCharacters);
}

function loadCharacters() {
    // get the JSON string from localStorage
    const jsonCharacters = localStorage.getItem(storageKey);

    // convert it back into an array
    const arrayOfCharacters = JSON.parse(jsonCharacters);
    console.log(`loaded ${arrayOfCharacters.length} characters`);

    // return it
    return arrayOfCharacters;
}

function retrievePageOfCharacters(pageNumber) {
    fetch(urlForPage(pageNumber))
      .then(function (response) {      // #2 And then process the response so we can get data out of it
        return response.json(); 
       })
      .then(accumulateCharacters)
      .then(function () {
          console.log(`Done with page ${pageNumber}`);
      })    
}

for (let pageNumber=0; pageNumber<50; pageNumber++) {
    let delay = pageNumber * 500;

    // We have to wrap retrievePageOfCharacters
    // in an anonymous function
    // so we can pass it an argument.
    setTimeout(function () {
        retrievePageOfCharacters(pageNumber);
    }, delay);

    // If it did not take any arguments
    // we would not need to wrap it.
}

