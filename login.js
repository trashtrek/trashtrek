// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyA0Xih7lW9ECLYUrpqQoDJOUN9TmXYRXV8",
    authDomain: "trash-to-treasure-8ebca.firebaseapp.com",
    projectId: "trash-to-treasure-8ebca",
    storageBucket: "trash-to-treasure-8ebca.appspot.com",
    messagingSenderId: "1047516244024",
    appId: "1:1047516244024:web:701628a1e4beb9a0c1decd"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Function to switch to Sign Up form
function showSignUp() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('signup-container').style.display = 'block';
}

// Function to switch to Login form
function showLogin() {
    document.getElementById('signup-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
}

// Function to dynamically create the Firestore database
function initializeDatabase() {
    db.collection("users").get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log("Initializing database...");
                db.collection("users").doc("admin").set({ password: "admin123" })
                    .then(() => console.log("Database initialized with admin user."))
                    .catch(error => console.error("Error initializing database: ", error));
            } else {
                console.log("Database already exists.");
            }
        })
        .catch(error => console.error("Error checking database: ", error));
}

// Call function to initialize database
initializeDatabase();

// Function to handle user sign-up
function signUp() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    if (username && password) {
        db.collection("users").doc(username).get().then(doc => {
            if (doc.exists) {
                document.getElementById('signup-message').innerText = "Username already exists.";
            } else {
                db.collection("users").doc(username).set({ password: password })
                    .then(() => {
                        document.getElementById('signup-message').innerText = "Sign-up successful!";
                        setTimeout(() => { 
                            window.location.replace("home.html");  // Redirect to home.html
                        }, 1000);
                    })
                    .catch(error => console.error("Error signing up: ", error));
            }
        });
    } else {
        document.getElementById('signup-message').innerText = "Please fill in all fields.";
    }
}

// Function to handle user login
function logIn() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    db.collection("users").doc(username).get().then(doc => {
        if (doc.exists && doc.data().password === password) {
            document.getElementById('login-message').innerText = "Login successful!";
            setTimeout(() => { 
                window.location.replace("home.html");  // Redirect to home.html
            }, 1000);
        } else {
            document.getElementById('login-message').innerText = "Invalid username or password.";
        }
    }).catch(error => console.error("Error logging in: ", error));
}
