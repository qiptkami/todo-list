import React, { useRef, useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import Todo from './components/Todo';
import Form from './components/Form';
import FilterButton from './components/FilterButton';

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

//定义在App外面，每当渲染App时，不会重新被计算
const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState('All');
  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    if (tasks.length - prevTaskLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  function addTask(name) {
    const newTask = { id: 'todo-' + nanoid(), name: name, completed: false };
    setTasks([...tasks, newTask]);
  }

  function deleteTask(id, name) {
    if (window.confirm('你确定要删除' + name + '吗？')) {
      const remainingTasks = tasks.filter((task) => id !== task.id);
      setTasks(remainingTasks);
    }
  }

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {
        return {...task, completed: !task.completed};
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function editTask(id, newName) {
    const editTasks = tasks.map((task) => {
      if (id === task.id) {
        return {...task, name: newName};
      }
      return task;
    });
    setTasks(editTasks);
  }

  const taskList = tasks.filter(FILTER_MAP[filter]).map((task) => (
    <Todo
      id={task.id}
      name={task.name}
      completed={task.completed}
      key={task.id}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTask={editTask}
    />
  ));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  const taksNums = taskList.length > 1 ? 'tasks' : 'task';
  const headingText = `${taskList.length} ${taksNums} remaining`;
    return (
      <div className="todoapp stack-large">
      <h1>Todo List</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {headingText}
      </h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
      </div>
    );
}

//把自己抛出去 其他组件可以使用
export default App;