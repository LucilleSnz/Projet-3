
/************ Recupération des données dans l'API **************/
async function getLogin() {                                             //créé une fonction qui est asynchrone (permet de faire des promesses a l'interieur)
    const reponse = await fetch("http://localhost:5678/api/users/login");  //fetch permet d'appeler le serveur avec une requête de type -Get
    return reponse.json();                                                 //transforme le .json en JS
}