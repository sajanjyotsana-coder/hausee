/*
  # Create Storage Buckets for Evaluation Media

  ## Summary
  Creates storage buckets for evaluation photos and voice notes with appropriate
  security policies for authenticated users.

  ## Changes Made

  ### 1. Storage Buckets
  **evaluation-photos bucket:**
  - Stores photos uploaded during home evaluations
  - Public access for reading
  - Authenticated users can upload/update/delete their own files
  - Max file size: 5MB per photo

  **evaluation-voice-notes bucket:**
  - Stores voice notes recorded during home evaluations
  - Public access for reading
  - Authenticated users can upload/update/delete their own files
  - Max file size: 10MB per voice note

  ### 2. Storage Policies
  **For evaluation-photos:**
  - SELECT: Public read access
  - INSERT: Authenticated users only
  - UPDATE: Authenticated users can update their own files
  - DELETE: Authenticated users can delete their own files

  **For evaluation-voice-notes:**
  - Same policy structure as photos

  ## Security Notes
  - All uploads require authentication
  - Users can only manage their own files (paths include user_id)
  - File size limits prevent abuse
  - Public read allows display without auth complexity

  ## File Path Structure
  - Photos: `{user_id}/{evaluation_id}/{section_id}/{filename}`
  - Voice Notes: `{user_id}/{evaluation_id}/{section_id}/{filename}`
*/

-- ============================================================================
-- 1. CREATE STORAGE BUCKETS
-- ============================================================================

-- Create bucket for evaluation photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'evaluation-photos',
  'evaluation-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
ON CONFLICT (id) DO NOTHING;

-- Create bucket for evaluation voice notes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'evaluation-voice-notes',
  'evaluation-voice-notes',
  true,
  10485760,
  ARRAY['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/m4a']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. CREATE STORAGE POLICIES FOR PHOTOS
-- ============================================================================

-- Allow public read access to photos
CREATE POLICY "Public read access for evaluation photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'evaluation-photos');

-- Allow authenticated users to upload photos
CREATE POLICY "Authenticated users can upload photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'evaluation-photos' AND
    (storage.foldername(name))[1] = (auth.uid())::text
  );

-- Allow users to update their own photos
CREATE POLICY "Users can update their own photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'evaluation-photos' AND
    (storage.foldername(name))[1] = (auth.uid())::text
  );

-- Allow users to delete their own photos
CREATE POLICY "Users can delete their own photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'evaluation-photos' AND
    (storage.foldername(name))[1] = (auth.uid())::text
  );

-- ============================================================================
-- 3. CREATE STORAGE POLICIES FOR VOICE NOTES
-- ============================================================================

-- Allow public read access to voice notes
CREATE POLICY "Public read access for evaluation voice notes"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'evaluation-voice-notes');

-- Allow authenticated users to upload voice notes
CREATE POLICY "Authenticated users can upload voice notes"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'evaluation-voice-notes' AND
    (storage.foldername(name))[1] = (auth.uid())::text
  );

-- Allow users to update their own voice notes
CREATE POLICY "Users can update their own voice notes"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'evaluation-voice-notes' AND
    (storage.foldername(name))[1] = (auth.uid())::text
  );

-- Allow users to delete their own voice notes
CREATE POLICY "Users can delete their own voice notes"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'evaluation-voice-notes' AND
    (storage.foldername(name))[1] = (auth.uid())::text
  );