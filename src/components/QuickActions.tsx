import { useState } from 'react'; 
import { FileText, AlertCircle, BookOpen, Calendar } from 'lucide-react';
import { QuickAction, Task } from '../types';
import CalendarComponent from './Calendar';
import QuizForm from './QuizForm';
import TasksModal from './TasksModal';

interface QuickActionsProps {
  setActiveTab: (tab: 'chat' | 'Announcement' | 'documents' | 'complaints') => void;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

function QuickActions({ setActiveTab, tasks, setTasks }: QuickActionsProps) {
  // All hooks must be INSIDE the component
  const [showCalendar, setShowCalendar] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showTasks, setShowTasks] = useState(false); 


  const QUICK_ACTIONS: QuickAction[] = [
    {
      id: '1',
      title: 'Tasks',
      icon: 'FileText',
      action: () => setShowTasks(true)
    },
    {
      id: '2',
      title: 'Report Issue',
      icon: 'AlertCircle',
      action: () => setActiveTab('complaints')
    },
    {
      id: '3',
      title: 'Training',
      icon: 'BookOpen',
      action: () => {}
    },
    {
      id: '4',
      title: 'Schedule',
      icon: 'Calendar',
      action: () => {} 
    }
  ];


  const handleTasksClick = () => {
    setShowTasks(true); 
  };
  const handleScheduleClick = () => {
    setShowCalendar(true); 
  };
  const handleTrainingClick = () => {
    setShowQuiz(true); 
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText':
        return <FileText className="w-5 h-5" />;
      case 'AlertCircle':
        return <AlertCircle className="w-5 h-5" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5" />;
      case 'Calendar':
        return <Calendar className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={
              action.id === '4' 
                ? handleScheduleClick 
                : action.id === '1' 
                ? handleTasksClick 
                : action.id === '3' 
                ? handleTrainingClick 
                : action.action
            }
            className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="text-blue-500 dark:text-blue-400 mb-2">
              {getIcon(action.icon)}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {action.title}
            </span>
          </button>
        ))}
      </div>

        {showTasks && (
          <TasksModal 
            onClose={() => setShowTasks(false)}
            tasks={tasks}   
            setTasks={setTasks}   
          />
        )}
      {showCalendar && <CalendarComponent onClose={() => setShowCalendar(false)} />}
      {showQuiz && <QuizForm onClose={() => setShowQuiz(false)} />}
    </>
  );
}

export default QuickActions;