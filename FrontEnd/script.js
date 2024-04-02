function createProject(project){
    let figure = document.createElement("figure");
    let image = document.createElement("img");
    let caption = document.createElement("figcaption");
    image.src = project.imageUrl;
    image.alt = project.title;
    caption.textContent = project.title;
    figure.appendChild(image);
    figure.appendChild(caption);
    return figure;
}

async function getProjects() {
    const reponse = await fetch("http://localhost:5678/api/works");
    const works = await reponse.json();
    console.log(works);
    return works;
}  

async function main() {
    const projects = await getProjects();

    let gallery = document.getElementsByClassName("gallery")[0];

    for (const child of gallery.children){
        gallery.removeChild(child);
    }

    for (const element of projects){
        let projectElement = createProject(element);
        gallery.appendChild(projectElement)
    }
    
}    
main()
