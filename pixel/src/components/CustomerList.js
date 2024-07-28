import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Space } from "antd";
import { deleteCustomer } from "../redux/customerSlice";

const CustomerList = ({ onEdit }) => {
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customers.customers);

  const handleDelete = (id) => {
    dispatch(deleteCustomer(id));
  };

  const columns = [
    { title: "PAN", dataIndex: "pan", key: "pan" },
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Mobile", dataIndex: "mobile", key: "mobile" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => onEdit(record)}>Edit</Button>
          <Button onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return <Table dataSource={customers} columns={columns} rowKey="id" />;
};

export default CustomerList;
