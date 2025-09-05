# DSA Intuition Teacher

A lightweight React Native/Expo app for learning Data Structures and Algorithms with interactive modules.

## Project Structure

```
DSAIntuitionTeacher/
├── app/                    # Expo Router app directory
│   ├── _layout.tsx        # Root layout and navigation configuration
│   ├── index.tsx          # Landing page (redirects to /home)
│   ├── home.tsx           # Home screen with module cards
│   ├── module/            # Module-related screens
│   │   ├── index.tsx      # Module index (shows all modules)
│   │   └── [id].tsx       # Dynamic module detail screen
│   └── problem/           # Problem-related screens
│       └── [id].tsx       # Dynamic problem detail screen
├── src/
│   ├── modules.json       # Global module definitions
│   └── modules/           # Module-level organization
│       ├── basics/        # Basics module
│       │   ├── module.json    # Module content and submodules
│       │   └── problems/      # Module-specific problems
│       │       └── b1.json    # Reverse an Array
│       ├── patterns/      # Patterns module
│       │   ├── module.json    # Module content and submodules
│       │   └── problems/      # Module-specific problems
│       │       └── p1.json    # Right Triangle Star Pattern
│       ├── slidingWindow/ # Sliding Window module
│       │   ├── module.json    # Module content and submodules
│       │   └── problems/      # Module-specific problems
│       │       ├── p1.json    # Maximum Sum Subarray of Size K
│       │       ├── p2.json    # First Negative Number in Every Window
│       │       ├── p3.json    # Count Occurrences of Anagrams
│       │       └── p4.json    # Longest Substring Without Repeating
│       └── twoPointers/   # Two Pointers module
│           ├── module.json    # Module content and submodules
│           └── problems/      # Module-specific problems
│               └── tp1.json   # Two Sum in Sorted Array
└── Essential config files
    ├── package.json        # Dependencies
    ├── app.json           # Expo configuration
    ├── tsconfig.json      # TypeScript configuration
    └── eslint.config.js   # Linting rules
```

## Features

- **Lightweight**: Minimal dependencies, focused on core functionality
- **Module-based**: Each DSA concept is a separate module
- **Collapsible UI**: Interactive submodule and problem lists
- **Problem Details**: Individual problem screens with rich content
- **Interactive Elements**: Collapsible description and aim sections
- **User Playground**: Module-specific interactive learning area (placeholder)
- **Understanding Mapping**: Visual learning tools (placeholder)
- **Type-safe**: Full TypeScript support
- **Cross-platform**: Works on iOS, Android, and Web
- **Clean Architecture**: Proper separation of concerns and file organization
- **Module-Level Development**: Each module is completely self-contained

## How It Works

1. **Landing Page** (`app/index.tsx`): Redirects to the home screen
2. **Home Screen** (`app/home.tsx`): Beautiful landing page with module cards
3. **Module Index** (`app/module/index.tsx`): Alternative view of all modules
4. **Module Detail** (`app/module/[id].tsx`): Dynamic screen showing submodules and problems
5. **Problem Detail** (`app/problem/[id].tsx`): Individual problem with description, aim, examples, and actions
6. **Data Structure**: Each module has its own folder with module.json and problems/

## Problem Screen Features

Each problem screen includes:

- **Problem Title**: Clear problem statement
- **Difficulty Badge**: Easy/Medium/Hard indicators
- **Tags**: Relevant concepts and techniques
- **Collapsible Description**: Click to show/hide problem details
- **🎯 What Aim to Achieve**: Click to show/hide learning objectives
- **Examples**: Input/output pairs with explanations
- **🚀 User Playground**: Module-specific interactive area (placeholder)
- **🧠 Map Your Understanding**: Learning visualization tools (placeholder)

## File Organization Benefits

- **`index.tsx`**: Clean landing page that redirects to home
- **`home.tsx`**: Dedicated home screen with proper styling
- **`module/index.tsx`**: Alternative module listing view
- **`module/[id].tsx`**: Dynamic route for individual modules
- **`problem/[id].tsx`**: Global problem screen (works for all modules)
- **`_layout.tsx`**: Centralized navigation configuration

## Adding New Problems

1. Create a new JSON file in `src/modules/[moduleName]/problems/[problemId].json`:

```json
{
  "problemId": "unique_id",
  "title": "Problem Title",
  "description": "Detailed problem description",
  "aim": "What the user aims to achieve",
  "moduleId": "module_id",
  "submoduleId": "submodule_id",
  "difficulty": "Easy|Medium|Hard",
  "tags": ["Tag1", "Tag2"],
  "examples": [
    {
      "input": "Sample input",
      "output": "Expected output",
      "explanation": "How to get the output"
    }
  ]
}
```

2. Add the problem to the corresponding module's submodule in `src/modules/[moduleName]/module.json`
3. The problem screen will automatically work with the new problem

## Adding New Modules

1. Create a new module folder: `src/modules/[moduleName]/`
2. Create `module.json` in the module folder:

```json
{
  "moduleId": "your_module_id",
  "moduleName": "Your Module Name",
  "description": "Module description",
  "submodules": [
    {
      "submoduleId": "unique_id",
      "title": "Submodule Title",
      "description": "Submodule description",
      "problems": [
        {
          "problemId": "unique_problem_id",
          "title": "Problem Title"
        }
      ]
    }
  ]
}
```

3. Create `problems/` folder and add problem JSON files
4. Add the module to `src/modules.json`
5. Import the data file in `app/module/[id].tsx`
6. Add the case in the `getModuleData` function

## Development

- `npm start` - Start the Expo development server
- `npm run web` - Run on web
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator

## Current Modules

- **Basics**: Arrays, loops, and fundamental concepts
- **Patterns**: Star patterns, number patterns
- **Sliding Window**: Fixed, variable, and advanced sliding window techniques
- **Two Pointers**: Basic and advanced two pointer problems

## Dependencies

This project uses only essential dependencies:

- **Core**: React Native, Expo, Expo Router
- **Navigation**: Built-in Expo Router navigation
- **Styling**: React Native StyleSheet
- **Type Safety**: TypeScript

## Navigation Flow

```
/ → /home → /module/[id] → /problem/[id]
     ↓
/module/index → /module/[id] → /problem/[id]
```

- **Root** (`/`): Redirects to home
- **Home** (`/home`): Main landing page with module cards
- **Module Index** (`/module/index`): Alternative module listing
- **Module Detail** (`/module/[id]`): Individual module with submodules
- **Problem Detail** (`/problem/[id]`): Individual problem with full details

## Module-Level Development

- **Global Components**: Problem screen, navigation, layout, modules.json
- **Module-Specific**: Each module has its own folder with:
  - `module.json`: Module content and submodules
  - `problems/`: Module-specific problem files
- **Easy Extension**: Add new problems without touching global code
- **Scalable**: Each module can have its own problem types and interactions
- **Self-Contained**: Each module folder contains everything needed for that module
