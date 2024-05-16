// function toggleButtonText(loading, id) {
//     let button = document.getElementById(id);
//     let originalText = button.textContent;
//     let loadingIcon = '<i class="fa-solid fa-spinner fa-spin fa-lg"></i>';
//     console.log(`innerText: ${originalText}`)

//     if (loading) {
//         button.innerHTML = loadingIcon;
//         button.disabled = true;
//     } else {
//         button.innerHTML = originalText;
//         button.disabled = false;
//     }
// }

function toggleButtonText(loading, btnID, btnText) {
  let button = document.getElementById(btnID);
  let spinnerIcon = document.createElement("i");

  spinnerIcon.className = "fa-solid fa-spinner fa-xl fa-spin";

  if (loading) {
      // Hide button text and display spinner icon
      button.innerHTML = '';
      button.appendChild(spinnerIcon);
  } else {
      // Display button text and hide spinner icon
      button.innerHTML = btnText; // Replace "Your Button Text" with the actual text of your button
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