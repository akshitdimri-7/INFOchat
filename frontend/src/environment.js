let IS_PROD = false;

const server = IS_PROD
  ? ""
  : "http://localhost:5000";

export default server;
