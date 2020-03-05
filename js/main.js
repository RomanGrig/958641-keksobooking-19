'use strict';

var map = document.querySelector('.map');
var adForm = document.querySelector('.ad-form');
var mainPin = map.querySelector('.map__pin--main');
var mapPins = document.querySelector('.map__pins');
var filtersList = map.querySelectorAll('.map__filters .map__filter');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var addressElement = adForm.elements.address;
var adFieldsetList = adForm.querySelectorAll('.ad-form fieldset');

var cardElement = null;

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var typeOfHouse = {
  'flat': 'Квартира',
  'bungalo': 'Бунгало',
  'house': 'Дом',
  'palace': 'Дворец'
};

mainPin.addEventListener('mousedown', function (event) {
  if (event.button !== 0) {
    return;
  }

  activatePage();
});


mainPin.addEventListener('keydown', function (event) {
  if (event.code !== 'Enter' && event.code !== 'NumpadEnter') {
    return;
  }

  activatePage();
});

function activatePage() {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');

  adFieldsetList.forEach(function (fieldset) {
    fieldset.disabled = false;
  });

  filtersList.forEach(function (filter) {
    filter.disabled = false;
  });

  renderPins();
}

function getPosts(callback) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';

  xhr.open('GET', 'https://js.dump.academy/keksobooking/data');

  xhr.onload = function () {
    callback(xhr.response);
  };

  xhr.send();
}

function renderPins() {
  getPosts(function (posts) {
    // console.log(`posts:`, posts);

    var fragment = document.createDocumentFragment();

    for (var i = 0; i < posts.length; i++) {
      var pin = pinTemplate.cloneNode(true);
      var post = posts[i];

      var left = (post.location.x - (PIN_WIDTH / 2)) + 'px';
      var top = (post.location.y - PIN_HEIGHT) + 'px';

      pin.style.left = left;
      pin.style.top = top;
      pin.querySelector('img').src = post.author.avatar;
      pin.querySelector('img').alt = post.offer.title;

      pin.addEventListener('click', getPinClickHandler(post));

      fragment.appendChild(pin);
    }

    mapPins.appendChild(fragment);
  });
}

function getPinClickHandler(post) {
  return function (_event) {
    renderCard(post);
  };
}

function renderCard(post) {
  var notCard = !cardElement;

  if (notCard) {
    cardElement = cardTemplate.cloneNode(true);
  }

  cardElement.querySelector('.popup__avatar').src = post.author.avatar;

  cardElement.querySelector('.popup__title').textContent = post.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = post.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = post.offer.price + ' ₽/ночь';

  cardElement.querySelector('.popup__type').textContent = typeOfHouse[post.offer.type];

  cardElement.querySelector('.popup__text--capacity').textContent = post.offer.rooms + ' комнаты для ' + post.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + post.offer.checkin + ', выезд до ' + post.offer.checkout;

  var features = document.createElement('ul');
  features.className = 'popup__features';
  post.offer.features.forEach(function (feature) {
    var featureElement = document.createElement('li');
    featureElement.className = 'popup__feature popup__feature--' + feature;

    features.appendChild(featureElement);
  });
  cardElement.querySelector('.popup__features').replaceWith(features);

  cardElement.querySelector('.popup__description').textContent = post.offer.description;

  var photos = document.createElement('div');
  photos.className = 'popup__photos';
  post.offer.photos.forEach(function (photo) {
    var photoElement = document.createElement('img');
    photoElement.src = photo;
    photoElement.alt = 'Фотография жилья';
    photoElement.width = '45';
    photoElement.height = '40';
    photoElement.className = 'popup__photo';

    photos.appendChild(photoElement);
  });
  cardElement.querySelector('.popup__photos').replaceWith(photos);

  if (notCard) {
    mapPins.after(cardElement);
  }
}

adFieldsetList.forEach(function (fieldset) {
  fieldset.disabled = true;
});

filtersList.forEach(function (filter) {
  filter.disabled = true;
});

addressElement.value = '600, 350';
addressElement.disabled = true;
