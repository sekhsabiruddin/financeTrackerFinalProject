import React from "react";
import { Button, Modal, Form, Input, DatePicker, Select, message } from "antd";
const { Option } = Select;
function AddIncome({ isIncomeModalVisible, handleIncomeCancel, onFinish }) {
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    try {
      await onFinish(values, "income");
      form.resetFields();
      handleIncomeCancel();
      message.success("Income added successfully.");
    } catch (error) {
      message.error("Failed to add income.");
    }
  };

  return (
    <Modal
      style={{ fontWeight: 600 }}
      title="Add Income"
      visible={isIncomeModalVisible}
      onCancel={handleIncomeCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          style={{ fontWeight: 600 }}
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: "Please input the name of the transaction",
            },
          ]}
        >
          <Input type="text" className="custom-input" />
        </Form.Item>

        {/* <Form.Item
          style={{ fontWeight: 600 }}
          name="amount"
          label="Amount"
          rules={[
            {
              required: true,
              message: "Please input the name of the transaction",
            },
          ]}
        >
          <Input type="text" className="custom-input" />
        </Form.Item> */}

        <Form.Item
          name="amount"
          label="Amount"
          rules={[
            {
              required: true,
              message: "Please enter the income amount",
            },
          ]}
        >
          <Input type="number" min={0} step={0.01} />
        </Form.Item>

        <Form.Item
          name="date"
          label="Date"
          rules={[
            {
              required: true,
              message: "Please select the date",
            },
          ]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="tag"
          label="Tag"
          rules={[
            {
              required: true,
              message: "Please select the expense category",
            },
          ]}
        >
          <Select placeholder="Select category" className="select-input-2">
            <Option value="salary">Salary</Option>
            <Option value="freelance">Freelance</Option>
            <Option value="investment">Investment</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button className="btn btn-blue" type="primary" htmlType="submit">
            Add Income
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
export default AddIncome;
