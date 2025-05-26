interface Config {
  environment: 'development' | 'production' | 'test';
  apiBaseUrl: string;
  wssUrl: string;
  cookie: {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: string;
  };
  localStorage: {
    petitionCreateTitle: string;
    petitionCreateImages: string;
    petitionCreateTags: string;
    petitionCreateText: string;
  };
  sessionStorage: {
    petitionSearchParams: string;
    petitionSearchPage: string;
    petitionSearchTags: string;
    userSearchName: string;
    userSearchPage: string;
  };
}

export const config: Config = {
  environment: process.env.NODE_ENV,
  apiBaseUrl: process.env.REACT_APP_API_HOST || 'http://localhost:5175',
  wssUrl:
    process.env.REACT_APP_WSS_URL || 'http://localhost:5175/voice-matters-hub/',
  cookie: {
    accessToken: 'at',
    refreshToken: 'rt',
    accessTokenExpires: 'atttl',
  },
  localStorage: {
    petitionCreateTitle: 'pcti',
    petitionCreateImages: 'pcim',
    petitionCreateTags: 'pcta',
    petitionCreateText: 'pcte',
  },
  sessionStorage: {
    petitionSearchParams: 'pspm',
    petitionSearchPage: 'pspg',
    petitionSearchTags: 'pstg',
    userSearchName: 'usnm',
    userSearchPage: 'uspg',
  },
};
