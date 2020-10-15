import React, { useState, useEffect } from "react";
import { Button, Modal, Typography, Alert } from "antd";
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
  } = config.params;
  const {
    hasIntermediary,
    intermediaryEvent,
    intermediaryEventName,
    intermediarySuccessMessage,
    intermediaryErrorMessage,
  } = config.params.intermediaryDetails;
  const { Title, Text } = Typography;

  const [visible, setVisible] = useState(false);
  const [intermediaryDone, setIntermediaryDone] = useState(false);
  const [intermediaryError, setIntermediaryError] = useState(false);

  const openModal = () => {
    setVisible(true);
  };
  const closeModal = () => {
    setVisible(false);
    setIntermediaryDone(false);
    setIntermediaryError(false);
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
      <Button type="primary" onClick={openModal}>
        Unlock Device
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
        {intermediaryDone && (
          <Alert message={intermediarySuccessMessage} type="success" showIcon />
        )}
        {intermediaryError && (
          <Alert message={intermediaryErrorMessage} type="error" showIcon />
        )}
      </Modal>
    </>
  );
}
