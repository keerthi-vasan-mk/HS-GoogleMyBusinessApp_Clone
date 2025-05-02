let base;
let baseFront;
let googleClient;
let appId;
let developerKey;
let sdkKey;

switch (process.env.BUILD_ENV) {
  case 'production':
    base = 'https://api.gmb.hootsuite.com';
    baseFront = 'https://gmb.hootsuite.com';
    googleClient = '227850762494-4rtnf0o6pquugtl40ie1dov6mvurvinr.apps.googleusercontent.com';
    appId = 'hootsuite-gmb-integration-v1';
    developerKey = 'AIzaSyDELhcRkpQRmxD2YdnJW4yWdnTaVOTeSHw';
    sdkKey = '447t1fzttkw00scckocgk0g0k3ihkh20bhp';
    break;
  case 'staging':
    base = 'https://staging.api.hs-gmb.freshworks.club';
    baseFront = 'https://staging.hs-gmb.freshworks.club';
    googleClient = '186040109992-hpulaj8c198qb9drt8eu37fj620b4t3r.apps.googleusercontent.com';
    appId = 'my-business-learn';
    developerKey = 'AIzaSyAiJ0cnkz90orcKGr1mBxpeAOmQBUXdZ_8';
    sdkKey = '1qzd532yrz34csko80kscs0k03ihkplfi12';
    break;
  case 'development':
    // base = 'https://dev.api.hs-gmb.freshworks.club';
    // baseFront = 'https://dev.hs-gmb.freshworks.club';
    // googleClient = '186040109992-hpulaj8c198qb9drt8eu37fj620b4t3r.apps.googleusercontent.com';
    base = 'https://dev.gmb.api.aottechnologies.click';
    baseFront = 'https://dev.gmb.aottechnologies.click';
    googleClient = '227850762494-4rtnf0o6pquugtl40ie1dov6mvurvinr.apps.googleusercontent.com';
    appId = 'hootsuite-gmb-integration-v1';
    developerKey = 'AIzaSyCXC1WPz20qrdMwxS5dlwGazbD2JprcPsQ';
    sdkKey = '1qzd532yrz34csko80kscs0k03ihkplfi12';
    break;
  default:
    base = 'https://dev.gmb.api.aottechnologies.click';
    baseFront = 'https://dev.gmb.aottechnologies.click';
    googleClient = '227850762494-4rtnf0o6pquugtl40ie1dov6mvurvinr.apps.googleusercontent.com';
    appId = 'hootsuite-gmb-integration-v1';
    developerKey = 'AIzaSyAvC_JhJjyOhJam6jUrQPVJ3m_nNWxz508';
    sdkKey = '1qzd532yrz34csko80kscs0k03ihkplfi12';
}

export const GOOGLE_CLIENT_ID = googleClient;
export const APP_ID = appId;
export const DEVELOPER_KEY = developerKey;
export const SDK_API_KEY = sdkKey;
export const GOOGLE_SCOPE =
  'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/photoslibrary.readonly';

export const BASE_URL = base;
export const BASE_API_URL = `${BASE_URL}/api`;
export const BASE_FRONT_URL = baseFront;

export const POSTS_URL = '/posts';
export const LOCATIONS_URL = '/locations';
export const MEDIA_URL = '/media';
export const GDRIVE_MEDIA_URL = '/gMedia';
