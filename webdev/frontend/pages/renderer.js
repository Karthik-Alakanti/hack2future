// Selecting elements
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const zoomInButton = document.getElementById('zoomInButton');
const zoomOutButton = document.getElementById('zoomOutButton');

let scale = 1.0; // Initial scale
let image = new Image();

// Function to draw image on canvas
function drawImage() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const width = image.width * scale;
    const height = image.height * scale;
    context.drawImage(image, 0, 0, width, height);
}

// Load image from file input
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            image.src = event.target.result;
            image.onload = drawImage;
        };
        reader.readAsDataURL(file);
    }
});

// Zoom In and Zoom Out functionality
zoomInButton.addEventListener('click', () => {
    scale += 0.1;
    drawImage();
});

zoomOutButton.addEventListener('click', () => {
    if (scale > 0.2) { // Prevent excessive zoom out
        scale -= 0.1;
        drawImage();
    }
});

// Trigger file input when upload button is clicked
uploadButton.addEventListener('click', () => {
    fileInput.click();
});
