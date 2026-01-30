import { useState } from 'react'
import { ArrowLeft, Send, Search, MoreVertical, Phone, Video, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ChatsPage({ onBack, userType = 'farmer' }) {
  const { isDark, toggleTheme } = useTheme()
  const [selectedChat, setSelectedChat] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [messageText, setMessageText] = useState('')

  // Mock chat data
  const [chats, setChats] = useState([
    {
      id: 1,
      name: userType === 'farmer' ? 'Rajesh Patel' : 'Fresh Farms Punjab',
      image: '👨‍🌾',
      lastMessage: 'Available wheat at ₹2500/quintal',
      timestamp: '10:30 AM',
      unread: 2,
      online: true,
      messages: [
        { id: 1, sender: 'other', text: 'Hi, do you have fresh wheat?', time: '9:45 AM' },
        { id: 2, sender: 'other', text: 'Available wheat at ₹2500/quintal', time: '10:30 AM' },
      ]
    },
    {
      id: 2,
      name: userType === 'farmer' ? 'Priya Singh' : 'Organic Valley Farm',
      image: '👩‍🌾',
      lastMessage: 'Quality assured vegetables',
      timestamp: 'Yesterday',
      unread: 0,
      online: false,
      messages: [
        { id: 1, sender: 'other', text: 'Quality assured vegetables', time: 'Yesterday' },
      ]
    },
    {
      id: 3,
      name: userType === 'farmer' ? 'Ahmed Khan' : 'Green Harvest Co.',
      image: '👨‍💼',
      lastMessage: 'Interested in bulk orders',
      timestamp: '2 days ago',
      unread: 0,
      online: true,
      messages: [
        { id: 1, sender: 'other', text: 'Interested in bulk orders', time: '2 days ago' },
      ]
    },
  ])

  const handleSendMessage = () => {
    if (messageText.trim() && selectedChat) {
      const updatedChats = chats.map(chat => {
        if (chat.id === selectedChat.id) {
          return {
            ...chat,
            messages: [
              ...chat.messages,
              { id: chat.messages.length + 1, sender: 'you', text: messageText, time: 'now' }
            ],
            lastMessage: messageText
          }
        }
        return chat
      })
      setChats(updatedChats)
      setSelectedChat(updatedChats.find(c => c.id === selectedChat.id))
      setMessageText('')
    }
  }

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-linear-to-b from-teal-50 via-white to-teal-50'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-30 backdrop-blur-md transition-colors ${
        isDark 
          ? 'bg-slate-800/80 border-slate-700/50' 
          : 'bg-white/80 border-white/50'
      } border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className={`flex items-center gap-2 font-semibold transition-colors ${
                isDark ? 'text-slate-400 hover:text-teal-400' : 'text-slate-600 hover:text-teal-600'
              }`}
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
            <h1 className="text-2xl font-bold">Messages</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-80px)] flex gap-6">
        {/* Chat List */}
        <div className={`w-full md:w-80 rounded-2xl shadow-lg overflow-hidden flex flex-col ${
          isDark ? 'bg-slate-800' : 'bg-white'
        } ${selectedChat && window.innerWidth < 768 ? 'hidden' : ''}`}>
          {/* Search */}
          <div className="p-4 border-b border-slate-700/50">
            <div className="relative">
              <Search className={`absolute left-3 top-3 w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all border-0 ${
                  isDark
                    ? 'bg-slate-700 text-slate-100 placeholder-slate-400'
                    : 'bg-slate-100 text-slate-900 placeholder-slate-600'
                }`}
              />
            </div>
          </div>

          {/* Chat List Items */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map(chat => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`w-full p-4 border-b border-slate-700/30 transition-all text-left hover:${isDark ? 'bg-slate-700/50' : 'bg-slate-50'} ${
                  selectedChat?.id === chat.id
                    ? isDark ? 'bg-slate-700' : 'bg-teal-50'
                    : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative text-2xl">{chat.image}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold truncate">{chat.name}</h3>
                      <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{chat.timestamp}</span>
                    </div>
                    <p className={`text-sm truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unread > 0 && (
                    <span className="bg-teal-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        {selectedChat ? (
          <div className={`flex-1 rounded-2xl shadow-lg overflow-hidden flex flex-col ${
            isDark ? 'bg-slate-800' : 'bg-white'
          }`}>
            {/* Chat Header */}
            <div className={`p-4 border-b border-slate-700/50 flex items-center justify-between ${
              isDark ? 'bg-slate-700/50' : 'bg-slate-50'
            }`}>
              <div className="flex items-center gap-3 flex-1 md:hidden">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="text-slate-600 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative text-3xl">{selectedChat.image}</div>
                <div>
                  <h2 className="font-semibold">{selectedChat.name}</h2>
                  <p className={`text-xs ${selectedChat.online ? 'text-green-500' : isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {selectedChat.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className={`p-2 rounded-full transition-all ${isDark ? 'hover:bg-slate-600' : 'hover:bg-slate-200'}`}>
                  <Phone className="w-5 h-5 text-teal-600" />
                </button>
                <button className={`p-2 rounded-full transition-all ${isDark ? 'hover:bg-slate-600' : 'hover:bg-slate-200'}`}>
                  <Video className="w-5 h-5 text-teal-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedChat.messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'you' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.sender === 'you'
                        ? 'bg-teal-600 text-white rounded-br-none'
                        : isDark ? 'bg-slate-700 text-slate-100 rounded-bl-none' : 'bg-slate-200 text-slate-900 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === 'you' ? 'text-teal-100' : isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className={`p-4 border-t border-slate-700/50 ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className={`flex-1 px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all border-0 ${
                    isDark
                      ? 'bg-slate-600 text-slate-100 placeholder-slate-400'
                      : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-600'
                  }`}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-full transition-all flex items-center justify-center"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={`flex-1 rounded-2xl shadow-lg hidden md:flex items-center justify-center flex-col gap-4 ${
            isDark ? 'bg-slate-800' : 'bg-white'
          }`}>
            <div className="text-6xl">💬</div>
            <p className={`text-lg font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Select a conversation to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
