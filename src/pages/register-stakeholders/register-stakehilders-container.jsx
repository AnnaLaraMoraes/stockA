import React from 'react';
import Layout from '../layouts';
import RegisterStakeholders from './register-stakeholders';

function RegisterStakeholdersContainer() {
  return (
    <Layout>
      <Layout.Content title="Cadastrar Pessoa">
        <RegisterStakeholders />
      </Layout.Content>
    </Layout>
  );
}

export default RegisterStakeholdersContainer;
