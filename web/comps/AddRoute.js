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
      <label>User Name</label>
      <input placeholder='user name' value={data.user}
        onChange={async e => {
          methods.setUser(e.target.value);
          const res = await poses(e.target.value);
          methods.setPoints(res);
        }} />
    </Form.Field>
    <Form.Field>
      <label>Report Time</label>
      <DateTimeInput placeholder='report time' value={data.date}
        dateTimeFormat="YYYY-MM-DD HH:mm:ss"
        onChange={(e, { value }) => methods.setDate(value)} />
    </Form.Field>
    <Message info>
      <Message.Header>How To Report?</Message.Header>
      <p>Click on the map to the left!</p>
    </Message>
  </Form>);
};
export default FormExampleForm;
