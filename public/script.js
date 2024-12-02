document.getElementById("pdfUpload").addEventListener("submit", function(event) {
    event.preventDefault();
    fetch("/api/pdf/upload", {
        method: "POST",
        body: new FormData(document.getElementById("pdfUpload")),
    }).then(response => response.json())
    .then(data => {
        window.location.href = data.file;
    }).catch(error => {
        console.error("Error:", error);
    });
});
