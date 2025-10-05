# Supabase Database Schema - Prompt Vault

## Tables

### 1. `users`
Extends Supabase Auth users with additional profile data.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  subscription_tier TEXT NOT NULL DEFAULT 'free', -- 'free' | 'pro'
  subscription_status TEXT DEFAULT 'active', -- 'active' | 'cancelled' | 'expired'
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

### 2. `folders`
Hierarchical folder structure for organizing prompts.

```sql
CREATE TABLE folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT, -- optional icon name/identifier for UI
  position INTEGER DEFAULT 0, -- for custom ordering
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_folders_user_id ON folders(user_id);
CREATE INDEX idx_folders_parent ON folders(parent_folder_id);

-- RLS Policies
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own folders"
  ON folders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own folders"
  ON folders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own folders"
  ON folders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own folders"
  ON folders FOR DELETE
  USING (auth.uid() = user_id);
```

### 3. `prompts`
Stores encrypted prompt data.

```sql
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,

  -- Encrypted fields (encrypted client-side before storage)
  title_encrypted TEXT NOT NULL, -- encrypted title
  description_encrypted TEXT, -- encrypted description
  content_encrypted TEXT NOT NULL, -- encrypted prompt content

  -- Non-sensitive metadata (not encrypted)
  is_favorite BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[] DEFAULT '{}', -- array of tag strings

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_prompts_user_id ON prompts(user_id);
CREATE INDEX idx_prompts_folder_id ON prompts(folder_id);
CREATE INDEX idx_prompts_favorite ON prompts(user_id, is_favorite);
CREATE INDEX idx_prompts_tags ON prompts USING GIN(tags);

-- RLS Policies
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own prompts"
  ON prompts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own prompts"
  ON prompts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prompts"
  ON prompts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own prompts"
  ON prompts FOR DELETE
  USING (auth.uid() = user_id);
```

### 4. `prompt_usage_history`
Tracks prompt usage across different AI platforms (for Pro users).

```sql
CREATE TABLE prompt_usage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- 'chatgpt' | 'claude' | 'gemini' | 'grok'
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_usage_history_user ON prompt_usage_history(user_id, used_at DESC);
CREATE INDEX idx_usage_history_prompt ON prompt_usage_history(prompt_id);
CREATE INDEX idx_usage_history_platform ON prompt_usage_history(user_id, platform, used_at DESC);

-- RLS Policies
ALTER TABLE prompt_usage_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage history"
  ON prompt_usage_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own usage history"
  ON prompt_usage_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### 5. `user_settings`
User preferences and configuration.

```sql
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'system', -- 'light' | 'dark' | 'system'
  auto_logout_minutes INTEGER DEFAULT 30,
  keyboard_shortcut_panel TEXT DEFAULT 'Alt+P',
  date_format TEXT DEFAULT 'YYYY-MM-DD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  USING (auth.uid() = user_id);
```

## Database Functions

### Check Free Tier Limits

```sql
-- Function to check if user can create more prompts
CREATE OR REPLACE FUNCTION can_create_prompt(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_tier TEXT;
  v_count INTEGER;
BEGIN
  SELECT subscription_tier INTO v_tier FROM users WHERE id = p_user_id;

  IF v_tier = 'pro' THEN
    RETURN TRUE;
  END IF;

  SELECT COUNT(*) INTO v_count FROM prompts WHERE user_id = p_user_id;

  RETURN v_count < 50; -- Free tier limit
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can create more folders
CREATE OR REPLACE FUNCTION can_create_folder(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_tier TEXT;
  v_count INTEGER;
BEGIN
  SELECT subscription_tier INTO v_tier FROM users WHERE id = p_user_id;

  IF v_tier = 'pro' THEN
    RETURN TRUE;
  END IF;

  SELECT COUNT(*) INTO v_count FROM folders WHERE user_id = p_user_id;

  RETURN v_count < 5; -- Free tier limit
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Auto-update timestamps

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_folders_updated_at BEFORE UPDATE ON folders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prompts_updated_at BEFORE UPDATE ON prompts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Encryption Strategy

**Client-Side Encryption (Zero-Knowledge)**:
- All sensitive data (titles, descriptions, prompt content) is encrypted on the client before being sent to Supabase
- Encryption key is derived from user's password (never stored on server)
- Use AES-256 encryption via crypto-js library
- Server only stores encrypted blobs - cannot decrypt data

**Fields that are encrypted**:
- `prompts.title_encrypted`
- `prompts.description_encrypted`
- `prompts.content_encrypted`

**Fields that are NOT encrypted** (needed for querying/filtering):
- User metadata (email, subscription info)
- Folder structure and names
- Tags (for search functionality)
- Usage statistics
- Timestamps
- Favorite flags

## Migration Notes

1. Create tables in order: `users` → `folders` → `prompts` → `prompt_usage_history` → `user_settings`
2. Enable RLS on all tables
3. Create indexes for performance
4. Set up triggers for auto-updating timestamps
5. Create limit-checking functions for free tier enforcement

## Free vs Pro Tier Enforcement

**Free Tier Limits** (enforced via database functions):
- Maximum 50 prompts (checked in `can_create_prompt()`)
- Maximum 5 folders (checked in `can_create_folder()`)
- No cross-device sync (enforced in app logic, not database)

**Pro Tier Benefits**:
- Unlimited prompts and folders
- Usage history tracking enabled
- Advanced statistics
- Cross-device sync
