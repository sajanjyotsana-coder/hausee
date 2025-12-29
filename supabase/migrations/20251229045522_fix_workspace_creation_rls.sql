/*
  # Fix Workspace Creation RLS Policy
  
  ## Problem
  The workspace creation policy was failing because:
  1. workspaces.created_by is UUID type
  2. workspace_members.user_id is TEXT type  
  3. The RLS policies were using inconsistent auth functions
  
  ## Solution
  Update the workspace creation policy to properly cast and compare UUIDs.
  Ensure workspace_members INSERT policy allows first-time workspace creation.
  
  ## Changes
  - Fix workspace creation policy to handle UUID comparison correctly
  - Update workspace_members policy to allow self-insertion for first workspace
*/

-- Drop and recreate the workspace creation policy with proper UUID handling
DROP POLICY IF EXISTS "Users can create workspaces" ON workspaces;

CREATE POLICY "Users can create workspaces"
  ON workspaces FOR INSERT
  TO authenticated
  WITH CHECK (created_by::text = (select auth.uid())::text);

-- Ensure workspace_members policy allows self-insertion
DROP POLICY IF EXISTS "Users can create workspace memberships" ON workspace_members;

CREATE POLICY "Users can create workspace memberships"
  ON workspace_members FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Allow if user is adding themselves (for first workspace)
    user_id = (select auth.uid())::text
    OR
    -- Allow if user is an owner adding someone else
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
      AND wm.user_id = (select auth.uid())::text
      AND wm.role = 'owner'
    )
  );
