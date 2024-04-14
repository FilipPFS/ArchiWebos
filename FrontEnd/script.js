console.log("Connected.");

const portfolio = document.getElementById("portfolio");

const response = await axios.get("http://localhost:5678/api/works");
const figures = response.data;

// Image galleries

function getFigures(figures) {
    const gallery = document.querySelector(".gallery");

    figures.map((figure) => {
        const figureElement = document.createElement("figure");

        figureElement.innerHTML =
            `<img src=${figure.imageUrl}>
        <figcaption class="fig-caption">${figure.title}</figcaption>`;

        gallery.appendChild(figureElement);
    })
}

function getImgGallery(figures) {
    const menuGallery = document.querySelector(".menuGallery");

    figures.map((figure) => {
        const figureElement = document.createElement("figure");
        const deleteButton = document.createElement("button");
        const icon = document.createElement("i");
        icon.classList.add("fas", "fa-trash-alt");

        deleteButton.addEventListener('click', async function () {
            try {
                const figureId = figureElement.getAttribute('data-id');

                axios.delete(`http://localhost:5678/api/works/${figureId}`, {
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

    linkLogin.addEventListener("click", () => {
        localStorage.removeItem('token');
    })
}

specialButton.addEventListener("click", () => {
    const overlay = document.querySelector(".overlay");
    const modal = document.getElementById("firstModal");

    overlay.style.display = "block";
    modal.style.display = "flex";
})

const clodeModal = document.getElementById("close-mod-one");

clodeModal.addEventListener("click", () => {
    const overlay = document.querySelector(".overlay");
    const firstModal = document.getElementById("firstModal");

    overlay.style.display = "none";
    firstModal.style.display = "none";
})

const firstModalBtn = document.getElementById("firstModal-btn");

firstModalBtn.addEventListener("click", () => {
    const overlay = document.querySelector(".overlay");
    const firstModal = document.getElementById("firstModal");
    const secondModal = document.getElementById("secondModal");

    overlay.style.display = "block";
    firstModal.style.display = "none";
    secondModal.style.display = "flex";
})

const twoCloseModal = document.getElementById("close-mod-two");

twoCloseModal.addEventListener("click", () => {
    const overlay = document.querySelector(".overlay");
    const secondModal = document.getElementById("secondModal");

    overlay.style.display = "none";
    secondModal.style.display = "none";
})

const prevModal = document.querySelector(".prev-modal");

prevModal.addEventListener("click", () => {
    const firstModal = document.getElementById("firstModal");
    const secondModal = document.getElementById("secondModal");
    const imageInput = document.getElementById("imageUpload");
    const imagePrewiev = document.getElementById('selectedImagePreview');

    document.querySelector('.image-content').style.display = 'flex';
    firstModal.style.display = "flex";
    secondModal.style.display = "none";
    imagePrewiev.src = "";
    imagePrewiev.style.display = "none";
    imageInput.value = "";

})

document.getElementById('imageUpload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const imgPreview = document.getElementById('selectedImagePreview');

    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const imageUrl = event.target.result;
            imgPreview.src = imageUrl;
            imgPreview.style.display = 'block';

            document.querySelector('.image-content').style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
});


// Filters

const filters = document.querySelector(".filters");
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

// filterItemTwo.addEventListener("click", () => {
//     const objets = figures.filter(figure => figure.category.name === "Objets");
//     console.log("clicked")
//     const gallery = document.querySelector(".gallery").innerHTML = "";
//     getFigures(objets);
// })

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

