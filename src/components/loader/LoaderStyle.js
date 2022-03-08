/**
 * Returns the object of StyleSheet.
 * Includes all loader style format that uses on the Loader screen.
 */

/**
 * import packages required for styling.
 */
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
