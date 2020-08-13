import { Alert } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './style.less';
import LoginFrom from './components/Login';

const { UserName, Password, Submit } = LoginFrom;

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = (props) => {
  const { userAndlogin = {}, submitting } = props;
  const { status, msg } = userAndlogin;

  const handleSubmit = (values) => {
    const { dispatch } = props;
    dispatch({
      type: 'userAndlogin/login',
      payload: { ...values },
    });
  };

  return (
    <div className={styles.main}>
      <LoginFrom onSubmit={handleSubmit}>
        {status === 'error' && !submitting && <LoginMessage content={msg} />}

        <UserName
          name="userName"
          placeholder="用户名: admin or user"
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]}
        />
        <Password
          name="password"
          placeholder="密码: ant.design"
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />
        <Submit loading={submitting}>登录</Submit>
      </LoginFrom>
    </div>
  );
};

export default connect(({ userAndlogin, loading }) => ({
  userAndlogin,
  submitting: loading.effects['userAndlogin/login'],
}))(Login);
