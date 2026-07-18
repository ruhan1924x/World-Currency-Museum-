async function isLoggedIn() {

    const { data } = await db.auth.getUser();

    return data.user;

}

const params = new URLSearchParams(window.location.search);

const countryName = params.get("country");
const seriesName = params.get("series");
const noteValue = params.get("note");
const noteId = params.get("id");

let currentNote;
let countries = [];
let notes = [];
let currentIndex = 0;

const img = document.getElementById("noteImage");

/* ---------------- IMAGE TRANSITION ---------------- */

function changeImage(src) {

    img.style.opacity = 0;

    setTimeout(() => {
        img.src = src;
        img.style.opacity = 1;
    }, 200);

}

/* ---------------- LOAD DATA ---------------- */

Promise.all([
   
    fetch(`banknotes/${countryName.toLowerCase()}.json`).then(res => res.json()),
    fetch(`details/${countryName.toLowerCase()}/note-details.json`).then(res => res.json()),
    fetch("data/data.json").then(res => res.json())
])

.then(([banknoteData, detailsData, countryData]) => {

    console.log("1");

countries = countryData;

console.log("2");

const selectedSeries = banknoteData.find(
    s => s.series === seriesName
);

notes = selectedSeries.notes;

currentIndex = noteId
    ? notes.findIndex(n => n.id === noteId)
    : notes.findIndex(n => n.value === noteValue);

if (currentIndex === -1) {
    alert("Current note not found!");
    return;
}
console.log("3", selectedSeries);

const imageNote = noteId
    ? selectedSeries.notes.find(n => n.id === noteId)
    : selectedSeries.notes.find(n => n.value === noteValue);
console.log("4", imageNote);


const detailNote = detailsData.find(
    n => n.id === imageNote.id
);
console.log("5", detailNote);

currentNote = {
    ...imageNote,
    ...detailNote,
    series: seriesName
};

console.log("6");

loadNote();
updateFavoriteButton();

console.log("7");
    


   

})


.catch(err => console.error(err));

/* ---------------- LOAD NOTE ---------------- */

function loadNote() {
    console.log("loadNote called");
    console.log(currentNote);
    

    const country = countries.find(
        c => c.country === currentNote.country
    );

    if (country) {

        document.body.style.backgroundImage =
            `linear-gradient(rgba(0,0,0,.80), rgba(0,0,0,.80)),
            url('${country.map}')`;

        document.getElementById("currency").textContent =
            "Currency: " + country.currency;

    }

    document.getElementById("noteTitle").textContent =
        currentNote.value;

    changeImage(currentNote.image);

    document.getElementById("country").textContent =
        "Country: " + currentNote.country;

    document.getElementById("value").textContent =
        "Value: " + currentNote.value;

    document.getElementById("issueDate").textContent =
        "Issue Date: " + currentNote.issueDate;

    document.getElementById("governor").textContent =
        "Governor: " + currentNote.governor;

    document.getElementById("person").textContent =
        "Person: " + currentNote.person;

    document.getElementById("material").textContent =
        "Material: " + currentNote.material;

    document.getElementById("dimensions").textContent =
        "Dimensions: " + currentNote.dimensions;

    document.getElementById("history").textContent =
        currentNote.history;

    document.getElementById("economy").textContent =
        currentNote.economy;

    document.getElementById("security").textContent =
        currentNote.security;

}

/* ---------------- FRONT / BACK ---------------- */

function showFront() {

    if (currentNote) {
        changeImage(currentNote.image);
    }

}

function showBack() {

    if (currentNote) {
        changeImage(currentNote.backImage);
    }

}


/* ---------------- NEXT NOTE ---------------- */

function nextNote() {

    if (currentIndex >= notes.length - 1) return;

    currentIndex++;

    const nextValue = notes[currentIndex].value;

    window.location.href =
        `note.html?country=${encodeURIComponent(countryName)}&series=${encodeURIComponent(seriesName)}&note=${encodeURIComponent(nextValue)}`;

}

/* ---------------- PREVIOUS NOTE ---------------- */

function prevNote() {

    if (currentIndex <= 0) return;

    currentIndex--;

    const prevValue = notes[currentIndex].value;

    window.location.href =
        `note.html?country=${encodeURIComponent(countryName)}&series=${encodeURIComponent(seriesName)}&note=${encodeURIComponent(prevValue)}`;

}

/* ---------------- TOUCH SWIPE ---------------- */

let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("touchstart", (e) => {

    touchStartX = e.changedTouches[0].screenX;

});

document.addEventListener("touchend", (e) => {

    touchEndX = e.changedTouches[0].screenX;

    const diff = touchStartX - touchEndX;

    if (diff > 80) {

        nextNote();

    } else if (diff < -80) {

        prevNote();

    }

});


/* ---------------- MOUSE SWIPE ---------------- */

let mouseStartX = 0;
let mouseEndX = 0;
let isDragging = false;

window.addEventListener("DOMContentLoaded", () => {

    const container = document.querySelector(".container");

    container.addEventListener("mousedown", (e) => {

        isDragging = true;
        mouseStartX = e.clientX;

    });

    container.addEventListener("mouseup", (e) => {

        if (!isDragging) return;

        mouseEndX = e.clientX;
        isDragging = false;

        const diff = mouseStartX - mouseEndX;

        if (diff > 80) {

            nextNote();

        } else if (diff < -80) {

            prevNote();

        }

    });

    container.addEventListener("mouseleave", () => {

        isDragging = false;

    });

});

function toggleMenu() {

    document.getElementById("menuList").classList.toggle("hidden");

}


async function toggleFavorite() {

        const user = await isLoggedIn();

    if (!user) {

        document
            .getElementById("loginModal")
            .classList
            .remove("hidden");

        return;

    }

    const key = "favorites_" + user.id;
    let favorites =
        JSON.parse(localStorage.getItem(key)) || [];


    const index = favorites.findIndex(
        note => note.id === currentNote.id
    );

    if (index === -1) {

        favorites.push(currentNote);

    } else {

        favorites.splice(index, 1);

    }

    localStorage.setItem(
        key,
        JSON.stringify(favorites)
    );

    await updateFavoriteButton();

}
async function updateFavoriteButton() {

    const { data } =
await db.auth.getUser();

const user =
data.user;

if(!user) return;

const key =
"favorites_" + user.id;

const favorites =
JSON.parse(localStorage.getItem(key)) || [];
    const exists = favorites.some(
        note => note.id === currentNote.id
    );

    const btn = document.getElementById("favoriteBtn");

    if (exists) {

        btn.textContent = "♥";
        btn.classList.add("active");

    } else {

        btn.textContent = "♡";
        btn.classList.remove("active");

    }

}



function toggleText(id){

    const text =
        document.getElementById(id);

    const btn =
        document.getElementById(id+"Btn");

    text.classList.toggle("expanded");

    if(text.classList.contains("expanded")){

        btn.innerHTML="▲ See Less";

    }else{

        btn.innerHTML="▼ See More";

    }

}


function closeLoginModal(){

    document
        .getElementById("loginModal")
        .classList
        .add("hidden");

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