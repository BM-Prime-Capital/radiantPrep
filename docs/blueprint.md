# **App Name**: EduCode Access

## Core Features:

- Parent Registration: Secure parent registration with email and password via Firebase Authentication.
- Secure Code Generation: Generate unique, secure child access codes using a LLM to avoid any collisions.
- Automated Code Delivery: Send access codes to parents via email (integrate with a third-party email service) to serve as a tool for students to use.
- Child Access Authentication: Child login using generated access code, authenticating via Firebase Auth to enable safe question selection and storage of answers.
- Assessment Selection: Subject and grade selection UI for targeted assessment.
- Question Loading: Dynamically load ELA and Math questions and answers for selected grade, subject using static data files.
- Assessment and Grading: Assessment submission and score calculation by comparing student answers against the answers for each questions

## Style Guidelines:

- Primary color: HSL(210, 70%, 50%) - RGB hex code #3399FF, for a bright and trustworthy feel.
- Background color: HSL(210, 20%, 95%) - RGB hex code #F0F8FF, providing a calm and uncluttered space for focused work.
- Accent color: HSL(180, 60%, 40%) - RGB hex code #33CCCC, for interactive elements and calls to action.
- Clear and legible typography to ensure readability for all users.
- Intuitive icons to aid navigation and understanding.
- Clean, well-organized layout with ample white space.
- Subtle animations to provide feedback and enhance user experience.