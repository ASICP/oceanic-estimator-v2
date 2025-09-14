import { getUncachableGitHubClient } from './github-client';
import fs from 'fs';
import path from 'path';

interface FileToSync {
  path: string;
  content: string;
}

export class GitHubSync {
  private static async getFilesToSync(): Promise<FileToSync[]> {
    const files: FileToSync[] = [];
    
    // Root configuration files
    const configFiles = [
      'package.json',
      'tsconfig.json',
      'vite.config.ts',
      'tailwind.config.ts',
      'drizzle.config.ts',
      'postcss.config.js',
      'components.json',
      'design_guidelines.md',
      'replit.md'
    ];

    // Frontend HTML and main entry
    const frontendBaseFiles = [
      'client/index.html',
      'client/src/main.tsx',
      'client/src/App.tsx',
      'client/src/index.css'
    ];

    // Frontend components
    const componentFiles = [
      'client/src/components/AgentCard.tsx',
      'client/src/components/AuthLogin.tsx',
      'client/src/components/CostDashboard.tsx',
      'client/src/components/CostEstimatorWizard.tsx',
      'client/src/components/GitHubSync.tsx',
      'client/src/components/Step1DefineWorkflow.tsx',
      'client/src/components/Step2AssembleTeam.tsx',
      'client/src/components/Step3ResourceNeeds.tsx',
      'client/src/components/Step4PricingBilling.tsx',
      'client/src/components/Step5FinalizeSimulate.tsx',
      'client/src/components/TaskPresetCard.tsx',
      'client/src/components/WizardHeader.tsx',
      'client/src/components/WizardNavigation.tsx'
    ];

    // UI components (all shadcn/ui components)
    const uiComponents = [
      'client/src/components/ui/accordion.tsx',
      'client/src/components/ui/alert-dialog.tsx',
      'client/src/components/ui/alert.tsx',
      'client/src/components/ui/aspect-ratio.tsx',
      'client/src/components/ui/avatar.tsx',
      'client/src/components/ui/badge.tsx',
      'client/src/components/ui/breadcrumb.tsx',
      'client/src/components/ui/button.tsx',
      'client/src/components/ui/calendar.tsx',
      'client/src/components/ui/card.tsx',
      'client/src/components/ui/carousel.tsx',
      'client/src/components/ui/chart.tsx',
      'client/src/components/ui/checkbox.tsx',
      'client/src/components/ui/collapsible.tsx',
      'client/src/components/ui/command.tsx',
      'client/src/components/ui/context-menu.tsx',
      'client/src/components/ui/dialog.tsx',
      'client/src/components/ui/drawer.tsx',
      'client/src/components/ui/dropdown-menu.tsx',
      'client/src/components/ui/form.tsx',
      'client/src/components/ui/hover-card.tsx',
      'client/src/components/ui/input-otp.tsx',
      'client/src/components/ui/input.tsx',
      'client/src/components/ui/label.tsx',
      'client/src/components/ui/menubar.tsx',
      'client/src/components/ui/navigation-menu.tsx',
      'client/src/components/ui/pagination.tsx',
      'client/src/components/ui/popover.tsx',
      'client/src/components/ui/progress.tsx',
      'client/src/components/ui/radio-group.tsx',
      'client/src/components/ui/resizable.tsx',
      'client/src/components/ui/scroll-area.tsx',
      'client/src/components/ui/select.tsx',
      'client/src/components/ui/separator.tsx',
      'client/src/components/ui/sheet.tsx',
      'client/src/components/ui/sidebar.tsx',
      'client/src/components/ui/skeleton.tsx',
      'client/src/components/ui/slider.tsx',
      'client/src/components/ui/switch.tsx',
      'client/src/components/ui/table.tsx',
      'client/src/components/ui/tabs.tsx',
      'client/src/components/ui/textarea.tsx',
      'client/src/components/ui/toast.tsx',
      'client/src/components/ui/toaster.tsx',
      'client/src/components/ui/toggle-group.tsx',
      'client/src/components/ui/toggle.tsx',
      'client/src/components/ui/tooltip.tsx'
    ];

    // Hooks, utilities, and pages
    const utilityFiles = [
      'client/src/hooks/use-mobile.tsx',
      'client/src/hooks/use-toast.ts',
      'client/src/hooks/useAgents.ts',
      'client/src/hooks/useCostEstimation.ts',
      'client/src/hooks/useWorkflows.ts',
      'client/src/lib/queryClient.ts',
      'client/src/lib/utils.ts',
      'client/src/pages/GitHubSyncPage.tsx',
      'client/src/pages/not-found.tsx',
      'client/src/utils/pdfGenerator.ts',
      'client/src/utils/socialSharing.ts'
    ];

    // Backend files
    const backendFiles = [
      'server/index.ts',
      'server/routes.ts',
      'server/storage.ts',
      'server/vite.ts',
      'server/auth-middleware.ts',
      'server/costCalculator.ts',
      'server/db.ts',
      'server/github-client.ts',
      'server/github-sync.ts'
    ];

    // Shared schema
    const sharedFiles = [
      'shared/schema.ts'
    ];

    // Generated agent avatars (important for the UI)
    const assetFiles = [
      'attached_assets/generated_images/Professional_Bree_agent_avatar_c0a3af89.png',
      'attached_assets/generated_images/Professional_Clay_agent_avatar_12ae85f9.png',
      'attached_assets/generated_images/Professional_Finley_agent_avatar_b19d0057.png',
      'attached_assets/generated_images/Professional_Lex_agent_avatar_bcd47740.png'
    ];

    // Combine all files
    const allFiles = [
      ...configFiles,
      ...frontendBaseFiles,
      ...componentFiles,
      ...uiComponents,
      ...utilityFiles,
      ...backendFiles,
      ...sharedFiles,
      ...assetFiles
    ];

    // Read text files
    const textFiles = [
      ...configFiles,
      ...frontendBaseFiles,
      ...componentFiles,
      ...uiComponents,
      ...utilityFiles,
      ...backendFiles,
      ...sharedFiles
    ];

    for (const filePath of textFiles) {
      try {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8');
          files.push({ path: filePath, content });
        }
      } catch (error) {
        console.warn(`Could not read file ${filePath}:`, error);
      }
    }

    // Handle binary asset files (images) - encode as base64
    for (const filePath of assetFiles) {
      try {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'base64');
          files.push({ path: filePath, content });
        }
      } catch (error) {
        console.warn(`Could not read asset file ${filePath}:`, error);
      }
    }

    // Add essential project files that might not exist yet
    const essentialFiles = [
      {
        path: '.gitignore',
        content: `node_modules/
dist/
.env
.env.local
.env.production
.env.development
*.log
.DS_Store
Thumbs.db
coverage/
.nyc_output/
.vscode/
.idea/
*.swp
*.swo
*~`
      },
      {
        path: 'README.md',
        content: `# Esteemed Ventures Multi-Agent Cost Estimator

A sophisticated cost estimation tool for multi-agent AI workflows, designed for investment professionals and business decision-makers.

## Features

- **Multi-Step Wizard**: Guided workflow setup with 5 comprehensive steps
- **Agent Selection**: Choose from specialized AI agents (Bree, Clay, Finley, Lex)
- **Cost Analysis**: Real-time cost calculations and visualizations
- **PDF Export**: Generate professional cost estimation reports
- **GitHub Integration**: Sync projects to GitHub repositories
- **Professional UI**: Clean, enterprise-grade interface

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **UI Components**: Radix UI + Tailwind CSS
- **State Management**: TanStack Query
- **Charts**: Recharts for data visualization

## Quick Start

1. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Set up environment variables**:
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your database and API credentials
   \`\`\`

3. **Push database schema**:
   \`\`\`bash
   npm run db:push
   \`\`\`

4. **Start development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

The application will be available at \`http://localhost:5000\`.

## Project Structure

\`\`\`
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility libraries
│   │   ├── pages/        # Page components
│   │   └── utils/        # Helper functions
├── server/               # Backend Express application
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data storage layer
│   └── github-sync.ts    # GitHub integration
├── shared/               # Shared types and schemas
└── attached_assets/      # Static assets and generated images
\`\`\`

## Environment Variables

Create a \`.env\` file with the following variables:

\`\`\`
DATABASE_URL=your_postgresql_connection_string
GITHUB_TOKEN=your_github_personal_access_token
SESSION_SECRET=your_session_secret
\`\`\`

## Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm run check\` - Type check with TypeScript
- \`npm run db:push\` - Push database schema changes

## GitHub Integration

The application includes GitHub sync functionality that allows you to:

1. Create new repositories
2. Sync project files to GitHub
3. Manage repository access

To use GitHub features, ensure you have a valid GitHub Personal Access Token in your environment variables.

## License

MIT License - see LICENSE file for details.

## Support

For questions and support, please refer to the documentation or create an issue in the repository.
`
      }
    ];

    // Add essential files if they don't exist
    essentialFiles.forEach(file => {
      if (!fs.existsSync(file.path)) {
        files.push({ path: file.path, content: file.content });
      }
    });

    return files;
  }

  static async createRepository(repoName: string, isPrivate: boolean = true): Promise<string> {
    const octokit = await getUncachableGitHubClient();
    
    try {
      const response = await octokit.rest.repos.createForAuthenticatedUser({
        name: repoName,
        private: isPrivate,
        description: 'Esteemed Ventures Agent Calculator - Multi-agent cost estimator',
        auto_init: true
      });
      
      return response.data.full_name;
    } catch (error: any) {
      if (error.status === 422) {
        throw new Error(`Repository '${repoName}' already exists`);
      }
      throw error;
    }
  }

  static async syncFilesToRepo(repoName: string, branch: string = 'main'): Promise<void> {
    const octokit = await getUncachableGitHubClient();
    
    // Get current user
    const { data: user } = await octokit.rest.users.getAuthenticated();
    const owner = user.login;
    
    // Get files to sync
    const files = await this.getFilesToSync();
    
    // Get the current commit SHA
    const { data: ref } = await octokit.rest.git.getRef({
      owner,
      repo: repoName,
      ref: `heads/${branch}`
    });
    
    const currentCommitSha = ref.object.sha;
    
    // Get the current tree
    const { data: currentCommit } = await octokit.rest.git.getCommit({
      owner,
      repo: repoName,
      commit_sha: currentCommitSha
    });
    
    // Create blobs for all files
    const tree = [];
    for (const file of files) {
      // Determine if this is a binary file based on the path
      const isBinaryFile = file.path.includes('attached_assets/generated_images/') && 
                          (file.path.endsWith('.png') || file.path.endsWith('.jpg') || file.path.endsWith('.jpeg'));
      
      const { data: blob } = await octokit.rest.git.createBlob({
        owner,
        repo: repoName,
        content: file.content,
        encoding: isBinaryFile ? 'base64' : 'utf-8'
      });
      
      tree.push({
        path: file.path,
        mode: '100644' as const,
        type: 'blob' as const,
        sha: blob.sha
      });
    }
    
    // Create new tree
    const { data: newTree } = await octokit.rest.git.createTree({
      owner,
      repo: repoName,
      tree,
      base_tree: currentCommit.tree.sha
    });
    
    // Create new commit
    const { data: newCommit } = await octokit.rest.git.createCommit({
      owner,
      repo: repoName,
      message: `Update Esteemed Ventures Agent Calculator - ${new Date().toISOString()}`,
      tree: newTree.sha,
      parents: [currentCommitSha]
    });
    
    // Update the reference
    await octokit.rest.git.updateRef({
      owner,
      repo: repoName,
      ref: `heads/${branch}`,
      sha: newCommit.sha
    });
  }

  static async getRepositories(): Promise<Array<{ name: string; full_name: string; private: boolean }>> {
    const octokit = await getUncachableGitHubClient();
    
    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 100
    });
    
    return repos.map((repo: any) => ({
      name: repo.name,
      full_name: repo.full_name,
      private: repo.private
    }));
  }
}