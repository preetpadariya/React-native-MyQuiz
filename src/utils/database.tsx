import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = 'QuestionAppDatabasee';
const database_version = '1.0';
const database_displayname = 'SQLite Signup Database';
const database_size = 200000000;

let db: any;

export const initDatabase = async () => {
  try {
    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size,
    );
    console.log('Database openeggddfd');
    db.then(async tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, user_type INTEGER, phone TEXT, password TEXT, responsed INTEGER, image TEXT)',
      );
      // tx.executeSql(
      //   'INSERT INTO Users (name, user_type, phone, password, responsed) VALUES ("Preet User", 0, "1234567891", "123456", 0)',
      // );

      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Questions (id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT, option1 TEXT, option2 TEXT, option3 TEXT, option4 TEXT, answer TEXT)',
      );

      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Responses (id INTEGER PRIMARY KEY AUTOINCREMENT, questionId INTEGER, userId INTEGER, userAnswer TEXT)',
      );
      // Check if admin user already exists
      const adminCheckQuery = 'SELECT * FROM Users WHERE user_type = 1 LIMIT 1';
      const [result] = await tx.executeSql(adminCheckQuery);

      if (result.rows.length === 0) {
        // Insert admin user if not exists
        const insertAdminQuery =
          'INSERT INTO Users (name, user_type, phone, password, responsed) VALUES (?, ?, ?, ?, ?)';
        tx.executeSql(insertAdminQuery, ['Preet Admin', 1, '1234567890', '123456', 0]);
        console.log('Admin user inserted successfully');
      } else {
        console.log('Admin user already exists');
      }
    });
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error initializing database: ', error);
  }
};

// User functions

export const insertUser = async (
  name: string,
  phone: string,
  password: string,
  image: string, // New parameter for image file name
) => {
  try {
    const dbInstance = await db;

    // Check if user with the same phone number already exists
    const checkUserQuery = 'SELECT * FROM Users WHERE phone = ?';
    const [result] = await dbInstance.executeSql(checkUserQuery, [phone]);

    if (result.rows.length > 0) {
      // User with this phone number already exists
      throw new Error('User with this phone number already exists.');
    } else {
      // Insert the new user
      await dbInstance.executeSql(
        'INSERT INTO Users (name, user_type, phone, password, responsed, image) VALUES (?, ?, ?, ?, ?, ?)',
        [name, 0, phone, password, 0, image], // Include image file name
      );

      // Retrieve the inserted user details
      const selectUserQuery = 'SELECT * FROM Users WHERE phone = ?';
      const insertResult = await dbInstance.executeSql(selectUserQuery, [phone]);

      if (insertResult[0].rows.length > 0) {
        const user = insertResult[0].rows.item(0);
        console.log('User inserted successfully:', user);
        return user; // Return the inserted user details if needed
      } else {
        console.log('User inserted but not found in database.');
      }
    }
  } catch (error) {
    console.error('Error inserting user: ', error);
    throw error; // Rethrow the error for the caller to handle
  }
};


export const getUserByPhonePassword = async (
  phone: string,
  password: string,
) => {
  try {
    const dbInstance = await db;
    const results = await dbInstance.executeSql(
      'SELECT * FROM Users WHERE phone = ? AND password = ?',
      [phone, password],
    );
    if (results[0].rows.length > 0) {
      return results[0].rows.item(0);
    } else {
      console.log('User not found');
      return null;
    }
  } catch (error) {
    console.error('Error getting user: ', error);
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const dbInstance = await db;
    const results = await dbInstance.executeSql(
      'SELECT * FROM Users WHERE user_type = 0',
    );
    let users = [];
    for (let i = 0; i < results[0].rows.length; i++) {
      users.push(results[0].rows.item(i));
    }
    return users;
  } catch (error) {
    console.error('Error fetching users: ', error);
    return [];
  }
};

export const deleteUser = async (id: any) => {
  try {
    const dbInstance = await db;
    await dbInstance.executeSql('DELETE FROM Users WHERE id = ?', [id]);
    console.log(`User with id ${id} deleted successfully`);
  } catch (error) {
    console.error('Error deleting user: ', error);
  }
};

export const updateUser = async (id, name, phone, password, image) => {
  try {
    const dbInstance = await db;
    await dbInstance.executeSql(
      'UPDATE Users SET name = ?, phone = ?, password = ?, image = ? WHERE id = ?',
      [name, phone, password, image, id],
    );

    console.log(`User with id ${id} updated successfully`);

    const results = await dbInstance.executeSql(
      'SELECT * FROM Users WHERE id = ?',
      [id],
    );

    if (results[0].rows.length > 0) {
      const updatedUser = results[0].rows.item(0);
      console.log('Updated User:', updatedUser);
      return updatedUser;
    } else {
      console.log('User not found after update');
      return null;
    }
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
};

// Question functions

export const insertQuestion = async (
  question,
  option1,
  option2,
  option3,
  option4,
  answer,
) => {
  try {
    const dbInstance = await db;
    await dbInstance.executeSql(
      'INSERT INTO Questions (question, option1, option2, option3, option4, answer) VALUES (?, ?, ?, ?, ?, ?)',
      [question, option1, option2, option3, option4, answer],
    );

    const results = await dbInstance.executeSql(
      'SELECT * FROM Questions WHERE question = ?',
      [question],
    );

    if (results[0].rows.length > 0) {
      const insertedQuestion = results[0].rows.item(0);
      console.log('Question inserted successfully:', insertedQuestion);
      return insertedQuestion;
    } else {
      console.log('Question inserted but not found in database.');
    }
  } catch (error) {
    console.error('Error inserting question:', error);
  }
};

export const updateQuestion = async (
  id,
  question,
  option1,
  option2,
  option3,
  option4,
  answer,
) => {
  try {
    const dbInstance = await db;
    await dbInstance.executeSql(
      'UPDATE Questions SET question = ?, option1 = ?, option2 = ?, option3 = ?, option4 = ?, answer = ? WHERE id = ?',
      [question, option1, option2, option3, option4, answer, id],
    );

    console.log(`Question with id ${id} updated successfully`);

    const results = await dbInstance.executeSql(
      'SELECT * FROM Questions WHERE id = ?',
      [id],
    );

    if (results[0].rows.length > 0) {
      const updatedQuestion = results[0].rows.item(0);
      console.log('Updated Question:', updatedQuestion);
      return updatedQuestion;
    } else {
      console.log('Question not found after update');
      return null;
    }
  } catch (error) {
    console.error('Error updating question:', error);
  }
};

export const deleteQuestion = async id => {
  try {
    const dbInstance = await db;
    await dbInstance.executeSql('DELETE FROM Questions WHERE id = ?', [id]);
    console.log(`Question with id ${id} deleted successfully`);
  } catch (error) {
    console.error('Error deleting question:', error);
  }
};

export const getAllQuestions = async () => {
  try {
    const dbInstance = await db;
    const results = await dbInstance.executeSql('SELECT * FROM Questions');
    let questions = [];
    for (let i = 0; i < results[0].rows.length; i++) {
      questions.push(results[0].rows.item(i));
    }
    console.log('Questions:', questions);
    return questions;
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
};

export const truncateQuestions = async () => {
  try {
    const dbInstance = await db;
    await dbInstance.executeSql('DELETE FROM Questions');
    console.log('All questions deleted successfully');
  } catch (error) {
    console.error('Error truncating questions:', error);
  }
};

// Response functions

export const truncateResponse = async () => {
  try {
    const dbInstance = await db;
    await dbInstance.executeSql('DELETE FROM Responses');
    console.log('All Responses deleted successfully');
  } catch (error) {
    console.error('Error truncating questions:', error);
  }
};

export const insertResponse = async (questionId, userId, userAnswer) => {
  try {
    const dbInstance = await db;
    await dbInstance.executeSql(
      'INSERT INTO Responses (questionId, userId, userAnswer) VALUES (?, ?, ?)',
      [questionId, userId, userAnswer],
    );
    console.log('Response inserted successfully');
  } catch (error) {
    console.error('Error inserting response:', error);
  }
};

export const hasUserRespondedToQuestion = async (questionId, userId) => {
  try {
    const dbInstance = await db;
    const results = await dbInstance.executeSql(
      'SELECT * FROM Responses WHERE questionId = ? AND userId = ?',
      [questionId, userId],
    );
    return results[0].rows.length > 0;
  } catch (error) {
    console.error('Error checking response:', error);
    return false;
  }
};

export const addResponse = async (questionId, userId, userAnswer) => {
  try {
    const dbInstance = await db;
    await dbInstance.executeSql(
      'INSERT INTO Responses (questionId, userId, userAnswer) VALUES (?, ?, ?)',
      [questionId, userId, userAnswer],
    );
    console.log('Response added successfully');
  } catch (error) {
    console.error('Error adding response: ', error);
  }
};

export const areAllQuestionsAttempted = async userId => {
  try {
    const dbInstance = await db;
    const questionsResult = await dbInstance.executeSql(
      'SELECT COUNT(*) AS totalQuestions FROM Questions',
    );
    const responsesResult = await dbInstance.executeSql(
      'SELECT COUNT(DISTINCT questionId) AS respondedQuestions FROM Responses WHERE userId = ?',
      [userId],
    );

    const totalQuestions = questionsResult[0].rows.item(0).totalQuestions;
    const respondedQuestions =
      responsesResult[0].rows.item(0).respondedQuestions;

    return respondedQuestions === totalQuestions;
  } catch (error) {
    console.error('Error checking if all questions are attempted:', error);
    return false;
  }
};

export const getUserResponses = async userId => {
  try {
    const dbInstance = await db;
    const results = await dbInstance.executeSql(
      'SELECT * FROM Responses WHERE userId = ?',
      [userId],
    );
    let responses = [];
    for (let i = 0; i < results[0].rows.length; i++) {
      responses.push(results[0].rows.item(i));
    }
    console.log('User responses:', responses);
    return responses;
  } catch (error) {
    console.error('Error fetching user responses:', error);
    return [];
  }
};

// Function to fetch questions not responded by a user
// utils/database.js
export const getUnansweredQuestions = async userId => {
  try {
    const dbInstance = await db;
    const query = `
      SELECT * FROM Questions 
      WHERE id NOT IN (
        SELECT questionId FROM Responses WHERE userId = ?
      )
    `;
    const results = await dbInstance.executeSql(query, [userId]);
    let unansweredQuestions = [];
    for (let i = 0; i < results[0].rows.length; i++) {
      unansweredQuestions.push(results[0].rows.item(i));
    }
    return unansweredQuestions;
  } catch (error) {
    console.error('Error fetching unanswered questions:', error);
    return [];
  }
};

// utils/database.js

export const getUsersWithResponses = async () => {
  try {
    const dbInstance = await db;
    const query = `
      SELECT DISTINCT u.id, u.name, u.phone, u.image
      FROM Users u
      JOIN Responses r ON u.id = r.userId
    `;
    const results = await dbInstance.executeSql(query);
    let usersWithResponses = [];
    for (let i = 0; i < results[0].rows.length; i++) {
      usersWithResponses.push(results[0].rows.item(i));
    }
    return usersWithResponses;
  } catch (error) {
    console.error('Error fetching users with responses:', error);
    return [];
  }
};
