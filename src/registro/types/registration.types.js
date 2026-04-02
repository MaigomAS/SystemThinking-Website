/**
 * @typedef {'new'|'under_review'|'contacted'|'accepted'|'waitlisted'} RegistrationStatus
 */

/**
 * @typedef {Object} RegistrationRecord
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} role
 * @property {string} organization
 * @property {string} sector
 * @property {string} organizationWebsite
 * @property {string} whatsapp
 * @property {string} email
 * @property {string} professionalProfileUrl
 * @property {string} bio
 * @property {string} motivation
 * @property {string} attendanceAvailability
 * @property {string} referralSource
 * @property {string} referralName
 * @property {string} questions
 * @property {boolean} consentData
 * @property {boolean} consentCommunity
 * @property {string} programKey
 * @property {string} createdAt
 * @property {RegistrationStatus} status
 */

export const REGISTRATION_STATUS = Object.freeze({
  NEW: 'new',
  UNDER_REVIEW: 'under_review',
  CONTACTED: 'contacted',
  ACCEPTED: 'accepted',
  WAITLISTED: 'waitlisted',
});

export const createEmptyRegistration = (programKey) => ({
  firstName: '',
  lastName: '',
  role: '',
  organization: '',
  sector: '',
  organizationWebsite: '',
  whatsapp: '',
  email: '',
  professionalProfileUrl: '',
  bio: '',
  motivation: '',
  attendanceAvailability: '',
  referralSource: '',
  referralName: '',
  questions: '',
  consentData: false,
  consentCommunity: false,
  programKey,
  createdAt: '',
  status: REGISTRATION_STATUS.NEW,
});
