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

const addImagesToOutput = (images) => {
    outputImage.innerHTML = "";
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
    outputImage.innerHTML = "";
    const thisOutputCanvas = document.createElement('canvas');
    const thisOutputCanvasContext = thisOutputCanvas.getContext('2d');
    outputImage.appendChild(thisOutputCanvas);
    thisOutputCanvasContext.fillStyle = "red";
    thisOutputCanvasContext.fillRect(0, 0, 512, 512);
    thisOutputCanvasContext.innerText = "No image returned";
}

promptSubmit.addEventListener('click', () => {
    const inputValue = promptInput.value || "";
    if (inputValue == "") {
        promptInput.classList.add("invalidInput");
        promptInput.placeholder = "Please enter a prompt";
        promptInput.setAttribute("invalid", true)
        return;
    }
    // this later will be done in GPT4
    txt2imgBody.prompt = "a pictogram of " + inputValue + ", (vectorized, drawing, simplified, rounded face, digital art, icon)";
    txt2imgBody.negative_prompt = "(words, letters, text, numbers, symbols), (details, open traces, sharp corners, distorted proportion), (lip, nose, tooth, rouge, wrinkles, detailed face, deformed body, extra limbs)"
    promptSubmit.disabled = true;
    promptSubmit.value = "Loading...";
    promptClear.disabled = true;
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
            promptSubmit.disabled = false;
            promptSubmit.value = "Submit";  
            promptClear.disabled = false;
        }).catch(err => {
            console.log(err);
            outputText.innerText = JSON.stringify(err, null, 2);
            outputText.style.color = "red";
            addNoImageToOutput();
        })
})

promptClear.addEventListener('click', () => {
    promptInput.value = "";
    txt2imgBody.prompt = "";
    outputBlock.innerText = "";
})

promptInput.addEventListener('input', e => {
    if (promptInput.getAttribute("invalid")) {
        promptInput.classList.remove("invalidInput");
        promptInput.placeholder = "Enter a prompt";
        promptInput.setAttribute("invalid", false)
    }
    if (e.target.key == "Enter") {
        e.preventDefault();
        console.log("Enter pressed");
        promptSubmit.click();
    }
})
