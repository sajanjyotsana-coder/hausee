/*
  # Cleanup Duplicate and Conflicting Workspace Policies
  
  ## Problem
  Multiple INSERT policies exist on workspace_members table causing conflicts:
  - "Users can create workspace memberships" 
  - "Users can insert workspace members"
  
  Also, there's an auth function inconsistency across policies.
  
  ## Solution
  1. Remove all duplicate policies
  2. Create single, clear policies for each operation
  3. Ensure consistent use of auth.uid() across all workspace-related policies
  
  ## Changes
  - Drop all duplicate policies
  - Create clean, single policies for each operation
  - Use consistent auth.uid() casting
*/

-- ============================================================================
-- WORKSPACE_MEMBERS: Clean up all policies and recreate properly
-- ============================================================================

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Users can view their workspace memberships" ON workspace_members;
DROP POLICY IF EXISTS "Users can view workspace members" ON workspace_members;
DROP POLICY IF EXISTS "Users can create workspace memberships" ON workspace_members;
DROP POLICY IF EXISTS "Users can insert workspace members" ON workspace_members;
DROP POLICY IF EXISTS "Users can update workspace members" ON workspace_members;
DROP POLICY IF EXISTS "Users can delete workspace members" ON workspace_members;
DROP POLICY IF EXISTS "Users can manage workspace members" ON workspace_members;

-- Create clean policies with consistent auth.uid() usage
CREATE POLICY "workspace_members_select"
  ON workspace_members FOR SELECT
  TO authenticated
  USING (user_id = (auth.uid())::text);

CREATE POLICY "workspace_members_insert"
  ON workspace_members FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (auth.uid())::text
    OR EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
      AND wm.user_id = (auth.uid())::text
      AND wm.role = 'owner'
    )
  );

CREATE POLICY "workspace_members_update"
  ON workspace_members FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
      AND wm.user_id = (auth.uid())::text
      AND wm.role = 'owner'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
      AND wm.user_id = (auth.uid())::text
      AND wm.role = 'owner'
    )
  );

CREATE POLICY "workspace_members_delete"
  ON workspace_members FOR DELETE
  TO authenticated
  USING (
    user_id = (auth.uid())::text
    OR EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
      AND wm.user_id = (auth.uid())::text
      AND wm.role = 'owner'
    )
  );

-- ============================================================================
-- WORKSPACES: Update to use consistent auth.uid()
-- ============================================================================

DROP POLICY IF EXISTS "Users can view workspaces" ON workspaces;
DROP POLICY IF EXISTS "Users can update workspaces" ON workspaces;
DROP POLICY IF EXISTS "Users can delete workspaces" ON workspaces;

CREATE POLICY "workspaces_select"
  ON workspaces FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id = (auth.uid())::text
    )
  );

CREATE POLICY "workspaces_update"
  ON workspaces FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id = (auth.uid())::text
      AND workspace_members.role = 'owner'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id = (auth.uid())::text
      AND workspace_members.role = 'owner'
    )
  );

CREATE POLICY "workspaces_delete"
  ON workspaces FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id = (auth.uid())::text
      AND workspace_members.role = 'owner'
    )
  );

-- ============================================================================
-- HOMES: Update to use consistent auth.uid()
-- ============================================================================

DROP POLICY IF EXISTS "Users can view homes in their workspaces" ON homes;
DROP POLICY IF EXISTS "Users can insert homes in their workspaces" ON homes;
DROP POLICY IF EXISTS "Users can update homes in their workspaces" ON homes;
DROP POLICY IF EXISTS "Users can delete homes in their workspaces" ON homes;

CREATE POLICY "homes_select"
  ON homes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = homes.workspace_id
      AND workspace_members.user_id = (auth.uid())::text
    )
  );

CREATE POLICY "homes_insert"
  ON homes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = homes.workspace_id
      AND workspace_members.user_id = (auth.uid())::text
    )
  );

CREATE POLICY "homes_update"
  ON homes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = homes.workspace_id
      AND workspace_members.user_id = (auth.uid())::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = homes.workspace_id
      AND workspace_members.user_id = (auth.uid())::text
    )
  );

CREATE POLICY "homes_delete"
  ON homes FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = homes.workspace_id
      AND workspace_members.user_id = (auth.uid())::text
    )
  );
