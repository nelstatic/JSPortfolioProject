function handleModalActions() {
  const modalMainWrapper = document.querySelector(".modal-main-wrapper");
  const modalMain = document.querySelector(".modal-main");
  const modalAjout = document.querySelector(".modal-ajout-wrapper");
  const overlay = document.querySelectorAll(".overlay");

  const validation = document.querySelector(".form-validation");
  validation.addEventListener("click", submitFormData);

  const previewFile = document.querySelector(".preview-file");
  previewFile.addEventListener("change", function () {
    /* console.log(previewFile); */
    if (previewFile.files.length > 0) {
      const src = URL.createObjectURL(previewFile.files[0]);
      const preview = document.getElementById("preview-image");
      preview.src = src;
      preview.classList.remove("preview-img-passive");
      preview.classList.add("preview-img-active");
      const upload = document.getElementById("upload");
      upload.classList.remove("img-upload-button");
      upload.classList.add("hidden");
    }
  });

  const modifier = document.getElementById("modifier");
  modifier.addEventListener("click", function () {
    modalMainWrapper.classList.remove("hidden");
  });

  /*   overlay.addEventListener("click", function (e) {
    if (e.target === modalMain || e.target === modalAjout) {
      modalMainWrapper.classList.add("hidden");
      modalAjout.classList.add("hidden");
      modalMainWrapper.classList.add("hidden");
    }
  }); */

  const upload = document.getElementById("upload");
  const parcourir = document.getElementById("parcourir");
  upload.addEventListener("click", function () {
    parcourir.click();
  });

  const close = document.querySelectorAll(".close-button");
  close.forEach((item) => {
    item.addEventListener("click", function () {
      modalMainWrapper.classList.add("hidden");
      modalAjout.classList.add("hidden");
    });
  });

  overlay.forEach((item) => {
    item.addEventListener("click", function (event) {
      if (!event.target.closest(".modal")) {
        modalMainWrapper.classList.add("hidden");
        modalAjout.classList.add("hidden");
      }
    });
  });

  const ajout = document.querySelector(".add-photo-button");
  ajout.addEventListener("click", function () {
    modalMainWrapper.classList.add("hidden");
  });
  ajout.addEventListener("click", function () {
    modalAjout.classList.add("active");
  });
  ajout.addEventListener("click", function () {
    modalAjout.classList.remove("hidden");
  });

  const retour = document.querySelector(".back-button");
  retour.addEventListener("click", function () {
    modalAjout.classList.add("hidden");
  });
  retour.addEventListener("click", function () {
    modalMainWrapper.classList.remove("hidden");
  });
}

async function displayModalWorks() {
  const works = await getWorks();
  const modalGallery = document.getElementById("modal-gallery");

  modalGallery.innerHTML = "";
  for (const work of works) {
    const figElement = document.createElement("figure");
    const imgElement = document.createElement("img");
    const iElement = document.createElement("i");
    iElement.addEventListener("click", async function (e) {
      const projectId = e.target.dataset.id;

      const keyStorage = JSON.parse(localStorage.getItem("user"));
      console.log(keyStorage.token);
      console.log(localStorage.getItem("user"));
      const supprProject = await fetch(
        "http://localhost:5678/api/works/" + projectId,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + keyStorage.token,
          },
        }
      );
      if (supprProject.status == 204) {
        displayModalWorks();
        displayWorks();
      }
    });
    imgElement.setAttribute("src", work.imageUrl);

    figElement.classList.add("modal-img-container"); // ajoute la classe work pour avant filtrage
    imgElement.classList.add("modal-image");
    iElement.classList.add("trash", "fa-solid", "fa-trash-can");
    iElement.setAttribute("data-id", work.id); // stock l'id du projet
    figElement.appendChild(imgElement);
    modalGallery.appendChild(figElement);
    figElement.appendChild(iElement);
  }
}

/************** */

async function submitFormData(event) {
  event.preventDefault();
  const form = document.getElementById("modal-ajout-form");
  const imageValidation = document.querySelector(".preview-file").files[0];
  const titre = document.getElementById("work-titre").value;
  const categorie = document.getElementById("work-categorie").value;
  const formData = new FormData();
  const modalMainWrapper = document.querySelector(".modal-ajout-wrapper");

  formData.append("image", imageValidation);
  formData.append("title", titre);
  formData.append("category", categorie);

  const keyStorage = JSON.parse(localStorage.getItem("user"));

  const fetchOptions = {
    method: "POST",
    body: formData,
    headers: {
      Authorization: "Bearer " + keyStorage.token,
    },
  };

  fetch("http://localhost:5678/api/works", fetchOptions).then((response) => {
    if (response.status === 201) {
      modalMainWrapper.classList.add("hidden");
      displayModalWorks();
      displayWorks();
    } else {
      console.error("pas envoyé");
    }
  });
}

/********************************* */

(function main() {
  handleModalActions();
  displayModalWorks();
})();
