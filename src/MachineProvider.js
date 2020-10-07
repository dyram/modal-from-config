import { Machine, interpret } from "xstate";
import machineDefs from "./config/StateMachines.json";
import { MessageBus } from "./MessageBus";

const services = {};

const MachineProvider = {
  init: () => {
    Object.keys(machineDefs).forEach((key) => {
      MessageBus.subscribe(
        "services",
        "SM.".concat(key).concat(".*"),
        MachineProvider.eventListener
      );
    });
  },

  getService: (id) => {
    let service = services[id];
    if (service === undefined) {
      const machine = Machine(machineDefs[id]);
      service = interpret(machine).onTransition((state) => {
        console.log("Transitioned to : ", state.value);
      });
      service.start();
      services[id] = service;
    }
    return service;
  },

  eventListener: (subscriptionId, topic, data) => {
    if (topic.startsWith("SM.")) {
      const topicParts = topic.split(".");
      const service = MachineProvider.getService(topicParts[1]);
      if (service !== undefined) {
        service.send(topicParts[2], data);
      }
    }
  }
};

Object.freeze(MachineProvider);
export { MachineProvider };
