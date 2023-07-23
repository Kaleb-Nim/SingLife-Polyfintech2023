// Generate Number from min to max inclusively
module.exports.generateNumber = function generateNumber(max = 1, min = 0) {
  return Math.floor(Math.random() * Math.abs(max - min) + Math.min(min, max));
};
