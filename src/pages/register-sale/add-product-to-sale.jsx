import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AiFillCloseCircle } from 'react-icons/ai';
import style from './add-product-to-sale.jsx.module.scss';

export function AddProductToSale({ products, AddNewProduct, HandleModal }) {
  const [prodSelected, setProdSelected] = useState('');
  const [prodAmount, setProdAmount] = useState(1);

  const SelectProd = (product) => {
    setProdSelected(product);
  };

  return (
    <div className={style.ModalContainer}>
      <div className={style.Modal}>
        <header className={style.Header}>
          <button type="button" onClick={HandleModal}>
            <AiFillCloseCircle />
          </button>
          <h1>
            <strong>Selecione um produto na venda</strong>
          </h1>
        </header>
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
            onChange={(event) => setProdAmount(event.target.value)}
          />
        </div>
        {prodSelected && prodAmount && (
          <button
            className={style.ButtonAddNewProduct}
            type="button"
            onClick={() => AddNewProduct({ prodSelected, prodAmount })}
          >
            Adicionar +
          </button>
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
