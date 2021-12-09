import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "antd";
function Subscriber(props) {
  const userTo = props.userTo; //채널
  const userFrom = props.userFrom; //사용자

  const [subscribeCount, setSubscribeCount] = useState(0); //채널의 구독자 수
  const [subscribed, setSubscribed] = useState(false); //사용자의 채널 구독여부

  useEffect(() => {
    const subscribe = { userTo: userTo, userFrom: userFrom };
    //채널의 구독자 수
    axios.post("/api/subscribe/subscribeCount", subscribe).then((response) => {
      if (response.data.success) {
        setSubscribeCount(response.data.subscribeCount);
      } else {
        alert("Failed to get subscriber Number");
      }
    });
    //사용자의 채널 구독여부
    axios.post("/api/subscribe/subscribed", subscribe).then((response) => {
      if (response.data.success) {
        setSubscribed(response.data.subcribed);
      } else {
        alert("Failed to get Subscribed Information");
      }
    });
  }, []);

  const onSubscribe = () => {
    let subscribeVariables = {
      userTo: userTo,
      userFrom: userFrom,
    };

    if (subscribed) {
      //when you are already subscribed
      axios
        .post("/api/subscribe/unSubscribe", subscribeVariables)
        .then((response) => {
          if (response.data.success) {
            setSubscribeCount(subscribeCount - 1);
            setSubscribed(!subscribed);
          } else {
            alert("Failed to unsubscribe");
          }
        });
    } else {
      // when you are not subscribed yet
      axios
        .post("/api/subscribe/subscribe", subscribeVariables)
        .then((response) => {
          if (response.data.success) {
            setSubscribeCount(subscribeCount + 1);
            setSubscribed(!subscribed);
          } else {
            alert("Failed to subscribe");
          }
        });
    }
  };

  return (
    <div>
      <Button onClick={onSubscribe} type={subscribed ? "primary" : "default"}>
        {subscribeCount} {subscribed ? "Subscribed" : "Subscribe"}
      </Button>
    </div>
  );
}

export default Subscriber;
