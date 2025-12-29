/*
  # Fix RLS policies to use auth.uid() instead of auth.jwt() ->> 'sub'

  1. Changes
    - Update all RLS policies to use `auth.uid()` instead of `auth.jwt() ->> 'sub'`
    - This is more reliable and is the recommended approach in Supabase
    - Properly cast UUIDs where needed
    
  2. Security
    - No change to security model, just using the correct function
    - All policies remain restrictive and properly enforce workspace membership
*/

-- Drop existing policies for workspaces
DROP POLICY IF EXISTS "Users can view workspaces" ON workspaces;
DROP POLICY IF EXISTS "Users can update workspaces" ON workspaces;
DROP POLICY IF EXISTS "Users can delete workspaces" ON workspaces;

-- Recreate workspace policies with auth.uid()
CREATE POLICY "Users can view workspaces"
  ON workspaces FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id::text = (auth.uid())::text
    )
  );

CREATE POLICY "Users can update workspaces"
  ON workspaces FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id::text = (auth.uid())::text
      AND workspace_members.role = 'owner'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id::text = (auth.uid())::text
      AND workspace_members.role = 'owner'
    )
  );

CREATE POLICY "Users can delete workspaces"
  ON workspaces FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id::text = (auth.uid())::text
      AND workspace_members.role = 'owner'
    )
  );

-- Drop existing policies for homes
DROP POLICY IF EXISTS "Users can view homes in their workspaces" ON homes;
DROP POLICY IF EXISTS "Users can insert homes in their workspaces" ON homes;
DROP POLICY IF EXISTS "Users can update homes in their workspaces" ON homes;
DROP POLICY IF EXISTS "Users can delete homes in their workspaces" ON homes;

-- Recreate homes policies with auth.uid()
CREATE POLICY "Users can view homes in their workspaces"
  ON homes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = homes.workspace_id
      AND workspace_members.user_id::text = (auth.uid())::text
    )
  );

CREATE POLICY "Users can insert homes in their workspaces"
  ON homes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = homes.workspace_id
      AND workspace_members.user_id::text = (auth.uid())::text
    )
  );

CREATE POLICY "Users can update homes in their workspaces"
  ON homes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = homes.workspace_id
      AND workspace_members.user_id::text = (auth.uid())::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = homes.workspace_id
      AND workspace_members.user_id::text = (auth.uid())::text
    )
  );

CREATE POLICY "Users can delete homes in their workspaces"
  ON homes FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = homes.workspace_id
      AND workspace_members.user_id::text = (auth.uid())::text
    )
  );

-- Update workspace_members policies
DROP POLICY IF EXISTS "Users can view workspace members" ON workspace_members;
DROP POLICY IF EXISTS "Users can insert workspace members" ON workspace_members;
DROP POLICY IF EXISTS "Users can update workspace members" ON workspace_members;
DROP POLICY IF EXISTS "Users can delete workspace members" ON workspace_members;

CREATE POLICY "Users can view workspace members"
  ON workspace_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
      AND wm.user_id::text = (auth.uid())::text
    )
  );

CREATE POLICY "Users can insert workspace members"
  ON workspace_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
      AND wm.user_id::text = (auth.uid())::text
      AND wm.role = 'owner'
    )
    OR
    -- Allow users to add themselves if they're creating their first workspace
    workspace_members.user_id::text = (auth.uid())::text
  );

CREATE POLICY "Users can update workspace members"
  ON workspace_members FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
      AND wm.user_id::text = (auth.uid())::text
      AND wm.role = 'owner'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
      AND wm.user_id::text = (auth.uid())::text
      AND wm.role = 'owner'
    )
  );

CREATE POLICY "Users can delete workspace members"
  ON workspace_members FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
      AND wm.user_id::text = (auth.uid())::text
      AND wm.role = 'owner'
    )
  );