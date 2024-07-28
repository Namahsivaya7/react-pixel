import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, Space, Select } from 'antd';
import axios from 'axios';
import { addCustomer, updateCustomer } from '../redux/customerSlice';
import { LoadingOutlined } from '@ant-design/icons';

const { Option } = Select;

const CustomerForm = ({ customer, onFormSubmit }) => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [addresses, setAddresses] = useState(customer ? customer.addresses : [{}]);
  const [loading, setLoading] = useState(false);
  const [panLoading, setPanLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (customer) {
      setIsEditing(true);
      form.setFieldsValue(customer);
    }
  }, [customer, form]);

  const handlePANValidation = async (pan) => {
    if (pan.length === 10) {
      setPanLoading(true);
      try {
        const response = await (`http://localhost:3001`).post('https://lab.pixel6.co/api/verify-pan.php', { panNumber: pan });
        if (response.data.status === 'Success' && response.data.isValid) {
          form.setFieldsValue({ fullName: response.data.fullName });
        }
      } catch (error) {
        console.error('PAN validation failed:', error);
      }
      setPanLoading(false);
    }
  };

  const handlePostcodeValidation = async (postcode, index) => {
    if (postcode.length === 6 && /^\d+$/.test(postcode)) {
      setLoading(true);
      try {
        const response = await axios.post('https://lab.pixel6.co/api/get-postcode-details.php', { postcode });
        if (response.data.status === 'Success') {
          const updatedAddresses = [...addresses];
          updatedAddresses[index] = {
            ...updatedAddresses[index],
            city: response.data.city[0].name,
            state: response.data.state[0].name,
          };
          setAddresses(updatedAddresses);
        }
      } catch (error) {
        console.error('Postcode validation failed:', error);
      }
      setLoading(false);
    }
  };

  const onFinish = (values) => {
    const payload = { ...values, addresses };
    if (isEditing) {
      dispatch(updateCustomer(payload));
    } else {
      dispatch(addCustomer({ ...payload, id: Date.now() }));
    }
    onFormSubmit();
  };

  const addAddress = () => {
    setAddresses([...addresses, {}]);
  };

  const removeAddress = (index) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="pan"
        label="PAN"
        rules={[
          { required: true, message: 'Please enter PAN' },
          { pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: 'Invalid PAN format' },
        ]}
      >
        <Input onChange={(e) => handlePANValidation(e.target.value)} suffix={panLoading ? <LoadingOutlined /> : null} />
      </Form.Item>

      <Form.Item
        name="fullName"
        label="Full Name"
        rules={[
          { required: true, message: 'Please enter full name' },
          { max: 140, message: 'Full name cannot exceed 140 characters' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please enter email' },
          { type: 'email', message: 'Invalid email format' },
          { max: 255, message: 'Email cannot exceed 255 characters' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="mobile"
        label="Mobile Number"
        rules={[
          { required: true, message: 'Please enter mobile number' },
          { pattern: /^\d{10}$/, message: 'Invalid mobile number format' },
        ]}
      >
        <Input addonBefore="+91" />
      </Form.Item>

      {addresses.map((address, index) => (
        <Space key={index} direction="vertical">
          <Form.Item
            name={['addresses', index, 'addressLine1']}
            label="Address Line 1"
            rules={[{ required: true, message: 'Please enter address line 1' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name={['addresses', index, 'addressLine2']} label="Address Line 2">
            <Input />
          </Form.Item>

          <Form.Item
            name={['addresses', index, 'postcode']}
            label="Postcode"
            rules={[
              { required: true, message: 'Please enter postcode' },
              { pattern: /^\d{6}$/, message: 'Invalid postcode format' },
            ]}
          >
            <Input onChange={(e) => handlePostcodeValidation(e.target.value, index)} suffix={loading ? <LoadingOutlined /> : null} />
          </Form.Item>

          <Form.Item name={['addresses', index, 'state']} label="State">
            <Select disabled>
              {address.state && <Option value={address.state}>{address.state}</Option>}
            </Select>
          </Form.Item>

          <Form.Item name={['addresses', index, 'city']} label="City">
            <Select disabled>
              {address.city && <Option value={address.city}>{address.city}</Option>}
            </Select>
          </Form.Item>

          <Button type="danger" onClick={() => removeAddress(index)}>Remove Address</Button>
        </Space>
      ))}

      {addresses.length < 10 && <Button onClick={addAddress}>Add Address</Button>}

      <Button type="primary" htmlType="submit">Submit</Button>
    </Form>
  );
};

export default CustomerForm;
