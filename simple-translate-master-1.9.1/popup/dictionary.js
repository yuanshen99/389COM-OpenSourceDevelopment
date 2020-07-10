let searchResult = document.getElementById("searchResult");
let buttondic = document.getElementById("buttondic");
let keyword = document.getElementById("textarea");

//popoutoptions
buttondic.addEventListener("click",
    function (event) {
        if(!keyword.value.replace(/\s/g, '').length) { //check if the text area are empty or whitespace only
            searchResult.innerHTML = "Definition: please enter a word"; //indicate word required
            return
        }
            //create request code
        let request = new XMLHttpRequest()

//the keyword is the word that user wants to search for
        request.open('GET', 'https://dictionaryapi.com/api/v3/references/collegiate/json/'+keyword.value+'?key=f3ea7727-6af6-4dd1-ac4d-4278bca3863c');

        request.send();

        request.onload = () =>
        {

            console.log(request);
            if (request.status == 200) {

                var data = JSON.parse(request.response);
                if(data[0].shortdef.length < 1){//check there are definition from response
                    searchResult.innerHTML = "Definition: no meaning found"; //return no result found found
                }else{
                    searchResult.innerHTML = "Defenition: " + data[0].shortdef;
                } //this 1 fetches the definition

            }
            else { //if not found in dictionary
                console.log(`error ${request.status} ${request.statusText}`)
            }
        }
    }
);

