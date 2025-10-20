# Worble (Discord Bot)

Backend API service for [Alias](https://github.com/amgvu/alias) - a Discord server nickname management platform. Worble serves as the privileged Discord bot layer, handling all Discord API operations that require bot authentication and permissions.

## Architecture Role

Worble is the **backend service layer** in a microservices architecture:

```
User → Alias Web App → Worble Bot API → Discord API
          ↓                    ↓              ↓
      Supabase ←───────────────┴──────────────┘
```

**Separation of Concerns:**

- **Web App (Alias)**: User authentication, UI, configuration storage
- **Bot Service (Worble)**: Discord operations, permission enforcement, API gateway
- **Database (Supabase)**: Shared persistence layer for both services

This architecture provides:

- **Security isolation** - Bot token never exposed to frontend
- **Permission enforcement** - Bot validates all Discord operations
- **Clean boundaries** - Each service has a single, clear responsibility

## What It Does

Worble provides three critical REST endpoints that enable the web application to interact with Discord:

### 1. Server Discovery (`POST /api/servers`)

Returns Discord servers where:

- User has `MANAGE_NICKNAMES` permission
- Bot is also present in the server
- User is authorized to manage members

**Example Response:**

```json
[
  {
    "id": "1234567890",
    "name": "My Discord Server",
    "icon": "a_xyz123",
    "iconURL": "https://cdn.discordapp.com/icons/...",
    "memberCount": 1250
  }
]
```

### 2. Member Listing (`GET /api/members/:guild_id`)

Returns all members the bot can manage, excluding:

- Server owner (cannot be modified)
- Members with higher roles than the bot
- Bot itself

**Includes:**

- User avatars, usernames, current nicknames
- Role assignments with colors and hierarchy
- Proper sorting by role position

### 3. Nickname Updates (`POST /api/changeNickname`)

Applies nickname changes with:

- Discord ID format validation
- Guild membership verification
- Permission checking
- Fallback to global name if nickname is empty

## Tech Stack

**Runtime & Framework:**

- **Node.js** with **TypeScript** for type safety
- **Express.js** for REST API routing
- **discord.js v14** for Discord bot functionality

**Infrastructure:**

- **Supabase client** for shared database access
- **CORS** configured for secure web app communication
- **dotenv** for environment configuration

**Development Tools:**

- **ts-node** for TypeScript execution
- **nodemon** for hot-reloading during development
- **TypeScript 5** with strict compilation

## Key Implementation Details

### Permission-Based Filtering

```typescript
// Only return servers where user can manage nicknames
if (member?.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
  mutualServers.push(serverData);
}
```

### Role Hierarchy Enforcement

```typescript
// Bot only manages members with lower role positions
members.filter(
  (member) =>
    member.user.id !== guild.ownerId &&
    member.roles.highest.position < botHighestRole.position
);
```

### Input Validation

```typescript
// Validate Discord snowflake ID format
if (!/^\d{17,19}$/.test(guild_id)) {
  res.status(400).json({ error: "Invalid guild ID format" });
  return;
}
```

### Animated Icon Detection

```typescript
// Detect animated guild icons and use proper file extension
const fileExtension = iconHash.startsWith("a_") ? ".gif" : ".png";
```

## Architecture Highlights

### Security Through Isolation

**Bot token is never exposed:**

- Web app uses user's Discord OAuth token for authentication
- Bot uses privileged bot token for server operations
- No credential sharing between layers

**Permission validation at multiple levels:**

1. Web app checks if user has appropriate permissions
2. Bot verifies permissions server-side before operations
3. Discord API enforces final permission layer

### Efficient Data Flow

**Read operations:**

- Web app calls bot API for server/member data
- Bot uses Discord.js cache when available
- Reduces Discord API rate limit consumption

**Write operations:**

- Web app stores nickname configurations in Supabase
- Bot reads configurations and applies them via Discord API
- Results written back to Supabase for consistency

### Error Handling Strategy

**HTTP status codes for different failure modes:**

- `400` - Invalid input format (malformed IDs)
- `401` - Authentication failure (invalid Discord token)
- `404` - Resource not found (guild/member doesn't exist)
- `500` - Internal errors (Discord API failures)

**Graceful degradation:**

```typescript
// Promise.allSettled ensures one server failure doesn't break entire request
await Promise.allSettled(
  userServers.map(async (userServer) => {
    try {
      // Process server
    } catch (error) {
      console.error(`Error processing server ${userServer.id}`);
      // Continue processing other servers
    }
  })
);
```

## Project Structure

```
src/
├── index.ts                # Bot client + Express server initialization
├── api/
│   ├── index.ts           # API route aggregation
│   ├── servers.ts         # Server discovery endpoint
│   ├── members.ts         # Member listing endpoint
│   └── changeNickname.ts  # Nickname modification endpoint
├── utils/
│   └── discord-icon.ts    # CDN URL generation utilities
└── types/
    └── types.ts           # TypeScript type definitions
```

## Development

```bash
# Install dependencies
npm install

# Run development server with hot-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run production build
npm start
```

## Environment Variables

```env
DISCORD_TOKEN=your_bot_token_here
DASHBOARD_URL=http://localhost:3000  # Web app URL for CORS
PORT=3000                             # API server port
```

## Discord Bot Setup

**Required Bot Permissions:**

- `GUILDS` - View server information
- `GUILD_MEMBERS` - Access member data

**Required Privileged Gateway Intents:**

- Server Members Intent (for fetching member lists)

**Invite URL Format:**

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_BOT_ID&permissions=134217728&scope=bot
```

## Technical Decisions

**Why Discord.js?**
Industry-standard library with comprehensive Discord API coverage, built-in caching, and excellent TypeScript support.

**Why Express over Next.js API routes?**
Dedicated service allows independent deployment, scaling, and manages bot lifecycle separately from web application.

**Why REST over WebSockets?**
Simpler architecture for current use case. Bot maintains WebSocket connection to Discord, exposes REST to web app.

**Why TypeScript?**
Type safety prevents runtime errors from Discord API changes. Strong typing for Discord objects reduces bugs.

## Integration with Alias Web App

**Authentication flow:**

1. User logs in via Discord OAuth on web app
2. Web app sends user's access token to bot API
3. Bot validates token and returns authorized servers

**Nickname management flow:**

1. User configures nicknames in web app (stored in Supabase)
2. User clicks "Apply" in web app
3. Web app sends nickname update request to bot API
4. Bot applies changes via Discord API
5. Bot writes operation results to Supabase
6. Web app reflects updated state

**Data consistency:**

- Bot is source of truth for current Discord state
- Supabase is source of truth for user configurations
- Web app orchestrates between both sources

## Production Considerations

**Current state:** Functional MVP with core features implemented

**Production enhancements needed:**

- Rate limit handling for Discord API (429 responses)
- Request queuing for bulk nickname operations
- Structured logging (Winston, Pino)
- Health check endpoint for monitoring
- Retry logic with exponential backoff
- API key authentication instead of relying on CORS alone

## License

Private repository - All rights reserved.
