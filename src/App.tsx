import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { QuestionsList } from './components/QuestionsList';
import { QuestionDetail } from './components/QuestionDetail';
import { AskQuestion } from './components/AskQuestion';
import { TagsPage } from './components/TagsPage';
import { UsersPage } from './components/UsersPage';
import { UserProfile } from './components/UserProfile';
import { JobsPage } from './components/JobsPage';
import { CompaniesPage } from './components/CompaniesPage';
import { CollectivesPage } from './components/CollectivesPage';
import { TeamsPage } from './components/TeamsPage';
import { LoginModal } from './components/LoginModal';
import { questionsData } from './data/questionsData';
import { usersData } from './data/usersData';
import { tagsData } from './data/tagsData';
import { Question, User, Tag, Answer } from './types';

type ViewType = 'home' | 'question' | 'ask' | 'tags' | 'users' | 'profile' | 'jobs' | 'companies' | 'teams' | 'collectives';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<Question[]>(questionsData);
  const [users, setUsers] = useState<User[]>(usersData);
  const [tags] = useState<Tag[]>(tagsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'active' | 'unanswered' | 'votes'>('newest');

  useEffect(() => {
    // Auto-login for demo purposes
    setCurrentUser(users[0]);
  }, [users]);

  const handleQuestionClick = (question: Question) => {
    // Increment view count
    setQuestions(prev => prev.map(q => 
      q.id === question.id ? { ...q, views: q.views + 1 } : q
    ));
    setSelectedQuestion(question);
    setCurrentView('question');
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setCurrentView('profile');
  };

  const handleAskQuestion = (newQuestion: Omit<Question, 'id' | 'createdAt' | 'votes' | 'answers' | 'views'>) => {
    const question: Question = {
      ...newQuestion,
      id: questions.length + 1,
      createdAt: new Date(),
      votes: 0,
      answers: 0,
      views: 0
    };
    setQuestions([question, ...questions]);
    setCurrentView('home');
  };

  const handleVoteQuestion = (questionId: number, voteType: 'up' | 'down') => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }

    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        const newVotes = voteType === 'up' ? q.votes + 1 : q.votes - 1;
        return { ...q, votes: newVotes };
      }
      return q;
    }));

    if (selectedQuestion?.id === questionId) {
      setSelectedQuestion(prev => prev ? {
        ...prev,
        votes: voteType === 'up' ? prev.votes + 1 : prev.votes - 1
      } : null);
    }
  };

  const handleAddAnswer = (questionId: number, answerText: string) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }

    const newAnswer: Answer = {
      id: Date.now(),
      questionId,
      body: answerText,
      author: currentUser.name,
      authorId: currentUser.id,
      createdAt: new Date(),
      votes: 0,
      accepted: false
    };

    // Update questions with new answer count
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, answers: q.answers + 1 } : q
    ));

    // Update selected question if it's the current one
    if (selectedQuestion?.id === questionId) {
      setSelectedQuestion(prev => prev ? {
        ...prev,
        answers: prev.answers + 1,
        answersList: [...(prev.answersList || []), newAnswer]
      } : null);
    }
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (question.body && question.body.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (sortBy === 'unanswered') {
      return matchesSearch && question.answers === 0;
    }
    
    return matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'votes':
        return b.votes - a.votes;
      case 'active':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  const handleLogin = (email: string, password: string) => {
    // Simple demo login - find user by email
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      setShowLoginModal(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNavigate={setCurrentView}
        currentUser={currentUser}
        onLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
      />
      
      <div className="max-w-7xl mx-auto flex">
        <Sidebar currentView={currentView} onNavigate={setCurrentView} />
        
        <main className="flex-1 p-6">
          {currentView === 'home' && (
            <QuestionsList 
              questions={filteredQuestions}
              onQuestionClick={handleQuestionClick}
              onAskQuestion={() => setCurrentView('ask')}
              onVote={handleVoteQuestion}
              currentUser={currentUser}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          )}
          
          {currentView === 'question' && selectedQuestion && (
            <QuestionDetail 
              question={selectedQuestion}
              onBack={() => setCurrentView('home')}
              onVote={handleVoteQuestion}
              onAddAnswer={handleAddAnswer}
              currentUser={currentUser}
              onUserClick={handleUserClick}
            />
          )}
          
          {currentView === 'ask' && (
            <AskQuestion 
              onSubmit={handleAskQuestion}
              onCancel={() => setCurrentView('home')}
              currentUser={currentUser}
            />
          )}

          {currentView === 'tags' && (
            <TagsPage 
              tags={tags}
              onTagClick={(tag) => {
                setSearchQuery(tag);
                setCurrentView('home');
              }}
            />
          )}

          {currentView === 'users' && (
            <UsersPage 
              users={users}
              onUserClick={handleUserClick}
            />
          )}

          {currentView === 'profile' && selectedUser && (
            <UserProfile 
              user={selectedUser}
              questions={questions.filter(q => q.author === selectedUser.name)}
              onBack={() => setCurrentView('home')}
              onQuestionClick={handleQuestionClick}
              isCurrentUser={currentUser?.id === selectedUser.id}
            />
          )}

          {currentView === 'jobs' && (
            <JobsPage onNavigate={setCurrentView} />
          )}

          {currentView === 'companies' && (
            <CompaniesPage onNavigate={setCurrentView} />
          )}

          {currentView === 'collectives' && (
            <CollectivesPage onNavigate={setCurrentView} />
          )}

          {currentView === 'teams' && (
            <TeamsPage onNavigate={setCurrentView} currentUser={currentUser} />
          )}
        </main>
      </div>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
          users={users}
        />
      )}
    </div>
  );
}

export default App;