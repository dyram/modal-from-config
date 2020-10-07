import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "../styles.css";
import { Steps } from "antd";
import { getComponentConfigs } from "../ConfigProvider.js";
import { getComponentForProps, getComponentByRef } from "../Helper.js";
import { MessageBus } from "../MessageBus.js";

const { Step } = Steps;

const StepperComponent = ({ config }) => {
  const { id } = config;
  const { nextStepEvent, prevStepEvent, resetEvent, direction } = config.params;
  const steps = getComponentConfigs(config.childComponents);
  const [current, setCurrent] = useState(0);
  const stepChildren = [];

  MessageBus.subscribe(
    id.concat(current).concat("nextStep"),
    nextStepEvent,
    () => {
      setCurrent(current + 1);
    }
  );
  MessageBus.subscribe(
    id.concat(current).concat("prevStep"),
    prevStepEvent,
    () => setCurrent(current - 1)
  );
  MessageBus.subscribe(id.concat(current).concat("reset"), resetEvent, () =>
    setCurrent(0)
  );

  let getButtons = () => {
    const buttons = [];
    steps[current].params.buttons.forEach((buttonConfig) => {
      buttons.push(getComponentForProps("ButtonComponent", buttonConfig));
    });
    return buttons;
  };

  let getSteps = () => {
    const stepComponents = [];
    steps.forEach((step) => {
      const C = (
        <Step
          key={step.id}
          title={step.title}
          description={step.description}
          disabled={true}
        />
      );
      stepComponents.push(C);
    });
    return stepComponents;
  };

  let getStepChild = (stepIdx) => {
    if (stepChildren[stepIdx] === undefined) {
      stepChildren[stepIdx] = getComponentByRef(
        steps[stepIdx].childComponents[0]
      );
    }
    return stepChildren[stepIdx];
  };

  useEffect(() => {
    return () => {
      MessageBus.unsubscribe(id.concat(current).concat("nextStep"));
      MessageBus.unsubscribe(id.concat(current).concat("prevStep"));
      MessageBus.unsubscribe(id.concat(current).concat("reset"));
    };
  });

  return (
    <div>
      <Steps direction={direction} current={current}>
        {getSteps()}
      </Steps>
      <div className="steps-content">{getStepChild(current)}</div>
      <div className="steps-action">{getButtons()}</div>
    </div>
  );
};

export default StepperComponent;
