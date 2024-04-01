// more documentation available at
// https://github.com/tensorflow/tfjs-models/tree/master/speech-commands

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/aW3UMGUNz/";

async function createModel() {
    const checkpointURL = URL + "model.json"; // model topology
    const metadataURL = URL + "metadata.json"; // model metadata

    const recognizer = speechCommands.create(
        "BROWSER_FFT", // fourier transform type, not useful to change
        undefined, // speech commands vocabulary feature, not useful for your models
        checkpointURL,
        metadataURL);

    // check that model and metadata are loaded via HTTPS requests.
    await recognizer.ensureModelLoaded();

    return recognizer;
}

var alarm = 0;
var baby = 0;
var noise = 0;
var dog = 0;

async function init() {
    const recognizer = await createModel();
    const classLabels = recognizer.wordLabels(); // get class labels
    const labelContainer = document.getElementById("label-container");

    for (let i = 0; i < classLabels.length; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }

    const alertMessage = document.createElement('div');
    alertMessage.style.color = 'white';
    alertMessage.style.fontSize = '36px';
    alertMessage.style.fontWeight = 'bold';
    alertMessage.style.alignContent = 'center';
    alertMessage.style.textAlign = 'center';
    alertMessage.style.marginTop = '100px';
    alertMessage.style.backgroundColor = 'red';
    alertMessage.style.borderRadius = '10px';
    labelContainer.appendChild(alertMessage);

    // listen() takes two arguments:
    // 1. A callback function that is invoked anytime a word is recognized.
    // 2. A configuration object with adjustable fields
    recognizer.listen(result => {
        const scores = result.scores; // probability of prediction for each class
        const labelImage = document.getElementById('label-image');
        // render the probability scores per class

        alertMessage.innerHTML = '';

        for (let i = 0; i < classLabels.length; i++) {
            if (result.scores[i].toFixed(2) >= 0.85) {
                if (i === 0) /*Alarm*/ {
                    labelImage.innerHTML = "";
                    document.body.style.backgroundImage = "url('img/alarm.jpg')";
                    document.body.style.backgroundSize = 'cover';
                    document.body.style.backgroundPosition = 'center';

                    // Aviso na tela
                    alertMessage.innerHTML = 'Alarme detectado!'; 
                }
                if (i === 1) /*Baby*/ {
                    labelImage.innerHTML = "";
                    document.body.style.backgroundImage = "url('img/baby.jpg')";
                    document.body.style.backgroundSize = 'cover';
                    document.body.style.backgroundPosition = 'center';
                }
                if (i === 2) /*Background Noise*/ {
                    labelImage.innerHTML = "";
                    document.body.style.backgroundImage = "url('img/noise.jpeg')";
                    document.body.style.backgroundSize = 'cover';
                    document.body.style.backgroundPosition = 'center';
                }
                if (i === 3) /*Dog*/ {
                    labelImage.innerHTML = "";
                    document.body.style.backgroundImage = "url('img/dog.avif')";
                    document.body.style.backgroundSize = 'cover';
                    document.body.style.backgroundPosition = 'center';
                }
            } else {
                labelContainer.childNodes[i].innerHTML = null;
            }

            const classPrediction = classLabels[i] + ": " + result.scores[i].toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;
            labelContainer.childNodes[i].style.color = '#FFF';
        }
    }, {
        includeSpectrogram: true, // in case listen should return result.spectrogram
        probabilityThreshold: 0.75,
        invokeCallbackOnNoiseAndUnknown: true,
        overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
    });
}