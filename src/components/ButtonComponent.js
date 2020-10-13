import React from "react";
import "antd/dist/antd.less";
import { Button } from "antd";
import { MessageBus } from "../MessageBus.js";
import shortid from "shortid";

const ButtonComponent = ({ config }) => {
  const { id = shortid.generate(), name, type, clickSub } = config;
  const onClick = (evt) => {
    const val = evt.target.value;
    clickSub.forEach((event) => {
      MessageBus.send(event, val);
    });
  };

  return (
    <Button key={id} type={type} onClick={onClick}>
      {name.toUpperCase()}
    </Button>
  );
};

export default ButtonComponent;
