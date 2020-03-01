'use strict';

var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var pinTemplate =
  document.querySelector('#pin').content.querySelector('.map__pin');

var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECK_TIMES = ['12:00', '13:00', '14:00'];
var FEATURES_LIST = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS_LIST = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

function getFeatures() {
  return FEATURES_LIST.filter(function () {
    return Math.random() > 0.5;
  });
}

function getPhotos() {
  return PHOTOS_LIST.filter(function () {
    return Math.random() > 0.5;
  });
}

function getRandomElementFromArray(array) {
  var index = getRandomNumber(0, array.length - 1);

  return array[index];
}

function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}

function getPosts() {
  var posts = [];

  for (var i = 0; i < 8; i++) {
    var location = {
      x: getRandomNumber(0, 1200),
      y: getRandomNumber(130, 630)
    };

    posts[i] = {
      'author': {
        'avatar': 'img/avatars/user0' + (i + 1) + '.png'
      },
      'offer': {
        'title': 'Крутая штука',
        'address': location.x + ', ' + location.y,
        'price': getRandomNumber(0, 20000),
        'type': getRandomElementFromArray(OFFER_TYPES),
        'rooms': getRandomNumber(1, 100),
        'guests': getRandomNumber(1, 5),
        'checkin': getRandomElementFromArray(CHECK_TIMES),
        'checkout': getRandomElementFromArray(CHECK_TIMES),
        'features': getFeatures(),
        'description': 'Просто описание',
        'photos': getPhotos()
      },
      location: location
    };
  }

  return posts;
}

function renderPins() {
  var posts = getPosts();

  var fragment = document.createDocumentFragment();
  for (var i = 0; i < posts.length; i++) {
    var post = posts[i];
    var pin = pinTemplate.cloneNode(true);

    pin.querySelector('img').setAttribute('src', post.author.avatar);
    pin.querySelector('img').setAttribute('alt', post.offer.title);
    pin.style.left = (post.location.x - PIN_WIDTH / 2) + 'px';
    pin.style.top = post.location.y - PIN_HEIGHT + 'px';

    fragment.appendChild(pin);
  }
  mapPins.appendChild(fragment);
}

map.classList.remove('map--faded');

renderPins();
