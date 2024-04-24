function createProjectElement(project){                                 //créé un element HTML projet grace au donnés passé au parametre 
    const figure = document.createElement("figure");                    //creation element type figure
    const image = document.createElement("img");                        //creation element type image
    const caption = document.createElement("figcaption");               //creation element type caption

    image.src = project.imageUrl;                                       //assigne l'url donnée par l'API a l'image
    image.alt = project.title;                                          //assigne le titre donnée par l'API
    caption.textContent = project.title;                                //assigne le nom du titre
    figure.appendChild(image);                                          //donne a figure comme enfant l'image 
    figure.appendChild(caption);                                        //donne a figure comme enfant caption 
    return figure;                                                      //retourner figure
}


/************ Recupération des données dans l'API **************/
async function getProjects() {                                             //créé une fonction qui est asynchrone (permet de faire des promesses a l'interieur)
    const reponse = await fetch("http://localhost:5678/api/works");        //fetch permet d'appeler le serveur avec une requête de type -Get
    return reponse.json();                                                 //transforme le .json en JS                     
}
/************ ShowProjects **************/
async function showProjects(projects) {                                    //créé fonction asynchrone avec un parametre du projet
    const gallery = document.getElementsByClassName("gallery")[0];         //recupère element HTML à la galerie

    gallery.innerHTML= "";                                                 //modifier le contenu de la galerie par vide (car vide supprime par defaut)


    for (const element of projects){                                       //boucle sur chaque projet
        const projectElement = createProjectElement(element);              //créé un element figure qui represente un projet
        gallery.appendChild(projectElement);                               //ajoute a la galerie
        }
    }

async function searchProjectsByCategoryName(name){
    let projects = await getProjects();                                    //promesse sur la recuperation donnée 

    if (name != "Tous") {                                                  //condition applique un filtre dans le cadre ou le filtre n'est pas "TOUS"
        projects = projects.filter((project) => {                          //je ne selectionne que les projets ayant une catégorie dont le nom correspond a nameFilter 
            return project.category.name == name;                          //je ne selectionne que les projets ayant une catégorie dont le nom correspond a nameFilter 
        })
    } 
    return projects;
}

function generateButtons(projects){
    const categoryNames = projects.map((project)=>{
        return project.category.name;
    })
    const uniqueCategoryNames = ["Tous",... new Set(categoryNames)]         //destructuration passer chaques element unique
    const buttons = uniqueCategoryNames.map(categoryName => {               //on map et donne la fonction a la categorie
        const button = document.createElement("button");                    //crée l'element bouton
        button.className = "buttonFilter";                                  //ajoute la class
        button.dataset.name = categoryName;                                 //on recupère la catagorie en fonction du nom
        button.textContent = categoryName;
        return button;
    }) 
    return buttons;                                                         //retourne les boutons 
}
/************ Synchronisaion des images avec suppression des doublons **************/
async function main() {                                                    //créé une fonction main pour pouvoir utiliser await
    const allProjects = await searchProjectsByCategoryName("Tous");        //recupere tout le contenu des projets
    const buttons = generateButtons(allProjects);                          //recupère tout les boutons
    const buttonContainer = document.getElementsByClassName("filters")[0]; //recupère les div ou on va inserer les buttons
    buttonContainer.append(... buttons);                                   //injecter les bouttons dans la div grace a "append"
    await showProjects(allProjects);                                       //affiche l'ensemble des projets

/*************Recuperation boutton***************/ 
    for (let i=0; i<buttons.length; i++){                                  //parcourir tout les boutons de 0 a la longueur de tout les boutons
        const btn = buttons[i];                                            //créé variable btn qui correspond au bouton selectionné dans la boucle
        btn.addEventListener("click",async()=> {                           //ajouter, ecouter l'évenement 'click' et exectuer la fonction fléché passé en parametre (btn)
            const filterName = btn.dataset.name;                                //recupere le nom du filtre (sans accent 'ô')
            const projects = await searchProjectsByCategoryName(filterName);    //appel la fonction qui permet de filtrer par nom
            showProjects(projects);
        })
    }
    if (localStorage.getItem("user")){
        createButtonAddProject();
    }
}    
main()




/********************** modal *************************/

function createModal(){
    const oldDialog = document.getElementById("modal");
    if (oldDialog){
        oldDialog.innerHTML = "";
        return oldDialog;
    }
    const dialog = document.createElement("dialog");
    dialog.id = "modal";
    dialog.open = true;
    document.body.appendChild(dialog);
        return dialog;
}


function createButtonAddProject(){
    const button = document.createElement("button");
    button.id = "buttonAjout"
    button.textContent = "Ajouter un projet";
    button.addEventListener("click", ()=>{
        const modal = createModal();
        modal.textContent = "COUCOU"
    })
    const portfolio = document.getElementById("portfolio");
    portfolio.prepend(button);
}