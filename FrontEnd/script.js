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

getFigures(figures);


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

filters.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {

        const filterName = event.target.innerText;
        const gallery = document.querySelector(".gallery");

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


