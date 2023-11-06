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

  gallery.innerHTML = ""; //pour effacer le contenu de la gallery à chaque nouvel appel de la fonction

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

  // le filtre sélectionné prend la classe qui change sa couleur en vert
  const filtres = document.querySelectorAll(".filtre-item");
  filtres.forEach((filtre) => {
    filtre.classList.remove("filtre-item-active");
  });
  event.target.classList.add("filtre-item-active");
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
  const filtresElement = document.getElementById("filtres"); //disparition des filtres une fois connecté
  filtresElement.classList.add("hidden");
}

const loginButton = document.getElementById("login-button");
const logoutButton = document.getElementById("logout-button");

// déconnexion : suppression des infos de connexion du local storage
logoutButton.addEventListener("click", function () {
  localStorage.removeItem("user");
  window.location.href = "index.html";
});

(async function main() {
  await displayCategories();
  await displayWorks();
  if (isConnected()) {
    handleAdminElements();
    // gestion de l'affichage de login ou logout dans la barre de navigation
    loginButton.style.display = "none";
    logoutButton.style.display = "block";
  } else {
    loginButton.style.display = "block";
    logoutButton.style.display = "none";
  }
})(); //pour que la fonction s'auto appelle
