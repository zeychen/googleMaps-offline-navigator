const { ObjectID } = require('mongodb');

const SavedPins = require('../models/saved-pins');

/**
 * Function to GET saved pins from the SavedPins model
 * @api GET /search/savedpins Request SavedPins information
 * @apiSuccess 200 {SavedPins} returns a collection of SavedPins.
 * @apiError 400 returns {error}
 *
 * @api {GET} /savedpins
 * @apiSuccess 200 {SavedPins} The collection of saved pins.
 * @apiError 500 {server error} Problem finding all saved pins.
 */
exports.getSavedPins = (appReq, appRes) => {
  SavedPins.find().then((savedPins) => {
    appRes.send({ savedPins });
  }, (e) => {
    appRes.status(500).send(e);
  });
};

/**
 * Function to GET single saved pin from database
 * @api GET /search/savedpins/:id Request single pin
 * @apiSuccess 200 {Pin} returns a single pin.
 * @apiError 400 returns {error}
 * @apiError 404 returns
 * @param {any} appReq
 * @param {any} appRes
 */
exports.getSavedPinsById = (appReq, appRes) => {
  const params = { id: appReq.params.id };
  if (!ObjectID.isValid(params.id)) {
    return appRes.status(404).send();
  }
  SavedPins.findById(params.id).then((pin) => {
    if (!pin) {
      return appRes.status(404).send();
    }
    return appRes.send({ pin });
  }).catch((e) => {
    appRes.status(400).send(e);
  });
};

/**
 * Function to POST saved pins from the SavedPins model
 * @api POST /search/savedpins saves {SavedPins}
 * @apiSuccess 200 {Pin} returns the mongodb {SavedPins} after saved.
 * @apiError 400 returns {error}
 *
 * @api {POST} /savedpins
 * @apiSuccess 200 {SavedPins} The document representing the saved pin.
 * @apiError 500 {server error} Problem saving the requested pin.
 *
 * @param {number} appReq.body.lat - lattitude coordinate for pin location
 * @param {number} appReq.body.lng - longitude coordinate for pin location
 * @param {string} appReq.body.place_id - name of pin location
 */
exports.postSavedPins = (appReq, appRes) => {
  const savedPin = new SavedPins({
    lat: appReq.body.lat,
    lng: appReq.body.lng,
    place_id: appReq.body.place_id,
  });

  savedPin.save().then((pin) => {
    appRes.send({ pin });
  }, (e) => {
    appRes.status(500).send(e);
  });
};

/**
 * Function to DELETE all database
 * @api DELETE /search/savedpins Delete all pins
 * @apiSuccess 200
 * @apiError 400 returns {error}
 * @param {any} appReq
 * @param {any} appRes
 */
exports.deleteSavedPins = (appReq, appRes) => {
  SavedPins.remove({}).then(() => {
    appRes.status(200).send();
  }).catch((e) => {
    appRes.status(400).send(e);
  });
};

/**
 * Function to DELETE single saved pin from database
 * @api DELETE /search/savedpins/:id Delete single pin
 * @apiSuccess 200 {Pin} returns deleted pin.
 * @apiError 400 returns {error}
 * @apiError 404 returns
 * @param {any} appReq
 * @param {any} appRes
 */
exports.deleteSavedPinsById = (appReq, appRes) => {
  const params = { id: appReq.params.id };

  if (!ObjectID.isValid(params.id)) {
    return appRes.status(404).send();
  }

  SavedPins.findByIdAndRemove(params.id).then((pin) => {
    if (!pin) {
      return appRes.status(404).send();
    }

    appRes.send({ pin });
  }).catch((e) => {
    appRes.status(400).send(e);
  });
};
