import { Question } from '../types';

export const questionsData: Question[] = [
  {
    id: 1,
    title: "How to center a div horizontally and vertically in CSS?",
    body: "I'm trying to center a div both horizontally and vertically on the page. I've tried various methods but nothing seems to work properly.",
    author: "Alex Johnson",
    createdAt: new Date('2024-01-15'),
    votes: 42,
    answers: 8,
    views: 1234,
    tags: ["css", "html", "flexbox", "centering"]
  },
  {
    id: 2,
    title: "What's the difference between let, const, and var in JavaScript?",
    body: "I'm confused about when to use let, const, and var in JavaScript. Can someone explain the differences?",
    author: "Sarah Chen",
    createdAt: new Date('2024-01-14'),
    votes: 156,
    answers: 12,
    views: 5678,
    tags: ["javascript", "variables", "es6", "scope"]
  },
  {
    id: 3,
    title: "How to handle async/await errors in JavaScript?",
    body: "I'm working with async/await in JavaScript and I'm not sure about the best practices for error handling.",
    author: "Mike Rodriguez",
    createdAt: new Date('2024-01-13'),
    votes: 89,
    answers: 5,
    views: 2341,
    tags: ["javascript", "async-await", "error-handling", "promises"]
  },
  {
    id: 4,
    title: "React useState not updating immediately",
    body: "I'm calling setState in React but the state doesn't seem to update immediately. What's happening?",
    author: "Emily Davis",
    createdAt: new Date('2024-01-12'),
    votes: 73,
    answers: 9,
    views: 3456,
    tags: ["react", "hooks", "usestate", "state-management"]
  },
  {
    id: 5,
    title: "How to properly use Git branches for feature development?",
    body: "I'm working on a team project and we need to implement proper Git branching strategy. What are the best practices?",
    author: "David Wilson",
    createdAt: new Date('2024-01-11'),
    votes: 34,
    answers: 6,
    views: 1789,
    tags: ["git", "version-control", "branching", "workflow"]
  },
  {
    id: 6,
    title: "Python list comprehension vs map() function performance",
    body: "Which is faster in Python: list comprehensions or using the map() function? And when should I use each?",
    author: "Lisa Park",
    createdAt: new Date('2024-01-10'),
    votes: 67,
    answers: 4,
    views: 2890,
    tags: ["python", "performance", "list-comprehension", "functional-programming"]
  },
  {
    id: 7,
    title: "SQL JOIN vs WHERE clause for filtering",
    body: "When should I use JOIN conditions vs WHERE clause conditions in SQL queries? What's more efficient?",
    author: "Robert Kim",
    createdAt: new Date('2024-01-09'),
    votes: 28,
    answers: 3,
    views: 1567,
    tags: ["sql", "joins", "query-optimization", "database"]
  },
  {
    id: 8,
    title: "TypeScript interface vs type alias - when to use which?",
    body: "I'm learning TypeScript and I'm confused about when to use interfaces vs type aliases. Are there specific use cases for each?",
    author: "Anna Thompson",
    createdAt: new Date('2024-01-08'),
    votes: 91,
    answers: 7,
    views: 4123,
    tags: ["typescript", "interfaces", "types", "best-practices"]
  }
];