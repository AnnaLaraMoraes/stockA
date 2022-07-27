import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { RiMenuUnfoldFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import style from './header.module.scss';
import Logo from '../static/images/logo.png';
import LateralMenu from '../lateral-menu';

function MenuOptions({ menuItens }) {
  return (
    <div style={{ position: 'relative' }}>
      <div className={style.MenuOptions}>
        {menuItens.length > 0 &&
          menuItens.map((menuitem) => (
            <Link className={style.Link} key={menuitem.key} to={menuitem.link}>
              {menuitem.title}
            </Link>
          ))}
      </div>
    </div>
  );
}

export function Header() {
  const [openLateralMenu, setOpenLateralMenu] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  const handleLateralMenu = () => {
    setOpenLateralMenu(!openLateralMenu);
  };

  const onToggle = (event) => {
    event.preventDefault();
    setOpenDetail(!openDetail);
  };

  return (
    <div className={style.Container}>
      <div className={style.ChildContainer}>
        <img src={Logo} alt="" />
        <div className={style.Menu}>
          <Link className={style.Link} to="./dashboard">
            Dashboard
          </Link>
          <details open={openDetail} onClick={onToggle}>
            <summary>Produtos</summary>
            <MenuOptions
              menuItens={[
                { key: 1, title: 'Lista de Produtos', link: '/products-list' },
                {
                  key: 2,
                  title: 'Cadastrar Produto',
                  link: '/register-product',
                },
              ]}
            />
          </details>
          <details>
            <summary>Vendas</summary>
            <MenuOptions
              menuItens={[
                { key: 1, title: 'Lista de Vendas', link: '/sales-list' },
                { key: 2, title: 'Cadastrar Venda', link: '/register-sale' },
              ]}
            />
          </details>
          <details>
            <summary>Clientes</summary>
            <MenuOptions
              menuItens={[
                { key: 1, title: 'Lista de Clientes', link: '/costumers-list' },
                {
                  key: 2,
                  title: 'Cadastrar Cliente',
                  link: '/register-stakeholders',
                },
              ]}
            />
          </details>
          <details>
            <summary>Fornecedores</summary>
            <MenuOptions
              menuItens={[
                {
                  key: 1,
                  title: 'Lista de Fornecedores',
                  link: '/providers-list',
                },
                {
                  key: 2,
                  title: 'Cadastrar Fornecedor',
                  link: '/register-stakeholders',
                },
              ]}
            />
          </details>
          <details>
            <summary>Funcionários</summary>
            <MenuOptions
              menuItens={[
                {
                  key: 1,
                  title: 'Lista de Funcionários',
                  link: '/employees-list',
                },
                {
                  key: 2,
                  title: 'Cadastrar Funcionário',
                  link: '/register-stakeholders',
                },
              ]}
            />
          </details>
        </div>
        <div className={style.Options}>
          <h1>Olá, Anna</h1>
          <button
            className={style.MoreOptionsButton}
            onClick={handleLateralMenu}
            type="button"
          >
            Menu
            <RiMenuUnfoldFill />
          </button>
          {openLateralMenu && (
            <LateralMenu handleLateralMenu={handleLateralMenu} />
          )}
        </div>
      </div>
    </div>
  );
}

MenuOptions.propTypes = {
  menuItens: PropTypes.arrayOf(
    PropTypes.shape({ key: String, text: String, link: String })
  ).isRequired,
};
