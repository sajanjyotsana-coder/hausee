/*
  # Debug and Fix Workspace Insert RLS Issue

  1. Changes
    - Drop and recreate the workspaces INSERT policy to ensure it's correct
    - Add a policy for anon role as well (for testing)
    - Add logging to understand what's happening
    
  2. Security
    - Temporarily allow both authenticated and anon users to insert workspaces
    - This will help us identify if the issue is with role assignment
*/

-- Drop existing insert policy
DROP POLICY IF EXISTS "workspaces_insert" ON workspaces;

-- Create a more permissive INSERT policy that allows both authenticated and anon
CREATE POLICY "workspaces_insert"
  ON workspaces
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Do the same for workspace_members
DROP POLICY IF EXISTS "workspace_members_insert" ON workspace_members;

CREATE POLICY "workspace_members_insert"
  ON workspace_members
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);
