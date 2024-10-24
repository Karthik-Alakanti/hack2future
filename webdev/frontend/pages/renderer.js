// renderer.js
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let scale = 1; // Initialize the zoom scale
let img = new Image(); // Image object to hold the uploaded image

// Handle file upload
document.getElementById('uploadButton').addEventListener('click', function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*'; // Accept only image files

    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            img.src = event.target.result; // Set the image source to the uploaded file
            img.onload = function() {
                drawImage(); // Draw the image when it's loaded
            };
        }

        if (file) {
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    }

    input.click(); // Simulate click to open the file picker
});

// Function to draw the image on the canvas with scaling
function drawImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous content
    ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale); // Draw the image scaled
}

// Zoom In function
document.getElementById('zoomInButton').addEventListener('click', function() {
    scale += 0.1; // Increase scale for zoom in
    drawImage(); // Redraw the image with the new scale
});

// Zoom Out function
document.getElementById('zoomOutButton').addEventListener('click', function() {
    scale = Math.max(0.1, scale - 0.1); // Decrease scale for zoom out, ensure it doesn't go below 0.1
    drawImage(); // Redraw the image with the new scale
});
