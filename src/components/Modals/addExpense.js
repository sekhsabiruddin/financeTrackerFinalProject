import React from "react";
import { Button, Modal, Form, Input, DatePicker, Select, message } from "antd";

const { Option } = Select;

function AddExpense({
  isExpenseModalVisible,
  handleExpenseCancel,
  onFinish,
  fetchTransactions,
}) {
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    try {
      await onFinish(values, "expense");
      form.resetFields();
      handleExpenseCancel();

      message.success("Expense added successfully.");
    } catch (error) {
      message.error("Failed to add expense.");
    }
  };

  return (
    <div>
      <Modal
        style={{ fontWeight: 600 }}
        title="Add Expense"
        visible={isExpenseModalVisible}
        onCancel={handleExpenseCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
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
          <Form.Item
            name="amount"
            label="Amount"
            rules={[
              {
                required: true,
                message: "Please enter the expense amount",
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
            <Select placeholder="Select category">
              <Option value="food">Food</Option>
              <Option value="transportation">Transportation</Option>
              <Option value="housing">Housing</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button className="btn btn-blue" type="primary" htmlType="submit">
              Add Expense
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AddExpense;
