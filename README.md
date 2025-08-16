# Problem List - Coding Problem Management Tool

A comprehensive Next.js application for managing and studying coding problems with advanced features like tag management, progress tracking, and study options.

## Features

### 🏷️ Tag Management

- **Default Tags**: Array, Heap, DP, DP Advanced, Graph, Default, Starred
- **Custom Tags**: Add, edit, and delete custom tags with color coding
- **Tag Colors**: Choose from 8 predefined color options

### 📚 Question Management

- **Manual Addition**: Add questions with name, URL, difficulty, and tags
- **CSV Upload**: Bulk upload questions from CSV files
- **Data Export**: Export your question list to CSV format
- **CRUD Operations**: Full create, read, update, delete functionality

### 📖 Study Mode

- **Progress Tracking**: Mark questions as completed or starred
- **Study Options**:
  - Show/Hide difficulty levels
  - Randomize question order
  - Category-wise or single list view
  - Fold/Unfold all categories
- **Accordion Interface**: Collapsible sections for each tag category
- **Progress Reset**: Reset all progress with confirmation

### 🎨 Modern UI

- **Responsive Design**: Works on desktop and mobile devices
- **Tailwind CSS**: Beautiful, modern styling
- **Lucide Icons**: Clean, consistent iconography
- **Interactive Elements**: Hover effects, transitions, and smooth animations

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **Local Storage** - Client-side data persistence

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd my-problem-list
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Adding Questions

#### Manual Addition

1. Navigate to the **Manage** page
2. Click **"Add Question"**
3. Fill in the question details:
   - Name (question title)
   - URL (LeetCode problem link)
   - Difficulty (Easy/Medium/Hard)
   - Tags (select from available tags)

#### CSV Upload

1. Prepare a CSV file with columns: `title`, `url`, `difficulty`, `tags`
2. Tags should be comma-separated
3. Click **"Upload CSV"** and select your file
4. Questions will be automatically processed and added

**Sample CSV Format:**

```csv
title,url,difficulty,tags
Two Sum,https://leetcode.com/problems/two-sum/,Easy,Arrays,Hash Table
Add Two Numbers,https://leetcode.com/problems/add-two-numbers/,Medium,Linked List,Math
```

### Managing Tags

1. **Add New Tag**:

   - Click **"Add Tag"** on the Manage page
   - Enter tag name and select color
   - Click **"Add"**

2. **Edit Tag**:

   - Click the edit icon (pencil) on any tag
   - Modify name or color
   - Click **"Update"**

3. **Delete Tag**:
   - Click the delete icon (trash) on any tag
   - Confirm deletion

### Studying Problems

1. **Navigate to Study Page**: Click **"Study"** in the navigation
2. **Configure Study Options**:
   - **Hide Difficulty**: Toggle difficulty level visibility
   - **Randomize**: Randomize question order within categories
   - **Category Wise**: Switch between organized and single list views
   - **Fold/Unfold**: Collapse or expand all categories
3. **Track Progress**:
   - Click the circle icon to mark as completed
   - Click the star icon to mark as starred
   - View progress summary at the top

### Study Options Explained

- **Show Difficulty**: Toggle visibility of Easy/Medium/Hard badges
- **Randomize**: Randomize question order for varied study sessions
- **Category Wise**: Organize questions by tags or show as single list
- **Fold/Unfold**: Quickly collapse or expand all tag sections
- **Reset Progress**: Clear all completion and star marks

## File Structure

```
my-problem-list/
├── app/
│   ├── layout.tsx          # Root layout with navigation
│   ├── page.tsx            # Study page (home)
│   ├── manage/
│   │   └── page.tsx        # Manage page for CRUD operations
│   └── globals.css         # Global styles
├── components/
│   └── navigation.tsx      # Navigation component
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   ├── storage.ts          # Local storage utilities
│   ├── excel.ts            # CSV processing utilities
│   └── utils.ts            # Utility functions
├── sample-questions.csv    # Sample data for testing
└── package.json            # Dependencies and scripts
```

## Data Persistence

All data is stored in the browser's localStorage:

- **Questions**: Problem list with metadata
- **Tags**: Custom and default tags with colors
- **Progress**: Completion status and star marks
- **Study Options**: User preferences for study mode

## CSV Format Requirements

For successful CSV uploads, ensure your file has:

- **Header row**: `title,url,difficulty,tags`
- **Title**: Human-readable question name
- **URL**: Valid LeetCode problem URLs
- **Difficulty**: One of: Easy, Medium, Hard
- **Tags**: Comma-separated tag names

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues or questions:

1. Check the existing issues
2. Create a new issue with detailed description
3. Include steps to reproduce if applicable

---

**Happy Coding! 🚀**
