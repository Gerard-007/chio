function toggleButtonText(loading, id) {
    let button = document.getElementById(id); // Replace 'your-button-id' with the actual ID of your button
    let originalText = button.textContent;
    let loadingIcon = '<i class="fa-solid fa-spinner fa-spin fa-lg"></i>'; // Replace this with your loading icon HTML
    console.log(`innerText: ${originalText}`)

    if (loading) {
        button.innerHTML = loadingIcon;
        button.disabled = true; // Optionally disable the button while loading
    } else {
        button.innerHTML = originalText;
        button.disabled = false; // Re-enable the button
    }
}


function successToast(status, message) {
    Toastify({
        text: message,
        className: status,
        style: {
          background: "linear-gradient(to right, #02D043, #96c93d)",
        }
      }).showToast();
}


function infoToast(status, message) {
    Toastify({
        text: message,
        className: status,
        style: {
          background: "linear-gradient(to right, #015282, #0AE3E0)",
        }
      }).showToast();
}


function warningToast(status, message) {
    Toastify({
        text: message,
        className: status,
        style: {
          background: "linear-gradient(to right, #EECB07, #FFFB02)",
        }
      }).showToast();
}


function errorToast(status, message) {
    Toastify({
        text: message,
        className: status,
        style: {
          background: "linear-gradient(to right, #AB4201, #CE6605)",
        }
      }).showToast();
}