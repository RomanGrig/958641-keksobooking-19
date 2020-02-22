'use strict';
var XX_AVATARS = ['01', '02', '03', '04', '05', '06', '07', '08'];
var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECK_TIMES = ['12:00', '13:00', '14:00'];
var FEATURES_LIST = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS_LIST = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var offerTitle = 'Крутая штука';
var offerAddress = '350, 200';
var offerPrice = 1000;
var offerRooms = 1;
var offerGuests = 1;
var offerDescription = ' ';


var letShuffle = function (array) {
  for (var i = 0; i < array.length; i++) {
    var randomIndex = Math.floor(Math.random() * array.length);

    var randomElement = array[randomIndex];
    array[randomIndex] = array[i];
    array[i] = randomElement;
  }
  return array;
};

letShuffle(CHECK_TIMES);
letShuffle(OFFER_TYPES);

var noticePins = [];
for (var j = 0; j < 8; j++) {
  var getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var pinX = getRandomInt(100, 500);
  var pinY = getRandomInt(130, 630);

  noticePins[j] = {
    'author': {
      'avatar': 'img/avatars/user' + XX_AVATARS[j] + '.png'
    },
    'offer': {
      'title': offerTitle,
      'address': offerAddress,
      'price': offerPrice,
      'type': OFFER_TYPES[j],
      'rooms': offerRooms,
      'guests': offerGuests,
      'checkin': CHECK_TIMES[j],
      'checkout': CHECK_TIMES[j],
      'features': FEATURES_LIST,
      'description': offerDescription,
      'photos': PHOTOS_LIST
    },
    'location': {
      'x': pinX + 'px',
      'y': pinY + 'px'
    }
  };
}

document.querySelector('.map').classList.remove('map--faded');
var mapPins = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var renderPin = function (pin) {
  var mapPin = pinTemplate.cloneNode(true);
  var pinAtrr = document.querySelector('.map__pin');

  pinAtrr.querySelector('img').setAttribute('src', pin.author.avatar);
  pinAtrr.querySelector('img').setAttribute('alt', pin.offer.title);
  pinAtrr.style.left = pin.location.x;
  pinAtrr.style.top = pin.location.y;

  return mapPin;
};

var fragment = document.createDocumentFragment();
for (var x = 0; x < noticePins.length; x++) {
  fragment.appendChild(renderPin(noticePins[x]));
}
mapPins.appendChild(fragment);
