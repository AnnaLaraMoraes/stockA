import React from 'react';
import style from './landing-page.module.scss';
import landingPageImg from '../../static/images/undraw_lading_page.svg';
import Layout from '../layouts';

function Item({ title, text, align }) {
  return (
    <div className={style.Item} style={{ textAlign: align }}>
      <h1>{title}</h1>
      <p>{text}</p>
    </div>
  );
}

function LandingPage() {
  return (
    <Layout showMenu={false}>
      <Layout.Content background="transparent">
        <div className={style.Container}>
          <div className={style.ItemContainer}>
            <Item
              title="Simplicidade"
              text="Gerencie sua loja de forma fácil, rápida e de qualquer lugar."
              align="left"
            />
            <Item
              title="Acessível"
              text="Acesse pelo celular, computador ou tablet."
              align="left"
            />
          </div>
          <img src={landingPageImg} alt="" />
          <div className={style.ItemContainer}>
            <Item
              title="Controle"
              text="Acelere suas vendas com controle e estatísticas sobre o seu negócio."
              align="right"
            />
            <Item
              title="Agilidade"
              text="Um sistema 100% online, rápido e intuitivo."
              align="right"
            />
          </div>
        </div>
      </Layout.Content>
    </Layout>
  );
}

export default LandingPage;
