const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const zoomInButton = document.getElementById('zoomInButton');
const zoomOutButton = document.getElementById('zoomOutButton');

let image = new Image();
let scale = 1; // Initial scale for zooming

// Handle file upload
uploadButton.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            image.src = e.target.result;
            image.onload = () => {
                // Reset scale when a new image is uploaded
                scale = 1;
                drawImage();
            };
        };
        reader.readAsDataURL(file);
    }
});

// Function to draw the image on canvas
function drawImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, image.width * scale, image.height * scale);
}

// Zoom In
zoomInButton.addEventListener('click', () => {
    scale *= 1.2; // Increase scale by 20%
    drawImage();
});

// Zoom Out
zoomOutButton.addEventListener('click', () => {
    scale /= 1.2; // Decrease scale by 20%
    drawImage();
});
