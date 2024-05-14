const socket = io();


// Listen for new tributes
socket.on('new-tribute', (tribute, user) => {
    // Get the div element where new tributes will be appended
    const tributeListDiv = document.getElementById('tributes-list');

    // Create a new div element to hold the new tribute
    const tributeDiv = document.createElement('div');
    tributeDiv.classList.add('d-flex'); // Add 'd-flex' class for proper styling
    tributeDiv.id = `tribute-${tribute._id}`; // Set the id of the div


    // Create the inner HTML for the tribute div based on the provided HTML structure
    tributeDiv.innerHTML = `
        <div>
            <a href="#">
                <div class="position-relative">
                    ${user && user.profile && user.profile.image ? 
                        `<img class="avatar rounded-circle shadow" src="${user.profile.image}" alt="${user.full_name}">` :
                        `<img class="avatar rounded-circle shadow" src="default-image-url.jpg" alt="Default User">`}
                </div>
            </a>
        </div>
        <div class="ms-3">
            <h6>${user.full_name}</h6>
            <p>${tribute.tribute_text}</p>
            <div class="ms-auto text-end">
                ${tribute.category === "candle" ? 
                    '<img class="px-2" src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/48/000000/external-candles-pharmaceutical-flaticons-lineal-color-flat-icons-2.png"/>' :
                    tribute.category === "flower" ? 
                    '<img class="px-2" src="https://img.icons8.com/color/48/000000/bunch-flowers.png"/>' :
                    '<img class="px-2" src="https://img.icons8.com/color/48/000000/scroll.png"/>'}
            </div>
        </div>
    `;

    // Insert the new tribute div at the top of the list
    tributeListDiv.prepend(tributeDiv);

    // Update the count of tributes
    const countHeader = document.querySelector('.text-center.mb-4.mt-5');
    if (countHeader) {
        // Increment the count and update the header text
        const currentCount = parseInt(countHeader.textContent);
        const newCount = currentCount + 1;

        // Update the header text based on the new count
        if (newCount > 1) {
            countHeader.textContent = `${newCount} Tributes`;
        } else {
            countHeader.textContent = '1 Tribute';
        }
    }
});


// Listen for deleted tributes
socket.on('delete-tribute', tributeId => {
    const li = document.getElementById(`tribute-${tributeId}`);
    if (li) {
        li.remove();
    }
});


// Attach event listener for delete buttons
document.addEventListener('click', event => {
    if (event.target.classList.contains('delete-tribute')) {
        const tributeId = event.target.getAttribute('data-id');

        fetch(`/tributes/${tributeId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                // Emit the deleted tribute to all connected clients
                socket.emit('delete-tribute', tributeId);
            }
        });
    }
});



socket.on('new-gallery', (gallery) => {
    const galleryContainer = document.getElementById('animated-thumbnails-gallery');
    const galleryItemDiv = document.createElement('div');
    galleryItemDiv.innerHTML = `
        <div class="col-md-3 mb-3 mt-3 gallery-item" data-lg-size="1600-1067" data-src="${gallery.image}" data-sub-html="<h4> Uploaded by ${gallery.by.full_name} </h4> <p> ${gallery.description} </p>">
            <div class="position-relative" style="height: 200px;"> <!-- Set a fixed height for the container -->
                <img alt="${gallery.by.full_name}" class="w-100 h-100 border-radius-lg bg-cover img-responsive" src="${gallery.image}"/>
                <div class="d-flex justify-content-between">
                    <button type="button" class="btn badge bg-gradient-info text-white px-2 btn-link position-absolute top-0 start-0 m-1" id="view-gallery-button" data-gallery-id="${gallery._id}">
                        <i class="fa-solid fa-eye fa-lg"></i>
                    </button>
                    <% if (isAuthenticated) { %>
                        <% if (user.is_admin || gallery.by._id.toString() === user._id.toString()) { %>
                            <button type="button" class="btn badge bg-gradient-danger text-white px-2 btn-link position-absolute top-0 end-0 m-1" id="delete-gallery-button" data-gallery-id="${gallery._id}">
                                <i class="fa-solid fa-trash-can fa-lg"></i>
                            </button>
                        <% } %>
                    <% } %>
                </div>
            </div>
        </div>
    `;
    galleryContainer.prepend(galleryItemDiv.firstChild);
});
