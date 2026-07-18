console.log("Profile Loaded");

loadProfile();

async function loadProfile(){

  

    const { data, error } = await db.auth.getUser();

    if(error || !data.user){

        window.location.href = "login.html";

        return;

    }

    const user = data.user;

    document.getElementById("name").textContent =
        user.user_metadata.full_name || "Unknown User";

    document.getElementById("email").textContent =
        user.email;

    document.getElementById("avatar").src =
        user.user_metadata.avatar_url;

}

async function logout(){


    await db.auth.signOut();

    window.location.href = "index.html";

}
