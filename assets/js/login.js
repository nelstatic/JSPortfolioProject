const submitButton = document.querySelector("form input[type='submit']");

submitButton.addEventListener("click", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const userData = {
    email: email,
    password: password,
  };
  /////
  console.log(userData);

  const login = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(userData),
  });

  if (login.status == 200) {
    const loginRes = await login.json();
    localStorage.setItem("user", JSON.stringify(loginRes));

    window.location.href = "index.html";
  } else {
    const errorMsg = document.getElementById("error-msg");
    errorMsg.textContent = "Nom d'utilisateur ou mot de passe incorrect";
  }
});
