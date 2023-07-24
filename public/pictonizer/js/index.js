const promptInput = document.getElementById('promptInput');
const promptSubmit = document.getElementById('promptSubmit');
const promptClear = document.getElementById('promptClear');

const editNav = document.getElementById('editNav');

const outputText = document.getElementById('outputText');
const outputImage = document.getElementById('outputImage');

const promptUpload = document.getElementById('promptUpload');
const editDownload = document.getElementById('editDownload');
const uploaderInput = document.getElementById('uploaderInput');

const getImageFromBase64 = (base64) => {
    const img = new Image();
    if (!base64.startsWith('data:image/png;base64,')) base64 = 'data:image/png;base64,' + base64;
    img.src = base64;
    return img;
}

const addDevImageToOutput = () => {
    /*
    for testing purposes
    */
    hideLoader();
    const thisOutputCanvas = document.createElement('canvas');
    thisOutputCanvas.classList.add('outputCanvas');
    thisOutputCanvas.classList.add('onlyOutputCanvas');
    thisOutputCanvas.setAttribute('width', '512');
    thisOutputCanvas.setAttribute('height', '512');
    const thisOutputCanvasContext = thisOutputCanvas.getContext('2d', { willReadFrequently: true });
    outputImage.appendChild(thisOutputCanvas);
    const thisImage = new Image();
    thisImage.src = './assets/img/test-image.jpg';
    thisImage.onload = () => thisOutputCanvasContext.drawImage(thisImage, 0, 0);
    console.log("dev mode image added")
    addCanvasListeners();
}

const addImagesToOutput = (images) => {
    hideLoader();
    if (images.length == 0) return;
    // For some reason for more than one image the first image is always
    // a copy of the second so we skip it
    else if (images.length == 1) {
        addImageToOutput(images[0], 0, true);
    }
    else {
        for (let i = 1; i < images.length; i++) {
            addImageToOutput(images[i], i);
        }
    }
    addCanvasListeners();
}

const addImageToOutput = (image, index, only=false) => {
    const thisOutputCanvas = document.createElement('canvas');
    thisOutputCanvas.classList.add('outputCanvas');
    if (only) thisOutputCanvas.classList.add('onlyOutputCanvas');
    //thisOutputCanvas.setAttribute('id', 'outputCanvas' + index);
    thisOutputCanvas.setAttribute('width', '512');
    thisOutputCanvas.setAttribute('height', '512');
    const thisOutputCanvasContext = thisOutputCanvas.getContext('2d', { willReadFrequently: true });
    outputImage.appendChild(thisOutputCanvas);
    const thisImage = getImageFromBase64(image);
    thisImage.onload = () => thisOutputCanvasContext.drawImage(thisImage, 0, 0, 512, 512);
}

const addNoImageToOutput = () => {
    hideLoader();
    const thisOutputCanvas = document.createElement('canvas');
    const thisOutputCanvasContext = thisOutputCanvas.getContext('2d', { willReadFrequently: true });
    outputImage.appendChild(thisOutputCanvas);
    thisOutputCanvasContext.fillStyle = "red";
    thisOutputCanvasContext.fillRect(0, 0, 512, 512);
}

const showLoader = () => {
    promptSubmit.disabled = true;
    promptSubmit.value = "Loading...";
    promptUpload.disabled = true;
    promptClear.disabled = true;
    outputImage.innerHTML = "<div class='loaderBlock'><div class='loader'></div></div>"
}

const hideLoader = () => {
    promptSubmit.disabled = false;
    promptSubmit.value = "Submit";
    promptUpload.disabled = false;  
    promptClear.disabled = false;
    outputImage.innerHTML = "";
}

const showEditNav = () => {
    editNav.style.display = "flex";
}

const hideEditNav = () => {
    editNav.style.display = "none"
}

promptSubmit.addEventListener('click', () => {
    const inputValue = promptInput.value || "";
    if (inputValue == "") {
        promptInput.classList.add("invalidInput");
        promptInput.placeholder = "Please enter a prompt";
        promptInput.setAttribute("invalid", true)
        return;
    }
    hideEditNav();
    showLoader();
    if (isDev) {
        console.log("dev mode image requested")
        showLoader();
        setTimeout(addDevImageToOutput, 1000 + Math.floor(Math.random() * 2000));
        return;
    }
    // this later will be done in GPT4
    txt2imgBody.prompt = "a pictogram of " + inputValue + ", (vectorized, drawing, simplified, rounded face, digital art, icon)";
    txt2imgBody.negative_prompt = "(words, letters, text, numbers, symbols), (details, open traces, sharp corners, distorted proportion), (lip, nose, tooth, rouge, wrinkles, detailed face, deformed body, extra limbs)"
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

const addCanvasListeners = () => {
    const outputCanvasList = document.getElementsByClassName('outputCanvas');
    for (let i = 0; i < outputCanvasList.length; i++) {
        outputCanvasList[i].addEventListener('click', () => {
            if (outputCanvasList[i].getAttribute('id') == 'editCanvas') return;
            outputCanvasList[i].setAttribute('id', 'editCanvas');
            for (let j = 0; j < outputCanvasList.length; j++) if (j !== i) outputCanvasList[j].setAttribute('id', '');
            showEditNav();
            updateEditCanvas();
        })
    }
}

promptClear.addEventListener('click', () => {
    hideEditNav();
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

promptUpload.addEventListener('click', () => {
    uploaderInput.click();
})

uploaderInput.addEventListener('change', () => {
    hideEditNav();
    showLoader();
    console.log("change")
    const file = uploaderInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            hideLoader();
            addImagesToOutput([reader.result])
            uploaderInput.value = "";
        }
    }
})

hideLoader();
hideEditNav();
