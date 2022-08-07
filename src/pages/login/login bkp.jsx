import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BsFacebook } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from 'firebase/auth';
import { auth } from '../../firebase-config';
import Button from '../components/button';
import Layout from '../layouts';

import style from './login.module.scss';

function Login() {
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [user, setUser] = useState('');

  const providerGoogle = new GoogleAuthProvider();
  const providerFaceBook = new FacebookAuthProvider();

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, [auth]);

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      setUser('');
    } catch (error) {
      console.log(error.message);
    }
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (error) {
      console.log(error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const loginGoogle = async () => {
    signInWithPopup(auth, providerGoogle)
      .then((result) => {
        console.log(result.user.displayName);
        console.log(result.user.email);
        console.log(result.user.photoURL);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loginFaceBook = async () => {
    signInWithPopup(auth, providerFaceBook)
      .then((result) => {
        console.log(result);
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const { accessToken } = credential;
        console.log(accessToken);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Layout showMenu={false}>
      <div className={style.Container}>
        <header>
          <h1>Bem vindo a StockA! </h1>
          <h2>Acesse sua conta</h2>
        </header>
        <form className={style.Form}>
          <input
            name="email"
            type="email"
            onChange={(event) => setRegisterEmail(event.target.value)}
          />
          <input
            name="password"
            type="password"
            onChange={(event) => setRegisterPassword(event.target.value)}
          />
          <Button text="Criar conta" onClick={() => register()} />
          <Link className={style.Link} to="/create-account">
            Novo por aqui? crie uma conta
          </Link>
        </form>

        {user?.email}
        <form className={style.Form}>
          Login
          <input
            name="email"
            type="email"
            onChange={(event) => setLoginEmail(event.target.value)}
          />
          <input
            name="password"
            type="password"
            onChange={(event) => setLoginPassword(event.target.value)}
          />
          <Button text="Login" onClick={() => login()} />
          <Link className={style.Link} to="/create-account">
            Novo por aqui? crie uma conta
          </Link>
        </form>
        <Button text="Sair" onClick={() => logout()} />
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
      </div>
    </Layout>
  );
}

export default Login;
