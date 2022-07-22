import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AiFillCloseCircle } from 'react-icons/ai';
import style from './add-product-to-sale.module.scss';
import emptyImg from '../../static/images/undraw_empty.svg';

export function AddProductToSale({ products, AddNewProduct, HandleModal }) {
  const [prodSelected, setProdSelected] = useState('');
  const [prodAmount, setProdAmount] = useState(1);
  const [error, setError] = useState('');

  const SelectProd = (product) => {
    setProdSelected(product);
  };

  const handleAddAmount = (amount) => {
    if (Number(amount) > Number(prodSelected.amountStock)) {
      setError('Quantidade não disponivel em estoque');
      setProdAmount(amount);
    } else {
      setProdAmount(amount);
      setError('');
    }
  };

  return (
    <div
      className={style.ModalContainer}
      onClick={() => (products.length > 0 ? '' : HandleModal())}
    >
      <div className={style.Modal}>
        <div className={style.CloseModalButton}>
          <header className={style.Header}>
            <button type="button" onClick={HandleModal}>
              <AiFillCloseCircle />
            </button>
            <h1>
              <strong>
                {products.length > 0
                  ? 'Adicione um produto na venda'
                  : 'Não existem produtos'}
              </strong>
            </h1>
          </header>
        </div>
        {products.length > 0 ? (
          <>
            <ul>
              {products.length > 0 &&
                products.map((prod) => (
                  <li key={prod.value}>
                    <button
                      className={
                        prod.value === prodSelected.value
                          ? style.ButtonProductDescriptionSelected
                          : style.ButtonProductDescription
                      }
                      type="button"
                      onClick={() => SelectProd(prod)}
                    >
                      {prod.text}
                    </button>
                  </li>
                ))}
            </ul>
            <div className={style.InputAmount}>
              <span>Quantidade</span>
              <input
                type="number"
                id="amount"
                name="amount"
                min="1"
                value={prodAmount}
                onChange={(event) => handleAddAmount(event.target.value)}
              />
              <span className={style.ErrorSpan}>{error}</span>
            </div>
            {prodSelected && prodAmount && !error && (
              <button
                className={style.ButtonAddNewProduct}
                type="button"
                onClick={() => AddNewProduct({ prodSelected, prodAmount })}
              >
                Adicionar +
              </button>
            )}
          </>
        ) : (
          <img
            className={style.Emptyimg}
            alt="Não existem produtos"
            src={emptyImg}
          />
        )}
      </div>
    </div>
  );
}

AddProductToSale.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({ value: String, text: String })),
  AddNewProduct: PropTypes.func,
  HandleModal: PropTypes.func,
};

AddProductToSale.defaultProps = {
  products: [{ value: '', text: '' }],
  AddNewProduct: () => {},
  HandleModal: () => {},
};
