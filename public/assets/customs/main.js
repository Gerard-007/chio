const socket = io();


// Listen for new tributes
socket.on('new-tribute', (tribute) => {
    // Get the div element where new tributes will be appended
    const tributeListDiv = document.getElementById('tributes-list');

    // Create a new div element for the tribute
    const tributeDiv = document.createElement('div');
    tributeDiv.classList.add('d-flex', 'my-3'); // Add classes for proper styling
    tributeDiv.id = `tribute-${tribute._id}`; // Set the id of the div

    // Create the inner HTML for the tribute div based on the provided HTML structure
    tributeDiv.innerHTML = `
        <div class="d-flex my-3" id="tribute-item-${tribute._id}">
            <div>
                <a href="#">
                    <div class="position-relative">
                        ${tribute.by && tribute.by.profile && tribute.by.profile.image ? 
                            `<img class="avatar rounded-circle shadow" src="${tribute.by.profile.image}" alt="${tribute.by.full_name}">` :
                            `<img class="avatar rounded-circle shadow" src="https://res.cloudinary.com/geetechlab-com/image/upload/v1583147406/nwaben.com/user_azjdde_sd2oje.jpg" alt="Default User">`}
                    </div>
                </a>
            </div>
            <div class="ms-3">
                <div class="d-flex justify-content-between">
                    <h6>${tribute.by.full_name}</h6>
                    ${tribute.category === "candle" ? 
                        '<img class="px-2" src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/48/000000/external-candles-pharmaceutical-flaticons-lineal-color-flat-icons-2.png"/>' :
                        tribute.category === "flower" ? 
                        '<img class="px-2" src="https://img.icons8.com/color/48/000000/bunch-flowers.png"/>' :
                        '<img class="px-2" src="https://img.icons8.com/color/48/000000/scroll.png"/>'}
                </div>
                <p class="text-dark font-weight-bold">${tribute.tribute_text}</p>
            </div>
        </div>
    `;

    // Insert the new tribute div at the top of the list
    tributeListDiv.prepend(tributeDiv);

    // Show the badge for tribute updates
    document.getElementById('tribute-badge').style.display = 'inline-block';

    // Update the count of tributes
    const countHeader = document.querySelector('#tribute_counter');
    if (countHeader) {
        // Increment the count and update the header text
        const currentCount = parseInt(countHeader.textContent);
        const newCount = currentCount + 1;

        // Update the header text based on the new count
        countHeader.textContent = newCount > 1 ? `${newCount} Tributes` : '1 Tribute';
    }

    const countBody = document.querySelector('#tribute_counter_text');
    if (countBody) {
        countBody.remove();
    }
});




/// Listen for deleted tributes
socket.on('delete-tribute', tributeId => {
    // Handle the deletion on the frontend
    console.log(`Tribute with ID ${tributeId} has been deleted`);

    // Find the gallery element with the matching data-gallery-id attribute and remove it from the DOM
    const tributeElement = document.querySelector(`#tribute-item-${tributeId}`);
    console.log(`tributeElement: ${tributeElement}`)
    if (tributeElement) {
        tributeElement.remove();
        console.log("Tribute deleted successfully")
        // Update the count of tributes
        const countHeader = document.querySelector('#tribute_counter');
        if (countHeader) {
            // Increment the count and update the header text
            const currentCount = parseInt(countHeader.textContent);
            const newCount = currentCount - 1;
    
            // Update the header text based on the new count
            countHeader.textContent = newCount > 1 ? `${newCount} Tributes` : '1 Tribute';
        }
    } else {
        console.log(`Tribute with ID ${tributeId} not found in the DOM`);
    }
});




// Listen for new galleries
socket.on('new-gallery', (gallery, user) => {
    console.log('Received new gallery:', gallery);

    const galleryContainer = document.getElementById('animated-thumbnails-gallery');
    const galleryItemDiv = document.createElement('div');

    galleryItemDiv.innerHTML = `
        <div class="col-md-3 mb-3 mt-3 gallery-item gallery-item-${gallery._id}" data-lg-size="1600-1067" data-src="${gallery.image}" data-sub-html="<h4> Uploaded by ${gallery.by.full_name} </h4> <p> ${gallery.description} </p>">
            <div class="position-relative" style="height: 250px;">
                <img alt="${gallery.by.full_name}" class="w-100 h-100 border-radius-lg bg-cover img-responsive" src="${gallery.image}"/>
                <div class="d-flex justify-content-between">
                    <button type="button" class="btn badge bg-gradient-info text-white px-2 btn-link position-absolute top-0 end-0 m-1" id="view-gallery-button" data-gallery-id="${gallery._id}" onclick="handleViewButtonClick()">
                        <i class="fa-solid fa-eye fa-lg"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    // Prepend the new gallery item to the gallery container
    galleryContainer.prepend(galleryItemDiv.firstElementChild);

    // Show the badge for gallery updates
    document.getElementById('gallery-badge').style.display = 'inline-block';
});




// Listen for the 'delete-gallery' event from the server
socket.on('delete-gallery', (galleryId, user) => {
    // Handle the deletion on the frontend
    console.log(`Gallery with ID ${galleryId} has been deleted`);

    // Find the gallery element with the matching data-gallery-id attribute and remove it from the DOM
    const galleryElement = document.querySelector(`.gallery-item-${galleryId}`);
    console.log(`galleryElement: ${galleryElement}`)
    if (galleryElement) {
        galleryElement.remove();
    } else {
        console.log(`Gallery with ID ${galleryId} not found in the DOM`);
        errorToast("error", `Media by ${user.full_name} deleted successfully`)
    }
});




// Add click event listeners to buttons to hide the badge when clicked
document.querySelectorAll('.memorial-nav-link').forEach(button => {
    button.addEventListener('click', () => {
        // Hide the badge when the button is clicked
        const badge = button.querySelector('.badge');
        if (badge) {
            badge.style.display = 'none';
        }
    });
});