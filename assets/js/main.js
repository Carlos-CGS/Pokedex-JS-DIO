document.addEventListener("DOMContentLoaded", () => {
    const pokemonList = document.getElementById('pokemonList');
    const loadMoreButton = document.getElementById('loadMoreButton');
    const modal = document.getElementById("pokemon-modal");

    const maxRecords = 151;
    const limit = 76;
    let offset = 0;

    function convertPokemonToLi(pokemon) {
        return `
            <li class="pokemon ${pokemon.type}" data-id="${pokemon.number}">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>

                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>

                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
            </li>
        `;
    }

    function showPokemonModal(pokemon) {
        // Seleciona elementos no modal
        const modal = document.getElementById("pokemon-modal");
        const nameElement = document.getElementById("pokemon-name");
        const photoElement = document.getElementById("pokemon-photo");
        const typeElement = document.getElementById("pokemon-type");
        const weightElement = document.getElementById("pokemon-weight");
        const heightElement = document.getElementById("pokemon-height");
    
        // Converte altura e peso para metros e quilogramas
        const heightInMeters = (pokemon.height * 0.3048).toFixed(2);
        const weightInKg = (pokemon.weight * 0.453592).toFixed(2);
    
        // Atualiza o conteúdo do modal com os detalhes do Pokémon
        nameElement.textContent = pokemon.name;
        photoElement.src = pokemon.photo;
        typeElement.textContent = `Tipo: ${pokemon.type}`;
        weightElement.textContent = `Peso: ${weightInKg} Kg`;
        heightElement.textContent = `Altura: ${heightInMeters} metros`;
    
        // Exibe o modal adicionando a classe .show
        modal.classList.add("show");
    }
    
    // Fechar o modal ao clicar no botão de fechar
    document.querySelector(".close-button").addEventListener("click", () => {
        modal.classList.remove("show");
    });
    

    function addPokemonClickEvent() {
        const pokemonElements = pokemonList.querySelectorAll('li.pokemon');

        pokemonElements.forEach((element) => {
            element.addEventListener("click", () => {
                const pokemonId = element.getAttribute("data-id");

                pokeApi.getPokemonDetail({ url: `https://pokeapi.co/api/v2/pokemon/${pokemonId}` })
                    .then((pokemonDetail) => {
                        showPokemonModal(pokemonDetail);
                    });
            });
        });
    }

    function loadPokemonItens(offset, limit) {
        pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
            const newHtml = pokemons.map(convertPokemonToLi).join('');
            pokemonList.innerHTML += newHtml;

            addPokemonClickEvent();
        });
    }

    loadPokemonItens(offset, limit);

    loadMoreButton.addEventListener('click', () => {
        offset += limit;
        const qtdRecordsWithNextPage = offset + limit;

        if (qtdRecordsWithNextPage >= maxRecords) {
            const newLimit = maxRecords - offset;
            loadPokemonItens(offset, newLimit);

            loadMoreButton.parentElement.removeChild(loadMoreButton);
        } else {
            loadPokemonItens(offset, limit);
        }
    });
});
