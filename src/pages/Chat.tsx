import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Bot, Users } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Badge } from '@/components/ui/badge'

interface Message {
  id: number
  sender: string
  content: string
  timestamp: string
  isBot?: boolean
  isCurrentUser?: boolean
}

export function Chat() {
  const { user } = useAuthStore()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'AI Assistant',
      content: 'Hello! I\'m your MikanaOS AI assistant. I can help you with inventory analysis, sales forecasting, and answering questions about your operations. How can I assist you today?',
      timestamp: '10:00 AM',
      isBot: true,
    },
    {
      id: 2,
      sender: 'Sarah Johnson',
      content: 'Has anyone placed orders for Thursday dispatch yet?',
      timestamp: '10:15 AM',
    },
    {
      id: 3,
      sender: 'Mike Chen',
      content: 'Yes, I just submitted Branch B\'s order. Total of 15 items.',
      timestamp: '10:17 AM',
    },
  ])

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMessage: Message = {
      id: messages.length + 1,
      sender: user?.name || 'You',
      content: message,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isCurrentUser: true,
    }

    setMessages([...messages, newMessage])
    setMessage('')

    // Simulate AI response (in production, this would call an AI API)
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        sender: 'AI Assistant',
        content: 'I understand you have a question. In a production environment, I would provide intelligent responses based on your data and context. This is a placeholder for AI integration.',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isBot: true,
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const onlineUsers = [
    { name: 'Sarah Johnson', role: 'Branch Manager', online: true },
    { name: 'Mike Chen', role: 'Branch Manager', online: true },
    { name: 'Robert Smith', role: 'Head Office', online: false },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl font-bold tracking-tight">Team Chat</h1>
        <p className="text-muted-foreground mt-2">Communicate with team members and AI assistant</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  General Chat
                </CardTitle>
                <Badge variant="secondary">
                  <Bot className="h-3 w-3 mr-1" />
                  AI Enabled
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex gap-3 ${msg.isCurrentUser ? 'flex-row-reverse' : ''}`}
                    >
                      <Avatar className="h-8 w-8">
                        {msg.isBot && <Bot className="h-5 w-5 m-auto text-primary" />}
                        {!msg.isBot && (
                          <>
                            <AvatarImage src="" />
                            <AvatarFallback className={msg.isBot ? 'bg-primary' : 'bg-muted'}>
                              {msg.sender[0]}
                            </AvatarFallback>
                          </>
                        )}
                      </Avatar>
                      <div className={`flex-1 ${msg.isCurrentUser ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{msg.sender}</span>
                          <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                        </div>
                        <div
                          className={`rounded-lg px-4 py-2 max-w-[80%] ${
                            msg.isBot
                              ? 'bg-primary/10 border border-primary/20'
                              : msg.isCurrentUser
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message... (@ for AI assistant)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Online Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {onlineUsers.map((user, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${
                          user.online ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                AI Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Sales forecasting</p>
                <p>• Inventory optimization</p>
                <p>• Demand prediction</p>
                <p>• Smart recommendations</p>
                <p>• Report generation</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
