import { context } from "../store";
import { poses } from "../libs/pos";
import React, { useContext, useEffect } from "react";
import { Form, Message } from "semantic-ui-react";
import { DateTimeInput } from "semantic-ui-calendar-react";

const FormExampleForm = () => {
  const { data, methods } = useContext(context);
  useEffect(() => {
    (async () => {
      const res = await poses(data.user);
      methods.setPoints(res);
    })();
  }, []);
  return (<Form>
    <Form.Field>
      <label>用户名</label>
      <input placeholder='用户名' value={data.user}
        onChange={async e => {
          methods.setUser(e.target.value);
          const res = await poses(e.target.value);
          methods.setPoints(res);
        }} />
    </Form.Field>
    <Form.Field>
      <label>上报时间</label>
      <DateTimeInput placeholder='上报时间' value={data.date}
        dateTimeFormat="YYYY-MM-DD HH:mm:ss"
        onChange={(e, { value }) => methods.setDate(value)} />
    </Form.Field>
    <Message info>
      <Message.Header>模拟上报</Message.Header>
      <p>在左侧地图上点击即可上报</p>
    </Message>
  </Form>);
};
export default FormExampleForm;
