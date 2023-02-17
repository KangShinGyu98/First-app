# First-app
npm init
npx expo start를 통해서 실행 
requirements 
  1. 16.16.0 이하 버전 NodeJS
  2. .env 파일 
  3. DB에 IP address 등록 
  
  문제시
  4. expo update 
  5. reanimated 문제시 프론트엔드 폴더에 babel.config.js 파일 수정 

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [    
      '@babel/plugin-proposal-export-namespace-from',
      'react-native-reanimated/plugin',
    ],
  };
};
