import { Subject } from "rxjs";
import { filter } from "rxjs/operators";

const globalSubject = new Subject();
const subscriptions = {};
const MessageBus = {
  send: (subject, data) => globalSubject.next({ topic: subject, data: data }),
  subscribe: (subscriptionId, topic, listener) => {
    if (subscriptions[subscriptionId] === undefined) {
      let subscription;
      if (topic.includes("*")) {
        subscription = globalSubject
          .pipe(
            filter((e) => {
              const regex = new RegExp(topic, "i");
              return e.topic.match(regex);
            })
          )
          .subscribe((e) => listener(subscriptionId, e.topic, e.data));
      } else {
        subscription = globalSubject
          .pipe(filter((e) => e.topic === topic))
          .subscribe((e) => listener(subscriptionId, e.topic, e.data));
      }

      subscriptions[subscriptionId] = subscription;
    } else {
      console.log(
        "Subscription With id : " + subscriptionId + " already exists"
      );
      /*throw Error(
        "Subscription with id : "
          .concat(subscriptionId)
          .concat(" already registered")
      );*/
    }
  },
  unsubscribe: (subscriptionId) => {
    console.log("Unsubscribe " + subscriptionId);
    if (subscriptions[subscriptionId] !== undefined) {
      subscriptions[subscriptionId].unsubscribe();
      delete subscriptions[subscriptionId];
    }
  },

  log: (subscriptionId, topic, e) => {
    console.log("subscriptionId", subscriptionId);
    console.log("topic", topic);
    console.log("data", e);
  }
};

Object.freeze(MessageBus);
export { MessageBus };
