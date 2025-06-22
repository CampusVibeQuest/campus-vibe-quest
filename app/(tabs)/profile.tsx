import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User, 
  Heart, 
  MessageSquare, 
  Settings, 
  LogOut,
  Star,
  Award,
  MapPin
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { DataService } from '@/services/DataService';

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  gender: string;
  interested_in: string;
  department: string;
  year: string;
  profile_pic: string;
  verified: boolean;
  paid: boolean;
  banned: boolean;
  my_posts: string[];
  matches: string[];
}

export default function ProfileScreen() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState({
    totalMatches: 0,
    totalPosts: 0,
    questsCompleted: 0,
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const session = await AsyncStorage.getItem('userSession');
      if (session) {
        const userData = JSON.parse(session);
        setUser(userData);
        
        // Calculate stats
        const matches = await DataService.getMatches();
        const userMatches = matches.filter(m => 
          m.user1 === userData.uid || m.user2 === userData.uid
        );
        
        const completedQuests = userMatches.reduce((total, match) => {
          return total + match.quests.filter(q => q.completed).length;
        }, 0);

        setStats({
          totalMatches: userMatches.length,
          totalPosts: userData.my_posts.length,
          questsCompleted: completedQuests,
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('userSession');
            router.replace('/login');
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FF6B9D', '#C147E9']}
        style={styles.header}
      >
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=300' }}
              style={styles.profileImage}
            />
            {user.verified && (
              <View style={styles.verifiedBadge}>
                <Star size={16} color="#FFA500" fill="#FFA500" />
              </View>
            )}
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileDetails}>
              {user.department} • {user.year} Year
            </Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Heart size={24} color="#FF6B9D" />
            <Text style={styles.statNumber}>{stats.totalMatches}</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
          
          <View style={styles.statItem}>
            <MessageSquare size={24} color="#C147E9" />
            <Text style={styles.statNumber}>{stats.totalPosts}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          
          <View style={styles.statItem}>
            <Award size={24} color="#FFA500" />
            <Text style={styles.statNumber}>{stats.questsCompleted}</Text>
            <Text style={styles.statLabel}>Quests</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Status</Text>
          
          <View style={styles.statusCard}>
            <View style={styles.statusItem}>
              <View style={styles.statusInfo}>
                <Text style={styles.statusLabel}>Verification Status</Text>
                <Text style={[styles.statusValue, user.verified && styles.statusVerified]}>
                  {user.verified ? 'Verified' : 'Not Verified'}
                </Text>
              </View>
              {user.verified && <Star size={20} color="#FFA500" fill="#FFA500" />}
            </View>
            
            <View style={styles.statusItem}>
              <View style={styles.statusInfo}>
                <Text style={styles.statusLabel}>Premium Status</Text>
                <Text style={[styles.statusValue, user.paid && styles.statusPremium]}>
                  {user.paid ? 'Premium Member' : 'Free Member'}
                </Text>
              </View>
              {user.paid && <Award size={20} color="#FF6B9D" />}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.preferencesCard}>
            <View style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>Looking For</Text>
              <Text style={styles.preferenceValue}>
                {user.interested_in.charAt(0).toUpperCase() + user.interested_in.slice(1)}
              </Text>
            </View>
            
            <View style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>Department</Text>
              <Text style={styles.preferenceValue}>{user.department}</Text>
            </View>
            
            <View style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>Academic Year</Text>
              <Text style={styles.preferenceValue}>{user.year} Year</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <TouchableOpacity style={styles.actionButton}>
            <Settings size={20} color="#666" />
            <Text style={styles.actionButtonText}>Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <User size={20} color="#666" />
            <Text style={styles.actionButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <MapPin size={20} color="#666" />
            <Text style={styles.actionButtonText}>Privacy Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.logoutButton]} 
            onPress={handleLogout}
          >
            <LogOut size={20} color="#FF4444" />
            <Text style={[styles.actionButtonText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'white',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileDetails: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statusInfo: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  statusVerified: {
    color: '#4CAF50',
  },
  statusPremium: {
    color: '#FF6B9D',
  },
  preferencesCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  preferenceLabel: {
    fontSize: 14,
    color: '#666',
  },
  preferenceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: 8,
  },
  logoutText: {
    color: '#FF4444',
  },
});