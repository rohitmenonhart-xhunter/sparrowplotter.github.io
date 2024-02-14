// Import the Firebase SDK if you haven't already
// Make sure to replace the following config with your Firebase project config
// <script src="https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js"></script>

// Initialize Firebase with your project configuration


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCKuoLKspUfEKdkexgO7HD9yb0C32lFI9I",
    authDomain: "esp-location-56ece.firebaseapp.com",
    databaseURL: "https://esp-location-56ece-default-rtdb.firebaseio.com",
    projectId: "esp-location-56ece",
    storageBucket: "esp-location-56ece.appspot.com",
    messagingSenderId: "415169225788",
    appId: "1:415169225788:web:0780c061338be738b8cf39",
    measurementId: "G-NP5SHD0WWD"
  };

firebase.initializeApp(firebaseConfig);

// Reference to the Firebase Realtime Database
const database = firebase.database();

document.getElementById('signUpForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get user input
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const phoneNumber = document.getElementById('phoneNumber').value;

    // Validate the age and phone number fields
    if (!isValidNumber(age)) {
        alert('Please enter a valid age.');
        return;
    }

    if (!isValidNumber(phoneNumber)) {
        alert('Please enter a valid phone number.');
        return;
    }

    // Create an object with user data
    const userData = {
        firstName,
        lastName,
        age: parseInt(age), // Convert age to a number
        gender,
        phoneNumber,
        birds: [] // Initialize an empty array to store bird details
    };

    // Push user data to the Firebase Realtime Database
    database.ref('users').push(userData)
        .then(() => {
            // Show the success pop-up
            showSuccessPopup();
        })
        .catch(error => {
            console.error('Error adding user to database:', error);
            alert('An error occurred. Please try again.');
        });
});

function isValidNumber(value) {
    // Check if the value contains only digits
    return /^\d+$/.test(value);
}

function showSuccessPopup() {
    // Create the pop-up container
    const popupContainer = document.createElement('div');
    popupContainer.classList.add('popup-container');

    // Create the image element
    const popupImage = document.createElement('img');
    popupImage.src = 'sparrow description.png'; // Replace with the path to your image
    popupImage.alt = 'Success Image';

    // Create the "Next" button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', closePopup);

    // Append elements to the container
    popupContainer.appendChild(popupImage);
    popupContainer.appendChild(nextButton);

    // Append the container to the body
    document.body.appendChild(popupContainer);
}

function closePopup() {
    // Remove the pop-up container from the body
    const popupContainer = document.querySelector('.popup-container');
    if (popupContainer) {
        document.body.removeChild(popupContainer);
    }
}

function showSuccessPopup() {
    // Redirect to the success page
    window.location.href = 'success.html';
}
function checkAnswer(selectedImage) {
    // Replace this with the correct image number
    const correctAnswer = 1;

    // Disable further clicks after the user selects an image
    const images = document.querySelectorAll('.image-container img');
    images.forEach(img => img.onclick = null);

    // Display result message
    const resultMessage = document.getElementById('resultMessage');
    const nextButton = document.getElementById('nextButton');

    if (selectedImage === correctAnswer) {
        resultMessage.textContent = 'Congratulations! You selected the correct image.';
        resultMessage.style.color = 'green';
        nextButton.style.display = 'inline-block';
    } else {
        resultMessage.textContent = 'Sorry, you selected the wrong image. Redirecting to the previous page...';
        resultMessage.style.color = 'red';
        nextButton.style.display = 'none';

        // Display an alert message before navigating back
        setTimeout(() => {
            alert('Read the infographics and try again.');
            window.history.back();
        }, 2000);
    }

    resultMessage.style.display = 'block';
}
function plotSparrow(userId) {
    // Validate if the user is logged in
    if (userId) {
        alert('Please log in to plot sparrows.');
        return;
    }

    // Get the current location using Geolocation API
    navigator.geolocation.getCurrentPosition(
        function (position) {
            // Prompt the user for additional information
            var numberOfSparrows = prompt("How many sparrows?");

            // Validate if numberOfSparrows is a number
            if (!isNaN(numberOfSparrows)) {
                var gender = prompt("Are they male or female? (Enter 'male' or 'female')");
                var nestPresent = prompt("Do you see a nest? (Enter 'yes' or 'no')");
                var juvenilesPresent = prompt("Do you see any juveniles? (Enter 'yes' or 'no')");

                // Store bird data directly in a separate node in Firebase Realtime Database
                const birdData = {
                    userId: userId,
                    numberOfSparrows: parseInt(numberOfSparrows),
                    gender: gender.toLowerCase(),
                    nestPresent: nestPresent.toLowerCase() === 'yes',
                    juvenilesPresent: juvenilesPresent.toLowerCase() === 'yes',
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                };

                // Push the bird data into a separate node in the database
                database.ref('birds').push(birdData)
                    .then(function () {
                        alert('Sparrow details plotted successfully!');
                    })
                    .catch(function (error) {
                        alert('Error plotting sparrow details: ' + error.message);
                    });
            } else {
                alert('Please enter a valid number for the number of sparrows.');
            }
        },
        function (error) {
            alert('Unable to retrieve your location. Please make sure your browser has location services enabled.');
            console.error('Geolocation error:', error);
        }
    );
}

window.addEventListener('load', () => {
    const hasRegistered = localStorage.getItem('hasRegistered');
    
    if (hasRegistered) {
        // User has registered, load the main part of the app
        loadMainApp();
    } else {
        // User hasn't registered, show registration form
        showRegistrationForm();
    }
});

function showRegistrationForm() {
    // Implement your registration form logic here
    // Example: You might show a modal or redirect to a registration page
    alert('Welcome! Please register.');
    
    // Assuming registration is successful, set the flag in localStorage
    localStorage.setItem('hasRegistered', 'true');

    window.location.href = 'index.html';


    // Load the main part of the app
    loadMainApp();
}

function loadMainApp() {
    // Implement the main part of your app logic here
    // Example: Load the map, plot markers, etc.
    alert('Loading main app...');
    window.location.href = 'main.html';
}


