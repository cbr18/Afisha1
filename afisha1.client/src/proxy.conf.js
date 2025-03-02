const target = "http://localhost:5069";

const PROXY_CONFIG = [
  {
    context: [
      "/api/places",
      "/api/meetings",
      "/api/places/add",
      "/api/meetings/add",
      "/api/places/delete",
      "/api/meetings/delete",
      "/api/places/update",
      "/api/meetings/update",
    ],
    target,
    secure: false,
  },
];

module.exports = PROXY_CONFIG;
