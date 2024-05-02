const actionLi = document.getElementById("login-button"); //notre id
const userLogged = localStorage.getItem("user"); //si on est connecté
if (userLogged){
    actionLi.innerHTML = "<a href='#'>logout</a>"
    actionLi.addEventListener("click", (event) =>{
        event.preventDefault();
        localStorage.removeItem("user");                                //tu redirige vers la page index pour eviter les erreurs
        window.location.href = "./index.html";  
    })
} else {
    actionLi.innerHTML = "<a href='./login.html'>login</a>"
}
