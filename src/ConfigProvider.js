import appConfig from "./config/dashboards.json";

export function getDashboardIds() {
  return Object.keys(appConfig.dashboards);
}

export function getComponentConfigForDashboard(
  dashboardId,
  componentConfigs = []
) {
  appConfig.dashboards[dashboardId].components.forEach((component) => {
    componentConfigs.push({
      id: component.id,
      ...getComponentConfigById(component.ref)
    });
  });

  return componentConfigs;
}

function getComponentConfigById(ref) {
  return appConfig.components[ref];
}

export function getComponentConfig(configRef) {
  return {
    id: configRef.id,
    ...getComponentConfigById(configRef.ref)
  };
}

export function getComponentConfigs(configRefs) {
  let componentConfigs = [];
  configRefs.forEach((configRef) => {
    componentConfigs.push({
      id: configRef.id,
      ...getComponentConfigById(configRef.ref)
    });
  });
  return componentConfigs;
}
