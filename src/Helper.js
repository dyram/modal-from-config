import React from "react";
import * as Components from "./components";

import {
  getDashboardIds,
  getComponentConfigForDashboard,
  getComponentConfig
} from "./ConfigProvider.js";

function getComponent(config) {
  const C = Components[config.type];
  return <C key={config.id} config={config} />;
}

function getComponentForProps(type, props) {
  const data = props;
  const C = Components[type];
  return <C key={data.name} config={data} />;
}

function getComponents(componentsConfig) {
  const components = [];
  componentsConfig.forEach((componentConfig) => {
    components.push(getComponent(componentConfig));
  });

  return components;
}

function getComponentByRef(configRef) {
  return getComponent(getComponentConfig(configRef));
}

function getComponentsForAppConfig() {
  const components = [];
  getDashboardIds().forEach((dashboardId) => {
    const dashboardConfig = getComponentConfigForDashboard(dashboardId);
    dashboardConfig.forEach((componentConfig) => {
      components.push(getComponent(componentConfig));
    });
  });
  return components;
}

export {
  getComponent,
  getComponents,
  getComponentForProps,
  getComponentByRef,
  getComponentsForAppConfig
};
