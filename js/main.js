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
var typeElement = adForm.elements.type;
var timeIn = adForm.elements.timein;
var timeOut = adForm.elements.timeout;
var roomsElement = adForm.elements.rooms;
var priceElement = adForm.elements.price;
var capacityElement = adForm.elements.capacity;
var timeElementsForm = adForm.querySelector('.ad-form__element--time');

var cardElement = null;

var MAIN_PIN_WIDTH = 66;
var MAIN_PIN_HEIGHT = 80;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var minPriceByType = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};

var typeOfHouse = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец'
};

var roomsValuesByGuests = {
  1: ['1', '2', '3'],
  2: ['2', '3'],
  3: ['3'],
  0: ['100']
};

mainPin.addEventListener('mousedown', function (event) {
  if (event.button !== 0) {
    return;
  }

  activatePage();
  event.preventDefault();
  var startCoords = {
    x: event.clientX,
    y: event.clientY
  };
  var onMouseMove = function (moveEvent) {
    moveEvent.preventDefault();

    var shift = {
      x: startCoords.x - moveEvent.clientX,
      y: startCoords.y - moveEvent.clientY
    };

    startCoords = {
      x: moveEvent.clientX,
      y: moveEvent.clientY
    };

    mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
    mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';

    var topMainPinGap = (mainPin.offsetTop - shift.y) + MAIN_PIN_HEIGHT;
    var leftMainPinGap = (mainPin.offsetLeft - shift.x) + MAIN_PIN_WIDTH / 2;
    addressElement.value = leftMainPinGap + ', ' + topMainPinGap;
    console.log(addressElement.value);
  };

  var onMouseUp = function (upEvent) {
    upEvent.preventDefault();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});


mainPin.addEventListener('keydown', function (event) {
  if (event.code !== 'Enter' && event.code !== 'NumpadEnter') {
    return;
  }

  activatePage();
});

typeElement.addEventListener('change', function () {
  priceElement.placeholder = minPriceByType[typeElement.value];
  validatePrice();
});

priceElement.addEventListener('input', function () {
  validatePrice();
});

roomsElement.addEventListener('change', function () {
  validateRoomNumber();
});

capacityElement.addEventListener('change', function () {
  validateRoomNumber();
});

timeElementsForm.addEventListener('change', function (event) {
  timeIn.value = event.target.value;
  timeOut.value = event.target.value;
});

adForm.addEventListener('submit', function (event) {
  event.preventDefault();
});

function validatePrice() {
  var price = +priceElement.value;
  var minPrice = minPriceByType[typeElement.value];

  if (price < minPrice) {
    priceElement.setCustomValidity('Минимальная цена для этого типа жилья - ' + minPrice + ' рублей');
  } else {
    priceElement.setCustomValidity('');
  }
}

function validateRoomNumber() {
  var aviableValues = roomsValuesByGuests[capacityElement.value];

  if (aviableValues.includes(roomsElement.value)) {
    roomsElement.setCustomValidity('');
  } else {
    roomsElement.setCustomValidity('Количество комнат должно быть: ' + aviableValues.join(' или '));
  }
}

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
  return function () {
    renderCard(post);
    var cardPopup = map.querySelector('.popup');
    var popupClose = cardPopup.querySelector('.popup__close');
    cardPopup.classList.add('map__pin--active');
    cardPopup.classList.remove('hidden');
    document.addEventListener('keydown', function (event) {
      if (event.code !== 'ESC') {
        cardPopup.classList.remove('map__pin--active');
        cardPopup.classList.add('hidden');
      }
    });
    popupClose.addEventListener('click', function () {
      cardPopup.classList.remove('map__pin--active');
      cardPopup.classList.add('hidden');
    });
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
// ggg
addressElement.value = '600, 350';
addressElement.disabled = true;
