# STAR Advisement Tool Frontend

The STAR Advisement Tool (SAT for short) is a web application that helps community college transfer students to plan their courses in a Cal State LA program with or without the help of an advisor. There are two ways SAT can be used for advisement, which we refer to as Pre-Transfer Advisement and Post-Transfer Advisement.

This project is a React application bootstrapped with Vite. It offers a fast development experience and is optimized for performance.

## Table of Contents

- [STAR Advisement Tool Frontend](#star-advisement-tool-frontend)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Scripts](#scripts)
  - [Folder Structure](#folder-structure)
  - [Dependencies](#dependencies)
  - [Dev Dependencies](#dev-dependencies)
  - [License](#license)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed (version 14.x or later)
- npm (Node Package Manager) installed

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/csula-star/STAR-advisement-tool-frontend.git
   
   cd STAR-advisement-tool-frontend
   ```
2. Install the dependencies:
   ```sh
   npm install
   ```

## Configuration

- The application uses Vite's proxy feature to proxy requests to http://localhost:3001. You can modify this proxy configuration in the package.json file if needed.

## Scripts

`npm run dev`: Starts the development server.

`npm run build`: Builds the app for production.

`npm run lint`: Lints the codebase using ESLint.

`npm run preview`: Previews the production build locally.

## Folder Structure

- **`public/`**: Static assets like HTML, images, etc.
- **`src/`**: Source code of the application.
  - **`assets/`**: Static assets specific to the application.
  - **`components/`**: Reusable React components.
  - **`pages/`**: Page components for different routes.
  - **`App.jsx`**: Main App component.
  - **`main.jsx`**: Entry point for the React application.
  - **`index.css`**: Global CSS file.
- **`.env`**: Environment variables.
- **`vite.config.js`**: Vite configuration file.

## Dependencies

- **React**: A JavaScript library for building user interfaces.
- **Vite**: A build tool that provides a fast development server and optimized builds.
- **@emotion/react**: CSS-in-JS library for styling components.
- **@material-ui/core**: React components implementing Google's Material Design.
- **axios**: Promise-based HTTP client for making requests.
- **chart.js**: Simple yet flexible JavaScript charting library.
- **react-redux**: Official React bindings for Redux.
- **react-router-dom**: DOM bindings for React Router.
- **react-table**: Lightweight, fast, and extendable datagrid for React.
- **yup**: JavaScript schema builder for value parsing and validation.

## Dev Dependencies

- **@types/react**: TypeScript types for React.
- **@vitejs/plugin-react**: Vite plugin for React support.
- **eslint**: A pluggable JavaScript linter.
- **eslint-plugin-react**: React specific linting rules for ESLint.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
