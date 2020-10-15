import React, { useState, useEffect } from "react";
import { Button, Modal, Typography, Alert, Select } from "antd";
import * as AntIcons from "@ant-design/icons";
import { MessageBus } from "../MessageBus.js";
import { getComponentForProps } from "../Helper";

export default function UnlockDeviceModal({ config }) {
  const { id } = config;
  const {
    doneEvent,
    modalTitle,
    modalText,
    maskClosable,
    buttons,
    data,
  } = config.params;
  const {
    hasIntermediary,
    intermediaryEvent,
    intermediaryEventName,
    intermediarySuccessMessage,
    intermediaryErrorMessage,
  } = config.params.intermediaryDetails;
  const { triggerIcon, triggerText, size } = config.params.triggerDetails;
  const { Title, Text } = Typography;
  const { Option } = Select;

  const [visible, setVisible] = useState(false);
  const [intermediaryDone, setIntermediaryDone] = useState(false);
  const [intermediaryError, setIntermediaryError] = useState(false);
  const [selectedData, setSelectedData] = useState(undefined);

  const openModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
    setIntermediaryDone(false);
    setIntermediaryError(false);
    setSelectedData(undefined);
  };

  const handleSubmit = () => {
    console.log("DONE");
    closeModal();
  };

  const intermediaryFn = () => {
    console.log("Code sent");
    setIntermediaryDone(true);

    // FOR ERROR CASE PUT THIS IN AN IF BLOCK
    // setIntermediaryError(true);
    // setIntermediaryDone(false);
  };

  const getButton = (type) => {
    let buttonNeeded = buttons.filter((obj) => obj.identifier === type);
    console.log(type, getComponentForProps("ButtonComponent", buttonNeeded[0]));
    return getComponentForProps("ButtonComponent", buttonNeeded[0]);
  };

  const getIcon = (iconName) => {
    const IconSelected = AntIcons[iconName];
    return <IconSelected />;
  };

  useEffect(() => {
    MessageBus.subscribe(
      id.concat(intermediaryEventName),
      intermediaryEvent,
      intermediaryFn
    );
    MessageBus.subscribe(id.concat("done"), doneEvent, handleSubmit);

    //Unsubscribe On Unmount
    return () => {
      MessageBus.unsubscribe(id.concat(intermediaryEventName));
      MessageBus.unsubscribe(id.concat("done"));

      setVisible(false);
      setIntermediaryDone(false);
    };
  }, []);

  return (
    <>
      <Button type="primary" size={size} onClick={openModal}>
        {getIcon(triggerIcon)}
        {triggerText}
      </Button>
      <Modal
        title={<Title level={5}>{modalTitle}</Title>}
        visible={visible}
        onOk={handleSubmit}
        onCancel={closeModal}
        maskClosable={maskClosable}
        footer={[
          !intermediaryDone && hasIntermediary ? (
            getButton(intermediaryEventName)
          ) : (
            <></>
          ),
          intermediaryDone || !hasIntermediary ? getButton("done") : <></>,
        ]}
      >
        <Text>{modalText}</Text>
        <br />
        <br />
        {data.length > 0 && hasIntermediary && (
          <Select
            onChange={(e) => {
              setSelectedData(e);
            }}
            placeholder="Select a phone number"
            allowClear={true}
            value={selectedData}
          >
            {data.map((options) => (
              <Option value={options.payload}>{options.payload}</Option>
            ))}
          </Select>
        )}
        <br />
        <br />
        {intermediaryDone && (
          <Alert
            message={`${intermediarySuccessMessage} ${selectedData}`}
            type="success"
            showIcon
          />
        )}
        {intermediaryError && (
          <Alert
            message={`${intermediaryErrorMessage} ${selectedData}`}
            type="error"
            showIcon
          />
        )}
      </Modal>
    </>
  );
}
