import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, MessageCircle, Smile, Eye, EyeOff } from 'lucide-react-native';
import { DataService } from '@/services/DataService';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Confession {
  id: string;
  type: string;
  author_uid: string;
  anon_name: string;
  text: string;
  image_url: string | null;
  blurred: boolean;
  timestamp: string;
  reactions: {
    heart: number;
    laugh: number;
    blush?: number;
    shy?: number;
  };
  comments: Array<{ user: string; text: string }>;
}

export default function HomeScreen() {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [reactedPosts, setReactedPosts] = useState<Set<string>>(new Set());
  const [blurredImages, setBlurredImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadConfessions();
  }, []);

  const loadConfessions = async () => {
    try {
      const data = await DataService.getConfessions();
      setConfessions(data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      
      // Set initially blurred images
      const blurred = new Set(data.filter(c => c.blurred).map(c => c.id));
      setBlurredImages(blurred);
    } catch (error) {
      console.error('Error loading confessions:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadConfessions();
    setRefreshing(false);
  };

  const handleReaction = (postId: string, reactionType: string) => {
    if (reactedPosts.has(postId)) return;

    setConfessions(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              reactions: {
                ...post.reactions,
                [reactionType]: (post.reactions[reactionType] || 0) + 1,
              },
            }
          : post
      )
    );

    setReactedPosts(prev => new Set([...prev, postId]));
  };

  const toggleBlur = (postId: string) => {
    setBlurredImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const renderConfession = (confession: Confession) => {
    const isBlurred = blurredImages.has(confession.id);
    const hasReacted = reactedPosts.has(confession.id);

    return (
      <View key={confession.id} style={styles.confessionCard}>
        <View style={styles.confessionHeader}>
          <View style={styles.anonInfo}>
            <View style={styles.anonAvatar}>
              <Text style={styles.anonAvatarText}>
                {confession.anon_name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.anonName}>{confession.anon_name}</Text>
              <Text style={styles.timeStamp}>{formatTime(confession.timestamp)}</Text>
            </View>
          </View>
          <View style={styles.typeTag}>
            <Text style={styles.typeTagText}>
              {confession.type === 'date_snap' ? '📸 Date Snap' : '💭 Confession'}
            </Text>
          </View>
        </View>

        <Text style={styles.confessionText}>{confession.text}</Text>

        {confession.image_url && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: `https://images.pexels.com/photos/3831645/pexels-photo-3831645.jpeg?auto=compress&cs=tinysrgb&w=800` }}
              style={[styles.confessionImage, isBlurred && styles.blurredImage]}
            />
            <TouchableOpacity
              style={styles.blurToggle}
              onPress={() => toggleBlur(confession.id)}
            >
              {isBlurred ? (
                <Eye size={20} color="white" />
              ) : (
                <EyeOff size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.reactions}>
          <TouchableOpacity
            style={[styles.reactionButton, hasReacted && styles.reactionButtonDisabled]}
            onPress={() => handleReaction(confession.id, 'heart')}
            disabled={hasReacted}
          >
            <Heart
              size={20}
              color={hasReacted ? '#ccc' : '#FF6B9D'}
              fill={hasReacted ? '#ccc' : 'none'}
            />
            <Text style={[styles.reactionCount, hasReacted && styles.reactionCountDisabled]}>
              {confession.reactions.heart}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.reactionButton, hasReacted && styles.reactionButtonDisabled]}
            onPress={() => handleReaction(confession.id, 'laugh')}
            disabled={hasReacted}
          >
            <Smile
              size={20}
              color={hasReacted ? '#ccc' : '#FFA500'}
            />
            <Text style={[styles.reactionCount, hasReacted && styles.reactionCountDisabled]}>
              {confession.reactions.laugh}
            </Text>
          </TouchableOpacity>

          {(confession.reactions.blush || confession.reactions.shy) && (
            <TouchableOpacity
              style={[styles.reactionButton, hasReacted && styles.reactionButtonDisabled]}
              onPress={() => handleReaction(confession.id, confession.reactions.blush ? 'blush' : 'shy')}
              disabled={hasReacted}
            >
              <Text style={styles.emojiReaction}>
                {confession.reactions.blush ? '😊' : '🙈'}
              </Text>
              <Text style={[styles.reactionCount, hasReacted && styles.reactionCountDisabled]}>
                {confession.reactions.blush || confession.reactions.shy}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.commentButton}>
            <MessageCircle size={20} color="#666" />
            <Text style={styles.commentCount}>{confession.comments.length}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FF6B9D', '#C147E9']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>MatchBench</Text>
        <Text style={styles.headerSubtitle}>Campus Confessions</Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {confessions.map(renderConfession)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  confessionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  confessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  anonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  anonAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B9D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  anonAvatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  anonName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timeStamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  typeTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeTagText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  confessionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  confessionImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  blurredImage: {
    opacity: 0.3,
  },
  blurToggle: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  reactions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  reactionButtonDisabled: {
    opacity: 0.5,
  },
  reactionCount: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  reactionCountDisabled: {
    color: '#ccc',
  },
  emojiReaction: {
    fontSize: 18,
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  commentCount: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
});