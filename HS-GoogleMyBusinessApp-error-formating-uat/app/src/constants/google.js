let clientId;

switch (process.env.BUILD_ENV) {
  case 'production':
    clientId = '227850762494-cfgrphc3qee6vmft6fu87du65olfsr0n.apps.googleusercontent.com';
    break;
  case 'staging':
    clientId = '227850762494-cfgrphc3qee6vmft6fu87du65olfsr0n.apps.googleusercontent.com';
    break;
  case 'development':
    clientId = '227850762494-4rtnf0o6pquugtl40ie1dov6mvurvinr.apps.googleusercontent.com';
    break;
  default:
    clientId = '227850762494-4rtnf0o6pquugtl40ie1dov6mvurvinr.apps.googleusercontent.com';
}

export const GOOGLE_CLIENT_ID = clientId;
export const GOOGLE_GMB_SCOPE = 'https://www.googleapis.com/auth/plus.business.manage';
