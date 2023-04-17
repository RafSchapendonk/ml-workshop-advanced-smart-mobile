// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "./my_model/";

let model, webcam, labelContainer, maxPredictions;


// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    let constraints = { video: { width: 9999 } };
    let stream = await navigator.mediaDevices.getUserMedia(constraints);
    let { width, height } = stream.getTracks()[0].getSettings();
    console.log(`${width}x${height}`);

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(width, height, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);

    // hide init button
    document.getElementById("init-button").style.display = "none";
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    // for (let i = 0; i < maxPredictions; i++) {
    //     const classPrediction =
    //         prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    //     labelContainer.childNodes[i].innerHTML = classPrediction;
    // }
    let isMonument = document.getElementById('Diagoras-monument');
    let isNotMonument = document.getElementById('not-Diagoras-monument');

    isMonument.innerHTML = prediction[0].probability.toFixed(2) * 100 + "%";
    isMonument.style.width = prediction[0].probability.toFixed(2) * 100 + "%";
    isNotMonument.innerHTML = prediction[1].probability.toFixed(2) * 100 + "%";
    isNotMonument.style.width = prediction[1].probability.toFixed(2) * 100 + "%";
}