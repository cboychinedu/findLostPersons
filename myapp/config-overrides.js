// Importing the necessary modules 
const path = require("path");

// Setting the configuration for absolute imports 
module.exports = function override(config) {
  config.resolve.alias = {
    ...config.resolve.alias,
    "@components": path.resolve(__dirname, "src/Components"),
    "@auth": path.resolve(__dirname, "src/Auth"),
    "@assets": path.resolve(__dirname, "src/Assets"),
    "@utils": path.resolve(__dirname, "src/Utils"),
    "@images": path.resolve(__dirname, "src/Images"), 
  };

  // returning the config object 
  return config;
};
