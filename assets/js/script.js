function loadXMLFile(file, callback) {
  var reader = new FileReader();
  reader.onload = function (e) {
    var xml = new DOMParser().parseFromString(e.target.result, "text/xml");
    callback(xml);
  };
  reader.readAsText(file);
}

function parseXML(xml) {
  var messages = xml.getElementsByTagName("Message");
  var result = "";

  if (messages.length === 0) {
    showError("Estrutura do XML inválida. Não foram encontradas mensagens.");
    hideLoader();
    return;
  }

  for (var i = 0; i < messages.length; i++) {
    var message = messages[i];
    var date = message.getAttribute("Date");
    var time = message.getAttribute("Time");
    var from = message
      .getElementsByTagName("From")[0]
      .getElementsByTagName("User")[0]
      .getAttribute("FriendlyName");
    var to = message
      .getElementsByTagName("To")[0]
      .getElementsByTagName("User")[0]
      .getAttribute("FriendlyName");
    var text = message.getElementsByTagName("Text")[0].textContent;
    var textStyle = message
      .getElementsByTagName("Text")[0]
      .getAttribute("Style");

    var replaceLinks = function (text) {
      var urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.replace(urlRegex, function (url) {
        return '<a href="' + url + '" target="_blank">' + url + "</a>";
      });
    };

    var formattedText = replaceLinks(text);

    result += `
    <div class='msn-message'>
      <div class="msg-from">
        <span>${from} diz:</span>
        <span class="msg-date">${date} - ${time}</span>
      </div>
      <div class="msg-text" style="${textStyle}">${formattedText}</div>
      
    </div>
    `;
  }

  clearMessages();
  document.getElementById("output").innerHTML = result;
  hideLoader();
}

function showError(message) {
  var errorElement = document.getElementById("error");
  errorElement.textContent = message;
  errorElement.style.display = "block";
}

function clearError() {
  var errorElement = document.getElementById("error");
  errorElement.style.display = "none";
}

function showLoader() {
  var loaderElement = document.getElementById("loader");
  loaderElement.style.display = "block";
}

function hideLoader() {
  var loaderElement = document.getElementById("loader");
  loaderElement.style.display = "none";
}

function clearMessages() {
  var outputElement = document.getElementById("output");
  outputElement.innerHTML = "";
}

var dropArea = document.getElementById("dropArea");
var fileInput;

dropArea.addEventListener("dragover", function (e) {
  e.preventDefault();
  dropArea.classList.add("dragging");
});

dropArea.addEventListener("dragleave", function (e) {
  e.preventDefault();
  dropArea.classList.remove("dragging");
});

dropArea.addEventListener("drop", function (e) {
  e.preventDefault();
  dropArea.classList.remove("dragging");
  clearError();
  var file = e.dataTransfer.files[0];
  if (file.type !== "text/xml") {
    showError("Formato de arquivo inválido. Apenas arquivos XML são aceitos.");
    return;
  }
  showLoader();
  loadXMLFile(file, parseXML);
});

dropArea.addEventListener("click", function (e) {
  e.preventDefault();
  fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "text/xml";
  fileInput.style.display = "none";
  fileInput.addEventListener("change", handleFileInputChange);
  document.body.appendChild(fileInput);
  fileInput.click();
});

function handleFileInputChange(e) {
  var file = e.target.files[0];
  if (file.type !== "text/xml") {
    showError("Formato de arquivo inválido. Apenas arquivos XML são aceitos.");
    return;
  }
  showLoader();
  loadXMLFile(file, parseXML);
}

document.addEventListener("dragenter", function (e) {
  e.preventDefault();
  dropArea.classList.add("dragging");
});

document.addEventListener("dragover", function (e) {
  e.preventDefault();
});

document.addEventListener("dragleave", function (e) {
  e.preventDefault();
  dropArea.classList.remove("dragging");
});

document.addEventListener("drop", function (e) {
  e.preventDefault();
  dropArea.classList.remove("dragging");
});

/* */
const msnWindow = document.querySelector(".msn-messenger-window"),
  drawAttentionBtn = document.querySelector(".btn-draw-attention"),
  drawAttentionSound = new Audio("assets/sounds/drawAttention.mp3");

drawAttentionBtn.addEventListener("click", (e) => {
  drawAttentionSound.addEventListener("canplay", function () {
    setTimeout(() => msnWindow.classList.add("drawAttention"), 300);

    drawAttentionSound.play();
  });

  drawAttentionSound.addEventListener("ended", function () {
    msnWindow.classList.remove("drawAttention");
  });

  drawAttentionSound.load();
});
