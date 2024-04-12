console.log("Connected.");

const portfolio = document.getElementById("portfolio");

const response = await axios.get("http://localhost:5678/api/works");
const figures = response.data;

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

        figureElement.innerHTML =
            `<img src=${figure.imageUrl}>`

        menuGallery.appendChild(figureElement);
    })
}

getFigures(figures);
getImgGallery(figures);


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

filters.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
        const filterName = event.target.innerText;
        const gallery = document.querySelector(".gallery");

        // Reset the background color of the previously clicked button
        if (prevClickedButton) {
            prevClickedButton.style.backgroundColor = ""; // Reset to default color
            prevClickedButton.style.color = "";
        }

        // Set the background color of the currently clicked button
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
    const modal = document.querySelector(".modal");

    overlay.style.display = "block";
    modal.style.display = "flex";
})

const clodeModal = document.querySelector(".close-modal");

clodeModal.addEventListener("click", () => {
    const overlay = document.querySelector(".overlay");
    const modal = document.querySelector(".modal");

    overlay.style.display = "none";
    modal.style.display = "none";
})