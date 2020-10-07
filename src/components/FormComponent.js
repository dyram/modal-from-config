import React, { useState } from "react";
import { Form, Button } from "antd";
import FormBuilder from "antd-form-builder";
import { MessageBus } from "../MessageBus.js";

const FormComponent = ({ config }) => {
  const [form] = Form.useForm();
  const { id } = config;
  const { layout, formMeta, submitDefault, subjects } = config.params;
  const [initialValues, setInitialValues] = useState(
    formMeta.initialValues || {}
  );

  const handleSubmit = (values) => {
    setInitialValues(values);
    subjects.onSubmit.forEach((sub) => {
      console.log(
        "Sending Form Data for id : " + id + " Sub : " + sub + " values : ",
        values
      );
      MessageBus.send(sub, values);
    });
  };

  const onSubmit = () => {
    handleSubmit(form.getFieldsValue());
  };

  function addSubmitButton() {
    if (submitDefault) {
      return (
        <Form.Item className="form-footer">
          <Button htmlType="submit" type="primary">
            Submit
          </Button>
        </Form.Item>
      );
    } else {
      return <div></div>;
    }
  }

  if (subjects?.submitEvent) {
    MessageBus.subscribe(id, subjects.submitEvent, onSubmit);
  }

  formMeta.initialValues = initialValues;

  return (
    <div>
      <Form
        form={form}
        layout={layout}
        onFinish={submitDefault ? handleSubmit : undefined}
      >
        <FormBuilder meta={formMeta} form={form} />
        {addSubmitButton()}
      </Form>
    </div>
  );
};

export default FormComponent;
