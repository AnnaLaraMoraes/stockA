/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
// import {
//   MdDeleteForever,
//   MdModeEdit,
// } from 'react-icons/md';
import style from './card.module.scss';

function Card({ data }) {
  console.log(data);
  return (
    <>
      <div className={style.Container}>
        <p>ljbfeskjdbf</p>
      </div>
    </>
  );
}

Card.propTypes = {
  data: PropTypes.objectOf(
    PropTypes.shape({
      _id: PropTypes.string,
      itsPaid: PropTypes.bool,
      clientName: PropTypes.string,
      date: PropTypes.string,
      totalValue: PropTypes.number,
      totalValuePaid: PropTypes.number,
    })
  ).isRequired,
};

export default Card;
