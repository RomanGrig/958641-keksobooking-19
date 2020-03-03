'use strict';

var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

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

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getOne = function (array) {
  var index = getRandomInt(0, array.length - 1);
  return array[index];
};

var getPosts = function () {
  var posts = [];
  for (var i = 0; i < 8; i++) {
    var locationPin = {
      'x': getRandomInt(0, 1200),
      'y': getRandomInt(130, 630)
    };
    posts[i] = {
      'author': {
        'avatar': 'img/avatars/user0' + [i + 1] + '.png'
      },
      'offer': {
        'title': 'Крутая штука',
        'address': location.x + ', ' + location.y,
        'price': getRandomInt(0, 20000),
        'type': getOne(OFFER_TYPES),
        'rooms': getRandomInt(1, 100),
        'guests': getRandomInt(1, 5),
        'checkin': getOne(CHECK_TIMES),
        'checkout': getOne(CHECK_TIMES),
        'features': getFeatures(),
        'description': 'Просто описание',
        'photos': getPhotos()
      },
      'location': locationPin
    };
  }

  return posts;
};

var renderPins = function (posts) {
  var fragment = document.createDocumentFragment();
  for (var j = 0; j < posts.length; j++) {
    var post = posts[j];
    var pin = pinTemplate.cloneNode(true);

    pin.querySelector('img').setAttribute('src', post.author.avatar);
    pin.querySelector('img').setAttribute('alt', post.offer.title);
    pin.style.left = (post.location.x - PIN_WIDTH / 2) + 'px';
    pin.style.top = (post.location.y - PIN_HEIGHT) + 'px';

    fragment.appendChild(pin);
  }
  mapPins.appendChild(fragment);
};

var noticePins = getPosts();
renderPins(noticePins);

var renderCards = function (posts) {
  var fragment = document.createDocumentFragment();
  var post = posts[1];
  var card = cardTemplate.cloneNode(true);
  card.querySelector('.popup__title').textContent = post.offer.title;
  card.querySelector('.popup__text--price').textContent = post.offer.price + ' ₽/ночь';

  var noticeType = post.offer.type;
  if (noticeType === 'palace') {
    card.querySelector('.popup__type').textContent = 'Дворец';
  } else if (noticeType === 'bungalo') {
    card.querySelector('.popup__type').textContent = 'Бунгало';
  } else if (noticeType === 'house') {
    card.querySelector('.popup__type').textContent = 'Дом';
  }

  card.querySelector('.popup__text--capacity').textContent = post.offer.rooms + ' комнаты для ' + post.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + post.offer.checkin + ', выезд до ' + post.offer.checkout;

  var whatFeatures = function () {
    var features = card.querySelectorAll('.popup__feature');
    var featuresChecked = post.offer.features;
    for (var i = 0; i < features.length; i++) {
      features[i].classList.add('popup__feature--' + featuresChecked[i]);
      if (i > featuresChecked.length - 1) {
        card.querySelector('.popup__features').removeChild(features[i]);
      }
    }
  };
  whatFeatures();

  card.querySelector('.popup__description').textContent = post.offer.description;
  var setPhoto = function () {
    var photosList = post.offer.photos;
    for (var i = 0; i < photosList.length; i++) {
      card.querySelector('.popup__photo').setAttribute('src', photosList[i]);
      var photo = card.querySelector('.popup__photo').cloneNode(true);
      card.querySelector('.popup__photos').appendChild(photo);
    }
    card.querySelector('.popup__photos').removeChild(photo);
  };
  setPhoto();

  card.querySelector('.popup__avatar').setAttribute('src', post.author.avatar);
  fragment.appendChild(card);

  map.appendChild(fragment);
};

var noticeCards = getPosts();
renderCards(noticeCards);

map.classList.remove('map--faded');
