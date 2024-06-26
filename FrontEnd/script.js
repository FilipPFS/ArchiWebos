console.log("Connected.");

const portfolio = document.getElementById("portfolio");
const response = await axios.get("http://localhost:5678/api/works");
const figures = response.data;

// Image galleries

function getFigures(figures) {
    const gallery = document.querySelector(".gallery");

    figures.forEach((figure) => {
        const figureElement = document.createElement("figure");

        figureElement.innerHTML =
            `<img src=${figure.imageUrl}>
        <figcaption class="fig-caption">${figure.title}</figcaption>`;

        gallery.appendChild(figureElement);
    })
}

function getImgGallery(figures) {
    const menuGallery = document.querySelector(".menuGallery");

    figures.forEach((figure) => {
        const figureElement = document.createElement("figure");
        const deleteButton = document.createElement("button");
        const icon = document.createElement("i");
        icon.classList.add("fas", "fa-trash-alt");

        deleteButton.addEventListener('click', async function () {
            try {
                const figureId = figureElement.getAttribute('data-id');

                const response = await axios.delete(`http://localhost:5678/api/works/${figureId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log('Deleted:', response.data);

            } catch (error) {
                console.error('Error deleting:', error);
            }
        });

        figureElement.innerHTML =
            `<img src=${figure.imageUrl}>`

        deleteButton.appendChild(icon);
        figureElement.setAttribute('data-id', figure.id);
        figureElement.appendChild(deleteButton);
        menuGallery.appendChild(figureElement);
    })
}

getFigures(figures);
getImgGallery(figures);

// Token

const token = localStorage.getItem('token');
const specialButton = document.querySelector('.gallery-edit-btn');

console.log("Token", token)
if (token) {
    const linkLogin = document.getElementById("link-login");
    specialButton.style.display = 'block';
    linkLogin.innerText = "logout";
    linkLogin.removeAttribute("href");
    linkLogin.style.cursor = "pointer";
    linkLogin.addEventListener("click", () => {
        localStorage.removeItem('token');
        location.reload();
    })
}

const overlay = document.querySelector(".overlay");
const firstModal = document.getElementById("firstModal");
const firstModalBtn = document.getElementById("firstModal-btn");
const secondModal = document.getElementById("secondModal");
const prevModal = document.querySelector(".prev-modal");
const imageInput = document.getElementById("imageUpload");
const imagePreview = document.getElementById('selectedImagePreview');
const closeModals = document.querySelectorAll(".close-modal");
const imageContent = document.querySelector(".image-content");
const uploadTitle = document.getElementById("upload-title")
const numberSelect = document.getElementById("numberSelect");

overlay.addEventListener("click", () => {
    closeModal();
})

specialButton.addEventListener("click", () => {
    overlay.style.display = "block";
    firstModal.style.display = "flex";
});

function resetUpload() {
    imagePreview.src = "";
    imagePreview.style.display = "none";
    imageInput.value = "";
    uploadTitle.value = "";
    numberSelect.value = "1";
    checkInputs();
}

function closeModal() {
    imageContent.style.display = "flex";
    overlay.style.display = "none";
    firstModal.style.display = "none";
    secondModal.style.display = "none";
    resetUpload();
}

closeModals.forEach(closeModalBtn => {
    closeModalBtn.addEventListener("click", closeModal);
});

firstModalBtn.addEventListener("click", () => {
    overlay.style.display = "block";
    firstModal.style.display = "none";
    secondModal.style.display = "flex";
});

prevModal.addEventListener("click", () => {
    overlay.style.display = "block";
    imageContent.style.display = "flex";
    firstModal.style.display = "flex";
    secondModal.style.display = "none";
    resetUpload();
});

document.getElementById('imageUpload').addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (file) {
        if (file.size <= 4 * 1024 * 1024) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const imageUrl = event.target.result;
                imagePreview.src = imageUrl;
                imagePreview.style.display = 'block';
                document.querySelector('.image-content').style.display = 'none';
            };
            reader.readAsDataURL(file);
        } else {
            alert("La taille de l'image doit être 4mo maximum.");
            event.target.value = '';
        }
    }
});


// Post image

const errorMsg = document.createElement("p");
errorMsg.classList.add("error-msg");
secondModal.appendChild(errorMsg);
const secondModalBtn = document.getElementById("secondModal-btn");

function checkInputs() {
    const titleInput = uploadTitle.value;
    const categorySelect = document.getElementById("numberSelect").value;
    const myImageInput = imageInput.value;

    if (titleInput && categorySelect && myImageInput) {
        secondModalBtn.disabled = false;
    } else {
        secondModalBtn.disabled = true;
    }
}

document.getElementById("upload-title").addEventListener("input", checkInputs);
document.getElementById("numberSelect").addEventListener("change", checkInputs);
document.getElementById("imageUpload").addEventListener("change", checkInputs);

secondModalBtn.addEventListener("click", async (event) => {
    console.log("clicked");
    event.preventDefault();

    try {
        const titleInput = document.getElementById("upload-title").value;
        const categorySelect = document.getElementById("numberSelect").value;
        const imageInput = document.getElementById("imageUpload").files[0];

        if (!titleInput || !categorySelect || !imageInput) {
            errorMsg.innerText = "Veuillez remplir tous les champs.";
            setTimeout(() => {
                errorMsg.innerText = "";
            }, 2000)
            return;
        }

        const formData = new FormData();
        formData.append("title", titleInput);
        formData.append("category", categorySelect);
        formData.append("image", imageInput);

        const response = await axios.post("http://localhost:5678/api/works", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            }
        });

    } catch (error) {
        if (error.response && error.response.status === 500) {
            errorMsg.innerText = "Veuillez remplir tous les champs.";
            setTimeout(() => {
                errorMsg.innerText = "";
            }, 2000)
        }
    }
});

checkInputs();

// Filters

const filters = document.querySelector(".filters");

if (token) {
    filters.style.display = "none";
}

const filterItemOne = document.createElement("button");
const filterItemTwo = document.createElement("button");
const filterItemThree = document.createElement("button");
const filterItemFour = document.createElement("button");

filterItemOne.innerText = "Tous";
filterItemTwo.innerText = "Objets";
filterItemThree.innerText = "Appartements";
filterItemFour.innerText = "Hotels & Restaurants";

filters.appendChild(filterItemOne);
filters.appendChild(filterItemTwo);
filters.appendChild(filterItemThree);
filters.appendChild(filterItemFour);

let prevClickedButton = null;
filterItemOne.style.backgroundColor = "#1D6154";
filterItemOne.style.color = "white";

filters.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
        const filterName = event.target.innerText;
        const gallery = document.querySelector(".gallery");
        filterItemOne.style.backgroundColor = "";
        filterItemOne.style.color = "";

        if (prevClickedButton) {
            prevClickedButton.style.backgroundColor = "";
            prevClickedButton.style.color = "";
        }

        event.target.style.backgroundColor = "#1D6154";
        event.target.style.color = "white";
        prevClickedButton = event.target;

        switch (filterName) {
            case "Tous":
                gallery.innerHTML = "";
                getFigures(figures);
                break;
            case "Objets":
                const objets = figures.filter(figure => figure.category.name === "Objets");
                gallery.innerHTML = "";
                getFigures(objets);
                break;
            case "Appartements":
                const appartments = figures.filter(figure => figure.category.name === "Appartements");
                gallery.innerHTML = "";
                getFigures(appartments);
                break;
            case "Hotels & Restaurants":
                const hotels = figures.filter(figure => figure.category.name === "Hotels & restaurants");
                gallery.innerHTML = "";
                getFigures(hotels);
                break;
            default:
                break;
        }
    }
});

