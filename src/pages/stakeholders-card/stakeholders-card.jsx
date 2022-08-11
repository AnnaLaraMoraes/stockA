import React from 'react';
import PropTypes from 'prop-types';
import { MdDeleteForever, MdModeEdit } from 'react-icons/md';
import style from './stakeholders-card.module.scss';

function StackeholdersCard({ data, handleRemove, handleEdit }) {
  return (
    <>
      <div className={style.Container}>
        <div className={style.Child}>
          <h1>{data.name}</h1>
          <span>{data.phone || '-'}</span>
          <span>{data.email || '-'}</span>
          <span>{data.city || '-'}</span>
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
        </div>
      </div>
    </>
  );
}

StackeholdersCard.propTypes = {
  data: PropTypes.objectOf(
    PropTypes.shape({
      city: PropTypes.string,
    })
  ).isRequired,
  handleRemove: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
};

export default StackeholdersCard;
