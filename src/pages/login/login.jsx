import React from 'react';
import { Link, useHistory } from 'react-router-dom';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import './login.scss';
import logoImg from '../../static/images/logo.png';
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
    <div className="ContainerPage">
      <div className="LeftContainer">
        <img className="LogoImg" src={logoImg} alt="Footer Action" />
        <img className="Img" src={formsImg} alt="Footer Action" />
      </div>
      <div className="ContainerRight">
        <div className="Title">
          <p>Bem vindo a Fashion Stock!</p>
          <p>Novo por aqui?</p>
          <Link to="/create-account">
            <p className="Link">crie uma conta</p>
          </Link>
        </div>
        <div className="Form">
          <p>Ou</p>
          <p>Acesse sua conta</p>
          <div className="InputContainer">
            <p>Email</p>
            <input name="email" type="email" ref={register} />
            <span>{errors.email && errors.email.message}</span>
          </div>
          <div className="InputContainer">
            <p>Senha</p>
            <input type="password" name="password" ref={register} />
            <span>{errors.password && errors.password.message}</span>
            <a href="localhost">Esqueci minha senha</a>
          </div>
          <div className="ButtonContainer">
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
