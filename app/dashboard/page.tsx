'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd'

interface Task {
  _id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState({ title: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null

  useEffect(() => {
    if (token) fetchTasks()
  }, [token])

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTasks(res.data)
    } catch (err) {
      console.error('Lỗi khi lấy task:', err)
    }
  }

  const handleCreate = async () => {
    try {
      setLoading(true)
      await axios.post(
        'http://localhost:5000/tasks',
        { ...newTask, status: 'todo' },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setNewTask({ title: '', description: '' })
      await fetchTasks()
    } catch (err) {
      console.error('Tạo task thất bại:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      await fetchTasks()
    } catch (err) {
      console.error('Xoá task thất bại:', err)
    }
  }

  const handleUpdate = async () => {
    if (!editingTask) return
    try {
      setLoading(true)
      await axios.put(
        `http://localhost:5000/tasks/${editingTask._id}`,
        { title: editingTask.title, description: editingTask.description },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setEditingTask(null)
      await fetchTasks()
    } catch (err) {
      console.error('Sửa task thất bại:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination || destination.droppableId === source.droppableId) return

    const updatedTasks = tasks.map(task =>
      task._id === draggableId ? { ...task, status: destination.droppableId as Task['status'] } : task
    )
    setTasks(updatedTasks)

    try {
      await axios.put(
        `http://localhost:5000/tasks/${draggableId}`,
        { status: destination.droppableId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } catch (err) {
      console.error('Lỗi khi cập nhật trạng thái task:', err)
    }
  }

  const columns = {
    todo: {
      name: '📝 Chưa làm',
      items: tasks.filter((t) => t.status === 'todo'),
    },
    'in-progress': {
      name: '🚧 Đang làm',
      items: tasks.filter((t) => t.status === 'in-progress'),
    },
    done: {
      name: '✅ Đã xong',
      items: tasks.filter((t) => t.status === 'done'),
    },
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 mt-16">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">🎯 Quản lý Task</h1>

        {/* Tạo task mới */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">➕ Tạo task mới</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Tiêu đề"
              className="border p-2 rounded w-full sm:w-auto"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Mô tả"
              className="border p-2 rounded w-full sm:w-auto"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? 'Đang tạo...' : 'Tạo'}
            </button>
          </div>
        </div>

        {/* Các cột task */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(columns).map(([key, column]) => (
              <Droppable key={key} droppableId={key}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-gray-50 p-4 rounded shadow"
                  >
                    <h3 className="text-xl font-bold mb-2">{column.name}</h3>
                    {column.items.map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided) => (
                          <div
                            className="bg-white border rounded p-3 mb-2 shadow-sm"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <h4 className="font-semibold">{task.title}</h4>
                            <p className="text-gray-600">{task.description}</p>
                            <div className="mt-2 space-x-2">
                              <span className={`text-sm ${task.status === 'todo' ? 'text-gray-500' : task.status === 'in-progress' ? 'text-yellow-500' : 'text-green-500'}`}>
                                {task.status === 'todo' ? 'Chưa làm' : task.status === 'in-progress' ? 'Đang làm' : 'Đã xong'}
                              </span>
                              <button
                                onClick={() => setEditingTask(task)}
                                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                              >
                                Sửa
                              </button>
                              <button
                                onClick={() => handleDelete(task._id)}
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                              >
                                Xoá
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Modal chỉnh sửa */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">✏️ Sửa Task</h2>
            <input
              type="text"
              value={editingTask.title}
              onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
              className="border p-2 rounded w-full mb-2"
              placeholder="Tiêu đề"
            />
            <input
              type="text"
              value={editingTask.description}
              onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
              className="border p-2 rounded w-full mb-4"
              placeholder="Mô tả"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingTask(null)}
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
