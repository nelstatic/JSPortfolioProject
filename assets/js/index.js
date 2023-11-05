async function getCategories() {
  const categories = await fetch("http://localhost:5678/api/categories");
  const categoriesJSON = await categories.json();
  console.log(categoriesJSON);

  categoriesJSON.unshift({ id: 0, name: "Tous" }); //rajout de Tous à categories
  return categoriesJSON;
}

async function getWorks() {
  const works = await fetch("http://localhost:5678/api/works");
  const worksJSON = await works.json();
  console.log(worksJSON);
  return worksJSON;
}

async function displayCategories() {
  const categories = await getCategories();
  const filtresElement = document.getElementById("filtres");

  for (const category of categories) {
    const buttonElement = document.createElement("button");
    buttonElement.classList.add("filtre-item");
    buttonElement.textContent = category.name;
    buttonElement.setAttribute("id", category.id);
    buttonElement.addEventListener("click", filterWorks);
    filtresElement.appendChild(buttonElement);
  }
}

async function displayWorks() {
  const works = await getWorks();
  const gallery = document.getElementById("gallery");

  for (const work of works) {
    const figElement = document.createElement("figure");
    const imgElement = document.createElement("img");
    imgElement.setAttribute("src", work.imageUrl);

    const figcaptionElement = document.createElement("figcaption");
    figcaptionElement.textContent = work.title;

    figElement.classList.add("work"); // ajoute la classe work pour avant filtrage
    figElement.setAttribute("data-category-id", work.categoryId); // stock l'id de catégorie
    figElement.appendChild(imgElement);
    figElement.appendChild(figcaptionElement);
    gallery.appendChild(figElement);
  }
}

function filterWorks(event) {
  const categoryId = parseInt(event.target.getAttribute("id"));
  const gallery = document.getElementById("gallery");
  const works = gallery.querySelectorAll(".work");

  for (const work of works) {
    const workCategoryId = parseInt(work.dataset.categoryId);
    console.log(works);
    if (categoryId === 0 || workCategoryId === categoryId) {
      work.style.display = "block";
    } else {
      work.style.display = "none";
    }
  }
}

function isConnected() {
  const key = localStorage.getItem("user");
  if (key) {
    return true;
  } else {
    return false;
  }
}

function handleAdminElements() {
  const adminElements = document.querySelectorAll(".admin-element");
  adminElements.forEach((element) => {
    element.classList.remove("hidden");
  });
}

/////////

(async function main() {
  await displayCategories();
  await displayWorks();
  if (isConnected()) {
    handleAdminElements();
  }
})(); //pour que la fonction s'auto appelle
