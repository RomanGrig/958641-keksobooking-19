'use strict';
// f
var map = document.querySelector('.map');
var main = document.querySelector('main');
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
var errorMessage = document.querySelector('#error').content.querySelector('.error');
var successMessage = document.querySelector('#success').content.querySelector('.success');

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
  var startX = event.clientX;
  var startY = event.clientY;
  var minTop = 130 - MAIN_PIN_HEIGHT;
  var maxTop = 630 - MAIN_PIN_HEIGHT;
  var minLeft = 0;
  var maxLeft = map.offsetWidth - MAIN_PIN_WIDTH;
  var onMouseMove = function (moveEvent) {
    var shiftX = startX - moveEvent.clientX;
    var shiftY = startY - moveEvent.clientY;
    startX = moveEvent.clientX;
    startY = moveEvent.clientY;
    var left = mainPin.offsetLeft - shiftX;
    var top = mainPin.offsetTop - shiftY;
    if (left < minLeft) {
      left = minLeft;
    }
    if (left > maxLeft) {
      left = maxLeft;
    }
    if (top < minTop) {
      top = minTop;
    }
    if (top > maxTop) {
      top = maxTop;
    }
    mainPin.style.left = left + 'px';
    mainPin.style.top = top + 'px';
    var leftMainPinGap = left + MAIN_PIN_WIDTH / 2;
    var topMainPinGap = top + MAIN_PIN_HEIGHT;
    addressElement.value = leftMainPinGap + ', ' + topMainPinGap;
  };
  var onMouseUp = function () {
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

  var formData = new FormData(adForm);
  formData.append(addressElement.name, addressElement.value);

  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';

  xhr.open(adForm.method, 'https://js.dump.academy/keksobooking/');

  xhr.addEventListener('load', function () {
    if (xhr.status >= 400 && xhr.status < 500) {
      renderError();
    } else {
      renderSuccess();
    }
  });

  xhr.send(formData);
});

function renderError() {
  var errorElement = errorMessage.cloneNode(true);

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      errorElement.remove();
    }
  });

  errorElement.addEventListener('click', function () {
    errorElement.remove();
  });

  main.appendChild(errorElement);
}

function renderSuccess() {
  var successElement = successMessage.cloneNode(true);

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      successElement.remove();
    }
  });

  successElement.addEventListener('click', function () {
    successElement.remove();
  });

  main.appendChild(successElement);
}

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
  };
}
function renderCard(post) {
  var notCard = !cardElement;
  if (notCard) {
    cardElement = cardTemplate.cloneNode(true);
    var closeButton = cardElement.querySelector('.popup__close');
    closeButton.addEventListener('click', function () {
      cardElement.classList.add('hidden');
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        cardElement.classList.add('hidden');
      }
    });
  }
  cardElement.classList.remove('hidden');
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
