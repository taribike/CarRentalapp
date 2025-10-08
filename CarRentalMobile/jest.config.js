module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@react-native-async-storage|@stripe|react-native-date-picker|react-native-device-info|react-native-gesture-handler|react-native-image-picker|react-native-paypal|react-native-safe-area-context|react-native-screens|react-native-vector-icons)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Use watchman for better performance on macOS
  watchman: true,
  // Optimize watch mode
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/android/',
    '<rootDir>/ios/',
    '<rootDir>/coverage/',
    '<rootDir>/.git/',
  ],
};
