/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { MdDeleteForever, MdModeEdit } from 'react-icons/md';
import style from './card.module.scss';

function Card({ data, handleRemove, handleEdit }) {
  return (
    <>
      <div className={style.Container}>
        <div className={style.Child}>
          <h1>{data.description ? data.description : data.code}</h1>
          <span>{data.categoryLabel}</span>
          <span>{data.code}</span>
          <span
            style={{ color: data.amountStock >= 1 ? '#388E3C' : '#D32F2F' }}
          >
            {data.amountStock >= 1
              ? `${data.amountStock} em estoque`
              : 'Sem estoque'}
          </span>
          <span>{new Date(data.date).toLocaleDateString()}</span>
        </div>
        <div className={style.Child}>
          <div className={style.Buttons}>
            <button
              onClick={() => handleRemove(data._id, data.categoryLabel)}
              on
              style={{ color: '#D32F2F' }}
              type="button"
            >
              <MdDeleteForever />
            </button>
            <button onClick={() => handleEdit(data)} type="button">
              <MdModeEdit />
            </button>
          </div>
          <span>valor de custo: {`R$${data.costValue}`}</span>
          <span className={style.CostSale}>
            valor de venda: {`R$${data.costSale}`}
          </span>
          <span style={{ color: '#388E3C' }}>
            ganho: {`R$${data.costSale - data.costValue}`}
          </span>
        </div>
      </div>
    </>
  );
}

export default Card;
