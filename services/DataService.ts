// Mock data service that loads JSON data
// In a real app, this would make API calls

const usersData = [
  {
    "uid": "user_001",
    "name": "Aditi Sharma",
    "email": "aditi@usf.edu",
    "password": "aditi123",
    "gender": "female",
    "interested_in": "male",
    "department": "CSE",
    "year": "3rd",
    "profile_pic": "assets/images/user_001.jpg",
    "verified": true,
    "paid": true,
    "banned": false,
    "my_posts": ["post_009", "post_021"],
    "matches": ["match_101", "match_107"]
  },
  {
    "uid": "user_002",
    "name": "Riya Patel",
    "email": "riya@usf.edu",
    "password": "riya123",
    "gender": "female",
    "interested_in": "male",
    "department": "ECE",
    "year": "2nd",
    "profile_pic": "assets/images/user_002.jpg",
    "verified": false,
    "paid": false,
    "banned": false,
    "my_posts": [],
    "matches": []
  }
];

const confessionsData = [
  {
    "id": "post_009",
    "type": "date_snap",
    "author_uid": "user_001",
    "anon_name": "residentButterfly93",
    "text": "He actually wore green and brought coffee 😭",
    "image_url": "assets/images/snap_090.jpg",
    "blurred": true,
    "timestamp": "2025-06-19T17:40:00",
    "reactions": {
      "heart": 12,
      "laugh": 4,
      "blush": 2
    },
    "comments": [
      { "user": "anonFox88", "text": "OMG this is cute!" }
    ]
  },
  {
    "id": "post_021",
    "type": "confession",
    "author_uid": "user_001",
    "anon_name": "wildRose72",
    "text": "Saw someone reading poetry near the café... I might be in love.",
    "image_url": null,
    "blurred": false,
    "timestamp": "2025-06-19T12:10:00",
    "reactions": {
      "heart": 9,
      "laugh": 1,
      "shy": 3
    },
    "comments": []
  },
  {
    "id": "post_022",
    "type": "confession",
    "author_uid": "user_002",
    "anon_name": "mysteriousOwl47",
    "text": "Found a handwritten note in my textbook from last semester... it's actually really sweet 💕",
    "image_url": null,
    "blurred": false,
    "timestamp": "2025-06-19T10:30:00",
    "reactions": {
      "heart": 15,
      "laugh": 2,
      "blush": 5
    },
    "comments": [
      { "user": "anonymousReader", "text": "What did it say?!" },
      { "user": "bookwormSecret", "text": "This is so romantic!" }
    ]
  },
  {
    "id": "post_023",
    "type": "date_snap",
    "author_uid": "user_003",
    "anon_name": "shyPanda22",
    "text": "We ended up studying together for 3 hours... best study session ever! 📚✨",
    "image_url": "assets/images/study_date.jpg",
    "blurred": true,
    "timestamp": "2025-06-19T08:15:00",
    "reactions": {
      "heart": 20,
      "laugh": 3,
      "blush": 8
    },
    "comments": [
      { "user": "studyBuddy99", "text": "Goals!! 😍" }
    ]
  }
];

const matchesData = [
  {
    "match_id": "match_101",
    "user1": "user_001",
    "user2": "user_003",
    "status": "quest_pending",
    "compatibility": 78,
    "game_played": "game_001",
    "game_answers": {
      "user1": ["Coffee", "Beach"],
      "user2": ["Coffee", "Mountain"]
    },
    "quests": [
      {
        "quest_id": "quest_001",
        "quest_number": 1,
        "accepted_by": ["user_001", "user_003"],
        "completed": true
      }
    ],
    "side_quests": [],
    "date_snaps_uploaded": true
  },
  {
    "match_id": "match_102",
    "user1": "user_001",
    "user2": "user_004",
    "status": "active",
    "compatibility": 85,
    "game_played": "game_002",
    "game_answers": {
      "user1": ["Books", "Introvert"],
      "user2": ["Books", "Ambivert"]
    },
    "quests": [
      {
        "quest_id": "quest_002",
        "quest_number": 1,
        "accepted_by": ["user_001"],
        "completed": false
      }
    ],
    "side_quests": ["side_001"],
    "date_snaps_uploaded": false
  }
];

const gamesData = [
  {
    "game_id": "game_001",
    "name": "This or That",
    "type": "choice",
    "questions": [
      { "q": "Coffee or Tea?" },
      { "q": "Beach or Mountain?" },
      { "q": "Movies or Books?" },
      { "q": "Early Bird or Night Owl?" },
      { "q": "Pizza or Pasta?" }
    ]
  },
  {
    "game_id": "game_002",
    "name": "Truth or Dare",
    "type": "text",
    "questions": [
      { "q": "What was your most embarrassing crush moment?" },
      { "q": "Dare: Send a 😂 emoji to your crush." },
      { "q": "What's your ideal first date?" },
      { "q": "Dare: Post a funny selfie on your story." }
    ]
  },
  {
    "game_id": "game_003",
    "name": "Personality Match",
    "type": "choice",
    "questions": [
      { "q": "Introvert or Extrovert?" },
      { "q": "Spontaneous or Planned?" },
      { "q": "Leader or Follower?" },
      { "q": "Thinker or Feeler?" }
    ]
  }
];

const questsData = [
  {
    "quest_id": "quest_001",
    "location": "Library Bench",
    "description": "Meet at library bench wearing color-coded outfits.",
    "user1_task": "Wear green and bring a book",
    "user2_task": "Wear red and bring a coffee"
  },
  {
    "quest_id": "quest_002",
    "location": "Café Stairs",
    "description": "Swap drinks at the stairs after class.",
    "user1_task": "Buy chai and offer it",
    "user2_task": "Bring water and write a one-liner on the bottle"
  },
  {
    "quest_id": "quest_003",
    "location": "Study Hall",
    "description": "Study together for exactly 45 minutes, then grab lunch.",
    "user1_task": "Bring snacks and your favorite study playlist",
    "user2_task": "Find a good study spot and bring extra pens"
  },
  {
    "quest_id": "quest_004",
    "location": "Campus Garden",
    "description": "Meet at the garden during sunset with a small gift.",
    "user1_task": "Bring a flower and write a haiku",
    "user2_task": "Bring chocolate and take a photo together"
  }
];

const sideQuestsData = [
  {
    "side_quest_id": "side_001",
    "description": "Deliver a chocolate milkshake to her class at 2PM (ECE Dept). Leave it with a note: 'From your vibe partner 💌'. Don't be seen."
  },
  {
    "side_quest_id": "side_002",
    "description": "Leave a cute sticky note on their favorite library book with a compliment and your anonymous username."
  }
];

export class DataService {
  static async getUsers() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return usersData;
  }

  static async getConfessions() {
    await new Promise(resolve => setTimeout(resolve, 100));
    return confessionsData;
  }

  static async getMatches() {
    await new Promise(resolve => setTimeout(resolve, 100));
    return matchesData;
  }

  static async getGames() {
    await new Promise(resolve => setTimeout(resolve, 100));
    return gamesData;
  }

  static async getQuests() {
    await new Promise(resolve => setTimeout(resolve, 100));
    return questsData;
  }

  static async getSideQuests() {
    await new Promise(resolve => setTimeout(resolve, 100));
    return sideQuestsData;
  }

  static async getUserById(uid: string) {
    const users = await this.getUsers();
    return users.find(user => user.uid === uid);
  }

  static async getConfessionsByUser(uid: string) {
    const confessions = await this.getConfessions();
    return confessions.filter(confession => confession.author_uid === uid);
  }

  static async getMatchesByUser(uid: string) {
    const matches = await this.getMatches();
    return matches.filter(match => match.user1 === uid || match.user2 === uid);
  }
}