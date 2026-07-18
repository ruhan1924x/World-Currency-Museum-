async function updateAccountMenu() {


    const { data } = await db.auth.getUser();

    const link = document.getElementById("accountLink");

    if (!link) return;

    if (data.user) {

        link.textContent = "👤 My Profile";
        link.href = "profile.html";

    } else {

        link.textContent = "🔐 Login";
        link.href = "login.html";

    }

}

async function isLoggedIn(){
  const { data } = await db.auth.getUser();
  return data.user;
}
document.addEventListener("DOMContentLoaded", () => {

    updateAccountMenu();

});
