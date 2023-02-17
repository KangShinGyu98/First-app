const express = require('express');
const naverMap = require('../naver/naverMap.js');
var request = require('request');
const kakao = {
  clientID: 'a6c9bdc1f73215cef3d0caa642b66287',
  clientSecret: 'BivjnDPIBw1R9fpSKS6ewJXpYw6H5Pfe',
  redirectUri: 'http://localhost:8000/auth/kakao/callback'
}

const naver = {
  clientID: 'kvmk8zerka',
  clientSecret: 'aZMLz7U61f1mm2zjdUAdfdf83exQjCS8ldMoUzVv'

}

const router = express.Router();
const {
  createUser,
  userSignIn,
  uploadProfile,
  signOut,
  isAuth,
} = require('../controllers/user');

const {
  validateUserSignUp,
  userVlidation,
  validateUserSignIn,
} = require('../middlewares/validation/user');

const multer = require('multer');

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('invalid image file!', false);
  }
};
const uploads = multer({ storage, fileFilter });

router.post('/create-user', validateUserSignUp, userVlidation, createUser);
router.post('/sign-in', validateUserSignIn, userVlidation, userSignIn);
router.post('/sign-out', isAuth, signOut);
router.post(
  '/upload-profile',
  isAuth,
  uploads.single('profile'),
  uploadProfile
);
router.get('/auth/info',(req,res)=>{
  let {nickname,profile_image}=req.session.kakao.properties;
  res.render('info',{
      nickname,profile_image,
  })
})

router.get('/auth/kakao',(req,res)=>{
  const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.clientID}&redirect_uri=${kakao.redirectUri}&response_type=code&scope=account_email`;
  res.redirect(kakaoAuthURL);
})

router.get('/naverMap',(req,res)=>{
  console.log(req.query.query)
  var api_url = 'https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=' + encodeURI(req.query.query); // JSON 결과
  
   var options = {
       url: api_url,
       headers: {'X-NCP-APIGW-API-KEY-ID':naver.clientID, 'X-NCP-APIGW-API-KEY': naver.clientSecret}
    };
  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
      res.end(body);
    } else {
      res.status(response.statusCode).end();
      console.log('error = ' + response.statusCode);
    }
  });

})

router.get('/auth/kakao/callback', async(req,res)=>{
//   try{
//   token = await axios({
//       method: 'POST',
//       url: 'https://kauth.kakao.com/oauth/token',
//       headers:{
//           'content-type':'application/x-www-form-urlencoded'
//       },
//       data:qs.stringify({//객체를 string 으로 변환
//           grant_type: 'authorization_code',//특정 스트링
//           client_id:kakao.clientID,
//           client_secret:kakao.clientSecret,
//           redirectUri:kakao.redirectUri,
//           code:req.query.code,
//       })
//   })
// }catch(err){
//   res.json(err.data);
// }

//   let user;
//   try{
//       console.log(token);//access정보를 가지고 또 요청해야 정보를 가져올 수 있음.
//       user = await axios({
//           method:'get',
//           url:'https://kapi.kakao.com/v2/user/me',
//           headers:{
//               Authorization: `Bearer ${token.data.access_token}`
//           }
//       })
//   }catch(e){
//       res.json(e.data);
//   }
//   console.log(user);

//   req.session.kakao = user.data;    
  res.send('success');
})


module.exports = router;
