import React, { useState } from "react";
import { Provider } from "react-redux";
import { Layout, Menu } from "antd";
import store from "./redux/store";
import CustomerForm from "./components/CustomerForm";
import CustomerList from "./components/CustomerList";

const { Header, Content } = Layout;

function App() {
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  return (
    <Provider store={store}>
      <Layout>
        <Header>
          <Menu theme="dark" mode="horizontal">
            <Menu.Item key="1" onClick={() => setShowForm(true)}>
              Add Customer
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "50px" }}>
          {showForm ? (
            <CustomerForm
              customer={editingCustomer}
              onFormSubmit={handleFormSubmit}
            />
          ) : (
            <CustomerList onEdit={handleEdit} />
          )}
        </Content>
      </Layout>
    </Provider>
  );
}

export default App;
