# No JS Chat

> [!TIP]
> **You can try it now at [chat.sexnine.xyz](https://chat.sexnine.xyz/)**

A modern looking real-time chat app with ZERO JavaScript.

Built with:
- [Hono](https://github.com/honojs/hono)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

This is a really dumb project, this shouln't be used for anything serious.
I just wanted to challenge myself to build as interactive and real-time of an app that I can without using JavaScript.

This project makes use of a bit of hacky browser behaviour and modern CSS, you're likely to experience some issues in
an older or niche browser.

## Features and TODOs

- [x] Receive messages
  - [x] Receive messages in real-time
  - [x] Message history
    - [ ] Message history that persists across server restarts
    - [ ] Ability to load older messages on-demand
- [x] Send messages
  - [ ] Send messages with markdown
  - [ ] Send images (🔽 maybe)
  - [ ] Send files (🔽 maybe)
  - [ ] Ability to mention a user
- [x] Rooms
  - [x] Be in multiple rooms at once
  - [x] Join/create a room
  - [ ] Leave a room (🔼 priority)
  - [ ] Invite a user to a room
    - This will facilitate an alternative to direct messages
- [x] Member list
  - [x] Shows online members
  - [x] Member list shows across all rooms
    - For example, if user A is in both room #foo and #bar, they will appear in both lists regardless of which room
      they currently have open
  - [ ] Shows offline members (maybe)
- [x] Sessions
  - [ ] Change nickname
    - [ ] Announce nickname changes
    - [ ] Alter messages to show new nickname (🔽 maybe)
  - [x] Reserving nicknames
    - Nicknames will be reserved for a period of time, after which, they can be used by someone else
    - [ ] Reserve nicknames for longer with an account (⏬ unlikely)
  - [ ] Prompt user to use old nickname and rooms when session expired
  - [ ] Share session with multiple devices
    - [ ] Share via link
    - [ ] Share via QR code
    - [ ] Share via code (🔽 maybe)
