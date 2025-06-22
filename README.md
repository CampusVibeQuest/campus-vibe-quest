# MatchBench 💕

A modern campus dating app built with Expo Router and React Native, featuring anonymous confessions, matchmaking games, and real-world quests.

## Features

### 🏠 Home Feed
- Anonymous confession posts with reactions
- Date snap sharing with blur/unblur functionality
- Real-time like, laugh, and blush reactions
- Comment system for community engagement

### 💖 Match System
- Interactive "This or That" and "Truth or Dare" games
- Compatibility scoring based on game answers
- Quest system for real-world meetups
- Side quests for surprise interactions

### 👤 Profile Management
- User verification system
- Match history and statistics
- Premium membership features
- Account settings and preferences

## Tech Stack

- **Framework**: Expo Router 4.0.17 with Expo SDK 52
- **Language**: TypeScript
- **Navigation**: Expo Router with tab-based navigation
- **State Management**: React hooks with local storage
- **Authentication**: AsyncStorage for session management
- **Icons**: Lucide React Native
- **Styling**: React Native StyleSheet with custom gradients

## Getting Started

### Prerequisites
- Node.js 18+ 
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/match-bench.git
cd match-bench
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open the app:
   - Press `w` to open in web browser
   - Press `i` to open in iOS simulator
   - Press `a` to open in Android emulator
   - Scan QR code with Expo Go app on your phone

## Demo Account

Use these credentials to test the app:
- **Email**: aditi@usf.edu
- **Password**: aditi123

## Project Structure

```
app/
├── _layout.tsx          # Root layout with navigation
├── login.tsx            # Authentication screen
├── (tabs)/              # Tab-based navigation
│   ├── _layout.tsx      # Tab bar configuration
│   ├── index.tsx        # Home feed
│   ├── match.tsx        # Games and matching
│   └── profile.tsx      # User profile
└── +not-found.tsx       # 404 page

services/
├── AuthService.ts       # Authentication logic
└── DataService.ts       # Data management

assets/data/             # JSON data files
├── users.json
├── confessions.json
├── matches.json
├── games.json
└── quests.json
```

## Features in Detail

### Anonymous Confessions
- Users can post anonymous confessions or date snaps
- Automatic anonymous name generation
- Image blur/unblur functionality for privacy
- Reaction system with heart, laugh, and blush emojis

### Matchmaking Games
- "This or That" choice-based compatibility
- "Truth or Dare" text-based interactions
- Compatibility scoring algorithm
- Match notifications and management

### Quest System
- Location-based meetup challenges
- Color-coded outfit coordination
- Task completion tracking
- Side quest surprise system

### User Profiles
- Verification badge system
- Premium membership tiers
- Match statistics and history
- Department and year filtering

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with ❤️ using Expo and React Native
- Icons by Lucide
- Images from Pexels
- Inspired by modern campus dating culture

---

**Note**: This is a demo application with local data storage. For production use, implement proper backend services, real authentication, and data persistence.