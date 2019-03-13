
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

function convertToJSON(response) {
    // Start the conversion process.
    return response.json();  // <-------------- We're returning another Promise.
}

function logWeatherForDebugging (theWeather) {
    console.log('This is the weather. Yer welcome');
    console.log(theWeather);
    return theWeather;
}

function drawWeather(theWeather) {
    // create and append some DOM elements
}

function main() {    

    // We need to fetch our GPS coordinates
    // And then we need to send that
    // to another API (via fetch)

    const GEO_URL = "https://api.opencagedata.com/geocode/v1/json?q=Atlanta,Georgia,US&key=2218757b92f34ccdb80a7e2c6bac321b";
    // const GEO_URL = "https://api.opencagzedata.com/geocode/v1/json?q=Atlanta,Georgia,US&key=2218757b92f34ccdb80a7e2c6bac321b";

    fetch(GEO_URL)
        .then(function (response) {
            // Start the conversion process.
            console.log(response);
            return response.json();  // <-------------- We're returning another Promise.
        })
        .then(function (geoData) {
            console.log('Inside the function (geoData)');
            console.log(geoData.results[0].geometry.lat);
            console.log(geoData.results[0].geometry.lng);
            return geoData.results[0].geometry;
        })
        .catch(function (error) {
            console.log(error);
            console.log('ouchie. that no worky');
            // reportErrorToUser(error);
            return {"documentation":"https://opencagedata.com/api","licenses":[{"name":"CC-BY-SA","url":"https://creativecommons.org/licenses/by-sa/3.0/"},{"name":"ODbL","url":"https://opendatacommons.org/licenses/odbl/summary/"}],"rate":{"limit":2500,"remaining":2498,"reset":1552521600},"results":[{"annotations":{"DMS":{"lat":"33\u00b0 44' 56.75532'' N","lng":"84\u00b0 23' 24.66564'' W"},"FIPS":{"county":"13121","state":"13"},"MGRS":"16SGC4174937397","Maidenhead":"EM73tr39es","Mercator":{"x":-9394272.411,"y":3971424.307},"OSM":{"edit_url":"https://www.openstreetmap.org/edit?relation=119557#map=17/33.74910/-84.39018","url":"https://www.openstreetmap.org/?mlat=33.74910&mlon=-84.39018#map=17/33.74910/-84.39018"},"callingcode":1,"currency":{"alternate_symbols":["US$"],"decimal_mark":".","disambiguate_symbol":"US$","html_entity":"$","iso_code":"USD","iso_numeric":840,"name":"United States Dollar","smallest_denomination":1,"subunit":"Cent","subunit_to_unit":100,"symbol":"$","symbol_first":1,"thousands_separator":","},"flag":"\ud83c\uddfa\ud83c\uddf8","geohash":"djgzzxufwpvrd1jsbyny","qibla":52.32,"sun":{"rise":{"apparent":1552477740,"astronomical":1552472760,"civil":1552476240,"nautical":1552474500},"set":{"apparent":1552520580,"astronomical":1552439160,"civil":1552435680,"nautical":1552437420}},"timezone":{"name":"America/New_York","now_in_dst":1,"offset_sec":-14400,"offset_string":-400,"short_name":"EDT"},"what3words":{"words":"weekends.speeches.ladder"},"wikidata":"Q23556"},"bounds":{"northeast":{"lat":33.886823,"lng":-84.28956},"southwest":{"lat":33.647808,"lng":-84.551068}},"components":{"ISO_3166-1_alpha-2":"US","ISO_3166-1_alpha-3":"USA","_type":"city","city":"Atlanta","continent":"North America","country":"USA","country_code":"us","county":"Fulton County","state":"Georgia","state_code":"GA"},"confidence":4,"formatted":"Atlanta, GA, United States of America","geometry":{"lat":33.7490987,"lng":-84.3901849}}],"status":{"code":200,"message":"OK"},"stay_informed":{"blog":"https://blog.opencagedata.com","twitter":"https://twitter.com/opencagedata"},"thanks":"For using an OpenCage Data API","timestamp":{"created_http":"Wed, 13 Mar 2019 14:44:50 GMT","created_unix":1552488290},"total_results":1};
        })
        // .catch(function (error) {
            // The further down the chain your .catch is,
            // the more stuff it has to be responsible for.
        // })




}    

main();
