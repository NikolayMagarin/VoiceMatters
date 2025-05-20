interface Config {
  environment: 'development' | 'production' | 'test';
  apiBaseUrl: string;
  wssUrl: string;
  cookie: {
    accessToken: string;
    refreshToken: string;
  };
}

export const config: Config = {
  environment: process.env.NODE_ENV,
  apiBaseUrl: process.env.API_HOST || 'http://localhost:5175',
  wssUrl: process.env.WSS_URL || 'ws://localhost:5175/voice-matters-hub/',
  cookie: {
    accessToken: '_vm_at',
    refreshToken: '_vm_rt',
  },
};
