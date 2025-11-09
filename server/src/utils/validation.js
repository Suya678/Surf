/**
 * @file utils/validation.js
 * @description Contains helper functions for validating request data.
 */

/**
 * Validates the input for creating or updating a listing.
 * @param {object} body - The request body.
 * @returns {string|null} An error message string if invalid, or null if valid.
 */
 export const validateListingInput = (body) => {
    const {
      title,
      address,
      city,
      province,
      postal_code,
      guest_limit,
      image: url,
    } = body;
  
    if (!title || !address || !city || !province || !postal_code || !url) {
      return "title, address, city, province, postal_code, and image are required.";
    }
  
    const postalCodePattern = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i;
    if (!postalCodePattern.test(postal_code)) {
      return "Invalid Canadian postal code format (e.g., A1A 1A1)";
    }
  
    if (isNaN(guest_limit) || guest_limit < 1) {
      return "Guest limit must be at least 1";
    }
  
    try {
      new URL(url);
    } catch {
      return "Invalid image URL format";
    }
  
    return null; // All valid
  };
  
  /**
   * Validates start and end dates.
   * @param {string} startDateStr - The start date (YYYY-MM-DD).
   * @param {string} endDateStr - The end date (YYYY-MM-DD).
   * @returns {string|null} An error message string if invalid, or null if valid.
   */
  export const validateDates = (startDateStr, endDateStr) => {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
  
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return "Invalid date format. Please use YYYY-MM-DD.";
    }
  
    if (endDate <= startDate) {
      return "End date must be after start date.";
    }
  
    return null; // All valid
  };