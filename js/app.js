let countriesData = [];
let popularCountries = [
    "United States",
    "Japan",
    "Russia",
    "China",
    "Bangladesh",
]

fetch("data/countries.json")
.then(response => response.json())
.then(data => {

    countriesData = data;
    const popular = data.filter(country =>
        popularCountries.includes(country.country)
    );

    displayCountries(popular);

});

function displayCountries(data){

    const container =
    document.getElementById("countryList");

    container.innerHTML = "";

    data.forEach(country => {

container.innerHTML += `
<div class="card" onclick="openCountry('${country.country}')">

    <div class="flag">
        ${country.flag}
    </div>

    <h3>${country.country.toUpperCase()}</h3>

    <p class="currency">
        ${country.currency}
    </p>

    <div class="divider"></div>

    <span class="explore">
        Explore →
    </span>

</div>
`;



    });

}


function searchCountry(){

let input = document.getElementById("search").value.toLowerCase();
if(input === ""){
    const popular = countriesData.filter(country=>
        popularCountries.includes(country.country)
    );
    displayCountries(popular);
    return;
}
 let filtered = countriesData.filter(country =>
        country.country.toLowerCase().includes(input) ||
        country.currency.toLowerCase().includes(input)
    );
    const noResult = document.getElementById("noResult");

    if(filtered.length === 0){
        noResult.style.display = "block";
    }
    else{
        noResult.style.display = "none";
    }

    displayCountries(filtered);


}

function openCountry(country){

    window.location.href =
    `country.html?country=${encodeURIComponent(country)}`;

}
document.getElementById("search").addEventListener("keydown", function(event){

    if(event.key === "Enter"){
        searchCountry();
    }

});
document.getElementById("search")
.addEventListener("input", searchCountry);
function toggleMenu() {
    document.getElementById("menuList").classList.toggle("hidden");
}

document.addEventListener("click", function(e){

    const menu =
    document.querySelector(".menu");

    const menuList =
    document.getElementById("menuList");

    if(menu && !menu.contains(e.target)){

        menuList.classList.add("hidden");

    }

});