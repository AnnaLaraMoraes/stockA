import React from 'react';
import { Link, useHistory } from 'react-router-dom';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import style from './login.module.scss';
import logoImg from '../../static/images/logo.svg';
import formsImg from '../../static/images/forms.png';

const schema = yup.object().shape({
  password: yup
    .string()
    .required('Este campo é obrigatório')
    .min(8, 'Senha muito curta'),
  email: yup
    .string()
    .required('Este campo é obrigatório')
    .email('Este email nao é válido'),
});

function Login() {
  const history = useHistory();

  const { register, handleSubmit, setValue, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setValue('password', '');
    setValue('email', '');
    console.log(data);
    history.push('/dashboard');
  };

  return (
    <div className={style.ContainerPageLogin}>
      <div className={style.LeftContainer}>
        <img className={style.LogoImg} src={logoImg} alt="Footer Action" />
        <img className={style.Img} src={formsImg} alt="Footer Action" />
      </div>
      <div className={style.ContainerRight}>
        <div className={style.Title}>
          <p>Bem vindo a StockA!</p>
          <p>Novo por aqui?</p>
          <Link to="/create-account">
            <p className={style.Link}>crie uma conta</p>
          </Link>
        </div>
        <div className={style.Form}>
          <p>Ou</p>
          <p>Acesse sua conta</p>
          <div className={style.InputContainer}>
            <p>Email</p>
            <input name="email" type="email" ref={register} />
            <span>{errors.email && errors.email.message}</span>
          </div>
          <div className={style.InputContainer}>
            <p>Senha</p>
            <input type="password" name="password" ref={register} />
            <span>{errors.password && errors.password.message}</span>
            <a href="localhost">Esqueci minha senha</a>
          </div>
          <div className={style.ButtonContainer}>
            <button type="button" onClick={handleSubmit(onSubmit)}>
              Entrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
