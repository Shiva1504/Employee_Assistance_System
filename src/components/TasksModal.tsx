import { useState, useEffect } from 'react';
import { X, Upload, CheckCircle } from 'lucide-react';
import { Task } from '../types/task'; 
import {AlertCircle } from 'lucide-react';

interface TasksModalProps {
  onClose: () => void;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}


export const TASKS_STORAGE_KEY = 'employeeTasks';

export default function TasksModal({ onClose, tasks, setTasks }: TasksModalProps) {

    const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'completed' | 'proof'>>({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    });
  
  useEffect(() => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }, [tasks]);

  const handleFileUpload = (taskId: string, files: FileList) => {
    const fileData = Array.from(files).map(file => ({
      name: file.name,
      size: file.size,
      type: file.type
    }));

    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, proof: [...task.proof, ...fileData] } 
        : task
    ));
  };

  const completeTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    ));
  };

  const addNewTask = () => {
    if (!newTask.title || !newTask.description) return;
    
    setTasks(prev => [
      ...prev,
      {
        ...newTask,
        id: Date.now().toString(),
        completed: false,
        proof: []
      }
    ]);
    
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold dark:text-white">Employee Tasks</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Add New Task Form */}
        <div className="mb-6 space-y-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
            className="w-full p-2 border rounded dark:bg-gray-600 dark:text-white"
          />
          <textarea
            placeholder="Task Description"
            value={newTask.description}
            onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
            className="w-full p-2 border rounded dark:bg-gray-600 dark:text-white"
          />
          <div className="flex gap-3">
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
              className="p-2 border rounded dark:bg-gray-600 dark:text-white"
            />
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask(prev => ({
                ...prev,
                priority: e.target.value as Task['priority']
              }))}
              className="p-2 border rounded dark:bg-gray-600 dark:text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button
              onClick={addNewTask}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Task
            </button>
          </div>
        </div>






{/* Tasks List */}
<div className="space-y-4 max-h-[60vh] overflow-y-auto">
<div className="flex justify-end mb-4">
    <button
      onClick={() => setTasks([])} 
      className="px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2"
    >
      <AlertCircle className="w-4 h-4" />
      Clear History
    </button>
  </div>
  {tasks
    .slice() // Create a shallow copy of the tasks array
    .sort((a, b) => {
      // Sort by completion status first
      if (a.completed !== b.completed) {
        return Number(a.completed) - Number(b.completed); // Incomplete tasks (false) first
      }

      // Sort by priority within incomplete tasks
      const priorityOrder: { [key: string]: number } = { high: 1, medium: 2, low: 3, undefined: 4 };

      return (priorityOrder[a.priority ?? 'undefined'] - priorityOrder[b.priority ?? 'undefined']);
    })
    .map(task => (
      <div key={task.id} className="border rounded-lg p-4 dark:border-gray-700">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-medium dark:text-white">{task.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{task.description}</p>
            <div className="flex gap-2 text-sm">
              {task.dueDate && (
                <span className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                  Due: {new Date(task.dueDate).toLocaleDateString('en-GB')}
                </span>
              )}
              <span className={`px-2 py-1 rounded ${
                task.priority === 'high' ? 'bg-red-100 dark:bg-red-900' :
                task.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900' :
                'bg-green-100 dark:bg-green-900'
              }`}>
                {task.priority} Priority
              </span>
            </div>
          </div>

          {task.completed ? (
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
          ) : (
            <div className="flex items-center gap-2 flex-shrink-0">
              <label className="cursor-pointer text-blue-500 hover:text-blue-600">
                <Upload className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*,video/*,application/pdf"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && handleFileUpload(task.id, e.target.files)}
                />
              </label>
              <button
                onClick={() => completeTask(task.id)}
                disabled={task.proof.length === 0}
                className={`px-3 py-1 rounded-md ${
                  task.proof.length > 0 
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                Complete
              </button>
            </div>
          )}
        </div>

        {task.proof.length > 0 && (
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            <strong>Attached Proof:</strong>
            <ul className="list-disc pl-5 mt-1">
              {task.proof.map((file, index) => (
                <li key={index}>{file.name} ({Math.round(file.size / 1024)}KB)</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ))}
</div>

      </div>
    </div>
  );
}