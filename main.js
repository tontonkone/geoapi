const container = document.getElementById('container');
const selectRegion = document.getElementById('region');
const row = document.querySelector('.row');
const containerTxt = document.querySelector('.container-text')

let regionCode, deptCode, commune;

/**
 * run region fecth 
 */
fetchRegion()

/**
 * to listen event when select change
 */

selectRegion.addEventListener('change', function (e) {

    let codeRg = e.target.value

    reset();
    fetchDepartement(codeRg);
})

/**
 * Fetch la region
 */
async function fetchRegion() {
    fetch(`https://geo.api.gouv.fr/regions`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(rep => rep.json())
        .then(data => {
            for (const inf of data) {
                createMarkup('option', `${inf.nom}`, selectRegion, [{ name: 'value', value: `${inf.code}` }]);
            }
        })
        .catch((error) => console.log(`Erreure attrapée : `, error));
}

/**
 * fetch departement
 * @param {*} code 
 */

async function fetchDepartement(code) {
    fetch(`https://geo.api.gouv.fr/regions/${code}/departements`)
        .then(rep => rep.json())
        .then(data => {
            const selectDept = createMarkup('select', '', container, [{ name: 'class', value: 'form-select m-3' }, { name: "id", value: 'depts' }]);
            createMarkup('option', 'selectionnez votre departement', selectDept, [{ name: 'selected' }]);

            for (const inf of data) {
                createMarkup('option', `${inf.nom}`, selectDept, [{ name: 'value', value: `${inf.code}` }]);
            }
            selectDept.addEventListener('change', function (e) {
                const elts = selectDept.options[selectDept.selectedIndex].text
                console.log(elts, e.target.value)
                const coms = document.getElementById('com');
                const card = document.getElementById('card');
                if (card) card.remove();
                if (coms) coms.remove();
                fetchCommune(e.target.value)
            })
        })
        .catch((error) => console.log(`Erreure attrapée : `, error));
}

/**
 * fetch communes 
 * @param {*} code 
 */

async function fetchCommune(code) {
    fetch(`https://geo.api.gouv.fr/departements/${code}/communes`)
        .then(rep => rep.json())
        .then(data => {
            console.log(data)
            const selectCom = createMarkup('select', '', container, [{ name: 'class', value: 'form-select m-3' }, { name: "id", value: 'com' }]);
            createMarkup('option', 'selectionnez votre commune', selectCom, [{ name: 'selected' }]);
            for (const inf of data) {

                createMarkup('option', `${inf.nom}`, selectCom, [{ name: 'value', value: `${inf.code}` }]);
            }
            selectCom.addEventListener('change', function (e) {
                const elts = selectCom.options[selectCom.selectedIndex].text
                const card = document.getElementById('card');
                if (card) card.remove();
                console.log(e.target.value)
                fetchPostal(e.target.value, elts)
            })
        })
        .catch((error) => console.log(`Erreure attrapée : `, error));
}

async function fetchPostal(cp, el) {
    fetch(`https://geo.api.gouv.fr/communes/${cp}`)
        .then(rep => rep.json())
        .then(data => {
            console.log(el)
            createMarkup('div', `
            <div class="card" id="card" style="width: 18rem;">
                <div class="card-body">
                    <h2 class="card-title">${data.nom}</h2>
                    <h3 class="card-subtitle mb-2 text-muted">Population : ${data.population}</h3>
                    <p class="card-text">Code postal : ${data.codesPostaux}</p>
                </div>
            </div>`, containerTxt)

        })
        .catch((error) => console.log(`Erreure attrapée : `, error));
}
// Création des éléments du  DOM via la fonction createMarkup

function createMarkup(markup_name, text, parent, attributes = []) {
    const markup = document.createElement(markup_name);
    markup.innerHTML = text;
    parent.appendChild(markup);
    attributes.forEach((attribute) => {
        if (attribute && attribute.hasOwnProperty("name") && attribute.hasOwnProperty("value")) {
            markup.setAttribute(attribute.name, attribute.value);
        }
    })

    return markup;
}


// function de reset board 
function reset() {

    /**
 * nettoyer l'affichage au changement
 */
    const depts = document.getElementById('depts');
    const textH2 = document.getElementById('region-h2');
    const coms = document.getElementById('com');
    const card = document.getElementById('card');

    // supprimer les elements du dom 
    if (card) card.remove();
    if (textH2) textH2.remove();
    if (depts) depts.remove();
    if (coms) coms.remove();

}