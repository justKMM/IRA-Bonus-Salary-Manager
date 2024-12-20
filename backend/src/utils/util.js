/**
 * Extracts UID from a vCard string format.
 * @private
 * @param {string} vcard - vCard string containing contact information.
 * @returns {string|null} Extracted UID or null if not found/invalid vCard.
 */
exports.extractUID = function(vcard) {
    if (!vcard) return null;
    const uidMatch = vcard.match(/UID:(.*?)(?:\r?\n|$)/);
    return uidMatch ? uidMatch[1] : null;
};