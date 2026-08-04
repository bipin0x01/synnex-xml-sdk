module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  // These are live integration tests against the Synnex API, which can take
  // 10s+ to respond. Give requests enough headroom to avoid false timeouts.
  testTimeout: 30000,
};
