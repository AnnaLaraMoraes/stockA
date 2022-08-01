import React from 'react';
import PropTypes from 'prop-types';
import { BsFileEarmarkBarGraph } from 'react-icons/bs';
import { FaBoxes, FaIdBadge, FaUserTag } from 'react-icons/fa';
import { ImBoxAdd } from 'react-icons/im';
import { MdPointOfSale } from 'react-icons/md';
import { GiMoneyStack } from 'react-icons/gi';
import { RiUserHeartLine, RiUserAddLine, RiMenuFoldFill } from 'react-icons/ri';

import { Link } from 'react-router-dom';
import style from './lateral-menu.module.scss';

export function LateralMenu({ handleLateralMenu }) {
  return (
    <div className={style.Container}>
      <div className={style.LinksContainer}>
        <button
          type="button"
          className={style.CloseButton}
          onClick={handleLateralMenu}
        >
          <RiMenuFoldFill />
        </button>
        <Link
          onClick={handleLateralMenu}
          className={style.Link}
          to="/dashboard"
        >
          <BsFileEarmarkBarGraph />
          Dashboard
        </Link>
        <Link
          onClick={handleLateralMenu}
          className={style.Link}
          to="/products-list"
        >
          <FaBoxes />
          Produtos
        </Link>
        <Link
          onClick={handleLateralMenu}
          className={style.Link}
          to="/register-product"
        >
          <ImBoxAdd />
          Cadastrar Produto
        </Link>
        <Link
          onClick={handleLateralMenu}
          className={style.Link}
          to="/sales-list"
        >
          <GiMoneyStack />
          Vendas
        </Link>
        <Link
          onClick={handleLateralMenu}
          className={style.Link}
          to="/register-sale"
        >
          <MdPointOfSale />
          Cadastrar Venda
        </Link>
        <Link
          onClick={handleLateralMenu}
          className={style.Link}
          to="/register-stakeholders"
        >
          <RiUserAddLine />
          Cadastrar Pessoa
        </Link>
        <Link
          onClick={handleLateralMenu}
          className={style.Link}
          to="/costumers-list"
        >
          <RiUserHeartLine />
          Clientes
        </Link>
        <Link
          onClick={handleLateralMenu}
          className={style.Link}
          to="/providers-list"
        >
          <FaUserTag />
          Fornecedores
        </Link>
        <Link
          onClick={handleLateralMenu}
          className={style.Link}
          to="/employees-list"
        >
          <FaIdBadge />
          Funcionários
        </Link>
      </div>
    </div>
  );
}

LateralMenu.propTypes = {
  handleLateralMenu: PropTypes.func.isRequired,
};
