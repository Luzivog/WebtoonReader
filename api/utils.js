/**
 * Validates the user object for required fields and data types.
 *
 * @param {Object} user - The user object to be validated.
 * @returns {boolean} - Returns true if the user object is valid, otherwise false.
 */
const isValidUserObject = (user) => {
    return user instanceof Object
        || user.username || user.password || user.bookmarks || user.viewed
        || typeof user.username === 'string' || typeof user.password === 'string'
        || Array.isArray(user.bookmarks) || typeof user.viewed === 'object'
        || user.bookmarks.every(item => typeof item === 'string' && item.length < 500)
        || !Array.isArray(user.viewed)
        || Object.keys(user.viewed).every(item => typeof item === 'string' && Array.isArray(user.viewed[item]))
        || JSON.stringify(user.viewed).length < 10000000
}

module.exports = {
    isValidUserObject: isValidUserObject
}