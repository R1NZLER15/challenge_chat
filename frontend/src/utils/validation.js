//Cobian: This is a personal confuguration of validation rules that I use in my projects.
/**
 * Validation rules object.
 * @namespace rules
 * @type {Object}
 */
export const rules = {
  /**
   * Checks if a value is required.
   * @memberof rules
   * @param {*} value - The value to be checked.
   * @returns {(boolean|string)} - Returns true if the value is not empty, otherwise returns the error message 'Required.'.
   */
  required: (value) => !!value || 'Required.',

  /**
   * Checks if a value is a valid email address.
   * @memberof rules
   * @param {string} value - The value to be checked.
   * @returns {(boolean|string)} - Returns true if the value is a valid email address, otherwise returns the error message 'Invalid email address.'.
   */
  email: (value) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return pattern.test(value) || 'Invalid email address.'
  },

  /**
   * Checks if a value is a valid name.
   * @memberof rules
   * @param {string} value - The value to be checked.
   * @returns {(boolean|string)} - Returns true if the value is a valid name, otherwise returns the error message 'Name must be at least 1 characters long and contain only letters and spaces.' or 'Name must be less than 50 characters long.'.
   */
  name: (value) => {
    if (value && value.length >= 50) return 'Name must be less than 50 characters long.'
    if (value && value.length >= 1) return true
    return 'Name must be at least 1 characters long and contain only letters and spaces.'
  },

  /**
   * Checks if a value is a valid username.
   * @memberof rules
   * @param {string} value - The value to be checked.
   * @returns {(boolean|string)} - Returns true if the value is a valid username, otherwise returns the error message 'Username must be at least 3 characters long and contain only letters, numbers or underscores (no spaces).' or 'Username must be less than 16 characters long.'.
   */
  username: (value) => {
    if (value && value.length >= 16) return 'Username must be less than 16 characters long.'
    if (value && /^[a-zA-Z0-9_]+$/.test(value) && value.length >= 3) return true
    return 'Username must be at least 3 characters long and contain only letters, numbers or underscores (no spaces).'
  },

  /**
   * Checks if a string value is within a specified length range.
   * @memberof rules
   * @param {number} min - The minimum length of the string.
   * @param {number} max - The maximum length of the string.
   * @param {string} msg - The optional message to be displayed in the error.
   * @returns {Function} - Returns a function that checks if the value is within the specified length range.
   */
  string: (min, max, msg) => (value) => {
    if (value && value.length >= min && value.length <= max) return true
    if (msg) {
      return `Input for ${msg} must be between ${min} and ${max} characters.`
    } else {
      return `Input must be between ${min} and ${max} characters.`
    }
  },

  /**
   * Checks if a value is a valid integer within a specified range.
   * @memberof rules
   * @param {number} min - The minimum value of the integer.
   * @param {number} max - The maximum value of the integer.
   * @returns {Function} - Returns a function that checks if the value is within the specified range.
   */
  integer: (min = 0, max = 99999) => (value) => {
      if (!value) return
      const intValue = parseFloat(value)
      if (intValue >= min && intValue <= max) return true
      return `Number must be between ${min} and ${max}.`
    },

  /**
   * Checks if an array value has a length within a specified range.
   * @memberof rules
   * @param {number} min - The minimum length of the array.
   * @param {number} max - The maximum length of the array.
   * @returns {Function} - Returns a function that checks if the value has a length within the specified range.
   */
  array: (min, max) => (value) => {
    if (!value) return
    if (value.length >= min && value.length <= max) return true
    return `Select between ${min} and ${max} items.`
  },

  /**
   * Checks if a value is a strong password.
   * @memberof rules
   * @param {string} value - The value to be checked.
   * @returns {(boolean|string)} - Returns true if the value is a strong password, otherwise returns the error message 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.'.
   */
  pass: (value) => {
    const strongPasswordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return (
      strongPasswordPattern.test(value) ||
      'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.'
    )
  },

  /**
   * Checks if a value matches the provided password.
   * @memberof rules
   * @param {string} pass - The password to be matched against.
   * @returns {Function} - Returns a function that checks if the value matches the provided password.
   */
  passConfirm: (pass) => (value) => {
    return value === pass || 'Passwords do not match.'
  },

  /**
   * Checks if a value matches a specified regular expression pattern.
   * @memberof rules
   * @param {RegExp} pattern - The regular expression pattern to match against.
   * @param {string} message - The error message to be displayed if the value does not match the pattern.
   * @returns {Function} - Returns a function that checks if the value matches the specified pattern.
   */
  regex: (pattern, message) => (value) => {
    return pattern.test(value) || message
  }
}
