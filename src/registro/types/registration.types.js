/**
 * @typedef {'new'|'under_review'|'contacted'|'accepted'|'waitlisted'} RegistrationStatus
 */

/**
 * @typedef {Object} RegistrationRecord
 * @property {string} fullName
 * @property {string} email
 * @property {string} phone
 * @property {string} organization
 * @property {string} role
 * @property {string} birthDate
 * @property {string} residenceCountry
 * @property {string} bio
 * @property {string} workArea
 * @property {string} educationLevel
 * @property {string} leadershipChallenge
 * @property {string} leadershipQuestion
 * @property {string} currentProjects
 * @property {string} encounterExpectation
 * @property {string} referralSource
 * @property {string} reference1FullName
 * @property {string} reference1Organization
 * @property {string} reference1Role
 * @property {string} reference1Email
 * @property {string} reference1Phone
 * @property {string} reference2FullName
 * @property {string} reference2Organization
 * @property {string} reference2Role
 * @property {string} reference2Email
 * @property {string} reference2Phone
 * @property {string} accessibilityNeeds
 * @property {string} personalBoundaries
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
  fullName: '',
  email: '',
  phone: '',
  organization: '',
  role: '',
  birthDate: '',
  residenceCountry: '',
  bio: '',
  workArea: '',
  educationLevel: '',
  leadershipChallenge: '',
  leadershipQuestion: '',
  currentProjects: '',
  encounterExpectation: '',
  referralSource: '',
  reference1FullName: '',
  reference1Organization: '',
  reference1Role: '',
  reference1Email: '',
  reference1Phone: '',
  reference2FullName: '',
  reference2Organization: '',
  reference2Role: '',
  reference2Email: '',
  reference2Phone: '',
  accessibilityNeeds: '',
  personalBoundaries: '',
  consentData: false,
  consentCommunity: false,
  programKey,
  createdAt: '',
  status: REGISTRATION_STATUS.NEW,
});
