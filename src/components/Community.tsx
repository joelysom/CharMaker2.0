import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  MessageCircle, 
  Heart, 
  Share2, 
  Send,
  TrendingUp,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserData } from '../App';

type CommunityProps = {
  userData: UserData;
  onBack: () => void;
};

type Post = {
  id: number;
  author: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  category: string;
};

const initialPosts: Post[] = [
  {
    id: 1,
    author: 'Mariana Santos',
    avatar: '👩🏿',
    time: 'há 2 horas',
    content: 'Acabei de fazer o quiz e aprendi muito! É importante refletirmos sobre nossas atitudes diárias. Alguém mais teve insights interessantes?',
    likes: 24,
    comments: 8,
    category: 'Reflexão'
  },
  {
    id: 2,
    author: 'Carlos Eduardo',
    avatar: '👨🏾',
    time: 'há 5 horas',
    content: 'Visitei o Museu do Homem do Nordeste hoje e foi uma experiência incrível! Recomendo muito para quem quer conhecer mais sobre nossa história e cultura.',
    likes: 45,
    comments: 12,
    category: 'Cultura'
  },
  {
    id: 3,
    author: 'Júlia Oliveira',
    avatar: '👩🏾',
    time: 'há 1 dia',
    content: 'Estou lendo "Pequeno Manual Antirracista" da Djamila Ribeiro e está transformando minha perspectiva. Quem mais já leu? Vamos trocar ideias!',
    likes: 67,
    comments: 23,
    category: 'Literatura'
  },
  {
    id: 4,
    author: 'Roberto Lima',
    avatar: '🧑🏿',
    time: 'há 2 dias',
    content: 'Descobri um coletivo incrível no Recife que promove atividades culturais afrocentradas. Alguém conhece outros espaços assim na região?',
    likes: 31,
    comments: 15,
    category: 'Comunidade'
  }
];

export function Community({ userData, onBack }: CommunityProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [newPost, setNewPost] = useState('');
  const [activeTab, setActiveTab] = useState<'recent' | 'trending'>('recent');

  const handleSubmitPost = () => {
    if (newPost.trim()) {
      const post: Post = {
        id: posts.length + 1,
        author: userData.name,
        avatar: userData.avatar,
        time: 'agora',
        content: newPost,
        likes: 0,
        comments: 0,
        category: 'Compartilhamento'
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-purple-800">Comunidade</h1>
          <p className="text-gray-600">Compartilhe experiências e aprenda com outras pessoas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post */}
          <Card className="p-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">{userData.avatar}</span>
              </div>
              <div className="flex-grow">
                <Textarea
                  placeholder="Compartilhe suas reflexões, experiências ou perguntas..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="mb-3 min-h-[100px]"
                />
                <Button onClick={handleSubmitPost} disabled={!newPost.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  Publicar
                </Button>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'recent' ? 'default' : 'outline'}
              onClick={() => setActiveTab('recent')}
              className="flex-1"
            >
              <Clock className="w-4 h-4 mr-2" />
              Recentes
            </Button>
            <Button
              variant={activeTab === 'trending' ? 'default' : 'outline'}
              onClick={() => setActiveTab('trending')}
              className="flex-1"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Em Alta
            </Button>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  {/* Post Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">{post.avatar}</span>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-gray-800">{post.author}</p>
                        <Badge variant="secondary" className="text-xs">
                          {post.category}
                        </Badge>
                      </div>
                      <p className="text-gray-500 text-sm">{post.time}</p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-gray-700 mb-4">{post.content}</p>

                  {/* Post Actions */}
                  <div className="flex items-center gap-6 pt-4 border-t">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors ml-auto">
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm">Compartilhar</span>
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Community Guidelines */}
          <Card className="p-6">
            <h3 className="text-purple-800 mb-4">Diretrizes da Comunidade</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Respeite todas as pessoas e suas experiências</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Compartilhe conhecimento e aprenda com empatia</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Denuncie comportamentos inadequados</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Celebre a diversidade e a inclusão</span>
              </li>
            </ul>
          </Card>

          {/* Topics */}
          <Card className="p-6">
            <h3 className="text-purple-800 mb-4">Tópicos Populares</h3>
            <div className="flex flex-wrap gap-2">
              <Badge className="cursor-pointer hover:bg-purple-600">#Reflexão</Badge>
              <Badge className="cursor-pointer hover:bg-purple-600">#Cultura</Badge>
              <Badge className="cursor-pointer hover:bg-purple-600">#Literatura</Badge>
              <Badge className="cursor-pointer hover:bg-purple-600">#Música</Badge>
              <Badge className="cursor-pointer hover:bg-purple-600">#Cinema</Badge>
              <Badge className="cursor-pointer hover:bg-purple-600">#História</Badge>
              <Badge className="cursor-pointer hover:bg-purple-600">#Ativismo</Badge>
              <Badge className="cursor-pointer hover:bg-purple-600">#Educação</Badge>
            </div>
          </Card>

          {/* Stats */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50">
            <h3 className="text-purple-800 mb-4">Nossa Comunidade</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Membros ativos</span>
                <span className="text-purple-800">1.247</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Posts esta semana</span>
                <span className="text-purple-800">342</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Conexões criadas</span>
                <span className="text-purple-800">5.891</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
