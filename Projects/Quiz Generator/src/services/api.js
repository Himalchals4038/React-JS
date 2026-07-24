// Utility function to safely decode HTML entities returned by Open Trivia DB
export function decodeHTML(html) {
  if (!html) return '';
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

// Built-in categories with icons, colors, and descriptions
export const CATEGORY_METADATA = {
  9: { icon: 'Brain', color: 'from-amber-500 to-orange-600', name: 'General Knowledge', desc: 'Test your breadth of worldly knowledge' },
  17: { icon: 'Atom', color: 'from-emerald-500 to-teal-600', name: 'Science & Nature', desc: 'Physics, chemistry, biology, and cosmos' },
  18: { icon: 'Cpu', color: 'from-indigo-500 to-cyan-600', name: 'Computers & Tech', desc: 'Coding, AI, hardware, and tech history' },
  19: { icon: 'Calculator', color: 'from-blue-500 to-indigo-600', name: 'Mathematics', desc: 'Algebra, geometry, logic, and numbers' },
  21: { icon: 'Trophy', color: 'from-rose-500 to-red-600', name: 'Sports', desc: 'Global sports, athletics, and records' },
  22: { icon: 'Globe', color: 'from-emerald-400 to-green-600', name: 'Geography', desc: 'Countries, capitals, oceans, and landforms' },
  23: { icon: 'Scroll', color: 'from-amber-600 to-yellow-700', name: 'History', desc: 'Ancient civilizations, empires, and eras' },
  24: { icon: 'Landmark', color: 'from-purple-500 to-indigo-700', name: 'Politics', desc: 'World leaders, laws, and governance' },
  25: { icon: 'Palette', color: 'from-pink-500 to-purple-600', name: 'Art & Design', desc: 'Masterpieces, artists, and art history' },
  27: { icon: 'PawPrint', color: 'from-lime-500 to-emerald-600', name: 'Animals', desc: 'Wildlife, fauna, and animal facts' },
  11: { icon: 'Film', color: 'from-violet-500 to-purple-600', name: 'Movies & Cinema', desc: 'Blockbusters, directors, and Oscars' },
  12: { icon: 'Music', color: 'from-cyan-500 to-blue-600', name: 'Music & Songs', desc: 'Pop, Rock, Classical, and instruments' },
  15: { icon: 'Gamepad2', color: 'from-fuchsia-500 to-pink-600', name: 'Video Games', desc: 'Retro classics, esports, and modern games' },
  20: { icon: 'Sparkles', color: 'from-yellow-400 to-amber-600', name: 'Mythology', desc: 'Greek, Norse, Egyptian legends' },
  31: { icon: 'Tv', color: 'from-sky-400 to-blue-600', name: 'Anime & Manga', desc: 'Japanese animation and comic books' },
};

// Fallback questions dictionary for offline/error safety
const FALLBACK_QUESTIONS = {
  18: [
    {
      category: 'Computers & Tech',
      type: 'multiple',
      difficulty: 'medium',
      question: 'What does the abbreviation "CPU" stand for?',
      correct_answer: 'Central Processing Unit',
      incorrect_answers: ['Central Power Unit', 'Computer Processing User', 'Control Program Unit'],
    },
    {
      category: 'Computers & Tech',
      type: 'multiple',
      difficulty: 'easy',
      question: 'Which programming language is predominantly used for styling web pages?',
      correct_answer: 'CSS',
      incorrect_answers: ['HTML', 'JavaScript', 'Python'],
    },
    {
      category: 'Computers & Tech',
      type: 'multiple',
      difficulty: 'hard',
      question: 'In computer science, what is the worst-case time complexity of QuickSort?',
      correct_answer: 'O(n²)',
      incorrect_answers: ['O(n log n)', 'O(n)', 'O(log n)'],
    },
    {
      category: 'Computers & Tech',
      type: 'multiple',
      difficulty: 'medium',
      question: 'Who is considered the creator of the Python programming language?',
      correct_answer: 'Guido van Rossum',
      incorrect_answers: ['Brendan Eich', 'James Gosling', 'Linus Torvalds'],
    },
    {
      category: 'Computers & Tech',
      type: 'multiple',
      difficulty: 'easy',
      question: 'What is the binary representation of the decimal number 5?',
      correct_answer: '101',
      incorrect_answers: ['100', '110', '011'],
    }
  ],
  9: [
    {
      category: 'General Knowledge',
      type: 'multiple',
      difficulty: 'easy',
      question: 'What is the largest planet in our Solar System?',
      correct_answer: 'Jupiter',
      incorrect_answers: ['Saturn', 'Neptune', 'Earth'],
    },
    {
      category: 'General Knowledge',
      type: 'multiple',
      difficulty: 'medium',
      question: 'Which chemical element has the atomic symbol "Au"?',
      correct_answer: 'Gold',
      incorrect_answers: ['Silver', 'Copper', 'Aluminum'],
    },
    {
      category: 'General Knowledge',
      type: 'multiple',
      difficulty: 'easy',
      question: 'How many bones are in the adult human body?',
      correct_answer: '206',
      incorrect_answers: ['210', '198', '204'],
    },
    {
      category: 'General Knowledge',
      type: 'multiple',
      difficulty: 'medium',
      question: 'Which nation has won the most FIFA World Cup titles?',
      correct_answer: 'Brazil',
      incorrect_answers: ['Germany', 'Italy', 'Argentina'],
    },
    {
      category: 'General Knowledge',
      type: 'multiple',
      difficulty: 'easy',
      question: 'What is the capital city of Japan?',
      correct_answer: 'Tokyo',
      incorrect_answers: ['Kyoto', 'Osaka', 'Sapporo'],
    }
  ]
};

// Fetch categories from Open Trivia DB API
export async function fetchTriviaCategories() {
  try {
    const response = await fetch('https://opentdb.com/api_category.php');
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data = await response.json();
    return data.trivia_categories || [];
  } catch (err) {
    console.warn('API Category fetch failed, returning default category list:', err);
    return Object.keys(CATEGORY_METADATA).map(id => ({
      id: Number(id),
      name: CATEGORY_METADATA[id].name
    }));
  }
}

// Fetch quiz questions from Open Trivia DB
export async function fetchTriviaQuestions({ category = '', difficulty = '', type = '', amount = 10 }) {
  try {
    let url = `https://opentdb.com/api.php?amount=${amount}`;
    if (category) url += `&category=${category}`;
    if (difficulty && difficulty !== 'any') url += `&difficulty=${difficulty}`;
    if (type && type !== 'any') url += `&type=${type}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    if (data.response_code === 0 && data.results && data.results.length > 0) {
      return formatQuestions(data.results);
    } else {
      console.warn('OpenTriviaDB returned response code:', data.response_code, 'falling back to sample questions');
      return getFallbackQuestions(category, amount);
    }
  } catch (err) {
    console.warn('Error fetching trivia questions:', err);
    return getFallbackQuestions(category, amount);
  }
}

// Helper to shuffle answers and clean HTML
function formatQuestions(rawQuestions) {
  return rawQuestions.map((q, idx) => {
    const cleanQuestion = decodeHTML(q.question);
    const cleanCorrect = decodeHTML(q.correct_answer);
    const cleanIncorrect = q.incorrect_answers.map(decodeHTML);
    
    // Combine and shuffle choices
    const allChoices = [cleanCorrect, ...cleanIncorrect];
    const shuffledChoices = shuffleArray(allChoices);

    return {
      id: `q-${idx}-${Date.now()}`,
      category: decodeHTML(q.category),
      difficulty: q.difficulty,
      type: q.type,
      question: cleanQuestion,
      correctAnswer: cleanCorrect,
      options: shuffledChoices,
      explanation: `Correct Answer: "${cleanCorrect}".`
    };
  });
}

function getFallbackQuestions(categoryId, amount) {
  const list = FALLBACK_QUESTIONS[categoryId] || FALLBACK_QUESTIONS[9];
  const formatted = formatQuestions(list);
  // Duplicate or trim to match amount
  const result = [];
  for (let i = 0; i < amount; i++) {
    const base = formatted[i % formatted.length];
    result.push({
      ...base,
      id: `fallback-${i}-${Date.now()}`
    });
  }
  return result;
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Wikipedia Facts API fetcher for Hint lifeline
export async function fetchWikipediaFact(searchTerm) {
  if (!searchTerm) return null;
  try {
    // Extract key words from question or category
    const cleanTerm = searchTerm
      .replace(/Which|What|Who|Where|When|How|many|of the|the|following/gi, '')
      .trim()
      .split(' ')
      .slice(0, 3)
      .join(' ');
    
    const query = cleanTerm || searchTerm;
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    if (data.extract) {
      return {
        title: data.title,
        extract: data.extract,
        thumbnail: data.thumbnail?.source || null,
        url: data.content_urls?.desktop?.page || null
      };
    }
    return null;
  } catch (err) {
    console.warn('Wikipedia API fetch hint failed:', err);
    return null;
  }
}
