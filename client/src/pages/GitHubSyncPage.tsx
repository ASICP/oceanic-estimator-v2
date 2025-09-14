import GitHubSync from "@/components/GitHubSync";

export default function GitHubSyncPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">GitHub Integration</h1>
            <p className="text-muted-foreground">
              Sync your Esteemed Ventures Agent Calculator to GitHub for version control and collaboration
            </p>
          </div>
          
          <GitHubSync />
        </div>
      </div>
    </div>
  );
}