# Schema Builder

Schema Builder is a web application that allows users to create and manage form schemas through a visual builder interface. It supports creating multiple form types (initial and secondary) with various input types and validation rules.

## Features

- Visual form schema builder
- Support for initial and secondary forms
- Multiple input types:
  - Dropdown
  - Slider
  - Textarea
  - Toggle
  - Action buttons
  - Output fields
  - Initial input references
- Input validation and constraints
- Real-time form preview
- Import/Export schema functionality
- Undo/Redo capabilities

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Testing Import Feature

The project includes example schema files in the `schema-examples` directory that can be used to test the import functionality. These examples demonstrate various schema configurations and can be used to understand the schema structure.

Example schemas include inside of `schema-examples` folder:
- Basic form layouts
- Input validation examples
- Complex form relationships
- Edge cases for testing

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MishaBatsiashvili/CykelFormSchemaBuilder.git
cd CykelFormSchemaBuilder
```

2. Install dependencies:
```bash
npm install
```

### Running the Development Server

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:5173`

### Running Tests

To run the test suite:

```bash
npm test
```

## Project Structure

```
client/
├── src/
│   ├── components/     # React components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Core utilities and types
│   ├── pages/         # Page components
│   └── store/         # Global state management
```

## Built With

- React
- TypeScript
- Chakra UI
- Zod
- React Hook Form
- Zustand 