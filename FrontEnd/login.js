
async function sendLogin(email, password){
    const reponse = await fetch ("http://localhost:5678/api/users/login", {
        method : "POST", 
        body : JSON.stringify({email, password}),                                //transforme en chaine de caractere
        headers: {
            "Content-Type": "application/json"
        }           
    }); 

    if (reponse.status == 200){
        const body = await reponse.json()
        localStorage.setItem("user", JSON.stringify(body))
        window.location.href = "./index.html"     //redirigier
    } else {
        const errorForm = document.getElementById("password-err");
        errorForm.hidden = false
    }
}







///////////////////////////////////
const formLogin = document.getElementById('login-form');                           //Creation d'une variable button et retourne l'element button
console.log(formLogin)    
formLogin.addEventListener("submit",(event)=> {                                //ajouter, ecouter l'évenement 'click' et exectuer la fonction fléché passé en parametre
    event.preventDefault();                                                 //desactive par defaut
    const emailElement = document.getElementById("email");
    const passwordElement = document.getElementById("password");
    const email = emailElement.value.trim();
    const password = passwordElement.value.trim();
    sendLogin(email, password)
})                                                    

    
    
    
    
    
    
    
    
    
    
    
    
    
    
