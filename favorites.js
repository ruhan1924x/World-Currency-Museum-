(async function () {

    const { data: userData } =
    await db.auth.getUser();

    if (!userData.user) {

        window.location.href = "login.html";

        return;

    }

    loadFavorites();

})();

async function loadFavorites() {

    const { data: userData } =
    await db.auth.getUser();

    const user =
    userData.user;

    const key =
    "favorites_" + user.id;

    let favorites =
    JSON.parse(localStorage.getItem(key)) || [];

    const container =
    document.getElementById("favoritesList");

    container.innerHTML = "";

    if (favorites.length === 0) {

        container.innerHTML =
        "<h2>No favorites yet.</h2>";

        return;

    }

    favorites.forEach(item => {

        container.innerHTML += `

        <div class="favorite-card">

            <img
                src="${item.image}"
                class="favorite-image">

            <h3>${item.country}</h3>

            <p>${item.value}</p>

            <button
                onclick="openNote('${item.country}','${item.series}','${item.id}')">

                View

            </button>

        </div>

        `;

    });

}

function openNote(country, series, id) {

    window.location.href =
    `note.html?country=${encodeURIComponent(country)}&series=${encodeURIComponent(series)}&id=${encodeURIComponent(id)}`;

}

function toggleMenu() {

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