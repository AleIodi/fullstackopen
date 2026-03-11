sequenceDiagram
    participant browser
    participant server

    Note right of browser: User writes a note and clicks Save
    Note right of browser: Browser JS prevents the default form submit action
    Note right of browser: Browser JS creates a new note, pushes it to the local array, and rerenders the note list on the UI

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note left of server: Server parses the JSON payload and saves the new note to the server array
    server-->>browser: HTTP 201 Created
    deactivate server
    
    Note right of browser: No further HTTP requests or page reloads occur
