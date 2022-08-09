/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  MdDeleteForever,
  MdModeEdit,
  MdOutlineAddCircle,
  MdDoneAll,
  MdRemoveDone,
} from 'react-icons/md';
import { AiOutlinePlus } from 'react-icons/ai';
import style from './card.module.scss';
import Modal from '../../../components/modal';
import Button from '../../../components/button';
import Input from '../../../components/input';

function Card({
  data,
  index,
  onButtonClick,
  inputPaymentRef,
  inputDataRef,
  handleEdit,
  handleRemove,
}) {
  const [openModal, setOpenModal] = useState(false);
  const handleModal = () => {
    setOpenModal(!openModal);
  };
  return (
    <>
      {openModal && (
        <Modal handleModal={handleModal} title="Adicionar pagamento">
          <div className={style.AddPayment}>
            <Input
              text="Valor"
              register={(el) => {
                inputPaymentRef.current[index] = el;
                return el;
              }}
              type="number"
              min="0"
            />

            <Input
              text="Data "
              register={(el) => {
                inputDataRef.current[index] = el;
                return el;
              }}
              type="date"
            />

            <Button
              text="Adicionar pagamento a venda"
              onClick={() => onButtonClick(data._id, index, handleModal)}
            />
          </div>
        </Modal>
      )}
      <div className={style.Container}>
        <div className={style.Child}>
          <span
            style={{ color: data.itsPaid ? '#388E3C' : '#D32F2F' }}
            className={style.Status}
          >
            {data.itsPaid ? <MdDoneAll /> : <MdRemoveDone />}
            {data.itsPaid ? 'Pago' : 'Não pago'}
          </span>
          <h1>{data.clientName}</h1>
          <button type="button" onClick={handleModal}>
            Adicionar pagamento
            <MdOutlineAddCircle />
          </button>
          <span>{new Date(data.date).toLocaleDateString()}</span>
        </div>
        <div className={style.Child}>
          <h1>{`R$${data?.totalValue}`}</h1>
          <h2 className={style.AddMoreMoney}>
            {`R$${data?.totalValuePaid}`} <AiOutlinePlus />
          </h2>
          <div className={style.Buttons}>
            <button
              onClick={() => handleEdit(data)}
              style={{ marginRight: 16 }}
              type="button"
            >
              <MdModeEdit />
            </button>
            <button
              onClick={() => handleRemove(data._id)}
              style={{ color: '#D32F2F' }}
              type="button"
            >
              <MdDeleteForever />
            </button>
          </div>
        </div>
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
  onButtonClick: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  inputDataRef: PropTypes.instanceOf(Element).isRequired,
  inputPaymentRef: PropTypes.instanceOf(Element).isRequired,
  handleEdit: PropTypes.number.isRequired,
  handleRemove: PropTypes.number.isRequired,
};

export default Card;
