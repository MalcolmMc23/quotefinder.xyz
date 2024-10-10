document.getElementById('uploadForm').onsubmit = function (event) {
    event.preventDefault();
    var formData = new FormData(this);
    fetch('/upload-pdf', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.text())
        .then(data => {
            document.getElementById('message').textContent = data;
        })
        .catch(error => {
            document.getElementById('message').textContent = 'Failed to upload PDF: ' + error;
        });
};