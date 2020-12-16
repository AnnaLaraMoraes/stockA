import React from 'react';
import { FaEllipsisV } from 'react-icons/fa';

import style from './header.module.scss';

function Header() {
  return (
    <div className={style.Container}>
      <div className={style.Header}>
        <p className={style.Avatar}>A</p>
        <p className={style.Name}>Anna</p>
        <button
          className={style.ButtonIcon}
          type="button"
          onClick={() => console.log('click')}
        >
          <FaEllipsisV />
        </button>
      </div>
      <div className={style.Menu}>oi</div>
    </div>
  );
}

export default Header;
