import React, { useEffect } from "react";
import { Button, Modal, Form, Input, DatePicker, Select } from "antd";
const { Option } = Select;

const EditExpenseModal = ({ visible, onCancel, singleData }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      name: singleData?.name,
      amount: singleData?.amount,

      tag: singleData?.tag,
    });
  }, [form, singleData]);

  const onFinish = (values) => {
    console.log("Form values:", values);
    // Perform the necessary logic for updating the expense transaction
    // ...
    onCancel(); // Close the modal after updating
  };

  return (
    <Modal
      style={{ fontWeight: 600 }}
      title="Edit Expense"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
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

        <Form.Item
          style={{ fontWeight: 600 }}
          name="amount"
          label="Amount"
          rules={[
            {
              required: true,
              message: "Please input the amount of the transaction",
            },
          ]}
        >
          <Input type="number" min={0} step={0.01} className="custom-input" />
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
            <Option value="food">Food</Option>
            <Option value="transportation">Transportation</Option>
            <Option value="housing">Housing</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button className="btn btn-blue" type="primary" htmlType="submit">
            Update Expense
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditExpenseModal;
