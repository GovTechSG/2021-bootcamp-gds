import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid';

import {
  Container,
  Row,
  Col,
  Section,
  Button,
} from 'sgds-govtech-react';

import Table from '../components/Table';
import axios from 'axios';

export type TodoItemProps = {
  id: string,
  name: string,
  done: boolean,
};

function TodoItem(props: TodoItemProps) {
  const [done, setDone] = useState(props.done);

  async function updateTodoItem() {
    await axios.put(`/api/todos/${props.id}`, {
      id: props.id,
      name: props.name,
      done: props.done,
    });
  }

  useEffect(() => {
    console.log(props.name, 'is marked as ', done ? 'done' : 'undone');
    updateTodoItem();
  }, [props.name, done]);

  return (<>
    <tr>
      <td><input type="checkbox" checked={done} onChange={(event) => setDone(event.currentTarget.checked)}></input></td>
      <td width={'100%'}>{props.name}</td>
    </tr>
  </>
  );
}

interface TodoProps {

}

function Todo(props: TodoProps) {
  const [todoItems, setTodoItems] = useState<TodoItemProps[]>([]);
  const [newTodoName, setNewTodoName] = useState('');
  useEffect(() => {
    populateTodos();
  }, []);

  async function refreshTodos() {
    const result = await axios.get(`/api/todos`);
    return result.data.todoList || [];
  }

  async function populateTodos() {
    setTodoItems(await refreshTodos());
  }

  async function updateTodos() {
    const newTodo = {
      id: v4(),
      name: newTodoName,
      done: false,
    };
    await axios.put(`/api/todos/${newTodo.id}`, newTodo);
    await populateTodos();
    setNewTodoName('');
  }

  return (
    <Container>
      <Row>
        <Col>
          <Section className='has-background-gradient'>
            <h3>Todo App</h3>
          </Section>
          <Section isSmall>
            <form action='#' onSubmit={(event) => {
              updateTodos();
              event?.preventDefault();
            }}>
              <div className='field'>
                <label className="label" htmlFor="newTodoName">New todo: </label>
                <div className='control'>
                  <Row>
                    <Col is={11}>
                      <input className="input" id='newTodoName' type='text' value={newTodoName}
                        onChange={(event) => { setNewTodoName(event.currentTarget.value) }} />
                    </Col>
                    <Col>
                      <Button isPrimary isLoading={false}>Submit</Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </form>
          </Section>
          <Section isSmall>
            <Table isFullwidth isHoverable isHorizontal isBordered>
              <thead><tr><th>Done</th><th>Description</th></tr></thead>
              <tbody>
                {
                  todoItems.map((item) => (<TodoItem key={item.id} {...item} />))
                }
              </tbody>
            </Table>
          </Section>
        </Col>
      </Row>
    </Container>
  );
}

export default Todo;