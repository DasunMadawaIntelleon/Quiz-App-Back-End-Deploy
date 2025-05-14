# Quiz App Project Repository

This repository is structured to separate different aspects of the project for clarity and ease of use. Below is a visualization of the directory structure along with brief explanations of each folder and file.

## Repository Structure

```mermaid
graph TD
    A[Root Directory]
    
    A --> B[docs]
    B --> B1[api-specs]
    B --> B2[er-diagrams]
    B --> B3[adr]

    A --> D1([.gitignore])
    A --> D2([README.md])
    
    A --> C[code]
    C --> C1[frontend]
    C --> C2[backend]
```

## Folder and File Breakdown

- **docs/**
  - This folder contains all documentation related to the project.
    - **api-specs/**: API specifications and related documentation files.
    - **er-diagrams/**: Entity-Relationship diagrams for database design.
    - **adr/**: Architecture Decision Records, documenting important architectural choices made during development.

- **code/**
  - This folder contains all code for both the frontend and backend of the project.
    - **frontend/**: All files related to frontend development.
    - **backend/**: All files related to backend development.

- **.gitignore**
  - Specifies files and directories that should be ignored by Git, ensuring that sensitive or unnecessary files are not pushed to the repository.

- **README.md**
  - This file, providing an overview of the repository's structure and contents.

## Git Feature Branch Workflow

In this repository, we follow the **Feature Branch Workflow** to ensure that new features, bug fixes, and improvements are developed in isolation before they are integrated into the main codebase. Below is an overview of how the workflow operates:

### Diagram

The following diagram illustrates the Git Feature Branch Workflow:

```mermaid
gitGraph
    commit id: "Initial Commit"
    branch develop
    checkout develop
    commit id: "Set up project"
    
    branch feature/feature-1
    checkout feature/feature-1
    commit id: "Work on feature 1"
    commit id: "Finish feature 1"
    
    checkout develop
    merge feature/feature-1 id: "Merge feature-1 branch"
    commit id: "Prepare for release"
    
    branch feature/feature-2
    branch feature/feature-2-developer-x
    checkout feature/feature-2
    commit id: "Work on feature-2"

    checkout feature/feature-2-developer-x
    commit id: "Developer-x work on feature-2"

    checkout feature/feature-2
    merge feature/feature-2-developer-x id: "Merge developer-x branch"

    checkout develop
    merge feature/feature-2 id: "Merge feature-2 branch"
    commit id: "Release version 1.0"

```

## How to Use

1. Navigate through the `docs/` folder for important project documentation such as API specs, ER diagrams, and architecture decisions.
2. Explore the `code/` folder to view and work on the project’s frontend and backend code.
3. Refer to the `.gitignore` file to understand what files are ignored from version control.
