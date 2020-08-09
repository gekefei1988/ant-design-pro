import request from '@/utils/request';

export async function fakeAccountLogin(params) {
  return request('/api/login', {
    // headers: {
    //   'Content-Type': 'application/json;charset=utf-8',
    // },
    method: 'POST',
    data: params,
  });
}
export async function fakeAccountLogout() {
  return request('/api/logout');
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
