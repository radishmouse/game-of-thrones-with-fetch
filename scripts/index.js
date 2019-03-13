
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

    // We know that there are no more characters
    // to load if the API is sending us empty arrays.
    if (theActualData.length === 0) {
        // This is a terrible, but useful hack
        // reload the page
        // location.reload();

        // Really, though...when we have
        // loaded all the data from the API,
        // just call the main function again!
        main();
    }
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

function drawListOfCharacters(characters=allCharactersArray) {
    // uses global variable allCharactersArray
    
    const listArea = document.querySelector('[data-listing]');
    listArea.textContent = '';
    // loop through the array of characters
    // for each one, draw the name in the listing
    // area of the page.
    characters.forEach(drawSingleCharacterToListing);
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

function filterByLetter(letter) {
    console.log(letter);
    if (letter.length === 1) {
        const filtered = allCharactersArray.filter(function (character) {
            return character.name.startsWith(letter.toUpperCase());
        });
        console.log(`drawing for ${letter}`);
        drawListOfCharacters(filtered);
    } else {
        console.log('drawing all');
        drawListOfCharacters();
    }
}

function attachClickToLetters() {
    const letters = document.querySelectorAll('[data-index] a');
    letters.forEach(function (letter) {
        letter.addEventListener('click', function () {
            filterByLetter(letter.textContent);
        });
    });
}

function main() {    

    // We need to fetch our GPS coordinates
    // And then we need to send that
    // to another API (via fetch)

    const GEO_URL = "https://api.opencagedata.com/geocode/v1/json?q=Atlanta,Georgia,US&key=2218757b92f34ccdb80a7e2c6bac321b";

    fetch(GEO_URL)
        .then(function (response) {
            // Start the conversion process.
            return response.json();  // <-------------- We're returning another Promise.
        })
        .then(function (geoData) {
            console.log('Inside the function (geoData)');
            console.log(geoData.results[0].geometry.lat);
            console.log(geoData.results[0].geometry.lng);
            return geoData.results[0].geometry;
        })
        .then(function (coordinates) {
            console.log('Inside the function (coordinates)');
            // Call the other API with yet another fetch
            console.log(coordinates);
            const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lng}&units=imperial&appid=2f4580c1da2a1471787ee4c356181fd1`;

            fetch(WEATHER_URL)
                .then(function (response) {
                    // Start the conversion process.
                    return response.json();  // <-------------- We're returning another Promise.
                })
                .then(function (theWeather) {
                    console.log('This is the weather. Yer welcome');
                    console.log(theWeather);
                })                

        })



}    

main();
