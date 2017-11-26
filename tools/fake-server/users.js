const users = [
  {
    username: 'alvin',
    password: 'alvinalvin',
    givenName: 'Alvin',
    familyName: 'Leung',
    fullName: 'Alvin Leung',
    phoneNumber: '12345678',
    email: 'alvin@wecode.com',
    roles: ['student'],
    avatar: require('./avatars/alvin.js'),
    wallet: {
      balance: 100
    }
  },
  {
    username: 'george',
    password: 'georgegeorge',
    givenName: 'George',
    familyName: 'M',
    fullName: 'George M',
    phoneNumber: '54321684',
    email: 'george@hku.com',
    roles: ['tutor'],
    avatar: require('./avatars/george.js'),
    wallet: {
      balance: 100
    },

    type: 'contracted',
    biography: 'I am a teacher',
    university: 'HKU',
    courseCode: ['COMP3297'],
    subjectTags: ['CS', 'JAVA'],
    hourlyRate: '0.00',
    averageReviewScore: 4
  },
  {
    username: 'jolly',
    password: 'jollyjolly',
    givenName: 'Jolly',
    familyName: 'Lam',
    fullName: 'Jolly Lam',
    phoneNumber: '12312378',
    email: 'jolly@cs.com',
    roles: ['tutor'],
    avatar: require('./avatars/jolly.js'),
    wallet: {
      balance: 100
    },

    type: 'private',
    biography: 'I am a tutor',
    university: 'HKU',
    courseCode: ['COMP3296'],
    subjectTags: ['F#', 'VB'],
    hourlyRate: '30.00',
    averageReviewScore: 3
  }
];
users.forEach((u, i) => u.id = i);

module.exports = class Users {

  static getUserById(id) {
    return users[id];
  }

  static getUserByUsernameAndPassword(username, password) {
    return users.find(u => u.username === username && u.password === password);
  }

  static getTutors(params) {
    return users.filter(u => u.roles.includes('tutor'));
  }

  static getTutorByUsername(username) {
    return users.find(u => u.username === username && u.roles.includes('tutor'));
  }

}
