let base;
let baseFront;

switch (process.env.BUILD_ENV) {
  case 'production':
    base = 'https://api.gmb.hootsuite.com/api';
    baseFront = 'https://gmb.hootsuite.com';
    break;
  case 'staging':
    base = 'https://staging.api.hs-gmb.freshworks.club/api';
    baseFront = 'https://staging.hs-gmb.freshworks.club';
    break;
  // case 'development':
  //   // base = 'https://dev.api.hs-gmb.freshworks.club';
  //   // baseFront = 'https://dev.hs-gmb.freshworks.club';
  //   // googleClient = '186040109992-hpulaj8c198qb9drt8eu37fj620b4t3r.apps.googleusercontent.com';
  //   base = 'https://dev.gmb.api.aottechnologies.click/api';
  //   baseFront = 'https://dev.gmb.aottechnologies.click';
  case 'development':
    base = 'https://dev.api.gmb.hootsuite.com/api';
    baseFront = 'https://dev.gmb.hootsuite.com';
    break;
  default:
    base = 'https://dev.api.gmb.hootsuite.com/api';
    baseFront = 'https://dev.gmb.hootsuite.com';
}
export const BASE_API_URL = base;
export const BASE_FRONT_URL = baseFront;

// Auth/user based routes
export const AUTH = '/auth';
export const LOGIN = '/login';
export const GOOGLE_CODE = '/gtokens';
export const GOOGLE_TOKEN_CHECK = '/validtokens';
export const GOOGLE_REVOKE = '/revoketokens';
export const GOOGLE_USERNAME = '/gusername';

// Location routes
export const LOCATIONS = '/locations';

// Reviews routes
export const REVIEWS = '/reviews';
export const LOCATION_REVIEW_REPLY = `${REVIEWS}/replies`;

// Question routes
export const QUESTIONS = '/questions';
export const LOCATION_QUESTION_RESPONSE = `${QUESTIONS}/responses`;

// Posts routes
export const POSTS = '/posts';

// Modal routes
export const MODAL = '/modal';

// Notification routes
export const NOTIFICATIONS = '/notifications';

// Admin routes
export const ADMIN = '/admin';
export const ANALYTICS = '/analytics';
export const LOGS = '/logs';
export const ERRORS = '/errors';
