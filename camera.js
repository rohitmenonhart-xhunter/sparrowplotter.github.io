const video = document.getElementById('camera');
const captureButton = document.getElementById('captureButton');

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCKuoLKspUfEKdkexgO7HD9yb0C32lFI9I",
    authDomain: "esp-location-56ece.firebaseapp.com",
    projectId: "esp-location-56ece",
    storageBucket: "esp-location-56ece.appspot.com",
    messagingSenderId: "415169225788",
    appId: "1:415169225788:web:0780c061338be738b8cf39",
    measurementId: "G-NP5SHD0WWD"
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

async function setupCamera() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        // Find the back camera (assuming it's the last video device)
        const backCamera = videoDevices[videoDevices.length - 1];

        // Apply constraints, including zoom
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                deviceId: { exact: backCamera.deviceId },
                facingMode: 'environment', // This forces the use of the back camera
                zoom: { ideal: 5 } // Adjust the zoom level as needed
            }
        });

        video.srcObject = stream;
    } catch (error) {
        console.error('Error accessing camera:', error);
    }
}


// Setup the camera when the page loads
window.addEventListener('load', setupCamera);


    function capturePicture() {
        // Capture device location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
    
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
    
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
                // Convert the captured picture to a Blob
                canvas.toBlob((blob) => {
                    // Generate a unique filename for each picture
                    const fileName = `captured_picture_${Date.now()}.png`;
    
                    // Create a reference to the Firebase Storage location
                    const storageRef = storage.ref().child(fileName);
    
                    // Set custom metadata with location information
                    const metadata = {
                        contentType: 'image/png',
                        customMetadata: {
                            'latitude': latitude.toString(),
                            'longitude': longitude.toString()
                        }
                    };
    
                    // Upload the Blob to Firebase Storage with custom metadata
                    const uploadTask = storageRef.put(blob, metadata);
    
                    // Listen for state changes, errors, and completion of the upload.
                    uploadTask.on('state_changed',
                        (snapshot) => {
                            // Progress
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log(`Upload progress: ${progress}%`);
                            alert('please wait we are uploading your picture!');

                        },
                        (error) => {
                            // Handle unsuccessful uploads
                            console.error('Error uploading picture:', error);
                            alert('Error uploading picture. Please try again.');
                        },
                        () => {
                            // Handle successful uploads on complete
                            console.log('Picture uploaded successfully!');
                            alert('Image uploaded successfully!');
                            window.location.href = 'main.html';
                        }
                    );
                }, 'image/png');
            },
            (error) => {
                console.error('Error retrieving device location:', error);
                alert('Unable to retrieve your location. Please make sure your browser has location services enabled.');
            }
        );
    }
    

// Event listener for the capture button
captureButton.addEventListener('click', capturePicture);
