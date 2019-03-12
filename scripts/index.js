
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
    if (arrayOfCharacters) {
        console.log(`loaded ${arrayOfCharacters.length} characters`);
    } else {
        console.log('No characters in localStorage');
    }

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

function drawCharacterToDetail(characterObject) {
    console.log(characterObject);
    console.log('that was what got passed in');
    const detailArea = document.querySelector('[data-detail]');
    detailArea.textContent = '';

    const nameDiv = document.createElement('div');
    const bornDiv = document.createElement('div');
    const diedDiv = document.createElement('div');

    nameDiv.textContent = `Name: ${characterObject.name}`;
    bornDiv.textContent = `Born: ${characterObject.born}`;
    diedDiv.textContent = `Died: ${characterObject.died}`;
    
    detailArea.appendChild(nameDiv);    
    detailArea.appendChild(bornDiv);    
    detailArea.appendChild(diedDiv);    
}

function findCharacterInArray(url) {
    return allCharactersArray.find(function (character) {
        return character.url === url;
        // if (character.url === url) {
        //     return true;
        // } else {
        //     return false;
        // }
    });
}

function drawSingleCharacterToListing(characterObject) {
    
    const characterName = characterObject.name;
    if (characterName.length === 0) {
        return;
    }

    const anchorElement = document.createElement('a');
    anchorElement.textContent = characterName;

    // When you need to pass an argument to the event handler function
    // you must wrap it in an anonymous function.
    anchorElement.addEventListener('click', function () {
        drawCharacterToDetail(characterObject);
        // const theUrl = characterObject.url;
        // const theCharacter = findCharacterInArray(theUrl);
        // drawCharacterToDetail(theCharacter);
    });

    const listItem = document.createElement('li');
    listItem.appendChild(anchorElement);

    const listArea = document.querySelector('[data-listing]');

    listArea.appendChild(listItem);
}

function drawListOfCharacters() {
    // uses global variable allCharactersArray
    
    // loop through the array of characters
    // for each one, draw the name in the listing
    // area of the page.
    allCharactersArray.forEach(drawSingleCharacterToListing);
}

function sortByName(obj1, obj2) {
    const letter1 = obj1.name[0];
    const letter2 = obj2.name[0];

    if (letter1 < letter2) {
        return -1;
    } else if (letter2 < letter1) {
        return 1;
    }

    return 0;
}


function main() {    
    let charactersInLocalStorage = loadCharacters();
    if (charactersInLocalStorage) {
        allCharactersArray = [
            ...charactersInLocalStorage.sort(sortByName)
        ];
        drawListOfCharacters();
    } else {
        console.log("You got a whole lotta nuthin'.");
        console.log("Retrieving from the API");
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
    }
}    

main();
