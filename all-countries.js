fetch("data/countries.json")
.then(res => res.json())
.then(data => {

    data.sort((a, b) => a.country.localeCompare(b.country));
    const countriesDiv =
        document.getElementById("countries");
        

    data.forEach(country => {

        countriesDiv.innerHTML += `
            <div class="country-card"
            onclick="openCountry('${country.country}')">

                
                <h2>${country.flag} ${country.country}</h2>

                <p>${country.currency}</p>

            </div>
        `;

    });

});

function openCountry(country){

    window.location.href =
    `country.html?country=${encodeURIComponent(country)}`;

}
function toggleMenu(){

    document
        .getElementById("menuList")
        .classList
        .toggle("hidden");

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