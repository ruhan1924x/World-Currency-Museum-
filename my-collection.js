let editingId = null;
let oldImageUrl = null;

console.log("My Collection Loaded");

const imageInput =
document.getElementById("imageInput");

const previewImage =
document.getElementById("previewImage");

const saveBtn =
document.querySelector(".save-btn");

imageInput.addEventListener("change", function(){

    const file = this.files[0];

    if(!file){

        previewImage.style.display = "none";

        return;

    }

    const reader = new FileReader();

    reader.onload = function(e){

        previewImage.src = e.target.result;

        previewImage.style.display = "block";

    };

    reader.readAsDataURL(file);

});

saveBtn.addEventListener("click", saveCollection);

async function saveCollection(){



    const file =
    imageInput.files[0];

    const title =
    document.getElementById("title").value.trim();

    const description =
    document.getElementById("description").value.trim();

    if(!file && editingId === null){

        alert("Please choose an image.");

        return;

    }

    if(title===""){

        alert("Please enter a title.");

        return;

    }

    const { data:userData } =
    await db.auth.getUser();

    const user =
    userData.user;

    if(!user){

        alert("Please login first.");

        return;

    }

let imageUrl = oldImageUrl;

if(file){

    const fileName =
    Date.now() + "_" + file.name;

    const { error } =
    await db.storage
    .from("collections")
    .upload(fileName,file);

    if(error){

        console.error(error);

        alert(error.message);

        return;

    }

    const { data:imageData } =
    db.storage
    .from("collections")
    .getPublicUrl(fileName);

    imageUrl =
    imageData.publicUrl;

}

    console.log("Auth UID:", user.id);

console.log({
    user_id: user.id,
    title: title,
    description: description,
    image_url: imageUrl
});

if(editingId){

    console.log("editingId =", editingId);
    console.log("user.id =", user.id);

    const { data, error } =
    await db
    .from("collections")
    .update({

        title: title,

        description: description,

        image_url:imageUrl

    })
    .eq("user_id", user.id)
    .eq("id", editingId)

    .select();

console.log("Updated Row:", data);
console.log("Update Error:", error);

    if(error){

        alert(error.message);

        return;

    }

    alert("Collection updated!");

    editingId = null;

    oldImageUrl = null;

    saveBtn.textContent = "💾 Save Collection";

    document.getElementById("title").value = "";

    document.getElementById("description").value = "";

    previewImage.style.display = "none";

    loadCollections();

    return;

}


const { error: insertError } =
await db
.from("collections")
.insert({

    user_id: user.id,

    title: title,

    description: description,

    image_url: imageUrl

});

if(insertError){

    console.error(insertError);

    alert(insertError.message);

    return;

}

alert("Collection saved successfully!");

document.getElementById("title").value = "";

document.getElementById("description").value = "";

previewImage.style.display = "none";

imageInput.value = "";


saveBtn.textContent = "💾 Save Collection";

loadCollections();

}

loadCollections();



async function loadCollections() {

      const { data: userData } =
    await db.auth.getUser();

    const user =
    userData.user;

    if(!user){

        return;

    }

    const grid =
    document.getElementById("collectionGrid");

    const { data, error } =
    await db
    .from("collections")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

    if (error) {

        console.error(error);

        return;

    }

    grid.innerHTML = "";

    data.forEach(item => {

        const card =
        document.createElement("div");

        card.className = "collection-card";
        

        card.innerHTML = `
        <div class="card-header">

                <button class="menu-btn">⋮</button>

          <div class="menu">

                <button>👁 View<1tton>

                <button>⬇ Download</button>

               <button
                  onclick="editCollection(
                    '${item.id}',
                    '${item.title}',
                    '${item.description || ""}',
                    '${item.image_url}'
                    )">
                    ✏ Edit
                </button>

            <button class="delete-option"
                onclick="deleteCollection('${item.id}','${item.image_url}')">🗑 Delete</button>

            </div>
          </div>
            <img
                src="${item.image_url}"
                class="collection-image">

            <h3>${item.title}</h3>

            <p>${item.description || ""}</p>
            
 

        `;

        grid.appendChild(card);

        const menuBtn =
card.querySelector(".menu-btn");

const menu =
card.querySelector(".menu");

menuBtn.addEventListener("click", function(e){

    e.stopPropagation();

    // Age sob menu bondho
    document.querySelectorAll(".menu").forEach(m => {

        if(m !== menu){

            m.style.display = "none";

        }

    });

    // Ei menu toggle
    menu.style.display =
    menu.style.display === "flex"
    ? "none"
    : "flex";

});

    });

}
document.addEventListener("click", function(){


    document.querySelectorAll(".menu").forEach(menu => {
      

        menu.style.display = "none";

    });

});
async function deleteCollection(id, imageUrl){

    const confirmDelete =
    confirm("Delete this banknote?");

    if(!confirmDelete){
        return;
    }

    // Storage file name ber kora
    const fileName =
    imageUrl.split("/").pop();

    // Storage theke delete
    const { error: storageError } =
    await db.storage
    .from("collections")
    .remove([fileName]);

    if(storageError){

        console.error(storageError);

    }

    // Database theke delete
    const { error: dbError } =
    await db
    .from("collections")
    .delete()
    .eq("id", id);

    if(dbError){

        console.error(dbError);

        alert(dbError.message);

        return;

    }

    alert("Collection deleted successfully!");



    
    loadCollections();

}



function editCollection(id, title, description, imageUrl){

    editingId = id;
    oldImageUrl = imageUrl;

    document.getElementById("title").value = title;
    document.getElementById("description").value = description;

    previewImage.src = imageUrl;
    previewImage.style.display = "block";

    saveBtn.textContent = "✏ Update Collection";

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}