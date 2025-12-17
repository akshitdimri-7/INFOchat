let IS_PROD = true;

const server = IS_PROD
  ? "https://infochat-backend.onrender.com"
  : "http://localhost:5000";

export default server;
