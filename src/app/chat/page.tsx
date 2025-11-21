'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Message {
  id: number;
  content: string;
  user: string;
  created_at: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState('Anônimo');

  useEffect(() => {
    // Buscar mensagens existentes
    fetchMessages();

    // Inscrever-se para novas mensagens
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) console.error('Erro ao buscar mensagens:', error);
    else setMessages(data || []);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const { error } = await supabase
      .from('messages')
      .insert([{ content: newMessage, user }]);

    if (error) console.error('Erro ao enviar mensagem:', error);
    else setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Chat Comunitário</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4 h-96 overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg.id} className="mb-2 p-2 bg-gray-100 rounded">
              <strong className="text-blue-600">{msg.user}:</strong> {msg.content}
              <span className="text-xs text-gray-500 ml-2">{new Date(msg.created_at).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Seu nome"
            className="flex-1 p-2 border rounded"
          />
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-3 p-2 border rounded"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}