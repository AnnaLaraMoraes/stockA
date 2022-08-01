import React from 'react';
import { Link, useHistory } from 'react-router-dom';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../components/input';
import Button from '../components/button';
import Layout from '../layouts';

import style from './login.module.scss';

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
    <Layout showMenu={false}>
      <div className={style.Container}>
        <header>
          <h1>Bem vindo a StockA!</h1>
          <h2>Acesse sua conta</h2>
        </header>
        <form className={style.Form}>
          <Input
            name="email"
            text="E-mail"
            register={register}
            errors={errors.email && errors.email.message}
            type="email"
          />
          <Input
            name="password"
            text="Senha"
            register={register}
            errors={errors.password && errors.password.message}
            type="password"
          />
          <Button text="Entrar" onClick={handleSubmit(onSubmit)} />
          <Link className={style.Link} to="/create-account">
            Novo por aqui? crie uma conta
          </Link>
        </form>
      </div>
    </Layout>
  );
}

export default Login;
