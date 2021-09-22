import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { v4 } from 'uuid';

import {
  Container,
  Row,
  Col,
  Section,
  Button,
} from 'sgds-govtech-react';

import CONFIG from '../config';
import Table from '../components/Table';

export type TodoItemProps = {
  id: string,
  name: string,
  done: boolean,
};

function TodoItem(props: TodoItemProps) {
  const updateTodoItem = useCallback(async () => {
    await axios.put(`${CONFIG.API_ENDPOINT}/todos/${props.id}`, {
      id: props.id,
      name: props.name,
      done: false,
    });
  }, [props.name, props.id]);

  return (<>
    <tr>
      <td></td>
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

  const populateTodos = useCallback(async () => {
    const result = await axios.get(`${CONFIG.API_ENDPOINT}/todos`);
    setTodoItems(result.data.todoList || []);
  }, []);

  const [isRefresh, setIsRefresh] = useState(false);
  const onRefreshClicked = useCallback( async () => {
    setIsRefresh(true);
    setTimeout(async () => {
      await populateTodos();
      setIsRefresh(false);
    }, 400);
  }, [populateTodos]);

  useEffect(() => {
    onRefreshClicked();
  }, [onRefreshClicked]);

  async function updateTodos() {
    const newTodo = {
      id: v4(),
      name: newTodoName,
      done: false,
    };
    await axios.put(`${CONFIG.API_ENDPOINT}/todos/${newTodo.id}`, newTodo);
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
                    <Col is={10}>
                      <input className="input" id='newTodoName' type='text' value={newTodoName}
                        onChange={(event) => { setNewTodoName(event.currentTarget.value) }} />
                    </Col>
                    <Col>
                      <Button isPrimary isLoading={false}>Submit</Button>
                    </Col>
                    <Col>
                      <Button type="button" isOutline isLoading={isRefresh} onClick={onRefreshClicked}>
                        <span className='sgds-icon sgds-icon-refresh' />
                      </Button>
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
