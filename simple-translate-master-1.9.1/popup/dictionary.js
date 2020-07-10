let searchResult = document.getElementById("searchResult");
let meaning = document.getElementById("meaning");

//create request code
let request = new XMLHttpRequest()

//the keyword is the word that user wants to search for
request.open('GET', 'https://dictionaryapi.com/api/v3/references/collegiate/json/'+keyword+'?key=f3ea7727-6af6-4dd1-ac4d-4278bca3863c')

request.send();

console.log("hello ");
request.onload = () =>
{
    console.log(request);
    if (request.status == 200) {
        var data = JSON.parse(request.response);
        console.log(request.response);
        console.log(data[0].shortdef.toString());
        console.log(data.responseURL );
        searchResult.innerHTML = data[0].shortdef; //this 1 fetches the definition



    }
    else { //if not found in dictionary
        console.log(`error ${request.status} ${request.statusText}`)
    }
}