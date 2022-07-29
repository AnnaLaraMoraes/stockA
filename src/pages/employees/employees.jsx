import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { MdDeleteForever, MdModeEdit } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import Layout from '../layouts';
import api from '../../services/api';
import Loader from '../components/loading';

import style from './employees.module.scss';

function Employees() {
  const history = useHistory();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const findEmployees = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/stakeholders', {
        params: {
          type: 'employee',
        },
      });

      setEmployees(data && data.data ? data.data : []);
      setLoading(false);
    } catch (error) {
      toast.error(
        'Erro ao buscar funcionários, por favor atualize a página ou tente mais tarde'
      );
    }
  };

  useEffect(() => {
    findEmployees();
  }, []);

  const handleEdit = (dataEdit) => {
    history.push('/register-stakeholders', {
      dataEdit,
      urlToReturn: '/employees-list',
    });
  };

  const handleRemove = async (idRemove, name) => {
    await api.put(`/stakeholders/${idRemove}`, { isActive: false });
    toast.success(`O funcionário ${name} foi deletado com sucesso!`);
    findEmployees();
  };

  return (
    <Layout>
      <Layout.Content title="Funcionários">
        <ToastContainer />
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div className={style.Loader}>
              <Loader />
            </div>
          ) : (
            <table>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Editar</th>
                <th>Exluir</th>
              </tr>

              {employees.length > 0 &&
                employees
                  .filter((employee) => employee.isActive)
                  .map((employee) => (
                    <tr key={employee._id}>
                      <td>{employee.name || '-'}</td>
                      <td>{employee.phone || '-'}</td>
                      <td>{employee.email || '-'}</td>
                      <td>
                        <button
                          onClick={() => handleEdit(employee)}
                          type="button"
                        >
                          <MdModeEdit className={style.EditButton} />
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            handleRemove(employee._id, employee.name)
                          }
                          type="button"
                        >
                          <MdDeleteForever className={style.DeleteButton} />
                        </button>
                      </td>
                    </tr>
                  ))}
            </table>
          )}
        </div>
      </Layout.Content>
    </Layout>
  );
}

export default Employees;
