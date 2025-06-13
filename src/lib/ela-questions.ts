import type { Question } from '@/lib/types';
import { QuestionType } from '@/lib/types';

export const elaQuestionsByGrade: Record<number, Question[]> = {
  1: [
    {
      id: 1,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What is the biggest state in America?",
      options: ["Juneau", "Texas", "New York", "Alaska"],
      correctAnswer: "Alaska",
      category: "Reading Comprehension",
      passage:
        "Facts About Alaska\n\nThere are fifty states in America. The biggest of the fifty states is Alaska. The capital of Alaska is Juneau. The capital is named after Joe Juneau. Joe Juneau came to Alaska in search of gold.\nPeople who live in or visit Alaska might see animals such as moose, bears, eagles and whales. They might also see glaciers and lots of snow. In fact many people who live in Alaska use to the snow to make ice cream. They mix different types of berries with the snow and seal oil to make the ice cream.",
    },
    {
      id: 2,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What can you make using the snow in Alaska?",
      options: ["Snowman", "Ice cream", "Seal oil", "Gold"],
      correctAnswer: "Ice cream",
      category: "Reading Comprehension",
    },
    {
      id: 3,
      type: QuestionType.TEXT,
      question: "How many states are there in America?",
      correctAnswer: "fifty",
      category: "Reading Comprehension",
    },
    {
      id: 4,
      type: QuestionType.TEXT,
      question: "Who was Joe Juneau?",
      correctAnswer: ["He came to Alaska in search of gold", "A person who came to Alaska looking for gold"],
      category: "Reading Comprehension",
    },
    {
      id: 5,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Who went to the park with Rubert?",
      options: ["Mom", "Dad", "Rubert", "Sam"],
      correctAnswer: "Sam",
      category: "Reading Comprehension",
      passage:
        "Sam's Yellow Dog\n\nSam had a yellow dog name Rubert. Everyday Rubert would lick Sam when he came home from school. Then they would go to the living room and watch cartoon. After the cartoon show, Sam would go to his room to do his homework. Rubert would follow Sam into his room. After homework Sam and Rubert would go to the park. Rubert loved going to the park. When Sam and Rubert finished playing in the park, they would walk back home for dinner. Sam ate his food at the dinner table. Rubert ate his dog food from his food bowl. After dinner Sam would get ready for bed. Once in bed, dad would read Sam and Rupert a bedtime story. As dad read the story, Sam and Rupert fell asleep.",
    },
    {
      id: 6,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Who reads a bedtime story to Rupert?",
      options: ["Dad", "Mom", "Rubert", "Sam"],
      correctAnswer: "Dad",
      category: "Reading Comprehension",
    },
    {
      id: 7,
      type: QuestionType.TEXT,
      question: "What is this story about?",
      correctAnswer: ["Sam and his dog Rubert", "A boy and his dog"],
      category: "Reading Comprehension",
    },
    {
      id: 8,
      type: QuestionType.TEXT,
      question: "Why did Rubert lick Sam?",
      correctAnswer: ["When Sam came home from school", "To greet him after school"],
      category: "Reading Comprehension",
    },
    {
      id: 9,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Pick the correct word",
      options: ["Donkey", "Dog", "Duck", "Dig"],
      correctAnswer: "Duck",
      image: "https://placehold.co/300x200.png?text=Image+of+a+duck",
      category: "Reading Comprehension",
      dataAihint: "duck animal"
    },
    {
      id: 10,
      type: QuestionType.FILL_IN_THE_BLANK,
      question: "Fill in the missing letters.",
      blanks: ["A duck can fly with his wi__gs.", "A cat has fo__ legs."],
      correctAnswer: ["wings", "four"],
      category: "Reading Comprehension",
    },
    {
      id: 11,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Which word has a long i?",
      options: ["nine", "into", "it", "pizza"],
      correctAnswer: "nine",
      category: "Reading Comprehension",
    },
    {
      id: 12,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Which word has a long a?",
      options: ["read", "apple", "road", "rake"],
      correctAnswer: "rake",
      category: "Reading Comprehension",
    },
    {
      id: 13,
      type: QuestionType.FILL_IN_THE_BLANK,
      question: "Write the contractions of the words below.",
      blanks: ["Do not: ________", "Can not: ________", "I will: ________", "Was not: ________"],
      correctAnswer: ["don't", "can't", "I'll", "wasn't"],
      category: "Reading Comprehension",
    },
    {
      id: 14,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Which word has a short vowel?",
      options: ["cane", "belt", "cape", "bake"],
      correctAnswer: "belt",
      category: "Reading Comprehension",
    },
    {
      id: 16, // ID 15 is missing in original data, keeping sequence as provided
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Circle the correct ending.",
      options: ["sh", "ch", "th", "ng"],
      correctAnswer: "sh",
      category: "Reading Comprehension",
      image: "https://placehold.co/300x200.png?text=Image+related+to+word+ending",
      dataAihint: "letters words"
    },
  ],
  2: [
    {
      id: 1,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What is the main idea of this passage?",
      options: [
        "If you are confident you can do anything",
        "Make sure to bring water for a race",
        "You should do things on your own",
        "Practice makes perfect",
      ],
      correctAnswer: "Practice makes perfect",
      passage: `The Marathon
  
  "The marathon is coming up," said James. "I'm a better runner and I know that I will win."
  
  "We should practice together," Joey said. "The marathon is still a few weeks away and I know that I can improve enough to finally beat you James."
  
  The days went by and the marathon came closer and closer. Joey practiced running everyday. He knew that the 6 mile marathon would be a challenge and that he needed to build his strength. He always ran out breath, so he wanted to try and keep his breathing steady. Joey always remembered to bring a bottle of water with him whenever he practiced.
  
  James spent all of his time relaxing. He felt sure that he would win with no problem. The day of the race finally came and the two friends saw each other at the start line. "Good luck," said James, "you're going to need it." The race started and they were off. James quickly went ahead of all of the other people. James noticed that he became very thirsty and his legs felt weak. He forgot to bring his water bottle. James started to slow down. Joey came up from behind him. Joey had his bottle in his hand and was running at a good pace. Joey passed James just as they came toward the finish line. "I should have practiced," said James.`,
    },
    {
      id: 2,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What did James forget to bring on the day of the marathon?",
      options: ["His shoes", "His bottle", "His keys", "He didn't forget anything"],
      correctAnswer: "His bottle",
    },
    {
      id: 3,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Why was Joey able to beat James in the marathon?",
      options: ["He was naturally faster", "James was sick", "He practiced and prepared", "James let him win"],
      correctAnswer: "He practiced and prepared",
    },
    {
      id: 4,
      type: QuestionType.TEXT,
      question: "What do you think James will do to prepare for the next marathon?",
      correctAnswer: "Practice and prepare better", // Example answer for text questions
    },
    {
      id: 5,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What would be a good title for this passage?",
      options: ["The Age of Moon Rocks", "Astronauts Discover Moon Rocks", "What We Know About Moon Rocks", "The Moon"],
      correctAnswer: "What We Know About Moon Rocks",
      passage: `Astronauts first went to the moon in 1969. They noticed plenty of rocks that were similar to the rocks on Earth. They brought many of these moon rocks back to Earth in order to study them and discover any secrets they might hold.
  
  Scientists back on Earth found that the rocks were very old, even older than the Earth itself. People often think of the moon as Earth's little brother, but the moon is actually older than the Earth. The scientists did not find any traces of water in the rocks. Since there was never any water on the moon, we can say that no humans or animals ever lived on it. We have learned these things and more by studying the moon rocks.
  
  Today, moon rocks can be found in museums around the world. Some people even buy and sell them to others. One day, you might even have your own moon rock.`,
    },
    {
      id: 16, // Skipped to 16 as per original data
      type: QuestionType.MULTIPLE_CHOICE,
      question: 'What does Fri. stand for in "It was cold on Fri., January 15th."',
      options: ["Frying", "Freedom", "Friday", "Freeze"],
      correctAnswer: "Friday",
    },
    {
      id: 17,
      type: QuestionType.WRITING,
      question: "Write about your Summer vacation.",
      correctAnswer: "Student's personal response", // Example for writing questions
    },
  ],
  3: [
    {
      id: 1,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "How are rainbows made?",
      options: [
        "When Ix Chel stands in the sky",
        "When sunlight passes through raindrops",
        "When a goddess sews the sky",
        "When different colored bird fly across the sky",
      ],
      correctAnswer: "When sunlight passes through raindrops",
      passage: `Rainbow
  
  Have you ever looked in the sky and saw a rainbow? Have you ever wondered how it got there? Throughout history people from different parts of the world have tried to explain why rainbows appear in the sky. Starting with ancient people, the Greeks thought rainbows connected the earth to heaven. The ancient Chinese believed that the rainbow was a rip in the sky sewn up by a goddess. The Mayans believed that the rainbow was a sign that the goddess Ix Chel was standing in the sky. The stories created by the ancient people are called myths. These myths helped them explain things such as rainbows.
  
  Today we no longer rely on myths to explain what we see in nature. We now have science. Science tells us that rainbows are made when sunlight passes though raindrops. Sunlight may look white but is made of seven colors. The colors are red, orange, yellow, green, blue, indigo, and violet. When all these colors mix, they make white light. When it rains, the raindrops bend the sunlight and allow all the color to appear.`,
    },
    {
      id: 2,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What are myths?",
      options: [
        "The scientific method",
        "Stories that explain how rainbows are made",
        "Stories created by the ancient people to explain things",
        "Short stories",
      ],
      correctAnswer: "Stories created by the ancient people to explain things",
    },
    {
      id: 3,
      type: QuestionType.TEXT,
      question: "Why do we no longer use myths?",
      correctAnswer: "Because we now have science to explain things",
    },
    {
      id: 4,
      type: QuestionType.TEXT,
      question: "What are the colors of the rainbow?",
      correctAnswer: "Red, orange, yellow, green, blue, indigo, and violet",
    },
    {
      id: 5,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What was the story mostly about?",
      options: [
        "The Oregon Country Fair",
        "Learning how to dance",
        "Emily overcoming her nervousness",
        "Emily wining third place at the country fair",
      ],
      correctAnswer: "Emily overcoming her nervousness",
      passage: `Emily's First Dance
  
  Every year Emily and her family went to the Oregon Country Fair. The country fair was a big thing in Oregon. People dressed in silly outfits, from every part of the state, came to the fair.
  
  At the fair there are many things to do. You can get your face painted, buy food and of course dance. The part most people liked the best was dancing at the country fair. As soon as the sun went down the music would begin to play, and the dancing would start.
  
  Emily was always too shy to dance. She would always watch her family and everyone else at the fair dance. Her mother would try to bring her into the crowd of dancing people, but Emily would turn red and walk away.
  
  This year was different. Emily was practicing her dancing movements each day when she came home for school. Her brother helped her learn the steps to the dance. Finally, when the day of the fair came, Emily decided she was going to dance with everyone this year.
  
  When the music turned on she became really nervous, but then her brother grabbed her hand. They began to dance and Emily became less nervous. The more she danced, the more confident she felt. Emily ended up dancing with everyone she knew and won third place at the dance competition.`,
    },
    {
      id: 6,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What word best describes Emily at the end of the story?",
      options: ["Nervous", "Brave", "Shy", "Angry"],
      correctAnswer: "Brave",
    },
    {
      id: 7,
      type: QuestionType.TEXT,
      question: "Why did the author most likely write this story?",
      correctAnswer: "To show how practice and courage can help overcome shyness",
    },
    {
      id: 8,
      type: QuestionType.TEXT,
      question: "What will happen if Emily continues to practice dancing and participating in the dance competition?",
      correctAnswer: "She will likely become more confident and skilled",
    },
    {
      id: 9,
      type: QuestionType.FILL_IN_THE_BLANK, // Changed from FILL_IN to FILL_IN_THE_BLANK
      question: "Write the antonym for each word:",
      blanks: ["Hot: _____", "Big: _____"],
      correctAnswer: ["cold", "small"],
    },
    {
      id: 10,
      type: QuestionType.MATCHING,
      question: "Connects the words that are homonyms.",
      columns: [
        {
          title: "Column 1",
          items: ["Know", "Meet", "Too", "Flower"],
        },
        {
          title: "Column 2",
          items: ["Two", "Flour", "No", "Meat"],
        },
      ],
      // Correct answer for matching would be complex, e.g. an array of pairs or indices
      // For simplicity, a text description of the answer might be stored.
      correctAnswer: "Know-No, Meet-Meat, Too-Two, Flower-Flour",
    },
    {
      id: 11,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Replace the bold word in the sentence: My sister can imitate the sound of a monkey",
      options: ["Hear", "Copy", "Quiver", "Sing"],
      correctAnswer: "Copy",
    },
    {
      id: 12,
      type: QuestionType.FILL_IN_THE_BLANK, // Changed from FILL_IN
      question: "Choose the correct word for the given sentence: Tom went to the store, _____ bought milk",
      blanks: ["then/than"], // This implies the student needs to choose one.
      correctAnswer: ["then"],
    },
    {
      id: 13,
      type: QuestionType.MATCHING,
      question: "Match the sense with the sensory word:",
      columns: [
        {
          title: "Senses",
          items: ["Hear", "Smell", "Touch", "Taste"],
        },
        {
          title: "Words",
          items: ["Bang! Bang!", "Sour", "Smelly", "Soft"],
        },
      ],
      correctAnswer: "Hear-Bang! Bang!, Smell-Smelly, Touch-Soft, Taste-Sour",
    },
    {
      id: 14,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Which words are Onomatopoeias?",
      options: ["Splash", "Snake", "Hiss", "Water"], // Assuming one correct answer from options
      correctAnswer: "Splash", // Or Hiss depending on intent. If multiple, options should be checkboxes.
    },
    {
      id: 15,
      type: QuestionType.FILL_IN_THE_BLANK, // Changed from FILL_IN
      question: "Change each word to its plural form. Write the word on the line.",
      blanks: ["During autumn the _____ change colors. (leaf)", "The mother cat has four _____. (baby)"],
      correctAnswer: ["leaves", "babies"],
    },
    {
      id: 16,
      type: QuestionType.WORD_SORT,
      question: "Write each word under the correct heading:",
      columns: [
        {
          title: "Prefix",
          items: ["Rewrite", "Outside", "Import"], // These are items to be sorted
        },
        {
          title: "Suffix",
          items: ["Happiness", "Thankful", "Headphone"], // These are items to be sorted
        },
      ],
      // Correct answer for word sort is complex.
      correctAnswer: "Prefix: Rewrite, Import, Outside. Suffix: Happiness, Thankful. (Headphone is compound)",
    },
    {
      id: 17,
      type: QuestionType.WRITING,
      question: "What do you want for your birthday? Explain why.",
      correctAnswer: "Student's personal response",
    },
  ],
  4: [
    {
      id: 1,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "How do monkeys use their tails?",
      options: ["To walk", "To hold things", "To swim", "To attack other animals"],
      correctAnswer: "To hold things",
      passage: `How Animals Use Their Tails
  
  Many animals rely on their tails to help them survive. Some use their tails for balance, such as monkeys in the jungle. As the monkeys walk across the branches of tall trees, they move their tail side to side to maintain balance. When swinging from tree to tree they can hold on to a nearby branch with the help of their tail. They can even hold food with their tails.
  
  Animals that live in water use their tails a bit differently. Fish use their tails to propel them through the water at high speeds. The design of their tails allows them to move smoothly and effortlessly in water. Their tails also help them escape from predators like sharks. Alligators and crocodiles use their tails to move through water as well, but they sometimes use their tails to attack other animals. They swing their tails violently and anything that gets in the way is crushed. They can even trip their prey and then bite down using their large jaws.
  
  Other animals don't really depend on their tails in any way. A bear, for example, has a very short tail that doesn't do it much good.`,
    },
    {
      id: 2,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Why did the author write this passage?",
      options: ["To persuade the reader", "To entertain the reader", "To make fun of animals", "To inform the reader"],
      correctAnswer: "To inform the reader",
    },
    {
      id: 3,
      type: QuestionType.TEXT,
      question: "How does an alligator use its tail differently from a fish?",
      correctAnswer: "Alligators use tails to attack, fish use them mainly for propulsion and escape."
    },
    {
      id: 4,
      type: QuestionType.TEXT,
      question: "Explain the difference between predator and prey.",
      correctAnswer: "A predator hunts other animals (prey) for food."
    },
    {
      id: 5,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Why was Jacob able to win his first match in the tournament?",
      options: ["He cheated", "His brother helped him", "He knew his opponent well", "He is a master chess player"],
      correctAnswer: "His brother helped him",
      passage: `Jacob Enters a Chess Tournament
  
  When Jacob was 12 years old he saw his older brother playing chess with some of his friends. Jacob didn't understand the point of the game. He wanted to learn how to play so he begged his brother to teach him.
  
  "It's simple," said his brother. "All you have to do is capture the opponent's king." Jacob's brother explained that the small pieces were called pawns and were worth the least. The other pieces were the bishops, the knights, the rooks, the queen, and finally the king. Jacob quickly learned how each piece moved on the board. He had a gift for finding and taking advantage of weaknesses in the opponent's formation.
  
  After 3 months of playing with his friends and his brother, Jacob noticed a poster for a tournament at his school. He became very excited and immediately went to his brother. "I don't know if you're ready for a tournament," said Jacob's brother. "I want to see how far I've come," answered Jacob. Jacob's brother eventually agreed.
  
  Jacob was nervous. There were so many people at the tournament and every one of them looked like they had been playing for a very long time. When it was Jacob's turn to play he made a few simple mistakes at the beginning. He began to worry. Jacob's brother was right next to him and he told Jacob not to be scared. "Don't forget that you can beat me now, so these guys shouldn't be a problem," said his brother. Jacob's confidence returned and he was able to beat his opponent.`,
    },
    {
      id: 6,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Why did Jacob make mistakes in his first match?",
      options: [
        "He didn't eat a good breakfast",
        "He didn't practice enough",
        "He felt nervous during the game",
        "He wanted to let his opponent win",
      ],
      correctAnswer: "He felt nervous during the game",
    },
    {
      id: 7,
      type: QuestionType.TEXT,
      question: "Describe Jacob's relationship with his brother.",
      correctAnswer: "Supportive, his brother teaches and encourages him."
    },
    {
      id: 8,
      type: QuestionType.TEXT,
      question: "Why did Jacob enter the tournament?",
      correctAnswer: "To see how much he had improved."
    },
    {
      id: 9,
      type: QuestionType.FILL_IN_THE_BLANK,
      question: "Write the plural form of the following words:",
      blanks: ["Man: _____", "Mouse: _____", "Child: _____", "Tooth: _____"],
      correctAnswer: ["Men", "Mice", "Children", "Teeth"],
    },
    {
      id: 10,
      type: QuestionType.GRAMMAR,
      question: "Correct this sentence: We saw sams book on the table so we decided to return it to him",
      correctAnswer: "We saw Sam's book on the table, so we decided to return it to him.",
    },
    {
      id: 11,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Which word should be capitalized in this sentence? The telescope made the planet saturn look huge.",
      options: ["telescope", "saturn", "huge", "none of the above"],
      correctAnswer: "saturn",
    },
    {
      id: 12,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What is the subject of this sentence? Sally gave her dog the bone to chew on.",
      options: ["Sally", "Dog", "Bone", "Gave"],
      correctAnswer: "Sally",
    },
    {
      id: 13,
      type: QuestionType.MULTIPLE_CHOICE,
      question:
        "Choose the best word to complete the sentence below. John was _____ when he saw a group of bulls charging at him.",
      options: ["sad", "frightened", "thankful", "excited"],
      correctAnswer: "frightened",
    },
    {
      id: 14,
      type: QuestionType.GRAMMAR,
      question: "Correct the following sentence: The group of fourth graders were going to the park.",
      correctAnswer: "The group of fourth graders was going to the park.",
    },
    {
      id: 15,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What is the past tense of the verb to bring?",
      options: ["Bring", "Bringed", "Brought", "Brung"],
      correctAnswer: "Brought",
    },
    {
      id: 16,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What does the word vile mean in this sentence? The killer was a vile man who hurt innocent people.",
      options: ["Friendly", "Evil", "Strange"],
      correctAnswer: "Evil",
    },
    {
      id: 17,
      type: QuestionType.WRITING,
      question:
        "Do you think TV has a positive or a negative influence on children? In your essay, be sure to include examples to support your position.",
      correctAnswer: "Student's personal essay response."
    },
  ],
  5: [
    {
      id: 1,
      type: QuestionType.MULTIPLE_CHOICE,
      question: 'What does the word "diverse" mean in paragraph one?',
      options: ["Having different kinds", "Huge", "Beautiful", "Strange"],
      correctAnswer: "Having different kinds",
      passage: `Tropical Rain Forests
  
  Tropical rain forests are amongst the most diverse ecosystems in the world. They provide homes to many different species of plants and animals, even though they cover only a small part of the Earth's surface.
  
  The rain forests provide us with many resources we use every day. Coffee, vanilla, wood, oils, nuts, vegetables and fruits all come from the rain forest. Even a large portion of our medicines is obtained from forest plants.
  
  The forest floor, the understory, the canopy, and the emergent layer are four layers common to all rain forests. The majority of the inhabitants of the forest floor are plants. The understory is higher than the forest floor but no sunlight reaches it. The canopy is 70-120 feet above ground level and is the layer in which most plants and animals live. The emergent layer is the topmost layer.
  
  Today, unfortunately, the tropical rain forests are slowly being wiped out. Our need for resources is destroying the homes of many of the plants and animals that live in the tropical rain forests. Perhaps one day there will be no more tropical rain forests remaining.`,
    },
    {
      id: 2,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Which of these is not found in the tropical rain forests?",
      options: ["Fruits", "Vanilla", "Butter", "Medicine"],
      correctAnswer: "Butter",
    },
    {
      id: 3,
      type: QuestionType.TEXT,
      question: "Why do you think hardly any sunlight reaches the understory or the forest floor?",
      correctAnswer: "Because the canopy layer above is very dense with leaves, blocking the sunlight."
    },
    {
      id: 4,
      type: QuestionType.TEXT,
      question: "According to the passage, why are tropical rain forests being destroyed?",
      correctAnswer: "Our need for resources is destroying them."
    },
    {
      id: 5,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What was the last thing Max did to get ready for Christmas?",
      options: [
        "Mail letters at the post office",
        "Hang his sign for uncle Robert",
        "Place the stocking above the fireplace",
        "Buy a Christmas tree",
      ],
      correctAnswer: "Place the stocking above the fireplace",
      passage: `Max's Christmas
  
  For Max's family holidays are always a big deal, but this year Christmas was going to be extra special. His uncle, Robert, was coming over for Christmas.
  
  There was a lot to be done to make this Christmas special. First, Max made a big sign that said "Merry Christmas Uncle Robert!" Next, Max ran some errands with his dad. First, they stopped by the post office to mail letters. Then they went to the mall to buy gifts for everyone. Finally, Max and his dad picked up the Christmas tree for the house.
  
  With two days left before Christmas, Max and his dad decorated the entire house. First, they put lights and ornaments around the Christmas tree. Next, Max hung the sign he made for uncle Robert. Finally, they placed the stocking above the fireplace.
  
  On Christmas Eve morning, Max and his mother picked up uncle Robert from the airport. When uncle Robert came in to the house and saw the sign Max made for him he was very happy. Later that night, the entire family gathered at the dining table and had a feast. Finally, when Max went to sleep, uncle Robert placed his present for Max under the Christmas tree.
  
  When Max woke up the next day, the first thing Max did was run to the Christmas tree. Then he looked under the Christmas tree and saw the gift uncle Robert had brought for him. Max asked uncle Robert, "Who brought this gift for me?" Uncle Robert replied, "Santa Claus."`,
    },
    {
      id: 6,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Why do you think uncle Robert told Max that Santa Claus brought the present?",
      options: [
        "To trick Max",
        "To keep Max's belief in Santa Claus alive",
        "Uncle Robert is Santa Claus",
        "He likes lying to Max",
      ],
      correctAnswer: "To keep Max's belief in Santa Claus alive",
    },
    {
      id: 7,
      type: QuestionType.TEXT,
      question: "Do you think Max believed what uncle Robert told him, at the end of the story?",
      correctAnswer: "It's ambiguous, but likely Max is old enough to start questioning it."
    },
    {
      id: 8,
      type: QuestionType.TEXT,
      question: "Why did the author write this story?",
      correctAnswer: "To tell a heartwarming story about family traditions and Christmas."
    },
    {
      id: 9,
      type: QuestionType.GRAMMAR,
      question:
        "Underline the adjective(s) in the following sentence: After taking a shower, Mike's hair was smooth and soft.",
      correctAnswer: ["smooth", "soft"], // This needs to be handled by UI, maybe highlighting.
    },
    {
      id: 10,
      type: QuestionType.FILL_IN_THE_BLANK,
      question: "In the space given write an antonym for each word:",
      blanks: ["Happy: _____", "Light: _____", "Expensive: _____"],
      correctAnswer: ["Sad", "Dark/Heavy", "Cheap/Inexpensive"],
    },
    {
      id: 11,
      type: QuestionType.FILL_IN_THE_BLANK,
      question: "Choose the correct homonym for each sentence. Homonym: ate, eight",
      blanks: ["I _____ three hotdogs and two burgers at the picnic.", "There are _____ types of ice cream flavors."],
      correctAnswer: ["ate", "eight"],
    },
    {
      id: 12,
      type: QuestionType.MULTIPLE_CHOICE,
      question:
        "Pick the word that best completes the sentence: Even though Kevin knew the answer, he was too _____ to raise his hand.",
      options: ["Sick", "Embarrassed", "Sad"],
      correctAnswer: "Embarrassed",
    },
    {
      id: 13,
      type: QuestionType.FILL_IN_THE_BLANK,
      question: "Write the plural of each word:",
      blanks: ["Church: _____", "Butterfly: _____", "Prefix: _____", "Pen: _____"],
      correctAnswer: ["Churches", "Butterflies", "Prefixes", "Pens"],
    },
    {
      id: 14,
      type: QuestionType.GRAMMAR,
      question: "Correct the sentence below: The barn max owned looked mysterious but it also looked like home.",
      correctAnswer: "The barn Max owned looked mysterious, but it also looked like home.",
    },
    {
      id: 15,
      type: QuestionType.GRAMMAR,
      question: "Correct the sentence below: After finishing her dinner, Sandy asked her Mom can i have a cookie?",
      correctAnswer: 'After finishing her dinner, Sandy asked her Mom, "Can I have a cookie?"',
    },
    {
      id: 16,
      type: QuestionType.GRAMMAR,
      question:
        "Replace the abbreviation with its meaning: After class Mike came over to my apt. to play some video games.",
      correctAnswer: "After class Mike came over to my apartment to play some video games.",
    },
    {
      id: 17,
      type: QuestionType.WRITING,
      question:
        "Think of an event that really made you happy. Think about what parts of this event made you happy. In the space below write about the event and why it made you happy.",
      correctAnswer: "Student's personal essay response."
    },
  ],
  6: [
    {
      id: 1,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What is lightning?",
      options: ["It occurs because of Zeus", "A rod of fire", "The effect of God sneezing", "A large electrical current"],
      correctAnswer: "A large electrical current",
      passage: `Franklin's Experiment
  
  People often associate the discovery of electricity with Benjamin Franklin. We envision Franklin braving a thunderstorm with a small kite that gets struck by lightning. The fact of the matter is that Franklin did not actually discover electricity; he merely showed us that lightning was made of it.
  
  Although lightning did not actually strike Franklin's kite, he was able to determine that the air around him was electrically charged during the thunderstorm. He had a silk kite with a metal key at the end of it. The metal key could attract the electrical charges in the surrounding air. The silk fibers began to stand, giving the impression that they were charged. Imagine how a person's hair stands up after they receive an electrical shock. Because the fibers stood up only during the thunderstorm, Franklin concluded that lightning was just a large electrical current.
  
  Benjamin Franklin was a very curious man who did not allow fear to get in the way of his search for knowledge. Thanks to Benjamin Franklin's curiosity, we now know much more about the nature of electricity.`,
    },
    {
      id: 2,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What do you think happened when Benjamin Franklin touched the key?",
      options: ["He was struck by lightning", "His hand got burned", "He felt a shock", "Nothing happened"],
      correctAnswer: "He felt a shock",
    },
    {
      id: 3,
      type: QuestionType.TEXT,
      question: "What was the purpose of Franklin's experiment?",
      correctAnswer: "To show that lightning was made of electricity."
    },
    {
      id: 4,
      type: QuestionType.TEXT,
      question: "Why did Franklin attach a key to the end of his kite?",
      correctAnswer: "The metal key could attract electrical charges from the air."
    },
    {
      id: 5,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What is the purpose of the passage?",
      options: [
        "To inform the reader about parks",
        "To instruct the reader on how to make parks",
        "To persuade the reader that parks are a good place for kids",
        "To show that kids are very active",
      ],
      correctAnswer: "To persuade the reader that parks are a good place for kids",
      passage: `Parks for Kids
  
  Kids your age are full of energy. They tend to play games with their friends whenever they get a chance. If kids have a decent park with proper facilities, they can spend their time there playing sports such as basketball and football.
  
  Parks offer many advantages for children which we sometimes take for granted. They are a safe environment in which children can meet new people and make new friends. Instead of playing in the streets, kids can play in the park, a location the parents are familiar with. If kids are having fun with their friends in a park, they may be saved from negative influences such as drugs. Having a place to socially engage with peers prevents kids from spending too much time watching TV or using the computer. Problems such as obesity can be avoided if children stay constantly active.
  
  Parks can also strengthen the community. Parents of children can come with them to the parks and speak with other members of the community. As the children develop closer friendships the parents may start to become friendlier towards each other.`,
    },
    {
      id: 6,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What is one bad influence for kids mentioned in the passage?",
      options: ["Fighting", "Drugs", "Alcohol", "Smoking"],
      correctAnswer: "Drugs",
    },
    {
      id: 7,
      type: QuestionType.TEXT,
      question: "What are some advantages of parks?",
      correctAnswer: "Safe environment, make new friends, avoid negative influences, stay active, strengthen community."
    },
    {
      id: 8,
      type: QuestionType.TEXT,
      question: "Why would the community be strengthened because of parks?",
      correctAnswer: "Parents can meet and become friendlier as their children play together."
    },
    {
      id: 9,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What is the subject of this sentence? Sally's dog jumped over the obstacle.",
      options: ["Sally", "Dog", "Obstacle", "None of the above"],
      correctAnswer: "Dog",
    },
    {
      id: 10,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Which underlined part is incorrect? Cleopatra discovers gold in the hidden chamber a week ago.",
      options: ["Discovers", "Hidden", "Week", "None of the above"],
      correctAnswer: "Discovers", // Should be "discovered"
    },
    {
      id: 11,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Take out the trash Bruno. What type of sentence is this?",
      options: ["Exclamatory", "Interrogative", "Imperative", "Declarative"],
      correctAnswer: "Imperative",
    },
    {
      id: 12,
      type: QuestionType.GRAMMAR,
      question: "Correct the following sentence: alexander was a great general who conquered many territorys.",
      correctAnswer: "Alexander was a great general who conquered many territories.",
    },
    {
      id: 13,
      type: QuestionType.MULTIPLE_CHOICE,
      question:
        "What does the word impaled mean in the following sentence? Maximus was impaled by the dagger but he still managed to defeat the vile emperor.",
      options: ["Chopped", "Stabbed", "Scraped", "Stung"],
      correctAnswer: "Stabbed",
    },
    {
      id: 14,
      type: QuestionType.GRAMMAR,
      question: "Correct the following sentence: The college took their time in sending me a reply.",
      correctAnswer: "The college took its time in sending me a reply.",
    },
    {
      id: 15,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What is this sentence missing? Is Constantine ready to go fishing with his dad",
      options: ["Capital", "Period", "Question Mark", "Comma"],
      correctAnswer: "Question Mark",
    },
    {
      id: 16,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Which underlined part is incorrect? The teacher gave Jack and I homework over the summer vacation.",
      options: ["gave", "I", "over", "summer"],
      correctAnswer: "I", // Should be "me"
    },
    {
      id: 17,
      type: QuestionType.WRITING,
      question: "Should uniforms be mandatory at school?",
      correctAnswer: "Student's personal essay response."
    },
  ],
  7: [
    {
      id: 1,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "How did Sally's love for sports help her become an astronaut?",
      options: [
        "All astronauts should play tennis to do well",
        "Playing sports kept Sally away from drugs",
        "Playing sports gave Sally the opportunity to attend the high school where she discovered her love for science",
        "All astronauts love tennis",
      ],
      correctAnswer:
        "Playing sports gave Sally the opportunity to attend the high school where she discovered her love for science",
      passage: `Sally Ride The Astronaut
  
  Sally Ride is known best as the first American woman to travel in space. She accomplished this amazing feat on June 18, 1983. During her space mission, she was able to place three satellites over different parts of the world and conduct science projects. Her accomplishment is not only appreciated by the science world, but also by women everywhere. She was a role model for the girls of her generation who were trying to pursue their dreams.
  
  Sally was born on May 26, 1951. She was always regarded as an active child. She loved playing sports such as soccer, softball and tennis. Her achievements in tennis led to a scholarship to a private high school. In high school she discovered her love for science. Her love for tennis continued in college, where she played tennis and studied science. Sally graduated from Stanford University with a degree in English and Physics. She went on to receive a PhD in Astrophysics.
  
  Her interest in becoming an astronaut came about while looking for a job. She put her name down for NASA's shuttle program. She was among the 208 finalists. Then, in January 1978 Sally was selected to be one of the 35 astronaut candidates. All the candidates underwent a one year training process. From these candidates, Sally Ride and her future husband Steven Hawley were chosen. On June 18, 1983, she became the first American woman in space. She was a crew member on Space Shuttle Challenger. The overall mission went smoothly. The flight itself lasted six days and within this time frame satellites were launched over Canada, Indonesia, and Germany.`,
    },
    {
      id: 2,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What was the first step Sally took to become an astronaut?",
      options: [
        "Pursue a science degree in college",
        "Earn a PhD",
        "Apply for the shuttle program",
        "Undergo one year training, once she was a finalist",
      ],
      correctAnswer: "Apply for the shuttle program",
    },
    {
      id: 3,
      type: QuestionType.TEXT,
      question: "What word would you use to describe Sally Ride? Explain",
      correctAnswer: "Determined, intelligent, pioneering (with explanation)."
    },
    {
      id: 4,
      type: QuestionType.TEXT,
      question: "Why did the author write this story?",
      correctAnswer: "To inform about Sally Ride's life and achievements as the first American woman in space."
    },
    {
      id: 5,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What was this story mostly about?",
      options: [
        "The danger of rattlesnakes",
        "Max's first camping trip",
        "Getting along with relatives",
        "Uncle Robert teaching Max about snakes",
      ],
      correctAnswer: "Max's first camping trip",
      passage: `Into The Wild
  
  The night was cold but not foggy. Even though it was pitch black, Max could smell the pine trees that were around the campsite. This was his first night outside of his hometown and worst of all he was in the woods. Max thought to himself, as he sat next to the campfire, "Why did I ever agree to go on this trip?" Then he remembered, it was to spend time with uncle Robert. Uncle Robert only visits Max two times a year, and this year he decided that it would be fun for him and Max to go camping.
  
  Uncle Robert came next to Max and asked him if he was hungry. Max nodded his head. Uncle Robert began to cook hotdogs and beans in the campfire. The smell of the food made Max forget about his sadness. When he took his first bite of the food, he realized how hungry he was and how good camp food tastes. Max decided that there is something magical in that campfire that makes the food taste good. His cousin, June, laughed at Max and said, "You are delusional, Max. What you are saying can't be true."
  
  The next morning uncle Robert, June, and Max went hiking to see the view. Max had never been hiking before and was struggling to keep up. Plus the heavy backpack was not helping. All of a sudden Max heard a rattling sound. Max told June but she told Max that he was again being delusional. But then all three of them heard the rattling noise and saw a rattlesnake. June and Max screamed, but uncle Robert calmed them down. He pointed at the snake's mouth and said, "There is a field mouse in its mouth. It will take the snake a few days to digest it. So, the rattlesnake is no harm to us at the moment." After June and Max heard this, they slowly walked away.`,
    },
    {
      id: 6,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What does the word delusional mean?",
      options: ["Having unrealistic beliefs", "Seeing things that are not there", "To be liminal", "Being nervous"],
      correctAnswer: "Having unrealistic beliefs",
    },
    {
      id: 7,
      type: QuestionType.TEXT,
      question: "If the author added a paragraph at the end of this story, what would it include?",
      correctAnswer: "Max's reflections on the camping trip, perhaps enjoying it more after the initial fear."
    },
    {
      id: 8,
      type: QuestionType.TEXT,
      question: "What words would you use to describe Max? Explain.",
      correctAnswer: "Initially timid and imaginative, later perhaps more adventurous (with explanation)."
    },
    {
      id: 9,
      type: QuestionType.MULTIPLE_CHOICE,
      question:
        "In which sentence does the underlined word have the same meaning as in the sentence below: How will the town recover from the hurricane?",
      options: [
        "Tim got some fabric to recover the bed sheet",
        "Bob will recover from the accident soon",
        "How will they recover the stole item?",
        "He can recover useful material from junk",
      ],
      correctAnswer: "Bob will recover from the accident soon",
    },
    {
      id: 10,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What does the underlined word mean in the sentence below: We camped in the grotto under the cliffs",
      options: ["A tree", "A hut", "A large rock", "A cave"],
      correctAnswer: "A cave",
    },
    {
      id: 11,
      type: QuestionType.GRAMMAR,
      question:
        "Insert commas where they are needed: The first wedding in China the marriage of Yumi Lin and Xin Lee took place in 25 B.C.",
      correctAnswer: "The first wedding in China, the marriage of Yumi Lin and Xin Lee, took place in 25 B.C.",
    },
    {
      id: 12,
      type: QuestionType.GRAMMAR, // Could also be considered TEXT if free-form answer of "clause" or "phrase"
      question:
        "Identify what is underlined as either a phrase or clause: When he was eight years old, he moved to Bronx, New York.",
      correctAnswer: "clause", // Assuming "When he was eight years old" is underlined.
    },
    {
      id: 13,
      type: QuestionType.GRAMMAR, // Or MULTIPLE_CHOICE with options "Compound" / "Not Compound"
      question:
        "Read the sentence and state whether it is a compound sentence or not: Lions and cats have the same number of whiskers—seven.",
      correctAnswer: "Not a compound sentence",
    },
    {
      id: 14,
      type: QuestionType.GRAMMAR,
      question:
        "Join these independent clauses using a coordinating conjunction or semicolon: We can wait for Jim. We can leave without him.",
      correctAnswer: [
        "We can wait for Jim, or we can leave without him.",
        "We can wait for Jim; we can leave without him.",
      ],
    },
    {
      id: 15,
      type: QuestionType.GRAMMAR,
      question:
        "Rewrite the run on sentence: The members of congress are elected by the voters there are six thousand voters this year.",
      correctAnswer: "The members of congress are elected by the voters. There are six thousand voters this year.",
    },
    {
      id: 16,
      type: QuestionType.GRAMMAR,
      question:
        'Underline each word that should be capitalized in the sentence: james said, "what time does pokemon start?"',
      correctAnswer: 'James said, "What time does Pokemon start?"', // For UI, this implies user highlights or types corrected.
    },
    {
      id: 17,
      type: QuestionType.WRITING,
      question: "Compare and contrast the music you like and the music your parents like.",
      correctAnswer: "Student's personal essay response."
    },
  ],
  8: [
    {
      id: 1,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What is the main idea of the passage?",
      options: [
        "Tiny particles govern our world",
        "Electrons are negatively charged",
        "Electrons and protons are smaller than atoms",
        "Lead is made of carbon atoms",
      ],
      correctAnswer: "Tiny particles govern our world",
      passage: `The Particles of Matter
  
  Have you ever looked around and wondered what the objects around you were made of? Take the lead in a pencil for example. The lead is made of graphite which is made of a bunch of carbon atoms. Atoms are the basic building blocks of matter in our universe. Everything around us is made of atoms. But then what are atoms made of? The atoms themselves are made of even tinier particles called electrons and protons. The attractive and repulsive forces between these electrons and protons give rise to the things around us (including ourselves).
  
  Electrons are negatively charged, whereas protons are positively charged. Two particles with different charges attract each other, therefore protons and electrons tend to come together. This idea of opposite charges attracting can explain why we can write with a pencil. The particles of the paper have a certain charge and attract the particles of the lead which have the opposite charge.
  
  Similarly, two particles that have the same charge repel. Our hands do not go through or stick to our desks because the electrons in our hand repel the electrons in the desk.`,
    },
    {
      id: 2,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What are the building blocks of matter according to the passage?",
      options: ["Graphite", "Carbon", "Atoms", "Protons and electrons"],
      correctAnswer: "Atoms",
    },
    {
      id: 3,
      type: QuestionType.TEXT,
      question: "What causes two particles to be attracted? What causes them to be repelled?",
      correctAnswer: "Opposite charges attract, same charges repel."
    },
    {
      id: 4,
      type: QuestionType.TEXT,
      question: "What suggests that the particles in lead are attracted to the particles in an eraser?",
      correctAnswer: "The passage explains attraction through pencil lead and paper, not erasers. This question might be flawed or require inference not directly supported for an eraser."
    },
    {
      id: 5,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What is the main Idea of the Passage?",
      options: [
        "Fire causes pain",
        "The brain plays an important part in how we perceive the world",
        "The ancient Egyptians understood the brain",
        "Charles Sherrington was a genius",
      ],
      correctAnswer: "The brain plays an important part in how we perceive the world",
      passage: `The Role of the Brain
  
  What causes the sensation of pain we experience when we place our hands in a fire? Why is it that we immediately withdraw from the source of pain? The answer to these questions is that the fire causes an electrical signal to pass through the body and into the brain. The brain then relays a signal back to the body that tells the body to take the hands away from the fire. Every aspect of our lives, whether physical or emotional, can be traced back as a result of the electrical activity in our brains.
  
  Over the centuries, many theories of sensation have appeared. Early scientists did not realize that the brain played such an important part in the process. Ancient Egyptians, for example, thought the heart was superior to the brain. They would remove the brains of their dead with a spoon but preserve the heart.
  
  It was in the mid 17th century that Rene Descartes argued that the brain played an important role in how we experience the world around us. However, Descartes did not fully understand the function of the brain. In 1900's, Charles Sherrington proposed a model in which electrical signals, received from neurons, stimulated the brain. Neurons are like long cords that carry the electrical signals to the brain. There are neurons in just about every part of our bodies.`,
    },
    {
      id: 6,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What carries electrical signals to the brain?",
      options: ["Skin", "Muscles", "Neurons", "The brain"],
      correctAnswer: "Neurons",
    },
    {
      id: 7,
      type: QuestionType.TEXT,
      question: "Why was Descartes's theory different from previous theories?",
      correctAnswer: "He argued the brain played an important role, unlike earlier theories (e.g., Egyptians favoring the heart)."
    },
    {
      id: 8,
      type: QuestionType.TEXT,
      question: "Describe a neuron and describe its function?",
      correctAnswer: "Neurons are like long cords that carry electrical signals to the brain."
    },
    {
      id: 9,
      type: QuestionType.MULTIPLE_CHOICE,
      question:
        "In which sentence does the word effect have the same meaning as in: The effect of the storm could be seen in the widespread destruction of the town.",
      options: [
        "The deal was effected thanks to hard work.",
        "The beneficial effects of the drug were remarkable.",
        "The teacher said something to the effect of 'get out of the classroom.'",
        "None of the above",
      ],
      correctAnswer: "The beneficial effects of the drug were remarkable.",
    },
    {
      id: 10,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Which underlined part is incorrect? The teacher gave Jack and I homework over the summer vacation.",
      options: ["gave", "I", "summer", "No Error"],
      correctAnswer: "I", // Should be "me"
    },
    {
      id: 11,
      type: QuestionType.MULTIPLE_CHOICE,
      question:
        "Which underlined part is incorrect? Last week I went on a trip with my friends. We hiked, biked, and we were swimming all day.",
      options: ["trip", "biked", "We were swimming", "No Error"],
      correctAnswer: "We were swimming", // For parallelism, should be "swam" or "went swimming"
    },
    {
      id: 12,
      type: QuestionType.GRAMMAR,
      question: "Correct the following sentence: We were already to leave when the car suddenly broke down.",
      correctAnswer: "We were all ready to leave when the car suddenly broke down.",
    },
    {
      id: 13,
      type: QuestionType.MULTIPLE_CHOICE,
      question:
        "What does the underlined word mean? When the professor continued to ignore the assistant, we knew that the assistant's input was inconsequential.",
      options: ["Inappropriate", "Valuable", "Inspiring", "Irrelevant"],
      correctAnswer: "Irrelevant",
    },
    {
      id: 14,
      type: QuestionType.MULTIPLE_CHOICE,
      question:
        "Which transition word would be the most appropriate for this sentence: The apples were salty, ___ the peaches were sweet.",
      options: ["and", "however", "therefore", "also"],
      correctAnswer: "however",
    },
    {
      id: 15,
      type: QuestionType.MULTIPLE_CHOICE,
      question:
        "What does the underlined word mean? Alice Paul was an advocate of women's voting rights, which was demonstrated through her participation in protests and boycotts.",
      options: ["Against", "Supporter", "Advertise", "Knowledgeable"],
      correctAnswer: "Supporter",
    },
    {
      id: 16,
      type: QuestionType.MULTIPLE_CHOICE,
      question:
        "Which underlined part is incorrect? Mr. Smith, owner of the car shop, gave I and Allison free ice cream today.",
      options: ["Gave", "Owner", "I", "Today"],
      correctAnswer: "I", // Should be "me"
    },
    {
      id: 17,
      type: QuestionType.WRITING,
      question: "Is the death penalty morally correct?",
      correctAnswer: "Student's personal essay response."
    },
  ],
};
