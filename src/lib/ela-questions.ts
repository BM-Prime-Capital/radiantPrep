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
      category: "Reading comprehension; detail",
      passage: "Facts About Alaska\n\nThere are fifty states in America..."
    },
    {
      id: 2,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What can you make using the snow in Alaska?",
      options: ["Snowman", "Ice cream", "Seal oil", "Gold"],
      correctAnswer: "Ice cream",
      category: "Reading comprehension; detail"
    },
    {
      id: 3,
      type: QuestionType.TEXT,
      question: "How many states are there in America?",
      correctAnswer: "fifty",
      category: "Reading comprehension; detail"
    },
    {
      id: 4,
      type: QuestionType.TEXT,
      question: "Who was Joe Juneau?",
      correctAnswer: ["He came to Alaska in search of gold", "A person who came to Alaska looking for gold"],
      category: "Reading comprehension; detail"
    },
    {
      id: 5,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Who went to the park with Rubert?",
      options: ["Mom", "Dad", "Rubert", "Sam"],
      correctAnswer: "Sam",
      category: "Reading comprehension; character recall",
      passage: "Sam's Yellow Dog\n\nSam had a yellow dog name Rubert..."
    },
    {
      id: 6,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Who reads a bedtime story to Rupert?",
      options: ["Dad", "Mom", "Rubert", "Sam"],
      correctAnswer: "Dad",
      category: "Reading comprehension; character recall"
    },
    {
      id: 7,
      type: QuestionType.TEXT,
      question: "What is this story about?",
      correctAnswer: ["Sam and his dog Rubert", "A boy and his dog"],
      category: "Reading comprehension; main idea"
    },
    {
      id: 8,
      type: QuestionType.TEXT,
      question: "Why did Rubert lick Sam?",
      correctAnswer: ["When Sam came home from school", "To greet him after school"],
      category: "Reading comprehension; detail"
    },
    {
      id: 9,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Pick the correct word",
      options: ["Donkey", "Dog", "Duck", "Dig"],
      correctAnswer: "Duck",
      category: "Identification; visual",
      image: "https://placehold.co/300x200.png?text=Image+of+a+duck"
    },
    {
      id: 10,
      type: QuestionType.FILL_IN_THE_BLANK,
      question: "Fill in the missing letters.",
      blanks: ["A duck can fly with his wi__gs.", "A cat has fo__ legs."],
      correctAnswer: ["wings", "four"],
      category: "Word completion; blank characters"
    },
    {
      id: 11,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Which word has a long i?",
      options: ["nine", "into", "it", "pizza"],
      correctAnswer: "nine",
      category: "Vowel sounds; identification"
    },
    {
      id: 12,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Which word has a long a?",
      options: ["read", "apple", "road", "rake"],
      correctAnswer: "rake",
      category: "Vowel sounds; identification"
    },
    {
      id: 13,
      type: QuestionType.FILL_IN_THE_BLANK,
      question: "Write the contractions of the words below.",
      blanks: ["Do not: ________", "Can not: ________", "I will: ________", "Was not: ________"],
      correctAnswer: ["don't", "can't", "I'll", "wasn't"],
      category: "Word conversions; contractions"
    },
    {
      id: 14,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Which word has a short vowel?",
      options: ["cane", "belt", "cape", "bake"],
      correctAnswer: "belt",
      category: "Vowel sounds; type identification"
    },
    {
      id: 15,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Which word has a long vowel?",
      options: ["cap", "pet", "pipe", "sit"],
      correctAnswer: "pipe",
      category: "Vowel sounds; classification"
    },
    {
      id: 16,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Circle the correct ending.",
      options: ["sh", "ch", "th", "ng"],
      correctAnswer: "sh",
      category: "Word completion; blank characters (MC)",
      image: "https://placehold.co/300x200.png?text=Image+related+to+word+ending"
    }
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
        "Practice makes perfect"
      ],
      correctAnswer: "Practice makes perfect",
      category: "Reading comprehension; main idea",
      passage: "The Marathon\n\n\"The marathon is coming up,\" said James..."
    },
    {
      id: 2,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What did James forget to bring on the day of the marathon?",
      options: ["His shoes", "His bottle", "His keys", "He didn't forget anything"],
      correctAnswer: "His bottle",
      category: "Reading comprehension; detail"
    },
    {
      id: 3,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Why was Joey able to beat James in the marathon?",
      options: ["He was naturally faster", "James was sick", "He practiced and prepared", "James let him win"],
      correctAnswer: "He practiced and prepared",
      category: "Reading comprehension; detail"
    },
    {
      id: 4,
      type: QuestionType.TEXT,
      question: "What do you think James will do to prepare for the next marathon?",
      correctAnswer: "Practice and prepare better",
      category: "Reading comprehension; inference"
    },
    {
      id: 5,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What would be a good title for this passage?",
      options: ["The Age of Moon Rocks", "Astronauts Discover Moon Rocks", "What We Know About Moon Rocks", "The Moon"],
      correctAnswer: "What We Know About Moon Rocks",
      category: "Reading comprehension; main idea",
      passage: "Astronauts first went to the moon in 1969..."
    },
    {
      id: 6,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What did astronauts bring back from the moon?",
      options: ["Water", "Moon rocks", "Aliens", "Nothing"],
      correctAnswer: "Moon rocks",
      category: "Reading comprehension; detail"
    },
    {
      id: 7,
      type: QuestionType.TEXT,
      question: "What have scientists learned from studying moon rocks?",
      correctAnswer: ["They're very old", "No water traces", "Moon is older than Earth"],
      category: "Reading comprehension; detail"
    },
    {
      id: 8,
      type: QuestionType.TEXT,
      question: "Where can moon rocks be found today?",
      correctAnswer: "In museums around the world",
      category: "Reading comprehension; detail"
    },
    {
      id: 9,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Which sentence is written correctly?",
      options: [
        "She don't like apples.",
        "They isn't coming today.",
        "We aren't going to the park.",
        "He weren't at school yesterday."
      ],
      correctAnswer: "We aren't going to the park.",
      category: "Grammar; corrections MC"
    },
    {
      id: 10,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Choose the correct word: I have _____ apples than you.",
      options: ["few", "fewer", "fewest", "more few"],
      correctAnswer: "fewer",
      category: "Grammar; correction"
    },
    {
      id: 11,
      type: QuestionType.TEXT,
      question: "Correct this sentence: me and my friend likes to plays soccer",
      correctAnswer: "My friend and I like to play soccer.",
      category: "Sentence correction; open write"
    },
    {
      id: 12,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Choose the best word: The _____ of the story was very interesting.",
      options: ["end", "ending", "ended", "ends"],
      correctAnswer: "ending",
      category: "Vocabulary; sentence completion"
    },
    {
      id: 13,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Which sentence uses commas correctly?",
      options: [
        "I need to buy eggs, milk bread and cheese.",
        "I need to buy eggs milk, bread and cheese.",
        "I need to buy eggs, milk, bread, and cheese.",
        "I need to buy eggs milk bread and cheese."
      ],
      correctAnswer: "I need to buy eggs, milk, bread, and cheese.",
      category: "Grammar; correction MC"
    },
    {
      id: 14,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Choose the correct plural: The _____ are playing in the field.",
      options: ["child", "childs", "children", "childrens"],
      correctAnswer: "children",
      category: "Grammar; plural/singular correction"
    },
    {
      id: 15,
      type: QuestionType.TEXT,
      question: "Correct this sentence: Yesterday I goed to the store and buyed some candy",
      correctAnswer: "Yesterday I went to the store and bought some candy.",
      category: "Sentence correction; tense"
    },
    {
      id: 16,
      type: QuestionType.MULTIPLE_CHOICE,
      question: 'What does Fri. stand for in "It was cold on Fri., January 15th."',
      options: ["Frying", "Freedom", "Friday", "Freeze"],
      correctAnswer: "Friday",
      category: "Logical reasoning"
    }
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
        "When different colored bird fly across the sky"
      ],
      correctAnswer: "When sunlight passes through raindrops",
      category: "Reading comprehension; detail",
      passage: "Rainbow\n\nHave you ever looked in the sky and saw a rainbow?..."
    },
    {
      id: 2,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What are myths?",
      options: [
        "The scientific method",
        "Stories that explain how rainbows are made",
        "Stories created by the ancient people to explain things",
        "Short stories"
      ],
      correctAnswer: "Stories created by the ancient people to explain things",
      category: "Reading comprehension; detail"
    },
    {
      id: 3,
      type: QuestionType.TEXT,
      question: "Why do we no longer use myths?",
      correctAnswer: "Because we now have science to explain things",
      category: "Short open response; comprehension"
    },
    {
      id: 4,
      type: QuestionType.TEXT,
      question: "What are the colors of the rainbow?",
      correctAnswer: "Red, orange, yellow, green, blue, indigo, and violet",
      category: "Short open response; detail recall"
    },
    {
      id: 5,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What was the story mostly about?",
      options: [
        "The Oregon Country Fair",
        "Learning how to dance",
        "Emily overcoming her nervousness",
        "Emily wining third place at the country fair"
      ],
      correctAnswer: "Emily overcoming her nervousness",
      category: "Reading comprehension; main idea",
      passage: "Emily's First Dance\n\nEvery year Emily and her family went to the Oregon Country Fair..."
    },
    {
      id: 6,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What word best describes Emily at the end of the story?",
      options: ["Nervous", "Brave", "Shy", "Angry"],
      correctAnswer: "Brave",
      category: "Vocabulary; descriptions"
    },
    {
      id: 7,
      type: QuestionType.TEXT,
      question: "Why did the author most likely write this story?",
      correctAnswer: "To use an example of the fair to teach a lesson about overcoming fear",
      category: "Short open response; author's purpose"
    },
    {
      id: 8,
      type: QuestionType.TEXT,
      question: "What will happen if Emily continues to practice dancing and participating in the dance competition?",
      correctAnswer: "She will become more confident, and get better, placing higher than 3rd",
      category: "Short open response; inferences"
    },
    {
      id: 9,
      type: QuestionType.FILL_IN_THE_BLANK,
      question: "Write the antonym for each word:",
      blanks: ["Hot: _____", "Big: _____"],
      correctAnswer: ["Cold", "Small"],
      category: "Vocabulary; antonyms"
    },
    {
      id: 10,
      type: QuestionType.MATCHING,
      question: "Connects the words that are homonyms.",
      columns: [
        { title: "Column 1", items: ["Know", "Meet", "Too", "Flower"] },
        { title: "Column 2", items: ["Two", "Flour", "No", "Meat"] }
      ],
      correctAnswer: "Know-No, Meet-Meat, Too-Two, Flower-Flour",
      category: "Vocabulary; homonyms"
    },
    {
      id: 11,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Replace the bold word in the sentence: My sister can imitate the sound of a monkey",
      options: ["Hear", "Copy", "Quiver", "Sing"],
      correctAnswer: "Copy",
      category: "Vocabulary; synonyms (MC)"
    },
    {
      id: 12,
      type: QuestionType.FILL_IN_THE_BLANK,
      question: "Choose the correct word for the given sentence: Tom went to the store, _____ bought milk",
      blanks: ["then/than"],
      correctAnswer: ["then"],
      category: "Sentence correction; vocabulary & tense"
    },
    {
      id: 13,
      type: QuestionType.MATCHING,
      question: "Match the sense with the sensory word:",
      columns: [
        { title: "Senses", items: ["Hear", "Smell", "Touch", "Taste"] },
        { title: "Words", items: ["Bang! Bang!", "Sour", "Smelly", "Soft"] }
      ],
      correctAnswer: "Hear-Bang! Bang!, Smell-Smelly, Touch-Soft, Taste-Sour",
      category: "Vocabulary; word association"
    },
    {
      id: 14,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Which words are Onomatopoeias?",
      options: ["Splash", "Snake", "Hiss", "Water"],
      correctAnswer: "Splash",
      category: "Word type recognition"
    },
    {
      id: 15,
      type: QuestionType.FILL_IN_THE_BLANK,
      question: "Change each word to its plural form. Write the word on the line.",
      blanks: ["During autumn the _____ change colors. (leaf)", "The mother cat has four _____. (baby)"],
      correctAnswer: ["leaves", "babies"],
      category: "Vocabulary; singular/plural"
    },
    {
      id: 16,
      type: QuestionType.WORD_SORT,
      question: "Write each word under the correct heading:",
      columns: [
        { title: "Prefix", items: ["Rewrite", "Outside", "Import"] },
        { title: "Suffix", items: ["Happiness", "Thankful", "Headphone"] }
      ],
      correctAnswer: "Prefix: Rewrite, Import, Headphone. Suffix: Happiness, Thankful. (Outside is compound)",
      category: "Vocabulary; prefix & suffix"
    }
  ],
  4: [
    {
      id: 1,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "How do monkeys use their tails?",
      options: ["To walk", "To hold things", "To swim", "To attack other animals"],
      correctAnswer: "To hold things",
      category: "Reading comprehension; detail",
      passage: "How Animals Use Their Tails\n\nMany animals rely on their tails to help them survive..."
    },
    {
      id: 2,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Why did the author write this passage?",
      options: ["To persuade the reader", "To entertain the reader", "To make fun of animals", "To inform the reader"],
      correctAnswer: "To inform the reader",
      category: "Reading comprehension; Author's purpose"
    },
    {
      id: 3,
      type: QuestionType.TEXT,
      question: "How does an alligator use its tail differently from a fish?",
      correctAnswer: "Alligators use tails to attack, fish use them mainly for propulsion and escape.",
      category: "Reading comprehension; detail comparison"
    },
    {
      id: 4,
      type: QuestionType.TEXT,
      question: "Explain the difference between predator and prey.",
      correctAnswer: "A predator hunts other animals (prey) for food.",
      category: "Reading comprehension; compare & contrast"
    },
    {
      id: 5,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Why was Jacob able to win his first match in the tournament?",
      options: ["He cheated", "His brother helped him", "He knew his opponent well", "He is a master chess player"],
      correctAnswer: "His brother helped him",
      category: "Reading comprehension; detail",
      passage: "Jacob Enters a Chess Tournament\n\nWhen Jacob was 12 years old he saw his older brother playing chess..."
    },
    {
      id: 6,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Why did Jacob make mistakes in his first match?",
      options: [
        "He didn't eat a good breakfast",
        "He didn't practice enough",
        "He felt nervous during the game",
        "He wanted to let his opponent win"
      ],
      correctAnswer: "He felt nervous during the game",
      category: "Reading comprehension; detail"
    },
    {
      id: 7,
      type: QuestionType.TEXT,
      question: "Describe Jacob's relationship with his brother.",
      correctAnswer: "Supportive, his brother teaches and encourages him.",
      category: "Reading comprehension; evaluation"
    },
    {
      id: 8,
      type: QuestionType.TEXT,
      question: "Why did Jacob enter the tournament?",
      correctAnswer: "To see how much he had improved.",
      category: "Reading comprehension; detail recall"
    },
    {
      id: 9,
      type: QuestionType.FILL_IN_THE_BLANK,
      question: "Write the plural form of the following words:",
      blanks: ["Man: _____", "Mouse: _____", "Child: _____", "Tooth: _____"],
      correctAnswer: ["Men", "Mice", "Children", "Teeth"],
      category: "Grammar; plural/singular use"
    },
    {
      id: 10,
      type: QuestionType.GRAMMAR,
      question: "Correct this sentence: We saw sams book on the table so we decided to return it to him",
      correctAnswer: "We saw Sam's book on the table, so we decided to return it to him.",
      category: "Grammar; Sentence correction"
    },
    {
      id: 11,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Which word should be capitalized in this sentence? The telescope made the planet saturn look huge.",
      options: ["telescope", "saturn", "huge", "none of the above"],
      correctAnswer: "saturn",
      category: "Grammar; punctuation"
    },
    {
      id: 12,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What is the subject of this sentence? Sally gave her dog the bone to chew on.",
      options: ["Sally", "Dog", "Bone", "Gave"],
      correctAnswer: "Sally",
      category: "Grammar; Sentence structure; identification"
    },
    {
      id: 13,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Choose the best word to complete the sentence below. John was _____ when he saw a group of bulls charging at him.",
      options: ["sad", "frightened", "thankful", "excited"],
      correctAnswer: "frightened",
      category: "Grammar; Sentence structure; completion"
    },
    {
      id: 14,
      type: QuestionType.GRAMMAR,
      question: "Correct the following sentence: The group of fourth graders were going to the park.",
      correctAnswer: "The group of fourth graders was going to the park.",
      category: "Grammar; Sentence correction"
    },
    {
      id: 15,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What is the past tense of the verb to bring?",
      options: ["Bring", "Bringed", "Brought", "Brung"],
      correctAnswer: "Brought",
      category: "Grammar; Word tense"
    },
    {
      id: 16,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What does the word vile mean in this sentence? The killer was a vile man who hurt innocent people.",
      options: ["Friendly", "Evil", "Strange"],
      correctAnswer: "Evil",
      category: "Vocabulary; definition"
    }
  ],
  5: [
    {
      id: 1,
      type: QuestionType.MULTIPLE_CHOICE,
      question: 'What does the word "diverse" mean in paragraph one?',
      options: ["Having different kinds", "Huge", "Beautiful", "Strange"],
      correctAnswer: "Having different kinds",
      category: "Vocabulary; definition in context",
      passage: `Tropical Rain Forests...`
    },
    {
      id: 2,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Which of these is not found in the tropical rain forests?",
      options: ["Fruits", "Vanilla", "Butter", "Medicine"],
      correctAnswer: "Butter",
      category: "Reading comprehension; detail"
    },
    {
      id: 3,
      type: QuestionType.TEXT,
      question: "Why do you think hardly any sunlight reaches the understory or the forest floor?",
      correctAnswer: "Because the canopy layer above is very dense with leaves, blocking the sunlight.",
      category: "Reading comprehension; inference"
    },
    {
      id: 4,
      type: QuestionType.TEXT,
      question: "According to the passage, why are tropical rain forests being destroyed?",
      correctAnswer: "Our need for resources is destroying them.",
      category: "Reading comprehension; cause-effect"
    },
    {
      id: 5,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What was the last thing Max did to get ready for Christmas?",
      options: [
        "Mail letters at the post office",
        "Hang his sign for uncle Robert",
        "Place the stocking above the fireplace",
        "Buy a Christmas tree"
      ],
      correctAnswer: "Place the stocking above the fireplace",
      category: "Reading comprehension; sequencing",
      passage: `Max's Christmas...`
    },
    {
      id: 6,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Why do you think uncle Robert told Max that Santa Claus brought the present?",
      options: [
        "To trick Max",
        "To keep Max's belief in Santa Claus alive",
        "Uncle Robert is Santa Claus",
        "He likes lying to Max"
      ],
      correctAnswer: "To keep Max's belief in Santa Claus alive",
      category: "Reading comprehension; inference"
    },
    {
      id: 7,
      type: QuestionType.TEXT,
      question: "Do you think Max believed what uncle Robert told him, at the end of the story?",
      correctAnswer: "It's ambiguous, but likely Max is old enough to start questioning it.",
      category: "Reading comprehension; evaluation"
    },
    {
      id: 8,
      type: QuestionType.TEXT,
      question: "Why did the author write this story?",
      correctAnswer: "To tell a heartwarming story about family traditions and Christmas.",
      category: "Reading comprehension; author's purpose"
    },
    {
      id: 9,
      type: QuestionType.GRAMMAR,
      question: "Underline the adjective(s) in the following sentence: After taking a shower, Mike's hair was smooth and soft.",
      correctAnswer: ["smooth", "soft"],
      category: "Grammar; parts of speech"
    },
    {
      id: 10,
      type: QuestionType.FILL_IN_THE_BLANK,
      question: "In the space given write an antonym for each word:",
      blanks: ["Happy: _____", "Light: _____", "Expensive: _____"],
      correctAnswer: ["Sad", "Dark/Heavy", "Cheap/Inexpensive"],
      category: "Vocabulary; antonyms"
    },
    {
      id: 11,
      type: QuestionType.FILL_IN_THE_BLANK,
      question: "Choose the correct homonym for each sentence. Homonym: ate, eight",
      blanks: ["I _____ three hotdogs and two burgers at the picnic.", "There are _____ types of ice cream flavors."],
      correctAnswer: ["ate", "eight"],
      category: "Vocabulary; homonyms"
    },
    {
      id: 12,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Pick the word that best completes the sentence: Even though Kevin knew the answer, he was too _____ to raise his hand.",
      options: ["Sick", "Embarrassed", "Sad"],
      correctAnswer: "Embarrassed",
      category: "Vocabulary; word choice"
    },
    {
      id: 13,
      type: QuestionType.FILL_IN_THE_BLANK,
      question: "Write the plural of each word:",
      blanks: ["Church: _____", "Butterfly: _____", "Prefix: _____", "Pen: _____"],
      correctAnswer: ["Churches", "Butterflies", "Prefixes", "Pens"],
      category: "Grammar; plural formation"
    },
    {
      id: 14,
      type: QuestionType.GRAMMAR,
      question: "Correct the sentence below: The barn max owned looked mysterious but it also looked like home.",
      correctAnswer: "The barn Max owned looked mysterious, but it also looked like home.",
      category: "Grammar; capitalization & punctuation"
    },
    {
      id: 15,
      type: QuestionType.GRAMMAR,
      question: "Correct the sentence below: After finishing her dinner, Sandy asked her Mom can i have a cookie?",
      correctAnswer: 'After finishing her dinner, Sandy asked her Mom, "Can I have a cookie?"',
      category: "Grammar; dialogue formatting"
    },
    {
      id: 16,
      type: QuestionType.GRAMMAR,
      question: "Replace the abbreviation with its meaning: After class Mike came over to my apt. to play some video games.",
      correctAnswer: "After class Mike came over to my apartment to play some video games.",
      category: "Grammar; abbreviations"
    }
  ],
  6: [
    {
      id: 1,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What is lightning?",
      options: ["It occurs because of Zeus", "A rod of fire", "The effect of God sneezing", "A large electrical current"],
      correctAnswer: "A large electrical current",
      category: "Reading comprehension; detail",
      passage: `Franklin's Experiment...`
    },
    {
      id: 2,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What do you think happened when Benjamin Franklin touched the key?",
      options: ["He was struck by lightning", "His hand got burned", "He felt a shock", "Nothing happened"],
      correctAnswer: "He felt a shock",
      category: "Reading comprehension; inference"
    },
    {
      id: 3,
      type: QuestionType.TEXT,
      question: "What was the purpose of Franklin's experiment?",
      correctAnswer: "To show that lightning was made of electricity.",
      category: "Reading comprehension; main idea"
    },
    {
      id: 4,
      type: QuestionType.TEXT,
      question: "Why did Franklin attach a key to the end of his kite?",
      correctAnswer: "The metal key could attract electrical charges from the air.",
      category: "Reading comprehension; detail"
    },
    {
      id: 5,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What is the purpose of the passage?",
      options: [
        "To inform the reader about parks",
        "To instruct the reader on how to make parks",
        "To persuade the reader that parks are a good place for kids",
        "To show that kids are very active"
      ],
      correctAnswer: "To persuade the reader that parks are a good place for kids",
      category: "Reading comprehension; author's purpose",
      passage: `Parks for Kids...`
    },
    {
      id: 6,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What is one bad influence for kids mentioned in the passage?",
      options: ["Fighting", "Drugs", "Alcohol", "Smoking"],
      correctAnswer: "Drugs",
      category: "Reading comprehension; detail"
    },
    {
      id: 7,
      type: QuestionType.TEXT,
      question: "What are some advantages of parks?",
      correctAnswer: "Safe environment, make new friends, avoid negative influences, stay active, strengthen community.",
      category: "Reading comprehension; listing"
    },
    {
      id: 8,
      type: QuestionType.TEXT,
      question: "Why would the community be strengthened because of parks?",
      correctAnswer: "Parents can meet and become friendlier as their children play together.",
      category: "Reading comprehension; cause-effect"
    },
    {
      id: 9,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What is the subject of this sentence? Sally's dog jumped over the obstacle.",
      options: ["Sally", "Dog", "Obstacle", "None of the above"],
      correctAnswer: "Dog",
      category: "Grammar; sentence structure"
    },
    {
      id: 10,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Which underlined part is incorrect? Cleopatra discovers gold in the hidden chamber a week ago.",
      options: ["Discovers", "Hidden", "Week", "None of the above"],
      correctAnswer: "Discovers",
      category: "Grammar; verb tense"
    },
    {
      id: 11,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Take out the trash Bruno. What type of sentence is this?",
      options: ["Exclamatory", "Interrogative", "Imperative", "Declarative"],
      correctAnswer: "Imperative",
      category: "Grammar; sentence types"
    },
    {
      id: 12,
      type: QuestionType.GRAMMAR,
      question: "Correct the following sentence: alexander was a great general who conquered many territorys.",
      correctAnswer: "Alexander was a great general who conquered many territories.",
      category: "Grammar; capitalization & pluralization"
    },
    {
      id: 13,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What does the word impaled mean in the following sentence? Maximus was impaled by the dagger but he still managed to defeat the vile emperor.",
      options: ["Chopped", "Stabbed", "Scraped", "Stung"],
      correctAnswer: "Stabbed",
      category: "Vocabulary; definition in context"
    },
    {
      id: 14,
      type: QuestionType.GRAMMAR,
      question: "Correct the following sentence: The college took their time in sending me a reply.",
      correctAnswer: "The college took its time in sending me a reply.",
      category: "Grammar; pronoun agreement"
    },
    {
      id: 15,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What is this sentence missing? Is Constantine ready to go fishing with his dad",
      options: ["Capital", "Period", "Question Mark", "Comma"],
      correctAnswer: "Question Mark",
      category: "Grammar; punctuation"
    },
    {
      id: 16,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Which underlined part is incorrect? The teacher gave Jack and I homework over the summer vacation.",
      options: ["gave", "I", "over", "summer"],
      correctAnswer: "I",
      category: "Grammar; pronoun case"
    }
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
        "All astronauts love tennis"
      ],
      correctAnswer: "Playing sports gave Sally the opportunity to attend the high school where she discovered her love for science",
      category: "Reading comprehension; cause-effect",
      passage: `Sally Ride The Astronaut...`
    },
    {
      id: 2,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What was the first step Sally took to become an astronaut?",
      options: [
        "Pursue a science degree in college",
        "Earn a PhD",
        "Apply for the shuttle program",
        "Undergo one year training, once she was a finalist"
      ],
      correctAnswer: "Apply for the shuttle program",
      category: "Reading comprehension; sequencing"
    },
    {
      id: 3,
      type: QuestionType.TEXT,
      question: "What word would you use to describe Sally Ride? Explain",
      correctAnswer: "Determined, intelligent, pioneering (with explanation).",
      category: "Reading comprehension; character analysis"
    },
    {
      id: 4,
      type: QuestionType.TEXT,
      question: "Why did the author write this story?",
      correctAnswer: "To inspire readers through Sally's story of accomplishments",
      category: "Reading comprehension; author's purpose"
    },
    {
      id: 5,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What was this story mostly about?",
      options: [
        "The danger of rattlesnakes",
        "Max's first camping trip",
        "Getting along with relatives",
        "Uncle Robert teaching Max about snakes"
      ],
      correctAnswer: "Max's first camping trip",
      category: "Reading comprehension; main idea",
      passage: `Into The Wild...`
    },
    {
      id: 6,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What does the word delusional mean?",
      options: ["Having unrealistic beliefs", "Seeing things that are not there", "To be liminal", "Being nervous"],
      correctAnswer: "Having unrealistic beliefs",
      category: "Vocabulary; definition"
    },
    {
      id: 7,
      type: QuestionType.TEXT,
      question: "If the author added a paragraph at the end of this story, what would it include?",
      correctAnswer: "Max's reflections on the camping trip, perhaps enjoying it more after the initial fear.",
      category: "Reading comprehension; prediction"
    },
    {
      id: 8,
      type: QuestionType.TEXT,
      question: "What words would you use to describe Max? Explain.",
      correctAnswer: "Initially timid and imaginative, later perhaps more adventurous (with explanation).",
      category: "Reading comprehension; character analysis"
    },
    {
      id: 9,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "In which sentence does the underlined word have the same meaning as in the sentence below: How will the town recover from the hurricane?",
      options: [
        "Tim got some fabric to recover the bed sheet",
        "Bob will recover from the accident soon",
        "How will they recover the stole item?",
        "He can recover useful material from junk"
      ],
      correctAnswer: "Bob will recover from the accident soon",
      category: "Vocabulary; word meaning"
    },
    {
      id: 10,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What does the underlined word mean in the sentence below: We camped in the grotto under the cliffs",
      options: ["A tree", "A hut", "A large rock", "A cave"],
      correctAnswer: "A cave",
      category: "Vocabulary; definition"
    },
    {
      id: 11,
      type: QuestionType.GRAMMAR,
      question: "Insert commas where they are needed: The first wedding in China the marriage of Yumi Lin and Xin Lee took place in 25 B.C.",
      correctAnswer: "The first wedding in China, the marriage of Yumi Lin and Xin Lee, took place in 25 B.C.",
      category: "Grammar; punctuation"
    },
    {
      id: 12,
      type: QuestionType.GRAMMAR,
      question: "Identify what is underlined as either a phrase or clause: When he was eight years old, he moved to Bronx, New York.",
      correctAnswer: "clause",
      category: "Grammar; sentence structure"
    },
    {
      id: 13,
      type: QuestionType.GRAMMAR,
      question: "Read the sentence and state whether it is a compound sentence or not: Lions and cats have the same number of whiskers—seven.",
      correctAnswer: "Not a compound sentence",
      category: "Grammar; sentence types"
    },
    {
      id: 14,
      type: QuestionType.GRAMMAR,
      question: "Join these independent clauses using a coordinating conjunction or semicolon: We can wait for Jim. We can leave without him.",
      correctAnswer: ["We can wait for Jim, or we can leave without him.", "We can wait for Jim; we can leave without him."],
      category: "Grammar; sentence combining"
    },
    {
      id: 15,
      type: QuestionType.GRAMMAR,
      question: "Rewrite the run on sentence: The members of congress are elected by the voters there are six thousand voters this year.",
      correctAnswer: "The members of congress are elected by the voters. There are six thousand voters this year.",
      category: "Grammar; sentence structure"
    },
    {
      id: 16,
      type: QuestionType.GRAMMAR,
      question: 'Underline each word that should be capitalized in the sentence: james said, "what time does pokemon start?"',
      correctAnswer: 'James said, "What time does Pokemon start?"',
      category: "Grammar; capitalization"
    }
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
        "Lead is made of carbon atoms"
      ],
      correctAnswer: "Tiny particles govern our world",
      category: "Reading comprehension; main idea",
      passage: `The Particles of Matter...`
    },
    {
      id: 2,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What are the building blocks of matter according to the passage?",
      options: ["Graphite", "Carbon", "Atoms", "Protons and electrons"],
      correctAnswer: "Atoms",
      category: "Reading comprehension; detail"
    },
    {
      id: 3,
      type: QuestionType.TEXT,
      question: "What causes two particles to be attracted? What causes them to be repelled?",
      correctAnswer: "Opposite charges attract, same charges repel.",
      category: "Reading comprehension; cause-effect"
    },
    {
      id: 4,
      type: QuestionType.TEXT,
      question: "What suggests that the particles in lead are attracted to the particles in an eraser?",
      correctAnswer: "The passage explains attraction through pencil lead and paper, not erasers.",
      category: "Reading comprehension; application"
    },
    {
      id: 5,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What is the main Idea of the Passage?",
      options: [
        "Fire causes pain",
        "The brain plays an important part in how we perceive the world",
        "The ancient Egyptians understood the brain",
        "Charles Sherrington was a genius"
      ],
      correctAnswer: "The brain plays an important part in how we perceive the world",
      category: "Reading comprehension; main idea",
      passage: `The Role of the Brain...`
    },
    {
      id: 6,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What carries electrical signals to the brain?",
      options: ["Skin", "Muscles", "Neurons", "The brain"],
      correctAnswer: "Neurons",
      category: "Reading comprehension; detail"
    },
    {
      id: 7,
      type: QuestionType.TEXT,
      question: "Why was Descartes's theory different from previous theories?",
      correctAnswer: "He argued the brain played an important role, unlike earlier theories (e.g., Egyptians favoring the heart).",
      category: "Reading comprehension; compare-contrast"
    },
    {
      id: 8,
      type: QuestionType.TEXT,
      question: "Describe a neuron and describe its function?",
      correctAnswer: "Neurons are like long cords that carry electrical signals to the brain.",
      category: "Reading comprehension; description"
    },
    {
      id: 9,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "In which sentence does the word effect have the same meaning as in: The effect of the storm could be seen in the widespread destruction of the town.",
      options: [
        "The deal was effected thanks to hard work.",
        "The beneficial effects of the drug were remarkable.",
        "The teacher said something to the effect of 'get out of the classroom.'",
        "None of the above"
      ],
      correctAnswer: "The beneficial effects of the drug were remarkable.",
      category: "Vocabulary; word meaning"
    },
    {
      id: 10,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Which underlined part is incorrect? The teacher gave Jack and I homework over the summer vacation.",
      options: ["gave", "I", "summer", "No Error"],
      correctAnswer: "I",
      category: "Grammar; pronoun case"
    },
    {
      id: 11,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Which underlined part is incorrect? Last week I went on a trip with my friends. We hiked, biked, and we were swimming all day.",
      options: ["trip", "biked", "We were swimming", "No Error"],
      correctAnswer: "We were swimming",
      category: "Grammar; verb tense consistency"
    },
    {
      id: 12,
      type: QuestionType.GRAMMAR,
      question: "Correct the following sentence: We were already to leave when the car suddenly broke down.",
      correctAnswer: "We were all ready to leave when the car suddenly broke down.",
      category: "Grammar; word choice"
    },
    {
      id: 13,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What does the underlined word mean? When the professor continued to ignore the assistant, we knew that the assistant's input was inconsequential.",
      options: ["Inappropriate", "Valuable", "Inspiring", "Irrelevant"],
      correctAnswer: "Irrelevant",
      category: "Vocabulary; definition"
    },
    {
      id: 14,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Which transition word would be the most appropriate for this sentence: The apples were salty, ___ the peaches were sweet.",
      options: ["and", "however", "therefore", "also"],
      correctAnswer: "however",
      category: "Grammar; transitions"
    },
    {
      id: 15,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What does the underlined word mean? Alice Paul was an advocate of women's voting rights, which was demonstrated through her participation in protests and boycotts.",
      options: ["Against", "Supporter", "Advertise", "Knowledgeable"],
      correctAnswer: "Supporter",
      category: "Vocabulary; definition"
    },
    {
      id: 16,
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Which underlined part is incorrect? Mr. Smith, owner of the car shop, gave I and Allison free ice cream today.",
      options: ["Gave", "Owner", "I", "Today"],
      correctAnswer: "I",
      category: "Grammar; pronoun case"
    }
  ]
};