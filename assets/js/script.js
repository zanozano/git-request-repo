//BASE URL
const baseUrl = 'https://api.github.com/users';
//REQUEST
const request = async (url) => {
	const results = await fetch(url);
	const response = await results.json();
	return response;
};
//GET USER
const getUser = async (userName) => {
	const url = `${baseUrl}/${userName}`;
	return request(url);
};
//GET USER
const getRepo = async (userName, numberPage, repoPerPage) => {
	const url = `${baseUrl}/${userName}/repos?page=${numberPage}&per_page=${repoPerPage}`;
	return request(url);
};
//CLICK EVENT
document.getElementById('boton').addEventListener('click', (event) => {
	event.preventDefault();
	getInfoUser();
});
//GET INFO USER
function getInfoUser() {
	//GET INPUTS
	let nameUser = document.getElementById('nombre').value;
	let pageNumber = document.getElementById('pagina').value;
	let repoPerPages = document.getElementById('repoPagina').value;
	//
	if (nameUser != '' && pageNumber != '' && repoPerPages != '') {
		// USER PROMISE
		const userPromise = new Promise((resolve, reject) => {
			const user = getUser(nameUser);
			if (user) {
				resolve(user);
			} else {
				reject(new Error('Not Found - El usuario no existe'));
			}
		});
		const repoPromise = new Promise((resolve, reject) => {
			const repo = getRepo(nameUser, pageNumber, repoPerPages);
			if (repo) {
				resolve(repo);
			} else {
				reject(new Error('Not Found - El repositorio no existe'));
			}
		});
		// PROMISE ALL
		Promise.all([userPromise, repoPromise])
			.then((resp) => {
				const user = resp[0];
				const repo = resp[1];
				console.log('User Information', user, repo);
				// SET INFO USER
				setInfoUser(resp);
			})
			.catch((error) => alert('Not Found - Usuario y/o Repositorio no existe', error));
	} else {
		console.log('Information required');
	}
}
function setInfoUser(resp) {
	let containerResult = document.getElementById('resultados');
	let userContainer = `<div class="col-12 col-lg-6 mb-4">
                      <h2 class="text-left font-weight-bold mb-4">Datos de Usuario</h2>
                      <img class="my-3" src="${resp[0].avatar_url}">
                      <p class="size">Nombre de usuario: <strong>${resp[0].name}</strong></p>
                      <p class="size">Nombre de login: <strong>${resp[0].login}</strong></p>
                      <p class="size">Cantidad de Repositorios: <strong>${resp[0].public_repos}</strong></p>
                      <p class="size">Localidad: <strong>${resp[0].location}</strong></p>
                      <p class="size">Tipo de usuario: <strong>${resp[0].type}</strong></p>
                      </div>`;
	let repoContainer = `<h2 class="text-right font-weight-bold mb-4">Nombre de repositorios</h2>`;
	resp[1].forEach((element) => {
		repoContainer += `<p class="text-right size"><a href="${element.html_url}">${element.name}</a></p>`;
	});
	containerResult.innerHTML = `<div class="row mb-4">${userContainer}<div class="col-12 col-lg-6 mb-4">${repoContainer}</div></div>`;
}
