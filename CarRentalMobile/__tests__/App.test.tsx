/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: import explicitly to use the types shiped with jest.
import {it, describe, beforeEach, afterEach} from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {act} from 'react-test-renderer';

// Mock react-native modules that cause issues in Jest
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// Mock StyleSheet.flatten to prevent errors
jest.mock('react-native/Libraries/StyleSheet/StyleSheet', () => {
  const actualStyleSheet = jest.requireActual('react-native/Libraries/StyleSheet/StyleSheet');
  return {
    ...actualStyleSheet,
    flatten: jest.fn((style) => style),
  };
});

describe('App', () => {
  let component: renderer.ReactTestRenderer;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Clean up timers and component
    if (component) {
      act(() => {
        component.unmount();
      });
    }
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders correctly', () => {
    act(() => {
      component = renderer.create(<App />);
    });
    expect(component.toJSON()).toBeTruthy();
  });
});
