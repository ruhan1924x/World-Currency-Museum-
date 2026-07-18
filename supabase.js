console.log("Supabase JS Loaded");
console.log(window.supabase);

const SUPABASE_URL = "https://ezqndaqckrqogtdgtwzv.supabase.co";

const SUPABASE_KEY = "sb_publishable_L2qcoQWy_g3pvmRTuLAsZQ_gSQ_1VqU";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log(db);

async function googleLogin(){

    await db.auth.signInWithOAuth({

        provider:"google"

    });

}