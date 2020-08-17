import { stringify } from 'querystring';
import { history } from 'umi';
import { message } from 'antd';
import { parse } from 'qs';
// import { routerRedux } from 'dva/router';
// import { reloadAuthorized } from '@/utils/Authorized';
import { fakeAccountLogin, getFakeCaptcha, logout } from './service';

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}
export function setAuthority(payload) {
  const authority = payload.currentAuthority;
  const { token } = payload;
  const { currentUser } = payload;
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority)); // hard code
  localStorage.setItem('token', token);
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  // reload Authorized component
  // reloadAuthorized();
  try {
    if (window.reloadAuthorized) {
      window.reloadAuthorized();
    }
  } catch (error) {
    // do not need do anything
  }

  return authority;
}
const Model = {
  namespace: 'userAndlogin',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      response.currentAuthority = 'user';
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully

      if (response.status === 'ok') {
        message.success('登录成功！');
        // reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        // yield put(routerRedux.replace(redirect || '/'));
        history.replace(redirect || '/');
        // window.location.href=redirect || '/';
      }
    },
    *logout(_, { call }) {
      // const { redirect } = getPageQuery(); // Note: There may be security issues, please note
      yield call(logout);
      localStorage.setItem('currentUser', '');
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: window.location.href,
        }),
      });
      // if (window.location.pathname !== '/user/login' && !redirect) {
      //   history.replace({
      //     pathname: '/user/login',
      //     search: stringify({
      //       redirect: window.location.href,
      //     }),
      //   });
      // }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      // setAuthority(payload.currentAuthority);
      setAuthority(payload);
      return { ...state, status: payload.status, msg: payload.msg };
    },
  },
};
export default Model;
