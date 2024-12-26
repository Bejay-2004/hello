// Select buttons and forms
const loginBtn = document.querySelector("#login");
const registerBtn = document.querySelector("#register");
const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");

const loginButton = document.querySelector("#loginButton");
const registerButton = document.querySelector("#registerButton");

// Switch to login form
loginBtn.addEventListener("click", () => {
    loginBtn.style.backgroundColor = "#ffd700";
    loginBtn.style.color = "white";
    registerBtn.style.backgroundColor = "rgba(255, 255, 255, 0.13)";
    loginBtn.style.color = "black";
    registerBtn.style.color = "white";
    
    loginForm.style.left = "50%";
    registerForm.style.left = "-50%";
    
    loginForm.style.opacity = 1;
    registerForm.style.opacity = 0;
    
    document.querySelector(".col-1").style.borderRadius = "0 30% 20% 0";
});

// Switch to register form
registerBtn.addEventListener("click", () => {
    loginBtn.style.backgroundColor = "rgba(255, 255, 255, 0.13)";
    loginBtn.style.color = "white";
    registerBtn.style.backgroundColor = "#ffd700";
    registerBtn.style.color = "black";
    
    loginForm.style.left = "150%";
    registerForm.style.left = "50%";
    
    loginForm.style.opacity = 0;
    registerForm.style.opacity = 1;
    
    document.querySelector(".col-1").style.borderRadius = "0 20% 30% 0";
});


// Login User form submission
loginButton.addEventListener("click", function () {
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    // Check if fields are filled
    if (!username || !password) {
        alert("Please fill in all fields.");
        return;
    }

    // Send login data to the backend
    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Redirect to the URL provided by the server
            window.location.href = data.redirectUrl;
        } else {
            alert("Invalid login credentials");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while processing your request.");
    });
});

// Register User form submission
signupButton.addEventListener("click", function () {
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    // Check if fields are filled
    if (!username || !password) {
        alert("Please fill in all fields.");
        return;
    }

    // Send registration data to the backend
    fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Registration successful!");
        } else {
            alert("Error during registration");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while processing your request.");
    });
});


// Ensure these buttons are correctly initialized
const adminLoginButton = document.querySelector("#adminLoginButton");

// Login Admin form submission
adminLoginButton.addEventListener("click", function () {
    console.log("Login button clicked"); // Check if button works
    const admin_name = document.querySelector("#admin_name").value;
    const admin_password = document.querySelector("#admin_password").value;

    // Check if fields are filled
    if (!admin_name || !admin_password) {
        alert("Please fill in all fields.");
        return;
    }

    // Send login data to the backend
    fetch("/admin/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ admin_name, admin_password }), // Send plaintext password
    })
    .then(response => {
        console.log("Fetch response status:", response.status); // Log status code
        return response.json();
    })
    .then(data => {
        console.log("Login response data:", data); // Log response data
        if (data.success) {
            window.location.href = data.redirectUrl;
        } else {
            alert(data.message || "Invalid login credentials");
        }
    })
    .catch(error => {
        console.error("Error occurred:", error);
        alert("An error occurred while processing your request. Please check the console for more details.");
    });
});



// Handle the form submission
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission

    // Get the input values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send the login data to the backend
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Successful login: display username and user ID
                document.getElementById('profileName').textContent = data.username;
                document.getElementById('profileId').textContent = data.userId;

                // Optionally redirect to another page
                window.location.href = 'index.html'; // Redirect to a page after login
            } else {
                // Handle login failure
                alert('Login failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});



// Route to get user data (for profile page)
app.get('/get-user', (req, res) => {
    if (req.session.user) {
        // Send back user information stored in session
        res.json({
            success: true,
            username: req.session.user.username,
            userId: req.session.user.userId
        });
    } else {
        res.json({ success: false, message: 'Not logged in' });
    }
});
