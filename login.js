console.log("Login JS Loaded");

// Google Login
async function googleLogin() {

    const { data, error } = await db.auth.signInWithOAuth({

        provider: "google",

        options: {
            redirectTo: "http://127.0.0.1:5500/index.html"
        }

    });


    if (error) {
        console.error(error);
        alert(error.message);
        return;
    }

    console.log(data);

}


// Check Current User
async function checkUser() {

    const { data, error } = await db.auth.getUser();


    if (error) {
        console.log("No user logged in");
        return;
    }


    const user = data.user;

    console.log("Logged in User:", user);

    console.log("Name:", user.user_metadata.full_name);

    console.log("Email:", user.email);

}


// Logout
async function logout() {

    const { error } = await db.auth.signOut();


    if (error) {

        console.error(error);
        alert(error.message);
        return;

    }


    alert("Logged out successfully!");

    window.location.href = "login.html";

}


// Run when page loads
checkUser();


function openLogin(){

    document
        .getElementById("comingSoonPopup")
        .classList
        .remove("hidden");

}

function openRegister(){

    document
        .getElementById("comingSoonPopup")
        .classList
        .remove("hidden");

}

function closeComingSoon(){

  const popup = document.getElementById("comingsoonPopup");

    document
        .getElementById("comingSoonPopup")
        .classList
        .add("hidden");

}