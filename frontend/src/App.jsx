import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Request failed.');
  }

  return response.json();
}

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function loadTodos() {
    try {
      setLoading(true);
      setError('');
      const data = await request('/api/todos');
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) {
      setError('할 일을 입력해주세요.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const newTodo = await request('/api/todos', {
        method: 'POST',
        body: JSON.stringify({ title: trimmed })
      });
      setTodos((current) => [newTodo, ...current]);
      setTitle('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleTodo(todo) {
    try {
      setError('');
      const updatedTodo = await request(`/api/todos/${todo._id}`, {
        method: 'PUT',
        body: JSON.stringify({ completed: !todo.completed })
      });
      setTodos((current) =>
        current.map((item) => (item._id === updatedTodo._id ? updatedTodo : item))
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteTodo(todoId) {
    try {
      setError('');
      await request(`/api/todos/${todoId}`, {
        method: 'DELETE'
      });
      setTodos((current) => current.filter((item) => item._id !== todoId));
    } catch (err) {
      setError(err.message);
    }
  }

  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <main className="page">
      <section className="app-shell">
        <div className="hero">
          <p className="eyebrow">Mini Project</p>
          <h1>오늘 할 일을 가볍게 정리하세요</h1>
          <p className="hero-copy">
            React, Express, MongoDB를 연결한 기본 CRUD Todo 앱입니다.
          </p>
        </div>

        <div className="status-bar">
          <div>
            <strong>{todos.length}</strong>
            <span>전체 할 일</span>
          </div>
          <div>
            <strong>{completedCount}</strong>
            <span>완료</span>
          </div>
        </div>

        <form className="todo-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="예: 데이터베이스 연결 확인하기"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            disabled={submitting}
          />
          <button type="submit" disabled={submitting}>
            {submitting ? '추가 중...' : '추가'}
          </button>
        </form>

        {error ? <p className="message error">{error}</p> : null}

        <div className="todo-list">
          {loading ? <p className="message">불러오는 중...</p> : null}

          {!loading && todos.length === 0 ? (
            <p className="message">첫 할 일을 추가해보세요.</p>
          ) : null}

          {!loading &&
            todos.map((todo) => (
              <article className="todo-card" key={todo._id}>
                <label className="todo-check">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo)}
                  />
                  <span className={todo.completed ? 'done' : ''}>{todo.title}</span>
                </label>
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => deleteTodo(todo._id)}
                >
                  삭제
                </button>
              </article>
            ))}
        </div>
      </section>
    </main>
  );
}
