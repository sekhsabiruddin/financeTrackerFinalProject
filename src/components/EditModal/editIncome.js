import React, { useEffect } from "react";
import { Button, Modal, Form, Input, DatePicker, Select } from "antd";
const { Option } = Select;

const EditIncomeModal = ({ visible, onCancel, singleData, onFinish }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      name: singleData.name,
      amount: singleData.amount,

      tag: singleData.tag,
    });
  }, [form, singleData]);

  //handelFinish function
  const handleFinish = async (values) => {
    try {
      values.id = singleData.id;
      await onFinish(values, "income");
      form.resetFields();
      onCancel();
    } catch (error) {
      // console.log("Failed to update income");
    }
  };

  return (
    <Modal
      style={{ fontWeight: 600 }}
      title="Edit Income"
      visible={visible}
      onCancel={onCancel}
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

        <Form.Item
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
            Update Income
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditIncomeModal;
