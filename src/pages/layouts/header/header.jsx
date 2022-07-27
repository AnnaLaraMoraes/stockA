import React from 'react';
// import {
//   FaMoneyBillAlt,
//   FaBoxes,
//   FaIdBadge,
//   FaUserTag,
//   FaUsers,
//   FaUserPlus,
//   // FaListUl,
//   // FaDollarSign,
// } from 'react-icons/fa';
// import { MdDashboard } from 'react-icons/md';
// import { RiInboxUnarchiveFill } from 'react-icons/ri';
// import { AiOutlineMenuUnfold, AiOutlineMenuFold } from 'react-icons/ai';
// import { GiPartyPopper } from 'react-icons/gi';
// import { Link } from 'react-router-dom';
// import logoImg from '../../../static/images/logo.png';

import style from './header.module.scss';

function Header() {
  // const [showMenu, setShowMenu] = useState(true);
  // const [title, setTitle] = useState('');

  return (
    <div className={style.Container}>
      {/* <div className={style.Header}>
        <div className={style.ButtonOpenMenu}>
          {!showMenu && (
            <>
              <button type="button" onClick={() => setShowMenu(true)}>
                <AiOutlineMenuUnfold size={26} />
              </button>
              <p>Menu</p>
            </>
          )}
        </div>
        <div className={style.PageTitle}>
          <p>{title}</p>
        </div>
        <div className={style.Text}>
          <p className={style.Avatar}>A</p>
          <p className={style.Name}>Anna</p>
        </div>
      </div>
      {showMenu && (
        <div className={style.Menu}>
          <div className={style.ButtonCloseMenu}>
            <img className={style.LogoImg} src={logoImg} alt="Footer Action" />
            <button type="button" onClick={() => setShowMenu(false)}>
              <AiOutlineMenuFold size={26} />
            </button>
          </div>
          <div className={style.MenuItens}>
            <Link style={{ textDecoration: 'none' }} to="/dashboard">
              <div className={style.MenuItem}>
                <button type="button" onClick={() => setTitle('Dashboard')}>
                  <MdDashboard size={26} className={style.MenuIcon} />
                  <p>Dashboard</p>
                </button>
              </div>
            </Link>
            <div className={style.Divider} />
            <Link style={{ textDecoration: 'none' }} to="/products-list">
              <div className={style.MenuItem}>
                <button type="button" onClick={() => setTitle('Produtos')}>
                  <FaBoxes size={26} className={style.MenuIcon} />
                  <p>Produtos</p>
                </button>
              </div>
            </Link>
            <Link style={{ textDecoration: 'none' }} to="/register-product">
              <div className={style.MenuItem}>
                <button
                  type="button"
                  onClick={() => setTitle('Cadastrar Produto')}
                >
                  <RiInboxUnarchiveFill size={26} className={style.MenuIcon} />
                  <p>Cadastrar Produto</p>
                </button>
              </div>
            </Link>
            <div className={style.Divider} />
            <Link style={{ textDecoration: 'none' }} to="/sales-list">
              <div className={style.MenuItem}>
                <button type="button" onClick={() => setTitle('Vendas')}>
                  <GiPartyPopper size={26} className={style.MenuIcon} />
                  <p>Vendas</p>
                </button>
              </div>
            </Link>
            <Link style={{ textDecoration: 'none' }} to="/register-sale">
              <div className={style.MenuItem}>
                <button
                  type="button"
                  onClick={() => setTitle('Vender Produto')}
                >
                  <FaMoneyBillAlt size={26} className={style.MenuIcon} />
                  <p>Cadastrar Venda</p>
                </button>
              </div>
            </Link>
            <div className={style.Divider} />
            <Link
              style={{ textDecoration: 'none' }}
              to="/register-stakeholders"
            >
              <div className={style.MenuItem}>
                <button
                  type="button"
                  onClick={() => setTitle('Cadastrar Pessoa')}
                >
                  <FaUserPlus size={26} className={style.MenuIcon} />
                  <p>Cadastrar pessoa</p>
                </button>
              </div>
            </Link>
            <Link style={{ textDecoration: 'none' }} to="/employees-list">
              <div className={style.MenuItem}>
                <button type="button" onClick={() => setTitle('Funcionários')}>
                  <FaIdBadge size={26} className={style.MenuIcon} />
                  <p>Funcionários</p>
                </button>
              </div>
            </Link>
            <Link style={{ textDecoration: 'none' }} to="/providers-list">
              <div className={style.MenuItem}>
                <button type="button" onClick={() => setTitle('Fornecedores')}>
                  <FaUserTag size={26} className={style.MenuIcon} />
                  <p>Fornecedores</p>
                </button>
              </div>
            </Link>
            <Link style={{ textDecoration: 'none' }} to="/costumers-list">
              <div className={style.MenuItem}>
                <button type="button" onClick={() => setTitle('Clientes')}>
                  <FaUsers size={26} className={style.MenuIcon} />
                  <p>Clientes</p>
                </button>
              </div>
            </Link> */}
      {/* <Link style={{ textDecoration: 'none' }} to="/dashboard">
              <div className={style.MenuItem}>
                <button type="button">
                  <FaListUl size={26} className={style.MenuIcon} />
                  <p>Relatórios</p>
                </button>
              </div>
            </Link> */}
      {/* <Link style={{ textDecoration: 'none' }} to="/dashboard">
              <div className={style.MenuItem}>
                <button type="button" onClick={() => setTitle('Financeiro')}>
                  <FaDollarSign size={26} className={style.MenuIcon} />
                  <p>Financeiro</p>
                </button>
              </div>
            </Link> */}
      {/* </div>
        </div>
      )} */}
      {}
    </div>
  );
}

export default Header;
