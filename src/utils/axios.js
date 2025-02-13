import axios from 'axios';

axios.defaults.baseURL = 'https://change-all.com';
// axios.defaults.baseURL = 'https://mori.dmonster.kr';
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';

const post = (url, data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(url, data)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
        console.log(err);
      });
  });
};

export default post;

