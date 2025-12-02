// Global variables
var signupName = null;
var signupEmail = null;
var signupPassword = null;
var signinEmail = null;
var signinPassword = null;
var incorrectMsg = null;
var usersList = [];

document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements if they exist on the page
    signupName = document.getElementById("signupName");
    signupEmail = document.getElementById("signupEmail");
    signupPassword = document.getElementById("signupPassword");
    signinEmail = document.getElementById("signinEmail");
    signinPassword = document.getElementById("signinPassword");
    incorrectMsg = document.getElementById("incorrect");
    
    // Load users from localStorage
    if (localStorage.getItem("usersArray") != null) {
        usersList = JSON.parse(localStorage.getItem("usersArray"));
    }
    
    console.log("JavaScript loaded successfully");
    
    // Check which page we're on and run appropriate functions
    checkCurrentPage();
});

// CHECK CURRENT PAGE 
function checkCurrentPage() {
    var currentPage = window.location.pathname;
    
    // If we're on home.html, check login status
    if (currentPage.includes("home.html")) {
        checkLoginStatus();
    }
    
    // If we're on index.html (login) and user is already logged in, redirect to home
    if (currentPage.includes("index.html")) {
        var currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser) {
            window.location.href = "home.html";
        }
    }
    
    // If we're on signup.html and user is already logged in, redirect to home
    if (currentPage.includes("signup.html")) {
        var currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser) {
            window.location.href = "home.html";
        }
    }
}

//  HOME PAGE FUNCTIONS 
function displayCurrentUser() {
    // Get current user from localStorage
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    // Display user name in navbar if element exists
    var userNameNav = document.getElementById("userNameNav");
    if (userNameNav && currentUser) {
        userNameNav.textContent = currentUser.name;
    }
    
    // Display user name in main content if element exists
    var userNameMain = document.getElementById("userNameMain");
    if (userNameMain && currentUser) {
        userNameMain.textContent = currentUser.name;
    }
}

function checkLoginStatus() {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    if (!currentUser) {
        // User is not logged in, redirect to login page
        window.location.href = "index.html";
    } else {
        // User is logged in, display their name
        displayCurrentUser();
    }
}

//LOGOUT FUNCTION
function logout() {
    if (confirm("Are you sure you want to logout?")) {
        // Remove user from localStorage
        localStorage.removeItem("currentUser");
        
        // Redirect to login page
        window.location.href = "index.html";
    }
}

//SIGN UP FUNCTION
function signUp() {
    console.log("signUp function called");
    
    if (!signupName || !signupEmail || !signupPassword) {
        console.error("Form elements not found!");
        return;
    }
    
    if (validateSignupName() && validateSignupEmail() && validateSignupPassword()) {
        // Check if email already exists
        if (isEmailExist(signupEmail.value)) {
            alert("Email already exists! Please use a different email.");
            return;
        }
        
        // Create user object
        var user = {
            name: signupName.value,
            email: signupEmail.value,
            password: signupPassword.value
        };
        
        // Add to users list
        usersList.push(user);
        
        // Save to localStorage
        localStorage.setItem("usersArray", JSON.stringify(usersList));
        
        // Clear inputs
        clearSignupInputs();
        
        // Redirect to login page
        window.location.href = "index.html";
        alert("Sign Up Successful! Please login.");
    }
}

// LOGIN FUNCTION 
function login() {
    console.log("login function called");
    
    if (!signinEmail || !signinPassword || !incorrectMsg) {
        console.error("Login elements not found!");
        return;
    }
    
    var email = signinEmail.value;
    var password = signinPassword.value;
    
    // Check if any user matches the credentials
    var user = usersList.find(function(user) {
        return user.email === email && user.password === password;
    });
    
    if (user) {
        // Login successful
        incorrectMsg.innerHTML = "Login Successful!";
        incorrectMsg.style.color = "green";
        incorrectMsg.classList.remove("d-none");
        
        // Store current user in session
        localStorage.setItem("currentUser", JSON.stringify(user));
        
        // Redirect to home page after 1 second
        setTimeout(function() {
            window.location.href = "home.html";
        }, 1000);
    } else {
        // Login failed
        incorrectMsg.innerHTML = "Incorrect email or password";
        incorrectMsg.style.color = "red";
        incorrectMsg.classList.remove("d-none");
    }
}

// VALIDATION FUNCTIONS
function validateSignupName() {
    console.log("validateSignupName called");
    
    if (!signupName) {
        console.error("signupName element not found!");
        return false;
    }
    
    var regex = /^[a-zA-Z\s]{3,}$/;
    var alertNameMsg = document.getElementById("alertNameMsg");
    
    if (regex.test(signupName.value)) {
        signupName.classList.add("is-valid");
        signupName.classList.remove("is-invalid");
        if(alertNameMsg) alertNameMsg.classList.add("d-none");
        return true;
    } else {
        signupName.classList.remove("is-valid");
        signupName.classList.add("is-invalid");
        if(alertNameMsg) alertNameMsg.classList.remove("d-none");
        return false;
    }
}

function validateSignupEmail() {
    console.log("validateSignupEmail called");
    
    if (!signupEmail) {
        console.error("signupEmail element not found!");
        return false;
    }
    
    var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    var alertEmailMsg = document.getElementById("alertEmailMsg");
    
    if (regex.test(signupEmail.value)) {
        signupEmail.classList.add("is-valid");
        signupEmail.classList.remove("is-invalid");
        if(alertEmailMsg) alertEmailMsg.classList.add("d-none");
        return true;
    } else {
        signupEmail.classList.remove("is-valid");
        signupEmail.classList.add("is-invalid");
        if(alertEmailMsg) alertEmailMsg.classList.remove("d-none");
        return false;
    }
}

function validateSignupPassword() {
    console.log("validateSignupPassword called");
    
    if (!signupPassword) {
        console.error("signupPassword element not found!");
        return false;
    }
    
    // Minimum 8 characters with at least: 1 letter, 1 number, 1 special character
    var regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    var alertPasswordMsg = document.getElementById("alertPasswordMsg");
    
    if (regex.test(signupPassword.value)) {
        signupPassword.classList.add("is-valid");
        signupPassword.classList.remove("is-invalid");
        if(alertPasswordMsg) {
            alertPasswordMsg.innerHTML = "Password is valid";
            alertPasswordMsg.classList.add("d-none");
        }
        return true;
    } else {
        signupPassword.classList.remove("is-valid");
        signupPassword.classList.add("is-invalid");
        if(alertPasswordMsg) {
            alertPasswordMsg.innerHTML = "Password must be at least 8 characters with at least 1 letter, 1 number, and 1 special character (@$!%*?&)";
            alertPasswordMsg.classList.remove("d-none");
        }
        return false;
    }
}

//HELPER FUNCTIONS
function isEmailExist(email) {
    return usersList.some(function(user) {
        return user.email === email;
    });
}

function clearSignupInputs() {
    if(signupName) {
        signupName.value = "";
        signupName.classList.remove("is-valid");
    }
    if(signupEmail) {
        signupEmail.value = "";
        signupEmail.classList.remove("is-valid");
    }
    if(signupPassword) {
        signupPassword.value = "";
        signupPassword.classList.remove("is-valid");
    }
}