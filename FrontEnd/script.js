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
async function main() { 
    const allProjects = await searchProjectsByCategoryName("Tous");        //recupere tout le contenu des projets
    await showProjects(allProjects);                                       //affiche l'ensemble des projets
    if (localStorage.getItem("user")){
        createButtonAddProject();
    } else {                                                                   //créé une fonction main pour pouvoir utiliser await
        const buttons = generateButtons(allProjects);                          //recupère tout les boutons
        const buttonContainer = document.getElementsByClassName("filters")[0]; //recupère les div ou on va inserer les buttons
        buttonContainer.append(... buttons);                                   //injecter les bouttons dans la div grace a "append"

    /*************Recuperation boutton***************/ 
        for (let i=0; i<buttons.length; i++){                                  //parcourir tout les boutons de 0 a la longueur de tout les boutons
            const btn = buttons[i];                                            //créé variable btn qui correspond au bouton selectionné dans la boucle
            btn.addEventListener("click",async()=> {                           //ajouter, ecouter l'évenement 'click' et exectuer la fonction fléché passé en parametre (btn)
                const filterName = btn.dataset.name;                                //recupere le nom du filtre (sans accent 'ô')
                const projects = await searchProjectsByCategoryName(filterName);    //appel la fonction qui permet de filtrer par nom
                showProjects(projects);
            })
        }
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
    button.id = "buttonModifier";
    
    
    //injecter du html en js
    button.innerHTML = `<i class='fa-regular fa-pen-to-square'></i>modifier`;
    
    button.addEventListener("click", ()=>{
        const modal = createModal();
        const container = document.createElement("div");
        container.id = "modal-container";
        modal.appendChild(container)
        modalPhoto(container)    
        modal.addEventListener("click", (event) =>{
            if (event.target == modal){
                document.body.removeChild(modal)
            }
        })
    }
    )
    const portfolio = document.getElementById("portfolio");
    portfolio.prepend(button);
}

async function modalPhoto(container){
    container.innerHTML = "";
    const modalTitle = document.createElement("h4")
    modalTitle.textContent = "Galerie photo";

    const buttonAjout = document.createElement("button")
    buttonAjout.textContent= "Ajouter une photo";
    buttonAjout.id = "ajout";

    const buttonClose = document.createElement("button")
    buttonClose.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
    buttonClose.id = "close";
    
    const gallery = createElt("div", "modalGallery")
    const projects = await getProjects()

        buttonClose.addEventListener("click", (event) =>{
            console.log(event);
            
            document.body.removeChild(modal)
            }
        )



    const userJson = localStorage.getItem("user");
    const user = JSON.parse(userJson);
    const token = user.token;
    for (let index = 0; index < projects.length; index++) {
        const project = projects[index];
        const projectContainer = createElt ("div", "projectContainer");

        const photo = createElt("img");
        photo.src = project.imageUrl; 
        photo.className = "photoModalGallery";
        projectContainer.appendChild(photo)

        const buttonDelete = createElt("button", "delete");
        buttonDelete.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
        projectContainer.appendChild(buttonDelete)
        
        gallery.appendChild(projectContainer)

        buttonDelete.addEventListener("click", async(event)=>{
            gallery.removeChild(projectContainer);
            await fetch(`http://localhost:5678/api/works/${project.id}`, {
                method: "delete",
                headers: {Authorization: `Bearer ${token}`}
            })
            const allProjects = await searchProjectsByCategoryName("Tous"); 
            await showProjects(allProjects);  

        })
    }

    container.appendChild(buttonClose)
    container.appendChild(modalTitle)
    container.appendChild(gallery)
    container.appendChild(buttonAjout)
    ajoutPhotoModal(buttonAjout, container)
}

function createElt(type, id){
    const element = document.createElement(type)
    element.id = id;
    element.name = id;
    return element;
}


async function ajoutPhotoModal(buttonAjout, container){
    buttonAjout.addEventListener("click", async(event) => {
        container.innerHTML = "";
        const projects = await getProjects();

        const header = createElt("div", "headerModal");
        container.appendChild(header);
        const buttonClose = createElt("button", "buttonClose")
        const back = createElt("button", "back");

        buttonClose.innerHTML =  `<i class="fa-solid fa-xmark"></i>`;
        back.innerHTML = `retour`;

        const bodyModal = createElt("div", "bodyModal");
        container.appendChild(bodyModal);
        const bodyTitle = createElt("h4", "bodyTile");
        bodyTitle.textContent = "Ajout photo";
        bodyModal.appendChild(bodyTitle);

        const form = createElt("form", "form");
        bodyModal.appendChild(form);

        const formFileContenair = createElt("div", "formFileContainer");
        form.appendChild(formFileContenair);
        
        const img = createElt("img", "image");
        formFileContenair.appendChild(img);
        const input = createElt("input", "fileInput");
        formFileContenair.appendChild(input);
        const fileP = createElt("p", "text");
        fileP.textContent = "jpg";
        input.type = "file";
        input.accept = "image/png, image/jpeg";
        input.required = true;
        input.addEventListener("change", (event)=>{
            const [file] = input.files;
            if (file) {
                img.src = URL.createObjectURL(file);
                }
        })

        //div 
        const titleLabel = createElt("label", "titleLabel");
        titleLabel.textContent = "Titre";
        titleLabel.for = "titleInput";
        const titleInput = createElt("input", "titleInput");
        titleInput.required = true;
        form.appendChild(titleLabel);
        form.appendChild(titleInput);

        //div
        const categoryLabel = createElt("label", "categorieLabel");
        categoryLabel.textContent = "Catégorie";
        const categoryInput = createElt("select", "categoryInput");
        categoryInput.type = "select";
        categoryInput.required = true;
        const categoryNames = projects.map((project)=>{
            return project.category.name;
        })

        form.addEventListener("submit", async (event) =>{
            event.preventDefault();
            const title = titleInput.value.trim();
            const categoryName = categoryInput.value;
            const file = input.files[0];
            const project = projects.find(project =>{
                if (project.category.name == categoryName){
                    return true;
                } else {
                    return false;
                }
            })

            const userJson = localStorage.getItem("user");
            const user = JSON.parse(userJson);
            const token = user.token;

            const category = project.category.id;
            const formData = new FormData();
            formData.append("title", title);
            formData.append("category", category);
            formData.append("image", file);
            const reponse = await fetch("http://localhost:5678/api/works/", {
                headers: {Authorization: `Bearer ${token}`},
                method: "post",
                body: formData
            })
            if (reponse.status == 201){
            const allProjects = await searchProjectsByCategoryName("Tous"); 
            await showProjects(allProjects);  
            modalPhoto(container);
            } else {
                const errorText = createElt("p", "errorForm");
                errorText.textContent = "Erreur"
                form.appendChild(errorText)
            }

        })

        form.appendChild(categoryLabel);
        form.appendChild(categoryInput);
        const uniqueCategoryNames = new Set(categoryNames);
        uniqueCategoryNames.forEach(categoryName =>{
            const option = createElt("option");
            option.value = categoryName;
            option.textContent = categoryName;
            categoryInput.appendChild(option);
        }
            )
        const submitPhoto = createElt("input", "submit");
        submitPhoto.textContent = "Valider";
        submitPhoto.type = "submit";
        form.appendChild(submitPhoto);

        header.appendChild(back);
        header.appendChild(buttonClose);    
    
        back.addEventListener("click", (event)=>{
            modalPhoto(container) 
        })
    })

}

//mettre div par label + input