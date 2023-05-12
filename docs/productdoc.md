# 'TIC TAC TOE' - Documentation
During the [Real-Time Web](https://github.com/cmda-minor-web/real-time-web-2223) course, we were asked to build a real-time application.

**Goals of this course:**

-   _deal with real-time complexity;_
-   _handle real-time client-server interaction;_
-   _handle real-rime data management;_
-   _handle multi-user support._

## Concept
I would like my Real-Time application to have the following features:
- Users must be able to choose their own username
- Users must be able to create a room
- Users must be able to join a room
- Users must be able to chat with other users
- Users must be able to play a game of Tic Tac Toe
    - System must be able to only allow Tic Tac Toe to be played when there are min. two players in a room
    - System must be able to randomly select two players from a room
    - Users must be able to see the game board and the current player (even if they join the game later)
    - Users (that play) must be able to place a marker on the game board, other users can't place a marker
    - Users must be able to see who won the game
    - Users must be able to restart the game
> A data life cycle refers to (a visual representation of) the different stages involved in the transfer of data over a network socket.

The life cycle of this application starts at the homescreen, where users have the option to either create a new room or join an existing one. This user data is exchanged between the client and server through a fetch to `/user/:esi`. When trying to join a room with a username that's already present in the room, the server will send back an error message.

Upon room join, a loader will be shown, then the room. The room will show the current players in the room, the chat and the start game button. When the room contains 2 or more users, the start button can be clicked and 2 players from the chat will randomly get selected. These 2 players will be able to play a game of Tic Tac Toe. The other users will be able to spectate the game. When the game is over, everyone will be able to clear the game and start a new one.

