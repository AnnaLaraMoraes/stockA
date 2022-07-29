import React from 'react';
import PropTypes from 'prop-types';
import { AiFillCloseCircle } from 'react-icons/ai';
import style from './modal.module.scss';

function Modal({ title, handleModal, children }) {
  return (
    <div className={style.ModalContainer}>
      <div className={style.Modal}>
        <header className={style.Header}>
          <button type="button" onClick={handleModal}>
            <AiFillCloseCircle />
          </button>
          <h1>
            <strong>{title}</strong>
          </h1>
        </header>
        {children}
      </div>
    </div>
  );
}

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  handleModal: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
