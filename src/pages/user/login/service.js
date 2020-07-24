import request from 'umi-request';

export async function fakeAccountLogin(params) {
  return request('/api2/login', {
    // headers: {
    //   'Content-Type': 'application/json;charset=utf-8',
    // },
    method: 'POST',
    data: params,
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
