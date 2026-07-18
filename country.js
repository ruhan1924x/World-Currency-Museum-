const params = new URLSearchParams(window.location.search);
const countryName = params.get("country");

let allSeries = [];

fetch("data/data.json")
.then(res => res.json())
.then(data => {

    const country = data.find(c => c.country === countryName);

    if (!country) {
        alert("Country not found!");
        return;
    }
    const hero = document.querySelector(".hero");

hero.style.backgroundImage =
`linear-gradient(rgba(199, 190, 190, 0.56), rgba(255, 255, 255, 0)),
url('${country.map}')`;

hero.style.backgroundSize = "contain";
hero.style.backgroundRepeat = "no-repeat";
hero.style.backgroundPosition = "center";

    document.getElementById("countryName").textContent =
        country.country;

    document.getElementById("flag").src =
        country.flag;

    document.getElementById("currency").textContent =
        "Currency: " + country.currency;

    document.getElementById("capital").textContent =
        "Capital: " + country.capital;

    document.getElementById("largestNote").textContent =
        "Largest Note: " + country.largestNote;

    document.getElementById("history").textContent =
        country.history;
        setTimeout(() => {

    const history =
    document.getElementById("history");

    const btn =
    document.getElementById("historyBtn");

    if(history.scrollHeight <= history.clientHeight){

        btn.style.display = "none";

    }else{

        btn.style.display = "inline-block";

    }

}, 50);

    // ---------- LOAD BANKNOTES ----------
    fetch(`banknotes/${country.country.toLowerCase()}.json`)
    .then(res => res.json())
    .then(seriesData => {

        allSeries = seriesData;

        createYearList();

        renderNotes(allSeries[0].series);

    });

    // ---------- LOAD COINS ----------
    const coinsDiv = document.getElementById("coins");

    coinsDiv.innerHTML = "";

    country.coins.forEach(coin => {

        coinsDiv.innerHTML += `
            <div class="coin-card">
                <img src="${coin.image}" width="120">
                <p>${coin.value}</p>
            </div>
        `;

    });

});

// ============================

function createYearList(){

    const yearList = document.getElementById("yearList");

    yearList.innerHTML = "";

    allSeries.forEach(series => {

        yearList.innerHTML += `
            <div onclick="selectYear('${series.series}', event)">
                ${series.series}
            </div>
        `;

    });

}

// ============================

function renderNotes(seriesName){

    const banknotesDiv =
    document.getElementById("banknotes");

    banknotesDiv.innerHTML = "";

    const selectedSeries =
    allSeries.find(item => item.series === seriesName);

    if(!selectedSeries) return;

    selectedSeries.notes.forEach(note => {

        banknotesDiv.innerHTML += `

            <div class="note-card"
            onclick="openNote('${countryName}','${selectedSeries.series}','${note.value}')">

                <img src="${note.image}" width="200">

                <p>${note.value}</p>

            </div>

        `;

    });

}

// ============================

function selectYear(seriesName, event){

    event.stopPropagation();

    document.getElementById("selectedYear").textContent =
        seriesName + " ▼";

    document.getElementById("yearList").classList.add("hidden");

    renderNotes(seriesName);

}

// ============================

function toggleYears(){

    document.getElementById("yearList")
    .classList.toggle("hidden");

}

// ============================

function openNote(country, series ,note){

    window.location.href =
    `note.html?country=${encodeURIComponent(country)}&series=${encodeURIComponent(series)}&note=${encodeURIComponent(note)}`;

}

function toggleMenu() {

    document.getElementById("menuList").classList.toggle("hidden");

}

function toggleText(id){

    const text =
    document.getElementById(id);

    const btn =
    document.getElementById(id + "Btn");

    text.classList.toggle("expanded");

    if(text.classList.contains("expanded")){

        btn.innerHTML = "▲ See Less";

    }else{

        btn.innerHTML = "▼ See More";

    }

}

function toggleText(id){

    const text = document.getElementById(id);
    const btn = document.getElementById(id + "Btn");

    text.classList.toggle("expanded");

    if(text.classList.contains("expanded")){

        btn.innerHTML = "▲ See Less";

    }else{

        btn.innerHTML = "▼ See More";

    }

}

document.addEventListener("click", function(e){

    const selector = document.querySelector(".year-selector");
    const yearList = document.getElementById("yearList");

    if(!selector.contains(e.target)){

        yearList.classList.add("hidden");

    }

});

document.addEventListener("click", function(e){

    const menu =
    document.querySelector(".menu");

    const menuList =
    document.getElementById("menuList");

    if(menu && !menu.contains(e.target)){

        menuList.classList.add("hidden");

    }

});

