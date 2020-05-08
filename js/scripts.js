var pokemonRepository = (function () {
  var repository = [];
  var apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

  function add(pokemon) {
    repository.push(pokemon);
  }

  function getAll() {
    return repository;
  }

  function addListItem(pokemon) {
    var $pokemonList = $(".pokemon-list");
    var $button = $(
      '<button type="button" class="btn btn-primary btn-md list-button" data-toggle="modal" data-target="#exampleModal">' +
        pokemon.name +
        "</button>"
    );
    var $listItem = $("<li>");
    $listItem.append($button);
    $pokemonList.append($listItem);
    $button.on("click", function (event) {
      showDetails(pokemon);
    });
  }

  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function () {
      console.log(item);
      showModal(item);
    });
  }

  function loadList() {
    return $.ajax(apiUrl)
      .then(function (json) {
        json.results.forEach(function (item) {
          var pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
          console.log(pokemon);
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  function loadDetails(item) {
    var url = item.detailsUrl;
    return $.ajax(url)
      .then(function (details) {
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.types = [];
        for (var i = 0; i < details.types.length; i++) {
          item.types.push(details.types[i].type.name);
        }

        item.abilities = [];
        for (var i = 0; i < details.abilities.length; i++) {
          item.abilities.push(details.abilities[i].ability.name);
        }

        item.weight = details.weight;
        return item;
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  function showModal(item) {
    var modalBody = $(".modal-body");
    var modalTitle = $(".modal-title");
    modalBody.empty();
    modalTitle.empty();
    var nameElement = $("<h1>" + item.name + "</h1>");
    var imageElement = $('<img class="modal-img">');
    imageElement.attr("src", item.imageUrl);
    var heightElement = $("<p>" + "Height: " + item.height + "m" + "</p>");
    var weightElement = $("<p>" + "Weight: " + item.weight + "kg" + "</p>");
    var typesElement = $("<p>" + "Types: " + item.types + "</p>");
    var abilitiesElement = $("<p>" + "Abilities: " + item.abilities + "</p>");

    modalBody.append(nameElement);
    modalBody.append(imageElement);
    modalBody.append(heightElement);
    modalBody.append(weightElement);
    modalBody.append(typesElement);
    modalBody.append(abilitiesElement);
  }

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
    showModal: showModal,
  };
})();

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});

$(document).ready(function () {
  $("#input").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $(".pokemon-list *").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
});
