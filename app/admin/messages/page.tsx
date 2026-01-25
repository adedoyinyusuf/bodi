'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/auth'
import { Trash2, Mail, Phone, Calendar } from 'lucide-react'

interface Message {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  created_at: string
}

export default function AdminMessagesPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login')
      return
    }

    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/admin/messages')
        if (response.ok) {
          const data = await response.json()
          setMessages(data)
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [router])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setMessages(messages.filter((m) => m.id !== id))
        setDeleteConfirm(null)
        if (selectedMessage?.id === id) {
          setSelectedMessage(null)
        }
      }
    } catch (error) {
      console.error('Failed to delete message:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground mt-2">Contact form submissions from your visitors</p>
      </div>

      {/* Messages List and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold text-foreground">All Messages ({messages.length})</h2>
            </div>
            {messages.length > 0 ? (
              <div className="divide-y divide-border max-h-96 overflow-y-auto">
                {messages.map((message) => (
                  <button
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={`w-full p-4 text-left hover:bg-accent/50 transition-colors ${
                      selectedMessage?.id === message.id ? 'bg-accent' : ''
                    }`}
                  >
                    <p className="font-medium text-foreground truncate">{message.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{message.email}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(message.created_at).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">No messages</div>
            )}
          </div>
        </div>

        {/* Message Details */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white rounded-lg border border-border p-6 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedMessage.name}</h2>
                  <p className="text-muted-foreground mt-1">{new Date(selectedMessage.created_at).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => setDeleteConfirm(selectedMessage.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={20} className="text-red-600" />
                </button>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-muted-foreground" />
                  <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-muted-foreground" />
                    <a href={`tel:${selectedMessage.phone}`} className="text-primary hover:underline">
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className="pt-4 border-t border-border">
                <h3 className="font-semibold text-foreground mb-3">Message</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-border flex gap-3">
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity text-center font-medium"
                >
                  Reply via Email
                </a>
                {selectedMessage.phone && (
                  <a
                    href={`https://wa.me/${selectedMessage.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:opacity-90 transition-opacity text-center font-medium"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-border p-12 text-center">
              <Mail size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold text-foreground mb-4">Delete Message?</h2>
            <p className="text-muted-foreground mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
