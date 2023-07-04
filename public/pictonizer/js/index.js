const promptInput = document.getElementById('promptInput');
const promptSubmit = document.getElementById('promptSubmit');
const promptClear = document.getElementById('promptClear');

const outputText = document.getElementById('outputText');
const outputImage = document.getElementById('outputImage');

const getImageFromBase64 = (base64) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + base64;
    return img;
}

const addDevImageToOutput = () => {
    /*
    for testing purposes
    */
    hideLoader();
    outputImage.innerHTML = "<img src='./assets/img/test-image.png'>";
    console.log("dev mode image added")
}

const addImagesToOutput = (images) => {
    hideLoader();
    if (images.length == 0) return;
    // For some reason for more than one image the first image is always
    // a copy of the second so we skip it
    else if (images.length == 1) {
        addImageToOutput(images[0], 0, true);
        return;
    }
    for (let i = 1; i < images.length; i++) {
        addImageToOutput(images[i], i);
    }
}

const addImageToOutput = (image, index, only=false) => {
    const thisOutputCanvas = document.createElement('canvas');
    thisOutputCanvas.classList.add('outputCanvas');
    if (only) thisOutputCanvas.classList.add('onlyOutputCanvas');
    thisOutputCanvas.setAttribute('id', 'outputCanvas' + index);
    thisOutputCanvas.setAttribute('width', '512');
    thisOutputCanvas.setAttribute('height', '512');
    const thisOutputCanvasContext = thisOutputCanvas.getContext('2d');
    outputImage.appendChild(thisOutputCanvas);
    const thisImage = getImageFromBase64(image);
    thisImage.onload = () => thisOutputCanvasContext.drawImage(thisImage, 0, 0);
}

const addNoImageToOutput = () => {
    hideLoader();
    const thisOutputCanvas = document.createElement('canvas');
    const thisOutputCanvasContext = thisOutputCanvas.getContext('2d');
    outputImage.appendChild(thisOutputCanvas);
    thisOutputCanvasContext.fillStyle = "red";
    thisOutputCanvasContext.fillRect(0, 0, 512, 512);
}

const showLoader = () => {
    promptSubmit.disabled = true;
    promptSubmit.value = "Loading...";
    promptClear.disabled = true;
    outputImage.innerHTML = "<div class='loaderBlock'><div class='loader'></div></div>"
}

const hideLoader = () => {
    promptSubmit.disabled = false;
    promptSubmit.value = "Submit";  
    promptClear.disabled = false;
    outputImage.innerHTML = "";
}

promptSubmit.addEventListener('click', () => {
    const inputValue = promptInput.value || "";
    if (inputValue == "") {
        promptInput.classList.add("invalidInput");
        promptInput.placeholder = "Please enter a prompt";
        promptInput.setAttribute("invalid", true)
        return;
    }
    if (isDev) {
        console.log("dev mode image requested")
        showLoader();
        setTimeout(addDevImageToOutput, 1000 + Math.floor(Math.random() * 2000));
        return;
    }
    // this later will be done in GPT4
    txt2imgBody.prompt = "a pictogram of " + inputValue + ", (vectorized, drawing, simplified, rounded face, digital art, icon)";
    txt2imgBody.negative_prompt = "(words, letters, text, numbers, symbols), (details, open traces, sharp corners, distorted proportion), (lip, nose, tooth, rouge, wrinkles, detailed face, deformed body, extra limbs)"
    showLoader();
    fetch(txt2imgUrl, {
        method: 'POST',
        body: JSON.stringify(txt2imgBody),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        }).then(res => res.json())
        .then(data => {
            console.log(data);
            outputText.innerText = inputValue;
            addImagesToOutput(data.images);
        }).catch(err => {
            console.log(err);
            outputText.innerText = "No image returned\n" + JSON.stringify(err, null, 2);
            outputText.style.color = "red";
            addNoImageToOutput();
        })
})

promptClear.addEventListener('click', () => {
    promptInput.value = "";
    txt2imgBody.prompt = "";
    outputImage.innerHTML = "";
})

promptInput.addEventListener('input', e => {
    if (promptInput.getAttribute("invalid")) {
        promptInput.classList.remove("invalidInput");
        promptInput.placeholder = "Enter a prompt";
        promptInput.setAttribute("invalid", false)
    }
})

promptInput.addEventListener('keypress', e => {
    if (e.key == "Enter") {
        e.preventDefault();
        promptSubmit.click();
    }
})