/*
  # Fix Workspace INSERT RLS Policy
  
  ## Problem
  Users are getting "new row violates row-level security policy" when creating workspaces.
  The current policy (created_by = auth.uid()) should work but may not be properly checking.
  
  ## Root Cause
  - workspaces.created_by is UUID type
  - auth.uid() returns UUID type
  - Policy should allow INSERT when created_by matches the authenticated user's ID
  
  ## Solution
  Drop and recreate the INSERT policy to ensure it's properly configured.
  
  ## Changes
  - Drop existing INSERT policy
  - Create new policy that explicitly allows authenticated users to create workspaces they own
*/

-- Drop existing INSERT policies
DROP POLICY IF EXISTS "workspaces_insert" ON workspaces;
DROP POLICY IF EXISTS "Users can create workspaces" ON workspaces;

-- Create INSERT policy
-- Allow authenticated users to insert workspaces where they are the creator
CREATE POLICY "workspaces_insert"
  ON workspaces FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());
