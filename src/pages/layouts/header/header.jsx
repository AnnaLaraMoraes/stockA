import React, { useState, useReducer } from 'react';
import PropTypes from 'prop-types';
import { RiMenuUnfoldFill } from 'react-icons/ri';
import { FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import style from './header.module.scss';
import Logo from '../../../static/images/logo.png';
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

const initialState = {
  element1: false,
  element2: false,
  element3: false,
  element4: false,
  element5: false,
};

function reducer(state, action) {
  switch (action.element) {
    case 'element1':
      return { element1: !state.element1 };
    case 'element2':
      return { element2: !state.element2 };
    case 'element3':
      return { element3: !state.element3 };
    case 'element4':
      return { element4: !state.element4 };
    case 'element5':
      return { element5: !state.element5 };
    default:
      throw new Error();
  }
}

export function Header({ showMenu }) {
  const [openLateralMenu, setOpenLateralMenu] = useState(false);

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleLateralMenu = () => {
    setOpenLateralMenu(!openLateralMenu);
  };

  return (
    <div className={style.Container}>
      <div className={style.ChildContainer}>
        <Link to={showMenu ? '/dashboard' : '/'}>
          <img src={Logo} alt="" />{' '}
        </Link>
        {showMenu ? (
          <>
            <div className={style.Menu}>
              <Link className={style.Link} to="./dashboard">
                Dashboard
              </Link>
              <details
                open={state.element1}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch({ element: 'element1' });
                }}
              >
                <summary>Produtos</summary>
                <MenuOptions
                  menuItens={[
                    {
                      key: 1,
                      title: 'Lista de Produtos',
                      link: '/products-list',
                    },
                    {
                      key: 2,
                      title: 'Cadastrar Produto',
                      link: '/register-product',
                    },
                  ]}
                />
              </details>
              <details
                open={state.element2}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch({ element: 'element2' });
                }}
              >
                <summary>Vendas</summary>
                <MenuOptions
                  menuItens={[
                    { key: 1, title: 'Lista de Vendas', link: '/sales-list' },
                    {
                      key: 2,
                      title: 'Cadastrar Venda',
                      link: '/register-sale',
                    },
                  ]}
                />
              </details>
              <details
                open={state.element3}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch({ element: 'element3' });
                }}
              >
                <summary>Clientes</summary>
                <MenuOptions
                  menuItens={[
                    {
                      key: 1,
                      title: 'Lista de Clientes',
                      link: '/costumers-list',
                    },
                    {
                      key: 2,
                      title: 'Cadastrar Cliente',
                      link: '/register-stakeholders',
                    },
                  ]}
                />
              </details>
              <details
                open={state.element4}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch({ element: 'element4' });
                }}
              >
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
              <details
                open={state.element5}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch({ element: 'element5' });
                }}
              >
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
          </>
        ) : (
          <div className={style.HeaderMenuNewUser}>
            <Link className={style.Link} to="/create-account">
              Cadastrar
            </Link>
            <Link className={style.Login} to="/login">
              Login
              <FiLogIn />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

MenuOptions.propTypes = {
  menuItens: PropTypes.arrayOf(
    PropTypes.shape({ key: String, text: String, link: String })
  ).isRequired,
};

Header.propTypes = {
  showMenu: PropTypes.string.isRequired,
};
