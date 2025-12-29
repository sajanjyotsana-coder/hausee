/*
  # Fix Workspace INSERT Policy
  
  ## Problem
  The workspaces table is missing an INSERT policy, preventing users from creating workspaces.
  
  ## Solution
  Add an INSERT policy that allows authenticated users to create workspaces where they are the creator.
  
  ## Changes
  - Add INSERT policy for workspaces table
*/

-- Drop any existing INSERT policy first
DROP POLICY IF EXISTS "workspaces_insert" ON workspaces;
DROP POLICY IF EXISTS "Users can create workspaces" ON workspaces;

-- Create INSERT policy for workspaces
CREATE POLICY "workspaces_insert"
  ON workspaces FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());
