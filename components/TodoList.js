import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react';

export default function TodoList({ initialTodos }) {
  console.log(initialTodos);
  const [todos, setTodos] = useState(initialTodos || []);
  const [newTodo, setNewTodo] = useState("");
  const [isEditing, setIsEditing] = useState({});
  const [titleBeforeEdit, setTitleBeforeEdit] = useState("");  // store curTitle before Editing, so we can click C

  // useEffect(() => {
  //   fetch("https://jsonplaceholder.typicode.com/todos")
  //     .then((res) => res.json())
  //     .then((todos) => setTodos(todos));
  // }, []);

  const { data: session } = useSession(); // Use NextAuth session

  async function addHandler(e) {
    e.preventDefault();

    const newTodoItem = {
      userId: session.user.id, // Assuming you have access to the user's ID in session
      id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
      title: newTodo,
      completed: false,
    };

    // Update local state
    setTodos((prev) => [...prev, newTodoItem]);
    setNewTodo('');

    // Add todo to the user's todolist in the database
    try {
      const response = await fetch('/api/add-todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          todoItem: newTodoItem,
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Todo item added to the user\'s todolist in the database');
      } else {
        console.error('Failed to update the user\'s todolist in the database');
      }
    } catch (error) {
      console.error('Error updating todolist in the database:', error);
    }
  }

  async function deleteHandler(todoId) {
    setTodos((prev) => {
      return prev.filter((todo) => todo.id !== todoId);
    });

    // Delete the todo from the user's todolist in the database
    try {
      const response = await fetch('/api/delete-todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          todoId: todoId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Todo item deleted from the user\'s todolist in the database');
      } else {
        console.error('Failed to delete the todo from the user\'s todolist in the database');
      }
    } catch (error) {
      console.error('Error deleting todo from the database:', error);
    }
  }

  function editHandler(todoId, curTodoTitle) {
    setTitleBeforeEdit(curTodoTitle);  // store curTitle
    setIsEditing((prevIsEditing) => ({ ...prevIsEditing, [todoId]: true }));
  }

  async function saveHandler(todoId, newTitle) {
    setTodos((todos) =>
      todos.map((todo) => {
        if (todo.id === todoId) {
          return { ...todo, title: newTitle };
        }
        return todo;
      })
    );
    setIsEditing((prevIsEditing) => ({ ...prevIsEditing, [todoId]: false }));

    // Save the todo title in the database
    try {
      const response = await fetch('/api/save-todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          todoId: todoId,
          newTitle: newTitle,
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Todo item updated in the database');
      } else {
        console.error('Failed to update the todo item in the database');
      }
    } catch (error) {
      console.error('Error updating todo in the database:', error);
    }
  }

  function cancelHandler(todoId) {
    setTodos((todos) =>
      todos.map((todo) => {
        if (todo.id === todoId) {
          return { ...todo, title: titleBeforeEdit };
        }
        return todo;
      })
    );
    setIsEditing((prevIsEditing) => ({ ...prevIsEditing, [todoId]: false }));
  }

  async function toggleHandler(todoId) {
    setTodos((todos) =>
      todos.map((todo) => {
        if (todo.id === todoId) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      })
    );

    // Toggle the todo completion status in the database
    try {
      const response = await fetch('/api/toggle-todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          todoId: todoId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Todo item completion status updated in the database');
      } else {
        console.error('Failed to update the todo item completion status in the database');
      }
    } catch (error) {
      console.error('Error updating todo completion status in the database:', error);
    }
  }

  // console.log(todos);

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
      <h1>Todo List</h1>
      <form onSubmit={addHandler} className=''>
        <input value={newTodo} onChange={(e) => setNewTodo(e.target.value)} className='border border-gray-400'/>
        <button type="submit" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">ADD</button>
      </form>
      <div>

        {todos.map((todo, idx) => (
          <div key={idx}>
            <div>{todo.id}</div>

            {isEditing[todo.id] ? (
              <div>
                <input value={todo.title}
									onChange={(e) =>
                    setTodos((prevTodos) =>
                      prevTodos.map((prevTodo) =>
                        prevTodo.id === todo.id ? 
													{ ...prevTodo, title: e.target.value }
                          : prevTodo
                      )
                    )
                  }
                />
                <button onClick={() => saveHandler(todo.id, todo.title)} className='bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 font-bold rounded'>SAVE</button>
                <button onClick={() => cancelHandler(todo.id)} className='bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-3 font-bold rounded'>CANCEL</button>
              </div>
            ) : (
              <div>{todo.title}</div>
            )}

            <div>{todo.completed ? "completed" : "not"}</div>
            <div className="todo-actions">
              <button onClick={() => deleteHandler(todo.id)} className='bg-red-500 hover:bg-red-700 text-white py-1 px-3 font-bold rounded'>Delete</button>
              <button onClick={() => editHandler(todo.id, todo.title)} className='bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 font-bold rounded'>Edit</button>
              <button onClick={() => toggleHandler(todo.id)} className='bg-green-500 hover:bg-green-700 text-white py-1 px-3 font-bold rounded'>Toggle</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}