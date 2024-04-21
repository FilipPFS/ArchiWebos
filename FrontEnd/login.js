const form = document.querySelector(".login-form");
let token = null;
let userId = null;

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const errorMsg = document.querySelector(".error-message");

    const data = {
        email: e.target.querySelector("[name=email]").value,
        password: e.target.querySelector("[name=password]").value,
    }

    if (!data.email || !data.password) {
        errorMsg.innerText = "Mot de passe et email sont obligatoires.";
        setTimeout(() => {
            errorMsg.innerText = "";
        }, 2000)
        return;
    }

    try {
        const response = await axios.post("http://localhost:5678/api/users/login", data);

        if (response.status === 200) {
            console.log("Succesffully connected.");
            token = response.data.token;
            userId = response.data.userId

            if(token) {
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);
                window.location.href = "index.html";
            }
        }
        
    } catch (error) {
        if (error.response) {
            if (error.response.status === 401) {
                errorMsg.innerText = "Mot de passe ou email est invalide.";
                setTimeout(() => {
                    errorMsg.innerText = "";
                }, 2000)
            } else if (error.response.status === 404) {
                console.log("Server or resource not found");
                errorMsg.innerText = "L'utilisateur n'a pas été trouvé.";
                setTimeout(() => {
                    errorMsg.innerText = "";
                }, 2000)
            }
        } else {
            console.error("Error occurred:", error.message);
            errorMsg.innerText = "Une erreur est survenue. Ressayez ultérieurement.";
            setTimeout(() => {
                errorMsg.innerText = "";
            }, 2000)
        }
    }
});



