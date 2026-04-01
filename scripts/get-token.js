const { google } = require("googleapis");
const readline = require("readline");

const CLIENT_ID = "676594613790-0f1uqdq6tv2n9jkn2o4qv71ns4blkt2p.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:3000";

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: ["https://www.googleapis.com/auth/drive.file"],
});

console.log("\n===========================================");
console.log("STEP 1: Open this URL in your browser:");
console.log("===========================================\n");
console.log(authUrl);
console.log("\n===========================================");
console.log("STEP 2: Sign in with your NSS Google account");
console.log("STEP 3: After login, you will be redirected.");
console.log("        Copy the 'code' from the URL bar.");
console.log("        It looks like: ?code=4/0AVF...&scope=...");
console.log("        Copy ONLY the code value (between code= and &scope)");
console.log("===========================================\n");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question("Paste the code here and press Enter: ", async (code) => {
  rl.close();
  try {
    const { tokens } = await oauth2Client.getToken(decodeURIComponent(code.trim()));
    console.log("\n===========================================");
    console.log("SUCCESS! Your refresh token is:");
    console.log("===========================================\n");
    console.log(tokens.refresh_token);
    console.log("\n===========================================");
    console.log("Copy the refresh token above and share it.");
    console.log("===========================================\n");
  } catch (err) {
    console.error("Error getting token:", err.message);
  }
});