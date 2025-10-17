import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, BookOpen, Users, Send, LogOut, Edit3, Sparkles, Share2, X } from 'lucide-react';

const App = () => {
  const [currentView, setCurrentView] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [newPost, setNewPost] = useState({ title: '', content: '', mood: 'hope' });
  const [showComments, setShowComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [showShareModal, setShowShareModal] = useState(null);
  const [dailyQuote, setDailyQuote] = useState(null);
  const [communityPosts, setCommunityPosts] = useState([
    {
      id: 1,
      title: "Midnight Thoughts",
      content: "In the silence of the night, I find myself drowning in thoughts. Sometimes the darkness isn't scary—it's comforting.",
      mood: "loneliness",
      author: "Luna",
      timestamp: new Date(Date.now() - 86400000 * 2),
      likes: 24,
      comments: [
        { id: 1, author: "StarGazer", text: "This really resonates with me.", timestamp: new Date() }
      ]
    },
    {
      id: 2,
      title: "A Letter to Tomorrow",
      content: "Dear Tomorrow, I don't know what you hold, but I'm choosing to believe in you. Every sunrise is proof that endings can be beautiful.",
      mood: "hope",
      author: "Phoenix",
      timestamp: new Date(Date.now() - 86400000 * 1),
      likes: 42,
      comments: []
    },
    {
      id: 3,
      title: "Coffee Shop Love",
      content: "I saw you again today. Same corner table, same gentle smile. Isn't it strange how love can bloom in the spaces between strangers?",
      mood: "love",
      author: "Poet's Heart",
      timestamp: new Date(Date.now() - 86400000 * 3),
      likes: 67,
      comments: []
    }
  ]);

  const literaryQuotes = {
    sadness: [
      { text: "The way sadness works is one of the strange riddles of the world.", author: "Lemony Snicket" },
      { text: "Tears are words that need to be written.", author: "Paulo Coelho" }
    ],
    hope: [
      { text: "Hope is the thing with feathers that perches in the soul.", author: "Emily Dickinson" },
      { text: "The darkest nights produce the brightest stars.", author: "John Green" }
    ],
    love: [
      { text: "Love is composed of a single soul inhabiting two bodies.", author: "Aristotle" },
      { text: "Love recognizes no barriers.", author: "Maya Angelou" }
    ],
    confusion: [
      { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
      { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" }
    ],
    joy: [
      { text: "Happiness is not by chance, but by choice.", author: "Jim Rohn" },
      { text: "Joy is the simplest form of gratitude.", author: "Karl Barth" }
    ],
    loneliness: [
      { text: "The soul that sees beauty may sometimes walk alone.", author: "Goethe" }
    ]
  };

  const detectMood = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.match(/sad|depressed|crying|tears/)) return 'sadness';
    if (lowerText.match(/hope|believe|tomorrow|faith/)) return 'hope';
    if (lowerText.match(/love|heart|miss|care/)) return 'love';
    if (lowerText.match(/confused|lost|uncertain/)) return 'confusion';
    if (lowerText.match(/happy|joy|excited|wonderful/)) return 'joy';
    if (lowerText.match(/lonely|alone|isolated/)) return 'loneliness';
    return 'hope';
  };

  useEffect(() => {
    const allQuotes = Object.values(literaryQuotes).flat();
    const randomQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];
    setDailyQuote(randomQuote);
  }, []);

  const handleAuth = (username, password, isSignup) => {
    if (isSignup) {
      const newUser = { id: Date.now(), username, password };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      setCurrentView('dashboard');
    } else {
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        setCurrentUser(user);
        setCurrentView('dashboard');
      } else {
        alert('Invalid credentials');
      }
    }
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    const userMessage = { text: userInput, sender: 'user', timestamp: new Date() };
    const detectedMood = detectMood(userInput);
    
    const moodQuotes = literaryQuotes[detectedMood] || literaryQuotes.hope;
    const quote = moodQuotes[Math.floor(Math.random() * moodQuotes.length)];
    
    const responses = [
      'I hear you. Your feelings are valid.',
      'Here is something that might resonate:',
      `"${quote.text}" — ${quote.author}`
    ];

    const botMessage = { 
      text: responses.join('\n\n'), 
      sender: 'bot', 
      timestamp: new Date()
    };

    setChatMessages([...chatMessages, userMessage, botMessage]);
    setUserInput('');
  };

  const handleCreatePost = () => {
    if (!newPost.content.trim()) return;
    
    const post = {
      id: Date.now(),
      ...newPost,
      author: currentUser.username,
      timestamp: new Date(),
      likes: 0,
      comments: []
    };
    
    setCommunityPosts([post, ...communityPosts]);
    setNewPost({ title: '', content: '', mood: 'hope' });
    alert('Your writing has been shared! 💙');
  };

  const handleLike = (postId) => {
    setCommunityPosts(communityPosts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const handleAddComment = (postId) => {
    const commentText = commentInputs[postId];
    if (!commentText || !commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      author: currentUser.username,
      text: commentText,
      timestamp: new Date()
    };

    setCommunityPosts(communityPosts.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    ));

    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  const toggleComments = (postId) => {
    setShowComments({ ...showComments, [postId]: !showComments[postId] });
  };

  const handleShare = (post) => {
    setShowShareModal(post);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Link copied!');
    setShowShareModal(null);
  };

  const LoginView = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border border-white/20">
          <div className="text-center mb-8">
            <Heart className="text-pink-300 w-12 h-12 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-2">App</h1>
            <p className="text-purple-200">Where emotions meet literature</p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <button
              onClick={() => handleAuth(username, password, isSignup)}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              {isSignup ? 'Create Account' : 'Sign In'}
            </button>
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="w-full py-2 text-purple-200 hover:text-white"
            >
              {isSignup ? 'Already have an account? Sign In' : 'New here? Create Account'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DashboardView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="bg-black/30 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="text-pink-400 w-8 h-8" />
            <h1 className="text-2xl font-bold text-white">App</h1>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-purple-200">Welcome, {currentUser.username}</span>
            <button
              onClick={() => { setCurrentUser(null); setCurrentView('login'); }}
              className="text-pink-300 hover:text-pink-400"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {dailyQuote && (
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-purple-300/30">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="text-yellow-300 w-5 h-5" />
              <h3 className="text-xl font-semibold text-white">Today's Inspiration</h3>
            </div>
            <p className="text-white text-lg italic mb-2">"{dailyQuote.text}"</p>
            <p className="text-purple-200">— {dailyQuote.author}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setCurrentView('chat')}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all text-left"
          >
            <MessageCircle className="text-blue-400 w-8 h-8 mb-3" />
            <h3 className="text-xl font-semibold text-white mb-2">Chat Companion</h3>
            <p className="text-purple-200">Share your feelings</p>
          </button>

          <button
            onClick={() => setCurrentView('community')}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all text-left"
          >
            <Users className="text-green-400 w-8 h-8 mb-3" />
            <h3 className="text-xl font-semibold text-white mb-2">Community</h3>
            <p className="text-purple-200">Read and share writings</p>
          </button>

          <button
            onClick={() => setCurrentView('write')}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all text-left"
          >
            <Edit3 className="text-pink-400 w-8 h-8 mb-3" />
            <h3 className="text-xl font-semibold text-white mb-2">Write</h3>
            <p className="text-purple-200">Share your thoughts</p>
          </button>
        </div>
      </div>
    </div>
  );

  const ChatView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="bg-black/30 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button onClick={() => setCurrentView('dashboard')} className="text-purple-200 hover:text-white">
            ← Back
          </button>
          <h2 className="text-xl font-semibold text-white">Emotional Companion</h2>
          <div className="w-16"></div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 h-[600px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {chatMessages.length === 0 ? (
              <div className="text-center text-purple-200 mt-20">
                <Heart className="w-16 h-16 mx-auto mb-4 text-pink-400" />
                <p className="text-lg">Share what's in your heart...</p>
              </div>
            ) : (
              chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.sender === 'user' 
                      ? 'bg-purple-500/30 text-white' 
                      : 'bg-pink-500/20 text-white border border-pink-300/30'
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Express your feelings..."
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
                autoFocus
              />
              <button
                onClick={handleSendMessage}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const CommunityView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="bg-black/30 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button onClick={() => setCurrentView('dashboard')} className="text-purple-200 hover:text-white">
            ← Back
          </button>
          <h2 className="text-xl font-semibold text-white">Writers' Corner</h2>
          <div className="w-16"></div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6 space-y-4">
        {communityPosts.map(post => (
          <div key={post.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-semibold text-white">{post.title}</h3>
                <p className="text-sm text-purple-200">by {post.author}</p>
              </div>
              <span className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-xs">
                #{post.mood}
              </span>
            </div>
            <p className="text-white whitespace-pre-line mb-4">{post.content}</p>
            
            <div className="flex items-center gap-4 text-purple-200 text-sm border-t border-white/10 pt-4">
              <button 
                onClick={() => handleLike(post.id)}
                className="flex items-center gap-1 hover:text-pink-400 transition-colors"
              >
                <Heart className="w-4 h-4" /> {post.likes}
              </button>
              <button 
                onClick={() => toggleComments(post.id)}
                className="flex items-center gap-1 hover:text-blue-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> {post.comments.length}
              </button>
              <button 
                onClick={() => handleShare(post)}
                className="flex items-center gap-1 hover:text-green-400 transition-colors"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>

            {showComments[post.id] && (
              <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                {post.comments.map(comment => (
                  <div key={comment.id} className="bg-white/5 rounded-lg p-3">
                    <p className="text-sm font-semibold text-purple-200">{comment.author}</p>
                    <p className="text-white text-sm mt-1">{comment.text}</p>
                  </div>
                ))}
                
                <div className="flex gap-2 mt-3">
                  <input
                    type="text"
                    value={commentInputs[post.id] || ''}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddComment(post.id);
                      }
                    }}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-md w-full border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Share Post</h3>
              <button onClick={() => setShowShareModal(null)} className="text-purple-200 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => copyToClipboard(`App: ${showShareModal.title} by ${showShareModal.author}`)}
                className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all"
              >
                Copy Link
              </button>
              <button
                onClick={() => {
                  const text = encodeURIComponent(`${showShareModal.title} - ${showShareModal.author} on App`);
                  window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
                  setShowShareModal(null);
                }}
                className="w-full py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-xl text-white transition-all"
              >
                Share on Twitter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const WriteView = () => {
    const [localTitle, setLocalTitle] = useState(newPost.title);
    const [localContent, setLocalContent] = useState(newPost.content);
    const [localMood, setLocalMood] = useState(newPost.mood);

    const handleSubmit = () => {
      setNewPost({ title: localTitle, content: localContent, mood: localMood });
      handleCreatePost();
      setLocalTitle('');
      setLocalContent('');
      setLocalMood('hope');
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <nav className="bg-black/30 backdrop-blur-lg border-b border-white/10 p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <button onClick={() => setCurrentView('dashboard')} className="text-purple-200 hover:text-white">
              ← Back
            </button>
            <h2 className="text-xl font-semibold text-white">Share Your Writing</h2>
            <div className="w-16"></div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <input
              type="text"
              placeholder="Title (optional)"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-pink-400 mb-4"
            />
            
            <textarea
              placeholder="Pour your heart out..."
              value={localContent}
              onChange={(e) => setLocalContent(e.target.value)}
              rows="10"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-pink-400 mb-4"
            />

            <div className="flex gap-4 items-center mb-4">
              <label className="text-purple-200">Mood:</label>
              <select
                value={localMood}
                onChange={(e) => setLocalMood(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <option value="hope">Hope</option>
                <option value="sadness">Sadness</option>
                <option value="love">Love</option>
                <option value="joy">Joy</option>
                <option value="confusion">Confusion</option>
                <option value="loneliness">Loneliness</option>
              </select>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Share with Community
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {currentView === 'login' && <LoginView />}
      {currentView === 'dashboard' && <DashboardView />}
      {currentView === 'chat' && <ChatView />}
      {currentView === 'community' && <CommunityView />}
      {currentView === 'write' && <WriteView />}
    </div>
  );
};

export default App;