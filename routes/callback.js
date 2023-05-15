var express = require('express');
var router = express.Router();
const request = require('superagent');
require('dotenv').config();

const state = {
  access_token: '',
};

router.get('/', function (req, res, next) {
  if (state.access_token) {
    postUgc(state.access_token)
      .then((response) => {
        res.render('callback', { shareUrn: response.body });
      })
      .catch((error) => {
        res.status(500).send(`${error}`);
        console.error(error);
      });
  } else {
    requestAccessToken(req.query.code, req.query.state)
      .then((response) => {
        state.access_token = response.body.access_token;
        postUgc(state.access_token)
          .then((response) => {
            res.render('callback', { shareUrn: response.body });
          })
          .catch((error) => {
            res.status(500).send(`${error}`);
            console.error(error);
          });
      })
      .catch((error) => {
        res.status(500).send(`${error}`);
        console.error(error);
      });
  }
});

function requestAccessToken(code, state) {
  return request
    .post('https://www.linkedin.com/oauth/v2/accessToken')
    .send('grant_type=authorization_code')
    .send(`redirect_uri=${process.env.EXPRESS_APP_REDIRECT_URI}`)
    .send(`client_id=${process.env.EXPRESS_APP_CLIENT_ID}`)
    .send(`client_secret=${process.env.EXPRESS_APP_CLIENT_SECRET}`)
    .send(`code=${code}`)
    .send(`state=${state}`);
}

function postUgc(token) {
  return request
    .post('https://api.linkedin.com/v2/ugcPosts')
    .send({
      author: 'urn:li:company:38132953',
      lifecycleState: 'PUBLISHED',
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'LOGGED_IN',
      },
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            attributes: [
              {
                length: 6,
                start: 4,
                value: {
                  'com.linkedin.common.CompanyAttributedEntity': {
                    company: 'urn:li:organization:74104864',
                  },
                },
              },
            ],
            text: `Hey IMPRZD (Test Post - ${new Date().getTime()})`,
          },
          shareMediaCategory: 'IMAGE',
          media: [
            {
              status: 'READY',
              description: {
                text: 'This is test image uploaded using asset API',
              },
              media: 'urn:li:digitalmediaAsset:D5610AQEqOfOcmhkMKg',
              title: {
                text: 'Hello test, JS Linkedin POST UGC API. Test!',
              },
            },
          ],
        },
      },
    })
    .set('Authorization', `Bearer ${token}`);
}

module.exports = router;
