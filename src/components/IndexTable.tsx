import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Input, Form, DatePicker, Modal, Space } from 'antd';
import moment from 'moment';

interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  telefono: string;
}

const IndexTable: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    axios.get('/clinicadental/pacientes')
      .then(response => {
        setPacientes(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleAddPaciente = (values: Omit<Paciente, 'id'>) => {
    const newPaciente = { ...values, fechaNacimiento: values.fechaNacimiento.format('YYYY-MM-DD') };
    axios.post('/clinicadental/pacientes', newPaciente)
      .then(response => {
        setPacientes([...pacientes, response.data]);
        form.resetFields();
        setIsModalVisible(false);
      })
      .catch(error => {
        console.error('Error adding paciente:', error);
      });
  };

  const handleEditPaciente = (id: number) => {
    const paciente = pacientes.find(p => p.id === id);
    if (paciente) {
      form.setFieldsValue({ ...paciente, fechaNacimiento: moment(paciente.fechaNacimiento) });
      setEditingId(id);
      setIsModalVisible(true);
    }
  };

  const handleUpdatePaciente = (values: Omit<Paciente, 'id'>) => {
    const updatedPaciente = { ...values, fechaNacimiento: values.fechaNacimiento.format('YYYY-MM-DD') };
    axios.put(`/clinicadental/pacientes/${editingId}`, updatedPaciente)
      .then(response => {
        setPacientes(pacientes.map(p => (p.id === editingId ? response.data : p)));
        form.resetFields();
        setEditingId(null);
        setIsModalVisible(false);
      })
      .catch(error => {
        console.error('Error updating paciente:', error);
      });
  };

  const handleDeletePaciente = (id: number) => {
    axios.delete(`/clinicadental/pacientes/${id}`)
      .then(() => {
        setPacientes(pacientes.filter(p => p.id !== id));
      })
      .catch(error => {
        console.error('Error deleting paciente:', error);
      });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Apellido', dataIndex: 'apellido', key: 'apellido' },
    { title: 'Fecha de Nacimiento', dataIndex: 'fechaNacimiento', key: 'fechaNacimiento' },
    { title: 'Teléfono', dataIndex: 'telefono', key: 'telefono' },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (text: any, record: Paciente) => (
        <Space>
          <Button type="primary" onClick={() => handleEditPaciente(record.id)}>Editar</Button>
          <Button type="primary" danger onClick={() => handleDeletePaciente(record.id)}>Eliminar</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Añadir Paciente
      </Button>
      <Modal
        title={editingId ? 'Editar Paciente' : 'Añadir Paciente'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={editingId ? handleUpdatePaciente : handleAddPaciente}>
          <Form.Item name="nombre" rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}>
            <Input placeholder="Nombre" />
          </Form.Item>
          <Form.Item name="apellido" rules={[{ required: true, message: 'Por favor ingrese el apellido' }]}>
            <Input placeholder="Apellido" />
          </Form.Item>
          <Form.Item name="fechaNacimiento" rules={[{ required: true, message: 'Por favor ingrese la fecha de nacimiento' }]}>
            <DatePicker placeholder="Fecha de Nacimiento" format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="telefono" rules={[{ required: true, message: 'Por favor ingrese el teléfono' }]}>
            <Input placeholder="Teléfono" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingId ? 'Actualizar' : 'Añadir'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Table dataSource={pacientes} columns={columns} rowKey="id" />
    </div>
  );
};

export default IndexTable;