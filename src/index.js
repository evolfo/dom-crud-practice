const giftListTag = document.querySelector(".gift-list"); //ul tag
const newGiftTag = document.querySelector("#new-gift-form");
const searchTag = document.querySelector("#filter-input");

document.addEventListener('DOMContentLoaded', () => {
  loadGifts();
})

function loadGifts() {
  fetch("http://localhost:3000/gifts")
    .then(resp => resp.json())
    .then(gifts => {
      gifts.forEach(function(gift) {
        createGiftHtml(gift);
      })
    })
}

function addNewGift(event) {
  fetch(`http://localhost:3000/gifts`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({name: event.target.parentElement.name.value, image: event.target.parentElement.image.value})
  })
}

function editGifts(event) {
  fetch(`http://localhost:3000/gifts/${event.target.id.replace(/\D/g, '')}`, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({name: event.target.name.value, image: event.target.image.value})
  })
}

const createGiftHtml = (gift) => {
  giftListTag.innerHTML += `
    <li class="all-gifts" id="${gift.id}">
      <h2>${gift.name}</h2>
      <img src="${gift.image}"><br>
      <button>Edit Gift</button>
      <button>Delete Gift</button>
    </li>
    <form id="gift-form-${gift.id}" class="ui form edit-form" action="index.html" method="POST">
      <label for="name">Gift Name: </label>
      <input id="gift-name-input-${gift.id}" type="text" name="name" value="">
      <label for="image">Gift Image: </label>
      <input id="gift-image-input-${gift.id}"  type="text" name="image" value="">
      <br>
      <button id="gift-form-button-${gift.id}" type="submit" name="button" class="ui button">Submit</button>
    </form>`
}

giftListTag.addEventListener('click', (event) => {
  if (event.target.innerText === "Delete Gift") {
    fetch(`http://localhost:3000/gifts/${event.target.parentElement.id}`, {
      method: 'DELETE'
    }).then(placeholder => {
      event.target.parentElement.remove();
    })
  } else if (event.target.innerText === "Edit Gift") {
    editFormTag = document.querySelector(`#gift-form-${event.target.parentElement.id}`)
    editFormTag.style.display = "block";
    editFormTag.addEventListener("submit", (event) => {
      editGifts(event);
    })
  }
})

newGiftTag.addEventListener('click', (event) => {
  if (event.target.tagName === "BUTTON") {
    addNewGift(event);
  }
})

searchTag.addEventListener('keyup', (event) => {
  userInput = event.target.value.toUpperCase();
  allGifts = document.querySelectorAll(".all-gifts");
  for (let i = 0; i < allGifts.length; i++) {
    let gift = allGifts[i].getElementsByTagName("h2")[0]
    let giftText = gift.textContent || gift.innerText;
    if (giftText.toUpperCase().indexOf(userInput) > -1) {
      gift.parentElement.style.display = "";
    } else {
      gift.parentElement.style.display = "none";
    }
  }
})
