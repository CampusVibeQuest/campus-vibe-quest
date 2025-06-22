import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Users, MapPin, Trophy, Play, CircleCheck as CheckCircle, Clock, Star } from 'lucide-react-native';
import { DataService } from '@/services/DataService';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Match {
  match_id: string;
  user1: string;
  user2: string;
  status: string;
  compatibility: number;
  game_played: string;
  game_answers: {
    user1: string[];
    user2: string[];
  };
  quests: Array<{
    quest_id: string;
    quest_number: number;
    accepted_by: string[];
    completed: boolean;
  }>;
  side_quests: any[];
  date_snaps_uploaded: boolean;
}

interface Game {
  game_id: string;
  name: string;
  type: string;
  questions: Array<{ q: string }>;
}

interface Quest {
  quest_id: string;
  location: string;
  description: string;
  user1_task: string;
  user2_task: string;
}

export default function MatchScreen() {
  const [activeTab, setActiveTab] = useState<'games' | 'matches' | 'quests'>('games');
  const [matches, setMatches] = useState<Match[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [gameModalVisible, setGameModalVisible] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [matchesData, gamesData, questsData] = await Promise.all([
        DataService.getMatches(),
        DataService.getGames(),
        DataService.getQuests(),
      ]);
      
      setMatches(matchesData);
      setGames(gamesData);
      setQuests(questsData);
    } catch (error) {
      console.error('Error loading match data:', error);
    }
  };

  const startGame = (game: Game) => {
    setSelectedGame(game);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setGameModalVisible(true);
  };

  const answerQuestion = (answer: string) => {
    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);

    if (currentQuestionIndex < selectedGame!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Game completed
      setGameModalVisible(false);
      Alert.alert(
        'Game Complete!',
        'Your answers have been saved. We\'ll notify you when we find a match!',
        [{ text: 'OK' }]
      );
    }
  };

  const acceptQuest = (questId: string) => {
    Alert.alert(
      'Quest Accepted!',
      'You\'ve accepted this quest. We\'ll notify your match partner!',
      [{ text: 'OK' }]
    );
  };

  const renderGameCard = (game: Game) => (
    <View key={game.game_id} style={styles.card}>
      <View style={styles.cardHeader}>
        <Play size={24} color="#FF6B9D" />
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>{game.name}</Text>
          <Text style={styles.cardSubtitle}>
            {game.questions.length} questions • {game.type}
          </Text>
        </View>
      </View>
      <Text style={styles.cardDescription}>
        Play this game to find compatible matches based on your preferences!
      </Text>
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => startGame(game)}
      >
        <Text style={styles.primaryButtonText}>Play Game</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMatchCard = (match: Match) => (
    <View key={match.match_id} style={styles.card}>
      <View style={styles.cardHeader}>
        <Heart size={24} color="#FF6B9D" />
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>Match Found!</Text>
          <Text style={styles.cardSubtitle}>
            {match.compatibility}% compatibility
          </Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{match.status}</Text>
        </View>
      </View>
      
      <View style={styles.matchDetails}>
        <Text style={styles.matchText}>
          You both answered similarly in "{games.find(g => g.game_id === match.game_played)?.name}"
        </Text>
        
        {match.quests.length > 0 && (
          <View style={styles.questInfo}>
            <Text style={styles.questTitle}>Active Quests:</Text>
            {match.quests.map((quest, index) => (
              <View key={index} style={styles.questItem}>
                <CheckCircle 
                  size={16} 
                  color={quest.completed ? '#4CAF50' : '#FFA500'} 
                />
                <Text style={styles.questText}>Quest {quest.quest_number}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  const renderQuestCard = (quest: Quest) => (
    <View key={quest.quest_id} style={styles.card}>
      <View style={styles.cardHeader}>
        <MapPin size={24} color="#FF6B9D" />
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>{quest.location}</Text>
          <Text style={styles.cardSubtitle}>Quest Challenge</Text>
        </View>
      </View>
      
      <Text style={styles.cardDescription}>{quest.description}</Text>
      
      <View style={styles.questTasks}>
        <View style={styles.taskItem}>
          <Star size={16} color="#FFA500" />
          <Text style={styles.taskText}>Your task: {quest.user1_task}</Text>
        </View>
        <View style={styles.taskItem}>
          <Star size={16} color="#FFA500" />
          <Text style={styles.taskText}>Partner task: {quest.user2_task}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => acceptQuest(quest.quest_id)}
      >
        <Text style={styles.primaryButtonText}>Accept Quest</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FF6B9D', '#C147E9']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>MatchBench</Text>
        <Text style={styles.headerSubtitle}>Find Your Perfect Match</Text>
      </LinearGradient>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'games' && styles.activeTab]}
          onPress={() => setActiveTab('games')}
        >
          <Text style={[styles.tabText, activeTab === 'games' && styles.activeTabText]}>
            Games
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'matches' && styles.activeTab]}
          onPress={() => setActiveTab('matches')}
        >
          <Text style={[styles.tabText, activeTab === 'matches' && styles.activeTabText]}>
            Matches
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'quests' && styles.activeTab]}
          onPress={() => setActiveTab('quests')}
        >
          <Text style={[styles.tabText, activeTab === 'quests' && styles.activeTabText]}>
            Quests
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'games' && games.map(renderGameCard)}
        {activeTab === 'matches' && matches.map(renderMatchCard)}
        {activeTab === 'quests' && quests.map(renderQuestCard)}
      </ScrollView>

      <Modal
        visible={gameModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setGameModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedGame && (
              <>
                <Text style={styles.modalTitle}>{selectedGame.name}</Text>
                <Text style={styles.questionCounter}>
                  Question {currentQuestionIndex + 1} of {selectedGame.questions.length}
                </Text>
                
                <Text style={styles.question}>
                  {selectedGame.questions[currentQuestionIndex]?.q}
                </Text>

                {selectedGame.type === 'choice' && (
                  <View style={styles.choiceContainer}>
                    {selectedGame.questions[currentQuestionIndex]?.q.includes('or') && 
                      selectedGame.questions[currentQuestionIndex].q.split(' or ').map((option, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.choiceButton}
                          onPress={() => answerQuestion(option.replace('?', '').trim())}
                        >
                          <Text style={styles.choiceText}>
                            {option.replace('?', '').trim()}
                          </Text>
                        </TouchableOpacity>
                      ))
                    }
                  </View>
                )}

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setGameModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FF6B9D',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  statusBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  matchDetails: {
    marginBottom: 16,
  },
  matchText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  questInfo: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  questTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  questItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  questText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  questTasks: {
    marginBottom: 16,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  taskText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#FF6B9D',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  questionCounter: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  question: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  choiceContainer: {
    marginBottom: 24,
  },
  choiceButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  choiceText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  closeButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});