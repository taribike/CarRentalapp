/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: import explicitly to use the types shiped with jest.
import {it} from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

// Mock react-native modules that cause issues in Jest
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

it('renders correctly', () => {
  const tree = renderer.create(<App />);
  expect(tree).toBeTruthy();
});
