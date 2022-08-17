/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { BsFacebook } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc';
import { ToastContainer, toast } from 'react-toastify';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from 'firebase/auth';
import { auth } from '../../firebase-config';
import Input from '../components/input';

import Button from '../components/button';
import Layout from '../layouts';

import style from './login.module.scss';

function Login() {
  const providerGoogle = new GoogleAuthProvider();
  const providerFaceBook = new FacebookAuthProvider();

  const { register, handleSubmit, setValue, setError, getValues } = useForm({});

  const history = useHistory();

  const onSubmit = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      history.push('/dashboard');
    } catch (error) {
      toast.error('Erro ao tentar acessar conta');
    }
  };

  const loginGoogle = async () => {
    try {
      await signInWithPopup(auth, providerGoogle);
      history.push('/dashboard');
    } catch (error) {
      toast.error('Erro ao tentar acessar conta com Google');
    }
  };

  const loginFaceBook = async () => {
    try {
      await signInWithPopup(auth, providerFaceBook);
      history.push('/dashboard');
    } catch (error) {
      toast.error('Erro ao tentar acessar conta com Facebook');
    }
  };

  return (
    <Layout>
      <ToastContainer />
      <div className={style.Container}>
        <header>
          <h1>Bem vindo a StockA! </h1>
          <h2>Acesse sua conta</h2>
        </header>
        <form className={style.Form}>
          <Input
            setValue={setValue}
            setError={setError}
            {...register('email')}
            value={getValues('email')}
            name="email"
            text="E-mail"
            type="email"
          />
          <Input
            setValue={setValue}
            setError={setError}
            {...register('password')}
            value={getValues('password')}
            name="password"
            text="Senha"
            type="password"
          />
          <Button
            style={{ width: 274 }}
            text="Login"
            onClick={handleSubmit(onSubmit)}
          />
        </form>
        <span>Ou acesse sua conta com</span>
        <div className={style.LoginButtons}>
          <button type="button" onClick={loginFaceBook}>
            <BsFacebook />
            Login Facebook
          </button>

          <button type="button" onClick={loginGoogle}>
            <FcGoogle />
            Login Google
          </button>
        </div>

        <Link className={style.Link} to="/create-account">
          Novo por aqui? crie uma conta
        </Link>
      </div>
    </Layout>
  );
}

export default Login;
