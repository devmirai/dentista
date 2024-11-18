import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Typography } from 'antd';
import IndexTable from '../components/IndexTable';
import '../index.css';

const { Header, Footer, Content } = Layout;
const { Title } = Typography;

const Index: React.FC = () => {
  return (
    <Layout className="app-container">
      <Header>
        <Title level={1} style={{ color: 'white' }}>Clínica Dental - Tabla de pacientes</Title>
      </Header>
              <img src="https://i.gifer.com/SU1.gif" />

      <Content style={{ padding: '20px' }}>
        <IndexTable />
      </Content>
      <Footer>
        <p>Gracias por todo Copilot</p>
      </Footer>
    </Layout>
  );
};

ReactDOM.render(<Index />, document.getElementById('root'));

export default Index;