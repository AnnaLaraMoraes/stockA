import React, { useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { BsSearch } from 'react-icons/bs';
import style from './add-product-to-sale.module.scss';
import emptyImg from '../../static/images/undraw_empty.svg';

export function AddProductToSale({ products, AddNewProduct, HandleModal }) {
  const [prodSelected, setProdSelected] = useState('');
  const [amount, setAmount] = useState(1);
  const [error, setError] = useState('');
  const [productList, setProductList] = useState(products || []);

  const SelectProd = (product) => {
    setProdSelected(product);
  };

  const HandleAddAmount = (amountValue) => {
    setAmount(Number(amountValue));
    if (Number(amountValue) > Number(prodSelected.amountStock)) {
      setError('Quantidade não disponivel em estoque');
    } else {
      setError('');
    }
  };

  const SearchProd = (value) => {
    const productFound = products.filter((prod) => {
      const text = `${prod.category.label} ${prod.code}  ${prod.description} ${prod.costSale}  ${prod.amountStock}`;
      return text.toLowerCase().search(value) >= 0;
    });

    setProductList(productFound);
  };

  return (
    <div
      className={style.ModalContainer}
      onClick={() => (products.length > 0 ? '' : HandleModal())}
    >
      <div className={style.Modal}>
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
        {products.length > 0 ? (
          <>
            <div className={style.SearchButtonContainer}>
              <div className={style.SearchButton}>
                <input
                  autoComplete="off"
                  onChange={(event) => SearchProd(event.target.value)}
                  type="search"
                  placeholder="buscar produto"
                />
                <span>
                  <BsSearch />
                </span>
              </div>
            </div>
            <ul>
              {productList.length > 0 &&
                productList.map((prod) => (
                  <li
                    key={prod._id}
                    className={style.ButtonProductDescription}
                    style={{
                      backgroundColor:
                        prod._id === prodSelected._id
                          ? '#A34672'
                          : 'transparent',
                      color:
                        prod._id === prodSelected._id ? 'white' : '#07002e',
                    }}
                    onClick={() => SelectProd(prod)}
                  >
                    <span>{prod.category.label}</span>
                    <span>{`cod.: ${prod.code}`}</span>
                    <span>{prod.description}</span>
                    <span>{`R$${prod.costSale}`}</span>
                    <span>{`${prod.amountStock} unidade(s)`}</span>
                  </li>
                ))}
            </ul>
            <div className={style.InputAmount}>
              <span>Quantidade</span>
              <input
                autoComplete="off"
                type="number"
                id="amount"
                name="amount"
                min="1"
                value={amount}
                onChange={(event) => HandleAddAmount(event.target.value)}
              />
              <span className={style.ErrorSpan}>{error}</span>
            </div>
            {prodSelected && amount && !error && (
              <button
                className={style.ButtonAddNewProduct}
                type="button"
                onClick={() => AddNewProduct({ ...prodSelected, amount })}
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
