import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Github, Upload, Plus, RefreshCw, Shield, LogOut } from "lucide-react";
import AuthLogin, { useAuth } from "./AuthLogin";

interface Repository {
  name: string;
  full_name: string;
  private: boolean;
}

export default function GitHubSync() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRepoName, setNewRepoName] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  
  // Authentication state
  const { user, csrfToken, isAuthenticated, isLoading: isAuthLoading, logout, isLoggingOut } = useAuth();
  
  // Fetch repositories (only when authenticated)
  const { data: repositories = [], isLoading: isLoadingRepos, refetch: refetchRepos, error: reposError } = useQuery({
    queryKey: ['/api/github/repositories'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/github/repositories');
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error('Failed to fetch repositories');
      }
      const data = await response.json();
      return data as Repository[];
    },
    enabled: isAuthenticated
  });

  // Create repository mutation
  const createRepoMutation = useMutation({
    mutationFn: async ({ name, isPrivate }: { name: string; isPrivate: boolean }) => {
      const headers: Record<string, string> = {};
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }
      const response = await apiRequest('POST', '/api/github/create-repository', { name, isPrivate }, headers);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create repository');
      }
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Repository "${data.repoFullName}" created successfully!`,
      });
      setNewRepoName("");
      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/github/repositories'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create repository",
        variant: "destructive",
      });
    }
  });

  // Sync files mutation
  const syncFilesMutation = useMutation({
    mutationFn: async ({ repoName }: { repoName: string }) => {
      const headers: Record<string, string> = {};
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }
      const response = await apiRequest('POST', '/api/github/sync-files', { repoName }, headers);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to sync files');
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Files synced to GitHub repository successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to sync files",
        variant: "destructive",
      });
    }
  });

  const handleCreateRepo = () => {
    if (!newRepoName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a repository name",
        variant: "destructive",
      });
      return;
    }
    createRepoMutation.mutate({ name: newRepoName.trim(), isPrivate });
  };

  const handleSyncFiles = () => {
    if (!selectedRepo) {
      toast({
        title: "Error",
        description: "Please select a repository",
        variant: "destructive",
      });
      return;
    }
    syncFilesMutation.mutate({ repoName: selectedRepo });
  };

  const handleLoginSuccess = (user: any, token: string) => {
    // Refresh repositories after login
    queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    queryClient.invalidateQueries({ queryKey: ['/api/github/repositories'] });
  };

  // Show authentication loading state
  if (isAuthLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            GitHub Integration
          </CardTitle>
          <CardDescription>
            Loading authentication status...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-muted-foreground">Checking authentication...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            GitHub Integration
            {isAuthenticated && (
              <Badge variant="outline" className="ml-2">
                <Shield className="h-3 w-3 mr-1" />
                Authenticated
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Sync your app's core files to a GitHub repository for version control and backup
            {isAuthenticated && user && (
              <span className="block mt-1 text-sm">
                Logged in as: <strong>{user.username}</strong>
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Authentication Status */}
          {!isAuthenticated ? (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>Authentication required to access GitHub integration features.</span>
                  <Button 
                    size="sm" 
                    onClick={() => setIsLoginDialogOpen(true)}
                    data-testid="button-login"
                  >
                    Login
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm text-green-800 dark:text-green-200">
                  Connected and authenticated
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                disabled={isLoggingOut}
                data-testid="button-logout"
              >
                <LogOut className="h-3 w-3 mr-1" />
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          )}

          {/* Show error if repositories failed to load due to auth */}
          {reposError && (
            <Alert variant="destructive">
              <AlertDescription>
                {reposError.message === 'Authentication required' 
                  ? 'Please log in to access your repositories.'
                  : `Error loading repositories: ${reposError.message}`
                }
              </AlertDescription>
            </Alert>
          )}

          {/* Main content - only show if authenticated */}
          {isAuthenticated && (
            <>
              {/* Repository Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Select Repository</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetchRepos()}
                    disabled={isLoadingRepos}
                    data-testid="button-refresh-repos"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoadingRepos ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
                
                <Select value={selectedRepo} onValueChange={setSelectedRepo}>
                  <SelectTrigger data-testid="select-repository">
                    <SelectValue placeholder="Choose a repository to sync to..." />
                  </SelectTrigger>
                  <SelectContent>
                    {repositories.map((repo) => (
                      <SelectItem key={repo.full_name} value={repo.name}>
                        <div className="flex items-center justify-between w-full">
                          <span>{repo.name}</span>
                          {repo.private && (
                            <Badge variant="secondary" className="ml-2">
                              Private
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      data-testid="button-create-repo"
                    >
                      <Plus className="h-4 w-4" />
                      Create New Repository
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Repository</DialogTitle>
                      <DialogDescription>
                        Create a new GitHub repository to sync your app files
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="repoName">Repository Name</Label>
                        <Input
                          id="repoName"
                          value={newRepoName}
                          onChange={(e) => setNewRepoName(e.target.value)}
                          placeholder="clabs-margin-calculator"
                          data-testid="input-repo-name"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="private-repo"
                          checked={isPrivate}
                          onCheckedChange={setIsPrivate}
                          data-testid="switch-private-repo"
                        />
                        <Label htmlFor="private-repo">Private repository</Label>
                      </div>
                      
                      <Button 
                        onClick={handleCreateRepo}
                        disabled={createRepoMutation.isPending}
                        className="w-full"
                        data-testid="button-confirm-create"
                      >
                        {createRepoMutation.isPending ? "Creating..." : "Create Repository"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button 
                  onClick={handleSyncFiles}
                  disabled={!selectedRepo || syncFilesMutation.isPending}
                  className="flex items-center gap-2"
                  data-testid="button-sync-files"
                >
                  <Upload className="h-4 w-4" />
                  {syncFilesMutation.isPending ? "Syncing..." : "Sync Files to GitHub"}
                </Button>
              </div>

              {/* File List Info */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="text-sm font-medium mb-2">Files that will be synced:</div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div><strong>Frontend:</strong> React components, utilities, styles, and configuration</div>
                  <div><strong>Backend:</strong> Express routes, database schema, server configuration</div>
                  <div><strong>Config:</strong> TypeScript, Vite, Tailwind, and Drizzle configurations</div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Login Dialog */}
      <AuthLogin
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
}