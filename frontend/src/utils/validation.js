//Cobian: This is a personal confuguration of validation rules that I use in my projects.
export const rules = {
  required: (value) => !!value || 'Required.',

  email: (value) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return pattern.test(value) || 'Invalid email address.'
  },

  name: (value) => {
    if (value && value.length >= 50) return 'Name must be less than 50 characters long.'
    if (value && value.length >= 1) return true ///^[a-zA-Z\s]+$/.test(value) &&
    return 'Name must be at least 1 characters long and contain only letters and spaces.'
  },

  username: (value) => {
    if (value && value.length >= 16) return 'Username must be less than 16 characters long.'
    if (value && /^[a-zA-Z0-9_]+$/.test(value) && value.length >= 3) return true
    return 'Username must be at least 3 characters long and contain only letters, numbers or underscores (no spaces).'
  },

  string: (min, max, msg) => (value) => {
    if (value && value.length >= min && value.length <= max) return true
    if (msg) {
      return `Input for ${msg} must be between ${min} and ${max} characters.`
    } else {
      return `Input must be between ${min} and ${max} characters.`
    }
  },

  integer:
    (min = 0, max = 99999) =>
    (value) => {
      if (!value) return
      const intValue = parseFloat(value)
      if (intValue >= min && intValue <= max) return true
      return `Number must be between ${min} and ${max}.`
    },

  array: (min, max) => (value) => {
    if (!value) return
    if (value.length >= min && value.length <= max) return true
    return `Select between ${min} and ${max} items.`
  },

  pass: (value) => {
    const strongPasswordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return (
      strongPasswordPattern.test(value) ||
      'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.'
    )
  },

  passConfirm: (pass) => (value) => {
    return value === pass || 'Passwords do not match.'
  },

  regex: (pattern, message) => (value) => {
    return pattern.test(value) || message
  }
}
